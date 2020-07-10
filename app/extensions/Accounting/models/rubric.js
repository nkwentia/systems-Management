var schoolman = angular.module('SchoolMan');

schoolman.config(['modelProvider', function(model){

  model.datatypes.rubric = {
    v1:{
      type:"schema",
      _id:"datatype/rubric/v1",
      fields:[{
        key:"description",
        type:"string",
        required:true
      }],
      fields_key:0
    }
  };

  function Rubric(){

    // Prevents global namespace clobbering if you istantiate this object
    // without the 'new' keyword
    if (!(this instanceof Rubric)) {
      return new Rubric();
    }

    this.description = "";
    
  };

  Rubric.prototype = new model.Model();
  
  Rubric.prototype.datatype = Rubric.datatype = model.datatypes.rubric.v1;

  Rubric.prototype.normalize = function(){

  };

  Rubric.prototype.generateID = function(){
    var id = "rubric_" + this.description;
    return id;
  }

  model.Rubric = Rubric;
    
}]);
 