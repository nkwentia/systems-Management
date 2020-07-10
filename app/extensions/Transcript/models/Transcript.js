'use strict';

var schoolman = angular.module('SchoolMan');

schoolman.config(['modelProvider', function(model){
  function Transcript(spec){
    spec = spec || {};

    // Prevents global namespace clobbering if you istantiate this object
    // without the 'new' keyword
    if (!(this instanceof Transcript)) {
      return new Transcript(spec);
    }

    this.is("transcript.v1");

    var val = this.val.bind(this); var required = true;

    this[ val ('studentId : string', required)] = "";
    this[ val ('cycleIndex : number', required)] = 0;
    this[ val ('startYear : number')];
    this[ val ('endYear : number')];
    this[ val ('sponsor : string')] = "";
    this[ val ('table : object')] = {};

    this.__init__(spec);
  }

  Transcript.prototype = new model.Model();

  Transcript.prototype.generateID = function(){
    var id = "transcript_" + this.studentId + ":" + this.cycleIndex;
    return id;
  }

  Transcript.prototype.db = Transcript.db = "db_transcripts";
  
  model.Transcript = Transcript;

}]);