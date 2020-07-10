'use strict';

function BalanceSheetCtrl($scope, $routeParams, Forms, Fees, Students, Payments, SchoolInfos, Lang) {
	
	var forms = _.map(Forms.all(), function(form){
    form.students = [];
		return form;
	});

  $scope.dict = Lang.getDict();
  $scope.lang = $routeParams.lang ? $routeParams.lang : Lang.defaultLang;

  SchoolInfos.get("schoolinfo").then(function(info){
    $scope.schoolInfo = info;
  }).catch(function(error){
    console.log("failed to get school info");
  });
 //  var classes = Registrar.getClasses()

 // $scope.data = {};
 // $scope.data.payments = {};

 var stringToNumber = function(amount){
    amount = Number(amount.replace(/[^0-9\.]+/g,""));
    return amount;
  };

  var allStudents = [];

    //var deferred = $q.defer();

  Students.query().then(function(students){
    allStudents = students;
  }).catch(function(error){
    console.log("Failed to get students", error);
  });


  Payments.getAll().then(function(paymentsByStudent){

    
    angular.forEach(allStudents, function(student, key){
      var studentId = student._id;

      if(paymentsByStudent[studentId]){
        student.payments = paymentsByStudent[studentId].payments;
      }
      else{
        student.payments = [];
      }
      
    });

    forms = _.reduce(allStudents, function(forms, student){
      //console.log("in reduce function, forms", forms);
      //console.log("in reduce function, student", student);
      forms[student.formIndex].students.push(student);
      return forms;
    },forms)

    
  

    // each form should contain a fees object that contains
    // the total amount owed and total amount paid for each feeGroup
    forms = _.map(forms, function(form){

      //console.log("Form", form);

    	// instantiate the fees object
    	form.fees = {};

    	// copy and instatiate each Fee object with owed and paid
    	angular.forEach(Fees.getAll(), function(fee, feeKey){
    		var feeCopy = angular.copy(fee); //copy, otherwise the next form will clobber this fee object
        feeCopy.schoolFee = 0;
        feeCopy.ptaFee = 0; 
    		feeCopy.owed = 0;
    		feeCopy.paid = 0;
    		feeCopy.students = 0;
    		form.fees[feeKey] = feeCopy;
    	});

    	// reduce students into fee totals
    	//console.log(form.name);
    	form.fees = _.reduce(form.students, function(fees, student){
    		fees[student.feeId].students += 1;
        fees[student.feeId].schoolFee += Fees.get(student.feeId).schoolAmount;
        fees[student.feeId].ptaFee += Fees.get(student.feeId).ptaAmount
    		fees[student.feeId].owed += Fees.get(student.feeId).schoolAmount + Fees.get(student.feeId).ptaAmount;
    		fees[student.feeId].paid = fees[student.feeId].paid +
    			student.payments.reduce(function(totalPaid, payment){
    				return totalPaid + payment.amount;
    		},0);
    		return fees;
    	}, form.fees);

    	return form;
    });

		$scope.forms = forms;



		var summary = {fees:{}};
  	// copy and instatiate each Fee object with owed and paid
  	angular.forEach(Fees.getAll(), function(fee, feeKey){
  		var feeCopy = angular.copy(fee); //copy, otherwise the next form will clobber this fee object 
      feeCopy.schoolFee = 0;
      feeCopy.ptaFee = 0; 
  		feeCopy.owed = 0;
  		feeCopy.students = 0;
  		feeCopy.paid = 0;
  		summary.fees[feeKey] = feeCopy;
  	});

		$scope.summary = forms.reduce(function(s, form){
			angular.forEach(form.fees, function(fee, feeKey){
				summary.fees[feeKey].students = summary.fees[feeKey].students + fee.students; 
        summary.fees[feeKey].schoolFee = summary.fees[feeKey].schoolFee + fee.schoolFee;
        summary.fees[feeKey].ptaFee = summary.fees[feeKey].ptaFee + fee.ptaFee; 
				summary.fees[feeKey].owed = summary.fees[feeKey].owed + fee.owed; 
				summary.fees[feeKey].paid = summary.fees[feeKey].paid + fee.paid; 
			});	
			return summary;
		}, summary);
  });

	var reduce = function(fees){
		var self = {};
		self.by = function(key){
			var t = 0;
			angular.forEach(fees, function(fee, feeKey){
				t += fee[key];
			});
			return t;
		};
		return self;
	};

	$scope.totalStudents = function(fees){
		return reduce(fees).by("students");
	};

  $scope.totalSchoolFee = function(fees){
    return reduce(fees).by("schoolFee");
  };

  $scope.totalPTAFee = function(fees){
    return reduce(fees).by("ptaFee");
  };

	$scope.totalOwed = function(fees){
		return reduce(fees).by("owed");
	};

	$scope.totalPaid = function(fees){
		return reduce(fees).by("paid");
	};
  
}
BalanceSheetCtrl.$inject = ['$scope', '$routeParams', 'Forms', 'Fees', 'Students', 'Payments', 'SchoolInfos', 'Lang'];
angular.module('SchoolMan.Finance').controller('BalanceSheetCtrl', BalanceSheetCtrl);