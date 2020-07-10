'use strict';

function MockData(model, Data2, Forms, Departments, Groups, Fees, Uid, Students, Payments, Marksheets, Transcripts, Items){

  
  var forms = Forms.all();
  var departments = Departments.getAll();
  var groups = Groups.getAll();
  var fees = Fees.getAll();

  // Random number util
  var getRandBetween = function(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
  };

  window._mock = {} 
  window._mock.students = {};
  window._mock.payments = {};
  window._mock.marksheets = {};
  window._mock.transcripts = {};
  window._mock.items = {};
  window._mock.dbs = {};
  window._mock.students.destroy = Students.destroy;
  window._mock.payments.destroy = Payments.destroy;
  window._mock.marksheets.destroy = Marksheets.destroy;
  window._mock.transcripts.destroy = Transcripts.destroy;
  window._mock.items.destroy = Items.destroy;
  window._mock.dbs.destroy = function(){
    Students.destroy();
    Payments.destroy();
    Marksheets.destroy();
    Transcripts.destroy();
    Items.destroy();
  }
  window._mock.students.create = function(n){
    var students = {docs:[]};
    Uid.getBatch(n).then(function(uids){
      console.log("Got batch uids", uids);
      students = _.map(uids, function(uid){
        
        var forms =  Object.keys(Forms.all())
        var depts =  Object.keys(Departments.getAll())
        var groups = Object.keys(Groups.getAll());
        var fees = Object.keys(Fees.getAll());
        var genders = ["Female", "Male"];
        
        var person = {
          first_name: Faker.Name.firstName(),
          last_name: Faker.Name.lastName(),
          gender:genders[getRandBetween(0, 2)]
        }

        var studentData = {
          name: person.first_name + " " + person.last_name,
          sex: person.gender,
          birth: Faker.Date.past(500),
          parentName:Faker.Name.findName(),
          parentPhone:Faker.PhoneNumber.phoneNumber(),
          parentEmail:Faker.Internet.email(),
          formIndex:forms[getRandBetween(0, forms.length)],
          groupId:groups[getRandBetween(0, groups.length)],
          feeId:fees[getRandBetween(0, fees.length)],
          deptId:depts[getRandBetween(0, depts.length)]
        }

        var student = new model.Student(studentData);
        student.id = uid.value;
        return student;
      });
      console.log("Mocking batch students: ", students);
      // students.docs = _.map(students.docs, function(student){
      //   return student.saveable();
      // });
      Students.saveBatch(students).then(function(success){
          console.log("saved " + n + " students", success);
          Uid.save(uids[uids.length - 1]);
      }).catch(function(error){
        console.log("Failed to save batch students", error);
      });
    });
  }

}
MockData.$inject = ['model', 'Data2', 'Forms', 'Departments', 'Groups', 'Fees', 'Uid', 'Students', 'Payments', 'Marksheets', 'Transcripts', 'Items'];
angular.module('SchoolMan').service('MockData', MockData);