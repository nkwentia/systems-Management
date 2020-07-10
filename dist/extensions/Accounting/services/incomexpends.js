'use strict';

function Items($q, pouchdb, model, modelTransformer) {

	var db = model.Item.db;
  if(typeof db === "string"){
    db = pouchdb.create(model.Item.db);
  }

	self = {};

	self.getAll = function(){
		var deferred = $q.defer();

		var map = function(doc, emit){
			var dataModel = model.Item;
      if(doc.datatype === dataModel.datatype._id){
      	var obj = model.parse(doc, dataModel.datatype);
      	emit(doc._id, {_id:obj.itemId, data:doc});
      } 
    };

		db.query(map, {include_docs : true}).then(function(success){
			  var collection = {};
			  var dataModelItem = model.Item;
			  var dataModelItem = model.Item;
        console.log("Items Success: ", success);
			  angular.forEach(success.rows, function(data, $index){
			  	
			  	var itemId = data.value._id;
			  	if(!collection.hasOwnProperty(itemId)){
			  		var item = Items.get(ItemId);
                item.items = [];
			  		collection[itemId] = item;
			  	};
			  	var item = model.parse(data.value.data, dataModelItem.datatype);
			  	collection[studentId].items.push(item);
			  });
        deferred.resolve(collection);
    }).catch(function(error){
        deferred.reject("Query: failed", error);
    });
		
		return deferred.promise;

	};

	self.query = function(params){
  	var deferred = $q.defer();

  	// Load Data
  	var dataModel = model.Item;

    var map = function(doc, emit){
      if(doc.datatype === dataModel.datatype._id){
      	var obj = model.parse(doc, dataModel.datatype);
      	var isok= true;
      	angular.forEach(params, function(param, paramKey){
      		isok = obj[paramKey] === param ? isok : false;
      	});
      	if(isok){
      		emit(doc._id, {_id:doc.datatype, data:doc});
      	}
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
        //console.log("Query: success", success, collection);
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