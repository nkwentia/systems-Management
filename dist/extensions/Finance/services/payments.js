'use strict';

function Payments($q, pouchdb, model, modelTransformer, Students) {

	var db = model.Payment.db;
  if(typeof db === "string"){
    db = pouchdb.create(model.Payment.db);
  }

	self = {};

	self.getAll = function(){
		var deferred = $q.defer();

		var map = function(doc, emit){
			var dataModel = model.Payment;
      if(doc.datatype === dataModel.datatype._id){
      	var obj = model.parse(doc, dataModel.datatype);
      	emit(doc._id, {_id:obj.studentId, data:doc});
      } 
    };

		db.query(map, {include_docs : true}).then(function(success){
			  var collection = {};
			  var dataModelStudent = model.Student;
			  var dataModelPayment = model.Payment;
        console.log("Payments Success: ", success);
			  angular.forEach(success.rows, function(data, $index){
			  	
			  	var studentId = data.value._id;
			  	if(!collection.hasOwnProperty(studentId)){
			  		var student = Students.get(studentId);
                student.payments = [];
			  		collection[studentId] = student;
			  	};
			  	var payment = model.parse(data.value.data, dataModelPayment.datatype);
			  	collection[studentId].payments.push(payment);
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
  	var dataModel = model.Payment;

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

  self.removePayments = function(payments){
      angular.forEach(payments, function(payment, paymentId){
        db.remove(payment).then(function(success){
          console.log("Payment removed: ", success);
        }).catch(function(error){
          $log.error("payments.js : remove :", error);
        });
      })
  };

  self.destroy = function(){
  	db.destroy().then(function(success){
  		console.log("Destroyed paymentss db");
  	}).catch(function(error){
  		console.log("failed to destroy payments db", error)
  	});
  }

  return self;
}
Payments.$inject = ['$q', 'pouchdb', 'model', 'modelTransformer', 'Students'];
angular.module('SchoolMan').service('Payments', Payments);