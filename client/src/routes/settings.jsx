import React from "react";
import { createFileRoute } from "@tanstack/react-router";

const SettingsPage = React.lazy(() => import("../pages/SettingsPage"));

export const Route = createFileRoute("/settings")({
  component: () => (
    <React.Suspense fallback={null}>
      <SettingsPage />
    </React.Suspense>
  ),
});
