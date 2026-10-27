import express from "express";
import bcrypt from "bcrypt";

export async function passwordEncryptionMiddleware(req,resp,next){
   try{
      const { auth } = req.body;
      if(auth == "local"){
         const { password } = req.body;
         const salt = await bcrypt.genSalt(10);
         const hashedPassword = await bcrypt.hash(password,salt);
         req.body.password = hashedPassword;
      }
      next();
   }catch(error){
       console.log("Error in Passowrd Hashing Middleware : ", error); 
   } 
}