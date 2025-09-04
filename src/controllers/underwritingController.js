// controllers/underwritingController.js
import Loan from "../models/Loan.js";

export const underwriteLoan = async (req, res) => {
  try {
    const { loanId } = req.params;

    const loan = await Loan.findById(loanId).populate("userId");
    if (!loan) return res.status(404).json({ error: "Loan not found" });

    // --- Simple AI underwriting logic ---
    let decision = "Pending";
    let score = 0;
    let reasons = [];

    // Rule 1: Check monthly income
    if (loan.monthlyIncome < 15000) {
      decision = "Rejected";
      score = 20;
      reasons.push("Monthly income too low");
    } else if (loan.monthlyIncome >= 15000 && loan.monthlyIncome < 50000) {
      decision = "Pending";
      score = 60;
      reasons.push("Moderate income - needs further review");
    } else if (loan.monthlyIncome >= 50000) {
      decision = "Approved";
      score = 90;
      reasons.push("High income");
    }

    // Rule 2: Check PAN/Aadhaar presence
    if (!loan.pan && !loan.aadhaar) {
      decision = "Rejected";
      score = 0;
      reasons.push("Missing PAN/Aadhaar");
    }

    // Update loan with underwriting results
    loan.status = decision;
    loan.underwriting = {
      evaluatedAt: new Date(),
      score,
      decision,
      reasons
    };
    await loan.save();

    res.json({
      message: "Underwriting completed",
      loanId: loan._id,
      underwriting: loan.underwriting
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
