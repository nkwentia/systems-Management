'use strict';

var schoolman = angular.module('SchoolMan');

schoolman.config(['modelProvider', function(model){



  function ClassCouncil(spec){
    spec = spec || {};

    // Prevents global namespace clobbering if you istantiate this object
    // without the 'new' keyword
    if (!(this instanceof ClassCouncil)) {
      return new ClassCouncil(spec);
    }

    this.is("classcouncil.v1");

    var val = this.val.bind(this); var required = true;

    this[ val ('formIndex : number', required)] = 0;
    this[ val ('deptId : string', required)] = "";
    this[ val ('groupId : string', required)] = "";
    this[ val ('passingScore : number')] = 10;
    this[ val ('academicRemark : object')] = [];
    this[ val ('conductRemark : string')] = "";
    this[ val ('factors : object')] = [];
    this[ val ('classMaster : string')] = "";

    this.__init__(spec);
  }

  ClassCouncil.prototype = new model.Model();

  ClassCouncil.prototype.normalize = function(){
    this.formIndex = parseInt(this.formIndex);
  }
  ClassCouncil.generateID = function(p){
        var id = "council_" + p.formIndex + "_" + p.deptId + "_" + p.groupId;
        return id;
  }
  ClassCouncil.prototype.generateID = function(){
    return ClassCouncil.generateID(this);
  }

  
  
  model.ClassCouncil = ClassCouncil;

}]);
 