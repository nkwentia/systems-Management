'use strict';

define(['modelTransformer'], function(modelTransformer){
function staffprofile($q, $rootScope, model, Data2, modelTransformer) {

    var self = {};

    self.getComments = function(staffId){

    	var deferred = $q.defer();

    	// Load Data
	    var map = function(doc, emit){
	      if(doc.datatype === model.Comment.datatype._id){
	      	if(model.parse(doc, model.Comment.datatype).staffId === staffId){
	      		emit(doc._id, {_id:doc.datatype, data:doc});
	      	}
	      } 
	    };
	    Data2.query(map, {include_docs : true}).then(function(success){
	    		var comments = {};
	        angular.forEach(success.rows, function(data, rowIndex){
	            var spec = data.doc;
	            var obj = model.parse(data.value.data, spec);
	            var comment = modelTransformer.transform(obj, model.Comment);
	            comments[comment._id] = comment;
	        });
	        console.log("Comments Query: succeeded", comments);
	        deferred.resolve(comments);
	    }).catch(function(error){
	        deferred.reject("Comments Query: failed", error);
	    });

	    return deferred.promise;
    };

    self.removeComment = function(comment){
    	var deferred = $q.defer();
    	Data2.remove(comment).then(function(success){
    		deferred.resolve(success);
    	}).catch(function(error){
    		$log.error("staffprofile.js : removeComment :", error);
        	deferred.reject(error);
    	});
    	return deferred.promise;
    }

    return self;

  }
staffprofile.$inject = ['$q', '$rootScope', 'model', 'Data2', 'modelTransformer'];
angular.module('SchoolMan').service('staffprofile', staffprofile);
})