'use strict';

var schoolman = angular.module('SchoolMan')

function modelProvider() {
    
  
  var self = this;
  var modelservice = self;

  function Model(){};

  // This function lets you ask if the object has all the required fields
  // TODO: the config for which fields are required should probably be done 
  // elsewhere
  Model.prototype.isValid = function(){
    // console.log("RUNNING: Model.prototype.isValid");
    var self = this;
    var isOk = true;
    angular.forEach(self.requiredFields, function(field, fieldIndex){
      console.log("isValid field", field);
      if(self.invalidValues.indexOf(self[field]) > -1){
        isOk = false;
      }
    });
    return isOk;
  };

  self.encrypt = Model.prototype.encrypt = function(string){
    return CryptoJS.SHA3(string).toString(CryptoJS.enc.Hex);
  }

  self.isValid = function(self){
    // var self = selfthis;
    console.log("RUNNING: self.isValid", self);
    var valid = true;
    var invalidValues = {
      "string":[""],
      "number":[0]
    }

    angular.forEach(self.datatype.fields, function(field, fieldIndex){
      if(field.required){
        var value = self[field.key];
        console.log("What is value", value, field.type);
        if(typeof value !== field.type){
          console.log("Error typeof", value, field.type);
          valid = false;
        } 
        if(invalidValues[field.type] && invalidValues[field.type].indexOf(value) > -1){
          valid = false;
        }
      }
    });
    return valid;
  };

  // This is intended to replace the isValid functions, which do not work properly
  Model.prototype.validates = function(){

    var tester = this;

    if(typeof this.normalize === "function"){
      tester = Object.create(this);
      tester.normalize();
    }

    var valid = true;
    var invalidValues = {
      "string":["", "0.00", null, undefined],
      "number":[NaN, null, undefined]
    };   

    angular.forEach(tester.datatype.fields, function(field, fieldIndex){
      if(field.required){
        var value = tester[field.key];
        if(typeof value !== field.type){
          valid = false;
          console.log("Failed to validate:" + tester.constructor, 
                      "typeof " + field.key + " should equal " + field.type + " got: " + 
                      value + " : " + (typeof value));
        } 
        if(invalidValues[field.type] && invalidValues[field.type].indexOf(value) > -1){
          valid = false;
        }
      }
    });
    return valid;

  };


  Model.prototype.asDoc = function(){

    var self = this;

    var vectorData = [];
    angular.forEach(self.datatype.fields, function(field, fieldIndex){
      vectorData.push(self[field.key]);
    });

    var doc = {};
    doc._id = self._id;
    if(self._rev){
      doc._rev = self._rev;
    }

    doc.datatype= this.datatype._id;
    doc[this.datatype.fields_key] = vectorData;

    return doc;
  };

  Model.prototype.saveable = function(){
    var self = this;
    if(typeof self.generateID === 'function' && !self._id){
        var id = self.generateID();
        self._id = id;
      }
    if(typeof self.normalize === 'function'){
      self.normalize();
    }
    return self.asDoc();
  };

  Model.prototype.save = function(){

    var self = this;
    var deferred = self.$q.defer();
    if(typeof(self.db) === "string"){
      console.log("db = ", self.db);
      self.db = modelservice.pouchdb.create(self.db);
      console.log("db = ", self.db);
    }

    if(self.validates()){
      self.db.put(self.saveable()).then(function(response){
        self._rev = response.rev;
        self._id = response.id;
        console.log("Saved: ", self);
        self.db.allDocs().then(function(success){
          console.log("Alldocs:", success);
        })
        deferred.resolve(response);
      }, function(err, response){
        deferred.reject(err, response);
      }).catch(function(error){
        console.log("Failed to save:", error);
      });
    } else {
      deferred.reject(this.constructor + " is not valid");
    }
    
    return deferred.promise;
  };

  Model.prototype.model = function(doc){
    var self = Object.create(this);
    angular.forEach(this.vectorSchema, function(test, keyIndex){
      self[test] = doc.d[keyIndex];
    });
    return self;
  };

  Model.prototype.is = function(datatype){
    var part = datatype.split(".");
    var type = part[0];
    var version = part[1];
    self.datatypes[type] = {};
    self.datatypes[type][version] = {
      type:"schema",
      _id:"datatype/" + type + "/" + version,
      fields:[],
      fields_key:0
    };
    this.datatype = self.datatypes[type][version];
  };

  Model.prototype.val = function(prop, required){
    var data = prop.split(":");
    var key = data[0].trim();
    var type = data.length > 1  ? data[1].trim() : undefined;

    this.datatype.fields.push({
      key:key,
      type:type,
      required: required ? true : false
    });

    return key;
  };

  Model.prototype.__init__ = function(spec){
    var self = this;
    spec = spec || {};
    angular.forEach(spec, function(prop, key){
      if(spec[key]){
        self[key] = spec[key];
      }
    })
  };

  self.parse = function(doc, spec){
    var data = {
      _id:doc._id,
      _rev:doc._rev
    };
    angular.forEach(spec.fields, function(field, fieldIndex){
      data[field.key] = doc[spec.fields_key][fieldIndex];
    });
    return data;
  };

  self.parse2 = function(doc, datatypeId){
    var params = datatypeId.split("/");
    //console.log("Datatypes", self.datatypes);
    var spec = self.datatypes[params[1]][params[2]];
    return self.parse(doc, spec);
  }

  self.Model = Model;
  
  self.datatypes = {};
  self.updateDatatypes = function(){
    // Make sure all datatypes defined in models are saved to the database
    var m = new Model();
    angular.forEach(self.datatypes, function(versions, type){
      angular.forEach(versions, function(version, key){
        m.db.get(version._id).then(function(datatype){
          datatype.fields = version.fields;
          m.db.put(version);
        }).catch(function(error){
          m.db.put(version);
        })
      });
    });
  };


  this.$get = ["Data2", "$q" , "Slug", "pouchdb", function ModelFactory(Data2, $q, Slug, pouchdb) {
    Model.prototype.db = Data2;
    Model.prototype.$q = $q;
    self.slugify = Slug.slugify;
    self.pouchdb = pouchdb;
    self.updateDatatypes();
    return self;
  }];

}
// modelProvider.$inject = [];
schoolman.provider('model', modelProvider);