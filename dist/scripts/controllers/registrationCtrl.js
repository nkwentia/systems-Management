'use strict';

function RegistrationCtrl($scope, $routeParams, model, Uid, Forms, Departments, Groups, Location, Students, Marksheets, Fees, Lang) {

    $scope.formIndex = $routeParams.formIndex;
    $scope.showValidation = false;
    $scope.dict = Lang.getDict();
    $scope.lang = $routeParams.lang ? $routeParams.lang : Lang.defaultLang;

    var data = $scope.data = {
    	forms:Forms.all(),
    	departments:Departments.getAll(),
    	groups:Groups.getAll(),
        fees:Fees.getAll(),
        uid:null
    };
    angular.forEach()

    $scope.newStudent = new model.Student();
    console.log("NewStudent", $scope.newStudent);
    Uid.get().then(function(uid){
        data.uid = uid;
        console.log("Got Uid", uid);
        $scope.newStudent.id = uid.value;
    })

    //update the marksheets once a student has been created -- otherwise mastersheet might
    //display incorrect totals
    var updateMarksheets = function(student){
        var params = {
            formIndex: student.formIndex,
            deptId: student.deptId,
            groupId: student.groupId
        }
        Marksheets.query(params).then(function(marksheets){
            angular.forEach(marksheets, function(marksheet, marksheetId){
                marksheet.table[student._id] = ["","","","","",""];
                marksheet.save().then(function(success){
                }).catch(function(error){
                    console.log("Error saving marksheet with new student", error);
                })
            })
        }).catch(function(error){
            console.log("Failed to retreive marksheets", error);
        })
    }

    $scope.add = function(student){
        student.save().then(function(success){
            Uid.save(data.uid);
            console.log("Save student: ", success);
            Location.open({page:"profile", studentId:student._id});
            $scope.showValidation = false;
            Students.set(student);
            updateMarksheets(student);
        }).catch(function(error){
            $scope.showValidation = true;
            console.log("Failed to save student: ", error);
        })
    }



    $scope.clearForm = function(student){
        student.formIndex = null;
        student.deptId = null;
        student.groupId = null;
        student.feeId = null;
        student.name = "";
        student.birth = null;
        student.sex = "";
        student.parentName = "";
        student.parentPhone = "";
        student.parentEmail = "";
    }






}
RegistrationCtrl.$inject = ['$scope', '$routeParams', 'model', 'Uid', 'Forms', 'Departments', 'Groups', 'Location', 'Students', 'Marksheets', 'Fees', 'Lang'];
angular.module('SchoolMan').controller('RegistrationCtrl', RegistrationCtrl);