// routes/income.js
import express from "express";
import { prisma } from "../db.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

const router = express.Router();

// POST new income
router.post("/", authenticateToken, async (req, res) => {
  try {
    // Make sure user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const {
      incomeSourceName,
      incomeAmount,
      incomeDate,
      incomeCategory,
      currency,
    } = req.body;

    // Validate required fields
    if (!incomeSourceName || !incomeAmount || !incomeDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate amount
    const amount = parseFloat(incomeAmount);
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Invalid income amount" });
    }

    // Validate date
    const parsedDate = new Date(incomeDate);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    // Create income record
    const newIncome = await prisma.income.create({
      data: {
        source: incomeSourceName,
        amount,
        date: parsedDate,
        category: incomeCategory || "Income",
        currency: currency || "₦",
        userId: req.user.id,
      },
    });
    res.status(201).json({
      id: newIncome.id,
      date: newIncome.date,
      description: newIncome.source,
      category: newIncome.category,
      amount: newIncome.amount,
      currency: newIncome.currency,
      type: "income",
    });
  } catch (err) {
    console.error("Error in POST /income:", err);
    res.status(500).json({ message: err.message || "Failed to add income" });
  }
});

export default router;
