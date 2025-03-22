const mongoose=require("mongoose");

//create user schema
const userSchema= mongoose.Schema({
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    age:{
        type:String
    },
    gender:{
        type:String
        //search from internet
    }
})
//create user model
const UserModel=mongoose.model("User",userSchema);
//export
module.exports={
    UserModel
}