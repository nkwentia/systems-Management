'use strict';

/**
 * @ngdoc service
 * @name SchoolMan.service:Login
 * @description
 *
 * This service can create a new user, and login an existing user
 */
function Login() {
    
    var cacheduser = null;

    var getusers = function(callback){
        chrome.storage.local.get("users", function(obj){            
            var users = {};
            if(obj.hasownproperty("users")){
                users = obj.users
            }
            callback(users);
        });
    }

    function user(userdata){
        var self = angular.copy(userdata);
        if(!self.hasownproperty('courses')){
                self.courses = [];
            }
        self.addcourse = function(course){
            var othercourses = self.courses.filter(function(a){
                console.log("login service: filtering - courses", a)
                console.log("login service: filtering - newcourse", course)
                return a.course === course.course;
            });

            var coursealreadyadded = othercourses.length > 0;

            console.log("login service: course ", course);
            console.log("login service: other courses ", othercourses);
            console.log("login service: coursealreadyadded - ", coursealreadyadded);
            console.log("login service: self before add ", self);

            if(!coursealreadyadded){
                self.courses.push(course);
                cacheduser = self;
                getusers(function(users){
                    users[self.username] = self;
                    chrome.storage.local.set({"users":users});
                    console.log("login service: users after add", users);
                })
                
            }

        }

        self.removecourse = function(coursecode){
            console.log("remove course", coursecode);
            console.log("my courses", self.courses);
            self.courses = self.courses.filter(function(course){
                console.log("course.code", course.code)
                console.log("coursecode", coursecode)
                return (course.course !== coursecode);
            });
            cacheduser = self;
            getusers(function(users){
                users[self.username] = self;
                chrome.storage.local.set({"users":users});
                console.log("login service: users after remove", users);
            })
        };

        return self;
    }

    

    var getuser = function(username, callback){
        getusers(function(users){
            var user = undefined;
            if(users.hasownproperty(username)){
                user = users[username];
            }
            callback(user);
        });
    }

    var setuser = function(userdata, callback){
        var user = user(userdata);
        getusers(function(users){
            users[user.username] = user;
            chrome.storage.local.set({"users":users}, function(e){
                callback(user);
            })
        });
    }

    return {
        login:function(username, callback){
            console.log("username", username);
            getuser(username, function(user){
                var status = 404;
                if(user){
                    status = 200;
                    cacheduser = user(user);
                }
                callback(status, cacheduser);
            });
        },

        createnewaccount:function(userdata, callback){
            setuser(userdata,function(user){
                cacheduser = user;
                callback(true, user);
            })
        },

        getcurrentuser:function(){
            return cacheduser;
        },

        saveuserdata:function(user){
            
        },

        getTeacher:function(){
            return Teacher(cachedUser);
        }


    }
  }
// Login.$inject = [];
angular.module('SchoolMan').service('Login', Login);