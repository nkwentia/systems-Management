'use strict';

angular.module('SchoolMan')

 /**
  * @ngdoc object
  * @name SchoolMan.object:Mastersheet
  * @property {int} Mastersheet this is actually just the value of the last Mastersheet in the history, it is not a Mastersheet object
  * @param {array} Mastersheets this takes as an argument a list of Mastersheet object literals e.g. as would be loaded from JSON
  * @method {function} getValidationStatus
  * @method {function} save
  * @method {function} onChange
  * @description
  *
  * A Mastersheet contains the history of Mastersheets. It can save a new Mastersheet, validate an
  * input and notify listeners onChange
  */
  .value('Mastersheet', (function(){

    // Constructor
    function Mastersheet(params){

      var self = this;

      // Prevents global namespace clobbering if you istantiate this object
      // without the 'new' keyword
      if (!(self instanceof Mastersheet)) {
        return new Mastersheet();
      }

      self.termIndex  = params.termIndex;
      self.subjects   = params.subjects;
      self.marksheets = params.marksheets;
      self.getSubjectKey= params.getSubjectKey;

      self.students = {};
      angular.forEach(self.marksheets, function(marksheet, marksheetIndex){
        angular.forEach(marksheet.table, function(row, studentId){
          self.students[studentId] = {id:studentId};
        });
      });

      self.table = {students:{}};

      angular.forEach(self.students, function(student, studentIndex){
        self.table.students[student.id] = {};
        self.table.totalCoeff  = self.getTotalCoeff();
        angular.forEach(self.marksheets, function(marksheet, courseId){
          var subjectKey = self.getSubjectKey(courseId);
          self.table.students[student.id][subjectKey] = {
            average:self.getStudentSubjectAverage(student.id, courseId),
            ac:self.getAc(student.id, subjectKey, courseId)
          };
        });

        var totals = self.getAcTotals(student.id);
        self.table.students[student.id].acTotal = totals.ac;
        self.table.students[student.id].acAverage = totals.average;
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
    };

    Mastersheet.prototype.getStudentSubjectAverage = function(studentId, courseId){
        var marksheet = this.marksheets[courseId];
        var average = marksheet.getAverage(studentId, this.termIndex);
        return average;
      };

      Mastersheet.prototype.getAc = function(studentId, subjectKey, courseId){
        var ac = this.getStudentSubjectAverage(studentId, courseId) * 
                 this.subjects[subjectKey].coeff;
        return ac || null;
      };

      Mastersheet.prototype.getTotalCoeff = function(){
        var self = this;
        var coeff = 0;
        angular.forEach(self.subjects, function(subject, subjectKey){
          if(subject){
            coeff += parseInt(subject.coeff);
          } else {
            console.log("No subject", self);
          }
        });
        return coeff;
      };

      Mastersheet.prototype.getAcTotals = function(studentId){

        var self = this;

        var totals = {
          ac:0,
          average:0,
          coeff:0
        };
        
        angular.forEach(self.table.students[studentId], function(scores, subjectKey){
          if(self.subjects.hasOwnProperty(subjectKey)){
            totals.ac += (scores.ac || 0);
            var coeff = parseInt(self.subjects[subjectKey].coeff);
            totals.coeff += scores.ac === null ? 0 : coeff;
          }
        });

        totals.average = totals.ac / totals.coeff;
        return totals;
      };

      Mastersheet.prototype.numstats = function(score){
        
        var self = this;

        var stats = {
          numStudents:Object.keys(this.table.students).length,
          numPresent:0,
          passing:0,
          failing:0,
          percentPassing:0,
          percentFailing:0,
          classAverage:0,
          classRange:0
        }

        var classTotal = 0;
        var maxStudent = 0;
        var minStudent = 20;
        var countPresent = 0;

        angular.forEach(self.table.students, function(student, studentId){
          if(self.getAcTotals(studentId).average >= score){
            stats.passing += 1;
          }
          if(!isNaN(student.acAverage)){
            classTotal=student.acAverage + classTotal;
            stats.numPresent += 1;
          }
          if(student.acAverage < minStudent){
            minStudent = student.acAverage;
          }
          if(student.acAverage > maxStudent){
            maxStudent = student.acAverage;
          }
        });
        
        stats.failing = stats.numStudents - stats.passing;
        stats.percentPassing = stats.passing / stats.numStudents;
        stats.percentFailing = 1 - stats.percentPassing;
        stats.classAverage = classTotal / stats.numStudents;
        stats.classRange = maxStudent - minStudent;
        if(stats.classRange < 0){
          stats.classRange = 0;
        }

        console.log("mastersheet numstats: ", stats);
        return stats;
      };

      Mastersheet.prototype.getStudentStatus = function(score){
        var self = this;

        var stats = {};

        angular.forEach(self.table.students, function(student, studentId){
          if(self.getAcTotals(studentId).average >= score){
            stats[studentId] = true;
          } else {
            stats[studentId] = false;
          }
        });

        return stats;
      }

    return Mastersheet;

  })());

