import User from "../models/user.js";
import bcrypt from "bcryptjs"
import generateToken from "../lib/utilis.js";
import { sendWelcomeEmail } from "../emails/emailHandler.js";
 import cloudinary from "../lib/cloudinary.js"



export async function signup(req,res){
 
    const {fullName,email,password}=req.body;
    try{
        if(!fullName || !email || !password){
      return  res.status(400).json({message:"all fields are required"});
         }

         if(password.length<6){
          return  res.status(400).json({message:"password must be atleast 6 characters"});
         }
        //  const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        //  if(!emailRegex.test(email)){
        //     return res.status(400).josn({message:"invalid email format"});
        //  }

const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if(!emailRegex.test(email)){
    return res.status(400).json({message:"Invalid email format"});
}
         const user=await User.findOne({email});
         if(user) return res.status(400).json({message:"Email already exists"});
         
         const salt= await bcrypt.genSalt(10);
         const hashedPassword=await bcrypt.hash(password,salt);
         console.log("reached here 2");
         const newUser=new User({
            fullName,
            email,   
           password: hashedPassword
         });
         if(newUser){
        const savedUser= await newUser.save();
         generateToken(newUser._id,res);

         
       
       
        res.status(201).json({
            _id:newUser._id,
            fullName:newUser.fullName,
            email:newUser.email,
            profilePic:newUser.profilePic
        });

        try{
               await sendWelcomeEmail(savedUser.email,savedUser.fullName,process.env.CLIENT_URL)
        }catch(error){
            console.error("failed to sent emaillllll",error)
        }
         }else{
            return res.status(400).json({message:"invalid user data "})
         }
    }catch(error){
         console.log(  "error in signup controller");
         res.status(500).json({message:"Internal server Error"})
    }
   
    


}

export async function login(req,res){

try{
    const {email,password}=req.body;

    if(!email || !password){
        return res.status(400).json({message:"all fields are required"});
    }

    const user=await User.findOne({email});
    

    if(!user) {
        return res.status(400).json({message:"invalid credentials"});
    }

    const isPasswordCorrect=await bcrypt.compare(password,user.password);

    if(!isPasswordCorrect){
        return res.status(400).json({message:"invalid credentials"});
    }

    generateToken(user._id,res);
   res.status(201).json({
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            profilePic:user.profilePic
        });
    // res.send(200).josn({message:"login successfull"});
}catch(error){
console.log(error);
res.status(500).json({message:"internal server Error"});
}
}

export function logout(__dirname,res){
res.cookie("jwt"," ",{maxAge:0});
return res.status(200).json({message:"logout successfully"});
}

export async function updateProfile(req,res){
try{
  const {profilePic} =req.body;

  if(!profilePic){
    res.status(400).json({message:"profile pic is required"});
  }
  const userid=req.user._id;

  const uploadResponse=await cloudinary.uploader.upload(profilePic);

  const updatedUser=await User.findByIdAndUpdate(userid,{profilePic:uploadResponse.secure_url},{new:true}).select("-password"); 

  res.status(200).json(updatedUser);
}catch(error){
console.log("error in update profile",error);
res.status(500).json({message:"Internal server error"});
}
}