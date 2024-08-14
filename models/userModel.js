const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");

const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please add a name."]
    },
    email:{
        type:String,
        required:[true,"Please add a Email."],
        unique:true,
        trim:true,
        match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,"Please enter a valid email."]
    },
    password:{
        type:String,
        required:[true,"Please enter a password."],
        minLength:[6,"Password must be upto 6 charecters."],
       // maxLength:[50,"Password must not be upto 21 charecters."]
    },
    photo:{
        type:String,
        required:[true,"Please add  a Photo."],
        default:"https://i.ibb.co/4pDNDk1/avatar.png"
    },
    phone:{
        type:String,
        default:"+91"
    },
    bio:{
        type:String,
        maxLength:[250,"Bio must not be more than 250."],
        default:"Bio"
    }

},{timestamps:true});

//Encrypt Password
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next();
    }
    //Hash the password
    const salt=await bcrypt.genSalt(10);
    const hashedPassword= await bcrypt.hash(this.password,salt);
    this.password=hashedPassword;
    next();
});

const User=mongoose.model("User",userSchema);
module.exports = User