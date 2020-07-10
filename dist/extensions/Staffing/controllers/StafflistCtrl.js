'use strict';

function StafflistCtrl($scope, $routeParams, model, Users, Location, Lang) {
    
    $scope.data = {};
    $scope.data.staff = Users.getAll();
    console.log("Staff:", $scope.data.staff);

    $scope.date = new Date();
    $scope.dict = Lang.getDict();
    $scope.lang = $routeParams.lang ? $routeParams.lang : Lang.defaultLang;

    $scope.open = Location.open;

    // $scope.remove = function(staff){
    //   Users.remove(staff).then(function(success){
    //     delete $scope.data.staff[staff._id];
    //   });
    // };

    $scope.getServiceYears = function(dateofentry){
        if(dateofentry){
            return $scope.date.getFullYear()-(new Date(dateofentry)).getFullYear();
        } else {
            return "";
        }
    }

}
StafflistCtrl.$inject = ['$scope', '$routeParams', 'model', 'Users', 'Location', 'Lang'];
angular.module('SchoolMan.Staffing').controller('StafflistCtrl', StafflistCtrl);

