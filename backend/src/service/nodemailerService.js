import nodemailer from "nodemailer";

export const transport = nodemailer.createTransport({
    service:"gmail",
    auth:{
       user:process.env.NODEMAILER_USER,
       pass:process.env.NODEMAILER_PASS
    } 
});
