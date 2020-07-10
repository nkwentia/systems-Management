'use strict';

function ClassmasterProfileCtrl($scope, $routeParams, $q, PROMOTE_OPTIONS, model, profile, Dcards, Users, Marksheets, ClassCouncils, Students, Forms, Groups, Departments, Lang) {

  $scope.PROMOTE_OPTIONS = PROMOTE_OPTIONS;

  $scope.accessCode = $routeParams.accessCode;

  $scope.Users = Users;
  $scope.username = $routeParams.username;
  $scope.dict = Lang.getDict();
  $scope.lang = $routeParams.lang ? $routeParams.lang : Lang.defaultLang;

  var reports = {};
  var classCouncils = {};


  var studentId = $routeParams.studentId === "0" ? "student_U0000001" : $routeParams.studentId;
  console.log("routeParams", $routeParams);

  var data = $scope.data = {
    comments:{},
    student:undefined,
    dcard:undefined,
    // forms:Forms.all(),
    // departments:Departments.getAll(),
    // groups:Groups.getAll(),
  };

  var setPassing = function(student, studentsClass){
    var studentAverage = 0;
    if(reports[studentsClass].total.summary){
      studentAverage = reports[studentsClass].total.summary['table'][student._id][0];
    }
    student.passing = studentAverage >= classCouncils[studentsClass].passingScore;   
  };

  Students.get(studentId).then(function(student){
    console.log("Found student:", student);
    $scope.data.student = student;
    $scope.newComment = new model.Comment($routeParams.username,  $scope.data.student._id);

    $scope.data.student.passing = false;
    var studentsClass = [student.formIndex, student.deptId, student.groupId];
        
    if(reports.hasOwnProperty(studentsClass) &&  
      classCouncils.hasOwnProperty(studentsClass)){

      setPassing($scope.data.student, studentsClass);

    } else {
      var reportquery = {
        reports: Marksheets.getReports({
          formIndex:student.formIndex,
          deptId:student.deptId,
          groupId:student.groupId
        })
      }
      var councilquery = {
        classcouncil: ClassCouncils.get(model.ClassCouncil.generateID({
          formIndex:student.formIndex,
          deptId:student.deptId,
          groupId:student.groupId
        }))
      }

      // Get reports and classCouncils
      $q.all(councilquery).then(function(data){
        console.log("all promises: ", data);
        classCouncils[studentsClass] = data.classcouncil;
      }).catch(function(error){
        if(!classCouncils[studentsClass]){
          classCouncils[studentsClass] = new model.ClassCouncil();
        }
        // console.log("Failed to load classCouncils:", error);
      });
      $q.all(reportquery).then(function(data){
        console.log("all promises: ", data);
        reports[studentsClass] = data.reports;
        setPassing($scope.data.student, studentsClass);
      }).catch(function(error){
          // console.log("Failed to load reports", error);
      });
    }

  }).catch(function(error){
    console.log("profileCtrl Error: ",error);
  })

  Dcards.get(studentId).then(function(dcard){
    $scope.data.dcard = dcard;
  }).catch(function(error){
    console.log("Failed to get dcard", error);
  });

  profile.getComments(studentId).then(function(comments){
    $scope.data.comments = comments;
  }); 
  

  $scope.addComment = function(){
    $scope.newComment.save().then(function(success){
      $scope.data.comments[success.id] = $scope.newComment;
      $scope.newComment = new model.Comment($routeParams.username, $scope.data.student._id);
    });     
  };

  $scope.removeComment = function(commentIndex){
    var comment = $scope.data.comments[commentIndex];
    profile.removeComment(comment).then(function(success){
      delete $scope.data.comments[commentIndex];
    });
  }

  $scope.save = function(model){
    model.save().then(function(success){
      console.log("Model saved", success);
      $scope.editing = false;
      $scope.showValidation = false;
    }).catch(function(error){
      $scope.showValidation = true;
      console.log("Failed to save model", error);
    });
  };
}
ClassmasterProfileCtrl.$inject = ['$scope', '$routeParams', '$q', 'PROMOTE_OPTIONS', 'model', 'profile', 'Dcards', 'Users', 'Marksheets', 'ClassCouncils', 'Students', 'Forms', 'Groups', 'Departments', 'Lang'];
angular.module('SchoolMan.ReportCard').controller('ClassmasterProfileCtrl', ClassmasterProfileCtrl);