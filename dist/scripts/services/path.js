'use strict';

/**
 * @ngdoc service
 * @name SchoolMan.service:Path
 * @method {function} get
 * @description
 *
 * This service helps you create a path that conforms to what the routePovider expects
 */
function Path() {

  var defaults = {
    default_admin:"users",
    default_sales:"customersettings",
    default_classmaster:"classmasterMarksheet",
    default_teacher:"myclasses",
    default_registrar:"registration"
  }

  var self = {};

    /**
     * @ngdoc method
     * @methodOf SchoolMan.service:Path
     * @name SchoolMan.service:Path#get
     * @param {object} params containing formIndex groupIndex termIndex subjectKey studentId username etc
     *
     * @description 
     *
     * This method takes a params object and returns a valid path that you can
     * pass to $location.path()
     */
  self.get = function(d){
  		if(d.page === "login" || d.page === "login404"){
  			d.username = d.username ? d.username : null;
        var path = d.page       + '/' +
                   d.lang       + '/' +
                   d.username   + '/' +
                   d.accessCode
        return path;

  		}else if(d.page === "register"){
  			return '/register/' + d.username
  		}else if(defaults.hasOwnProperty(d.page)){
        d.page = defaults[d.page];
        return self.get(d);
      } else {

        // Any params not explicitly passed are provided via the $routParams
        // thus all of these variables should be present one way or another
        var path =  d.page       + '/' + 
                    d.subpage    + '/' + 
                    d.lang       + '/' +
                    d.formIndex  + '/' + 
                    d.deptId    + '/' + 
                    d.groupId   + '/' + 
                    d.subjectId + '/' +
                    d.termIndex  + '/' +
                    d.studentId  + '/' + 
                    d.username   + '/' +
                    d.accessCode +'/'  +
                    d.staffId

          return path;
        }
    	}
    
    return self;
  }
angular.module('SchoolMan').service('Path', Path);
