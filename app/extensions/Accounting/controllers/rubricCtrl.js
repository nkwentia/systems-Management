'use strict';

function RubricCtrl($scope, $routeParams, model, Location, Rubrics, Items, Lang) {
    $scope.dict = Lang.getDict();
    $scope.validationError = false;

    var data = $scope.data = {
        rubrics: {},
        items: [],
        total: 0
    };

    Rubrics.getAll().then(function(success){
        $scope.data.rubrics = success;    
        // console.log("Rubrics", $scope.data.rubrics);
        angular.forEach($scope.data.rubrics, function(rubric, index){
            rubric.amount = 0;
            rubric.items = [];
        })

        Items.getAll().then(function(items){
            $scope.data.items = items;

            angular.forEach($scope.data.items, function(item, index){
                $scope.data.rubrics[item.rubric].items.push(item);
                $scope.data.rubrics[item.rubric].amount += item.income - item.expenditure;
                $scope.data.total += item.income - item.expenditure;
            })
        })
    })

    $scope.newRubric = new model.Rubric();
    console.log("NewRubric", $scope.newRubric);

    

    $scope.add = function(rubric){
        rubric.save().then(function(success){
            $scope.validationError = false;
            rubric.amount = 0;
            rubric.items = [];
            $scope.data.rubrics[rubric._id] = rubric;
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
          delete $scope.data.rubrics[rubric._id];
        });
    }
}
RubricCtrl.$inject = ['$scope', '$routeParams', 'model', 'Location', 'Rubrics', 'Items', 'Lang'];
angular.module('SchoolMan.Accounting').controller('RubricCtrl', RubricCtrl);


