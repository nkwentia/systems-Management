'use strict';

function RegistrarProfileCtrl($scope, $routeParams, $q, model, profile, Users, Students, Fees, Forms, Payments, Groups, Departments, Lang) {
  $scope.accessCode = $routeParams.accessCode;

	$scope.newPayment = new model.Payment();
	$scope.newPayment.registrar = $routeParams.username;
  $scope.newPayment.studentId = $routeParams.studentId;
  $scope.multiplier = 1; // -1 implies that this payment is a correction

  $scope.Users = Users;
  $scope.username = $routeParams.username;
  $scope.dict = Lang.getDict();
  $scope.lang = $routeParams.lang ? $routeParams.lang : Lang.defaultLang;


  var studentId = $routeParams.studentId === "0" ? "student_U0000001" : $routeParams.studentId;
  console.log("routeParams", $routeParams);

  var data = $scope.data = {
    // comments:{},
    // student:undefined,
    // dcard:undefined,
    // forms:Forms.all(),
    // departments:Departments.getAll(),
    // groups:Groups.getAll(),
    fees:Fees.getAll(),
    payments:[]
  };

  Students.get(studentId).then(function(student){
    console.log("Found student:", student);
    $scope.data.student = student;

  }).catch(function(error){
    console.log("profileCtrl Error: ",error);
  })
  
  Payments.query({studentId:studentId}).then(function(payments){
    $scope.data.payments = payments;
    console.log("Student payments", payments);
  }).catch(function(error){
    console.log("payment error: ", error);
  });

  $scope.addPayment = function(payment, multiplier){
  	// Reformat the input from string to number
    payment.amount = payment.getAmount() * multiplier;

    payment.save().then(function(success){
      $scope.data.payments.push(payment);
      $scope.newPayment = new model.Payment();
      $scope.newPayment.registrar = $routeParams.username;
      $scope.newPayment.studentId = $routeParams.studentId;

      // This is a crappy hack to compensate for the fact that pouchdb seems
      // to be too slow to calculate this on the fly for a list of students
      $scope.data.student.totalPaid += payment.amount;
      $scope.data.student.save();

    }).catch(function(error){
      console.log("Payment save error ", error);
    });
  };

  $scope.stringToNumber = function(amount){
    amount = Number(amount.replace(/[^0-9\.]+/g,""));
    return amount;
  };

  $scope.getTotalPayments = function(){
    var total = 0;
    total = $scope.data.payments.reduce(function(total, payment){
      if(typeof payment.amount === "string"){
       payment.amount = $scope.stringToNumber(payment.amount);
      }
      return payment.amount + total;
    }, 0);
    return total;
  };

  $scope.getOwed = function(){
    return data.fees[data.student.feeId].schoolAmount + data.fees[data.student.feeId].ptaAmount;
  }

}
RegistrarProfileCtrl.$inject = ['$scope', '$routeParams', '$q', 'model', 'profile', 'Users', 'Students', 'Fees', 'Forms', 'Payments', 'Groups', 'Departments', 'Lang'];
angular.module('SchoolMan.Finance').controller('RegistrarProfileCtrl', RegistrarProfileCtrl);