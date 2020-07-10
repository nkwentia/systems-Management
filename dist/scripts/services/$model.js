'use strict';

function $model() {

  	var self = {};
    
    self.extend = function (dst) {
	  angular.forEach(arguments, function(obj) {
	    if (obj !== dst) {
	      angular.forEach(obj, function(value, key) {
	        if (dst[key] && dst[key].constructor && dst[key].constructor === Object) {
	          self.extend(dst[key], value);
	        } else {
	          dst[key] = value;
	        }  
	      });   
	    }
	  });
	  return dst;
	};

	return self;
  }
// $model.$inject = [];
angular.module('SchoolMan').service('$model', $model);
