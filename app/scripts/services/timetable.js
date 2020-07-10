'use strict';

/**
 * @ngdoc service
 * @name SchoolMan.service:TimeTable
 * @method {function} addCourse
 * @method {function} removeCourse
 * @method {function} getTeacher
 * @method {function} getCourseRefs
 * @description
 *
 * This service handles marksheets and all calculations
 */
function TimeTable() {

	// Private methods and attributes 
	// ------------------------------

  	var courses  = {};
  	var teachers = {};

  	// // Load local storage data into RAM
  	// Data.get("timetable", function(timetable){
   //    console.log("timetable", timetable);
  	// 	if(timetable.hasOwnProperty("courses")){
  	// 		courses = timetable.courses;
  	// 		teachers = timetable.teachers;
  	// 	}
  	// });

   //  // Private method for saving RAM data to chrome.storage.local
  	// var save = function(){
  	// 	Data.saveLater({"timetable":{
  	// 			courses:courses,
  	// 			teachers:teachers
  	// 		}});
  	// };


      /**
     * @ngdoc object
     * @name SchoolMan.object:Bookmark
     * @param {string} courseId the course ID
     * @param {string} teacherId the teacher ID
     * @returns {bookmark} returns an instance of bookmark
     * @property {string} courseId for example: 0-0-engl
     * @property {string} teacherId for example: eadlam
     * @description
     *
     * A Bookmark is an object that links a teacher with a course they are teaching
     */
      function Bookmark(courseId, teacherId){
        return {
          courseId:courseId,
          teacherId:teacherId
        }
      }


	// Public methods - returned via an object literal
	// -----------------------------------------------

  	return {

      /**
       * @ngdoc method
       * @methodOf SchoolMan.service:TimeTable
       * @name SchoolMan.service:TimeTable#addCourse
       * @param {object} bookmark an object that contains teacherId and courseId 
       * @description This adds a course bookmark for a teachers courselist
       */
  		addBookmark:function(courseId, username){

        var bookmark = Bookmark(courseId, username);

  			// Instantiate teacherId if necessary
  			if(!courses.hasOwnProperty(bookmark.teacherId)){
  				courses[bookmark.teacherId] = [];
  			}

  			// Instantiate courseId if necessary
  			if(!teachers.hasOwnProperty(bookmark.courseId)){
  				teachers[bookmark.courseId] = [];
  			}

        // Check if course already exists in teachers course-list
        var courseExists = courses[bookmark.teacherId].filter(function(courseRef){
          return courseRef.courseId === bookmark.courseId;
        }).length > 0;

        // If the course is not already in the list
        if(!courseExists){
          var timestamp = Date.now();

          // Create reference objects
          var courseRef = {courseId:bookmark.courseId, timestamp:timestamp};
          var teacherRef= {username:bookmark.teacherId,timestamp:timestamp};

    			// Save to RAM
    			courses[bookmark.teacherId].push(courseRef);
    			teachers[bookmark.courseId].push(teacherRef);

    			// Save RAM data to local storage
    			save();
        }
  		},


      /**
       * @ngdoc method
       * @methodOf SchoolMan.service:TimeTable
       * @name SchoolMan.service:TimeTable#removeCourse
       * @param {object} bookmark an object that contains teacherId and courseId 
       * @description This removes a course bookmark from a teachers courselist
       */
  		removeBookmark:function(d){

  			// Remove course from teachers course list
  			// save to RAM
  			courses[d.teacherId] = courses[d.teacherId].filter(function(courseRef){
            return courseRef.courseId !== d.courseId; 
  			});

  			// Dont remove teacher from courses teacher-list.
        // we would like to know who have been the past teachers for the course

  			// save RAM data to local storage
  			save();
  		},


      /**
       * @ngdoc method
       * @methodOf SchoolMan.service:TimeTable
       * @name SchoolMan.service:TimeTable#getTeacher
       * @param {string} courseId 
       * @returns {object} teacher
       * @description Returns the last teacher that has been listed for the course
       */
      getTeacher:function(courseId){
        var ts = teachers[courseId];
        var lastTeacher = undefined;
        if(ts){
          lastTeacher = ts[ts.length - 1];
        }else{
          lastTeacher = {username:"", timestamp:null}; 
        }
        return lastTeacher;
      },

       /**
       * @ngdoc method
       * @methodOf SchoolMan.service:TimeTable
       * @name SchoolMan.service:TimeTable#getCourseRefs
       * @param {string} teacherId 
       * @description This returns booksmarks for all the teachers courses
       *
       * ## TODO
       *  rename this method to getBookmarks
       */
  		getCourseRefs:function(teacherId){
        if(!courses.hasOwnProperty(teacherId)){
          courses[teacherId] = [];
        }
  			return courses[teacherId];
  		}
  	}
  }
// TimeTable.$inject = [];
angular.module('SchoolMan').service('TimeTable', TimeTable);