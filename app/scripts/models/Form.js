var schoolman = angular.module('SchoolMan');

schoolman.config(['modelProvider', function(model){
	function Form(spec){

    	// Protect global namespace if istantiated without 'new' keyword
      if (!(this instanceof Form)) {
        return new Form();
      }

      this.nameEn = spec.nameEn || "";
      this.nameFr = spec.nameFr || ""; 
      
    
    };

    model.Form = Form;
}]);
 