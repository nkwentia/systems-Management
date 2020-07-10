'use strict';

function DivFinanceCtrl($scope, DivFees, Schools, SchoolPayments) {
  	
  $scope.data = {
    schools: Schools.getAll(),
    divfees: DivFees.getAll(),
    payments: SchoolPayments.getAll(),
    divisionTotal: 0,
    regionTotal: 0,
    ministryTotal: 0
  }

  var reduce = function(collection){
    console.log("selection", collection);
    var self = {};
    self.by = function(key){
      var t = 0;
      angular.forEach(collection, function(item, itemKey){
        t += item[key];
      });
      console.log("selection", collection, t, key);
      return t;
    };
    return self;
  }

  var totalmales = reduce($scope.data.schools).by("numMale");
  var totalfemales = reduce($scope.data.schools).by("numFemale");
  var totalmalesCycle1 = reduce($scope.data.schools).by("numMaleCycle1");
  var totalmalesCycle2 = reduce($scope.data.schools).by("numMaleCycle2");
  var totalfemalesCycle1 = reduce($scope.data.schools).by("numFemaleCycle1");
  var totalfemalesCycle2 = reduce($scope.data.schools).by("numFemaleCycle2");
  console.log("school", $scope.data.schools, totalmalesCycle1);
  $scope.data.totalStudentsCycle1 = (totalmalesCycle1 +totalfemalesCycle1);
  $scope.data.totalStudentsCycle2 = (totalmalesCycle2+totalfemalesCycle2);
  $scope.data.feesAmountgeneralCycle1 = 0;
  $scope.data.feesAmountgeneralCycle2 = 0;
  $scope.data.feesAmounttechnicalCycle1 = 0;
  $scope.data.feesAmounttechnicalCycle2 = 0;


  $scope.data.totalStudentsgeneralCycle1 = 0;
  $scope.data.totalStudentstechnicalCycle1 = 0;
  $scope.data.totalStudentsgeneralCycle2 = 0;
  $scope.data.totalStudentstechnicalCycle2 = 0;

  angular.forEach ($scope.data.schools,function(school,id){
    if(school.version === "gen"){
      
      $scope.data.totalStudentsgeneralCycle1 += school.numMaleCycle1 + school.numFemaleCycle1
      $scope.data.totalStudentsgeneralCycle2 += school.numMaleCycle2 + school.numFemaleCycle2
    }

    else {
      $scope.data.totalStudentstechnicalCycle1 += school.numMaleCycle1 + school.numFemaleCycle1
      $scope.data.totalStudentstechnicalCycle2 += school.numMaleCycle2 + school.numFemaleCycle2
    }

  })

  console.log("students",$scope.data.totalStudentsgeneralCycle1,$scope.data.totalStudentstechnicalCycle2,$scope.data.totalStudentsgeneralCycle2,$scope.data.totalStudentstechnicalCycle2)

  angular.forEach ($scope.data.divfees,function(fee,key){
      if (fee.type ==="gen1" ){
          $scope.data.feesAmountgeneralCycle1 += fee.amount;}
      else if(fee.type ==="tech1"){
        $scope.data.feesAmounttechnicalCycle1 +=fee.amount ;
      }
      else if(fee.type=== "gen2"){
        $scope.data.feesAmountgeneralCycle2 +=fee.amount;
      }
      else if (fee.type === "tech2"){
        $scope.data.feesAmounttechnicalCycle2  +=fee.amount;      
      }
   
    })
  
  var divTotalFirstCyclegeneral = 0;
  var divTotalFirstCycletechnical = 0;
  var divTotalSecondCyclegeneral = 0;
  var divTotalSecondCycletechnical = 0; 
  var regTotalFirstCyclegeneral = 0;
  var regTotalFirstCycletechnical = 0;
  var regTotalSecondCyclegeneral = 0;
  var regTotalSecondCycletechnical = 0;
  var minTotalFirstCyclegeneral = 0;
  var minTotalFirstCycletechnical = 0;
  var minTotalSecondCyclegeneral = 0;
  var minTotalSecondCycletechnical = 0;


  angular.forEach($scope.data.divfees, function(fee, feeId){
    console.log("fee:", fee);
      if(fee.type === "gen1"){
         divTotalFirstCyclegeneral += fee.amount * fee.division;
         regTotalFirstCyclegeneral += fee.amount * fee.region;
         minTotalFirstCyclegeneral += fee.amount * fee.ministry;
      }else if (fee.type === "gen2"){
        
          divTotalSecondCyclegeneral += fee.amount * fee.division;
          regTotalSecondCyclegeneral +=fee.amount * fee.region;
          minTotalSecondCyclegeneral += fee.amount * fee.ministry;
      };
    if (fee.type === "tech1"){
      divTotalFirstCycletechnical += fee.amount * fee.division;
      regTotalFirstCycletechnical += fee.amount * fee.region;
      minTotalFirstCycletechnical += fee.amount * fee.ministry;
    }else if (fee.type === "tech2"){
      divTotalSecondCycletechnical += fee.amount * fee.division;
      regTotalSecondCycletechnical +=fee.amount * fee.region;
      minTotalSecondCycletechnical += fee.amount * fee.ministry;
    };

    
  });
  
  var totalpayments = 0;
  angular.forEach($scope.data.schools,function(school,schoolid){
    var sum = 0; 
    angular.forEach($scope.data.payments,function(payment,paymentid){
      if (payment.schoolId === school._id){
        sum = sum + payment.amount;


      }
    })
    totalpayments = totalpayments + sum;
    school.totalPaid = sum;
  })
  console.log("totals:",divTotalFirstCyclegeneral, regTotalFirstCyclegeneral, divTotalFirstCycletechnical, regTotalFirstCycletechnical, divTotalSecondCyclegeneral, regTotalSecondCyclegeneral, divTotalSecondCycletechnical, regTotalSecondCycletechnical)
  $scope.data.totalPayment = totalpayments;
  $scope.data.divSumgeneralCylce1 = (divTotalFirstCyclegeneral/100)+ (regTotalFirstCyclegeneral/100);
  $scope.data.divSumtechnicalCycle1 = (divTotalFirstCycletechnical/100)+ (regTotalFirstCycletechnical/100);
  $scope.data.divSumgeneralCylce2 = (divTotalSecondCyclegeneral/100)+ (regTotalSecondCyclegeneral/100);
  $scope.data.divSumtechnicalCycle2 = (divTotalSecondCycletechnical/100)+ (regTotalSecondCycletechnical/100);
  
   console.log("div sum", $scope.data.divSumgeneralCylce1, $scope.data.divSumgeneralCylce2)
  // $scope.data.divisionTotal = $scope.data.totalStudents * divTotal / 100;
  // $scope.data.regionTotal = $scope.data.totalStudents * regTotal / 100;
  // $scope.data.ministryTotal = $scope.data.totalStudents * minTotal / 100;
  
}
DivFinanceCtrl.$inject = ['$scope','DivFees', 'Schools','SchoolPayments'];
angular.module('SchoolMan').controller('DivFinanceCtrl', DivFinanceCtrl);
