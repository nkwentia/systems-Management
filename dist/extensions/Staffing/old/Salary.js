'use strict';

var schoolman = angular.module('SchoolMan');

schoolman.config(['modelProvider', function(model){

  model.datatypes.salary = {
    v1:{
      type:"schema",
      _id:"datatype/salary/v1",
      fields:[{
        key:"name",
        type:"string",
        required:true
      },{
        key:"salaryAmount",
        type:"number",
        required:true
      },{
        key:"socialinsuranceAmount",
        type:"number",
        required:true
      }],
      fields_key:0
    }
  };

  // Constructor
  function Salary(spec){
    spec = spec || {};

    var self = this;

    // Prevents global namespace clobbering if you istantiate this object
    // without the 'new' keyword
    if (!(this instanceof Salary)) {
      return new Salary();
    }

    self.salaryAmount = spec.salaryAmount || 0;        // string
    self.socialinsuranceAmount = spec.socialinsuranceAmount || 0;
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

  Salary.prototype = new model.Model();
  Salary.prototype.generateID = function(){
    var id = model.slugify(this.name);
    console.log("Slugified:", id);
    return id;
  }

  Salary.prototype.datatype = Salary.datatype = model.datatypes.salary.v1;


  model.Salary = Salary;

}]);
