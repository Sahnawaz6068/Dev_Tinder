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

//find by id
app.get("/id",async (req,res)=>{
    try{
        const user=await UserModel.findById({_id:"67de3a3745f827248439beb3"});
        if(user){
            res.json({
                user
            })
        }else{
            res.send("user not found with this id")
        }
    }catch(err){
        res.status(404).send("something went wrong")
    }
})

//update and delete API
app.delete("/user",async (req,res)=>{
    const userId=await req.body.userId;
    try{
        const response=await UserModel.findByIdAndDelete(userId);
        console.log(response);
        if(response){
            res.status(201).send("find and user deleted")
        }
    }catch(err){
        res.send("something went wrong!")
    }
})
app.patch("/user",async (req,res)=>{
    const userId=await req.body.userId;
    const data=await req.body;
    try{
        const response=await UserModel.findByIdAndUpdate({_id:userId},data);
                                        //userID and data
        if(response){
            res.status(200).send("user Updated sucessfully");
        }else{
            res.send("err in deleting user")
        }

    }catch(err){
        res.send("something went wrong")
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
