'use strict';

function Cache() {
    
    var self = {};
    self.cache = {};
    
    self.set = function(params){
    	angular.forEach(params, function(param, paramKey){
    		self.cache[paramKey] = param;
    	});
    };

    self.get = function(key){
        var data = undefined;
        if(self.cache.hasOwnProperty(key)){
            data = self.cache[key]
        }
    	return data;
    };

    return self;
  }
// Cache.$inject = [];
angular.module('SchoolMan').service('Cache', Cache);
