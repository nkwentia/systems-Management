'use strict';

function NavbarCtrl($scope, $location, $routeParams, Cache) {
    
    $scope.username = $routeParams.username;
    $scope.teacher = Cache.user;

  	var isSamePage = function(page, location){
  		return page === location.split('/')[1];
  	}

  	$scope.activeIfPage = function(page){
  		var className = "";
  		if(isSamePage(page, $location.path())){
  			className = 'active';
  		}
  		return className;
  	};

    $scope.open = function(url){
      console.log("Open: ", url);
    	$location.path(url);
    }

  }
  NavbarCtrl.$inject = ['$scope', '$location', '$routeParams', 'Cache'];
  angular.module('SchoolMan').controller('NavbarCtrl', NavbarCtrl);