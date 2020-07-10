'use strict';

function staff($q, model, Data2,$log, modelTransformer) {

	var _stafflist = {};

	self = {};

	var dataModel = model.Staff;
	
	console.log("Staffs data model", dataModel.datatype);

	self.set = function(staff){
		_stafflist[staff._id] = staff;
	};

  // self.getBatch = function(staffIds){

  //   var deferred = $q.defer();

  //   var staffs = [];
  //   angular.forEach(staffIds, function(id, index){
  //     if(_staffs[id]){
  //       staffs.push(_staffs[id]);
  //     }
  //   });

  //   deferred.resolve(staffs);
    
  //   return deferred.promise;
  // }

	// self.saveBatch = function(staffs){
	// 	var deferred = $q.defer();
	// 	var batch = {docs:_.map(staffs, function(staff){
	// 		staff.normalize();
	// 		return staff.saveable();
	// 	})};
	// 	console.log("Saving batch: ", batch);
	// 	Data2.bulkDocs(batch).then(function(success){
	// 		console.log("Staffs service saved batch", success);
	// 		deferred.resolve(success);
	// 		_staffs = _.reduce(staffs, function(_staffs, staff){
	// 			_staffs[staff._id] = staff;
	// 			return _staffs;
	// 		}, _staffs)
	// 	}).catch(function(error){
	// 		deferred.reject(error);
	// 	});
	// 	return deferred.promise;
	// };




  self.query = function(params){
    params = params || {};

  	var deferred = $q.defer();
  	var staffs = _.map(Object.keys(_stafflist), function(staffId){
  		return _staffs[staffId];
  	});
    var filtered = [];

    if(Object.keys(params).length > 0){
    	filtered = _.filter(staffs, function(staff){
    		var isOk = true;
    		angular.forEach(params, function(param, key){
    			if(staff[key] !== String(param)){
    				isOk = false;
    			}
    		});
    		return isOk;
    	})
    } else {
      filtered = staffs;
    };
  	deferred.resolve(filtered);
  	return deferred.promise;
  };


  self.get = function(staffKey){
    return _staffs[staffKey];
  };

   self.load = function(){
    var deferred = $q.defer();
    // Load Data
    var map = function(doc, emit){
      if(doc.datatype === model.Staff.datatype._id){
        emit(doc._id, {_id:doc.datatype, data:doc});
      } 
    };
    Data2.query(map, {include_docs : true}).then(function(success){
      angular.forEach(success.rows, function(data, rowIndex){
        var spec = data.doc;
        var obj = model.parse(data.value.data, spec);
        var staff = modelTransformer.transform(obj, model.Staff);
        _staffs[staff._id] = staff;
        });
        console.log("Staffs:Query success", _staffs);
        deferred.resolve(_staffs);
      }).catch(function(error){
        console.log("Staffs: Query failed", error);
        deferred.reject(error);
    });

    return deferred.promise;
  }
  self.getClasses = function(formIndex, flags){
    var collection = {};
    angular.forEach(_staffs, function(staff, staffId){
      if(staff.formIndex === formIndex){
        var id = [formIndex, staff.deptId, staff.groupId];
        if(!collection.hasOwnProperty(id)){
          collection[id] = {formIndex:formIndex, deptId:staff.deptId, groupId:staff.groupId};
        }
      }
    });
    return collection;
  }


  self.remove = function(staff){
    var deferred = $q.defer();
    Data2.remove(staff).then(function(success){
      console.log("Staff removed: ", success);
      delete _staffs[staff._id];
      deferred.resolve(success);
    }).catch(function(error){
      $log.error("staffs.js : remove :", error);
      deferred.reject(error);
    });
    return deferred.promise;
  };

  self.getAll = function(){
    // angular.copy exceeds call stack and I don't think we need to copy each 
    // dept, so instead we just create a new dict
    var copy = {};
    angular.forEach(_staffs, function(staff, staffKey){
      copy[staffKey] = staff;
    });
    return copy;
  };

  return self;
}
Staffs.$inject = ['$q', 'model', 'Data2','$log', 'modelTransformer'];
angular.module('SchoolMan').service('staff', staff);