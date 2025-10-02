import { createFileRoute } from "@tanstack/react-router";
import AddExpense from "@/pages/AddExpense";

export const Route = createFileRoute("/addExpense")({
  component: AddExpense,
});
