'use strict';

function DivFees($q, Slug, model, Data2, modelTransformer, InsertionError, $log) {
    
    var divfees = {};

    var self = {};

    self.get = function(divfeeKey){
        return divfees[divfeeKey];
    };
    self.set = function(fee, key){
      divfees[key] = fee;
    }

    self.getAll = function(){
    	return divfees;
    };
    self.queryType = function(type){
        var fees = {};
        console.log("Fees in RAM", divfees)
          angular.forEach(divfees,function(fee,key){
            console.log("query type:", type, fee.type);
            if (fee.type === type ){
              fees [key] = fee ;
            }
          })
          return fees;

    }

    self.remove = function(divfee){
        Data2.remove(divfee).then(function(success){
            console.log("DivFee removed: ", success);
            delete divfees[divfee._id];
        }).catch(function(error){
            $log.error("divfees.js : remove :", error);
        });
    };

    self.load = function(){
      
      var deferred = $q.defer();

      // Load Data
      var map = function(doc, emit){
        if(doc.datatype === model.DivFee.datatype._id){
          emit(doc._id, {_id:doc.datatype, data:doc});
        } 
      };
      Data2.query(map, {include_docs : true}).then(function(success){
          angular.forEach(success.rows, function(data, rowIndex){
              var spec = data.doc;
              var obj = model.parse(data.value.data, spec);
              var divfee = modelTransformer.transform(obj, model.DivFee);
              divfees[divfee._id] = divfee;
          });
          deferred.resolve(divfees);
      }).catch(function(error){
        console.log("Failed to load DivFees: ", error);
        deferred.reject(error);
      });

      return deferred.promise;
    };


    return self;

  }
DivFees.$inject = ['$q', 'Slug', 'model', 'Data2', 'modelTransformer', 'InsertionError', '$log'];
angular.module('SchoolMan').service('DivFees', DivFees);