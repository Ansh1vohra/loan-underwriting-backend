import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import loanRoutes from "./routes/loanRoutes.js";
import underwritingRoutes from "./routes/underwritingRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

// Middleware
app.use(express.json()); // parse JSON requests
app.use(cors()); // enable CORS for all routes

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/loan", loanRoutes);
app.use("/api/underwriting", underwritingRoutes);
app.use("/api/user", userRoutes);

export default app;
