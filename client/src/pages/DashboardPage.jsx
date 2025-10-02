import React, { useState, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Expenses from "./Expenses";
import TransactionPage from "./TransactionPage";

function DashboardPage() {
  const [isVisible, setIsVisible] = useState(false);

  // State for all transactions (both income + expenses)
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  // ✅ Add income function
  const addIncome = (income) => {
    const newTransaction = {
      id: Date.now(),
      date: income.incomeDate,
      description: income.incomeSourceName,
      amount: parseFloat(income.incomeAmount),
      currency: income.currency,
      category: income.incomeCategory,
      type: "income",
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  // ✅ Add expense function
  // ✅ Add expense function
  const addExpense = (expense) => {
    const newTransaction = {
      id: Date.now(),
      date: expense.expenseDate, // match AddExpenseComponent
      description: expense.expenseName, // what you spent on
      amount: parseFloat(expense.expenseAmount),
      currency: expense.currency,
      category: expense.expenseCategory,
      type: "expense",
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  // ✅ Calculate totals
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  return (
    <div
      className={`transition-all duration-700 ease-in-out ${
        isVisible ? "opacity-100" : "opacity-50"
      }`}
    >
      <SidebarProvider
        style={{
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        }}
      >
        {/* ✅ Pass addIncome + addExpense into AppSidebar or related components */}
        <AppSidebar
          variant="inset"
          onAddIncome={addIncome}
          onAddExpense={addExpense}
        />

        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 md:gap-6 md:py-6 px-4 lg:px-6 py-4">
                {/* ✅ Pass totalIncome + totalExpenses */}
                <SectionCards
                  totalIncome={totalIncome}
                  totalExpenses={totalExpenses}
                />

                {/* Expenses Page (you can pass addExpense if needed) */}
                <div className="px-4 lg:px-6 py-4">
                  <Expenses onAddExpense={addExpense} />
                </div>

                {/* Transactions */}
                <div>
                  <TransactionPage transactions={transactions} />
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

export default DashboardPage;
