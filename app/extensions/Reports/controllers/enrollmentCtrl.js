'use strict';

function EnrollmentCtrl($scope, $route, $routeParams, model, Location, Marksheets, Forms, Groups, Departments, Terms, ClassCouncils, Students, Subjects, Lang, SchoolInfos) {
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

  var getStats = function(params){   
    if(!data.classStats.hasOwnProperty(params.deptId)){
      data.classStats[params.deptId] = {};
    } 
    var stats = {
      boysOnRoll:0,
      girlsOnRoll:0,
      boysEOY:0,
      girlsEOY:0,
      boysPromote:0,
      girlsPromote:0,
      boysRepeat:0,
      girlsRepeat:0,
      boysWithdraw:0,
      girlsWithdraw:0,
      boysDismiss:0,
      girlsDismiss:0
    }
    if(!data.deptStats.hasOwnProperty(params.deptId)){
      data.deptStats[params.deptId] = angular.copy(stats);
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

      Students.query(params).then(function(students){
        angular.forEach(students, function(student, studentIndex){
          var classId = [student.formIndex, student.deptId, student.groupId];
          if(student.sex === "Male"){
            stats.boysOnRoll += 1;
            stats.boysEOY += 1;

            if(student.status['2014'] === 0){
              if(summarysheet.table[student._id]){
                if(summarysheet.table[student._id][0] >= data.classCouncils[classId].passingScore){
                  stats.boysPromote += 1;
                } else {
                  stats.boysRepeat += 1;
                }
              } else {
                stats.boysRepeat += 1;
              } 
              
            } else if(student.status['2014'] === 1){
              stats.boysPromote +=1;
            }
            else if(student.status['2014'] === 2){
              stats.boysRepeat += 1;
            } else if(student.status['2014'] === 3){
              stats.boysWithdraw += 1;
              stats.boysEOY -= 1;
            } else if(student.status['2014'] === 4){
              stats.boysDismiss += 1;
              stats.boysEOY -= 1
            }
          } else {
            stats.girlsOnRoll += 1;
            stats.girlsEOY += 1;

            if(student.status['2014'] === 0){
              if(summarysheet.table[student._id]){
                if(summarysheet.table[student._id][0] >= data.classCouncils[classId].passingScore){
                  stats.girlsPromote += 1;
                } else {
                  stats.girlsRepeat += 1;
                }
              } else {
                stats.girlsRepeat += 1;
              }
            } else if(student.status['2014'] === 1){
              stats.girlsPromote +=1;
            }
            else if(student.status['2014'] === 2){
              stats.girlsRepeat += 1;
            } else if(student.status['2014'] === 3){
              stats.girlsWithdraw += 1;
              stats.girlsEOY -= 1;
            } else if(student.status['2014'] === 4){
              stats.girlsDismiss += 1;
              stats.girlsEOY -= 1;
            }
          }
        })
        if(params.groupId){
          data.classStats[params.deptId][params.groupId] = stats;
        } else {
          data.classStats[params.deptId][params.formIndex] = stats;
        }

        angular.forEach(stats, function(value, label){
          data.totalStats[label] += value;
          data.deptStats[params.deptId][label] += value;
        })
      })
    })

  }

  data.totalStats = {
    boysOnRoll:0,
    girlsOnRoll:0,
    boysEOY:0,
    girlsEOY:0,
    boysPromote:0,
    girlsPromote:0,
    boysRepeat:0,
    girlsRepeat:0,
    boysWithdraw:0,
    girlsWithdraw:0,
    boysDismiss:0,
    girlsDismiss:0
  }

  data.classes = Students.getClasses($scope.formIndex)
    console.log("all classes", data.classes);

  angular.forEach(data.classes, function(row, classId){

    var params = {
      formIndex:$scope.formIndex, 
      deptId:row.deptId, 
      groupId:row.groupId
    }

    //get class councils for passing score
    ClassCouncils.get(model.ClassCouncil.generateID(params)).then(function(success){
      data.classCouncils[classId] = success;
    }).catch(function(error){
      data.classCouncils[classId] = new model.ClassCouncil();
    });

    getStats(params);
  });

  $scope.allForms = function(){
    $scope.formIndex = -1;

    data.classStats = {};
    data.deptStats = {};
    data.totalStats = {
      boysOnRoll:0,
      girlsOnRoll:0,
      boysEOY:0,
      girlsEOY:0,
      boysPromote:0,
      girlsPromote:0,
      boysRepeat:0,
      girlsRepeat:0,
      boysWithdraw:0,
      girlsWithdraw:0,
      boysDismiss:0,
      girlsDismiss:0
    };

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
  // console.log("Class Stats", data.classStats);
  // console.log("Form Stats", data.totalStats);
  // console.log("Dept Stats", data.deptStats);
  // console.log("Class Councils", data.classCouncils);

}
EnrollmentCtrl.$inject = ['$scope', '$route','$routeParams', 'model', 'Location','Marksheets', 'Forms', 'Groups', 'Departments', 'Terms', 'ClassCouncils', 'Students', 'Subjects', 'Lang', 'SchoolInfos'];
angular.module('SchoolMan.Reports').controller('EnrollmentCtrl', EnrollmentCtrl);
