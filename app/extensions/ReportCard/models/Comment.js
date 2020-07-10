'use strict';

var schoolman = angular.module('SchoolMan');

schoolman.config(['modelProvider', function(model){

  model.datatypes.comment = {
    v1:{
      type:"schema",
      _id:"datatype/comment/v1",
      fields:[{
        key:"userId",
        type:"string",
        required:true
      },{
        key:"studentId",
        type:"string",
        required:true
      },{
        key:"text",
        type:"string",
        required:true
      }],
      fields_key:0
    }
  };

  function Comment(username, studentId){
    // Prevents global namespace clobbering if you istantiate this object
    // without the 'new' keyword
    if (!(this instanceof Comment)) {
      return new Comment();
    }

    this._id  = new Date().toISOString();
    this.userId = username || "";
    this.studentId = studentId || "";
    this.text = "";
  }

  Comment.prototype = new model.Model();
  Comment.prototype.datatype = Comment.datatype = model.datatypes.comment.v1;

  model.Comment = Comment;

}]);
 