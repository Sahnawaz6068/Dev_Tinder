const { Router } = require("express");
const requestRouter = Router();
const {userAuth}=require("../middlewares/auth");
requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const userName = req.user.firstName;

  try {
    res.json({
      msg: "Connection request sent by:" + userName,
    });
  } catch (err) {
    res.send("faild connection request");
  }
});
module.exports = {
  requestRouter,
};
