'use strict';

function Data($timeout, $log, SchoolInfos) {

    var SCHEMA = {
        "version":"",
        "users":"",
        "students":"",
        "coursecatalog":"",
        "timetable":"",
        "uid":"",
        "marksheets":"",
        "departments":"",
        "fees":"",
        "groups":""
    }

    // Change this to something that keeps track of the last time the data has changed
    // var lastUpdate = {
    //     saved = true;
    //     timestamp:341443141431;
    // }
    var updates = {};
 
  	var fileWriters = {student:null, schoolman:null};


    var data = {};

    var self = {};

    var listeners = {};
    var version;

    SchoolInfos.get("schoolinfo").then(function(info){
        version = info;
    }).catch(function(error){
        console.log("unable to retrieve school info");
    });
    
    self.get = function(key, callback){
    	if(data.hasOwnProperty(key)){
    		callback(data[key]);
    	}else{
    		var emptyObj = {};
    		callback(emptyObj);
    	}

    	if(!listeners.hasOwnProperty(key)){
    		listeners[key] = [];
    	}

    	listeners[key] = callback;
    };

    self.set = function(key, obj){
    	data[key] = obj;
    	return data[key];
    };

    self.save = function(obj, callback){

    	console.log("Saving, ", obj);

        var write = function(dataTable, data){
            // 2. Write data to file
            var content = angular.toJson(data);
            var header  = {type:'application/json'};
            var blob = new Blob([content]);

            var fileWriter = fileWriters[dataTable];

            fileWriter.onwriteend = function() {
                if (fileWriter.length === 0) {
                    //fileWriter has been reset, write file
                    fileWriter.write(blob, header);
                } else {
                    //file has been overwritten with blob
                    //use callback or resolve promise
                    self.logEstimateSize();  
                }
                callback("ok");
            };

            fileWriter.onerror = function(e) {
                console.log('Write failed: ' + e.toString());
            };

            fileWriter.truncate(0); 
        }

        if(obj){
            // 1. Update data in RAM
            angular.forEach(obj, function(d, key){
                data[key] = d;
            });
            // if(obj.hasOwnProperty("students")){
            //     write("students", obj.students);
            // }
        }

        write("schoolman", data)
    };

    self.logEstimateSize = function(){
        var textWidth = 0;
        angular.forEach(SCHEMA, function(obj, key){
            textWidth = key.length > textWidth ? key.length : textWidth;
        });

        var logLines = [];

        var humanReadable =function(n){
            var m = "";
            if(n < 1000){
                m = n + " B"
            } else if(n < 1000000){
                m = (n / 1000) + " K"
            } else {
                m = (n / 1000000) + " M"
            }

            return m;
        }

    	var total = 0;

        // $log.debug("Estimated Data Size");
        // $log.debug("-------------------");

        logLines.push("Estimated Data Size");
        logLines.push("---------------------------");

    	angular.forEach(data,function(obj, key){
            if(SCHEMA.hasOwnProperty(key)){
                var length = textWidth - key.length + 1;
                var msg = Array(length).join(" ") + key + " : ";
                var size = 0;
                if(obj){
                    size = angular.toJson(obj).length
                }
                
                var readable = humanReadable(size);
                logLines.push(msg + readable);

                total += size;
            }
            
    	});

    	logLines.push(Array(textWidth - 5 + 1).join(" ") + "Total : " + humanReadable(total));

        $log.debug(logLines.join("\n"));
       

    }

    self.saveLater = function(obj, callback){

    	// 1. Update data in RAM
    	angular.forEach(obj, function(d, key){
    		data[key] = d;
        if(!updates.hasOwnProperty(key)){
          updates[key] = {};
          updates[key]._id = key;
          updates[key].n = 1;
          updates[key].timeAdded = new Date();
        } else {
          updates[key].n += 1;
          updates[key].timeAdded = new Date();
        }
        console.log("Updates saved for write:", updates);
    	});

    };

    self.loadFile =  function(fileEntry, callback){
        console.log("Data service loading entry: ", fileEntry);
        if(fileEntry){
             

            fileEntry.file(function(file){
                var reader = new FileReader();

                reader.onload = function(evt) {
                  var content = evt.target.result;
                  data = angular.fromJson(content);
                  callback(true);

                  // Delete any keys listed in DELETE_OLD_KEYS
                  angular.forEach(data, function(obj, key){
                    if(!SCHEMA.hasOwnProperty(key)){
                        delete data[key];
                    }
                  });

                };

                reader.readAsText(file);
            });
        } else {
            callback(false);
        }
    };

    var addWriter = function(name, fileEntry){    
        fileEntry.createWriter(function(writer){
            fileWriters[name]=writer;
        });
    }

    self.loadWorkspace = function(entryId, callback){
        console.log("Data service loading workspace: ", entryId);
        chrome.fileSystem.restoreEntry(entryId, function(dirEntry){
            console.log("restored entry", dirEntry);
            var reader = dirEntry.createReader();
            var files = {};
            reader.readEntries(function(entries){
                angular.forEach(entries, function(entry, entryIndex){
                    files[entry.name] = entry;
                });
                if(version.mode.toLowerCase() === "gths"){                    
                    addWriter("schoolman", files["gths.data"]);
                    self.loadFile(files["gths.data"], function(success){
                        callback(success);
                    });
                } else if (version.mode.toLowerCase() === "ghs"){                    
                    addWriter("schoolman", files["ghs.data"]);
                    self.loadFile(files["ghs.data"], function(success){
                        callback(success);
                    });
                } else {
                    callback("File failed to load");
                }
                console.log("read entry schoolman", files);
            });
            // console.log("Reader:", reader);
            // dirEntry.getFile("students.data",{create:true},function(fileEntry){
            //    addWriter("students",fileEntry);
            //    console.log("File Entry for students:",fileEntry);
            // });
        });
    };

    // DEPRECATED: dont use, delete
    self.load = function(dataFileEntryId, callback){
    	console.log("Data service loading entry: ", dataFileEntryId);
    	chrome.fileSystem.restoreEntry(dataFileEntryId, function(fileEntry){
    		
    		if(fileEntry){
				fileEntry.createWriter(function(writer){
					fileWriter = writer;
                    window.fileWriter = writer;
				});	

	    		fileEntry.file(function(file){
	    			var reader = new FileReader();

				    reader.onload = function(evt) {
				      var content = evt.target.result;
				      data = angular.fromJson(content);
				      callback(true);

                      // Delete any keys listed in DELETE_OLD_KEYS
				      angular.forEach(data, function(obj, key){
                        if(!SCHEMA.hasOwnProperty(key)){
                            delete data[key];
                        }
                      });

				    };

				    reader.readAsText(file);
	    		});
	    	} else {
	    		callback(false);
	    	}
			
  		});	
    };

    // We were having some problem with simulataneoues writes, so we are changing 
    // to a polling method
    var poll = function(){
    	$timeout(function() {
        
        var tables = Object.keys(updates).map(function(key){
          return updates[key];
        });
		    console.log("Tables before filter:", tables);


        tables = tables.filter(function(table){
          return table.n > 0;
        });
          
        if(tables.length > 0){

          tables.sort(function(a,b){return a.timeAdded - b.timeAdded});
          console.log("Tables to save:", tables);


          var table = tables[0];
          var d = {};
          d[table._id] = data[table._id];
          self.save(d, function(msg){
            console.log("Data Saved, ", updateKey, data[updateKey]); 
          });

          updates[table._id].n = 0;
        } else {
          console.log("No Tables", tables);
        }

        poll();

    	}, 5000);
    }

    // poll();

    return self;

  }
Data.$inject = ['$timeout', '$log', 'SchoolInfos'];
angular.module('SchoolMan').service('Data', Data);