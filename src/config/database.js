const mongoose=require("mongoose");

const connectDB=async ()=>{
    await mongoose.connect(
        "mongodb+srv://nevergiveup6162:pTdkCxtQ4zCinCj1@cluster0.skhui.mongodb.net/DEVTINDER"
    );
};

module.exports=connectDB;
 
