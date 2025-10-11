import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { IconCirclePlusFilled } from "@tabler/icons-react";

export function AddIncomeComponent({ onAddIncome }) {
  const [open, setOpen] = useState(false);
  const [incomeAmount, setIncomeAmount] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    const amount = parseFloat(incomeAmount.replace(/,/g, ""));
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    const payload = {
      incomeSourceName: data.incomeSourceName,
      incomeAmount: amount,
      incomeDate: data.incomeDate,
      incomeCategory: data.incomeCategory,
      currency: data.currency,
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Authentication token is missing. Please log in.");
        return;
      }
      const res = await fetch("http://localhost:5050/income", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let errorMsg = "Failed to add income";
        try {
          const errorData = await res.json();
          if (errorData && errorData.message) {
            errorMsg = errorData.message;
          }
        } catch {
          // ignore JSON parsing errors
        }
        throw new Error(errorMsg);
      }

      const newIncome = await res.json();

      // Format date and amount for TransactionPage
      const formattedIncome = {
        id: newIncome.id,
        date: newIncome.date, // already valid ISO string
        description: newIncome.description,
        amount: newIncome.amount,
        category: newIncome.category,
        currency: newIncome.currency,
        type: "income",
      };

      onAddIncome(formattedIncome);

      e.target.reset();
      setIncomeAmount("");
      setOpen(false);
    } catch (err) {
      console.error("Error adding income:", err);
      alert("Error adding income: " + err.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <div className="flex items-center gap-2 cursor-pointer">
              <IconCirclePlusFilled className="w-5 h-5" />
              <span>Add Income</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Income</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new income entry.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <input
            type="text"
            name="incomeSourceName"
            placeholder="Source (e.g. Freelance)"
            required
            className="border p-2 rounded"
          />

          <input
            type="text"
            name="incomeAmount"
            placeholder="Amount"
            required
            className="border p-2 rounded"
            value={incomeAmount}
            onChange={(e) => {
              const raw = e.target.value.replace(/,/g, "");
              if (/^\d*\.?\d*$/.test(raw)) {
                const formatted = raw.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                setIncomeAmount(formatted);
              }
            }}
          />

          <input
            type="date"
            name="incomeDate"
            required
            className="border p-2 rounded"
          />

          <select
            name="currency"
            required
            className="border p-2 rounded"
            defaultValue=""
          >
            <option value="" disabled>
              Select Currency
            </option>
            <option value="₦">₦ Naira</option>
            <option value="$">$ Dollar</option>
            <option value="€">€ Euro</option>
          </select>

          <select
            name="incomeCategory"
            required
            className="border p-2 rounded"
            defaultValue=""
          >
            <option value="" disabled>
              Select Category
            </option>
            <option value="Salary">Salary</option>
            <option value="Gift">Gift</option>
            <option value="Business">Business</option>
            <option value="Other">Other</option>
          </select>

          <DialogFooter className="flex gap-2">
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
