'use strict';

angular.module('SchoolMan')

 /**
  * @ngdoc object
  * @name SchoolMan.object:Mark
  * @property {int} mark this is actually just the value of the last mark in the history, it is not a mark object
  * @param {array} marks this takes as an argument a list of mark object literals e.g. as would be loaded from JSON
  * @method {function} getValidationStatus
  * @method {function} save
  * @method {function} onChange
  * @description
  *
  * A Mark contains the history of marks. It can save a new mark, validate an
  * input and notify listeners onChange
  */
  .value('Mark', (function(){

    // Constructor
    function Mark(){

      // Prevents global namespace clobbering if you istantiate this object
      // without the 'new' keyword
      if (!(this instanceof Mark)) {
        return new Mark();
      }

      this.value = "";        // Float
      this.timestamp = null;  // int / Datetime
      this.username = "";     // string
      
    };

    return Mark;

  })());
