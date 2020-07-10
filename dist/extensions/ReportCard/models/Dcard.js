'use strict';

var schoolman = angular.module('SchoolMan');

schoolman.config(['modelProvider', function(model){

  function Dcard(spec){
    
    this.is("dcard.v1");

    // var val = this; 
    // var req = this.required.bind(this); var opt = this.optional.bind(this);
    var val = this.val.bind(this); var required = true;
    // console.log("req", req("year : string"));

    // The ordering here defines the ordering of the data in the compressed
    // data array that goes into the db. Changing the ordering after the datatype
    // has already been registered in the db will break the parsing of stored
    // data. this could be fixed by making the user specify the index, or by 
    // automating the creation of sub-version datatype/parse specifications.
    
    //this[ val['?'] ('year', String) ] = "2014";

    this[ val ('year : string', required)] = "2014";
    this[ val ('warned : number')] = 0;
    this[ val ('absence : number')] = 0;
    this[ val ('council : number')] = 0;
    this[ val ('suspended : number')] = 0;
    this[ val ('studentId : string', required)] = undefined;

    // this.def("_id", function(){
    //   return "dcard_" + this.studentId + "_" + this.year;
    // });

    this.__init__(spec);
  };

  Dcard.prototype = new model.Model();
  Dcard.prototype.generateID = function(){
    return "dcard_" + this.studentId + "_" + this.year;
  };
  //  Dcard.prototype.required = function(prop){
  //   console.log("Dcard inheriting Model", this);
  //   return this.registerProperty(prop, true);
  // };
  model.Dcard = Dcard;

}]);
 