'use strict';

function IDcardCtrl($scope, $routeParams, model, Users, Students, Departments, Groups, Forms, Location, SchoolInfos, Lang) {
  $scope.open = Location.open;
  $scope.pageTitleEnglish = "SCHOOL IDENTITY CARD";
  $scope.pageTitleFrench = "CARTE D'IDENTITÉ";
  // $scope.pageTitleFrench = "CARTE D'IDENTITE";
  $scope.regions = model.SchoolInfo.regions;
  $scope.dict = Lang.getDict();
  $scope.lang = $routeParams.lang ? $routeParams.lang : Lang.defaultLang;

  $scope.Users = Users;
  $scope.studentId = $routeParams.studentId;

  $scope.data = {};
  $scope.data.forms = Forms.all();
  $scope.data.departments = Departments.getAll();
  $scope.data.groups = Groups.getAll();
  $scope.data.students = [];
  $scope.data.student;
  $scope.data.currentDate = new Date();
  $scope.data.sides = ["front","back"];
  $scope.data.side = 0;
  // $scope.ClassMaster = ClassMaster;

  SchoolInfos.get("schoolinfo").then(function(info){
    $scope.data.schoolInfo = info;

    Students.query({formIndex:$routeParams.formIndex, deptId:$routeParams.deptId, groupId:$routeParams.groupId})
        .then(function(students){
      $scope.data.students = students;
      var studentDict = _.reduce(students, function(dict, student){
        dict[student._id] = student;
        return dict
      },{});

      $scope.data.student = studentDict.hasOwnProperty($scope.studentId) ? 
                            studentDict[$scope.studentId] :
                            students[0];
    }).catch(function(error){
      console.log("failed to get students")
    });

  }).catch(function(error){
    console.log("failed to get school info", error);
  });
}
IDcardCtrl.$inject = ['$scope', '$routeParams', 'model', 'Users', 'Students', 'Departments', 'Groups', 'Forms', 'Location', 'SchoolInfos', 'Lang'];
angular.module('SchoolMan.IDCard').controller('IDcardCtrl', IDcardCtrl);
