# Feed route
## Thought Process
  //logiin user see cards of user jisko request send nahi kiya hai(Status=interested) 3.alredy sent connection request
        //also not show that user who mark as ignored (Status=ignores) 2.ignoreed card
        //also not that user who is alredy in friend list (status=accepted) 1.connection
        //also not his card his self 0.his own card

#  all the connection request of logedIn User, either logedIn user send or Received

//ya to maine request send ki ho
//ya mujhe request aai ho
    const allConnectionRequest=await ConnectionRequestModel.find({
            $or:[
                {fromUserId:loggedinUser._id}, //ya to maine request send ki ho
                {toUserId:loggedinUser._id} //   ya mujhe request aai ho
            ]
        }).select("fromUserId,toUserId"); //by selecting this two field other data are ignored
        res.status(200).json({
             allConnectionRequest             //got all the connection request either recived or send 
        })
# Now hide this connectionRequest user from the all the connection request
-We are using here a data structure name setDataStructure -->Like an Array
# Feed API and Pagination
-Pagination means getting 10 data at a time and 10 data at next request simiilar case