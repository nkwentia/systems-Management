'use strict';

var schoolman = angular.module('SchoolMan');

schoolman.config(['modelProvider', function(model){

  model.datatypes.user = {
    v1:{
      type:"schema",
      _id:"datatype/user/v1",
      fields:[{
        key:"fullname",
        type:"string",
        required:true
      },
      {
        key:"username",
        type:"string",
        required:true
      },
      {
        key:"password",
        type:"string",
        required:true
      },
      {
        key:"access",
        type:"object",
        required:true
      },
      {
        key:"dutypost",
        type:"string",
        required:false
      },
      {
        key:"sex",
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
      },
      {
        key:"dateofentry",
        type:"object",
        required:false
      },
      {
        key:"name",
        type:"string",
        required:true
      },
      {
        key:"tribe",
        type:"string",
        required:false
      },
      {
        key:"dateposted",
        type:"object",
        required:false
      },
      {
        key:"phoneNo",
        type:"string",
        required:false
      },
      {
        key:"region",
        type:"string",
        required:false
      },
      {
        key:"specialty",
        type:"string",
        required:false
      },
      {
        key:"staffEmail",
        type:"string",
        required:false
      },
      {
        key:"salary",
        type:"number",
        required:false
      },
      {
        key:"residence",
        type:"string",
        required:false
      }],
      fields_key:0
    }
  };
    
  function User(specs){
    var self = this;
    var specs = specs || {};

    // Prevents global namespace clobbering if you istantiate this object
    // without the 'new' keyword
    if (!(this instanceof User)) {
      return new User();
    }

    this.fullname = "";
    this.name = ""; //unslugified username in case fullname is changed later
    this.username = "";
    this.password = "";
    this.access = {
      admin:0,
      registrar:0,
      classmaster:0,
      teacher:1
    };
    this.dutypost = "";
    this.sex = "";     
    this.matricalno = "";
    this.maritalstatus = "";
    this.birth = null; // Datetime integer
    this.grade = "";
    this.qualification = "";
    this.subdivision = "";
    this.division = "";
    this.dateofentry=null;
    this.specialty = "";
    this.tribe = "";
    this.dateposted = null;
    this.region="";
    this.phoneNo = "";
    this.staffEmail = "";
    this.salary = 0;
    this.residence = "";

    angular.forEach(specs, function(prop, key){
      if(self.hasOwnProperty(key)){
        self[key] = prop; 
      }
    });
    
  };

  User.roles = {
      teacher: {nameEn:"Teacher", nameFr:"Enseignant"},
      admin:   {nameEn:"Administrator", nameFr:"Administrateur"},
      classmaster: {nameEn:"Class Master", nameFr:"Prof Titulaire"},
      registrar:{nameEn:"Registrar", nameFr:"Économe"},
      sales:{nameEn:"Sales", nameFr:"Sales"}
  }

  User.prototype = new model.Model();
  User.prototype.hasAccess = function(accessCode){
    return this.access[accessCode];
  };

  User.prototype.getHighestAccess = function(){
    var access = "";
    if(this.access.admin){
      access = "admin"
    } else if(this.access.registrar){
      access = "registrar"
    } else if(this.access.classmaster){
      access = "classmaster"
    } else {
      access = "teacher"
    }
    console.log("Getting Highest Access: ", access);
    return access
  };


  User.prototype.toggleAccess = function(accessCode){
    this.access[accessCode] = (this.access[accessCode] + 1) % 2;
    var msg = "User " + this.username + "changed access '" + accessCode +"' to " + this.access[accessCode];
    if(this.hasOwnProperty("_rev")){
      this.save();
    }
  };

  User.prototype.generateID = function(){
    var id = model.slugify(this.fullname);
    this.username = id;
    return id;
  }

  User.prototype.normalize = function(){
    // convert amount from string to number
    if(this._id){
      this.username = this._id;
    } else {
      this.username = this.generateID();
    }

    if(this.password === ""){
      this.password = this.encrypt("user123");
    }
    
  };

  User.prototype.generateID = function(){
    var id = model.slugify(this.fullname);
    this.username = id;
    return id;
  }

  User.prototype.datatype = User.datatype = model.datatypes.user.v1;


  model.User = User;

}]);
