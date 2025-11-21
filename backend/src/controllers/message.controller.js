import Message from "../models/Message.js";
import User from "../models/user.js";
 import cloudinary from "../lib/cloudinary.js"
import { getReceiverSocketId, io } from "../lib/socket.js";
export const getAllContacts=async (req,res)=>{

    try{
    const loginUserId=req.user.id;
    const filteredUsers=await User.find({_id:{$ne:loginUserId}}).select("-password");

    res.status(200).json(filteredUsers);
    }catch(error){
        console.log("error in get ll contacts",error);
        res.status(500).json({message:"internal server error"})
    }

   
}

export const getMessagesByUserId=async (req,res)=>{
try {
  const myId=req.user.id;
  const {id:userToChatId }=req.params;  
//   console.log("user to chat id",userToChatId);
//   console.log("my id",myId);

  const messages=await Message.find({$or:[{senderId:myId,receiverId:userToChatId},{senderId:userToChatId,receiverId:myId}]});
//   console.log("messages",messages);
  res.status(200).json(messages);
} catch (error) {
    console.log("Errr in getmessage router",error);
}
    
}

export const sendMessage=async (req,res)=>{
    try {
        const {text,image}=req.body;
    
    const {id:receiverId}=req.params;

    const senderId=req.user.id;

    if(!image && !text){
        return res.status(400).json({message:"Message content cannot be empty"});
    }
    if(senderId===String(receiverId)){
        return res.status(400).json({message:"You cannot send message to yourself"});
    }
   const isReceiverExist= await User.findById(receiverId);
   if(!isReceiverExist){
    return res.status(404).json({message:"Receiver not found"});
   }
    let imageUrl;

    if(image){
        const uploadresponse=await cloudinary.uploader.upload(image);
        imageUrl=uploadresponse.secure_url;
    }
    const newMessage=new Message({
        senderId,
        receiverId,
        text,
        image:imageUrl
    });

  

    await newMessage.save();

    const receiverSocketId=getReceiverSocketId(receiverId);
  if(receiverSocketId){
    io.to(receiverSocketId).emit("newMessage",newMessage)
  }
    res.status(201).json(newMessage);
    } catch (error) {
        console.log("error in send messagerute",error);
        res.status(500).json({message:"internal server Error"})
    }

   
}

export const getChatPartners=async (req,res)=>{

    try {
        const loggedInUserId=req.user.id;

        const messages=await Message.find({$or:[{senderId:loggedInUserId},{receiverId:loggedInUserId}]});

        const getChatPartnerIds=[...new Set(messages.map((msg)=>msg.senderId.toString()===loggedInUserId.toString()?msg.receiverId.toString():msg.senderId.toString()))];

        const chatPartners=await User.find({_id:{$in:getChatPartnerIds}}).select("-password");

        res.status(200).json(chatPartners);


    } catch (error) {
        console.log("error in get chat partners",error);
        res.status(500).json({message:"internal server error"});
    }


}
