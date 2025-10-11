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
    let expenseObj = Object.fromEntries(formData.entries());

    // Remove commas and ensure number
    expenseObj.expenseAmount = Number(expenseAmount.replace(/,/g, ""));

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/expense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(expenseObj),
      });

      const newExpense = await res.json();

      onAddExpense({
        id: newExpense.id,
        date: new Date(newExpense.date).toISOString().split("T")[0],
        description: newExpense.category,
        amount: Number(newExpense.amount),
        currency: "₦",
        category: newExpense.category,
        type: "expense",
      });

      e.target.reset();
      setExpenseAmount("");
      setOpen(false);
    } catch (error) {
      console.error("Failed to add expense", error);
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
            className="border p-2 rounded"
            value={expenseAmount}
            onChange={(e) => {
              let raw = e.target.value.replace(/,/g, "");
              if (/^\d*\.?\d*$/.test(raw)) {
                const formatted = raw.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                setExpenseAmount(formatted);
              }
            }}
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
            className="border p-2 rounded"
            defaultValue=""
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
