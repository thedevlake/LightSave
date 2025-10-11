import React, { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";
import { SectionCards } from "@/components/section-cards";
import Expenses from "./Expenses";
import TransactionPage from "./TransactionPage";
import { AddIncomeComponent } from "../components/AddIncome";

function DashboardPage() {
  const [transactions, setTransactions] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5050/income", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const all = data.allTransactions || [];

      setTransactions(all);

      setTotalIncome(
        all
          .filter((t) => t.type === "income")
          .reduce((sum, t) => sum + t.amount, 0)
      );
      setTotalExpenses(
        all
          .filter((t) => t.type === "expense")
          .reduce((sum, t) => sum + t.amount, 0)
      );
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const addIncome = (income) => {
    setTransactions((prev) => [income, ...prev]);
    setTotalIncome((prev) => prev + Number(income.amount));
  };

  const addExpense = (expense) => {
    setTransactions((prev) => [expense, ...prev]);
    setTotalExpenses((prev) => prev + Number(expense.amount));
  };

  return (
    <div className="transition-all duration-700 ease-in-out">
      <SidebarProvider
        style={{
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        }}
      >
        <AppSidebar onAddIncome={addIncome} onAddExpense={addExpense} />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 md:gap-6 md:py-6 px-4 lg:px-6 py-4">
                <SectionCards
                  totalIncome={totalIncome}
                  totalExpenses={totalExpenses}
                />
                <div className="px-4 lg:px-6 py-4">
                  <Expenses onAddExpense={addExpense} />
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
