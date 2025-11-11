import {resendClient,sender} from "../lib/resend.js"
import { createWelcomeEmailTemplate } from "./emailTemplate.js"

export const sendWelcomeEmail = async (email,name,clientURL)=>{

    const {data,error}=await resendClient.emails.send({
        
        from:`${sender.name} <${sender.email}>`,
        to:email,
        subject:"Welcome to Chatify-app",
        html:createWelcomeEmailTemplate(name,clientURL)
    });

    if(error){
        console.log("Error sending welcome email",error);
        throw new Error("failed to send Email");
    }
    console.log("welcome email sent successfully",data);
}
