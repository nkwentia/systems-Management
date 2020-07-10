'use strict';

function IncomexpendCtrl($scope, $routeParams, model, Location, Items,  Lang, Rubrics, Payments, Students, SchoolInfos) {
    $scope.dict = Lang.getDict();
    $scope.balance = 0;
    $scope.lang = $routeParams.lang ? $routeParams.lang : Lang.defaultLang;
    
    SchoolInfos.get("schoolinfo").then(function(info){
        $scope.data.schoolInfo = info;
    }).catch(function(error){
        console.log("failed to get school info", error);
    });

    var data = $scope.data = {
        items: [],
        rubrics: {},
        allStudents: []
    };
    Students.query().then(function(students){
        $scope.data.allStudents = students;

        Rubrics.getAll().then(function(rubrics){
            $scope.data.rubrics = rubrics;
            angular.forEach($scope.data.rubrics, function(rubric, index){
                rubric.schoolTotal = rubric.amount * data.allStudents.length * (100 - rubric.divPercent - rubric.regPercent - rubric.minPercent) / 100;
                $scope.balance += rubric.schoolTotal;
                rubric.balance = $scope.balance;
            })
        
            Items.getAll().then(function(success){
                $scope.data.items = success;    
                angular.forEach($scope.data.items, function(item, itemId){
                    $scope.balance += item.income - item.expenditure;
                    item.balance = $scope.balance;
                })
            })
        
        })
    }).catch(function(error){
        console.log("Failed to get students", error);
    });




    // Payments.getAll().then(function(payments){
    //     var total = 0;

    //     angular.forEach(payments, function(payment, paymentId){
    //         total += payment.amount;
    //     })

    //     $scope.data.totalPayments = total;
    // })

    $scope.newItem = new model.Item();
    $scope.newItem.registrar = $routeParams.username;
    console.log("NewItem", $scope.newItem);

    

    $scope.add = function(item){
        typeof item.income === "string" ? item.income = Number(item.income.replace(/[^0-9\.]+/g,"")) : "";
        typeof item.expenditure === "string" ? item.expenditure = Number(item.expenditure.replace(/[^0-9\.]+/g,"")) : "";
        item.save().then(function(success){
            $scope.balance += item.income - item.expenditure;
            item.balance = $scope.balance;
            $scope.data.items.push(item);
            $scope.newItem = new model.Item();
            $scope.newItem.registrar = $routeParams.username;
        }).catch(function(error){
            console.log("Failed to save item: ", error);
        })
    }


}
IncomexpendCtrl.$inject = ['$scope', '$routeParams', 'model', 'Location', 'Items', 'Lang', 'Rubrics', 'Payments', 'Students', 'SchoolInfos'];
angular.module('SchoolMan.Accounting').controller('IncomexpendCtrl', IncomexpendCtrl);