'use strict';

function FeesCtrl($scope, model, Fees, Students, Lang) {
    $scope.dict = Lang.getDict();
    $scope.data = {};
    $scope.data.fees = Fees.getAll();
    // Join students to fees
    Students.getAll().then(function(students){
      angular.forEach($scope.data.fees, function(fee, key){
        fee.students = _.filter(students, function(student){
          return student.feeId === key;
        });
      });
    });
    
    $scope.newFee = new model.Fee();
    $scope.validationError = false;

    $scope.add = function(fee){
      console.log("new fee before", angular.copy(fee))
       if(fee.isValid()){
        console.log("new fee valid", angular.copy(fee))
          try{
            typeof fee.schoolAmount === "string" ? fee.schoolAmount = Number(fee.schoolAmount.replace(/[^0-9\.]+/g,"")) : "";
            typeof fee.ptaAmount === "string" ? fee.ptaAmount = Number(fee.ptaAmount.replace(/[^0-9\.]+/g,"")) : "";
              
             fee.save().then(function(success){
                if(!$scope.newFee.students){
                  $scope.newFee.students= [];
               }
                $scope.data.fees[$scope.newFee._id] = $scope.newFee;
                $scope.newFee = new model.Fee(); 
                $scope.validationError = false;
             }).catch(function(error, result){
                //handle duplicate dept code
              if(error.name === "conflict"){
                $scope.validationError = true;
                console.log("new fee begin", angular.copy(fee))
                $scope.newFee = new model.Fee();
                $scope.newFee.name = fee.name;
                $scope.newFee.schoolAmount = fee.schoolAmount;
                $scope.newFee.ptaAmount = fee.ptaAmount;
                console.log("new fee end", $scope.newFee)
              }
                console.log("Error: Fee not added", error);
             });
         } catch(e){
             console.log("FeesCtrl Error: ", e)
         }
       }  
    }

    $scope.remove = function(fee){
       Fees.remove(fee); 
    }
}
FeesCtrl.$inject = ['$scope', 'model', 'Fees', 'Students', 'Lang'];
angular.module('SchoolMan.Finance').controller('FeesCtrl', FeesCtrl);