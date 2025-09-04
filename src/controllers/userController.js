import User from "../models/User.js";

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const { userId } = req.user; // Extracted from JWT middleware
    const { pan, aadhaar, monthlyIncome, bankAccount } = req.body;

    if (!pan && !aadhaar) {
      return res.status(400).json({ error: "Either PAN or Aadhaar is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { pan, aadhaar, monthlyIncome, bankAccount },
      { new: true }
    );

    res.json({ message: "Profile updated", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
