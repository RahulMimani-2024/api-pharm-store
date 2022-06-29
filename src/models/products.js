const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    id :{
        type :Number,
        unique : true,
        required : true,
        validate(value){
            if(value < 0){
                throw new Error(`Id can't be negative`);
            }
        }
    },
  title : {
    type: String,
    // required: true,
    trim: true,
    validate(value) {
      if (value.length === 0) {
        throw new Error("title required");
      }
    },
  },
  company : {
    type:String,
    required :true,
  },
  price : {
    type: Number,
    required :true,
    validate(value){
      if(value < 0){
          throw new Error(`Price can't be negative`);
      }
  }
  },
  composition : {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      if (value.length === 0) {
        throw new Error("info required");
      }
    },
  },
  info : {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      if (value.length === 0) {
        throw new Error("info required");
      }
    },
  },
  avatar :{
    type : Buffer,
  }
});

productSchema.methods.toJSON = function () {
  
  const product = this;
  const productRequired =  product.toObject();
  delete productRequired.avatar;
  return productRequired;
};

const Products = mongoose.model("Products" , productSchema);


module.exports = Products;