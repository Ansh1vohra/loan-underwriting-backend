// controllers/underwritingController.js
import Loan from "../models/Loan.js";

export const underwriteLoan = async (req, res) => {
  try {
    const { loanId } = req.params;

    const loan = await Loan.findById(loanId).populate("userId");
    if (!loan) return res.status(404).json({ error: "Loan not found" });

    let decision = "Pending";
    let score = 0;
    let reasons = [];

    // Rule 1: Check monthly income
    if (loan.monthlyIncome < 15000) {
      decision = "Rejected";
      score = 20;
      reasons.push("Monthly income too low (< ₹15,000).");
    } else if (loan.monthlyIncome >= 15000 && loan.monthlyIncome < 50000) {
      decision = "Pending";
      score = 60;
      reasons.push("Moderate income, further review required.");
    } else if (loan.monthlyIncome >= 50000) {
      decision = "Approved";
      score = 90;
      reasons.push("High monthly income (≥ ₹50,000).");
    }

    // Rule 2: Check PAN/Aadhaar presence
    if (!loan.pan && !loan.aadhaar) {
      decision = "Rejected";
      score = 0;
      reasons.push("Neither PAN nor Aadhaar provided.");
    }

    loan.status = decision;
    await loan.save();

    res.json({
      message: "Underwriting completed",
      loanId: loan._id,
      decision,
      score,
      reasons,  // ✅ Always include reasons
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
