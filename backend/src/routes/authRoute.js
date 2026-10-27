import express from "express";
import { loginController, signUpController, verificationController } from "../controllers/authController.js";
import { passwordEncryptionMiddleware } from "../middlewares/passwordEncryptionMiddleware.js";

const authRoute = express.Router();

authRoute.post("/signup",passwordEncryptionMiddleware,verificationController);
authRoute.post("/otp-verification",signUpController);
authRoute.post("/login",loginController);
export default authRoute;