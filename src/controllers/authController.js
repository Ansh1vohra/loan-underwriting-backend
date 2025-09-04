import User from "../models/User.js";
import { sendOTP } from "../services/mailServices.js";
import jwt from "jsonwebtoken";

// Generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Step 1: Send OTP
export const sendOtpController = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    let user = await User.findOne({ email });
    if (!user) user = await User.create({ email });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 min expiry
    await user.save();

    try {
      await sendOTP(email, otp);
      res.json({ message: "OTP sent to email" });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Remove the OTP from user if email fails
      user.otp = undefined;
      user.otpExpiry = undefined;
      await user.save();
      res.status(500).json({ error: "Failed to send OTP email. Please try again." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Step 2: Verify OTP & Generate JWT
export const verifyOtpController = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.json({ message: "Sign in successful", token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
