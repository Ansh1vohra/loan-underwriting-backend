// models/Loan.js
import mongoose from "mongoose";

const underwritingSchema = new mongoose.Schema({
  evaluatedAt: { type: Date, default: Date.now },
  score: { type: Number },
  decision: { type: String, enum: ["Approved", "Rejected", "Pending"] },
  reasons: [{ type: String }]
});

const loanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  pan: { type: String },
  aadhaar: { type: String },
  amount: { type: Number, required: true },
  loanType: { type: String, enum: ["Personal", "Home", "Car", "Education", "Business"], required: true },
  monthlyIncome: { type: Number, required: true },
  purpose: { type: String, required: true },
  bankAccount: { type: String, required: true },
  status: { type: String, enum: ["Applied", "Approved", "Rejected","Pending"], default: "Applied" },
  underwriting: underwritingSchema, 
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Loan", loanSchema);
