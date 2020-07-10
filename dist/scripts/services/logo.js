'use strict';

function Logo($q, Data2) {

    var self = {};

    self.save = function(logo){
        var deferred = $q.defer();

        Data2.get("logo").then(function(oldLogo){
            oldLogo._attachments = logo._attachments;
           Data2.put(oldLogo).then(function(success){
            console.log("saved logo", success);
            deferred.resolve(success);
           }).catch(function(error){
            console.log("error: save logo", error);
            deferred.reject(error);
           });
        }).catch(function(error){
            console.log("Logo Error", error);
            if(error.status === 404){
                Data2.put(logo).then(function(success){
                    console.log("saved logo", success);
                    deferred.resolve(success);
                }).catch(function(error){
                    console.log("error: save logo", error);
                    deferred.reject(error);
                });
            }else{
                deferred.reject(error);
            }
        });
        return deferred.promise;
    };

        
        
    self.get = function() {
        var deferred = $q.defer();
        var img = document.createElement('img');
        Data2.getAttachment('logo', 'logo.png').then(function(success){
            var url = URL.createObjectURL(success);
            img.src = url;
            img.width = "100";
            deferred.resolve(img);
        }).catch(function(error){
            console.log("Error retreiving attachment", error);
            deferred.reject(error);
        })
        return deferred.promise;
    }

    self.getAttachment = function() {
        var deferred = $q.defer();
        Data2.getAttachment('logo', 'logo.png').then(function(success){
            deferred.resolve(success);
        }).catch(function(error){
            console.log("Error retreiving attachment", error);
            deferred.reject(error);
        })
        return deferred.promise;
    }

    return self;

  }
Logo.$inject = ['$q','Data2'];
angular.module('SchoolMan').service('Logo', Logo);