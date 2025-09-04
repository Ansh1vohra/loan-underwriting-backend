import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String },
    googleId: { type: String }, // for Google Sign-in
    otp: { type: String }, // store latest OTP
    otpExpiry: { type: Date },
    pan: { type: String },
    aadhaar: { type: String },
    monthlyIncome: { type: Number },
    bankAccount: { type: String }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
