'use strict';

function Items($q, pouchdb, model, modelTransformer) {

	var db = model.Item.db;
  if(typeof db === "string"){
    db = pouchdb.create(model.Item.db);
  }

	self = {};

	self.getAll = function(){
		var deferred = $q.defer();
    var dataModel = model.Item;

    var map = function(doc, emit){
      if(doc.datatype === dataModel.datatype._id){
        emit(doc._id, {_id:doc.datatype, data:doc});
      } 
    };

    db.query(map, {include_docs : true}).then(function(success){
        var collection = [];

        angular.forEach(success.rows, function(data, rowIndex){
          var spec = data.doc;
          var obj = model.parse2(data.value.data, data.value._id);
          var item = modelTransformer.transform(obj, dataModel);
          collection.push(item);
        });
        deferred.resolve(collection);
    }).catch(function(error){
        deferred.reject("Query: failed", error);
    });
    
    return deferred.promise;

	};

  self.destroy = function(){
  	db.destroy().then(function(success){
  		console.log("Destroyed items db");
  	}).catch(function(error){
  		console.log("failed to destroy items db", error)
  	});
  }

  return self;
}
Items.$inject = ['$q', 'pouchdb', 'model', 'modelTransformer'];
angular.module('SchoolMan').service('Items', Items);