'use strict';

function StaffprofileCtrl($scope, $routeParams, model, Users, Lang) {
    $scope.editing = false;

    var data = $scope.data = {};
    $scope.data.staff = Users.get($routeParams.subpage);
                        console.log("staff",$scope.data.staff);

    $scope.data.verifiedStatus = "";
    $scope.accessCode = $routeParams.accessCode;
    $scope.dict = Lang.getDict();

    $scope.status = "";
    $scope.date = new Date();

    console.log("Staff", $scope.data.staff);


    var serviceLength = function(){
        if($scope.data.staff.dateofentry){
            $scope.data.serviceYears = $scope.date.getFullYear()-(new Date($scope.data.staff.dateofentry)).getFullYear();
            $scope.data.serviceMonths = $scope.date.getMonth()-(new Date($scope.data.staff.dateofentry)).getMonth();

            if($scope.data.serviceMonths < 0){
                $scope.data.serviceYears -= 1;
                $scope.data.serviceMonths = 12 + $scope.data.serviceMonths;
            }
        } else {
            $scope.data.serviceYears = 0;
            $scope.data.serviceMonths = 0;
        }

        if($scope.data.staff.birth){
            $scope.data.retire = new Date($scope.data.staff.birth);
            $scope.data.retire.setYear($scope.data.retire.getFullYear() + 60);
        } else {
            $scope.data.retire = null;
        }
    }

    serviceLength();

    var staffCopy = angular.copy($scope.data.staff);

    $scope.edit = function(){
        $scope.editing = true;
    }

    $scope.cancel = function(){
        $scope.data.staff = angular.copy(staffCopy);
        $scope.editing = false;
    }

    $scope.save = function(user){
      typeof user.salary === "string" ? user.salary = Number(user.salary.replace(/[^0-9\.]+/g,"")) : "";
      if(user.fullname === ""){
        user.fullname = staffCopy.fullname;
      }
      user.save().then(function(success){
        console.log("Staff saved", success);
        $scope.editing = false;
        serviceLength();
      }).catch(function(error){
        console.log("Failed to save staff", error);
      });
    };
}
StaffprofileCtrl.$inject = ['$scope', '$routeParams', 'model', 'Users', 'Lang'];
angular.module('SchoolMan.Staffing').controller('StaffprofileCtrl', StaffprofileCtrl);
