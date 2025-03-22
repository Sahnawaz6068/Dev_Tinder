const adminAuth=(req,res,next)=>{
    console.log("admin auth is getting checked ");
    const token="xyz";
    const isAuthorized=token==="xyz";
    if(!isAuthorized){
        res.status(401).send("unauthorised request");
    }else{
        next() //calling next function
    }
}

const userAuth=(req,res,next)=>{
    console.log("user auth is getting checked");
    const token="xyz";
    const isAuthorized=token==="xyz";
    if(!isAuthorized){
        res.status(401).send("unauthorised request");
    }else{
        next() //calling next function
    }
}

module.exports={
    adminAuth,
    userAuth
}

