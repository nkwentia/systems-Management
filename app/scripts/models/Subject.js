'use strict';

var schoolman = angular.module('SchoolMan');

schoolman.config(['modelProvider', function(model){

  model.datatypes.subject = {
    v1:{
      type:"schema",
      _id:"datatype/subject/v1",
      fields:[{
        key:"code",
        type:"string",
        required:true
      },{
        key:"en",
        type:"string",
        required:false
      },{
        key:"fr",
        type:"string",
        required:false
      },{
        key:"type",
        type:"number",
        required:false
      }],
      fields_key:0
    }
  };

	function Subject(specs){

    var self = this;
    var specs = specs || {};

		// Prevents global namespace clobbering if you istantiate this object
		// without the 'new' keyword
		if(!(this instanceof Subject)) {
		    return new Subject();
	  }

    this.code = "";
    this.en = "";
    this.fr = "";
    this.type = 0;

    angular.forEach(specs, function(prop, key){
      self[key] = prop;
    });

	};

  Subject.types = [
      "General",
      "Specialized",
      "Other"
  ]
  Subject.prototype = new model.Model();
  Subject.prototype.setType = function(typeIndex){
    this.type = typeIndex.toString();
    if(this.hasOwnProperty("_rev")){
      this.save().then(function(success){
        console.log("Saved type: ", success);
      });
    }
  }

  Subject.prototype.normalize = function(){
    if(typeof this.type === "string"){
      this.type = parseInt(this.type);
    }
  };

  Subject.prototype.generateID = function(){
    var id = "subject_" + model.slugify(this.code);
    return id;
  }
  Subject.prototype.datatype = Subject.datatype = model.datatypes.subject.v1;

  model.Subject = Subject;

}]);
 