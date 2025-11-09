import User from "../models/user.js";
import bcrypt from "bcryptjs"
import generateToken from "../lib/utilis.js";
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
            
         generateToken(newUser._id,res);
         console.log("reached here 2.9");
        await newUser.save();
         console.log("reached here 3");
        res.status(201).json({
            _id:newUser._id,
            fullName:newUser.fullName,
            email:newUser.email,
            profilePic:newUser.profilePic
        })
         }else{
            return res.status(400).json({message:"invalid user data "})
         }
    }catch(error){
         console.log(  "error in signup controller");
         res.status(500).json({message:"Internal server Error"})
    }
   
    


}