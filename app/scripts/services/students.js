'use strict';

function Students($q, model, pouchdb) {

	var db = model.Student.db;
  if(typeof db === "string"){
    db = pouchdb.create(model.Student.db);
  }

	var _students = {};

	self = {};

	var dataModel = model.Student;
	
	console.log("Students data model", dataModel.datatype);

	self.set = function(student){
		_students[student._id] = student;
	};

	// self.getBatch = function(studentIds){

	// 	var deferred = $q.defer();

	// 	db.get(dataModel.datatype._id).then(function(spec){
	// 		db.allDocs({keys:studentIds, include_docs: true})
  // 			.then(function(docs){
  // 				var students = _.map(docs.rows, function(data){
  //           var obj = model.parse(data.doc, spec);
  //           var item = modelTransformer.transform(obj, dataModel);
  // 					return item
  // 				});
	 //        deferred.resolve(students);
	 //    }).catch(function(error){
	 //        deferred.reject(error);
	 //    });
	// 	}).catch(function(error){
	// 		deferred.reject(error);
	// 	})
		
	// 	return deferred.promise;
	// }

  self.getBatch = function(studentIds){

    var deferred = $q.defer();

    var students = [];
    angular.forEach(studentIds, function(id, index){
      if(_students[id]){
        students.push(_students[id]);
      }
    });

    deferred.resolve(students);
    
    return deferred.promise;
  }

	self.saveBatch = function(students){
		var deferred = $q.defer();
		var batch = {docs:_.map(students, function(student){
			student.normalize();
			return student.saveable();
		})};
		console.log("Saving batch: ", batch);
		db.bulkDocs(batch).then(function(success){
			console.log("Students service saved batch", success);
			deferred.resolve(success);
			_students = _.reduce(students, function(_students, student){
				_students[student._id] = student;
				return _students;
			}, _students)
		}).catch(function(error){
			deferred.reject(error);
		});
		return deferred.promise;
	};


// 	var studentsIndex = {
	//   _id: '_design/students',
	//   views: {
	//     'students': {
	//       map : function(doc, emit){
	// 	      if(doc.datatype === dataModel.datatype._id){
	// 	      	var obj = model.parse(doc, dataModel.datatype);
	// 	      	var isok= true;
	// 	      	angular.forEach(params, function(param, paramKey){
	// 	      		isok = obj[paramKey] === param ? isok : false;
	// 	      	});
	// 	      	if(isok){
	// 	      		emit(doc._id, {_id:doc.datatype, data:doc});
	// 	      	}
	// 	      } 
	// 	    }.toString()
	//     }
	//   }
	// };

	// console.log("View: ", studentsIndex); 

	// db.put(studentsIndex).then(function () {
	//   // kick off an initial build, return immediately
	//   return db.query('studentsIndex', {stale: 'update_after'});
	// });

	// self.query = function(params){
  	
 //  	var deferred = $q.defer();

  	// var paramDict = {};
  	// angular.forEach(dataModel.datatype.fields, function(field, index){
  	// 	if(params.hasOwnProperty(field.key)){
  	// 		return paramDict[index] = params[field.key];
  	// 	}
  	// });

  	// console.log("Students Param Dict", paramDict);

   //  var map = function(doc, emit){
   //    if(doc.datatype === dataModel.datatype._id){
   //    	var obj = model.parse(doc, dataModel.datatype);
   //    	var isok= true;
   //    	angular.forEach(params, function(param, paramKey){
   //    		isok = obj[paramKey] === param ? isok : false;
   //    	});
   //    	if(isok){
   //    		emit(doc._id, {_id:doc.datatype, data:doc});
   //    	}
   //    } 
   //  };

   //  var getSeconds = function(_initial, _final){
  //     return (_final.getTime() - _initial.getTime())/1000;
  //   }

  //   var START_QUERY = new Date();

   //  db.query(studentsIndex, {include_docs : true}).then(function(success){
    
   //  var END_QUERY = new Date();
    
  //   console.log("Studetns Service TIME DIFF: ", getSeconds(START_QUERY, END_QUERY));

   //  		var collection = [];
   //      angular.forEach(success.rows, function(data, rowIndex){
   //          var spec = data.doc;
   //          var obj = model.parse(data.value.data, spec);
   //          var item = modelTransformer.transform(obj, dataModel);
   //          collection.push(item);
   //      });
   //      deferred.resolve(collection);
   //  }).catch(function(error){
   //      deferred.reject(error);
   //  });

  // 	return deferred.promise;
  // };

  self.query = function(params){
    params = params || {};

  	var deferred = $q.defer();
  	var students = _.map(Object.keys(_students), function(studentId){
  		return _students[studentId];
  	});
    var filtered = [];

    if(Object.keys(params).length > 0){
    	filtered = _.filter(students, function(student){
    		var isOk = true;
    		angular.forEach(params, function(param, key){
    			if(student[key] !== String(param)){
    				isOk = false;
    			}
    		});
    		return isOk;
    	})
    } else {
      filtered = students;
    };
   //  console.log("Filtering students", params, _students);
  	// console.log("Filtered students", params, filtered);
  	deferred.resolve(filtered);
  	return deferred.promise;
  };


  self.get = function(studentId){
    var deferred = $q.defer();
    if(_students.hasOwnProperty(studentId)){
      deferred.resolve(_students[studentId]);
    }else{
      deferred.reject("Student does not exist");
    }
    return deferred.promise;
  };

  self.load = function(){
  	var deferred = $q.defer();

  	db.allDocs({starKey:'student_', endKey:'student__'})

  	.then(function(collection){
      var keys = _.map(collection.rows, function(obj){
        return obj.key;
      });
      console.log("Got keys", keys);
      deferred.resolve(_students);
      return keys
    })

    .then(function(keys){

      angular.forEach(keys, function(key, index){
        db.get(key).then(function(data){
          var student = model.parse(data, dataModel.datatype);
          student = new model.Student(student);
          _students[student._id] = student;
        }).catch(function(error){
          console.log("Failed to get student", error);
        });
      });

      deferred.resolve(_students);

    })

    .catch(function(error){
  		deferred.reject(error);
  	});

  	return deferred.promise;

  };
  self.getClasses = function(formIndex, flags){
    var collection = {};
    angular.forEach(_students, function(student, studentId){
      if(student.formIndex === formIndex){
        var id = [formIndex, student.deptId, student.groupId];
        if(!collection.hasOwnProperty(id)){
          collection[id] = {formIndex:formIndex, deptId:student.deptId, groupId:student.groupId};
        }
      }
    });
    return collection;
  }

  self.remove = function(student){
    var deferred = $q.defer();
    db.remove(student).then(function(success){
      console.log("Student removed: ", success);
      delete _students[student._id];
      deferred.resolve(success);
    }).catch(function(error){
      $log.error("students.js : remove :", error);
      deferred.reject(error);
    });
    return deferred.promise;
  };

  

  self.destroy = function(){
  	db.destroy().then(function(success){
  		console.log("Destroyed students db");
  	}).catch(function(error){
  		console.log("failed to destroy studetns db", error)
  	});
  }


  self.getAll = self.query;

  return self;
}
Students.$inject = ['$q', 'model', 'pouchdb'];
angular.module('SchoolMan').service('Students', Students);
