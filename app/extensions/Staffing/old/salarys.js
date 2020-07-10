'use strict';
define(['modelTransformer', 'InsertionError'], function(modelTransformer, InsertionError){
function Salarys($q, Slug, model, Data2, $log, modelTransformer, InsertionError) {
    
    var salarys = {};

    var self = {};

    self.get = function(salaryKey){
        return salarys[salaryKey];
    };

    self.getAll = function(){
    	return salarys;
    };

    self.remove = function(salary){
        Data2.remove(salary).then(function(success){
            console.log("Salary removed: ", success);
            delete salarys[salary._id];
        }).catch(function(error){
            $log.error("salarys.js : remove :", error);
        });
    };

    self.load = function(){
      
      var deferred = $q.defer();

      // Load Data
      var map = function(doc, emit){
        if(doc.datatype === model.Salary.datatype._id){
          emit(doc._id, {_id:doc.datatype, data:doc});
        } 
      };
      Data2.query(map, {include_docs : true}).then(function(success){
          angular.forEach(success.rows, function(data, rowIndex){
              var spec = data.doc;
              var obj = model.parse(data.value.data, spec);
              var salary = modelTransformer.transform(obj, model.Salary);
              salarys[salary._id] = salary;
          });
          deferred.resolve(salarys);
      }).catch(function(error){
        console.log("Failed to load Salarys: ", error);
        deferred.reject(error);
      });

      return deferred.promise;
    };


    return self;

  }
Salarys.$inject = ['$q', 'Slug', 'model', 'Data2', '$log', 'modelTransformer', 'InsertionError'];
angular.module('SchoolMan').service('Salarys', Salarys);
})