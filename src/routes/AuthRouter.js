const { Router } = require("express");
const { UserModel } = require("../models/user");
const { validateSignupData } = require("../utils/validation");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "sAHzEESHAN@123";

const authRouter = Router();
//signup API
authRouter.post("/signup", async (req, res) => {
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
//Login API
authRouter.post("/login", async (req, res) => {
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
      const userName = userResponse.firstName;
      const userId = userResponse._id;
      // --xxxx-----xxx----xxx---------xxx----------xxx--------xxx-------xxx--------xxx-----
      console.log("Hash password:" + userResponse.password);
      console.log("Role:" + role);
      console.log("UserName:" + userName);
      console.log("User ID:" + userId);
      const hashPassword = userResponse.password; //fetch hash pass from db
      if (userResponse) {
        //-->is line ka matlab yadi user database me hai tab
        //now check password is same or not
        const passwordResponse = await bcrypt.compare(password, hashPassword); //compair
        if (passwordResponse) {
          //psudo step
          //1.Create JWT TOKEN
          const token = jwt.sign(
            {
              role,
              userName,
              userId,
            },
            SECRET_KEY
          );
          //2.Add token to cookies and send response to token
          res.cookie("token", token);
          
          res.status(200).send(userResponse);
        } else {
          res.status(401).json({ message: "Invalid credentials" });
        }
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: err.message || "Something went wrong" });
  }
});
//Logout API
authRouter.post("/logout", async (req, res) => {
  console.log("user logout");
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("User Logout");
});

module.exports = {
  authRouter,
};
