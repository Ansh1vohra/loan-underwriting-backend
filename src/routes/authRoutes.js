import express from "express";
import { sendOtpController, verifyOtpController } from "../controllers/authController.js";

const router = express.Router();

// Email OTP routes
router.post("/send-otp", sendOtpController);
router.post("/verify-otp", verifyOtpController);

// Google Sign-In will be added next
export default router;
