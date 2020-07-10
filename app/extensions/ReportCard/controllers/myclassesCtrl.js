'use strict';

function MyclassesCtrl($scope, $routeParams, model, Users, Forms, Groups, Departments, Marksheets, Location, Subjects, TimeTable, Lang) {

	// TimeTable returns courseRefs, CourseCatalog returns actual courses
  $scope.open = Location.open;
  var allParams = [$routeParams.formIndex,
                  $routeParams.deptId,
                  $routeParams.groupId,
                  $routeParams.subjectId];
  $scope.allSelected = allParams.indexOf("undefined") === -1;

  $scope.page = $routeParams.page;
  $scope.formIndex = $routeParams.formIndex;
  $scope.dict = Lang.getDict();
  $scope.lang = $routeParams.lang ? $routeParams.lang : Lang.defaultLang;

  $scope.data = {
    forms:Forms.all(),
    departments:Departments.getAll(),
    groups:Groups.getAll(),
    subjects : Subjects.getAll(),
    marksheets:[],
    assignedTeacher:null
  };

  $scope.Users = Users;

  // Load all classes assigned to the logged in user
  Marksheets.query({teacherId:$routeParams.username}).then(function(marksheets){
    console.log("myclasses Marksheets", marksheets);
    $scope.data.marksheets = marksheets;
  }).catch(function(error){
    console.log("Error:", error);
  });

  // If a teacher is already assigned to the selected class, load the teacher
  var marksheetId = model.Marksheet.generateID($routeParams);
  Marksheets.query({_id:marksheetId}).then(function(marksheets){
    var marksheet = marksheets[0];
    if(marksheet){
      $scope.data.assignedTeacher = Users.get(marksheet.teacherId); 
    } else {
      $scope.data.assignedTeacher = null;
    }
  });

  console.log("MyClasses routeParams", $routeParams);
  $scope.username = $routeParams.username;

  // $scope.getStudentsByCourse = Registrar.getStudentsByCourse;

  // Lookup if preexisting teacher
  var getTeacher = function(marksheetId){
      var bookmark = TimeTable.getTeacher(marksheetId);
      return (bookmark && Users.get(bookmark.username)) ? Users.get(bookmark.username) : null;
    };
  $scope.teacher = getTeacher(marksheetId);


  // private method
  var refreshCourseList = function(){
    // Update in-scope courses and apply to update view
    var courses = CourseCatalog.getCoursesByRef(
      TimeTable.getCourseRefs($routeParams.username)
    );

    $scope.courses = courses;
  }

  // Expects
  // { teacherId:username,
  //   marksheetId:marksheetId }
  $scope.removeMarksheet = function(marksheet){
    console.log("removing marksheet", marksheet);
    // marksheet.teacherId = null;
    Marksheets.remove(marksheet).then(function(success){
      $scope.data.marksheets = $scope.data.marksheets.filter(function(m){
        return m._id !== marksheet._id;
      });
      console.log("Removed marksheet", $scope.data.marksheets);
    });
  }

  $scope.getNumberOfStudents = function(marksheet){
    return Object.keys(marksheet.table).length;
  }

   


  // START: myclasses

  /**
   * @ngdoc controller
   * @name Schoolman.controller:MainCtrl#addCourse
   * @methodOf SchoolMan.controller:MainCtrl
   * @param {bookmark} The bookmark includes the teacherId and courseId
   * @description
   *
   * ## Global Utilities
   *
   * This module houses utillities that can be used
   * across the app. There are some pretty cool and
   * uncool methods in this module so check it outizzle.
   *
   * Note, if you do not define the module using @doc module
   * and the @name with the module id, then this page won't exist!!
   */
  $scope.addBookmark = function(){
    Marksheets.createOrUpdate(marksheetId, $routeParams.username)
    .then(function(marksheet){
      $scope.data.marksheets.push(marksheet);
      $scope.data.assignedTeacher = Users.get($routeParams.username);
      console.log("Saved myclass: ", marksheet, $scope.data);
    }).catch(function(error){
      console.log("Failed to save myclass: ", error);
    });
  };

  
}
MyclassesCtrl.$inject = ['$scope', '$routeParams', 'model', 'Users', 'Forms', 'Groups', 'Departments', 'Marksheets', 'Location', 'Subjects', 'TimeTable', 'Lang'];
angular.module('SchoolMan.ReportCard').controller('MyclassesCtrl', MyclassesCtrl);