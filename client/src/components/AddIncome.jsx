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
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    const amount = parseFloat(incomeAmount.replace(/,/g, ""));
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount");
      setIsSaving(false);
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
        setIsSaving(false);
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

      const formattedIncome = {
        id: newIncome.id,
        date: newIncome.date,
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
              <IconCirclePlusFilled className="w-5 h-5 text-green-900" />
              <span className="font-semibold text-green-900">Add Income</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md w-full">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800 dark:text-white">
            Add Income
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 dark:text-gray-300">
            Fill in the details below to add a new income entry.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="backdrop-blur-xl bg-white/40 dark:bg-white/10 shadow-lg dark:shadow-md rounded-xl p-6 grid gap-4 transition-all"
        >
          <fieldset disabled={isSaving} className="grid gap-4">
            <input
              type="text"
              name="incomeSourceName"
              placeholder="Source (e.g. Freelance)"
              required
              className={inputClass}
            />
            <input
              type="text"
              name="incomeAmount"
              placeholder="Amount"
              required
              value={incomeAmount}
              onChange={(e) => {
                const raw = e.target.value.replace(/,/g, "");
                if (/^\d*\.?\d*$/.test(raw)) {
                  const formatted = raw.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                  setIncomeAmount(formatted);
                }
              }}
              className={inputClass}
            />
            <input
              type="date"
              name="incomeDate"
              placeholder="YYYY-MM-DD"
              required
              className={inputClass}
            />
            <select
              name="currency"
              required
              defaultValue=""
              className={inputClass}
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
              defaultValue=""
              className={inputClass}
            >
              <option value="" disabled>
                Select Category
              </option>
              <option value="Salary">Salary</option>
              <option value="Gift">Gift</option>
              <option value="Business">Business</option>
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
