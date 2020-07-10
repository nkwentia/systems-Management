'use strict';

function settings($q, model, Data2, EXTENSIONS) {

  console.log("model service", model);
  var settings = new model.Settings();

  var self = {};
  self.get = function(){
    return settings;
  }

  self.load = function(){
    var deferred = $q.defer();

    Data2.get('customer_settings').then(function(data){
      var spec = model.parse2(data, data.datatype);
      settings = new model.Settings(spec);
      deferred.resolve(settings);
    }).catch(function(error){
      if(error.status === 404){
        // use default
        deferred.resolve(settings);
      }
    })

    return deferred.promise;
  }
  self.availableExtensions = function(){
    var extensions = [];
    angular.forEach(EXTENSIONS, function(extension){
      extensions.push(extension);
    })
    return extensions;
  }

  return self;

}
settings.$inject = ['$q', 'model', 'Data2', 'EXTENSIONS'];
angular.module('SchoolMan').service('settings', settings);
