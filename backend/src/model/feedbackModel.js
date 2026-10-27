import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
   email:{
       type:String,
       required:true,
   },
   name:{
       type:String,
       required:true,
   },
   message:{
       type:String,
       required:true
   }
});

const feedbackModel = mongoose.model("Feedback",feedbackSchema);

export default feedbackModel;