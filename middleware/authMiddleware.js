const asyncHandler=require("express-async-handler");
const User=require("../models/userModel");
const jwt=require("jsonwebtoken");

const protect=asyncHandler(async (req,res,next)=>{
    try {
        const token=req.cookies.token;
        if(!token){
            res.status(401);
            throw new Error("Not Authorized, Please login");           
        }

         //varify token
         const varified=jwt.verify(token,process.env.JWT_SECRET);

         //Get UserId from Token
         const user=await User.findById(varified.id).select("-password");
         if(!user){
             res.status(401);
            throw new Error("User not found");
         }
         req.user=user;
         next();
    } catch (error) {
        res.status(401);
        throw new Error("User not Authorized,Please login.");
    }
});
module.exports=protect;