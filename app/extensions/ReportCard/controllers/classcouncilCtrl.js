'use strict';

/**
 * @ngdoc controller
 * @name SchoolMan.controller:ClasscouncilCtrl
 * @method {function} performanceStats
 * @method {function} updatePerformanceRanks
 * @method {function} changeAcRemark
 * @method {function} changeConRemark
 * @description Class council view controller
 *
 */
function ClasscouncilCtrl($scope, $routeParams, model, Marksheets, Students, ClassCouncils, Groups, Forms, Departments, Terms, Location, SchoolInfos, Lang){

    $scope.pageTitleEnglish = "CLASS COUNCIL REPORT";
    $scope.pageTitleFrench = "RAPPORT DU CONSEIL DE CLASSE";
    $scope.userAccess = $routeParams.accessCode;
    $scope.regions = model.SchoolInfo.regions;
    $scope.dict = Lang.getDict();
    $scope.lang = $routeParams.lang ? $routeParams.lang : Lang.defaultLang;

    $scope.formIndex = $routeParams.formIndex;
    $scope.groupId = $routeParams.groupId;
    $scope.deptId = $routeParams.deptId;
    $scope.termIndex = parseInt($routeParams.termIndex);

    var classcouncilId = model.ClassCouncil.generateID($routeParams);

    $scope.data = {};
    $scope.data.forms = Forms.all();
    $scope.data.departments = Departments.getAll();
    $scope.data.groups = Groups.getAll();
    $scope.data.terms = Terms.getAll();
    $scope.data.currentDate = new Date();
    $scope.data.rankings = {};
    $scope.data.rankingsList = [];
    $scope.data.bestStudents = [];
    $scope.data.worstStudents = [];
    $scope.data.bestAverages = [];

    $scope.data.classcouncil = new model.ClassCouncil({_id:classcouncilId,formIndex:$scope.formIndex,groupId:$scope.groupId,deptId:$scope.deptId});

    ClassCouncils.get(classcouncilId).then(function(classcouncil){
        $scope.data.classcouncil = classcouncil;
    });

    SchoolInfos.get("schoolinfo").then(function(info){
        $scope.data.schoolInfo = info;
        //console.log("school info retrieved", $scope.data.schoolInfo);
    }).catch(function(error){
        console.log("failed to get school info", error);
    });


    $scope.groupStats = {};

    $scope.open = Location.open;


     Marksheets.query({
        formIndex:$routeParams.formIndex,
        deptId:$routeParams.deptId,
        groupId:$routeParams.groupId
      }).then(function(marksheets){

        // Convert marksheets to a list and store in $scope.data.marksheets

        
        
        $scope.data.marksheets = _.map(Object.keys(marksheets), function(marksheetId){
          return marksheets[marksheetId];
        });

        $scope.data.summaries = _.map(marksheets , function(marksheet){
          var summary = Marksheets.summarize(marksheet, $scope.termIndex);
          return summary;
        });    

        $scope.data.combinedMarksheet = Marksheets.combine($scope.data.summaries);
        
        
        $scope.groupStats = performanceStats();

        $scope.score = $scope.data.classcouncil.passingScore;
        
        // get rankings from combined marksheet
        $scope.data.rankings = Marksheets.rank($scope.data.marksheets);
        console.log("rankings:", $scope.data.rankings);
        
        updatePerformanceRanks();
        // console.log("User access", $scope.userAccess);

       

      })
      .catch(function(error){
        console.log("Failed to find marksheets", error);
      });

    /**
     * @ngdoc method
     * @methodOf SchoolMan.controller:ClasscouncilCtrl
     * @return {object} Returns a hash of class stats
     * @name SchoolMan.controller:ClasscouncilCtrl#performanceStats
     * @description This sets the class performance statistics for display on the class council page
     */

    var performanceStats = function(){
        var stats = {
            numStudents:0,
            numPresent:0,
            passing:0,
            failing:0,
            percentPassing:0,
            percentFailing:0,
            classAverage:0,
            classRange:0
        };

        var minStudent = 20;
        var maxStudent = 0;
        var studentAvg = 0;
        var classTotal = 0;
        
        angular.forEach($scope.data.combinedMarksheet.table, function(student, studentId){
            stats.numStudents = stats.numStudents +1;
            studentAvg = student[0];

            if(studentAvg >= $scope.data.classcouncil.passingScore){
                stats.passing = stats.passing +1;
            }
            if(!isNaN(studentAvg) && studentAvg !== -1){
                classTotal = classTotal + studentAvg;
                stats.numPresent = stats.numPresent + 1;
                if(studentAvg < minStudent){
                    minStudent = studentAvg;
                }
                if(studentAvg > maxStudent){
                    maxStudent = studentAvg;
                }
            }
        });

        stats.failing = stats.numPresent - stats.passing;
        stats.percentPassing = stats.passing / stats.numPresent;
        stats.percentFailing = 1 - stats.percentPassing;
        stats.classAverage = classTotal / stats.numPresent;
        stats.classRange = minStudent === 20 ? 0 : maxStudent - minStudent;
        return stats;
    }

    /**
     * @ngdoc method
     * @methodOf SchoolMan.controller:ClasscouncilCtrl
     * @name SchoolMan.controller:ClasscouncilCtrl#updatePerformanceRanks
     * @description This sets/updates the rankings of students to display top three and bottom three performances
     */

    var updatePerformanceRanks = function(){
        var studentIds = Object.keys($scope.data.rankings);
        var rankingsList = _.map(studentIds, function(studentId){
            var obj = {};
            obj.rankings = $scope.data.rankings[studentId];
            obj.studentId = studentId;
            return obj;
        })

        var sortedList = rankingsList.sort(function(a,b){
            return a.rankings[$scope.termIndex] - b.rankings[$scope.termIndex];
        })
        var n = 0;
        angular.forEach(sortedList, function(student, objId){
                if(isNaN(student.rankings[$scope.termIndex])){
                    n += 1;
                }
            })

        var top3 = [];
        var worst3 = [];

        if(sortedList.length > 2){        
            top3 = [sortedList[0].studentId,sortedList[1].studentId,sortedList[2].studentId];
            var sortedListEnd = sortedList.slice(-3-n);
            worst3 = [sortedListEnd[0].studentId,sortedListEnd[1].studentId,sortedListEnd[2].studentId];
        }
        else if(sortedList.length > 1){
            top3 = [sortedList[0].studentId,sortedList[1].studentId];
            worst3 = [sortedList[0].studentId,sortedList[1].studentId];
        }
        else if(sortedList.length > 0){
            top3 = [sortedList[0].studentId];
            worst3 = [sortedList[0].studentId];
        }


        Students.getBatch(top3).then(function(students){
            $scope.data.bestStudents = _.map(students, function(student){
                student.average = $scope.data.combinedMarksheet.table[student._id][0];
                return student;
            });
        }).catch(function(error){
          console.log("Failed to find students: ", error);
        });
        Students.getBatch(worst3).then(function(students){
            $scope.data.worstStudents = _.map(students, function(student){
                student.average = $scope.data.combinedMarksheet.table[student._id][0];
                return student;
            });
        }).catch(function(error){
          console.log("Failed to find students: ", error);
        });
    }

    /**
     * @ngdoc method
     * @methodOf SchoolMan.controller:ClasscouncilCtrl
     * @param {string} remark Academic remark to be saved
     * @name SchoolMan.controller:ClasscouncilCtrl#changeAcRemark
     * @description This sets and saves the academic remark for the current class council
     */

    $scope.changeAcRemark = function(remark){
        $scope.data.classcouncil.academicRemark[$scope.termIndex] = remark;
        $scope.save();
    }

    /**
     * @ngdoc method
     * @methodOf SchoolMan.controller:ClasscouncilCtrl
     * @param {string} remark Conduct remark to be saved
     * @name SchoolMan.controller:ClasscouncilCtrl#changeConRemark
     * @description This sets and saves the conduct remark for the current class council
     */
    $scope.changeConRemark = function(remark){
        $scope.data.classcouncil.conductRemark = remark;
        $scope.save();
    }

    /**
     * @ngdoc method
     * @methodOf SchoolMan.controller:ClasscouncilCtrl
     * @param {string} score New Passing Score
     * @name SchoolMan.controller:ClasscouncilCtrl#updatePassingScore
     * @description This sets and saves the new passing score for the class
     */
    $scope.updatePassingScore = function(score){
        if(isNaN(Number(score))){
            $scope.score = $scope.data.classcouncil.passingScore;
        }
        else{
            $scope.score = score;
            $scope.data.classcouncil.passingScore = Number(score);
            $scope.groupStats = performanceStats();
            $scope.save();
        }
    }

    /**
     * @ngdoc method
     * @methodOf SchoolMan.controller:ClasscouncilCtrl
     * @name SchoolMan.controller:ClasscouncilCtrl#save
     * @description This saves the current class council to pouchdb
     */
    $scope.save = function(){
        $scope.data.classcouncil.save().then(function(success){
            // console.log("Council saved", success);
        }).catch(function(error){
            console.log("Council save error ", error);
        });
    }

    $scope.data.remarks = [
    	{text:"excellent", css:"remark-excellent"},
    	{text:"very_good", css:"remark-verygood"},
    	{text:"good", css:"remark-good"},
    	{text:"fair", css:"remark-fair"},
    	{text:"average", css:"remark-average"},
    	{text:"poor", css:"remark-poor"},
    	{text:"very_poor", css:"remark-verypoor"}
    ];


}
ClasscouncilCtrl.$inject = ['$scope', '$routeParams', 'model', 'Marksheets', 'Students', 'ClassCouncils', 'Groups', 'Forms', 'Departments', 'Terms', 'Location', 'SchoolInfos', 'Lang']
angular.module('SchoolMan.ReportCard').controller('ClasscouncilCtrl', ClasscouncilCtrl);