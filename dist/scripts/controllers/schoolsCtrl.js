
'use strict';

function SchoolsCtrl($scope, $q, $routeParams, Schools, Schoolid, DivFees, model, Data, Location, Divisions, File) {

  $scope.showValidaton = false;

  var data = $scope.data = {
      schools: Schools.getAll(),
      divfees: DivFees.getAll(),
      schoolid:null,
      page: 0,
      divisions: Divisions.getAll(),
      versions:model.School.versions
  };
  // console.log("Schools:", data.schools);
  $scope.open = Location.open;

  $scope.newSchool = new model.School();
  console.log("NewSchool", $scope.newSchool);
  Schoolid.get().then(function(schoolid){
      data.schoolid = schoolid;
      console.log("Got schoolid", schoolid);
      $scope.newSchool.id = schoolid.value;
  });
  console.log("Division school", data.divisions)

  $scope.add = function(school){
    console.log("school?", school);
      school.save().then(function(success){
          Schoolid.save(data.schoolid);
          console.log("Save school: ", success);
          Location.open({page:"schoolprofile", schoolId:school._id});
          $scope.showValidaton = false;
          Schools.set(school);
          console.log("divisions:", data.divisions);
          var div = school.division;
          data.divisions[div].numStudents += school.numStudents;
          data.divisions[div].save().then(function(success){
            console.log("Saved divison", success);
          }).catch(function(error){
            console.log("Failed to save division", error);
          })
      }).catch(function(error){
          $scope.showValidation = true;
          console.log("Failed to save school: ", error);
      })
  }
  $scope.remove = function(school){
    Schools.remove(school);
  }
  $scope.clearForm = function(school){
      school.nameEn = "";
      school.nameFr = "";
      school.subdivision = "";
      school.numStudents = null;
      school.numFemaleCycle1 = null;
      school.numFemaleCycle2 = null;
      school.numMaleCycle1 = null;
      School.numMaleCycle2 = null;
  }

  $scope.import = function(){
    File.importSchool().then(function(success){
      $scope.newSchool.nameEn = success.nameEn;
      $scope.newSchool.nameFr = success.nameFr;
      $scope.newSchool.division = success.division;
      $scope.newSchool.subdivision = success.subdivision;
      $scope.newSchool.principal = success.principal;
      $scope.newSchool.numMaleCycle1 = success.maleCycle1;
      $scope.newSchool.numFemaleCycle1 = success.femaleCycle1;
      $scope.newSchool.numMaleCycle2 = success.maleCycle2;
      $scope.newSchool.numFemaleCycle2 = success.femaleCycle2;
      $scope.add($scope.newSchool);
    }).catch(function(error){
      console.log("failed to import school", error);
    })
    
  }

}
SchoolsCtrl.$inject = ['$scope', '$q', '$routeParams', 'Schools', 'Schoolid', 'DivFees', 'model', 'Data', 'Location', 'Divisions', 'File'];
angular.module('SchoolMan').controller('SchoolsCtrl', SchoolsCtrl);
