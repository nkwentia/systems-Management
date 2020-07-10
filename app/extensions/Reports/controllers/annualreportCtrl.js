'use strict';

function AnnualReportCtrl($scope, $route, $routeParams, model, Location, Marksheets, Forms, Groups, Departments, ClassCouncils, Students, Subjects, Lang, SchoolInfos) {

  var data = $scope.data = {
    forms:Forms.all(),
    groups:Groups.getAll(),
    depts:Departments.getAll(),
    subjects:Subjects.getAll(),
    classCouncils:{},
    classes:{},
    classStats:{},
    totalStats:{},
    deptStats:{}
  }

  SchoolInfos.get("schoolinfo").then(function(info){
    $scope.data.schoolInfo = info;
    //console.log("school info retrieved", $scope.data.schoolInfo);
  }).catch(function(error){
    console.log("failed to get school info", error);
  });

  $scope.termIndex=3;
  $scope.formIndex = $routeParams.formIndex;
  $scope.dict = Lang.getDict();
  $scope.lang = $routeParams.lang ? $routeParams.lang : Lang.defaultLang;

  $scope.open = function(params){
    if(params.formIndex === $routeParams.formIndex){
      $route.reload();
    } else {
      Location.open(params);
    }
  }
  var rankSubjects = function(summaries){

      var subjectMarksheets = {};
      var subjectAves = [];
      angular.forEach(summaries, function(marksheet, marksheetId){
        if(!subjectMarksheets.hasOwnProperty(marksheet.subjectId)){
          subjectMarksheets[marksheet.subjectId] = [];
        }
        subjectMarksheets[marksheet.subjectId].push(marksheet);
      })

      angular.forEach(subjectMarksheets, function(marksheets, subjectId){
        var subjectMarksheet = Marksheets.combine(marksheets);
        var count = 0;
        var sum = 0;
        angular.forEach(subjectMarksheet.table, function(student, studentId){
          if(student[0] !== "" && student[0] !== -1){
            count += 1;
            sum += student[0];
          }
        });
        subjectAves.push({subject:subjectId, average:(sum / count)});
      });

      var sorted = subjectAves.sort(function(a,b){
        a.average[0] - b.average[0];
      });
      
      return sorted;    
  }
  
  
  var getStats = function(params){
    if(!data.classStats.hasOwnProperty(params.deptId)){
      data.classStats[params.deptId] = {};
    } 
    var stats = {
      numStudents:0,
      numPresent:0,
      passing:0,
      aveHigh:0,
      aveLow:21,
      aveClass:0,
      goodSubjects:[],
      poorSubjects:[],
      promote:0,
      repeat:0,
      withdrawal:0,
      dismiss:0
    }
    if(!data.deptStats.hasOwnProperty(params.deptId)){
      data.deptStats[params.deptId] = angular.copy(stats);
      if($scope.formIndex !== -1){
        var p = {
          formIndex:params.formIndex,
          deptId:params.deptId
        }
      }else{
        var p = {deptId:params.deptId}
      }
      Marksheets.query(p).then(function(marksheets){
        var summaries = _.map(marksheets , function(marksheet){
          var summary = Marksheets.summarize(marksheet, $scope.termIndex);
          summary.subjectId = marksheet.subjectId;
          return summary;
        });
        var sortedBySubject = rankSubjects(summaries);
        var n = 0;
        angular.forEach(sortedBySubject, function(subject, objId){
          if(subject.average === 0){
            n += 1;
          }
        })

        if(sortedBySubject.length - n > 2){ 
          data.deptStats[params.deptId].goodSubjects = [sortedBySubject[0], sortedBySubject[1], sortedBySubject[2]];
          data.deptStats[params.deptId].poorSubjects = angular.copy(sortedBySubject).slice(-3-n);
        } else if(sortedBySubject.length - n > 1){ 
          data.deptStats[params.deptId].goodSubjects = [sortedBySubject[0], sortedBySubject[1]];
          data.deptStats[params.deptId].poorSubjects = [sortedBySubject[0], sortedBySubject[1]];
        } else if(sortedBySubject.length - n > 0){ 
          data.deptStats[params.deptId].goodSubjects = [sortedBySubject[0]];
          data.deptStats[params.deptId].poorSubjects = [sortedBySubject[0]];
        }

      })
    }

    Marksheets.query(params).then(function(marksheets){
      if(marksheets.length > 0){
        var summaries = _.map(marksheets , function(marksheet){
          var summary = Marksheets.summarize(marksheet, $scope.termIndex);
          summary.subjectId = marksheet.subjectId;
          return summary;
        });

        var summarysheet = Marksheets.combine(summaries);  
      } else {
        var summarysheet = new model.Marksheet();
      }

      var sum = 0;

      angular.forEach(summarysheet.table, function(student, studentId){
        if(params.hasOwnProperty("groupId")){
          var classId = [params.formIndex, params.deptId, params.groupId];
          if(student[0] !== "" && student[0] >= data.classCouncils[classId].passingScore){
            stats.passing += 1;
          }

        } else {
          Students.get(studentId).then(function(success){
            var classId = [success.formIndex, success.deptId, success.groupId];
            if(student[0] !== "" && student[0] >= data.classCouncils[classId].passingScore){
              stats.passing += 1;
            }
          }).catch(function(error){
            console.log("failed to find student:", studentId);
          })
        }
        

        if(student[0] !== "" && student[0] !== -1){
          stats.numPresent += 1;
          sum += student[0];
          
          
          if(student[0] > stats.aveHigh){
            stats.aveHigh = student[0];
          }
          if(student[0] < stats.aveLow){
            stats.aveLow = student[0];
          }
        }
      })

      stats.aveClass = sum / stats.numPresent;

      var sortedBySubject = rankSubjects(summaries);

      var n = 0;
      angular.forEach(sortedBySubject, function(subject, objId){
        if(subject.average === 0){
          n += 1;
        }
      })

      if(sortedBySubject.length - n > 2){ 
        stats.goodSubjects = [sortedBySubject[0], sortedBySubject[1], sortedBySubject[2]];
        stats.poorSubjects = sortedBySubject.slice(-3-n);
      } else if(sortedBySubject.length - n > 1){ 
        stats.goodSubjects = [sortedBySubject[0], sortedBySubject[1]];
        stats.poorSubjects = [sortedBySubject[0], sortedBySubject[1]];
      } else if(sortedBySubject.length - n > 0){ 
        stats.goodSubjects = [sortedBySubject[0]];
        stats.poorSubjects = [sortedBySubject[0]];
      }

      Students.query(params).then(function(students){
        // console.log("Students:", students);
        angular.forEach(students, function(student, studentIndex){
          stats.numStudents += 1;
          var classId = [student.formIndex, student.deptId, student.groupId];
          if(student.status['2014'] === 0){
            if(summarysheet.table[student._id]){
              if(summarysheet.table[student._id][0] >= data.classCouncils[classId].passingScore){
                stats.promote += 1;
              } else {
                stats.repeat += 1;
              }
            } else {
              stats.repeat += 1;
            }
          } else if(student.status['2014'] === 1){
            stats.promote +=1;
          }
          else if(student.status['2014'] === 2){
            stats.repeat += 1;
          } else if(student.status['2014'] === 3){
            stats.withdrawal += 1;
          } else if(student.status['2014'] === 4){
            stats.dismiss += 1;
          }
        })
        //update form and dept totals
        data.totalStats.numStudents += stats.numStudents;
        data.totalStats.promote += stats.promote;
        data.totalStats.repeat += stats.repeat;
        data.totalStats.withdrawal += stats.withdrawal;
        data.totalStats.dismiss += stats.dismiss;
        data.deptStats[params.deptId].numStudents += stats.numStudents;
        data.deptStats[params.deptId].promote += stats.promote;
        data.deptStats[params.deptId].repeat += stats.repeat;
        data.deptStats[params.deptId].withdrawal += stats.withdrawal;
        data.deptStats[params.deptId].dismiss += stats.dismiss;
      });

      if(params.groupId){
        data.classStats[params.deptId][params.groupId] = stats;
      } else {
        data.classStats[params.deptId][params.formIndex] = stats;
      }

      //update form stats
      var newSumT = data.totalStats.aveClass * data.totalStats.numPresent + stats.aveClass * stats.numPresent; 
      var newNumT = data.totalStats.numPresent + stats.numPresent;

      // data.totalStats.numStudents += stats.numStudents;
      data.totalStats.numPresent += stats.numPresent;
      data.totalStats.passing += stats.passing;
      data.totalStats.aveClass = newSumT / newNumT;

      if(stats.aveHigh > data.totalStats.aveHigh){
        data.totalStats.aveHigh = stats.aveHigh;
      }
      if(stats.aveLow < data.totalStats.aveLow){
        data.totalStats.aveLow = stats.aveLow;
      }

      //update dept stats
      var newSumD = data.deptStats[params.deptId].aveClass * data.deptStats[params.deptId].numPresent + stats.aveClass * stats.numPresent; 
      var newNumD = data.deptStats[params.deptId].numPresent + stats.numPresent;

      // data.deptStats[params.deptId].numStudents += stats.numStudents;
      data.deptStats[params.deptId].numPresent += stats.numPresent;
      data.deptStats[params.deptId].passing += stats.passing;
      data.deptStats[params.deptId].aveClass = newSumD / newNumD;

      if(stats.aveHigh > data.deptStats[params.deptId].aveHigh){
        data.deptStats[params.deptId].aveHigh = stats.aveHigh;
      }
      if(stats.aveLow < data.deptStats[params.deptId].aveLow){
        data.deptStats[params.deptId].aveLow = stats.aveLow;
      }        
    
    }).catch(function(error){
        console.log("Failed to get marksheets", error);
    });
  }

  data.totalStats = {
    numStudents:0,
    numPresent:0,
    passing:0,
    aveHigh:0,
    aveLow:21,
    aveClass:0,
    goodSubjects:[],
    poorSubjects:[],
    promote:0,
    repeat:0,
    withdrawal:0,
    dismiss:0
  }

  Marksheets.query({formIndex:$scope.formIndex}).then(function(marksheets){
    var summaries = _.map(marksheets , function(marksheet){
      var summary = Marksheets.summarize(marksheet, $scope.termIndex);
      summary.subjectId = marksheet.subjectId;
      return summary;
    });

    var sortedBySubject = rankSubjects(summaries);

    var n = 0;
    angular.forEach(sortedBySubject, function(subject, objId){
      if(subject.average === 0){
        n += 1;
      }
    })

    if(sortedBySubject.length - n > 2){ 
      data.totalStats.goodSubjects = [sortedBySubject[0], sortedBySubject[1], sortedBySubject[2]];
      data.totalStats.poorSubjects = angular.copy(sortedBySubject).slice(-3-n);
    } else if(sortedBySubject.length - n > 1){ 
      data.totalStats.goodSubjects = [sortedBySubject[0], sortedBySubject[1]];
      data.totalStats.poorSubjects = [sortedBySubject[0], sortedBySubject[1]];
    } else if(sortedBySubject.length - n > 0){ 
      data.totalStats.goodSubjects = [sortedBySubject[0]];
      data.totalStats.poorSubjects = [sortedBySubject[0]];
    }
  }); 

  Marksheets.getClasses($scope.formIndex).then(function(success){
    console.log("all classes", success);
    data.classes = success;

    angular.forEach(data.classes, function(row, classId){

      var params = {
        formIndex:$scope.formIndex, 
        deptId:row.deptId, 
        groupId:row.groupId
      }

      //get class councils for passingScore
      ClassCouncils.get(model.ClassCouncil.generateID(params)).then(function(success){
        data.classCouncils[classId] = success;
      }).catch(function(error){
        data.classCouncils[classId] = new model.ClassCouncil();
      });

      getStats(params);
    });
  }).catch(function(error){
    console.log(error);
  });

  $scope.allForms = function(){
    $scope.formIndex = -1;

    data.classStats = {};
    data.deptStats = {};
    data.totalStats = {
      numStudents:0,
      numPresent:0,
      passing:0,
      aveHigh:0,
      aveLow:21,
      aveClass:0,
      goodSubjects:[],
      poorSubjects:[],
      promote:0,
      repeat:0,
      withdrawal:0,
      dismiss:0
    }

    angular.forEach(data.forms, function(form, formIndex){
      var classes = Students.getClasses(formIndex);
      angular.forEach(classes, function(row, classId){
        var p = {
          formIndex:formIndex, 
          deptId:row.deptId, 
          groupId:row.groupId
        }
        ClassCouncils.get(model.ClassCouncil.generateID(p)).then(function(success){
          data.classCouncils[classId] = success;
        }).catch(function(error){
          data.classCouncils[classId] = new model.ClassCouncil();
        });
      });

      angular.forEach(data.depts, function(dept, deptId){
        var params = {
          formIndex:formIndex,
          deptId:deptId
        }

        getStats(params);
      })
    })
  }
  console.log("Class Stats", $scope.data.classStats);
  console.log("Total Stats", $scope.data.totalStats);
  console.log("Dept Stats", $scope.data.deptStats);
  console.log("Class Councils", $scope.data.classCouncils);

}
AnnualReportCtrl.$inject = ['$scope', '$route','$routeParams', 'model', 'Location','Marksheets', 'Forms', 'Groups', 'Departments', 'ClassCouncils', 'Students', 'Subjects', 'Lang', 'SchoolInfos'];
angular.module('SchoolMan.Reports').controller('AnnualReportCtrl', AnnualReportCtrl);
