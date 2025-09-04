import express from "express";
import { applyLoan, getUserLoans } from "../controllers/loanController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/apply", authMiddleware, applyLoan);
router.get("/my-applications", authMiddleware, getUserLoans);

export default router;
