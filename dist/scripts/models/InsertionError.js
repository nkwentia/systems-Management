'use strict';

angular.module('SchoolMan')

  .value('InsertionError', (function(){

    // Create a new object, that prototypally inherits from the Error constructor.
    function InsertionError(objName, key) {
      this.name = "InsertionError";
      this.message = "InsertionError: value " + key + " already exists in object " + objName;
    }

    InsertionError.prototype = new Error();
    InsertionError.prototype.constructor = InsertionError;

    return InsertionError;

  })());
