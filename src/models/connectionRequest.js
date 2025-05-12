const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true, 
      ref: "User"
    },
    status: {
      type: String,
      required: true, 
      enum: {
        values: ["rejected", "accepted", "ignored", "interested"],
        message: "{VALUE} is not a valid status"
      }
    }
  },
  {
    timestamps: true
  },
);

connectionRequestSchema.index({fromUserId:1,toUserId:1});//it add such that db call is faster

//checks for sending connection request to yourself
connectionRequestSchema.pre("save",function(next){
  const connectionRequest=this;
  //check if from user id is same as to user id.
  if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
    throw new Error("You can not send Connecction request  to yourself")
  }
  next();
});

const ConnectionRequestModel = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = {
  ConnectionRequestModel
};
