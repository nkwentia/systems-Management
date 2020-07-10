'use strict';

function Dcards($q, Data2, model) {

  	var self = {};

  	var modelFrom = function(data){
  			var spec = model.parse2(data, data.datatype);
  			var dcard = new model.Dcard(spec);
        return dcard
  	};

  	var getOrCreate = function(tempDcard){
  		var deferred = $q.defer();
  		Data2.get(tempDcard.generateID()).then(function(data){
  			deferred.resolve(modelFrom(data));
  		}).catch(function(error){
  			if(error.status = 404){
  				tempDcard.save().then(function(success){
  					deferred.resolve(tempDcard);
  				}).catch(function(error){
  					deferred.reject(error);
  				});
  			} else{
  				deferred.reject(error);
  			}
  		});
  		return deferred.promise;
  	}

  	self.get = function(studentId){
  		var tempDcard = new model.Dcard({
  			studentId:studentId,
  			year:"2014"
  		});
  		return getOrCreate(tempDcard);
  	};

    self.remove = function(dcard){  
        Data2.remove(dcard).then(function(success){
          console.log("Dcard removed: ", success);
        }).catch(function(error){
          $log.error("dcards.js : remove :", error);
        });
    };

  	return self;

}
Dcards.$inject = ['$q', 'Data2', 'model'];
angular.module('SchoolMan').service('Dcards', Dcards);