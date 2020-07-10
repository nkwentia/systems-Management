'use strict';

function NavtabsCtrl($scope, $routeParams, EXTENSIONS, model, Location, settings, Cache, SchoolInfos, Lang) {

  // $scope.TABS = TABS;
  $scope.extensions = EXTENSIONS;
  $scope.open = Location.open;
  $scope.userAccess = $routeParams.accessCode;
  $scope.teacher = Cache.get('user');
  $scope.User = model.User;
  $scope.settings = settings.get();
  $scope.activePage = $routeParams.page;
  $scope.dict = Lang.getDict();
  $scope.lang = $routeParams.lang ? $routeParams.lang : "en";
  console.log("extensions",$scope.settings.extensions);
  SchoolInfos.get("schoolinfo").then(function(info){
    $scope.schoolInfo = info;

    if($scope.schoolInfo.version === "gths"){
      $scope.User.roles.classmaster.nameEn = "Head of Dept";
      $scope.User.roles.classmaster.nameFr = "Chef du Dépt";
    }
  }).catch(function(error){
    console.log("failed to load school info", error);
  });

  $scope.activeIfPage = function(page){
    var cssClass = "";
    if(page === $routeParams.page){
      cssClass = 'active';
    }
    return cssClass;
  };

  var excludedOnThisPage = function(tab){
    var excluded = false;
    if(tab.page !== $routeParams.page){ // no tab is excluded from it's own 
      if(tab.exclude === 'all'){
        excluded = true;
      } else {
        excluded = tab.exclude.indexOf($routeParams.page) > -1;
      }
    } 
    return excluded;
  };

  $scope.userHasAccess = function(item){
  	var hasAccess = item.access.indexOf($scope.userAccess) > -1;

    if(item.hasOwnProperty("exclude")){
      var excluded = excludedOnThisPage(item);
    } else {
      var excluded = false;
    }
    return (hasAccess && (!excluded));
  };

  $scope.logout = function(){
    Location.open({page:"login", username:null, accessCode:'teacher'});
  }

  $scope.login = function(access){
    console.log(access, $scope.settings);
    if(!$scope.settings.access[access]){
      Location.open({page:"notactive", accessCode:access});
    }else {
      Location.open({page:"default_"+access, accessCode:access});
    }
  }
}
NavtabsCtrl.$inject = ['$scope', '$routeParams', 'EXTENSIONS', 'model', 'Location', 'settings', 'Cache', 'SchoolInfos', 'Lang'];
angular.module('SchoolMan').controller('NavtabsCtrl', NavtabsCtrl);