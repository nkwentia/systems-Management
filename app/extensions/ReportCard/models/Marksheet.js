'use strict';

var schoolman = angular.module('SchoolMan');

schoolman.config(['modelProvider', function(model){

  model.datatypes.marksheet = {
    v1:{
      type:"schema",
      _id:"datatype/marksheet/v1",
      fields:[{
        key:"formIndex",
        type:"number",
        required:true
      },{
        key:"deptId",
        type:"string",
        required:true
      },{
        key:"groupId",
        type:"string",
        required:true
      },{
        key:"subjectId",
        type:"string",
        required:true
      },{
        key:"teacherId",
        type:"string",
        required:false
      },{
        key:"coeff",
        type:"number",
        required:true
      },{
        key:"table",
        type:"object",
        required:true
      }],
      fields_key:0
    }
  };

  // Constructor
  function Marksheet(spec){
    spec = spec || {};

    var self = this;

    // Prevents global namespace clobbering if you istantiate this object
    // without the 'new' keyword
    if (!(this instanceof Marksheet)) {
      return new Marksheet();
    }

    self._id;
    self.formIndex;
    self.deptId;
    self.groupId;
    self.subjectId;
    self.teacherId;
    self.coeff = 2;
    self.table = {};

    // Construct
    angular.forEach(spec, function(prop, propKey){
      self[propKey] = prop;
    });
    if(self._id && !(self.formIndex && self.deptId && self.groupId && self.subjectId)){
      var props = self._id.split(":");
      self.formIndex = props[0];
      self.deptId = props[1];
      self.groupId = props[2];
      self.subjectId = props[3];
    }

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

  Marksheet.prototype = new model.Model();
  Marksheet.prototype.normalize = function(){
    this.formIndex = parseInt(this.formIndex);
  }
  Marksheet.generateID = function(p){
      var id = p.formIndex + ":" + 
               p.deptId   + ":" +
               p.groupId  + ":" +
               p.subjectId    
      return id;
  };
  Marksheet.prototype.generateID = function(){
    Marksheet.generateID(this);
  };

  Marksheet.prototype.datatype = Marksheet.datatype = model.datatypes.marksheet.v1;

  Marksheet.prototype.db = Marksheet.db = "db_marksheets";

  model.Marksheet = Marksheet;

}]);
