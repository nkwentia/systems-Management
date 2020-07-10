'use strict';

function GroupsCtrl($scope, model, Groups, Students, Forms, Lang) {
    
    $scope.newGroup = new model.Group();
    
    $scope.groups = Groups.getAll();
    $scope.forms = Forms.all();
    $scope.dict = Lang.getDict();
    $scope.validationError = false;

    $scope.add = function(group){
    	if(model.isValid(group)){
            group.save().then(function(success){
                console.log("Success: saved group", success);
                $scope.groups[group._id] = group;
                $scope.allStudents[group._id] = [];
                $scope.newGroup = new model.Group();
                $scope.validationError = false;
            }).catch(function(error){
                //handle duplicate dept code
                if(error.name === "conflict"){
                    $scope.validationError = true;
                    $scope.newGroup = new model.Group();
                    $scope.newGroup.name = group.name;
                }
                console.log("Error: unable to save group", error);
            });
    	} else {
            
            console.log("Model not valid", group);
        }
    };

    $scope.remove = function(group){
    	Groups.remove(group);
    };

    $scope.allStudents = {};
    Students.getAll().then(function(students){
        angular.forEach($scope.groups, function(group, groupId){
          $scope.allStudents[groupId] = [];
        });
        angular.forEach(students, function(student, studentId){
          $scope.allStudents[student.groupId].push(student);
        });
      console.log("Got all students: ", $scope.allStudents);
    }).catch(function(error){
      console.log("Failed to get all students, ", error);
    });

}

GroupsCtrl.$inject = ['$scope', 'model', 'Groups', 'Students', 'Forms', 'Lang'];
angular.module('SchoolMan').controller('GroupsCtrl', GroupsCtrl);