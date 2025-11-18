import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.router.js";
import messageRouter from "./routes/message.router.js"
import path from "path";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors"


dotenv.config();
const app=express();

const  __dirname=path.resolve();

const PORT=process.env.PORT || 3000;


app.use(express.json());
app.use(cookieParser());

app.use(cors({origin:process.env.CLIENT_URL,credentials:true}))
app.use("/api/auth", authRoutes);
app.use("/api/messages",messageRouter);




if(process.env.NODE_ENV=="production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")));

    app.get("*",(_,res)=>{
        res.sendFile(path.join(__dirname,"../frontend/dist/index.html"))
    })
}
app.listen(PORT,()=>
    {
        connectDB();
        console.log("server has started")
    
    });