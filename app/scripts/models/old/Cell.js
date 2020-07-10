'use strict';

angular.module('SchoolMan')

 /**
  * @ngdoc object
  * @name SchoolMan.object:Cell
  * @property {int} mark this is actually just the value of the last mark in the history, it is not a mark object
  * @param {array} marks this takes as an argument a list of mark object literals e.g. as would be loaded from JSON
  * @method {function} getValidationStatus
  * @method {function} save
  * @method {function} onChange
  * @description
  *
  * A cell contains the history of marks. It can save a new mark, validate an
  * input and notify listeners onChange
  */
  .value('Cell', (function(){    

    // Constructor
    function Cell(d){
      // Prevents global namespace clobbering if you istantiate this object
      // without the 'new' keyword
      if (!(this instanceof Cell)) {
        return new Cell();
      }

      // d should be an array of objects
      // [{value:20, timeastamp:1395078352785}, ...]
      // TODO: make a class for this object
      this.history = d || [];

      // the value of the latest mark
      this.mark = "";
      if(this.history.length > 0){
        this.mark = angular.copy(this.history[this.history.length - 1].value) || "";
      }

      // callback functions
      var listeners = [];
      this.notify =  function(msg){
        angular.forEach(listeners, function(callback, $index){
          callback(msg);  
        });
      };
      this.onChange = function(callback){
        listeners.push(callback);
      };
      
    };


   /**
    * @ngdoc method
    * @name Schoolman.object:Cell#getValidationStatus
    * @methodOf SchoolMan.object:Cell
    * @returns {string} This returns a string that is formatted like a css class name
    * @description
    *
    * This method returns whether or not the current mark value is valid
    */
    Cell.prototype.getValidationStatus = function(){
      return this.mark > 20 ? "number-invalid" : "number-valid";
    }


   /**
    * @ngdoc method
    * @name Schoolman.object:Cell#save
    * @methodOf SchoolMan.object:Cell
    * @description
    *
    * This method takes the current value in mark, generates a timestamp, and 
    * creates a new Mark object with those values. It then saves that object 
    * to history
    */
    Cell.prototype.save = function(){

      // If Cell has actually changed
      if(this.mark !== this.history[this.history.length-1].value){

        // Marks are stored as floats but are converted to string onEdit. 
        // Convert back to float.
        this.mark = parseFloat(this.mark); 

        this.history.push({value:this.mark, timestamp:Date.now()});
        // console.log("Saving Cell", self);

        // Notify any listeners
        this.notify("Mark changed to " + this.mark);
      }
      
    };

    return Cell;

  })());
