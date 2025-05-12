const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user");
const userAuth = async (req, res, next) => {
  try {
    //read the token from cookies
    const token = req.cookies?.token;
    
    if(!token){
      return res.status(401).send("Plese Login")
    }
    //validiate the token
    const decodeMsg = jwt.verify(token, "sAHzEESHAN@123");
    //find username
    const name = decodeMsg.userName;
    // console.log("Name of the User:" + name);
    // console.log("Role of the User:" + decodeMsg.role);
    const userId = decodeMsg.userId;//id fetch from token
    console.log("Logind UserId:"+userId);
    const userResponseDB = await UserModel.findById(userId);//finding in DataBase
    if (!userResponseDB) {
      throw new Error("user not found with this id");
    } 
    //req.user me pura ka pura user response hi put kar diye hai jo ki database se aaya hai
    req.user = userResponseDB;//copy from chat gpt i do not understand it
    //if user dose not found then throw above error otherwise call next middleware or function
    next();
  } catch (err) {
    console.log(err.message)
    res.status(400).json({ "error": err.message });
  }
};
//-----------------------------------xxxxxxxxxxxxxxxx------------------------xxxxxxxxxxxxxxxxxxx
//user middleware token ko req.cookies karta hai fir usse id nikal ke user ko 
//data base me search karta hai yadi mil gaya to route ko successfully operate kara deta hai.
//Means iska use Authorization check karne ke liye hoga,acess de ki na de 
module.exports = {
  userAuth,
};
