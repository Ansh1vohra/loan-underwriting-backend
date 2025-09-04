// controllers/underwritingController.js
import Loan from "../models/Loan.js";

export const underwriteLoan = async (req, res) => {
  try {
    const { loanId } = req.params;

    const loan = await Loan.findById(loanId).populate("userId");
    if (!loan) return res.status(404).json({ error: "Loan not found" });

    let decision = "Rejected";
    let score = 100;
    let reasons = [];

    // Rule 1: PAN/Aadhaar check
    if (!loan.pan && !loan.aadhaar) {
      decision = "Rejected";
      score = 0;
      reasons.push("Neither PAN nor Aadhaar provided.");
    } 
    else if (loan.monthlyIncome < 15000) {
      decision = "Rejected";
      score = 20;
      reasons.push("Monthly income too low (< ₹15,000).");
    } 
    else if (loan.amount > loan.monthlyIncome * 20) {
      decision = "Rejected";
      score = 30;
      reasons.push("Requested loan amount too high vs income (>20×).");
    } 
    else {
      decision = "Approved";
      score = 90;
      reasons.push("Income and loan amount are within acceptable limits.");
    }

    // ✅ Save underwriting details
    loan.status = decision;
    loan.underwriting = {
      evaluatedAt: new Date(),
      score,
      decision,
      reasons,
    };

    await loan.save();

    res.json({
      message: "Underwriting completed",
      loanId: loan._id,
      decision,
      score,
      reasons,
      underwriting: loan.underwriting,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
