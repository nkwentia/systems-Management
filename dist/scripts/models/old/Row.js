'use strict';

angular.module('SchoolMan')

 /**
  * @ngdoc object
  * @name SchoolMan.object:Row
  * @property {int} timestamp timestamp
  * @property {int} value timestamp
  * @param {array} marks this takes as an argument a list of mark object literals e.g. as would be loaded from JSON
  * @method {function} getValidationStatus
  * @method {function} save
  * @method {function} onChange
  * @description
  *
  * A Row contains the history of marks. It can save a new mark, validate an
  * input and notify listeners onChange
  */


  .value('Row', (function(){
 

    // Constructor
    function Row(){
      // Prevents global namespace clobbering if you istantiate this object
      // without the 'new' keyword
      if (!(this instanceof Row)) {
        return new Row();
      }

      // Contains a list of 6 cells, two for each term.
      this.columns = [];
      this.studentId = "";
      this.ranking = [0,0,0,0];

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


    Row.prototype.getAverage = function(term){

      var total = 0;
      var count = 0;

      var columns = this.columns;
      if(term && term !== 3){
        columns = [this.columns[term * 2], this.columns[(term * 2) + 1]]
      }

      angular.forEach(columns, function(cell, cellIndex){
        if(cell.mark === parseFloat(cell.mark)){
          total += parseFloat(cell.mark);
          count += 1;
        }
      });
      return total / count;
    };


    Row.prototype.onLoad = function(){
      var self = this;
      angular.forEach(this.columns, function(cell, cellIndex){
        cell.onChange(function(msg){
          var msg = "cell " + cellIndex + " changed : " + msg;
          self.notify(msg);
        })
      });
    };

    return Row;

  })());
