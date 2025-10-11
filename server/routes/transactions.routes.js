import express from "express";
import { prisma } from "../db.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

const router = express.Router();

// GET all transactions + totals
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const incomes = await prisma.income.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });

    const expenses = await prisma.expense.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });

    const allTransactions = [
      ...incomes.map((i) => ({
        id: i.id,
        date: i.date,
        description: i.source,
        category: i.category,
        amount: i.amount,
        currency: i.currency,
        type: "income",
      })),
      ...expenses.map((e) => ({
        id: e.id,
        date: e.date,
        description: e.category,
        category: e.category,
        amount: e.amount,
        currency: "₦",
        type: "expense",
      })),
    ];

    allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const currentBalance = totalIncome - totalExpenses;

    res.json({ allTransactions, totalIncome, totalExpenses, currentBalance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
});

export default router;
