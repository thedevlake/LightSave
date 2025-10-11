import React, { useState, useEffect } from "react";
import TransactionPage from "../pages/TransactionPage";
import { AddIncomeComponent } from "./AddIncome";
import { AddExpenseComponent } from "./AddExpenses";

const TransactionsManager = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/transactions`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch transactions");
        const data = await res.json();

        setTransactions(data.allTransactions || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTransactions();
  }, []);

  const handleAddIncome = (newIncome) => {
    setTransactions((prev) => [newIncome, ...prev]);
  };

  const handleAddExpense = (newExpense) => {
    setTransactions((prev) => [newExpense, ...prev]);
  };

  return (
    <div>
      <AddIncomeComponent onAddIncome={handleAddIncome} />
      <AddExpenseComponent onAddExpense={handleAddExpense} />
      <TransactionPage transactions={transactions} />
    </div>
  );
};

export default TransactionsManager;
