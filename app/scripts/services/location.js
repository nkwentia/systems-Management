'use strict';

function Location($location, $routeParams, Path) {

  var self = {};
  
  self.open = function(params){
    console.log("Ok so far: ", params);
    var newParams = angular.copy($routeParams);
    angular.forEach(params, function(param, paramKey){
      newParams[paramKey] = param;
    });
    var path = Path.get(newParams);
    console.log("Location.open: ", path);
    $location.path(path);
  };

  return self;
}
Location.$inject = ['$location', '$routeParams', 'Path'];
angular.module('SchoolMan').service('Location', Location);