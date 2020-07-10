'use strict';

angular.module('SchoolMan').directive('cell', ['$log', function ($log) {
    return {
    	restrict: 'A',
	    link: function($scope,elem,attrs) {
	      var rows = parseInt(attrs['cellNrow']);
	      elem.bind('keydown', function(e) {
	        var code = e.keyCode || e.which;
	        if (code === 13 || code === 40) {
	        	e.preventDefault();
	        	var nextTab = elem.context.tabIndex + 1;
	        	var selector = 'input[tabindex='+nextTab+']';
	        	$(selector).focus().select();
	        } else if (code === 38){
	        	e.preventDefault();
	        	var nextTab = elem.context.tabIndex - 1;
	        	var selector = 'input[tabindex='+nextTab+']';
	        	$(selector).focus().select();
	        } else if (code === 39){
	        	e.preventDefault();
	        	var nextTab = elem.context.tabIndex + rows;
	        	var selector = 'input[tabindex='+nextTab+']';
	        	$(selector).focus().select();
	        } else if (code === 37){
	        	e.preventDefault();
	        	var nextTab = elem.context.tabIndex - rows;
	        	var selector = 'input[tabindex='+nextTab+']';
	        	$(selector).focus().select();
	        }
	      });
	    }
    };
  }]);