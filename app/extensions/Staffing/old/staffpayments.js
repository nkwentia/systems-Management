'use strict';
define(['modelTransformer', 'Salarys', 'Staffs'], function(modelTransformer, Salarys, Staffs){
function Staffpayments($q, model, pouchdb, modelTransformer, Salarys, Staffs) {

  	var db = model.Staffpayment.db;
    if(typeof db === "string"){
      db = pouchdb.create(model.Staffpayment.db);
    }

  	self = {};

  	self.getAll = function(){
  		var deferred = $q.defer();

  		var map = function(doc, emit){
  			var dataModel = model.Staffpayment;
	      if(doc.datatype === dataModel.datatype._id){
	      	var obj = model.parse(doc, dataModel.datatype);
	      	emit(doc._id, {_id:obj.staffId, data:doc});
	      } 
	    };

  		db.query(map, {include_docs : true}).then(function(success){
  			  var collection = {};
  			  var dataModelStaff = model.Staff;
  			  var dataModelStaffpayment = model.Staffpayment;
          console.log("Staffpayments Success: ", success);
  			  angular.forEach(success.rows, function(data, $index){
  			  	
  			  	var staffId = data.value._id;
  			  	if(!collection.hasOwnProperty(staffId)){
  			  		var staff = Staffs.get(staffId);
                  staff.staffpayments = [];
  			  		collection[staffId] = staff;
  			  	};
  			  	var payment = model.parse(data.value.data, dataModelStaffpayment.datatype);
  			  	collection[staffId].staffpayments.push(staffpayment);
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
    	var dataModel = model.Staffpayment;

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
    		console.log("Destroyed staffpaymentss db");
    	}).catch(function(error){
    		console.log("failed to destroy staffpayments db", error)
    	});
    }

    return self;
  }
Staffpayments.$inject = ['$q', 'model', 'pouchdb', 'modelTransformer', 'Salarys', 'Staffs'];
angular.module('SchoolMan').register.service('Staffpayments', Staffpayments);
})