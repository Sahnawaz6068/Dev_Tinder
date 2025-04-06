const { Router } = require("express");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user");
const profileRouter = Router();
const SECRET_KEY = "sAHzEESHAN@123";

profileRouter.use(cookieParser());

profileRouter.get("/profile", async (req, res) => {
  try {
    const cookies = req.cookies;
    const token = cookies.token;
    console.log("Token:"+token);
    const decodedMsg = jwt.verify(token, SECRET_KEY); //this return a object wo object jo signUp karte time diye the
    const Id=decodedMsg.userId;
    console.log(Id);
    const userObj=await UserModel.findById(Id).select("-password"); //password excluded
    console.log(userObj);
    // res.send("ye raha tera profile"+decodedMsg);
    res.json({
      decodedMsg
    })
  } catch (err) {
    res.send("Something wrong happning wow!!!!");
  }
});
module.exports = {
  profileRouter,
};
