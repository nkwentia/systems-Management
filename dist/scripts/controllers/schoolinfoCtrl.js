'use strict';

function SchoolInfoCtrl($scope, $q, Data2, model, $routeParams, SchoolInfos, Logo, $route, File) {
	
  $scope.accessCode = $routeParams.accessCode;
  $scope.User = model.User;
  $scope.regions = model.SchoolInfo.regions;
  Logo.get().then(function(img){
    document.getElementById("logo-image").appendChild(img);
  })

	SchoolInfos.get("schoolinfo").then(function(info){
    $scope.schoolInfo = info;
    console.log("School Info", $scope.schoolInfo);
  }).catch(function(error){
    console.log("error getting school info", error);
  });

  $scope.save = function(){
    $scope.schoolInfo.save().then(function(success){
      //console.log("school Info saved", $scope.schoolInfo);
    }).catch(function(error){
      console.log("failed to save school Info", error);
    });
  }

  $scope.updateVersion = function(version){
    $scope.schoolInfo.version = version;
    if(version === "gths"){
      $scope.User.roles.classmaster.name = "Head of Dept";
    } else {
      $scope.User.roles.classmaster.name = "Class Master";
    }
    $scope.save();
  }

  $scope.uploadImage = function(){
    // var deferred = $q.defer();
    // var promise;

    chrome.fileSystem.chooseEntry({type:"openFile"}, 
      function(entry){
        entry.file(function(file){
          var reader = new FileReader();

          reader.onloadend = function(success){
            var array = reader.result.split(",");
            var dataURL = array[1];
            Logo.save({_id:'logo', _attachments: {'logo.png': {content_type:'image/png', data: dataURL}}}).then(function(success){
              $route.reload();
            })
          }
          reader.onerror = function(error){
            console.log("Read failed:", error);
            // deferred.reject(error);
          }

          reader.readAsDataURL(file);

        }).catch(function(error){
          console.log("error reading file", error);
        });
    });
  }
  $scope.importPrevious = function(){
    var modalInstance = File.openModal("import");
    console.log("modal ", modalInstance);
    $q.when(File.import(true)).then(function(success){
      console.log("success importing");
      modalInstance.close();
    });
  }
}
SchoolInfoCtrl.$inject = ['$scope', '$q', 'Data2', 'model', '$routeParams', 'SchoolInfos', 'Logo', '$route', 'File'];
angular.module('SchoolMan').controller('SchoolInfoCtrl', SchoolInfoCtrl);