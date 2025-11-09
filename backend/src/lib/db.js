import mongoose from "mongoose";

export  const connectDB=async()=>{
    try{
   const conn= await mongoose.connect(process.env.MONGO_URL);
    console.log("db connectd sucessfully",conn.connection.host);
    }catch(error){
        console.error("error connectiong to mongodb",error);
        process.exit(1);
    }
}