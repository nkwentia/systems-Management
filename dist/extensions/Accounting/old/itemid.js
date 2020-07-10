'use strict';

function Itemid($q, $log, Data2) {
    
    var N_DIGITS = 7;

    var self = {};

    var next = function(lastItemid){
    	
        var nextItemid = lastItemid;
        var value = lastItemid.value;

    	var n = parseInt(value.substr(1)) + 1;
    	var s = n.toString();

    	while(s.length < N_DIGITS){
    		s = "0" + s;
    	}

    	var item = "I" + s;

    	if(item.length < 8){
    		$log.error("n", n);
    		$log.error("s", s);
    		$log.error("u", u);
    	}

        nextItemid.value = item;
    	return nextItemid;
    };

    self.save = function(lastItemid){
        console.log("saving itemid", lastItemid);
       Data2.put(lastItemid).then(function(success){
        console.log("saved lastItemid", success);
       }).catch(function(error){
        console.log("error: save lastItemid", error);
       });
    };

    self.get = function(){
        var deferred = $q.defer();

        Data2.get("ItemID").then(function(itemid){
            deferred.resolve(next(itemid));
        }).catch(function(error){
            console.log("ItemID Error", error);
            if(error.status === 404){
                var itemid = {
                    _id:"ItemID",
                    value:"I0000000"}
                deferred.resolve(next(itemid));
            };
        });

        return deferred.promise;
    }

    self.getBatch = function(n){
        var deferred = $q.defer();
        var itemids = [];
        self.get().then(function(itemid){
            itemids.push(angular.copy(itemid));
            angular.forEach(_.range(n-1), function(i, $index){
                itemid = next(itemid);
                itemids.push(angular.copy(itemid));
            });
            console.log("Created itemids", itemids);
            deferred.resolve(itemids);
        }).catch(function(error){
            console.log("Failed to get batch ItemIDs", error);
            deferred.reject(error);
        });

        return deferred.promise;
    }

    return self;

  }
Itemid.$inject = ['$q', '$log', 'Data2'];
angular.module('SchoolMan.Accounting').service('Itemid', Itemid);