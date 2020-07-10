'use strict';

var schoolman = angular.module('SchoolMan');

schoolman.config(['modelProvider', function(model){

  model.datatypes.school = {
    v1:{
      type:"schema",
      _id:"datatype/school/v1",
      fields:[{
        key:"id",
        type:"string",
        required:true
      },{
        key:"nameEn",
        type:"string",
        required:true
      },{
        key:"nameFr",
        type:"string",
        required:true
      },{
        key:"division",
        type:"string",
        required:true
      },
      {
        key:"version",
        type:"string",
        required:true
      },
      {
        key:"subdivision",
        type:"string",
        required:true
      },
      {
        key:"principal",
        type:"string",
        required:true
      },
      {
        key:"numFemaleCycle1",
        type:"number",
        required:true
      },
       {
        key:"numFemaleCycle2",
        type:"number",
        required:true
      },
      {
        key:"numMaleCycle1",
        type:"number",
        required:true
      },
      {
        key:"numMaleCycle2",
        type:"number",
        required:true
      },
       {
        key:"stats",
        type:"object",
        required:true
      },
      {
        key:"fees",
        type:"object",
        required:true
      }],
      fields_key:0
    }
  };
  var schema = model.datatypes.school.v1.fields;
  
  function School(spec){

    var spec = spec || {};

    // Prevents global namespace clobbering if you istantiate this object
    // without the 'new' keyword
    if (!(this instanceof School)) {
      return new School();
    }

    this.id = "";
    this.nameEn = ""; 
    this.nameFr = "";     // String
    this.division = ""; // Datetime integer
    this.subdivision = "";
    this.numFemale = 0;
    this.numMale = 0;
    this.numFemaleCycle1 = 0;
    this.numFemaleCycle2 = 0;
    this.numMaleCycle1 = 0;
    this.numMaleCycle2 = 0;
    this.principal = "";
    this.fees = {};
    this.version = "gen";
    this.stats = [];

    // Initialize object with spec properties, excluding any that aren't defined above
    var self = this;
    angular.forEach(spec, function(property, key){
      self[key] = property;
    });

    // callback functions
    var listeners = [];
    this.notify =  function(msg){
      // console.log("Marksheet notifying listeners: ", listeners);
      angular.forEach(listeners, function(callback, $index){
        // console.log("callback", callback);
        callback(msg);  
      });
    };
    this.onChange = function(callback){
      // console.log("Register listener");
      listeners.push(callback);
      // console.log("Listeners", listeners);
    };
        
  };
  School.versions = {
    tech: {name:"Technical"},
    gen: {name:"General"},
  }
  School.prototype = new model.Model();
  School.prototype.generateID = function(){
    var id = 'school_' + this.id;
    return id;
  }
  School.prototype.normalize = function(){
    this._id = this.generateID();
  };
  School.prototype.datatype = School.datatype = model.datatypes.school.v1;

  model.School = School;

}]);
