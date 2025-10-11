import React, { useState, useEffect } from "react";
import TransactionPage from "../pages/TransactionPage";
import { AddIncomeComponent } from "./AddIncome";

const TransactionsManager = () => {
  const [transactions, setTransactions] = useState([]);

  // Fetch existing transactions when component mounts
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5050/income", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch transactions");
        const data = await res.json();

        // Format data for TransactionPage
        const formatted = data.map((t) => ({
          id: t.id,
          date: t.date,
          description: t.description || t.incomeSourceName,
          category: t.category || t.incomeCategory,
          amount: t.amount || t.incomeAmount,
          currency: t.currency,
          type: "income",
        }));

        setTransactions(formatted);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTransactions();
  }, []);

  // Function to add new income to state
  const handleAddIncome = (newIncome) => {
    setTransactions((prev) => [newIncome, ...prev]);
  };

  return (
    <div>
      <AddIncomeComponent onAddIncome={handleAddIncome} />
      <TransactionPage transactions={transactions} />
    </div>
  );
};

export default TransactionsManager;
