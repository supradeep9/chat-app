import jwt from "jsonwebtoken";

export default function generateToken(userid,res){
    
   
const token=jwt.sign({userid},process.env.SECRET,{
    expiresIn:"7d"
});
console.log("generating token",userid);
res.cookie("jwt",token,{
    maxAge:7*24*60*60*1000,
    httpOnly:true,
    sameSite:"strict",
    secure:process.env.NODE_ENV==="development"? false:true,
});
   
return token
}