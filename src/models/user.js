const mongoose = require("mongoose");
const validator = require("validator");
const bcrpyt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const task = require('../models/task');


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      if (value.length === 0) {
        throw new Error("name required");
      }
    },
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error(`age can't be negative`);
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      if (value.includes("password") || value.length <= 6) {
        throw new Error(
          "invalid password must not contain password and should be greater than length 6"
        );
      }
    },
  },
  email: {
    type: "string",
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email address");
      }
    },
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  avatar :{
    type : Buffer,
  }
});

//virtual property relationship

userSchema.virtual('tasks',{
  ref : 'tasks',
  localField: '_id',
  foreignField: 'owner',
})


//puclic data
userSchema.methods.toJSON = function () {
  
    const user = this;
    const userRequired =  user.toObject();

    delete userRequired.password;
    delete userRequired.tokens;
    delete userRequired.avatar;
    return userRequired;
};

//token generation
userSchema.methods.generateToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET_KEY, {
    expiresIn: "2 minutes",
  });
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

//user validation through login
userSchema.statics.findAndVerify = async (email, password) => {
  const user = await users.findOne({ email });
  if (!user) {
    throw new Error("email not found in database");
  }
  const isMatch = await bcrpyt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("password not matched");
  }
  return user;
};

//user save
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrpyt.hash(user.password, 8);
  }
  next();
});

//user delete
userSchema.pre("remove" , async function (next) {
  const user =this;
  await task.deleteMany({owner : user._id});
  next();
})

const users = mongoose.model("user", userSchema);

module.exports = users;
