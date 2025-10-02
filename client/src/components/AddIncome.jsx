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

export function AddIncomeComponent({ onAddIncome }) {
  const [open, setOpen] = useState(false);
  const [incomeAmount, setIncomeAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    let incomeObj = Object.fromEntries(formData.entries());
    incomeObj.incomeAmount = incomeAmount.replace(/,/g, ""); // remove commas
    onAddIncome(incomeObj);
    e.target.reset();
    setIncomeAmount("");
    setOpen(false);
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
              let raw = e.target.value.replace(/,/g, "");
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
