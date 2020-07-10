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
      $scope.openModal("print");
    }
    else{
      window.print();
    }
  }

  $scope.export = function(){
    var modalInstance = $scope.openModal("export");
    console.log("modal ", modalInstance);
    $q.when(File.export()).then(function(success){
      modalInstance.close();
    });
  }
  $scope.import = function(){
    var modalInstance = $scope.openModal("import");
    console.log("modal ", modalInstance);
    $q.when(File.import()).then(function(success){
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

  


	// chrome.storage.local.set({ReportCard:{initialized:true}},function(res){
	// 	console.log(res);
	// });

	// Check if data has been loaded into app 
	// chrome.storage.local.get("initialized",function(r){
	// 	if(!r.initialized){
	// 		$location.path('/start');
	// 	}
	// });


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

  $scope.openModal = function (type) {

    var modalInstance; 
    if(type === "print"){
      modalInstance = $modal.open({
      templateUrl: 'printModal.html',
      controller: PrintModalInstanceFunction
      });
    } else if(type === "export"){
      modalInstance = $modal.open({
        templateUrl: 'exportModal.html',
        controller: ImportExportModalInstanceFunction
      });
    } else if(type === "import"){
      modalInstance = $modal.open({
        templateUrl: 'importModal.html',
        controller: ImportExportModalInstanceFunction
      });
    }

    modalInstance.result.then(function () {
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
    return modalInstance;
  };
  //var closeModal = function(modalInstance){
    //modalInstance.close();
  //}

  var PrintModalInstanceFunction = function ($scope, $modalInstance, ClassMaster, Lang) {
    $scope.dict = Lang.getDict();
    $scope.ClassMaster = ClassMaster;

    $scope.ok = function () {
      $modalInstance.close();
      window.print();
      ClassMaster.printVariable = false;

    };
    

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }
  PrintModalInstanceFunction.$inject = ['$scope', '$modalInstance', 'ClassMaster', 'Lang'];
  
  var ImportExportModalInstanceFunction = function ($scope, $modalInstance, Lang){
    $scope.dict = Lang.getDict();
    $scope.close = function () {
      $modalInstance.close();
    }
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }
  ImportExportModalInstanceFunction.$inject = ['$scope', '$modalInstance', 'Lang'];

	// $scope.importFile = function(){
	// 	chrome.fileSystem.chooseEntry({
		// type:"openWritableFile", 
		// suggestedName:"reportcard.data"}, 
		// function(entry){
		// 	// Save entryId in chrome.storage.local
		// 	var entryId = chrome.fileSystem.retainEntry(entry);
		// 	chrome.storage.local.set({"entryId":entryId},function(d){
		// 		chrome.storage.local.set({initialized:true});
		// 		// Location.set("form/7/subject/0/term/1");
		// 		console.log($location.path());
		// 	});
		// });
	// }

 //  $scope.saveFile = function(){

 //  	chrome.storage.local.get("entryId", function(entryId){
	
  //   	// If no entryId, prompt user to select a file
  //   	if(!angular.isString(entryId.entryId)){
  // 			chrome.fileSystem.chooseEntry({
  // 				type:"saveFile", 
  // 				suggestedName:"reportcard.data"}, 
  //   			function(entry){
  //   				// Save entryId in chrome.storage.local
  //   				var entryId = chrome.fileSystem.retainEntry(entry);
  //   				chrome.storage.local.set({"entryId":entryId});
  //   			});
	 //  	}

	 //  	// Write to file
	 //  	chrome.storage.local.get("entryId", function(entryId){
	 //  		console.log(entryId);
  // 			chrome.fileSystem.restoreEntry(entryId.entryId, function(entry){
		// 		chrome.fileSystem.getWritableEntry(entry, function(file){
		// 			file.createWriter(function(writer){
		// 				writer.write(new Blob([angular.toJson({test:"this"})]), {type:'application/json'})
		// 			});	
		// 			console.log("Reader", file.createReader());
		// 		});
	 //  		});	
  // 		});

	// 	});
 //  }
}
MenuCtrl.$inject = ['$route','$scope', '$location', '$routeParams', '$modal', '$q', '$log', 'Location', 'Path', 'Cache', 'File', 'ClassMaster', 'Lang', 'SchoolInfos'];
angular.module('SchoolMan').controller('MenuCtrl', MenuCtrl);