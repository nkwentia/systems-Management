'use strict';
define(['Forms', 'Salarys', 'Staffs', 'Payments', 'SchoolInfos', 'Lang'], function(Forms, Salarys, Staffs, Payments, SchoolInfos, Lang){
function StaffsfinanceCtrl($scope, $routeParams, Forms, Salarys, Staffs, Payments, SchoolInfos, Lang) {
  	
  	var forms = _.map(Forms.all(), function(form){
      form.staffs = [];
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

    Staffs.query().then(function(staffs){
      allStaffs = staffs;
    }).catch(function(error){
      console.log("Failed to get staffs", error);
    });


    Payments.getAll().then(function(paymentsByStudent){

      
      angular.forEach(allStudents, function(staff, key){
        var staffId = staff._id;

        if(paymentsByStudent[staffId]){
          staff.payments = paymentsByStudent[staffId].payments;
        }
        else{
          staff.payments = [];
        }
        
      });

      forms = _.reduce(allStudents, function(forms, staff){
        //console.log("in reduce function, forms", forms);
        //console.log("in reduce function, student", student);
        forms[staff.formIndex].staffs.push(staff);
        return forms;
      },forms)

      
    

      // each form should contain a fees object that contains
      // the total amount owed and total amount paid for each feeGroup
      forms = _.map(forms, function(form){

        //console.log("Form", form);

      	// instantiate the fees object
      	form.salarys = {};

      	// copy and instatiate each Fee object with owed and paid
      	angular.forEach(Salarys.getAll(), function(salary, salaryKey){
      		var salaryCopy = angular.copy(salary); //copy, otherwise the next form will clobber this fee object
          salaryCopy.Salary = 0;
          salaryCopy.socailinsuranceSalary = 0; 
      		salaryCopy.owed = 0;
      		salaryCopy.paid = 0;
      		salaryCopy.staffs = 0;
      		form.salarys[salaryKey] = salaryCopy;
      	});

      	// reduce students into fee totals
      	//console.log(form.name);
      	form.salarys = _.reduce(form.staffs, function(salarys, staff){
      		salarys[staff.salaryId].staffs += 1;
          salarys[staff.salaryId].Salary += Salarys.get(staff.salaryId).schoolAmount;
          salarys[staff.salaryId].socailinsuranceSalary += Salarys.get(staff.salaryId).socailinsuranceAmount
      		salarys[staff.salaryId].owed += Salarys.get(staff.salaryId).salaryAmount + Salarys.get(staff.SalaryId).socailinsuranceAmount;
      		salarys[staff.salaryId].paid = salarys[staff.salaryId].paid +
      			staff.payments.reduce(function(totalPaid, payment){
      				return totalPaid + payment.amount;
      		},0);
      		return salarys;
      	}, form.salarys);

      	return form;
      });

  		$scope.forms = forms;


salary
  		var summary = {salarys:{}};
    	// copy and instatiate each Fee object with owed and paid
    	angular.forEach(Salarys.getAll(), function(salary, salaryKey){
    		var salaryCopy = angular.copy(salary); //copy, otherwise the next form will clobber this fee object 
        salaryCopy.Salary = 0;
        salaryCopy.socailinsuranceSalary = 0; 
    		salaryCopy.owed = 0;
    		salaryCopy.staffs = 0;
    		salaryCopy.paid = 0;
    		summary.salarys[salaryKey] = salaryCopy;
    	});

  		$scope.summary = forms.reduce(function(s, form){
  			angular.forEach(form.salarys, function(salary, salaryKey){
  				summary.salarys[salaryKey].staffs = summary.salarys[salaryKey].staffs + salary.students; 
          summary.salarys[salaryKey].Salary = summary.salarys[salaryKey].Salary + salary.schoolFee;
          summary.salarys[salaryKey].socailinsuranceSalary = summary.salarys[salaryKey].ptaFee + salary.ptaFee; 
  				summary.salarys[salaryKey].owed = summary.salarys[salaryKey].owed + salary.owed; 
  				summary.salarys[salaryKey].paid = summary.salarys[salaryKey].paid + salary.paid; 
  			});	
  			return summary;
  		}, summary);
    });

		var reduce = function(salarys){
			var self = {};
			self.by = function(key){
				var t = 0;
				angular.forEach(salarys, function(salary, salaryKey){
					t += salary[key];
				});
				return t;
			};
			return self;
		};

		$scope.totalStudents = function(salarys){
			return reduce(salarys).by("staffs");
		};

    $scope.totalSalary = function(salarys){
      return reduce(salarys).by("Salary");
    };

    $scope.totalSocailinsuranceSalary = function(salarys){
      return reduce(salarys).by("socailinsuranceSalary");
    };

		$scope.totalOwed = function(salarys){
			return reduce(salarys).by("owed");
		};

		$scope.totalPaid = function(salarys){
			return reduce(salarys).by("paid");
		};
    
  }
StaffsfinanceCtrl.$inject = ['$scope', '$routeParams', 'Forms', 'Salarys', 'Staffs', 'Payments', 'SchoolInfos', 'Lang'];
angular.module('SchoolMan').register.controller('StaffsfinanceCtrl', StaffsfinanceCtrl);
})