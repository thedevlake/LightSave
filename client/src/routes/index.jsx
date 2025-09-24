// routes/index.jsx
import { createFileRoute } from "@tanstack/react-router";
import LoginPage from "@/pages/LoginPage.jsx";

export const Route = createFileRoute("/")({
  component: LoginPage,
});
