'use strict';

function Fees($log, $q, Slug, model, Data2, modelTransformer, InsertionError) {
  
  var fees = {};

  var self = {};

  self.get = function(feeKey){
      return fees[feeKey];
  };

  self.getAll = function(){
  	return fees;
  };

  self.remove = function(fee){
      Data2.remove(fee).then(function(success){
          console.log("Fee removed: ", success);
          delete fees[fee._id];
      }).catch(function(error){
          $log.error("fees.js : remove :", error);
      });
  };

  self.load = function(){
    
    var deferred = $q.defer();

    // Load Data
    var map = function(doc, emit){
      if(doc.datatype === model.Fee.datatype._id){
        emit(doc._id, {_id:doc.datatype, data:doc});
      } 
    };
    Data2.query(map, {include_docs : true}).then(function(success){
        angular.forEach(success.rows, function(data, rowIndex){
            var spec = data.doc;
            var obj = model.parse(data.value.data, spec);
            var fee = modelTransformer.transform(obj, model.Fee);
            fees[fee._id] = fee;
        });
        deferred.resolve(fees);
    }).catch(function(error){
      console.log("Failed to load Fees: ", error);
      deferred.reject(error);
    });

    return deferred.promise;
  };


  return self;

}
Fees.$inject = ['$log', '$q', 'Slug', 'model', 'Data2', 'modelTransformer', 'InsertionError'];
angular.module('SchoolMan').service('Fees', Fees);