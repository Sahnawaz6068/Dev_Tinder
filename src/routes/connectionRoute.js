const {Router}=require("express");
const { userAuth } = require("../middlewares/auth");
const connectionRouter=Router();

connectionRouter.post("/connection-request2",userAuth,(req,res)=>{
    const user=req.user;
    try{
        res.send("connection request sent by:"+user.firstName)
    }catch(err){
        res.send("Error in sending request")
    }
})

module.exports={
    connectionRouter,
}