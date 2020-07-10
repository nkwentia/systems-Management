'use strict';

 function SettingsCtrl($scope, Data2, model, $routeParams, settings) {
	
	$scope.roles = model.User.roles;
  $scope.settings = settings.get();
  $scope.accessCode = $routeParams.accessCode;

  $scope.availableExtensions = settings.availableExtensions();
  console.log("Available Modules:", $scope.availableExtensions);
  console.log("Settings:", $scope.settings);

	$scope.toggle = function(setting){
    if($scope.settings.access.hasOwnProperty(setting)){
      $scope.settings.access[setting] = ($scope.settings.access[setting] + 1) % 2;
    } else if($scope.availableExtensions.indexOf(setting) > -1){
      var index = $scope.settings.extensions.indexOf(setting.name);
      if(index > -1){
        delete $scope.settings.extensions[index];
      } else {
        $scope.settings.extensions.push(setting.name);
      }
    }
      
		$scope.settings.save().then(function(success){
			console.log("Settings saved", $scope.settings);
		}) 
	}
};
SettingsCtrl.$inject = ['$scope', 'Data2', 'model', '$routeParams', 'settings'];
angular.module('SchoolMan').controller('SettingsCtrl', SettingsCtrl);