'use strict';

var schoolman = angular.module('SchoolMan');

schoolman.config(['modelProvider', function(model){

  model.datatypes.fee = {
    v1:{
      type:"schema",
      _id:"datatype/fee/v1",
      fields:[{
        key:"name",
        type:"string",
        required:true
      },{
        key:"schoolAmount",
        type:"number",
        required:true
      },{
        key:"ptaAmount",
        type:"number",
        required:true
      }],
      fields_key:0
    }
  };

  // Constructor
  function Fee(spec){
    spec = spec || {};

    var self = this;

    // Prevents global namespace clobbering if you istantiate this object
    // without the 'new' keyword
    if (!(this instanceof Fee)) {
      return new Fee();
    }

    self.schoolAmount = spec.schoolAmount || "";        // string
    self.ptaAmount = spec.ptaAmount || "";
    self.name = spec.name || ""; 

    var listeners = [];
    self.notify = function(){
      angular.forEach(listeners, function(callback, $index){
        callback();
      });
    };
    self.onChange = function(callback){
      listeners.push(callback);
    };   
  }

  Fee.prototype = new model.Model();
  Fee.prototype.generateID = function(){
    var id = model.slugify(this.name);
    console.log("Slugified:", id);
    return id;
  }

  Fee.prototype.datatype = Fee.datatype = model.datatypes.fee.v1;


  model.Fee = Fee;

}]);
