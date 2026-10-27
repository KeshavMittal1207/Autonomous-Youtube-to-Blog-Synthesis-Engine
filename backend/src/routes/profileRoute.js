import express from "express";
import { jwtVerifyMiddleware } from "../middlewares/jwtVerifyMiddleware.js";
import { editProfileController, profileController } from "../controllers/profileController.js";
import { profileUpload } from "../config/multerConfig.js";

const profileRoute = express.Router();

profileRoute.get("/profile/:email",jwtVerifyMiddleware,profileController);
profileRoute.patch("/edit-profile/:email",jwtVerifyMiddleware,profileUpload.single("profilePic"),editProfileController)
export default profileRoute;