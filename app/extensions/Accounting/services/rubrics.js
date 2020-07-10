'use strict';

function Rubrics($q, Data2, model, modelTransformer) {


	self = {};

	self.getAll = function(){
		var deferred = $q.defer();
    var dataModel = model.Rubric;

    var map = function(doc, emit){
      if(doc.datatype === dataModel.datatype._id){
        emit(doc._id, {_id:doc.datatype, data:doc});
      } 
    };

    Data2.query(map, {include_docs : true}).then(function(success){
        var collection = {};

        angular.forEach(success.rows, function(data, rowIndex){
          var spec = data.doc;
          var obj = model.parse2(data.value.data, data.value._id);
          var rubric = modelTransformer.transform(obj, dataModel);
          collection[rubric._id] = rubric;
        });
        deferred.resolve(collection);
    }).catch(function(error){
        deferred.reject("Query: failed", error);
    });
    
    return deferred.promise;

	};

  self.remove = function(rubric){
    var deferred = $q.defer();
    Data2.remove(rubric).then(function(success){
      console.log("Rubric removed: ", success);
      deferred.resolve(success);
    }).catch(function(error){
      $log.error("rubrics.js : remove :", error);
      deferred.reject(error);
    });
    return deferred.promise;
  };

  return self;
}
Rubrics.$inject = ['$q', 'Data2', 'model', 'modelTransformer'];
angular.module('SchoolMan').service('Rubrics', Rubrics);