import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { IconCirclePlusFilled } from "@tabler/icons-react";

export function AddExpenseComponent({ onAddExpense }) {
  const [open, setOpen] = useState(false);
  const [expenseAmount, setExpenseAmount] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const expenseName = formData.get("expenseName");
    const expenseDate = formData.get("expenseDate");
    const expenseCategory = formData.get("expenseCategory");
    const rawAmount = expenseAmount.replace(/,/g, "");

    if (!expenseName || !expenseDate || !expenseCategory || !rawAmount) {
      alert("Please fill in all fields correctly");
      return;
    }

    const expenseAmountNumber = parseFloat(rawAmount);
    if (isNaN(expenseAmountNumber) || expenseAmountNumber <= 0) {
      alert("Invalid amount entered");
      return;
    }

    const payload = {
      expenseName,
      expenseAmount: expenseAmountNumber,
      expenseDate,
      expenseCategory,
    };

    try {
      setIsSaving(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token missing");

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/expense`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const response = await res.json();
      if (!res.ok) throw new Error(response.message || "Failed to add expense");

      onAddExpense({
        id: response.id,
        date: new Date(response.date).toLocaleDateString(),
        description: response.description,
        category: response.category,
        amount: response.amount,
        currency: response.currency,
        type: "expense",
      });

      e.target.reset();
      setExpenseAmount("");
      setOpen(false);
    } catch (err) {
      console.error("Failed to add expense:", err);
      alert("Error adding expense: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass =
    "w-full p-3 rounded-lg border border-white/30 dark:border-white/20 backdrop-blur-md bg-white/40 dark:bg-white/10 text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400/70 shadow-md transition-all";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <div className="flex items-center gap-2 cursor-pointer">
              <IconCirclePlusFilled className="w-5 h-5 text-red-900" />
              <span className="font-semibold text-red-900">Add Expense</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md w-full">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800 dark:text-white">
            Add Expense
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="backdrop-blur-xl bg-white/40 dark:bg-white/10 shadow-lg dark:shadow-md rounded-xl p-6 grid gap-4 transition-all"
        >
          <fieldset disabled={isSaving} className="grid gap-4">
            <input
              type="text"
              name="expenseName"
              placeholder="Expense Name"
              required
              className={inputClass}
            />
            <input
              type="text"
              name="expenseAmount"
              placeholder="Amount"
              required
              value={expenseAmount}
              onChange={(e) => {
                const raw = e.target.value.replace(/,/g, "");
                if (/^\d*\.?\d*$/.test(raw)) {
                  const formatted = raw.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                  setExpenseAmount(formatted);
                }
              }}
              className={inputClass}
            />
            <input
              type="date"
              name="expenseDate"
              placeholder="YYYY-MM-DD"
              required
              className={inputClass}
            />
            <select
              name="expenseCategory"
              required
              defaultValue=""
              className={inputClass}
            >
              <option value="" disabled>
                Select Category
              </option>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Shopping">Shopping</option>
              <option value="Other">Other</option>
            </select>
          </fieldset>

          <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-2">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={isSaving}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto"
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
