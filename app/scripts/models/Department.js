'use strict';

angular.module('SchoolMan')

 schoolman.config(['modelProvider', function(model){

  model.datatypes.department = {
    v1:{
      type:"schema",
      _id:"datatype/department/v1",
      fields:[{
        key:"code",
        type:"string",
        required:true
      },{
        key:"name",
        type:"string",
        required:true
      },{
        key:"forms",
        type:"object",
        required:true
      }],
      fields_key:0
    }
  };

    // Constructor
    function Department(spec){
      spec = spec || {};

      var self = this;

      // Prevents global namespace clobbering if you istantiate this object
      // without the 'new' keyword
      if (!(this instanceof Department)) {
        return new Department();
      }

      self.code = spec.code || "";        // string
      self.name = spec.name || "";        // string
      self.forms= {
        0:1,
        1:1,
        2:1,
        3:1,
        4:1,
        5:1,
        6:1
      };
      if(spec.hasOwnProperty("forms")){
        angular.forEach(spec.forms, function(bool, formKey){
          self.forms[formKey] = bool;
        });  
      };

      var listeners = [];
      self.notify = function(){
        angular.forEach(listeners, function(callback, $index){
          callback();
        });
      };
      self.onChange = function(callback){
        listeners.push(callback);
      };
      
    };
    Department.prototype = new model.Model();
    Department.prototype.generateID = function(){
      var id = "dept_" + model.slugify(this.code);
      return id;
    }
    Department.prototype.toggleForm = function(formIndex){
      this.forms[formIndex] = (this.forms[formIndex] + 1) % 2;
      return this;
    };

    
    Department.prototype.datatype = Department.datatype = model.datatypes.department.v1;

    model.Department = Department;
  }]);
