'use strict';

/**
 * @ngdoc service
 * @name SchoolMan.service:Registrar
 * @method addStudent
 * @method getStudent
 * @method getStudentByCourseUnsorted
 * @method getStudentByCourse
 * @description
 *
 * This service stores all student data and links students with classes and courses
 */
 define(['modelTransformer','Staffing/services/staffid'], function(modelTransformer, Staffid){
function Staffregistrar(Data2, $q, $log, model, modelTransformer, Staffid) {
    
    // var _students = [];
    var staffs = {};
    var courses = {};
    var classes = {};

    // This all happens in RAM. I think it's fast No need to serialize
    var registerStaff = function(staffId, courseId){

    	// if this is the first student, instantiate the course's student list
    	if(!courses.hasOwnProperty(courseId)){
			courses[courseId] = [];
		}

        // add the student to the course's student list
        if(courses[courseId].lastIndexOf(staffId) < 0){
            courses[courseId].push(staffId);
        }

		// add the course to the students course list
        if(staffs[staffId].courses.lastIndexOf(courseId) < 0){
           staffs[staffId].courses.push(courseId); 
        }
    		
    }

    self = {};

    self.getClasses = function(){
        return classes;
    }

    /**
     * @ngdoc method
     * @name Schoolman.service:Registrar#getAverage
     * @methodOf SchoolMan.service:Registrar
     * @param {object} student see student object
     * @param {int} formIndex the index of the form
     * @param {int} groupIndex the index of the group
     * @description
     *
     * This method adds a student to all courses in their class
     */
    self.addStaff= function(staff, Staffid){

            staff = modelTransformer.transform(staff, model.Staff);

            staff.onChange(function(msg){
                console.log("Staff changed : ", msg, staff);
                self.save();
            });

            // var form = staff.form;
            var group= staff.group;

    		// Register the student
    		staffs[staff.id] = staff;
            // _students.push(student);

    		// Register the student in their class
			// var classId = form + "-" + group;
			// if(!classes.hasOwnProperty(classId)){
			// 	classes[classId] = [];
			// }
			// classes[classId].push(staff.id);

			// // Register the student in all the class courses
   //  		angular.forEach(CourseCatalog.getCourses(form, group), function(course, courseIndex){
			// 	registerStaff(staff.id, course.id);
			// });
            
    };

    self.save = function(callback){
        console.log("Staffregistrar: saving staffs");
        Data.saveLater({staffs:staffs}, callback);
    };


    /**
     * @ngdoc method
     * @name Schoolman.service:Registrar#getAverage
     * @methodOf SchoolMan.service:Registrar
     * @param {string} studentId 
     * @returns {object} student
     * @description
     *
     * This method looks up a student object by the studentId and returns the student
     */
    // self.getStudent = function(studentId){
    //     var deferred = $q.defer();
    //     Data2.get(studentId).then(function(data){
    //         var datatype = data.datatype;
    //         Data2.get(datatype).then(function(datatype){
    //             var studentData = model.parse(data, datatype);
    //             var student = modelTransformer.transform(studentData, model.Student);
    //             deferred.resolve(student);
    //         }).catch(function(error){
    //             console.log("Could not find datatype", error);
    //         });
    //     }).catch(function(error){
    //         deferred.reject(error);
    //     });
    //     return deferred.promise;
    // };


    /**
     * @ngdoc method
     * @name Schoolman.service:Registrar#getStudentsByCourseUnsorted
     * @methodOf SchoolMan.service:Registrar
     * @param {string} courseId 
     * @returns {array} students
     * @description
     *
     * This returns an unsorted list of students by courseId
     */
    self.getStaffsByCourseUnsorted = function(courseId){


            var courseList = courses[courseId];

            //console.log("CourseId", courseId, courseList);

            var staffList = courseList.map(function(staffId){
                return staffs[staffId];
            });
            return staffList;
    };


    /**
     * @ngdoc method
     * @name Schoolman.service:Registrar#getStudentsByCourse
     * @methodOf SchoolMan.service:Registrar
     * @param {string} courseId 
     * @returns {array} students
     * @description
     *
     * This returns a list of students sorted by name
     */
    self.getStaffsByCourse = function(courseId){
        var staffList = self.getStaffsByCourseUnsorted(courseId);
        staffList.sort(function(s1, s2){
            return s1.name.localeCompare(s2.name);
        });
        angular.forEach(staffList, function(staff, staffIndex){
            staff.roll = staffIndex + 1;
        });
        return staffList;
    };

    self.getAllStaffs = function(){
        return Object.keys(staffs).map(function(staffId){
            return staffs[staffId];
        });
    };

    // Load students from Data
    Data.get("staffs", function(staffs){
        var staffsCopy = angular.copy(staffs);
        angular.forEach(staffsCopy, function(staff, staffIndex){
            self.addStaff(staff);
        });
    });

    return self;

  }
Staffregistrar.$inject = ['Data2', '$q', '$log', 'model', 'modelTransformer', 'Staffid'];
angular.module('SchoolMan').register.service('Staffregistrar', Staffregistrar);
})