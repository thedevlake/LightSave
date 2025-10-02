import { createFileRoute } from "@tanstack/react-router";
import SavingGoals from "@/pages/SavingGoals";

export const Route = createFileRoute("/SavingGoals")({
  component: SavingGoals,
});
