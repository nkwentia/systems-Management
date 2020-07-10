'use strict';

function Staffid($q, $log, Data2) {
    
    var N_DIGITS = 7;

    var self = {};

    var next = function(lastStaffid){
    	
        var nextStaffid = lastStaffid;
        var value = lastStaffid.value;
        console.log("nextStaffid=",nextStaffid)
        console.log("lastStaffid=",lastStaffid)
        console.log("value=",value)

    	var n = parseInt(value.substr(1)) + 1;
    	var s = n.toString();
        console.log("n=",n,"s=",s);

    	while(s.length < N_DIGITS){
    		s = "0" + s;
    	}

    	var u = "U" + s;
        console.log("u=",u,"s=",s)

    	if(u.length < 8){
    		$log.error("n", n);
    		$log.error("s", s);
    		$log.error("u", u);
    	}

        nextStaffid.value = u;
    	return nextStaffid;
    };

    self.save = function(lastStaffid){
        console.log("saving staffid", lastStaffid);
       Data2.put(lastStaffid).then(function(success){
        console.log("saved lastStaffid", success);
       }).catch(function(error){
        console.log("error: save lastStaffid", error);
       });
    };

    self.get = function(){
        var deferred = $q.defer();

        Data2.get("StaffID").then(function(staffid){
            deferred.resolve(next(staffid));
        }).catch(function(error){
            console.log("StaffID Error", error);
            if(error.status === 404){
                var staffid = {
                    _id:"StaffID",
                    value:"U0000000"}
                    console.log("staffid", staffid)
                deferred.resolve(next(staffid));
            };
        });

        return deferred.promise;
    }

    self.getBatch = function(n){
        var deferred = $q.defer();
        var staffids = [];
        self.get().then(function(staffid){
            staffids.push(angular.copy(staffid));
            angular.forEach(_.range(n-1), function(i, $index){
                staffid = next(staffid);
                staffids.push(angular.copy(staffid));
            });
            console.log("Created staffids", staffids);
            deferred.resolve(staffids);
        }).catch(function(error){
            console.log("Failed to get batch StaffIDs", error);
            deferred.reject(error);
        });

        return deferred.promise;
    }

    return self;

  }
Staffid.$inject = ['$q', '$log', 'Data2'];
angular.module('SchoolMan').service('Staffid', Staffid);