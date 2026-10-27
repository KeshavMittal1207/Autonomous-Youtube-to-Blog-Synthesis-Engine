import express from "express";
import {
  generateBlogProxy,
  resumeWorkflowProxy,
  saveBlogHistory,
  getUserHistory,
  deleteUserHistory,
} from "../controllers/blogController.js";

const blogRoute = express.Router();

blogRoute.post("/api/blog/generate", generateBlogProxy);
blogRoute.post("/api/blog/resume", resumeWorkflowProxy);
blogRoute.post("/api/blog/save", saveBlogHistory);
blogRoute.get("/api/blog/history/:email", getUserHistory);
blogRoute.delete("/api/blog/history/:id", deleteUserHistory);

export default blogRoute;
