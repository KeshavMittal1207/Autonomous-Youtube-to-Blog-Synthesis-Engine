import express from "express";
import { feedbackController } from "../controllers/feedbackController.js";
import { jwtVerifyMiddleware } from "../middlewares/jwtVerifyMiddleware.js";

const feedbackRoute = express.Router();

feedbackRoute.post("/feedback",jwtVerifyMiddleware,feedbackController);

export default feedbackRoute;