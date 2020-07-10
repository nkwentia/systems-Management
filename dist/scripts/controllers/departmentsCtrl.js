'use strict';
/**
 * @ngdoc controller
 * @name SchoolMan.controller:Departments
 * @method {function} add
 * @method {function} remove
 * @method {function} toggleForm
 * @description Departments view controller
 *
 */

function DepartmentsCtrl($scope, $routeParams, model, Students, Departments, Forms, Lang){

  $scope.forms = Forms.all();
  $scope.dict = Lang.getDict();
  $scope.lang = $routeParams.lang ? $routeParams.lang : Lang.defaultLang;
  $scope.validationError = false;
  

  $scope.departments = Departments.getAll();
  console.log($scope.departments);

  $scope.newDepartment = new model.Department();

		$scope.allStudents = {};

  /**
     * @ngdoc method
     * @methodOf SchoolMan.controller:DepartmentsCtrl
     * @name SchoolMan.controller:DepartmentsCtrl#add
     * @description Adds a new department to the pouchdb database and to the current view
     */
  $scope.add = function(department){
    department.save().then(function(success){
              console.log("Department saved", success);
              $scope.departments[success.id] = department;
              Departments.set($scope.newDepartment, success.id);
              $scope.allStudents[$scope.newDepartment._id]  = [];
              $scope.newDepartment = new model.Department();
              $scope.validationError = false;
          }).catch(function(error){
              //handle duplicate dept code
              if(error.name === "conflict"){
                $scope.validationError = true;
                $scope.newDepartment = new model.Department();
                $scope.newDepartment.code = department.code;
                $scope.newDepartment.name = department.name;
              }
              console.log("Department save error ", error);
          });
  };
  /**
     * @ngdoc method
     * @methodOf SchoolMan.controller:DepartmentsCtrl
     * @name SchoolMan.controller:DepartmentsCtrl#remove
     * @description Removes a department from the pouchdb database and from the current view
     */
  $scope.remove = function(department){
    Departments.remove(department).then(function(success){
      delete $scope.departments[department._id];
    });
  };

  $scope.toggleForm = function(department, formIndex){
    department.toggleForm(formIndex).save().then(function(success){
      Departments.set(department, department._id);
    });
  };

  Students.getAll().then(function(students){
      angular.forEach($scope.departments, function(dept, deptId){
        $scope.allStudents[deptId] = [];
      });
      angular.forEach(students, function(student, studentId){
        $scope.allStudents[student.deptId].push(student);
      });
    console.log("Got all students: ", $scope.allStudents);
  }).catch(function(error){
    console.log("Failed to get all students, ", error);
  });

}

DepartmentsCtrl.$inject = ['$scope', '$routeParams', 'model', 'Students', 'Departments', 'Forms', 'Lang'];
angular.module('SchoolMan').controller('DepartmentsCtrl', DepartmentsCtrl);