import jwt from "jsonwebtoken";
import User from "../models/user.js";



export default async function protect(req,res,next){

    const token=req.cookies.jwt
try{
    
    if(!token) {
        return res.status(400).json({message:"Inavlaid Credentials"});
    }
console.log(process?.env?.SECRET);
    const decoded=jwt.verify(token,process.env.SECRET);

    if(!decoded){
        return res.status(400).json({message:"Inavlaid Credentials"});
    }

    const user=await User.findById(decoded.userid).select("-password");

    if(!user){
        return res.status(400).json({message:"user not found"});
    }

    req.user=user;
    next();
}catch(error){
    console.log("error in authmiddleware",error);
    return res.status(500).json({message:"Internal server error"});
}
}