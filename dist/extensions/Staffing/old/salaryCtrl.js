'use strict';
define(['Salarys', 'Staffs'], function(Salarys, Staffs){
function SalarysCtrl($scope, model, Salarys, Staffs) {
      
      $scope.data = {};
      $scope.data.salarys = Salarys.getAll();
      $scope.data.staffs = Staffs.getAll();
       console.log("salarys",$scope.data.salarys)
      // Join students to fees
      
        angular.forEach($scope.data.salarys, function(salary, key){
          salary.staffs = _.filter($scope.data.staffs, function(staff){
            return staff.salaryId === key;
          });
        });
      
      $scope.newSalary = new model.Salary();

      $scope.add = function(salary){
         if(salary.isValid()){
            try{
               salary.salaryAmount = Number(salary.salaryAmount.replace(/[^0-9\.]+/g,""));
               salary.socailinsuranceAmount = Number(salary.socailinsuranceAmount.replace(/[^0-9\.]+/g,""));
               salary.save().then(function(success){
                  if(!$scope.newSalary.staffs){
                    $scope.newSalary.staffs= [];
                 }
                  $scope.data.salarys[$scope.newSalary._id] = $scope.newSalary;
                  $scope.newSalary = new model.Salary(); 
               }).catch(function(error, result){
                  console.log("Error: Salary not added", error);
               });
           } catch(e){
               console.log("SalarysCtrl Error: ", e)
           }
         }  
      }

      $scope.remove = function(salary){
         Salarys.remove(salary); 
      }
}
SalarysCtrl.$inject = ['$scope', 'model', 'Salarys', 'Staffs'];
angular.module('SchoolMan').register.controller('SalarysCtrl', SalarysCtrl);
})