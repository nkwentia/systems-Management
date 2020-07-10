'use strict';

/**
 * @ngdoc service
 * @name SchoolMan.service:ClassMaster
 * @method {function} createMarksheet
 * @method {function} getMarksheet
 * @description
 *
 * This service handles marksheets and all calculations
 */
function ClassMaster($q) {

    // This is the container for public methods of the ClassMaster Service
    var self = {};
    
    self.printVariable = false;

    self.setPrint = function() {
      var deferred = $q.defer();
      self.printVariable = true;
      deferred.resolve(self.printVariable);
      return deferred.promise;
    }

    var debug_once = 0;

    var marksheets = {};





    /**
     * @ngdoc object
     * @name SchoolMan.object:Mark
     * @property {date} timestamp
     * @property {float} mark 
     * @description
     *
     * A mark contains a value and a timestamp
     */
    // function Mark(d){
    //   var self = d;
    //   if(!self.hasOwnProperty('timestamp')){
    //     self.timestamp = Date.now();
    //   }
    //   return self;
    // }


    // var registerListener = function(marksheet){
    //   var callback = function(msg){
    //       Data.saveLater({marksheets:marksheets});
    //   };
    //   // console.log("Registering Callback", callback);
    //   marksheet.onChange(callback);
    // }


  
    // self.addStudent = function(marksheet, studentId){
    //   var rowData = {
    //       columns:[],
    //       studentId:studentId
    //     }

    //     angular.forEach(Marksheet.sequences, function(sequence, sequenceIndex){
    //       var count = 0;
    //       while(count < sequence){
    //         var mark = new Mark();
    //         var cellData = {
    //           history: [mark],
    //           mark: mark.value
    //         }
    //         var cell = modelTransformer.transform(cellData, Cell);
    //         rowData.columns.push(cell);
    //         count += 1;
    //       }
    //     });

    //     var row = modelTransformer.transform(rowData, Row);
    //     marksheet.addRow(row); //This will auto-save
    // }

    // /**
    //  * @ngdoc method
    //  * @methodOf SchoolMan.service:ClassMaster
    //  * @name SchoolMan.service:ClassMaster#createMarksheet
    //  * @description This takes and registers a marksheet object
    //  */
    // self.createMarksheet = function(courseId, students) {

    //   var marksheetData = {
    //     table:{},
    //     courseId:courseId
    //   };
      
    //   angular.forEach(students, function(student, studentIndex){

    //     var rowData = {
    //       columns:[],
    //       studentId:student.id
    //     }

    //     angular.forEach(Marksheet.sequences, function(sequence, sequenceIndex){
    //       var count = 0;
    //       while(count < sequence){
    //         var mark = new Mark();
    //         var cellData = {
    //           history: [mark],
    //           mark: mark.value
    //         }
    //         var cell = modelTransformer.transform(cellData, Cell);
    //         rowData.columns.push(cell);
    //         count += 1;
    //       }
    //     });

    //     var row = modelTransformer.transform(rowData, Row);
    //     marksheetData.table[student.id] = row;

    //   });

    //   var marksheet = modelTransformer.transform(marksheetData, Marksheet);
    //   marksheets[courseId] = marksheet;

    //   registerListener(marksheet);

    //   // console.log("Created Marksheet", marksheet);

    //   return marksheet;
    // };

    // /**
    //  * @ngdoc method
    //  * @methodOf SchoolMan.service:ClassMaster
    //  * @param {string} courseId This method uses the courseId to fetch the Marksheet object
    //  * @return {object} Returns a Marksheet object
    //  * @name SchoolMan.service:ClassMaster#getMarksheet
    //  * @description This takes and registers a marksheet object
    //  */
    // self.getMarksheet = function(courseId){

    //   if(!(marksheets.hasOwnProperty(courseId))){
    //     var students = Registrar.getStudentsByCourseUnsorted(courseId);
    //     self.createMarksheet(courseId, students);
    //   }

    //   var marksheet = marksheets[courseId];

    //   return marksheet;      
    // };


    // /**
    //  * @ngdoc method
    //  * @methodOf SchoolMan.service:ClassMaster
    //  * @param {array} courseId This method uses an array of courseIds to fetch the Marksheet objects
    //  * @return {array} Returns an array of Marksheet objects
    //  * @name SchoolMan.service:ClassMaster#getMarksheets
    //  * @description This takes and registers a marksheet object
    //  */
    // self.getMarksheets = function(courseIds){
    //   var marksheets = {};
    //   angular.forEach(courseIds, function(courseId, courseIdIndex){
    //     marksheets[courseId] = self.getMarksheet(courseId);
    //   });
    //   return marksheets;
    // };


    /**
     * @ngdoc method
     * @methodOf SchoolMan.service:ClassMaster
     * @name SchoolMan.service:ClassMaster#getRemark
     * @param {float} average this can be an average or a single mark, but it assumes 20 is the highest and 0 the lowest
     * @return {object} Remark
     * @description 
     * This method takes a number and returns a remark depending on the value 
     */
    self.getRemark = function(average){
        if(average >= 0){
          if(average>17){
              return {text:"excellent", css:"remark-excellent"}
          }else if(average>15){
              return {text:"very_good", css:"remark-excellent"}
          }else if(average>13){
              return {text:"good", css:"remark-verygood"}
          }else if(average>11){
              return {text:"fair", css:"remark-good"}
          }else if(average>10){
              return {text:"average", css:"remark-fair"}
          }else if(average === "10" || average === 10){
              return {text:"average", css:"remark-average"}
          }else if(average>8){
              return {text:"below_average", css:"remark-poor"}
          }else if(average>5){
              return {text:"poor", css:"remark-poor"}
          }else{
              return {text:"very_poor", css:"remark-verypoor"}
          }
        } else {
            return {text:"", css:"remark-verypoor"};
        }
    }


    // // Load data from file
    // Data.get('marksheets', function(ms){
    //   angular.forEach(ms, function(marksheet, courseId){
    //     angular.forEach(marksheet.table, function(row, studentId){
    //       angular.forEach(row.columns, function(cell, cellIndex){
    //         angular.forEach(cell.history, function(mark, markIndex){
    //           cell.history[markIndex] = modelTransformer.transform(mark, Mark);
    //         });
    //         row.columns[cellIndex] = modelTransformer.transform(cell, Cell);
    //       });
    //       marksheet.table[studentId] = modelTransformer.transform(row, Row);
    //     });
    //     var marksheet = modelTransformer.transform(marksheet, Marksheet);
    //     ms[courseId] = marksheet;
    //     registerListener(marksheet);
    //   });
    //   marksheets = ms;
    // });

    return self;
}
ClassMaster.$inject = ['$q'];
angular.module('SchoolMan').service('ClassMaster', ClassMaster);