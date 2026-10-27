import mongoose from "mongoose";

const pendingUsersSchema = new mongoose.Schema({
   email:{
      type:String,
      required:true
   },
   password:{
      type:String,
      required:true
   },
   otp:{
      type:String,
      required:true
   },
   createdAt:{
       type : Date,
       default : Date.now,
       expires : 300
   } 
});


const pendingUsersModel = mongoose.models.PendingUsers || mongoose.model("PendingUsers", pendingUsersSchema);

export default pendingUsersModel;