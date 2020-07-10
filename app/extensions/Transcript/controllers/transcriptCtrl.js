'use strict';

function TranscriptCtrl($scope, $routeParams, model, Transcripts, Subjects, Students, Departments, Groups, Terms, SubjectTypes, Forms, ClassMaster, Location, SchoolInfos, Lang) {
  
    var termIndex = $scope.termIndex = $routeParams.termIndex;
    $scope.dict = Lang.getDict();
    $scope.lang = $routeParams.lang ? $routeParams.lang : Lang.defaultLang;

    $scope.open = Location.open;

    $scope.pageTitleEnglish = "ACADEMIC TRANSCRIPT";
    $scope.pageTitleFrench = "TRANSCRIPTION SCOLAIRE";
    $scope.regions = model.SchoolInfo.regions;
    $scope.studentId = $routeParams.studentId;

    $scope.classMaster = ClassMaster;

    $scope.data = {
      allForms: Forms.all(),
      departments: Departments.getAll(),
      groups: Groups.getAll(),
      allSubjects: Subjects.getAll(),
      subjectTypes: SubjectTypes.all(),
      terms: Terms.getAll(),
      marksheets: [],
      summaries: {},
      students: [],
      subjects: [],
    };
    $scope.data.term = $scope.data.terms[$routeParams.termIndex],

    $scope.types = [];
    $scope.cycles = [{name:"First Cycle"}, {name:"Second Cycle"}];

    $scope.validateCell = function(n){
      var status = 'number-valid';
      if(n > 20 || n < 0){
        status = "number-invalid";
      }
      return status;
    }

    var renderTable = function(){
      if($scope.data.cycleIndex === 0 && $scope.data.schoolInfo.version !== "gths"){
        $scope.data.forms = [$scope.data.allForms[0], 
                              $scope.data.allForms[1], 
                              $scope.data.allForms[2], 
                              $scope.data.allForms[3], 
                              $scope.data.allForms[4]];
      } else if($scope.data.cycleIndex === 0  && $scope.data.schoolInfo.version === "gths"){
        $scope.data.forms = [$scope.data.allForms[0], 
                              $scope.data.allForms[1], 
                              $scope.data.allForms[2], 
                              $scope.data.allForms[3]];
      }else if($scope.data.cycleIndex === 1  && $scope.data.schoolInfo.version !== "gths"){
        $scope.data.forms = [$scope.data.allForms[5], $scope.data.allForms[6]];
      } else {
        $scope.data.forms = [$scope.data.allForms[4], $scope.data.allForms[5], $scope.data.allForms[6]];
      }
      console.log("Forms", $scope.data.forms);

      $scope.cells = d3.range($scope.data.forms.length * 3);

      Transcripts.get($scope.data.student._id, $scope.data.cycleIndex).then(function(success){
        $scope.data.transcript = success;

        var subjects = [];
        angular.forEach($scope.data.transcript.table, function(subject, subjectId){
          subjects.push(subject);
        })
        console.log("Subjects:", subjects);

        // var count = [];

        // if($scope.data.student.formIndex < 5){
        //   count = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        // } else {
        //   count = [0,0,0,0,0,0];
        // }
        // console.log("blah", subjects, subjects[0], $scope.data.transcript.table);
        // angular.forEach(count, function(num, index){
        //   console.log(subjects[0][index]);
        //   if(subjects[0][index] !== ""){
        //     num += 1;
        //   }
        // })
        // console.log("Count1", angular.copy(count));
        var counts = [];

        angular.forEach(subjects[0], function(value, index){
          if(value !== NaN && value !== ""){
            counts[index] = 1;
          } else {
            counts[index] = 0;
          }
        })
        
        $scope.data.totals = _.reduce(angular.copy(subjects), function(sum, num){

          angular.forEach(sum, function(cell, index){
            if(Number(num[index]) !== NaN && num[index] !== ""){
              sum[index] = (Number(sum[index]) + Number(num[index]));
              counts[index] +=1;
              // if(num[index] !== ""){
              //   count[index] += 1;
              // }
            }
          })
          return sum;
        });

        $scope.data.numSubjects = counts;

        angular.forEach($scope.data.numSubjects, function(num, index){
          if(num === 0){
            $scope.data.numSubjects[index] = 1;
          }
        });

        if($scope.data.cycleIndex === 0 && $scope.data.schoolInfo.version !== "gths"){
          $scope.data.annuals = [ (Number($scope.data.totals[0])/$scope.data.numSubjects[0]+Number($scope.data.totals[1])/$scope.data.numSubjects[1]+Number($scope.data.totals[2])/$scope.data.numSubjects[2]) / 3, 
                                  (Number($scope.data.totals[3])/$scope.data.numSubjects[3]+Number($scope.data.totals[4])/$scope.data.numSubjects[4]+Number($scope.data.totals[5])/$scope.data.numSubjects[5]) / 3,
                                  (Number($scope.data.totals[6])/$scope.data.numSubjects[6]+Number($scope.data.totals[7])/$scope.data.numSubjects[7]+Number($scope.data.totals[8])/$scope.data.numSubjects[8]) / 3,
                                  (Number($scope.data.totals[9])/$scope.data.numSubjects[9]+Number($scope.data.totals[10])/$scope.data.numSubjects[10]+Number($scope.data.totals[11])/$scope.data.numSubjects[11]) / 3,
                                  (Number($scope.data.totals[12])/$scope.data.numSubjects[12]+Number($scope.data.totals[13])/$scope.data.numSubjects[13]+Number($scope.data.totals[14])/$scope.data.numSubjects[14]) / 3
                                ]
        } else if($scope.data.cycleIndex === 0 && $scope.data.schoolInfo.version === "gths"){
          $scope.data.annuals = [ (Number($scope.data.totals[0])/$scope.data.numSubjects[0]+Number($scope.data.totals[1])/$scope.data.numSubjects[1]+Number($scope.data.totals[2])/$scope.data.numSubjects[2]) / 3, 
                                  (Number($scope.data.totals[3])/$scope.data.numSubjects[3]+Number($scope.data.totals[4])/$scope.data.numSubjects[4]+Number($scope.data.totals[5])/$scope.data.numSubjects[5]) / 3,
                                  (Number($scope.data.totals[6])/$scope.data.numSubjects[6]+Number($scope.data.totals[7])/$scope.data.numSubjects[7]+Number($scope.data.totals[8])/$scope.data.numSubjects[8]) / 3,
                                  (Number($scope.data.totals[9])/$scope.data.numSubjects[9]+Number($scope.data.totals[10])/$scope.data.numSubjects[10]+Number($scope.data.totals[11])/$scope.data.numSubjects[11]) / 3
                                ]
        } else if($scope.data.cycleIndex === 1 && $scope.data.schoolInfo.version !== "gths"){
          $scope.data.annuals = [ (Number($scope.data.totals[0])/$scope.data.numSubjects[0]+Number($scope.data.totals[1])/$scope.data.numSubjects[1]+Number($scope.data.totals[2])/$scope.data.numSubjects[2]) / 3, 
                                  (Number($scope.data.totals[3])/$scope.data.numSubjects[3]+Number($scope.data.totals[4])/$scope.data.numSubjects[4]+Number($scope.data.totals[5])/$scope.data.numSubjects[5]) / 3
                                ]
        } else {
          $scope.data.annuals = [ (Number($scope.data.totals[0])/$scope.data.numSubjects[0]+Number($scope.data.totals[1])/$scope.data.numSubjects[1]+Number($scope.data.totals[2])/$scope.data.numSubjects[2]) / 3, 
                                  (Number($scope.data.totals[3])/$scope.data.numSubjects[3]+Number($scope.data.totals[4])/$scope.data.numSubjects[4]+Number($scope.data.totals[5])/$scope.data.numSubjects[5]) / 3,
                                  (Number($scope.data.totals[6])/$scope.data.numSubjects[6]+Number($scope.data.totals[7])/$scope.data.numSubjects[7]+Number($scope.data.totals[8])/$scope.data.numSubjects[8]) / 3
                                ]
        }
        
      }).catch(function(error){
        console.log("Failed to retrieve transcript:", error);
      })
    }

    angular.forEach($scope.data.allSubjects, function(subject, subjectId){
      $scope.data.subjects.push(subject);
      if($scope.types.indexOf($scope.data.subjectTypes[subject.type]) === -1){
        $scope.types.push($scope.data.subjectTypes[subject.type])
      }
    })

    SchoolInfos.get("schoolinfo").then(function(info){
      $scope.data.schoolInfo = info;
      Students.query({formIndex:$routeParams.formIndex, deptId:$routeParams.deptId, groupId:$routeParams.groupId})
          .then(function(students){
        $scope.data.students = students;
        var studentDict = _.reduce(students, function(dict, student){
          dict[student._id] = student;
          return dict
        },{});

        $scope.data.student = studentDict.hasOwnProperty($scope.studentId) ? 
                              studentDict[$scope.studentId] :
                              students[0];

        if($scope.data.student.formIndex < 5){
          $scope.data.cycleIndex = 0;
        } else {
          $scope.data.cycleIndex = 1;
        }

        renderTable();
        

      // Catch errors
      }).catch(function(error){
        console.log("Failed to find students: ", error);
      });
    }).catch(function(error){
      console.log("failed to get school info", error);
    });


  $scope.getMark = function(d){
    var i = (parseInt(d.t) + 1) * 2 + d.s - 2;
    return d.row ? d.row[i] : undefined;
  }

  var hasChanged = false;


  $scope.noteChange = function(){
    hasChanged = true;
    console.log("change noted.");
  }

  var updateTotals = function(cellIndex){
    $scope.data.totals[cellIndex] = 0;
    $scope.data.numSubjects[cellIndex] = 0;

    angular.forEach($scope.data.subjects, function(subject, subjectId){
      var val = $scope.data.transcript['table'][subject._id][cellIndex];
      if(Number(val) !== NaN && val !== ""){
        $scope.data.totals[cellIndex] += Number($scope.data.transcript['table'][subject._id][cellIndex]);
        $scope.data.numSubjects[cellIndex] += 1;
      }
    })
    if($scope.data.numSubjects[cellIndex] === 0){
      $scope.data.numSubjects[cellIndex] = 1;
    }
    if($scope.data.cycleIndex === 0 && $scope.data.schoolInfo.version !== "gths"){
      $scope.data.annuals = [ (Number($scope.data.totals[0])/$scope.data.numSubjects[0]+Number($scope.data.totals[1])/$scope.data.numSubjects[1]+Number($scope.data.totals[2])/$scope.data.numSubjects[2]) / 3, 
                              (Number($scope.data.totals[3])/$scope.data.numSubjects[3]+Number($scope.data.totals[4])/$scope.data.numSubjects[4]+Number($scope.data.totals[5])/$scope.data.numSubjects[5]) / 3,
                              (Number($scope.data.totals[6])/$scope.data.numSubjects[6]+Number($scope.data.totals[7])/$scope.data.numSubjects[7]+Number($scope.data.totals[8])/$scope.data.numSubjects[8]) / 3,
                              (Number($scope.data.totals[9])/$scope.data.numSubjects[9]+Number($scope.data.totals[10])/$scope.data.numSubjects[10]+Number($scope.data.totals[11])/$scope.data.numSubjects[11]) / 3,
                              (Number($scope.data.totals[12])/$scope.data.numSubjects[12]+Number($scope.data.totals[13])/$scope.data.numSubjects[13]+Number($scope.data.totals[14])/$scope.data.numSubjects[14]) / 3
                            ]
    } else if($scope.data.cycleIndex === 0 && $scope.data.schoolInfo.version === "gths"){
      $scope.data.annuals = [ (Number($scope.data.totals[0])/$scope.data.numSubjects[0]+Number($scope.data.totals[1])/$scope.data.numSubjects[1]+Number($scope.data.totals[2])/$scope.data.numSubjects[2]) / 3, 
                              (Number($scope.data.totals[3])/$scope.data.numSubjects[3]+Number($scope.data.totals[4])/$scope.data.numSubjects[4]+Number($scope.data.totals[5])/$scope.data.numSubjects[5]) / 3,
                              (Number($scope.data.totals[6])/$scope.data.numSubjects[6]+Number($scope.data.totals[7])/$scope.data.numSubjects[7]+Number($scope.data.totals[8])/$scope.data.numSubjects[8]) / 3,
                              (Number($scope.data.totals[9])/$scope.data.numSubjects[9]+Number($scope.data.totals[10])/$scope.data.numSubjects[10]+Number($scope.data.totals[11])/$scope.data.numSubjects[11]) / 3
                            ]
    } else if($scope.data.cycleIndex === 1 && $scope.data.schoolInfo.version !== "gths"){
      $scope.data.annuals = [ (Number($scope.data.totals[0])/$scope.data.numSubjects[0]+Number($scope.data.totals[1])/$scope.data.numSubjects[1]+Number($scope.data.totals[2])/$scope.data.numSubjects[2]) / 3, 
                              (Number($scope.data.totals[3])/$scope.data.numSubjects[3]+Number($scope.data.totals[4])/$scope.data.numSubjects[4]+Number($scope.data.totals[5])/$scope.data.numSubjects[5]) / 3
                            ]
    } else {
      $scope.data.annuals = [ (Number($scope.data.totals[0])/$scope.data.numSubjects[0]+Number($scope.data.totals[1])/$scope.data.numSubjects[1]+Number($scope.data.totals[2])/$scope.data.numSubjects[2]) / 3, 
                              (Number($scope.data.totals[3])/$scope.data.numSubjects[3]+Number($scope.data.totals[4])/$scope.data.numSubjects[4]+Number($scope.data.totals[5])/$scope.data.numSubjects[5]) / 3,
                              (Number($scope.data.totals[6])/$scope.data.numSubjects[6]+Number($scope.data.totals[7])/$scope.data.numSubjects[7]+Number($scope.data.totals[8])/$scope.data.numSubjects[8]) / 3
                            ]
    }

  }

  $scope.changeCycle = function(cycleIndex){
    $scope.data.cycleIndex = cycleIndex;
    renderTable();
  }

  $scope.save = function(subjectId, cellIndex){
    console.log("in save", subjectId, cellIndex);
    if(hasChanged){
      var value = $scope.data.transcript['table'][subjectId][cellIndex];
      // console.log("number?", isNaN(Number(value)));
      if(subjectId){
          if(value > 20 || value < 0 || isNaN(Number(value))){
              $scope.data.transcript['table'][subjectId][cellIndex] = "";
          }
      }
      // console.log("Saving: ", $scope.data.marksheet);
      $scope.data.transcript.save().then(function(success){
        updateTotals(cellIndex);
        console.log("Saved....");
        hasChanged = false;         
      }).catch(function(error){
        console.log("Save error: ", error);
      });
    } else {
      }
  };

}
TranscriptCtrl.$inject = ['$scope', '$routeParams', 'model', 'Transcripts', 'Subjects', 'Students', 'Departments', 'Groups', 'Terms', 'SubjectTypes', 'Forms', 'ClassMaster', 'Location', 'SchoolInfos', 'Lang'];
angular.module('SchoolMan.Transcript').controller('transcriptCtrl', TranscriptCtrl);