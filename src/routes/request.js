const { Router } = require("express");
const { userAuth } = require("../middlewares/auth");
const { ConnectionRequestModel } = require("../models/connectionRequest");
const { UserModel } = require("../models/user");

const requestRouter = Router();

// Route to send a connection request
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id; // Populated by userAuth middleware
      const { toUserId, status } = req.params;

      //check for validate status type
      const allwedStatus = ["interested", "ignored"];
      if (!allwedStatus.includes(status)) {
        return res.status(400).json({
          msg: "Ivalid status type:  " + status,
        });
      }
      //check for touser is exist or not in DB
      const toUser = await UserModel.findById(toUserId);
      if (!toUser) {
        return res.status(400).send("user not found");
      }

      // Check if a connection request already exists
      const existingRequest = await ConnectionRequestModel.findOne({
        //checks for user1 is sent connection request to user 2 || or user 2 is sent connection request to user
        $or: [
          {
            fromUserId,
            ref:"users",
            toUserId,
          },
          {
            fromUserId: toUserId,
            ref:"users",
            toUserId: fromUserId,
          },
        ],
      });
      if (existingRequest) {
        return res.status(400).send("Connection request already exists.");
      }
      //
      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.status(201).json({
        msg: req.user.firstName + " is " + status + " in  " + toUser.firstName,
        data,
      });
    } catch (err) {
      res.status(500).send("Error: " + err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedinUser = req.user;
      console.log(loggedinUser);
      //validate  the status
      const { status, requestId } = req.params;
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "status not valid",
        });
      }
      //Logic for accepting the request
      //first touser have to login
      // 2.status of request must be interested not ignored or other
      //request id shoud be valid
      const connectionRequest = await ConnectionRequestModel.findOne({
        _id: requestId,
        toUserId: loggedinUser._id,
        status: "interested",
      });
      // console.log("LAlalalalalalalalal"+connectionRequest);
      if (!connectionRequest) {
        return res.status(400).json({
          message: "Connection not found",
        });
      }

      connectionRequest.status = status;
      // console.log(connectionRequest);
      const data = await connectionRequest.save();
      res.json({
        msg: "Hi dost i am " + status + " Your request",
        data,
      });
    } catch (err) {
      res.send(err);
    }
  }
);

module.exports = {
  requestRouter,
};
