'use strict';

function LoginCtrl($scope, $location, $routeParams, $log, DEV, model, Users, Subjects, Departments, settings, Cache, Location, Groups, Lang) {
  $log.info("Path: ", $location.path()); 


  var DEFAULT_START_PAGE = {
      admin:{
          page:"users"
      },
      classmaster:{
          page:"classmasterMarksheet"
      },
      registrar:{
          page:"registration"
      },
      teacher:{
          page:"myclasses"
      }
  }


  $scope.open = Location.open;
  $scope.page = $routeParams.page;
  $scope.status = 200;
  $scope.dict = Lang.getDict();
  // console.log("Language dict:", $scope.dict, Lang.getDict(), Lang);

  // This data is used for creating the access dropdown in the login view
  // It should be moved to a service
  $scope.accessLevels = model.User.roles;

  $scope.access = $scope.accessLevels[$routeParams.accessCode];
  $scope.settings = settings.get();

  // Get a user object. 
  // Note: this user may not actually exist as a registered user
  $scope.tempUser = new model.User({password:''});

  $scope.login = function(page){

    var accessRequest = $routeParams.accessCode;

    Users.login($scope.tempUser, accessRequest, function(data){
      console.log("Login Data", data);
      if(data.status === 200){
        var user = data.user;
        accessRequest = accessRequest === "undefined" || !user.hasAccess(accessRequest) ? user.getHighestAccess() : accessRequest;

        if($scope.settings.access[accessRequest] === 0){
          accessRequest = user.getHighestAccess();
        }
        if($scope.settings.access[accessRequest] === 0 || !user.hasAccess(accessRequest)){
          $scope.status = data.status = 403;
          data.message = "Access denied.  User does not have access to any available tabs."
          console.log("User does not have access to any available tabs. Access:", user.access, "Tabs:", $scope.settings.access);
        }
        else{
          Cache.set({user:user});

          var depts = Departments.getAll();
          var groups= Object.keys(Groups.getAll());
          var subjects= Object.keys(Subjects.getAll());

          

          Location.open({
            page:page || DEFAULT_START_PAGE[accessRequest].page,
            subpage:"null",
            lang:$routeParams.lang,
            formIndex:"0",
            deptId:Object.keys(depts)[0],
            groupId:groups[0],
            subjectId:subjects[0],
            studentId:"U0000001",
            termIndex:0,
            username:user.username,
            accessCode:accessRequest
          });
        }
      } else {
        $scope.status = data.status;
      }
    });
  };

  $scope.createNewAccount = function(){
      Location.open({
          page:"register",
          username:$scope.username||null
      });
  }

  $scope.checkCapsLock = function(e){
    var keyCode = e.keyCode ? e.keyCode : e.which;
    var shiftKey = e.shiftKey ? e.shiftKey : ((keyCode === 16) ? true : false);
    if((keyCode >= 65 && keyCode <= 90 && !shiftKey) || (keyCode >= 97 && keyCode <= 122 && shiftKey)){
      $scope.capsLock = true;
    } else {
      $scope.capsLock = false;
    }
  }


  if(DEV.AUTO_LOGIN){
      $scope.tempUser.fullname = DEV.AUTO_LOGIN_USER;
      $scope.tempUser.password = DEV.AUTO_LOGIN_PASS;
      $routeParams.accessCode = DEV.AUTO_LOGIN_ACCESS;
      var page = DEV.hasOwnProperty("AUTO_LOGIN_PAGE") ? DEV.AUTO_LOGIN_PAGE : undefined;
      $scope.login(page); 
  }
}
LoginCtrl.$inject = ['$scope', '$location', '$routeParams', '$log', 'DEV', 'model', 'Users', 'Subjects', 'Departments', 'settings', 'Cache', 'Location', 'Groups', 'Lang'];
angular.module('SchoolMan').controller('LoginCtrl', LoginCtrl);