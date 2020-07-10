var schoolman = angular.module('SchoolMan');

schoolman.config(['modelProvider', function(model){

  model.datatypes.staffpayment = {
    v1:{
      type:"schema",
      _id:"datatype/staffpayment/v1",
      fields:[{
        key:"amount",
        type:"number",
        required:true
      },{
        key:"registrar",
        type:"string",
        required:true
      },{
        key:"staffId",
        type:"string",
        required:true
      },{
        key:"date",
        type:"object",
        required:true
      }],
      fields_key:0
    }
  };

  function Staffpayment(){

    // Prevents global namespace clobbering if you istantiate this object
    // without the 'new' keyword
    if (!(this instanceof Staffpayment)) {
      return new Staffpayment();
    }

    this.amount = 0.00; // number
    this.registrar = "";  // string
    this.staffId = "";  // string
    this.date = "";       // date
  };

  Staffpayment.prototype = new model.Model();
  
  Staffpayment.prototype.datatype = Staffpayment.datatype = model.datatypes.staffpayment.v1;
  Staffpayment.prototype.getAmount = function(){
    var amount = this.amount;
    if(typeof this.amount === 'string'){
      amount = Number(this.amount.replace(/[^0-9\.]+/g,""));
    }
    return amount;
  }
  Staffpayment.prototype.normalize = function(){
    // convert amount from string to number
    if(typeof this.amount === "string"){
      this.amount = this.getAmount();
    } 
    this.date = new Date();
  };

  Staffpayment.prototype.generateID = function(){
    this.date = new Date();
    var id = "staffpayment_" + this.staffId + "_" + this.date.toISOString();
    return id;
  }

  Staffpayment.prototype.db = Staffpayment.db = "db_Staffpayments";

  model.Staffpayment = Staffpayment;
    
}]);
 