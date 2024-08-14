const asyncHandler=require("express-async-handler");
const User=require("../models/userModel");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcryptjs");

//Generate Token for jwt
const generateToken=(id)=>{
   return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"1d"}); 
}



//Register User
const registerUser= asyncHandler(async (req,res)=>{
   const {name,email,password}=req.body;
   //adding some validation
   if(!name || !email || !password){
    res.status(400);
    throw new Error("Please fill all require fields.");
    
   }
   if(password.length<6){
    res.status(400);
    throw new Error("Password must be more tha 6 charectors.");
   }
   //check if user email already exists
  const userExists= await User.findOne({email})
  if(userExists){
     res.status(400);
    throw new Error("Email already registered.");
  }

   
 
  //create new user
  const user=await User.create({
    name,
    email,
    password
  }); 
  //generate Token
  const token=generateToken(user._id);

  //send http (only-cookie)
  res.cookie("token",token,{
    path: "/",
    httpOnly:true,
    expires:new Date(Date.now()+1000*86400), //1Day
    sameSite:"none",
   // secure:true
  });

  if(user){
    const{_id,name,email,photo,phone,bio}=user
    res.status(201).json({
        _id,name,email,photo,phone,bio,token
        
    });

  }else{
    res.status(400);
    throw new Error("Invalid user data");
  }
});

//Login User

const loginUser=asyncHandler( async (req,res)=>{
  const {email,password}=req.body;
  //Adding Validation
  if(!email || !password){
     res.status(400);
    throw new Error("Please add email and password");
  }
  //User exist or not
  const user=await User.findOne({email});
  if(!user){
    res.status(400);
   throw new Error("User not found please sign up");
 }
 //If password is correct
 const passwordIsCorrect=await bcrypt.compare(password,user.password);

 //generate Token
 const token=generateToken(user._id);

 //send http (only-cookie)
 res.cookie("token",token,{
   path: "/",
   httpOnly:true,
   expires:new Date(Date.now()+1000*86400), //1Day
   sameSite:"none",
  // secure:true
 });

 if(user && passwordIsCorrect){
  
    const{_id,name,email,photo,phone,bio}=user;
    res.status(201).json({
        _id,name,email,photo,phone,bio,token
        
    });
  
 }else{
   res.status(400);
   throw new Error("Invalid email or password");
 }


});

//Logout User

const logout=asyncHandler(async(req,res)=>{
  res.cookie("token","",{
    path: "/",
    httpOnly:true,
    expires:new Date(0), //creating current date for making cookie wxpire
    sameSite:"none",
   // secure:true
  });
  return res.status(200).json({message:"Successfully logged out."})
});

//get User Data
const getUser=asyncHandler(async (req,res)=>{
  const  user=await User.findById(req.user._id);
  if(user){
    const{_id,name,email,photo,phone,bio}=user;
    res.status(201).json({
        _id,name,email,photo,phone,bio
        
    });

  }else{
    res.status(400);
    throw new Error("User not found.");
  }
})

//Get Login status
const loginStatus=asyncHandler(async(req,res)=>{
  const token=req.cookies.token;
  if(!token){
    return res.json(false);
  }
  //varify token
  const varified=jwt.verify(token,process.env.JWT_SECRET);
  if(varified){
    return res.json(true);
  }
})
//Update User
const updateUser=asyncHandler(async(req,res)=>{
  const user=await User.findById(req.user._id);
  if(user){
    const{name,email,photo,phone,bio}=user;
    user.email=email;
    user.name=req.body.name || name;
    user.phone=req.body.phone || phone;
    user.bio=req.body.bio || bio;
    user.photo=req.body.photo || photo;
    
    const updatedUser=await user.save();
    res.status(201).json({
      _id:updatedUser._id,
      name:updatedUser.name,
      email:updatedUser.email,
      photo:updatedUser.photo,
      phone:updatedUser.phone,
      bio:updatedUser.bio
      
  });  
  }else{
    res.status(404);
    throw new Error("User not found.")
  }
})
//Change password
const changePassword=asyncHandler(async(req,res)=>{
  const user=await User.findById(req.user._id);
  const {oldPassword,password}=req.body;
  if(!user){
    res.status(400);
    throw new Error("User not found,please signup.")
  }
  //validate
  if(!oldPassword || !password){
    res.status(400);
    throw new Error("Please fill the password field.")
  }
  //check id password is matched
  const passwordIsCorrect=await bcrypt.compare(oldPassword,user.password);
  if(passwordIsCorrect && user){
    user.password=password;
    await user.save();
    res.status(200).send("Password Changed Successfull.");

  }else{
    res.status(400);
    throw new Error("Password is incorrect");
  }
})

module.exports={
    registerUser,
    loginUser,
    logout,
    getUser,
    loginStatus,
    updateUser,
    changePassword
}
