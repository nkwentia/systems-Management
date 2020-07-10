'use strict';
define(['settings'], function(settings){
	// function ModuleLoader(settings) {
		var self = {};
		// var modules = (settings.get()).modules;

		self.modules = function(){
			var modules = ['ReportCard', 'Finance', 'Staffing', 'Transcript', 'IDCard', 'Reports'];
			return modules;
		}

		return self;
	// }
	// ModuleLoader.$inject = ['settings'];
	// angular.module('SchoolMan').service('ModuleLoader', ModuleLoader);
})