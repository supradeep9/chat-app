import { create } from "zustand";
import axiosInstance from "../lib/axios";
import useAuthStore from "./useAuthStore";

const useChatStore=create((set,get)=>({

allContacts:[],
chats:[],
messages:[],
activeTab:"chats",
selectedUser:null,
isUserLoading:false,
isMessagesLoading:false,
isSoundEnabled:localStorage.getItem("isSoundEnabled")===true,

toggleSound:()=>{
   
    localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
     set({isSoundEnabled:!get().isSoundEnabled});
},
setActiveTab:(tab)=>{
set({activeTab:tab})
},
setSelectedUser:(user)=>{
    set({selectedUser:user});
},

getAllContacts:async ()=>{
    set({isUserLoading:true});
    try{
    const res=await axiosInstance.get("/messages/contacts");
    set({allContacts:res.data});
    }catch(error){
        toast.error(error.response.data.message);
    }finally{
        set({isUserLoading:false});
    }
},
getMyChatPartners:async()=>{
    set({isUserLoading:true});
    try{
    const res=await axiosInstance.get("/messages/chats");
    set({chats:res.data})
    }catch(error){
      toast.error(error.response.data.message);
    }finally{
        set({isUserLoading:false});
    }
},

getMessagesByUserId:async(userId)=>{
   set({isMessagesLoading:true});  
    try{
    const res=await axiosInstance.get(`/messages/${userId}`);
    set({messages:res.data});
    }catch(error){
        toast.error(error.response?.data?.message);
    }finally{
        set({isMessagesLoading:false});
    }  
},
sendMessage:async (userMessage)=>{
    const {messages,selectedUser}=get();
       const { authUser } = useAuthStore.getState();

    const tempId = `temp-${Date.now()}`;

    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: userMessage.text,
      image: userMessage.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true, // flag to identify optimistic messages (optional)
    };
    // immidetaly update the ui by adding the message
    set({ messages: [...messages, optimisticMessage] });
    try {
     const res=await axiosInstance.post(`/messages/send/${selectedUser._id}`,userMessage);
     set({messages:messages.concat(res.data)});

    } catch (error) {
         set({ messages: messages });
      toast.error(error.response?.data?.message || "Something went wrong");
    }
}
})
)
export default useChatStore;