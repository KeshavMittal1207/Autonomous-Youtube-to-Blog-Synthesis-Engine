import feedbackModel from "../model/feedbackModel.js";
import { transport } from "../service/nodemailerService.js";

export async function feedbackController(req,resp){
   try{
      const feedbackData = req.body;
      console.log(feedbackData);
      const result = await feedbackModel.create(feedbackData);
      if(result){
         const mailOptions = {
            from : feedbackData.email,
            to : "priyanshuparashar108@gmail.com",
            subject : `Feedback in concern of Autonomous Youtube to Blog Synthesis Engine raised by ${feedbackData.name}`,
            text : feedbackData.message 
         };
         
         transport.sendMail(mailOptions,(error)=>{
            if(error)
            return resp.status(500).send({message:error,success:false});
         
            return resp.status(200).send({message:"Feedback Sent Successfully",success:true});
         });
      }
      else
      return resp.status(400).send({message:"Feedback Not Sent",success:false});
   }catch(error){
      return resp.status(500).send({message:error,success:false});
   } 
} 