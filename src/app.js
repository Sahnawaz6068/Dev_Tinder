console.log("Building DEV Tinder");
const express = require("express");

const connectDB = require("./config/database");
const { UserModel } = require("./models/user");
const cookieParser = require("cookie-parser");
const { userAuth } = require("./middlewares/auth");
const { connectionRouter } = require("./routes/connectionRoute");
const { authRouter } = require("./routes/AuthRouter");
const { profileRouter } = require("./routes/profile");
const { requestRouter } = require("./routes/request");
const { userRouter } = require("./routes/user");
const cors=require('cors')

const app = express();

app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true,               
}));

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", requestRouter);
app.use("/", profileRouter);
app.use("/",userRouter);

app.get("/user", async (req, res) => {
  try {
    const userEmail = await req.body.email;
    const foundUser = await UserModel.findOne({ email: userEmail });
    if (foundUser.length === 0) {
      res.status(404).send("user Not found");
    } else {
      res.status(201).send(foundUser);
      console.log(foundUser);
    }
  } catch (err) {
    console.log("something went wrong while serarching user by emial");
    res.status(401).send("something went wrong" + err);
  }
});

// FEED API, get request to /feed Route
// app.get("/feed", async (req, res) => {
//   try {
//     const allUser = await UserModel.find({});
//     console.log(allUser);
//     res.status(201).send(allUser);
//   } catch (err) {
//     console.log(err);
//     res.status(404).send("user Not found");
//   }
// });

//find by id
// app.get("/id", async (req, res) => {
//   try {
//     const user = await UserModel.findById({ _id: "67de3a3745f827248439beb3" });
//     if (user) {
//       res.json({
//         user,
//       });
//     } else {
//       res.send("user not found with this id");
//     }
//   } catch (err) {
//     res.status(404).send("something went wrong");
//   }
// });

//update and delete API
app.delete("/user", async (req, res) => {
  const userId = await req.body.userId;
  try {
    const response = await UserModel.findByIdAndDelete(userId);
    console.log(response);
    if (response) {
      res.status(201).send("find and user deleted");
    }
  } catch (err) {
    res.send("something went wrong!");
  }
});

app.patch("/user", async (req, res) => {
  const userId = await req.body.userId;
  const data = await req.body;

  try {
    const AllowedUpdates = [
      "userId",
      "ImageUrl",
      "skill",
      "about",
      "gender",
      "age",
      "password",
    ];
    const isUpdateAllows = Object.keys(data).every((k) =>
      AllowedUpdates.includes(k)
    );
    if (data?.skill.length > 10) {
      throw new Error("Skill is not more than 10");
    }
    if (!isUpdateAllows) {
      throw new Error("Update not allowed");
    }

    const response = await UserModel.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    //userID and data
    if (response) {
      res.status(200).send("user Updated sucessfully");
    } else {
      res.send("err in deleting user");
    }
  } catch (err) {
    res.send("something went wrong:::" + err.message);
  }
});
app.get("/test", userAuth, (req, res) => {
  // userAuth(req);
  res.json({
    msg: "all ok",
  });
});

app.use("/user", connectionRouter);

//database connection
connectDB()
  .then(() => {
    console.log("data base is connected");
    app.listen(3000, () => {
      console.log("app is listening on port:3000");
    });
  })
  .catch((err) => {
    console.error("database is not connected sucessfully "+err);
  });
