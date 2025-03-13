console.log("Building DEv Tnder");
const express=require("express");

const app=express();

app.use((req,res)=>{
    res.json({
        msg:"Server is running"
    })    
})

app.listen(3000,()=>{
    console.log("app is listening on port:3000")
})