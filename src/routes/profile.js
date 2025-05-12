const { Router } = require("express");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user");
const { validateEditProfileData } = require("../utils/validation");
const { userAuth } = require("../middlewares/auth");
const profileRouter = Router();
const SECRET_KEY = "sAHzEESHAN@123";

profileRouter.use(cookieParser());
//profile view API
profileRouter.get("/profile/view", async (req, res) => {
  try {
    const cookies = req.cookies;
    const token = cookies.token;
    console.log("Token:"+token);
    const decodedMsg = jwt.verify(token, SECRET_KEY); //this return a object wo object jo signUp karte time diye the
    const Id=decodedMsg.userId;
    console.log("This is user Id"+Id);
    const userObj=await UserModel.findById(Id).select("-password"); //password excluded
    // console.log("user All information................................................."+userObj);
    // res.send("ye raha tera profile"+decodedMsg);
    res.status(200).json({
      userObj
    })
  } catch (err) {
    res.status(400).send("Tokenn is not valid");
  }
});

//Profile Update API
profileRouter.patch("/profile/edit",userAuth, async (req,res)=>{
  try{
    if(!validateEditProfileData(req)){
      //validate user that everything is ok  which insert in the body
      throw new Error("Invalid Profile Edit request");
    }
const loggedinUser=req.user;
Object.keys(req.body).forEach(key => (loggedinUser[key] = req.body[key]));
await loggedinUser.save();
res.json({
  msg:"your profile updated sucessfully Mr:"+loggedinUser.firstName,
  data:loggedinUser
})

console.log(loggedinUser);
  }catch(err){
    res.status(400).send("Error"+err.message);
  }
})

module.exports = {
  profileRouter,
};
