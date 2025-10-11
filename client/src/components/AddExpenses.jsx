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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const expenseName = formData.get("expenseName");
    const expenseDate = formData.get("expenseDate");
    const expenseCategory = formData.get("expenseCategory");
    const rawAmount = expenseAmount.replace(/,/g, "");

    // ✅ validate before sending
    if (!expenseName || !expenseDate || !expenseCategory || !rawAmount) {
      alert("Please fill in all fields correctly");
      return;
    }

    const amount = parseFloat(rawAmount);
    if (isNaN(amount)) {
      alert("Invalid amount entered");
      return;
    }

    const payload = {
      expenseName,
      amount,
      date: expenseDate, // already YYYY-MM-DD
      category: expenseCategory,
      currency: "₦",
    };

    try {
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
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <div className="flex items-center gap-2 cursor-pointer">
              <IconCirclePlusFilled className="w-5 h-5" />
              <span>Add Expense</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <input
            type="text"
            name="expenseName"
            placeholder="Expense Name"
            required
            className="border p-2 rounded"
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
                setExpenseAmount(raw.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
              }
            }}
            className="border p-2 rounded"
          />

          <input
            type="date"
            name="expenseDate"
            required
            className="border p-2 rounded"
          />

          <select
            name="expenseCategory"
            required
            defaultValue=""
            className="border p-2 rounded"
          >
            <option value="" disabled>
              Select Category
            </option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Shopping">Shopping</option>
            <option value="Other">Other</option>
          </select>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
