import multer from "multer";

const storage = multer.diskStorage({
   destination: function(req,file,cb){
        cb(null,"./src/uploads/profile-picture");
   }, 
   filename: function(req,file,cb){
       cb(null,file.originalname);
   }
});

export const profileUpload = multer({storage});