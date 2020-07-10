'use strict';

function Marksheets($q, $log, Slug, pouchdb, model, modelTransformer, Subjects, Students) {
 
  var self = {};
  var numSeqPerTerm = 2;

  var db = model.Marksheet.db;
  if(typeof db === "string"){
    db = pouchdb.create(model.Marksheet.db);
  }

  // self.getID = model.Marksheet.getId; 

  //get sequences for term given
  self.getSequences = function(termIndex){
      var sequences = [];

      var i = 0;
      i = (parseInt(termIndex) + 1) * numSeqPerTerm;

      for (var n = numSeqPerTerm; n > 0; n--){  
        sequences.push(i-n);
      }

      return sequences;
    };

  self.listify = function(table){
    var list = Object.keys(table).map(function(studentId){
      var row = angular.copy(table[studentId]);
      angular.forEach(row, function(mark, i){
        row[i] = parseFloat(mark);
      });

      return [studentId].concat(row);
    });
    return list;
  };

  self.ave = function(list, sequences){
    var newList = list.map(function(row){
      var newRow = [row[0],0];
      var total = 0;
      var test = false;
      var count = 0;
      angular.forEach(sequences, function(i, sIndex){
        var n = parseFloat(row[i + 1]);
        if(typeof n === "number" && !isNaN(n)){
          total += n;
          test = true;
          count += 1;
        }
      });
      if(test === true){
        newRow[1] = total / count;
      }
      else{
        newRow[1] = -1;
      }
      return newRow;
    }); 
    return newList;
  }

  self.aveAllTerms = function(list) {
    var numTerms = 3;
    var aves = [];

    for (var n = 0; n < numTerms; n++){
      aves.push(self.ave(list, self.getSequences(n)));
    }

    var newList = _.reduce(aves, function(prev, next, index){
      angular.forEach(prev, function(student, ind){
        if(!student[2]){
          student[2] = 1;
        }
        if(student[1] >= 0){
          if(next[ind][1] >= 0){
            var x = student[1] * student[2];
            var y = next[ind][1];
            student[2] += 1;
            var t = student[2];
            student[1] = (x + y) / t;
          }
        } else {
          student[1] = next[ind][1];
        }
      })
      return prev;
    })
    angular.forEach(newList, function(student, ind){
      student.splice(2,1);
    });
    return newList;
  }

  self.dict = function(listWithKeysAtHead){
    var d = {};
    angular.forEach(listWithKeysAtHead, function(row, i){
      d[row[0]] = row.slice(1);
    });
    return d;
  }

  self.rank = function(marksheets){
    var dict = self.dict;
    var listify = self.listify;
    
    

    var sort = function(aveList){
      var sortList = angular.copy(aveList);  
      /**
      angular.forEach(sortList, function(student, id){
        if(isNaN(student[1])){
          student[1] = 0;
          console.log("average is NaN", student);
        }
      });*/
      

      sortList.sort(function(a,b){
        return parseFloat(b[1]) - parseFloat(a[1]);
      });
      
      return sortList;
    };
    
    var number = function(sortedRows){
      var rows = [];

      angular.forEach(sortedRows, function(row, i){
        if(row[1] >= 0){
          rows[i]    = [row[0]];
        
          if(i === 0){
            rows[i][1] = 1;
          } else {
              rows[i][1] = row[1] === sortedRows[i - 1][1] ? rows[i - 1][1] : i + 1;  
          }
        }
      });
      return rows;
    };

    var merge = function(dicts){
      var d = {}
      angular.forEach(dicts, function(dict, i){
        angular.forEach(dict, function(value, key){
          if(!d.hasOwnProperty(key)){
            d[key] = [];
          }
          d[key][i] = value[0];
        });
      });
      return d;
    };

    var t1 = [];
    var t2 = [];
    var t3 = [];
    var t4 = [];
    
    angular.forEach(marksheets, function(marksheet, index){
      t1[index] = self.summarize(marksheet, 0);
      t2[index] = self.summarize(marksheet, 1);
      t3[index] = self.summarize(marksheet, 2);
      t4[index] = self.summarize(marksheet, 3);
    })

    var m1 = dict(number(sort(listify(self.combine(t1).table))));
    var m2 = dict(number(sort(listify(self.combine(t2).table))));
    var m3 = dict(number(sort(listify(self.combine(t3).table))));
    var m4 = dict(number(sort(listify(self.combine(t4).table))));

    var rankings = merge([m1,m2,m3,m4]);
    return rankings;
  }

  
  self.combine = function(marksheets){

    // console.log("Combining Marksheets", marksheets);

    // Create new Marksheet
    var head = marksheets[0];
    var tail = marksheets.slice(1);
    var newMarksheet = new model.Marksheet();
        newMarksheet.coeff = head.coeff;
        newMarksheet.table = angular.copy(head.table);
        newMarksheet.studentCoeffs = {};

    
    angular.forEach(newMarksheet.table, function(student, studentId){
      newMarksheet.studentCoeffs[studentId] = [];
      angular.forEach(student, function(row, index){
        if(row !== ""){
          newMarksheet.studentCoeffs[studentId][index] = newMarksheet.coeff;
          student.coeff = newMarksheet.coeff;
        } else {
          newMarksheet.studentCoeffs[studentId][index] = 0;
        }
      }); 
    });

    // Reduce marksheets into the new marksheet
    var combined = _.reduce(tail, function(prevM, nextM){
     
      var t1 = angular.copy(prevM.table);
      var t2 = nextM.table;
      var coeffs = prevM.studentCoeffs;
      
      var ignore = ["", null, undefined,-1];

      angular.forEach(t2, function(row, studentId){      
        if(!t1.hasOwnProperty(studentId)){
          t1[studentId] = angular.copy(row);
          coeffs[studentId] = [nextM.coeff];

          angular.forEach(coeffs[studentId], function(y, i){
            if(!(ignore.indexOf(y) > -1)){
              y = newMarksheet.coeff;
            } else {
              y = 0;
            }
          }); 

        } else {
          angular.forEach(row, function(y, i){
            var x = t1[studentId][i];
            if(ignore.indexOf(x) > -1){
              t1[studentId][i] = y;
              if(!(ignore.indexOf(y) > -1)){
                coeffs[studentId][i] = nextM.coeff;
              }

            } else if(!(ignore.indexOf(y) > -1)){
              var xc = x * coeffs[studentId][i];
              var yc = y * nextM.coeff;
              var nc = coeffs[studentId][i] + nextM.coeff;

              var avg = (xc + yc) / nc;

              t1[studentId][i] = avg;
              coeffs[studentId][i] += nextM.coeff;

            } else {
              
            }
          });
        }
        t1[studentId].coeff = _.max(coeffs[studentId]);
      });
      
      newMarksheet.table = t1;
      newMarksheet.coeff = prevM.coeff + nextM.coeff;
      newMarksheet.studentCoeffs = coeffs;

      return newMarksheet;

    }, newMarksheet);
    
    return combined;
  }


  self.summarize = function(marksheet, termIndex){
    var summarized = new model.Marksheet();
        summarized.table = angular.copy(marksheet.table);
        summarized.coeff = marksheet.coeff;

    if(marksheet._id){
      summarized._id = marksheet._id;
    }

    var list = self.listify(summarized.table);
    var ave;
    if(parseInt(termIndex) === 3){
      ave = self.aveAllTerms(list);
    } else {
      ave  = self.ave(list, self.getSequences(termIndex));
    }

    summarized.table = self.dict(ave);
    return summarized;
  };

  

  self.create = function(params){
  	var deferred = $q.defer();

  	var marksheet = new model.Marksheet(params);
  	marksheet.save().then(function(success){
  		console.log("Marksheet saved", success, marksheet);
  		deferred.resolve(marksheet);
  	}).catch(function(error){
      console.log("Failed to create marksheet", error, marksheet);
  		deferred.reject(error);
  	});

  	return deferred.promise;
  }

  self.createOrUpdate = function(_id, teacherId){
  	var deferred = $q.defer();
		self.get(_id).then(function(obj){
			// Update
      var marksheet = obj.marksheet;
			console.log("Found marksheet, updating", marksheet);
			marksheet.teacherId = teacherId;
			marksheet.save().then(function(success){
				deferred.resolve(marksheet);
			}).catch(function(error){
				deferred.resolve(error);
			})
		}).catch(function(error){
			//Create
			if(error.status === 404){
				console.log("Marksheet not found, creating", error);
				self.create({_id:_id, teacherId:teacherId}).then(function(marksheet){
					deferred.resolve(marksheet);
				}).catch(function(error){
					deferred.reject(error);
				});
			}
		})
  	return deferred.promise;
  };

  self.get = function(marksheetId){

    var deferred = $q.defer();
    var bundle = {};

    db.get(marksheetId).then(function(data){
      console.log("Received Data", data);
      var spec = model.parse(data, model.Marksheet.datatype);
      console.log("Parse check", data, spec);
      var marksheet = bundle.marksheet = new model.Marksheet(spec); 
      console.log("Got marksheetData", marksheet);
      var copy = angular.copy(marksheet);

      var searchParams = {
        formIndex:marksheet.formIndex,
        deptId:marksheet.deptId,
        groupId:marksheet.groupId
      }
      Students.query(searchParams).then(function(students){

        // Lookup students already in marksheet
        var existingStudents = _.map(Object.keys(marksheet.table), function(sId){
          return sId;
        });
        // Get a list of studentIds from all students in the same 
        // form/dept/group as the marksheet
        var allStudents = _.map(students, function(student){
          return student._id;
        });


        // get the list of any new students
        var newStudents = _.difference(allStudents, existingStudents);

        // add new students returned from the above query
        angular.forEach(newStudents, function(studentId, studentIndex){
          marksheet.table[studentId] = ["","","","","",""];
        });

        // prepare to return the student data along with the marksheet
        bundle.students = students;

        // If we made changes to the marksheet, by adding students, save it
        if(!angular.equals(marksheet, copy)){
          console.log("What is the status", marksheet, copy);

          marksheet.save().then(function(success){
            console.log("Apparent success", success)
            deferred.resolve(bundle);
          }).catch(function(error){
            console.log("There was a problem adding new students to the marksheet", error);     
          });
        } else {
            deferred.resolve(bundle);
        }
      });
      
    }).catch(function(error){
      console.log("Failed to get marksheet", error);
      deferred.reject(error);
    });

    return deferred.promise;
  };

  self.query = function(params){
  	
  	var deferred = $q.defer();

  	// Load Data
  	var dataModel = model.Marksheet;

    var map = function(doc, emit){
      if(doc.datatype === dataModel.datatype._id){
      	var obj = model.parse(doc, dataModel.datatype);
      	var isok= true;
      	angular.forEach(params, function(param, paramKey){
          if(paramKey === "formIndex"){
            param = parseInt(param);
          }
      		isok = obj[paramKey] === param ? isok : false;
      	});
      	if(isok){
      		emit(doc._id, {_id:doc.datatype, data:doc});
      	}
      } 
    };
    db.query(map, {include_docs : true}).then(function(success){
        //console.log("Marksheets Query", success);
    		var collection = [];
        angular.forEach(success.rows, function(data, rowIndex){
            var spec = data.doc;
            var obj = model.parse2(data.value.data, data.value._id);
            var item = modelTransformer.transform(obj, dataModel);
            collection.push(item);
        });
        //console.log("Query: success", success, collection);
        deferred.resolve(collection);
    }).catch(function(error){
        // deferred.reject("Query: failed", error);
        //console.log("marksheet query failed")
    });

  	return deferred.promise;
  };
  self.getClasses = function(formIndex){
    
    var deferred = $q.defer();
    var params = {formIndex:formIndex}

    // Load Data
    var dataModel = model.Marksheet;

    var map = function(doc, emit){
      if(doc.datatype === dataModel.datatype._id){
        var obj = model.parse(doc, dataModel.datatype);
        var isok= true;
        angular.forEach(params, function(param, paramKey){
          if(paramKey === "formIndex"){
            param = parseInt(param);
          }
          isok = obj[paramKey] === param ? isok : false;
        });
        if(isok){
          emit(doc._id, {_id:doc.datatype, data:doc});
        }
      } 
    };
    db.query(map, {include_docs : false}).then(function(success){
        var collection = {};
        angular.forEach(success.rows, function(data, rowIndex){
          var parts = data.id.split(':');

          var id = [parts[0], parts[1], parts[2]];
          if(!collection.hasOwnProperty(id)){
            collection[id] = {formIndex:parts[0], deptId:parts[1], groupId:parts[2]};
          }
        });
        // console.log("Query: success", success);
        deferred.resolve(collection);
    }).catch(function(error){
        deferred.reject("Query: failed", error);
        //console.log("marksheet query failed")
    });

    return deferred.promise;
  };

  self.validateCell = function(n){
    var status = 'number-valid';
    if(n > 20 || n < 0){
      status = "number-invalid";
    }
    return status;
  }


  self.getReports = function(p){

    // console.log("Getting reports", p);
    var deferred = $q.defer();

    self.query({formIndex:p.formIndex, deptId:p.deptId,groupId:p.groupId})
        .then(function(marksheets){
          if(marksheets.length > 0){

            var report = {};
                report.subjects = {};
            var subjects = Subjects.getAll();


            // Add each marksheet and its summary and ranking to report
            angular.forEach(marksheets, function(marksheet, $index){
              var subjectType = model.Subject.types[subjects[marksheet.subjectId].type]; 
              if(!report.subjects.hasOwnProperty(subjectType)){
                report.subjects[subjectType] = {};
              }
              report.subjects[subjectType][marksheet._id] = {
                marksheet:marksheet,
                summary:self.summarize(marksheet,3),
                ranking:self.rank([marksheet])
              }
            });

            var combinedMarksheets = [];

            // Create combined marksheet for each marksheet type
            angular.forEach(report.subjects, function(set, type){
              var total = {};

              var marksheets = _.map(Object.keys(set), function(marksheetId){
                return set[marksheetId].marksheet;
              });

              var summaries = _.map(marksheets , function(marksheet){
                var summary = self.summarize(marksheet, 3);
                return summary;
              });

              total.summary = self.combine(summaries);
              

              combinedMarksheets.push(total.summary);
              // total.summary = self.summarize(total.marksheet,0);
              total.rankings = self.rank(marksheets);
              set.total = total;
            });

            report.total = {};
            report.total.summary = self.combine(combinedMarksheets);
            // report.total.summary = self.summarize(report.total.marksheet,3);
            report.total.rankings = self.rank(marksheets);
            // console.log("report", report);
            deferred.resolve(report);
          } else {
            deferred.reject("no marksheets found");
          }

        }).catch(function(error){
          console.log("Failed to get Marksheets", error);
          deferred.reject(error);
        });

    return deferred.promise;
  };

  self.removeFromMarksheets = function(students, params){
    console.log("remove marksheets params", params, students)
    self.query(params).then(function(marksheets){
      console.log("Student Marksheets", marksheets);
      angular.forEach(marksheets, function(marksheet, marksheetId){
        angular.forEach(students, function(student, studentId){
          delete marksheet.table[student._id];
        })

        marksheet.save().then(function(success){
          console.log("Marksheet Saved:", marksheet);
        }).catch(function(error){
          console.log("Failed to save marksheet", error, marksheet);
        });
      })
    }).catch(function(error){
      console.log("marksheet does not exist", student.formIndex, student.deptId, student.groupId);
    });
  }

  self.destroy = function(){
    db.destroy().then(function(success){
      console.log("Destroyed marksheets db");
    }).catch(function(error){
      console.log("failed to destroy marksheets db", error)
    });
  }

  self.remove = function(marksheet){
    var deferred = $q.defer();
    db.remove(marksheet).then(function(success){
      console.log("Marksheet removed: ", success);
      deferred.resolve(success);
    }).catch(function(error){
      deferred.reject(error);
    });
    return deferred.promise;
  }

  return self;

}
Marksheets.$inject = ['$q','$log', 'Slug', 'pouchdb', 'model', 'modelTransformer', 'Subjects', 'Students'];
angular.module('SchoolMan').service('Marksheets', Marksheets);