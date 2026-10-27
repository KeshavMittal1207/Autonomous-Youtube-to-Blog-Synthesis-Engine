import jwt from "jsonwebtoken";

export function jwtVerifyMiddleware(req,resp,next){
   try{
      const { token } = req.cookies;
      const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
      jwt.verify(token,JWT_SECRET_KEY,{expiresIn:"10d"},(error)=>{
         if(error)
         return resp.status(404).send({message:"Unauthorized User",success:false});
         next();   
      })
   }catch(error){
       console.log("Error Catched",error);
       return resp.status(500).send({message:error,success:false});  
   } 
}