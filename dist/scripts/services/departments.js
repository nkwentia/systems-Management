'use strict';

function Departments($q, Data2, model, modelTransformer, InsertionError) {

	var departments = {};  	

	var self = {};

	self.getAll = function(){
    // angular.copy exceeds call stack and I don't think we need to copy each 
    // dept, so instead we just create a new dict
    var copy = {};
    angular.forEach(departments, function(dept, deptKey){
      copy[deptKey] = dept;
    });
    return copy;
	};

	self.get = function(departmentKey){
		return departments[departmentKey];
	};

  self.set = function(dept, key){
    departments[key] = dept;
  }

	self.add = function(department){
		console.log("inside department add function");
    if(departments.hasOwnProperty(department.code)){
			throw new InsertionError("departments", department.code);
		} else {
			departments[department.code] = department;
      console.log("added department");
		}
	};

  self.remove = function(department){
    var deferred = $q.defer();
    Data2.remove(department).then(function(success){
      console.log("Department removed: ", success);
      delete departments[department._id];
      deferred.resolve(success);
    }).catch(function(error){
      $log.error("departments.js : remove :", error);
      deferred.reject(error);
    });
    return deferred.promise;
  };

	self.save = function(){
		Data.saveLater({departments: departments});
	};

  self.load = function(){
    var deferred = $q.defer();
    // Load Data
    var map = function(doc, emit){
      if(doc.datatype === model.Department.datatype._id){
        emit(doc._id, {_id:doc.datatype, data:doc});
      } 
    };
    Data2.query(map, {include_docs : true}).then(function(success){
      angular.forEach(success.rows, function(data, rowIndex){
        var spec = data.doc;
        var obj = model.parse(data.value.data, spec);
        var department = modelTransformer.transform(obj, model.Department);
        departments[department._id] = department;
        });
        console.log("Departments:Query success", departments);
        deferred.resolve(departments);
      }).catch(function(error){
        console.log("Departments: Query failed", error);
        deferred.reject(error);
    });

    return deferred.promise;
  }

  return self;

}
Departments.$inject = ['$q', 'Data2', 'model', 'modelTransformer', 'InsertionError'];
angular.module('SchoolMan').service('Departments', Departments);