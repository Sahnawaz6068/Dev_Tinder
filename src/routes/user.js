const {Router, response}=require("express");
const { userAuth } = require("../middlewares/auth");
const { ConnectionRequestModel } = require("../models/connectionRequest");
const { UserModel } = require("../models/user");
const userRouter=Router();
//Get all the pending connection request for the loged in user
userRouter.get("/user/request/received",userAuth,async (req,res)=>{
    //added middleware userAuth so that only login user can acess this route
    try{
        const loggedinUser=req.user;
        const loggedinUserId=loggedinUser._id;
        const status="interested"
        const connectionRequest=await ConnectionRequestModel.find({
            toUserId:loggedinUserId,
            status:status
        }).populate("fromUserId",["firstName","lastName","ImageUrl"])
        res.json({
            connectionRequest
        })
    }catch(err){
        res.status(400).send("Connection request not found")
    }
})

userRouter.get("/user/connections",userAuth,async (req,res)=>{
    try{//find
        //find who is friend now the status is for that is accepted
        const loggedinUserId=req.user._id;
        const connections= await ConnectionRequestModel.find({
            $or:[
                {
                    toUserId:loggedinUserId, //ya to connection req aaya ho
                    status:"accepted"
                },
                {
                    fromUserId:loggedinUserId,   //ya to connection req bheje ho
                    status:"accepted"
                },
            ]
        }).populate("fromUserId",["firstName","email"])
        .populate("toUserId",["firstName","skill"])
        
        //normalize the data such that it  always return others user id  not my in case of i got connection req from other 
        const data=connections.map((row)=>{
            //corner Case
            //from user id -->Jis ne request bheja hai
            //toUserId --->Jisko request gaya hai
            //(data aa raha hai connection request model se)
            //  from user id, login id hai to---> toUserid return karo()---(kisko bheja hai request)
            //yadi wo login nahi hai to from user id return karo      -----(kaha se aaya hai req)
            if (row.fromUserId._id.toString() === loggedinUserId.toString()){
                return row.toUserId
            }
            return row.fromUserId
        })
        res.status(200).json({ 
            data
        })
    }catch(err){
        res.status(400).send("suring getting connection error"+err.message)
    }
})

userRouter.get("/feed",userAuth,async (req,res)=>{
    try{
        //logiin user see cards of user jisko request send nahi kiya hai(Status=interested) 3.alredy sent connection request
        //also not show that user who mark as ignored (Status=ignores) 2.ignoreed card
        //also not that user who is alredy in friend list (status=accepted) 1.connection
        //also not his card his self 0.his own card
        const loggedinUser=req.user;
        //all the connection request of logedIn User, either logedIn user send or Received
        const allConnectionRequest=await ConnectionRequestModel.find({
            $or:[
                {fromUserId:loggedinUser._id}, //ya to maine request send ki ho
                {toUserId:loggedinUser._id} //   ya mujhe request aai ho
            ]
        }).populate("fromUserId", "-password") // populate full fromUser data except password
        .populate("toUserId", "-password")   // populate full toUser data except password
        .select("fromUserId toUserId"); //by selecting this two field other data are ignored
      
        //using data structure here to implement 
        const hideFromFeed=new Set();      //set Data structure
        allConnectionRequest.forEach((req) => {
            if (req.fromUserId) hideFromFeed.add(req.fromUserId.toString());
            if (req.toUserId) hideFromFeed.add(req.toUserId.toString());
          });
        console.log(hideFromFeed);
        // const users=UserModel.find()
        res.status(200).json({
            allConnectionRequest             //got all the connection request either recived or send 
       })
    }catch(err){
        res.status(400).send("Something went wrong"+err.message)
    }
})

module.exports={
    userRouter
} 