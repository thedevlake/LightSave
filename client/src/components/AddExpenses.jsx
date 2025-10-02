import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { SidebarMenuItem, SidebarMenuButton } from "./ui/sidebar";
import { IconCirclePlusFilled } from "@tabler/icons-react";

export function AddExpenseComponent({ onAddExpense }) {
  const [open, setOpen] = useState(false);
  const [expenseAmount, setExpenseAmount] = useState("");
  const [currency, setCurrency] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("");

  // Helper to format number with commas
  function formatNumberWithCommas(value) {
    // Remove all non-digit except .
    const num = value.replace(/,/g, "");
    if (num === "") return "";
    // Allow decimals
    const parts = num.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }

  const handleAmountChange = (e) => {
    const input = e.target.value;
    // Only allow numbers and optional decimal point
    const cleaned = input.replace(/[^0-9.]/g, "");
    // Prevent multiple decimals
    const valid =
      cleaned.split(".").length > 2
        ? cleaned.split(".").slice(0, 2).join(".")
        : cleaned;
    setExpenseAmount(formatNumberWithCommas(valid));
  };

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setExpenseCategory(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    // Override expenseAmount, currency, and expenseCategory with controlled states
    const entries = Object.fromEntries(formData.entries());
    entries.expenseAmount = expenseAmount.replace(/,/g, "");
    entries.currency = currency;
    entries.expenseCategory = expenseCategory;
    // ✅ send expense data to parent
    onAddExpense(entries);
    e.target.reset();
    setExpenseAmount("");
    setCurrency("");
    setExpenseCategory("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Sidebar menu trigger */}
      <DialogTrigger asChild>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <div className="flex items-center gap-2 cursor-pointer">
              <IconCirclePlusFilled className="w-5 h-5 text-red-600" />
              <span>Add Expense</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </DialogTrigger>

      {/* Dialog form */}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <input
            type="text"
            name="expenseName"
            placeholder="What did you spend on?"
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
            onChange={handleAmountChange}
            inputMode="decimal"
            autoComplete="off"
          />
          <input
            type="date"
            name="expenseDate"
            required
            className="border p-2 rounded"
          />
          <select
            name="currency"
            required
            className="border p-2 rounded"
            value={currency}
            onChange={handleCurrencyChange}
          >
            <option value="" disabled>
              Select Currency
            </option>
            <option value="₦">₦ Naira</option>
            <option value="$">$ Dollar</option>
            <option value="€">€ Euro</option>
          </select>
          <select
            name="expenseCategory"
            required
            className="border p-2 rounded"
            value={expenseCategory}
            onChange={handleCategoryChange}
          >
            <option value="" disabled>
              Select Category
            </option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Bills">Bills</option>
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
