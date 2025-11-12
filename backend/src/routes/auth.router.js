import express from "express";
import { login, logout, signup,updateProfile } from "../controllers/auth.controllers.js";
import  protect  from "../middlewares/auth.middleware.js";
import { arcjetProtection } from "../middlewares/arcjet.middleware.js";
const router=express.Router();

//router.use(arcjetProtection);
router.post("/signup",signup);

router.post("/login",login);

router.post("/logout",logout);

router.put("/update-profile",protect,updateProfile);

router.get("/check",protect,(req,res)=>res.status(200).json(req.user))

export default router;