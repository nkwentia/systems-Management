'use strict';

function Users($q, $log, Data2, model, Slug, modelTransformer, InsertionError) {

	var users = {};  	

	var self = {};

  self.login = function(tempUser, accessCode, callback){
    
    var user = null; // Replace this with throwing error
    var username = Slug.slugify(tempUser.fullname);
    var password = model.encrypt(tempUser.password);

    if(users.hasOwnProperty(username)){

      var user = users[username];

      if(user.password === password){
        callback({
          status:200,
          user:user,
          message:"ok"
        });
      } else {
        console.log("Password doesnt match:",user.password, password);
        callback({
          status:401,
          user:undefined,
          message:"The password is incorrect: " + password
        })
      }
              
    } else {
      callback({
        status:404,
        user:undefined,
        message:"Username not found: " + username
      })
    }


    return undefined; // This should make the function asynchronous
  }

	self.getAll = function(){
		return users;
	};

	self.get = function(userId){
		return users[userId];
	};

	self.add = function(user){
		console.log("inside user add function");
    if(users.hasOwnProperty(user.code)){
			throw new InsertionError("users", user.code);
		} else {
			users[user.code] = user;
      console.log("added user");
		}
	};

  self.remove = function(user){
    Data2.remove(user).then(function(success){
      console.log("User removed: ", success);
      delete users[user._id];
    }).catch(function(error){
      $log.error("users.js : remove error:", error);
    });
  };

  self.load = function(){
    
    var deferred = $q.defer();

    var addSuperUser = function(){
      var superuser = new model.User({
        fullname:"Admin",
        username:"admin",
        password:model.encrypt("admin123"),
        name:"admin",
        _id:"user_admin"
      });
      superuser.access.admin = 1;
      superuser.access.teacher = 0;
      superuser.save().then(function(success){
        users[superuser.username] = superuser;
        deferred.resolve(users);
      }).catch(function(error){
        console.log("Failed to create superuser", error);
        deferred.reject(error);
      });
    };

    // Load Data
    var map = function(doc, emit){
      if(doc.datatype === model.User.datatype._id){
        emit(doc._id, {_id:doc.datatype, data:doc});
      } 
    };
    Data2.query(map, {include_docs : true}).then(function(success){
      console.log("Users:Query success", success);
      if(success.total_rows === 0){
        addSuperUser();
      } else {
        angular.forEach(success.rows, function(data, rowIndex){
          var spec = data.doc;
          var obj = model.parse(data.value.data, spec);
          var user = modelTransformer.transform(obj, model.User);
          users[user.username] = user;
          deferred.resolve(users);
        });
      }
    }).catch(function(error){
        console.log("Users: Query failed", error);
        if(error.status === 404){
          addSuperUser();
        } else {
          deferred.reject(error);
        }
    });
      
    return deferred.promise;
  };

  return self;

}
Users.$inject = ['$q', '$log', 'Data2', 'model', 'Slug', 'modelTransformer', 'InsertionError'];
angular.module('SchoolMan').service('Users', Users);