const {Router}=require("express");
const userRouter=Router();
const connectDB = require("../config/database");
// const { UserModel } = require("./models/user");
const { validateSignupData } = require("../utils/validation");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { userAuth } = require("../middlewares/auth");
const { UserModel } = require("../models/user");
const SECRET_KEY = "sAHzEESHAN@123";

app.post("/signup", async (req, res) => {
    
    try {
      //user info fetch from body
      const { firstName, lastName, password, email, role } = await req.body;
  
      //validate signup data by function define in "./utils/validation.js"
      validateSignupData(req);
  
      //Encrypt the password
      console.log(password); //normal password
      const hashPassword = await bcrypt.hash(password, 10); //encrypted password
      console.log(hashPassword);
  
      //data inserting in database
      const user = await new UserModel({
        firstName,
        lastName,
        email,
        role,
        password: hashPassword,
      });
      //data saving in dataBase
      await user.save(user);
  
      res.status(200).json({
        msg: "new user created",
      });
    } catch (err) {
      console.log("Error in saving");
      res.status(401).send("error:" + err.message);
    }
  });
  //-------------------------------------------------------------------------------------
  app.post("/login", async (req, res) => {
    try {
      const { email, password } = await req.body;
      //sanitize the data
      const emailResponse = validator.isEmail(email);
      if (!emailResponse) {
        //email ha ki nahi
        throw new Error("Enter email");
      } else {
        //find user with email in database
        const userResponse = await UserModel.findOne({ email: email });
        const role = userResponse.role; //role feetch from db
        const userName=userResponse.firstName;
        const userId=userResponse._id;
  // --xxxx-----xxx----xxx---------xxx----------xxx--------xxx-------xxx--------xxx-----
        console.log("Hash password:"+userResponse.password);
        console.log("Role:"+role);
        console.log("UserName:"+userName);
        console.log("User ID:"+userId);   
        const hashPassword = userResponse.password; //fetch hash pass from db
        if (userResponse) { //-->is line ka matlab yadi user database me hai tab 
          //now check password is same or not
          const passwordResponse = await bcrypt.compare(password, hashPassword); //compair
          if (passwordResponse) {
            //psudo step
            //1.Create JWT TOKEN
            const token = jwt.sign(
              {
                role,
                userName,
                userId
              },
              SECRET_KEY
            );
            //2.Add token to cookies and send response to token
            res.cookie("token", token);
            res
              .status(200)
              .send("user Login Sucessfully and generated Token:" + token);
          } else {
            res.send("Invalid credentials");
          }
        } else {
          res.status(404).send("invalid credentials");
        }
      }
    } catch (err) {
      res.send(err);
    }
  });
  //upar wale ka kaam hai ki token banana hai with all the checks and security
  //Token banane ke bad use cookies me store kara dena
  //------------------------------------------------------------------------------------------------
  //get Profile
  app.get("/profile", async (req, res) => {
    try {
      const cookies = req.cookies;
      const token = cookies.token;
      console.log(token);
      const decodedMsg = jwt.verify(token, SECRET_KEY); //this return a object wo object jo signUp karte time diye the
      console.log("Decodede obj:"+decodedMsg);
      console.log(decodedMsg.role);
      res.send("ye raha tera profile");
    } catch (err) {
      res.send("Something wrong happning wow!!!!");
    }
  });
  //get user by email
  app.get("/user", async (req, res) => {
    try {
      
      const userEmail = await req.body.email;
      const foundUser = await UserModel.findOne({ email: userEmail });
      if (foundUser.length === 0) {
        res.status(404).send("user Not found");
      } else {
        res.status(201).send(foundUser);
        console.log(foundUser);
      }
    } catch (err) {
      console.log("something went wrong while serarching user by emial");
      res.status(401).send("something went wrong" + err);
    }
  });
  
  // FEED API, get request to /feed Route
  app.get("/feed", async (req, res) => {
    try {
      const allUser = await UserModel.find({});
      console.log(allUser);
      res.status(201).send(allUser);
    } catch (err) {
      console.log(err);
      res.status(404).send("user Not found");
    }
  });
  
  //find by id
  app.get("/id", async (req, res) => {
    try {
      const user = await UserModel.findById({ _id: "67de3a3745f827248439beb3" });
      if (user) {
        res.json({
          user,
        });
      } else {
        res.send("user not found with this id");
      }
    } catch (err) {
      res.status(404).send("something went wrong");
    }
  });
  
  //update and delete API
  app.delete("/user", async (req, res) => {
    const userId = await req.body.userId;
    try {
      const response = await UserModel.findByIdAndDelete(userId);
      console.log(response);
      if (response) {
        res.status(201).send("find and user deleted");
      }
    } catch (err) {
      res.send("something went wrong!");
    }
  });
  app.patch("/user", async (req, res) => {
    const userId = await req.body.userId;
    const data = await req.body;
  
    try {
      const AllowedUpdates = [
        "userId",
        "ImageUrl",
        "skill",
        "about",
        "gender",
        "age",
        "password",
      ];
      const isUpdateAllows = Object.keys(data).every((k) =>
        AllowedUpdates.includes(k)
      );
      if (data?.skill.length > 10) {
        throw new Error("Skill is not more than 10");
      }
      if (!isUpdateAllows) {
        throw new Error("Update not allowed");
      }
  
      const response = await UserModel.findByIdAndUpdate({ _id: userId }, data, {
        returnDocument: "after",
        runValidators: true,
      });
      //userID and data
      if (response) {
        res.status(200).send("user Updated sucessfully");
      } else {
        res.send("err in deleting user");
      }
    } catch (err) {
      res.send("something went wrong:::" + err.message);
    }
  });
  app.get("/test",userAuth,(req,res)=>{
    // userAuth(req);
    res.json({
      msg:"all ok"
    })
  })
  app.post("/connection-request",userAuth,async (req,res)=>{
    const userName=req.user.firstName;
  
    try{
      res.json({
        msg:"Connection request sent by:"+userName
      })
    }catch(err){
      res.send("faild connection request")
    }
  })


module.exports={
    userRouter
}