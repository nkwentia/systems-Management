var schoolman = angular.module('SchoolMan');

schoolman.config(['modelProvider', function(model){

  model.datatypes.item = {
    v1:{
      type:"schema",
      _id:"datatype/item/v1",
      fields:[{
        key:"registrar",
        type:"string",
        required:true
      },{
        key:"date",
        type:"object",
        required:true
      },{
        key:"description",
        type:"string",
        required:true
      },{
        key:"rubric",
        type:"string",
        required:true
      },{
        key:"income",
        type:"number",
        required:true
      },{
        key:"expenditure",
        type:"number",
        required:true
      }],
      fields_key:0
    }
  };

  function Item(){

    // Prevents global namespace clobbering if you istantiate this object
    // without the 'new' keyword
    if (!(this instanceof Item)) {
      return new Item();
    }
    this.registrar = "";  // string
    this.description = "";
    this.date = new Date();
    this.income = 0.00; // number
    this.expenditure = 0.00; // number
  };

  Item.prototype = new model.Model();
  
  Item.prototype.datatype = Item.datatype = model.datatypes.item.v1;
  Item.prototype.getAmount = function(amount){
    if(typeof amount === 'string'){
      amount = Number(amount.replace(/[^0-9\.]+/g,""));
    }
    return amount;
  }
  Item.prototype.normalize = function(){
    // convert amount from string to number
    if(typeof this.income === "string"){
      this.income = this.getAmount(this.income);
    } 
    if(typeof this.expenditure === "string"){
      this.expenditure = this.getAmount(this.expenditure);
    } 
    this.date = new Date();
  };

  Item.prototype.generateID = function(){
    var id = "item_" + this.date.toISOString();
    return id;
  }

  Item.prototype.db = Item.db = "db_items";

  model.Item = Item;
    
}]);
 