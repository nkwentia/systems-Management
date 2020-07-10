'use strict';
define(['ClassCouncils', 'Salarys','Groups', 'Subjects', 'Payments', 'Staffs', 'Departments',  'Location'], function(ClassCouncils, Salarys, Groups, Subjects, Payments, Staffs, Departments,  Location){
function StaffsCtrl($scope, $q, $routeParams, model, PROMOTE_OPTIONS, ClassCouncils, Salarys, Groups, Subjects, Payments, Staffs, Departments,  Location) {

    $scope.PROMOTE_OPTIONS = PROMOTE_OPTIONS;

  	// $scope.courseId = CourseCatalog.getCourseId($routeParams);

    var data = $scope.data = {
        // forms:Forms.all(),
        // departments:Departments.getAll(),
        groups:Groups.getAll(),
        salarys:Salarys.getAll(),
        subjects:Subjects.getAll(),
        staffs:[],
        selected:{},
        globalSelect:0,
        page:0,
        pages:[]
    };

    // $scope.formIndex = $routeParams.formIndex;
    // $scope.groupId = $routeParams.groupId;
    // $scope.deptId = $routeParams.deptId;

    $scope.queryParams = {
        // formIndex:$scope.formIndex,
        groupId:$scope.groupId,
        deptId:$scope.deptId,
        salaryId:"all"
    }

    var reports = {};
    var classCouncils = {};
    var marksheetId;
    var marksheet;

    var updateStaffs = function(){
      var query = {};
      angular.forEach($scope.queryParams, function(value, key){
        var all = ['all', undefined, 'undefined'];
        if(all.indexOf(value) === -1){
            query[key] = value;
        }
      });  
      //console.log("query:", query); 

      // var setPassing = function(staff, classId){
      //   var staffAverage = 0;
      //   if(reports[classId].total.summary){
      //     staffAverage = reports[classId].total.summary['table'][staff._id][0];
      //   }
      //   student.passing = studentAverage >= classCouncils[classId].passingScore;            
      // };

      var getSeconds = function(_initial, _final){
        return (_final.getTime() - _initial.getTime())/1000;
      }

      var START_QUERY = new Date();
      Staffs.query(query).then(function(staffs){
        var END_QUERY = new Date();
        console.log("TIME DIFF: ", getSeconds(START_QUERY, END_QUERY));

        console.log("Success loading staffs", staffs);
        $scope.data.staffs = staffs;
        $scope.data.pages = _.range(staffs.length / 10);

        angular.forEach(staffs, function(staff, staffIndex){

          // create a temporary 'passing' property for student
          // default to false
          staff.passing = false;

          // set default selection state
          $scope.data.selected[staff._id] = 0;
          
          // Add payment data to student
          //student.totalPaid = 0;
          //Payments.query({studentId:student._id}).then(function(payments){
          //  console.log("Got payments", student._id, payments);
          //  student.totalPaid = _.reduce(payments, function(total, payment){
          //    return total + payment.amount;
          //  },student.totalPaid);
          //}).catch(function(error){
          //  console.log("Failed to load payments for ", student.name, error);
          //});

          // add students class to reports
          // var staffsClass = [staff.formIndex, staff.deptId, staff.groupId];
          //console.log("reports/class councils", reports, classCouncils, studentsClass);
            
          
          if(reports.hasOwnProperty(saffsClass) &&  
             classCouncils.hasOwnProperty(staffsClass)){
            //console.log("in if statement reports/class councils", reports, classCouncils, studentsClass, student);


            setPassing(staff, staffsClass);

          } else {
            //console.log("in else statement", reports, classCouncils, studentsClass, student);
            //getReports(studentsClass);
            //setPassing(student, studentsClass);
          }

        }); 
      }).catch(function(error){
        console.log("Error loading staffs", error);
      });  
    };

    
    

    // var getReports = function(params){
    //   //console.log("in getreports reports/class councils", reports, classCouncils, studentsClass, reports[studentsClass]);
    //         // get report and classCOuncil promises
    //         //console.log("params:", params);

    //         var reportquery = {
    //           reports: Marksheets.getReports({
    //             // formIndex:params.formIndex,
    //             deptId:params.deptId,
    //             groupId:params.groupId
    //         })
    //         }
    //         var councilquery = {
    //           classcouncil: ClassCouncils.get(model.ClassCouncil.generateID({
    //             deptId:params.deptId,
    //             groupId:params.groupId
    //           }))
    //         }
    //         var staffsClass = [params. params.deptId, params.groupId];

    //         // Get reports and classCouncils
    //         $q.all(councilquery).then(function(data){
    //           //console.log("all promises: ", data);
    //           classCouncils[staffsClass] = data.classcouncil;
    //         }).catch(function(error){
    //           if(!classCouncils[staffsClass]){
    //             classCouncils[staffsClass] = new model.ClassCouncil();
    //           }
    //           // console.log("Failed to load classCouncils:", error);
    //         });
    //         $q.all(reportquery).then(function(data){
    //           //console.log("all promises: ", data);
    //           reports[staffsClass] = data.reports;
    //           //console.log("reports[studentsClass", reports[studentsClass], reports);
    //           updateStaffs();
              
              
    //         }).catch(function(error){
    //             console.log("Failed to load reports", error);
    //             updateStaffs();
    //         });
    // }
    // var queryReports = function(staffsClass){
      
    //   var params = angular.copy(staffsClass);
    //   angular.forEach(params, function(value, key){
    //     if(value === "all"){
    //       if(key === "deptId"){
    //         params[key] = data.departments;
    //       }
    //       if(key === "groupId"){
    //         params[key] = data.groups;
    //       }
    //     }
    //     else{
    //       params[key] = [value];
    //     }
    //   });

    //     angular.forEach(params.deptId, function(dept, deptKey){
    //       angular.forEach(params.groupId, function(group, groupKey){
    //         //console.log("formkey:", formKey, form);
    //         if(group._id){
    //           group = group._id;
    //         }
    //         if(dept._id){
    //           dept = dept._id;
    //         }
    //         // if(!(reports.hasOwnProperty(staffsClass) && classCouncils.hasOwnProperty(staffsClass))){
    //         //   getReports({formIndex:form,deptId:dept,groupId:group});
    //         // }
    //         else{
    //           updateStaffs();
    //         }
    //       })
    //     })
      


    //   //var newArray = {};


    //   //console.log("query Parameters:", params);
    //   //getReports(studentsClass);
    // }

    // queryReports($scope.queryParams);
    

    // $scope.setQuery = function(params){
    //   angular.forEach(params, function(value, key){
    //       $scope.queryParams[key] = value;
    //   });
    //   $scope.data.page = 0;
    //   //console.log("Query Params", $scope.queryParams);
    //   queryReports($scope.queryParams);
    // };

    $scope.moveTab = "form";

    $scope.toggleAll = function(){
        // console.log("toggling");
        // $scope.data.globalSelect = (parseInt($scope.data.globalSelect) + 1) % 2;
        angular.forEach($scope.data.selected, function(selection, staffId){
          $scope.data.selected[staffId] = $scope.data.globalSelect;
        });
        // console.log("Selected", $scope.data.selected);
    };

    $scope.moveSelected = function(params){
        var selected = [];
        var tagged = [];
        
        angular.forEach(data.staffs, function(staff, $index){
            if(data.selected[staff._id] === "1"){
                angular.forEach(params, function(value, key){
                    if(key === 'groupId' || key === 'deptId'){
                      tagged.push(staff);
                    }
                    staff[key] = value;
                });
                selected.push(staff);
                updateStaffs();
            }
        });
        Staffs.saveBatch(selected).catch(function(error){
            // console.log("failed to save batch", error);
        });
        removeFromMarksheet(tagged);
    };
    // var removeFromMarksheet = function(students){
    //   angular.forEach(data.subjects, function(subject, subjectKey){
    //     marksheetId =  $scope.formIndex + ":" + $scope.deptId + ":" + $scope.groupId + ":" + subjectKey;
    //     Marksheets.get(marksheetId).then(function(success){
    //       marksheet = success.marksheet;
    //       angular.forEach(students, function(student, key){
    //         delete marksheet.table[student['_id']];
    //       });
    //       var deferred = $q.defer();
    //       marksheet.save().then(function(success){
    //         //console.log("Marksheet Saved:", marksheet);
    //         deferred.resolve(marksheet);
    //       }).catch(function(error){
    //         console.log("Failed to save marksheet", error, marksheet);
    //         deferred.reject(error);
    //       });
    //     }).catch(function(error){
    //       console.log("marksheet does not exist");
    //     });
    //   });
    // }

    $scope.open = Location.open;
    
    $scope.salarys = Salarys.getAll();

    // $scope.mastersheets = {};

    // $scope.groupStats = {
    //     0:{passing:0, failing:0, percentPassing:0},
    //     1:{passing:0, failing:0, percentPassing:0}
    // }
    
    // var subjects = CourseCatalog.getSubjects($routeParams.formIndex);

    // var updateGroupStats = function(group, stats){
    //     console.log("Updating ", group , stats);
    //     $scope.groupStats[group] = stats;
    // };

    // This is doing more work than it needs to because we dont need a mastersheet
    // for every course
    // var passingScore = _groups[$routeParams.groupIndex].getPromoPass($routeParams.formIndex)
    // var passingScore = 10;
    // var buildMastersheet = function(groupIndex){
        
    //     var courses = CourseCatalog.getCourses($routeParams.formIndex, groupIndex);
    //     var courseIds = courses.map(function(course){return course.id});

    //     var marksheets = ClassMaster.getMarksheets(courseIds);
    //     var mastersheet = new Mastersheet({
    //         termIndex:0,
    //         subjects:subjects,
    //         marksheets:marksheets,
    //         getSubjectKey:CourseCatalog.getSubjectKey
    //     });
    //     $scope.mastersheets[groupIndex] = mastersheet;

    //     updateGroupStats(groupIndex, mastersheet.numstats(passingScore));
    // };



  }
  StaffsCtrl.$inject = ['$scope', '$q', '$routeParams', 'model', 'PROMOTE_OPTIONS', 'ClassCouncils', 'Salarys','Groups', 'Subjects', 'Payments', 'Staffs', 'Departments',  'Location'];
  angular.module('SchoolMan').register.controller('StaffsCtrl', StaffsCtrl);
})