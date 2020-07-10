'use strict';

function MenuCtrl($route, $scope, $location, $routeParams, $modal, $q, $log, Location, Path, Cache, File, ClassMaster, Lang, SchoolInfos) {

  //$scope.ClassMaster = ClassMaster;
  $scope.show = {
    backButton:false
  }

  $scope.ClassMaster = ClassMaster;
  $scope.route = $routeParams;

  SchoolInfos.get().then(function(info){
    $scope.dict = Lang.getDict(info.lang);
  })

	$scope.print = function(){
		ClassMaster.printVariable = false;
    if($routeParams.page === "reportcard"){
      File.openModal("print");
    }
    else{
      window.print();
    }
  }

  $scope.export = function(){
    var modalInstance = File.openModal("export");
    console.log("modal ", modalInstance);
    $q.when(File.export()).then(function(success){
      modalInstance.close();
    });
  }
  $scope.import = function(){
    var modalInstance = File.openModal("import");
    console.log("modal ", modalInstance);
    $q.when(File.import(false)).then(function(success){
      console.log("success importing");
      modalInstance.close();
    });
  }

  // $scope.back = function(){
  //   $scope.show.backButton = false;
  //   $scope.open({page:'reportcard'});
  // }

  $scope.logout = function(){
    Location.open({page:"login", username:null, accessCode:'teacher'});
  }

  $scope.cache = Cache.cache;
  console.log("Cache:", $scope.cache);

  $scope.username = $routeParams.username;

  $scope.changeLanguage = function(lang){
    if($routeParams.lang !== lang){
      $scope.dict = Lang.getDict(lang);
      Location.open({lang:lang}); 
    }

  }

  $scope.open = function(params){
    var newParams = angular.copy($routeParams);
    angular.forEach(params, function(param, paramKey){
      newParams[paramKey] = param;
    });
    console.log("newParams ", newParams);
    var path = Path.get(newParams);
    console.log("Open: ", path);
    $location.path(path);
  };

}
MenuCtrl.$inject = ['$route','$scope', '$location', '$routeParams', '$modal', '$q', '$log', 'Location', 'Path', 'Cache', 'File', 'ClassMaster', 'Lang', 'SchoolInfos'];
angular.module('SchoolMan').controller('MenuCtrl', MenuCtrl);
