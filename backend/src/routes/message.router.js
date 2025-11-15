
import express from "express";
import protect from "../middlewares/auth.middleware.js";
import { getAllContacts, getChatPartners, getMessagesByUserId, sendMessage } from "../controllers/message.controller.js";
import { arcjetProtection } from "../middlewares/arcjet.middleware.js";
const router=express.Router();
router.use(protect);
router.get("/contacts",getAllContacts);
router.get("/chats",getChatPartners);
router.get("/:id",getMessagesByUserId   );

router.post("/send/:id",protect,sendMessage); 

export default router;