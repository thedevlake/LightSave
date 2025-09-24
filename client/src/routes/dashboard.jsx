// routes/dashboard.js
import { createFileRoute, redirect } from "@tanstack/react-router";
import DashboardPage from "@/pages/DashboardPage.jsx";
import { isAuthenticated } from "@/utils/auth";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
  beforeLoad: () => {
    if (!isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
});
