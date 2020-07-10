'use strict';

function Groups($q, Slug, Data2, model, modelTransformer) {
  // AngularJS will instantiate a singleton by calling "new" on this function

  var groups = {};

  var self = {};

  self.getAll = function(){
  	return groups;
  };

  self.get = function(groupKey){
  	return groups[groupKey];
  };

  self.save = function(){
  	Data.saveLater({"groups": groups})
  };

  self.remove = function(group){
  	Data2.remove(group).then(function(success){
          console.log("Group removed: ", success);
          delete groups[group._id];
      }).catch(function(error){
          $log.error("groups.js : remove :", error);
      });
  };

  self.add = function(group){
  	group.code = Slug.slugify(group.name);
  	groups[group.code] = group;
  };


  self.load = function(){
    var deferred = $q.defer();
    // Load Data
    var map = function(doc, emit){
      if(doc.datatype === model.Group.datatype._id){
        emit(doc._id, {_id:doc.datatype, data:doc});
      } 
    };
    Data2.query(map, {include_docs : true}).then(function(success){
        angular.forEach(success.rows, function(data, rowIndex){
            var spec = data.doc;
            var obj = model.parse(data.value.data, spec);
            var group = modelTransformer.transform(obj, model.Group);
            groups[group._id] = group;
        });
        deferred.resolve(groups);
    }).catch(function(error){
        deferred.reject(error);
    });

    return deferred.promise;
  };

  return self;
}
Groups.$inject = ['$q', 'Slug', 'Data2', 'model', 'modelTransformer'];
angular.module('SchoolMan').service('Groups', Groups);