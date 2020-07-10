'use strict';

function Terms() {
    
    // AngularJS will instantiate a singleton by calling "new" on this function

    var terms = {
    	"0":{nameEn:"Term 1", nameFr: "Terme 1"},
    	"1":{nameEn:"Term 2", nameFr: "Terme 2"},	
    	"2":{nameEn:"Term 3", nameFr:"Terme 3"}
    };

    var self = {};

    self.getAll = function(){
    	return angular.copy(terms);
    };

    return self;

  }
// Terms.$inject = [];
angular.module('SchoolMan').service('Terms', Terms);
