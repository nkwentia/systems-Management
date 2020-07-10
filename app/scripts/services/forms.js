'use strict';

function Forms(model, VERSION, SchoolInfos) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var modes = {
        'gths':{
            'en':{
                "0":"Form 1",
                "1":"Form 2",
                "2":"Form 3",
                "3":"Form 4",
                "4":"Form 5",
                "5":"Form 6",
                "6":"Form 7"
            },
            'fr':{
                "0":"Sixième",
                "1":"Cinquième",
                "2":"Quatrième",
                "3":"Troisième",
                "4":"Seconde",
                "5":"Première",
                "6":"Terminal"
            }
        },
        'ghs' :{
            'en':{
                "0":"Form 1",
                "1":"Form 2",
                "2":"Form 3",
                "3":"Form 4",
                "4":"Form 5",
                "5":"Lower Sixth",
                "6":"Upper Sixth"
            },
            'fr':{
                "0":"Sixième",
                "1":"Cinquième",
                "2":"Quatrième",
                "3":"Troisième",
                "4":"Seconde",
                "5":"Première",
                "6":"Terminal"
            }
        }
    }

    //var version;

    //SchoolInfos.get("schoolinfo").then(function(info){
    //    version = info;
    //}).catch(function(error){
    //    console.log("unable to retrieve school info");
    //});

    var forms = {
    	"0":new model.Form({nameEn:modes[VERSION.mode]['en']['0'], nameFr:modes[VERSION.mode]['fr']['0']}),
    	"1":new model.Form({nameEn:modes[VERSION.mode]['en']['1'], nameFr:modes[VERSION.mode]['fr']['1']}),	
    	"2":new model.Form({nameEn:modes[VERSION.mode]['en']['2'], nameFr:modes[VERSION.mode]['fr']['2']}),	
    	"3":new model.Form({nameEn:modes[VERSION.mode]['en']['3'], nameFr:modes[VERSION.mode]['fr']['3']}),	
    	"4":new model.Form({nameEn:modes[VERSION.mode]['en']['4'], nameFr:modes[VERSION.mode]['fr']['4']}),	
    	"5":new model.Form({nameEn:modes[VERSION.mode]['en']['5'], nameFr:modes[VERSION.mode]['fr']['5']}),	
    	"6":new model.Form({nameEn:modes[VERSION.mode]['en']['6'], nameFr:modes[VERSION.mode]['fr']['6']})	
    };

    var self = {};

    self.all = function(){
    	return angular.copy(forms);
    };

    return self;

}
Forms.$inject = ['model', 'VERSION', 'SchoolInfos'];
angular.module('SchoolMan').service('Forms', Forms);