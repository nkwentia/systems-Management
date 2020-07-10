'use strict';

var schoolman = angular.module('SchoolMan');

schoolman.config(['modelProvider', function(model){

  function Settings(spec){
    
    this.is("settings.v1");

    var val = this.val.bind(this); var required = true;

    // The ordering here defines the ordering of the data in the compressed
    // data array that goes into the db. Changing the ordering after the datatype
    // has already been registered in the db will break the parsing of stored
    // data. this could be fixed by making the user specify the index, or by 
    // automating the creation of sub-version datatype/parse specifications.

    this._id = "customer_settings";
    this[ val ('access : object')] = {
      'admin':1,
      'registrar':1,
      'classmaster':1,
      'teacher':1
    };
    this[ val ('extensions : object', required)] = ['ReportCard', 'Finance', 'Transcript', 'Staffing', 'Reports', 'IDCard', 'Accounting'];

    // this.def("_id", function(){
    //   return "dcard_" + this.studentId + "_" + this.year;
    // });

    this.__init__(spec);
  };

  Settings.prototype = new model.Model();

  //  Dcard.prototype.required = function(prop){
  //   console.log("Dcard inheriting Model", this);
  //   return this.registerProperty(prop, true);
  // };
  model.Settings = Settings;

}]);
