// controllers/underwritingController.js
import Loan from "../models/Loan.js";

export const underwriteLoan = async (req, res) => {
  try {
    const { loanId } = req.params;

    const loan = await Loan.findById(loanId).populate("userId");
    if (!loan) return res.status(404).json({ error: "Loan not found" });

    let decision = "rejected";
    let score = 100;
    let reasons = [];

    // Rule 1: PAN/Aadhaar check
    if (!loan.pan && !loan.aadhaar) {
      decision = "rejected";
      score = 0;
      reasons.push("Neither PAN nor Aadhaar provided.");
    } 
    else if (loan.monthlyIncome < 15000) {
      // Rule 2: Income too low
      decision = "rejected";
      score = 20;
      reasons.push("Monthly income too low (< ₹15,000).");
    } 
    else if (loan.amount > loan.monthlyIncome * 20) {
      // Rule 3: Loan-to-income ratio too high
      decision = "rejected";
      score = 30;
      reasons.push("Requested loan amount too high vs income (>20×).");
    } 
    else {
      // ✅ Approve if none of the above triggered
      decision = "approved";
      score = 90;
      reasons.push("Income and loan amount are within acceptable limits.");
    }

    loan.status = decision;
    await loan.save();

    res.json({
      message: "Underwriting completed",
      loanId: loan._id,
      decision,
      score,
      reasons,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
