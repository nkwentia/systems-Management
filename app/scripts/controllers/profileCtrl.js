'use strict';

function ProfileCtrl($scope, $routeParams, $q, $modal, model, profile, Users, Students, Forms, Groups, Departments, Lang, Marksheets, Dcards, Transcripts, Payments) {

  $scope.accessCode = $routeParams.accessCode;
  $scope.showValidation = false;

  $scope.Users = Users;
  $scope.username = $routeParams.username;
  $scope.dict = Lang.getDict();
  $scope.lang = $routeParams.lang ? $routeParams.lang : Lang.defaultLang;

  var reports = {};
  var classCouncils = {};


  var studentId = $routeParams.studentId === "0" ? "student_U0000001" : $routeParams.studentId;
  // console.log("routeParams", $routeParams);

  var data = $scope.data = {
    student:undefined,
    forms:Forms.all(),
    departments:Departments.getAll(),
    groups:Groups.getAll(),
  };

  Students.get(studentId).then(function(student){
    console.log("Found student:", student);
    $scope.data.student = student;

    // This is for reverting data.student if user starts to edit and chooses to cancel
    var studentCopy = angular.copy($scope.data.student);
    $scope.editing = false;
    $scope.edit = function(){
      $scope.editing = true;
    }
    $scope.cancel = function(){
      $scope.data.student = angular.copy(studentCopy);
      Students.set($scope.data.student);
      $scope.editing = false;
    }

  }).catch(function(error){
    console.log("profileCtrl Error: ",error);
  })

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

  $scope.openDeleteModal = function () {

    var modalInstance = $modal.open({
      templateUrl: 'deleteStudentModal.html',
      controller: ModalInstanceFunction
      });

    modalInstance.result.then(function () {
    }, function () {
      console.log('Modal dismissed at: ' + new Date());
    });
    return modalInstance;
  };
  

  var deleteStudent = function(){
    var student = $scope.data.student;
    Marksheets.removeFromMarksheets([student], {formIndex:student.formIndex, deptId:student.deptId, groupId:student.groupId});
    Transcripts.removeTranscripts(student._id);
    
    profile.getComments(studentId).then(function(comments){
      angular.forEach(comments, function(comment, commentId){
        profile.removeComment(comment);
      })
    });

    Dcards.get(studentId).then(function(dcard){
      Dcards.remove(dcard);
    }).catch(function(error){
      console.log("Failed to get dcard", studentId);
    }) 
    
    Payments.query({studentId:student._id}).then(function(payments){
      Payments.removePayments(payments);
    }).catch(function(error){
      console.log("Failed to get payments", error);
    })

    Students.remove(student).then(function(success){
      console.log("Student removed");
    });
  };

  var ModalInstanceFunction = function ($scope, $modalInstance, Lang, Location){
    $scope.dict = Lang.getDict();
    $scope.remove = function () {
      deleteStudent();
      $modalInstance.close();
      Location.open({page:'students'});
    }
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }
  ModalInstanceFunction.$inject = ['$scope', '$modalInstance', 'Lang', 'Location'];
}
ProfileCtrl.$inject = ['$scope', '$routeParams', '$q', '$modal', 'model', 'profile', 'Users', 'Students', 'Forms', 'Groups', 'Departments', 'Lang', 'Marksheets', 'Dcards', 'Transcripts', 'Payments'];
angular.module('SchoolMan').controller('ProfileCtrl', ProfileCtrl);