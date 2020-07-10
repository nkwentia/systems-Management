'use strict';

var schoolman = angular.module('SchoolMan');

schoolman.config(['modelProvider', function(model){

  function SchoolInfo(spec){
    spec = spec || {};

    if (!(this instanceof SchoolInfo)) {
      return new SchoolInfo(spec);
    }
    
    this.is("schoolinfo.v1");

    var val = this.val.bind(this); var required = true;

    this[ val ('nameEn : string', required)] = "";
    this[ val ('nameFr : string', required)] = "";
    this[ val ('schoolyear : string', required)] = "2014/2015";
    this[ val ('version : string', required)] = "ghs";
    this[ val ('principal : string')] = "";
    this[ val ('division : string', required)] = "";
    this[ val ('subdivision : string')] = "";
    this[ val ('region : string', required)] = "";
    this[ val ('refno : string')] = "";
    this[ val ('lang : string', required)] = "en";

    this.__init__(spec);
  };

  SchoolInfo.regions = {
    AD:{nameEn:"ADAMOWA", nameFr:"ADAMOUA"},
    CE:{nameEn:"CENTRE", nameFr:"CENTRE"},
    E:{nameEn:"EAST", nameFr:"EST"},
    FN:{nameEn:"FAR NORTH", nameFr:"EXTREME NORD"},
    LT:{nameEn:"LITTORAL", nameFr:"LITTORAL"},
    N:{nameEn:"NORTH", nameFr:"NORD"},
    NW:{nameEn:"NORTH WEST", nameFr: "NORD OUEST"},
    S:{nameEn:"SOUTH", nameFr:"SUD"},
    SW:{nameEn:"SOUTH WEST", nameFr: "SUD OUEST"},
    W:{nameEn:"WEST", nameFr:"OUEST"}
  }

  SchoolInfo.prototype = new model.Model();
  SchoolInfo.prototype.generateID = function(){
    return "schoolinfo";
  };

  model.SchoolInfo = SchoolInfo;

}]);
 