'use strict';

function Transcripts($q, $log, pouchdb, model, Subjects, Students, SchoolInfos) {
  
  //instantialize/register Transcript datatype
  var instTranscript = new model.Transcript();

	var db = model.Transcript.db;
  if(typeof db === "string"){
    db = pouchdb.create(model.Transcript.db);
  }

	var _transcripts = {};
  var subjects = Subjects.getAll();

	self = {};

	var dataModel = model.Transcript;

  self.get = function(studentId, cycleIndex){
    var deferred = $q.defer();
    var transcriptId = "transcript_" + studentId + ":" + cycleIndex;
    var student;

    Students.get(studentId).then(function(success){
      student = success;

      db.get(transcriptId).then(function(data){
        var spec = model.parse2(data, data.datatype);
        var transcript = new model.Transcript(spec);

        angular.forEach(subjects, function(subject, subjectId){
          if(!(transcript.table.hasOwnProperty(subjectId))){
            if(cycleIndex === 0 && info.version !== "gths"){
              transcript.table[subjectId]=["","","","","","","","","","","","","","",""];
            }else if(cycleIndex === 0 && info.version === "gths"){
              transcript.table[subjectId]=["","","","","","","","","","","","",];
            }else if(cycleIndex === 1 && info.version !== "gths"){
              transcript.table[subjectId]=["","","","","",""];
            }else {
              transcript.table[subjectId]=["","","","","","","","",""];
            }
          }
        });

        deferred.resolve(transcript);
      }).catch(function(error){
        if(error.status === 404){
          var transcript = new model.Transcript({studentId:studentId, cycleIndex:cycleIndex});
          SchoolInfos.get("schoolinfo").then(function(info){
            angular.forEach(subjects, function(subject, subjectId){
              if(cycleIndex === 0 && info.version !== "gths"){
                transcript.table[subjectId]=["","","","","","","","","","","","","","",""];
              }else if(cycleIndex === 0 && info.version === "gths"){
                transcript.table[subjectId]=["","","","","","","","","","","","",];
              }else if(cycleIndex === 1 && info.version !== "gths"){
                transcript.table[subjectId]=["","","","","",""];
              }else {
                transcript.table[subjectId]=["","","","","","","","",""];
              }
            })

            transcript.save().then(function(success){
              deferred.resolve(transcript);
            }).catch(function(error){
              deferred.reject(error);
            })
          });
        } else{
          deferred.reject(error);
        }
      });
    }).catch(function(error){
      console.log("Failed to retreive student", error);
    });
    return deferred.promise;
  };

  self.removeTranscripts = function(studentId){
    var cycles = [1,2];

    angular.forEach(cycles, function(cycle, cycleIndex){
      var transcriptId = "transcript_" + studentId + ":" + cycleIndex;
      db.get(transcriptId).then(function(data){
        var spec = model.parse2(data, data.datatype);
        var transcript = new model.Transcript(spec);

        db.remove(transcript).then(function(success){
          console.log("Transcript removed: ", success);
        }).catch(function(error){
          $log.error("transcripts.js : remove :", error);
        });
        

      }).catch(function(error){
        console.log("Failed to get Transcript", error);
      })
      
    })
  };

  self.destroy = function(){
  	db.destroy().then(function(success){
  		console.log("Destroyed transcripts db");
  	}).catch(function(error){
  		console.log("failed to destroy transcripts db", error)
  	});
  }

  return self;
}
Transcripts.$inject = ['$q', '$log', 'pouchdb', 'model', 'Subjects', 'Students', 'SchoolInfos'];
angular.module('SchoolMan').service('Transcripts', Transcripts);