import express from "express";
import { prisma } from "../db.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

const router = express.Router();

// GET all expenses (optional)
router.get("/", authenticateToken, async (req, res) => {
  try {
    const expenses = await prisma.expense.findMany({
      where: { userId: req.user.id },
      orderBy: { date: "desc" },
    });
    res.json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch expenses" });
  }
});

// POST new expense
router.post("/", authenticateToken, async (req, res) => {
  const { expenseName, expenseAmount, expenseDate, expenseCategory } = req.body;

  try {
    const newExpense = await prisma.expense.create({
      data: {
        userId: req.user.id,
        category: expenseCategory,
        amount: parseFloat(expenseAmount),
        date: new Date(expenseDate),
      },
    });

    // Return in the "transaction" format
    const formattedExpense = {
      id: newExpense.id,
      date: newExpense.date,
      description: expenseName,
      category: expenseCategory,
      amount: newExpense.amount,
      currency: "₦",
      type: "expense",
    };

    res.status(201).json(formattedExpense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add expense" });
  }
});

export default router;
