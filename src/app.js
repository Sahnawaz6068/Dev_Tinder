console.log("Building DEV Tinder");
const express=require("express");
const connectDB =require("./config/database");
const { UserModel } = require("./models/user");
const app=express();

app.use(express.json());
//signup route
app.post("/signup",async (req,res)=>{

    // console.log(req.body);
    // console.log(req);

    //---------------------------DUMMY DATA FILLING IN DB --------------------
    // const userDummy={
    //     firstname:"Ajad",
    //     ladtName:"Khan",
    //     email:"ajad@gmail.com",
    //     password:"AjadAjad",
    //     age:21,
    //     gender:"Male"
    // };
   
    console.log(req.body);
const User=req.body; //user from Post request store in User then with the help of userModel created new user
const user=new UserModel(User); //create new user with the help of UserModel(input); 
// creating new instence of userModel
// now put it in database
try{
    await user.save(); 
    res.status(200).json({
        msg:"new user created"
    })
}catch(err){
    console.log("Error in saving error")
    res.json({
        msg:"Error in creating new user"
    })
}
//-------------------------------------------------------------------------------------
 });
//get user by email
app.get("/user",async (req,res)=>{

    try{
        const userEmail=await req.body.email;
        const foundUser=await UserModel.findOne({email:userEmail});
        if(foundUser.length===0){
            res.status(404).send("user Not found");
        }else{
            res.status(201).send(foundUser);
            console.log(foundUser)
        }
    }catch(err){
        console.log("something went wrong while serarching user by emial");
        res.status(401).send("something went wrong");
    }
})


// FEED API, get request to /feed Route
app.get("/feed",async (req,res)=>{
    try{
        const allUser=await UserModel.find({});
        console.log(allUser)
        res.status(201).send(allUser)
    }catch(err){
        console.log(err);
        res.status(404).send("user Not found")
    }
})


//database connection
connectDB().then(()=>{
    console.log("data base is connected")
    app.listen(3000,()=>{
        console.log("app is listening on port:3000")
    })
}).catch((err)=>{
    console.err("database is not connected sucessfully");
})
