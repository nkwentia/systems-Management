'use strict';

function Subjects($q, Data2, model, modelTransformer, InsertionError) {

	var subjects = {};  	

	var self = {};

	self.getAll = function(){
		return subjects;
	};

	self.get = function(subjectKey){
		return subjects[subjectKey];
	};

  self.remove = function(subject){
    Data2.remove(subject).then(function(success){
      console.log("Subject removed: ", success);
      delete subjects[subject._id];
    }).catch(function(error){
      $log.error("subjects.js : remove :", error);
    });
  };

  self.load = function(){
    var deferred = $q.defer();
    // Load Data
    var map = function(doc, emit){
      if(doc.datatype === model.Subject.datatype._id){
        emit(doc._id, {_id:doc.datatype, data:doc});
      } 
    };
    Data2.query(map, {include_docs : true}).then(function(success){
        console.log("Subjects:Data success", success);
      angular.forEach(success.rows, function(data, rowIndex){
        var spec = data.doc;
        var obj = model.parse(data.value.data, spec);
        var subject = modelTransformer.transform(obj, model.Subject);
        subjects[subject._id] = subject;
        });
        console.log("Subjects:Query success", subjects);
        deferred.resolve(subjects);
      }).catch(function(error){
        console.log("Subjects: Query failed", error);
        deferred.reject(error);
    });

    return deferred.promise;
  }

  return self;

}
Subjects.$inject = ['$q', 'Data2', 'model', 'modelTransformer', 'InsertionError'];
angular.module('SchoolMan').service('Subjects', Subjects);