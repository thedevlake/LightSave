import express from "express";
import { prisma } from "../db.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

const router = express.Router();

// POST new expense
// POST new expense
// POST new expense (debug version)
router.post("/", authenticateToken, async (req, res) => {
  console.log("Received expense payload:", req.body);
  try {
    const {
      expenseName,
      expenseAmount,
      expenseDate,
      expenseCategory,
      currency,
    } = req.body;

    // Validate fields
    if (!expenseName || !expenseAmount || !expenseDate || !expenseCategory) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const parsedAmount = parseFloat(expenseAmount);
    const parsedDate = new Date(expenseDate);

    if (isNaN(parsedAmount) || isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: "Invalid amount or date" });
    }

    const newExpense = await prisma.expense.create({
      data: {
        userId: req.user.id,
        name: expenseName,
        category: expenseCategory,
        amount: parsedAmount,
        date: parsedDate,
      },
    });

    res.status(201).json({
      id: newExpense.id,
      date: newExpense.date,
      description: expenseName,
      category: newExpense.category,
      amount: newExpense.amount,
      currency: newExpense.currency,
      type: "expense",
    });
  } catch (err) {
    console.error("POST /expense error:", err);
    res
      .status(500)
      .json({ message: "Failed to add expense", error: err.message });
  }
});

export default router;
