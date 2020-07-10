'use strict';

function UsersCtrl($scope, $routeParams, model, Users, Location, SchoolInfos, Lang) {
  
  $scope.data = {};
  $scope.data.users = Users.getAll();
  $scope.User = model.User;
  $scope.tempUser = new model.User();
  $scope.date = new Date();
  $scope.dict = Lang.getDict();
  $scope.lang = $routeParams.lang ? $routeParams.lang : Lang.defaultLang;
  $scope.validationError = false;


  $scope.open = Location.open;
  $scope.username = $routeParams.username;

  SchoolInfos.get("schoolinfo").then(function(info){
    $scope.schoolInfo = info;

    if($scope.schoolInfo.version === "gths"){
      $scope.User.roles.classmaster.name = "Head of Dept";
    }
  }).catch(function(error){
    console.log("failed to load school info", error);
  })

  $scope.addUser = function(){
    // $scope.tempUser.name = $scope.tempUser.fullname;
  	$scope.tempUser.save().then(function(success){
      $scope.data.users[success.id] = $scope.tempUser;
  	  $scope.tempUser = new model.User();
      $scope.validationError = false;
    }).catch(function(error){
      //handle duplicate users
      if(error.name === "conflict"){
        var name = $scope.tempUser.name;
        $scope.validationError = true;
        $scope.tempUser = new model.User();
        $scope.tempUser.name = name;
      }
      console.log("Could not save user:", error);
    });
  };
  $scope.validate = function(user){
    user.name = user.fullname;
    return user.validates();
  }

  $scope.getServiceYears = function(dateofentry){
    return $scope.date.getFullYear()-(new Date(dateofentry)).getFullYear();
  }

  $scope.remove = Users.remove;

}
UsersCtrl.$inject = ['$scope', '$routeParams', 'model', 'Users', 'Location', 'SchoolInfos', 'Lang'];
angular.module('SchoolMan').controller('UsersCtrl', UsersCtrl);