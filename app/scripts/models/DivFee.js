'use strict';

var schoolman = angular.module('SchoolMan');

schoolman.config(['modelProvider', function(model){

  model.datatypes.divfee = {
    v1:{
      type:"schema",
      _id:"datatype/divfee/v1",
      fields:[{
        key:"name",
        type:"string",
        required:true
      },{
        key:"amount",
        type:"number",
        required:true
      },
      {
        key:"type",
        type:"string",
        required:true
      },
      {
        key:"division",
        type:"number",
        required:true
      },{
        key:"region",
        type:"number",
        required:true
      }],
      fields_key:0
    }
  };

  // Constructor
  function DivFee(spec){
    spec = spec || {};

    var self = this;

    // Prevents global namespace clobbering if you istantiate this object
    // without the 'new' keyword
    if (!(this instanceof DivFee)) {
      return new DivFee();
    }

    self.amount = "";        // string
    self.name = ""; 
    self.division = 0;
    self.region = 0;
    self.type = "gen1";
 
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
  DivFee.types = {
    gen1: {name:"General First Cycle"},
    gen2: {name:"General Second Cycle"},
    tech1: {name:"Technical First Cycle"},
    tech2: {name: "Technical Second Cycle"},
  }
  DivFee.prototype = new model.Model();
  DivFee.prototype.generateID = function(){
    var id = "divfee_"+this.name+"_"+this.type;
    console.log("Slugified:", id);
    return id;
  }

  DivFee.prototype.datatype = DivFee.datatype = model.datatypes.divfee.v1;


  model.DivFee = DivFee;

}]);
