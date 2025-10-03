// routes/settings.js
import { createFileRoute, redirect } from "@tanstack/react-router";
import SettingsPage from "@/pages/SettingsPage.jsx";
import { isAuthenticated } from "@/utils/auth";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: "/login" });
    }
  },
});
