'use strict';

function ReportcardCtrl($scope, $routeParams, PROMOTE_OPTIONS, model, ClassCouncils, Dcards, Users, Subjects, Students, Marksheets, Departments, Groups, Terms, SubjectTypes, Forms, ClassMaster, Location, SchoolInfos, Lang, Logo) {
 
  var termIndex = $scope.termIndex = $routeParams.termIndex;

  
  $scope.s = [(parseInt(termIndex) + 1) * 2 - 1, (parseInt(termIndex) + 1) * 2]

  $scope.Marksheets = Marksheets;
  $scope.ClassMaster = ClassMaster;
  $scope.dict = Lang.getDict();
  $scope.lang = $routeParams.lang ? $routeParams.lang : Lang.defaultLang;

  $scope.open = Location.open;
  $scope.pageTitleEnglish = "ACADEMIC REPORT CARD";
  $scope.pageTitleFrench = "BULLETIN DE NOTES";
  $scope.regions = model.SchoolInfo.regions;

  $scope.PROMOTE_OPTIONS = PROMOTE_OPTIONS;
  $scope.Users = Users;
  $scope.getRemark = ClassMaster.getRemark;
  $scope.studentId = $routeParams.studentId;

  $scope.data = {};
  $scope.data.forms = Forms.all();
  $scope.data.departments = Departments.getAll();
  $scope.data.groups = Groups.getAll();
  $scope.data.subjects = Subjects.getAll();
  $scope.data.subjectTypes = SubjectTypes.all();
  $scope.data.terms = Terms.getAll();
  $scope.data.term = $scope.data.terms[$routeParams.termIndex];
  $scope.data.marksheets = [];
  $scope.data.summaries = [];
  $scope.data.annualsummaries = [];
  $scope.data.rankings = {};
  $scope.data.students = [];
  $scope.data.student;

  var getLogo = function(){
    var elements = document.getElementsByName("logo-image");

    Logo.getAttachment().then(function(success){
      for(var i = 0; i < elements.length; i++){
        if(elements[i].childElementCount === 0){
          var img = document.createElement('img');
          img.src = URL.createObjectURL(success);
          img.width = "100";
          elements[i].appendChild(img);
        }
      }
      console.log("Image Elements", elements);

    })
  }

  SchoolInfos.get("schoolinfo").then(function(info){
    $scope.data.schoolInfo = info;
    //console.log("school info retrieved", $scope.data.schoolInfo);
  }).catch(function(error){
    console.log("failed to get school info", error);
  });
  

  // Load marksheet and student data
  Marksheets.query({
    formIndex:$routeParams.formIndex,
    deptId:$routeParams.deptId,
    groupId:$routeParams.groupId
  })
  .then(function(marksheets){
    

    getLogo();

    var marksheetStudents = marksheets.map(function(marksheet){
      return Object.keys(marksheet.table);
    });

    // Convert marksheets to a list
    $scope.data.marksheets = _.map(Object.keys(marksheets), function(marksheetId){
      return marksheets[marksheetId];
    });
    angular.forEach($scope.data.marksheets, function(marksheet, $index){
      $scope.data.rankings[marksheet._id] = Marksheets.rank([marksheet]);
    });


    var sets = $scope.data.sets = {};
    angular.forEach($scope.data.marksheets, function(marksheet, i){

      // Types are: General, Specialized, and Other
      var type = $scope.data.subjects[marksheet.subjectId].type;
      if(!sets.hasOwnProperty(type)){
        sets[type] = {marksheets:[],
                      summsheets:[]};
      }
      sets[type].marksheets.push(marksheet);
      var summsheet = Marksheets.summarize(marksheet, termIndex);
      sets[type].summsheets.push(summsheet);
      if($scope.termIndex === '2' || $scope.termIndex === 2){
        var annualsummsheet = Marksheets.summarize(marksheet, 3);
        $scope.data.annualsummaries.push(annualsummsheet);
      }
      $scope.data.summaries.push(summsheet);
    });

    angular.forEach(sets, function(set, i){
      sets[i].msheet = Marksheets.combine(set.summsheets);
      console.log("msheet", sets[i].msheet);
      sets[i].rankings = Marksheets.rank(set.marksheets);
    });

    if($scope.termIndex === '2' || $scope.termIndex === 2){
      $scope.data.annualmsheet = Marksheets.combine($scope.data.annualsummaries);
    }
    $scope.data.msheet = Marksheets.combine($scope.data.summaries);
    $scope.data.rankings.master = Marksheets.rank($scope.data.marksheets);
    console.log("data.rankings", $scope.data.rankings);
    

    $scope.nsets = Object.keys(sets).length;

    // Create a list of student from the union of marksheet studentIds
    var studentIds = _.union(_.reduce(marksheetStudents, function(result, list){
      return result.concat(list);
    },[]));

    Students.getBatch(studentIds).then(function(students){
      $scope.data.students = students;
      var studentDict = _.reduce(students, function(dict, student){
        dict[student._id] = student;
        return dict
      },{});

      $scope.data.student = studentIds.indexOf($scope.studentId) > -1 ? 
                            studentDict[$scope.studentId] :
                            students[0];
      console.log("Student: ", $scope.data.student);
      Dcards.get($scope.data.student._id).then(function(dcard){
        $scope.data.dcard = dcard;
        // console.log("Dcard data", $scope.data.dcard)
      }).catch(function(error){
        console.log("Failed to get dcard", error);
      })


    // Catch errors
    }).catch(function(error){
      console.log("Failed to find students: ", error);
    });
  })
  .catch(function(error){
    console.log("Failed to find marksheets", error);
  });

  ClassCouncils.get(model.ClassCouncil.generateID($routeParams))
    .then(function(classcouncil){
      $scope.passingScore = classcouncil.passingScore; 
    }).catch(function(error){
      $scope.passingScore = 10;
    });


  $scope.getMark = function(d){
      var i = (parseInt(d.t) + 1) * 2 + d.s - 2;
      return d.row ? d.row[i] : undefined;
  }

  $scope.getTermAve = function(d){
    var s1 = parseFloat(d.row[(parseInt(d.t) + 1) * 2 - 2]);
    var s2 = parseFloat(d.row[(parseInt(d.t) + 1) * 2 - 1]);

    var sequences = [s1, s2];
    var total = 0;
    var test = false;
    var count = 0;

    angular.forEach(sequences, function(s, sIndex){
      if(typeof s === "number" && !isNaN(s)){
        total += s;
        test = true;
        count += 1;
      }
      
    });
    if(test === true){
      return total / count;
    }
    else{
      return null;
    }
  }

  $scope.formatNumber = function(num){
  // console.log("n", num, Number(num));
  var n = "";
  if(Math.round(Number(num)) !== Number(num)){
    if(Number(num.toFixed(1)) === Number(num.toFixed(2))){
        n += Number(num).toFixed(1);
      } else {
        n += Number(num).toFixed(2);
      }
    } else {
      n += num;
    }
    if(Number(num) < 10){
      n = "0" + n;
    }
    return n;
  }

}
ReportcardCtrl.$inject = ['$scope', '$routeParams', 'PROMOTE_OPTIONS', 'model', 'ClassCouncils', 'Dcards', 'Users', 'Subjects', 'Students', 'Marksheets', 'Departments', 'Groups', 'Terms', 'SubjectTypes', 'Forms', 'ClassMaster', 'Location', 'SchoolInfos', 'Lang', 'Logo'];
angular.module('SchoolMan.ReportCard').controller('reportcardCtrl', ReportcardCtrl);

