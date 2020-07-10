'use strict';

var schoolman = angular.module('SchoolMan');

schoolman.config(['modelProvider', function(model){

  model.datatypes.staff = {
    v1:{
      type:"schema",
      _id:"datatype/staff/v1",
      fields:[{
        key:"id",
        type:"string",
        required:true
      },{
        key:"name",
        type:"string",
        required:true
      },{
        key:"sex",
        type:"string",
        required:true
      },{
        key:"staffEmail",
        type:"string",
        required:false
      },{
        key:"salary",
        type:"number",
        required:true
      },{
        key:"residence",
        type:"string",
        required:false
      },
      {
        key:"matricalno",
        type:"string",
        required:false
      },
      {
        key:"maritalstatus",
        type:"string",
        required:false
      },
      {
        key:"birth",
        type:"object",
        required:false
      },
      {
        key:"grade",
        type:"string",
        required:false
      },
      {
        key:"qualification",
        type:"string",
        required:false
      },
      {
        key:"subdivision",
        type:"string",
        required:false
      },
      {
        key:"division",
        type:"string",
        required:false
      },{
        key:"dateofentry",
        type:"object",
        required:false
      },{
        key:"specialty",
        type:"string",
        required:false
      },{
        key:"tribe",
        type:"string",
        required:false
      },{
        key:"dateposted",
        type:"object",
        required:false
      },{
        key:"dutypost",
        type:"string",
        required:false
      },
      {
        key:"region",
        type:"string",
        required:false
      },
      {
        key:"phoneNo",
        type:"string",
        required:false
      }],
      fields_key:0
    }
  };
  var schema = model.datatypes.staff.v1.fields;
  
  function Staff(spec){

    var spec = spec || {};

    // Prevents global namespace clobbering if you istantiate this object
    // without the 'new' keyword
    if (!(this instanceof Staff)) {
      return new Staff();
    }

    this.id = "";
    this.name ="";
    this.sex = "";     // String
    this.staffEmail = "";
    this.salary = 0;
    this.residence = "";
    this.matricalno = "";
    this.maritalstatus = "";
    this.birth = null; // Datetime integer
    this.post = "";
    this.grade = "";
    this.qualification = "";
    this.subdivision = "";
    this.division = "";
    this.dateofentry=null;
    this.specialty = "";
    this.tribe = "";
    this.dateposted = null;
    this.dutypost = "";
    this.region="";
    this.phoneNo = "";

    // Initialize object with spec properties, excluding any that aren't defined above
    var self = this;
    angular.forEach(spec, function(property, key){
      self[key] = property;
    });

    // callback functions
    var listeners = [];
    this.notify =  function(msg){
      console.log("Marksheet notifying listeners: ", listeners);
      angular.forEach(listeners, function(callback, $index){
        console.log("callback", callback);
        callback(msg);  
      });
    };
    this.onChange = function(callback){
      // console.log("Register listener");
      listeners.push(callback);
      // console.log("Listeners", listeners);
    };
        
  };

  Staff.prototype = new model.Model();
  Staff.prototype.generateID = function(){
    var id = 'staff_' + this.id;
    return id;
  }
  Staff.prototype.normalize = function(){
    this._id = this.generateID();
  };
  Staff.prototype.datatype = Staff.datatype = model.datatypes.staff.v1;
  Staff.prototype.setStatus = function(year, status){
    this.status[year] = status;
    this.save();
  }


  model.Staff = Staff;

}]);
