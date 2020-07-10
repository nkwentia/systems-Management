'use strict';

/**
 * @ngdoc controller
 * @name SchoolMan.controller:MainCtrl
 * @method {function} add
 * @description
 *
 * This is currently used by all views. It does a lot of different things and
 * is reloaded everytime the route changes. It would probably be a good idea
 * to move some of these things into a service where we can use caching
 */

function MainCtrl($scope, $location, $anchorScroll, $routeParams, Cache, Data, Location, Path, CourseCatalog, TimeTable, Registrar, ClassMaster, Lang) {

    $scope.page = $routeParams.page;
    $scope.view = $routeParams.view;
    $scope.accessCode = $routeParams.accessCode;
    $scope.dict = Lang.getDict();

    $anchorScroll(); // Scroll to top of page

    $scope.forms = CourseCatalog.getForms();
    $scope.form  = $scope.forms[$routeParams.formIndex];

    $scope.groups = CourseCatalog.getGroups();
    $scope.group  = $scope.groups[$routeParams.groupIndex];

    $scope.subjects = CourseCatalog.getSubjects($routeParams.formIndex);
    $scope.subject  = $scope.subjects[$routeParams.subjectKey];

    $scope.terms = CourseCatalog.getTerms();
    $scope.term  = $scope.terms[$routeParams.termIndex];
    $scope.termIndex = $routeParams.termIndex;

    $scope.courseId = CourseCatalog.getCourseId($routeParams);
    $scope.username = $routeParams.username;
    $scope.teacher = Cache.get('user');

    $scope.students = Registrar.getStudentsByCourse($scope.courseId);
    $scope.student = $routeParams.studentId === "0" ?
      Registrar.getStudent($scope.students[0].id) :
      Registrar.getStudent($routeParams.studentId);

    $scope.marksheet= ClassMaster.getMarksheet($scope.courseId);
    // console.log("Marksheet", $scope.marksheet);
    // console.log("Listeners", $scope.marksheet.getListeners());

    // get all marksheets for all subjects in this class
    $scope.marksheets = {};
    angular.forEach($scope.subjects, function(subject, subjectKey){
      var params = {
        formIndex:$routeParams.formIndex,
        groupIndex:$routeParams.groupIndex,
        subjectKey:subjectKey};
      $scope.marksheets[subjectKey] = ClassMaster.getMarksheet(CourseCatalog.getCourseId(params));
    });

    $scope.open = Location.open;

    $scope.getMarksheet = function(subjectKey){
      return $scope.marksheets[subjectKey];
    };

    $scope.getRemark = function(average){
      return ClassMaster.getRemark(average);
    };

    $scope.getCourseId = function(d){
      var params = angular.copy($routeParams);
      angular.forEach(d, function(param, paramKey){
        params[paramKey] = param;
      });
      return  CourseCatalog.getCourseId(params);
    }

    $scope.getTeacher = function(subjectKey){
      var courseId = $scope.getCourseId({subjectKey:subjectKey});
      var bookmark = TimeTable.getTeacher(courseId);
      var username = bookmark.username || "";
      var teacher = {};
      Data.get('users', function(users){
        var user = users[username];
        teacher.fullname = user ? user.fullname : "";
      });
      return teacher;
    };

    // $scope.marksheet = ClassMaster.getMarksheet()

    $scope.getStudentsByCourse = Registrar.getStudentsByCourse;

    // TimeTable returns courseRefs, CourseCatalog returns actual courses
    $scope.courses = CourseCatalog.getCoursesByRef(
      TimeTable.getCourseRefs($routeParams.username)
    );

    // console.log("Courses", $scope.courses);

    // private method
    var refreshCourseList = function(){
      // Update in-scope courses and apply to update view
      $scope.courses = CourseCatalog.getCoursesByRef(
        TimeTable.getCourseRefs($routeParams.username)
      )
    }


    // START: myclasses

    /**
     * @ngdoc controller
     * @name Schoolman.controller:MainCtrl#addCourse
     * @methodOf SchoolMan.controller:MainCtrl
     * @param {bookmark} The bookmark includes the teacherId and courseId
     * @description
     *
     * ## Global Utilities
     *
     * This module houses utillities that can be used
     * across the app. There are some pretty cool and
     * uncool methods in this module so check it outizzle.
     *
     * Note, if you do not define the module using @doc module
     * and the @name with the module id, then this page won't exist!!
     */
    $scope.addBookmark = function(){
      TimeTable.addBookmark($scope.courseId, $scope.username);
      refreshCourseList();
    }

    // Expects
    // { teacherId:username,
    //   courseId:courseId }
    $scope.removeBookmark = function(args){
      TimeTable.removeBookmark(args);
      refreshCourseList();
    }

    // END: myclasses

    $scope.logout = function(){
      Location.open({page:"login", username:null, accessCode:'teacher'});
    }

    $scope.login = function(access){
      Location.open({page:"default_"+access, accessCode:access});
    }

    // For displaying active tab
    var isSamePage = function(page, location){
      return page === location.split('/')[1];
    }

    $scope.activeIfPage = function(page){
      var className = "";
      if(isSamePage(page, $location.path())){
        className = 'active';
      }
      return className;
    };


    // Should probably put this somewhere else like in a service
    var Mastersheet = function(marksheets){
      var self = {};

      self.table = {students:{}};

      self.getAverage = function(studentId, subjectKey){
        var courseId = CourseCatalog.getCourseId({
          formIndex : $routeParams.formIndex,
          groupIndex: $routeParams.groupIndex,
          subjectKey: subjectKey
        });
        var marksheet = marksheets[courseId];
        var average = marksheet.getAverage(studentId, $routeParams.termIndex);
        return average;
      };

      self.getAc = function(studentId, subjectKey){
        return self.getAverage(studentId, subjectKey) * $scope.subjects[subjectKey].coeff;
      };

      self.getTotalCoeff = function(){
        var coeff = 0;
        angular.forEach($scope.subjects, function(subject, subjectKey){
          coeff += subject.coeff;
        });
        return coeff;
      };

      self.getAcTotal = function(studentId){
        var totalAc = 0;
        angular.forEach(self.table.students[studentId], function(scores, subjectKey){
          totalAc += scores.ac;
        });
        return totalAc;
      };

      // Compute Everything, store it in the "table"
      angular.forEach($scope.students, function(student, studentIndex){
        self.table.students[student.id] = {};
        self.table.totalCoeff  = self.getTotalCoeff();
        angular.forEach(marksheets, function(marksheet, courseId){
          var subjectKey = CourseCatalog.getSubjectKey(courseId);
          self.table.students[student.id][subjectKey] = {
            average:self.getAverage(student.id, subjectKey),
            ac:self.getAc(student.id, subjectKey)
          };
        });
        self.table.students[student.id].acTotal = self.getAcTotal(student.id);
        self.table.students[student.id].acAverage = self.table.students[student.id].acTotal /
                                           self.table.totalCoeff;
      });

    // Rank and Cache
      var students = [];
      // 1. make a list from the table data
      angular.forEach(self.table.students, function(student, studentId){
        students.push({studentId:studentId, student:student});
      });
      // 2. sort the list by acAverage
      students.sort(function(s1, s2){
        return s2.student.acAverage - s1.student.acAverage;
      });
      // 3. store rankings in the student object 
      //    (this should mutate the same student object in the table)
      angular.forEach(students, function(d, dIndex){
        if(dIndex === 0){
          d.student.rank = 1;
        }else{
          if (d.student.acAverage === students[dIndex - 1].acAverage){
            d.student.rank = students[dIndex - 1].rank;
          }else{
            d.student.rank = dIndex + 1;
          }
        }
      });

      return self;
    }

    $scope.getMastersheet = function(m){
      var formIndex = $routeParams.formIndex;
      var groupIndex = $routeParams.groupIndex;
      if(m){
        formIndex = m.hasOwnProperty('formIndex') ? m.formIndex : formIndex;
        groupIndex = m.hasOwnProperty('groupIndex') ? m.groupIndex : groupIndex;
      }
      var courses = CourseCatalog.getCourses(formIndex, groupIndex);
      var courseIds = courses.map(function(course){return course.id});
      var marksheets = ClassMaster.getMarksheets(courseIds);
      var mastersheet = Mastersheet(marksheets);
      return mastersheet; 
    };


    // Course Catalog
    $scope.allSubjects = CourseCatalog.getAllSubjects();
    $scope.numSubjects = Object.keys($scope.allSubjects).length;
    $scope.catalogView = "student";
    $scope.setCatalogView = function(view){
      $scope.catalogView = view;
    };
    $scope.toggleSubject = function(subjectKey, formIndex){
      var current = $scope.forms[formIndex].subjects[subjectKey];
      $scope.forms[formIndex].subjects[subjectKey] = (current + 1) % 2;
    };
    $scope.isExempt = function(k, int){
      console.log(k, ":", int);
      return int === 0 ? true : false;
    };

    $scope.addSubject = function(){

    };

    $scope.getStudentsPassing = function(formIndex, advance){
      var stats = [];
      angular.forEach($scope.groups, function(group, groupIndex){
        var mastersheet = $scope.getMastersheet({formIndex:formIndex,
                                                groupIndex:groupIndex});
        console.log("Mastersheet for ", $scope.forms[formIndex].name, mastersheet);
      });
      return 0;
    };


    if($scope.page === "transcript"){
      window.print();
    }


    
    

  }
  MainCtrl.$inject = ['$scope', '$location', '$anchorScroll', '$routeParams', 'Cache', 'Data', 'Location', 'Path', 'CourseCatalog', 'TimeTable', 'Registrar', 'ClassMaster', 'Lang'];
  angular.module('SchoolMan').controller('_MainCtrl', MainCtrl);
