'use strict';

function UserCtrl($scope, $routeParams, model, Users, Lang) {
  	$scope.editing = false;
  	$scope.currentUser = Users.get($routeParams.username);
    // $scope.editingUser = $routeParams.subpage === 'current' ? 
    //                      $scope.currentUser : Users.get($routeParams.subpage);

    $scope.data = {};
    $scope.data.user = $routeParams.subpage === 'current' ? 
                        $scope.currentUser : Users.get($routeParams.subpage);
    $scope.data.newPassword = "";
    $scope.data.repeatPassword = "";
    $scope.data.verifiedStatus = "";
    $scope.accessCode = $routeParams.accessCode;
    $scope.dict = Lang.getDict();

    $scope.data.currentPassword = "";

    $scope.status = "";
    $scope.date = new Date();

    console.log("User", $scope.data.user);


    var serviceLength = function(){
        $scope.data.serviceYears = $scope.date.getFullYear()-(new Date($scope.data.user.dateofentry)).getFullYear();
        $scope.data.serviceMonths = $scope.date.getMonth()-(new Date($scope.data.user.dateofentry)).getMonth();

        if($scope.data.serviceMonths < 0){
            $scope.data.serviceYears -= 1;
            $scope.data.serviceMonths = 12 + $scope.data.serviceMonths;
        }

        $scope.data.retire = new Date($scope.data.user.birth);
        
        $scope.data.retire.setYear($scope.data.retire.getFullYear() + 60);
    }

    serviceLength();

    var userCopy = angular.copy($scope.data.user);

    $scope.edit = function(){
        $scope.editing = true;
    }

    $scope.cancel = function(){
        $scope.data.user = angular.copy(userCopy);
        $scope.editing = false;
    }


    $scope.verifyMatch = function(){
    	if($scope.data.repeatPassword === $scope.data.newPassword){
    		$scope.data.verifiedStatus = "has-success";
    	} else {
    		$scope.data.verifiedStatus = "has-error"
    	}
    };

    $scope.verifyStatus = function(){
    	if($scope.data.repeatPassword.length < $scope.data.newPassword.length){
    		$scope.data.verifiedStatus = ""
    	} else {
    		$scope.verifyMatch();
    	}
    };
    $scope.save = function(user){
      user.save().then(function(success){
        console.log("User saved", success);
        $scope.editing = false;
        serviceLength();
      }).catch(function(error){
        console.log("Failed to save user", error);
      });
    };

    $scope.savePassword = function(){
    	if(model.encrypt($scope.data.currentPassword) === $scope.currentUser.password){
    		var user = $scope.data.user;
    		user.password = model.encrypt($scope.data.newPassword);
        user.save().then(function(success){
    			$scope.status = 200;
    		}).catch(function(error){
    			console.log("Failed to update password", error);
    		});
    	} else {
    		$scope.status = 401;
    	}
    }
}
UserCtrl.$inject = ['$scope', '$routeParams', 'model', 'Users', 'Lang'];
angular.module('SchoolMan').controller('UserCtrl', UserCtrl);