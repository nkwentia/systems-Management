'use strict';

function RubricCtrl($scope, $routeParams, model, Location, Rubrics, Items, Lang, Fees, Payments, Students, SchoolInfos) {
    $scope.dict = Lang.getDict();
    $scope.validationError = false;
    $scope.lang = $routeParams.lang ? $routeParams.lang : Lang.defaultLang;

    SchoolInfos.get("schoolinfo").then(function(info){
        $scope.data.schoolInfo = info;
    }).catch(function(error){
        console.log("failed to get school info", error);
    });

    var data = $scope.data = {
        rubrics: {},
        allStudents: [],
        rubricTotal: 0,
        schoolTotal: 0,
        divTotal: 0,
        regTotal: 0,
        minTotal: 0
    };

    Rubrics.getAll().then(function(success){
        $scope.data.rubrics = success;    
        console.log("Rubrics", $scope.data.rubrics);
        
        angular.forEach($scope.data.rubrics, function(rubric, key){
            $scope.data.rubricTotal += rubric.amount;
            $scope.data.schoolTotal += rubric.amount * (100 - rubric.divPercent - rubric.regPercent - rubric.minPercent) / 100;
            $scope.data.divTotal += rubric.amount * rubric.divPercent / 100;
            $scope.data.regTotal += rubric.amount * rubric.regPercent / 100;
            $scope.data.minTotal += rubric.amount * rubric.minPercent / 100;
        })

    })

    Students.query().then(function(students){
        $scope.data.allStudents = students;
    }).catch(function(error){
        console.log("Failed to get students", error);
    });


    $scope.newRubric = new model.Rubric();
    console.log("NewRubric", $scope.newRubric);

    

    $scope.add = function(rubric){
        typeof rubric.amount === "string" ? rubric.amount = Number(rubric.amount.replace(/[^0-9\.]+/g,"")) : "";
        rubric.save().then(function(success){
            $scope.validationError = false;
            $scope.data.rubrics[rubric._id] = rubric;
            $scope.data.rubricTotal += rubric.amount;
            $scope.data.schoolTotal += rubric.amount * (100 - rubric.divPercent - rubric.regPercent - rubric.minPercent) / 100;
            $scope.data.divTotal += rubric.amount * rubric.divPercent / 100;
            $scope.data.regTotal += rubric.amount * rubric.regPercent / 100;
            $scope.data.minTotal += rubric.amount * rubric.minPercent / 100;
            $scope.newRubric = new model.Rubric();
        }).catch(function(error){
            //handle duplicate descriptions
            if(error.name === "conflict"){
                $scope.validationError = true;
                $scope.newRubric = new model.Rubric();
                $scope.newRubric.description = rubric.description;
            }
            console.log("Failed to save rubric: ", error);
        })
    }

    $scope.remove = function(rubric){
        Rubrics.remove(rubric).then(function(success){
            $scope.data.rubricTotal -= rubric.amount;
            $scope.data.schoolTotal -= rubric.amount * (100 - rubric.divPercent - rubric.regPercent - rubric.minPercent) / 100;
            $scope.data.divTotal -= rubric.amount * rubric.divPercent / 100;
            $scope.data.regTotal -= rubric.amount * rubric.regPercent / 100;
            $scope.data.minTotal -= rubric.amount * rubric.minPercent / 100;
          delete $scope.data.rubrics[rubric._id];
        });
    }
}
RubricCtrl.$inject = ['$scope', '$routeParams', 'model', 'Location', 'Rubrics', 'Items', 'Lang', 'Fees', 'Payments', 'Students', 'SchoolInfos'];
angular.module('SchoolMan.Accounting').controller('RubricCtrl', RubricCtrl);


