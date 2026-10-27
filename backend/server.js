import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, ".env") });
dotenv.config();

import express from "express";
import { dbConnection } from './src/config/dbConfig.js';
import authRoute from './src/routes/authRoute.js';
import cors from "cors";
import profileRoute from './src/routes/profileRoute.js';
import cookieParser from 'cookie-parser';
import feedbackRoute from './src/routes/feedbackRoute.js';
import blogRoute from './src/routes/blogRoute.js';

const app = express();
const PORT = process.env.PORT || 4800;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || origin === FRONTEND_URL || origin.startsWith("http://localhost")) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true
}));

await dbConnection();

app.use(express.json());
app.use(cookieParser());

// Base health route
app.get("/health", (req, res) => {
  res.json({ status: "healthy", service: "backend" });
});

// App Routes
app.use(authRoute);
app.use(profileRoute);
app.use(feedbackRoute);
app.use(blogRoute);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
