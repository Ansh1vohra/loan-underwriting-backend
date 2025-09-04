import express from "express";
const router = express.Router();
import { underwriteLoan } from "../controllers/underwritingController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

router.post("/:loanId/underwrite", authMiddleware, underwriteLoan);

export default router;
