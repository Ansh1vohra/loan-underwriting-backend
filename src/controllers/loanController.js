import Loan from "../models/Loan.js";
import User from "../models/User.js";

export const applyLoan = async (req, res) => {
  try {
    const { userId } = req.user; 
    const { pan, aadhaar, monthlyIncome, purpose, bankAccount, loanType } = req.body;

    if (!purpose || !monthlyIncome || !bankAccount || !loanType) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (!pan && !aadhaar) {
      return res.status(400).json({ error: "Either PAN or Aadhaar is required" });
    }

    const loan = await Loan.create({
      userId,
      pan,
      aadhaar,
      monthlyIncome,
      purpose,
      bankAccount,
      loanType
    });

    res.json({ message: "Loan application submitted", loan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Fetch all loan applications for logged-in user
export const getUserLoans = async (req, res) => {
  try {
    const { userId } = req.user;

    const loans = await Loan.find({ userId }).sort({ createdAt: -1 });

    res.json({ applications: loans });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

