const mongoose = require("mongoose");
const validator = require("validator");
//create user schema
const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minLength: 4,
      maxLemgth: 50,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is not valid" + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: String,
    },
    gender: {
      type: String,
      //search from internet
      // enum:{
      //   value:["male","female","other"],
      //   msg:"enter valid gender"
      // },
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    about: {
      type: String,
      default: "This is default value of about you",
    },
    skill: {
      type: [String],
    },
    ImageUrl: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm-TruksPXPI5imDL_kfzEfFiAZwg5AzHtWg&s",
    },
    role:{
      type:String,
      validate(value) {
        if (!["Admin", "User"].includes(value)) {
          throw new Error("Must fill admin or user");
        }
      }
    },
  },
  {
    timestamps: true,
  }
);

//create user model
const UserModel = mongoose.model("User", userSchema);
//export
module.exports = {
  UserModel,
};
