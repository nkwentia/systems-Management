'use strict';

function LoadingCtrl($scope, $q, model, $routeParams, Location, Students, Subjects, Departments, Groups, Fees, Users, settings, Lang, MockData, SchoolInfos) {
    $scope.dict = Lang.getDict();

    // Initialize/Register SchoolInfo datatype
    var instSettings = new model.Settings();
    var instSchoolInfo = new model.SchoolInfo();

    var settingsP = settings.load();
    var userP = Users.load();
    var deptP = Departments.load();
    var subjP = Subjects.load();
    var groupP= Groups.load();
    var studentsP= Students.load();
    var feesP = Fees.load();
    // var infosP = SchoolInfos.get();

    var promises = [settingsP, deptP, groupP, subjP, feesP, userP, studentsP];

    $q.all(promises).then(function(success){
        console.log("Successes", success);
        Location.open({page:"login"});
    });
}
LoadingCtrl.$inject = ['$scope', '$q', 'model','$routeParams', 'Location', 'Students', 'Subjects', 'Departments', 'Groups', 'Fees', 'Users', 'settings', 'Lang', 'MockData', 'SchoolInfos'];
angular.module('SchoolMan').controller('Loading3Ctrl', LoadingCtrl);