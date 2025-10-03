import * as React from "react";
import {
  IconListDetails,
  IconUsers,
  IconSettings,
  IconHelp,
  IconSearch,
  IconBell,
  IconTransfer,
  IconUser,
  IconCirclePlusFilled,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { AddIncomeComponent } from "./AddIncome";
import { AddExpenseComponent } from "./AddExpenses";
import { Link } from "@tanstack/react-router";
import { hover } from "framer-motion";

const data = {
  navMain: [
    { title: "Savings", url: "#", icon: IconListDetails },
    { title: "Accounts", url: "#", icon: IconUsers },
  ],
  quickActions: [
    // { title: "Add Expense", url: "/addExpense", icon: IconCirclePlusFilled },
    { title: "Transfer Funds", url: "#", icon: IconTransfer },
  ],
  notifications: [{ title: "Alerts", url: "#", icon: IconBell }],
  navSecondary: [
    { title: "Settings", url: "/settings", icon: IconSettings },
    { title: "Support", url: "#", icon: IconHelp },
    { title: "Search", url: "#", icon: IconSearch },
  ],
};

// ✅ Accept onAddIncome from DashboardPage
export function AppSidebar({ onAddIncome, ...props }) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu className="list-none">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 text-[#0D9488]"
                  >
                    <path d="M12 2C6.48 2 2 3.79 2 6v2c0 2.21 4.48 4 10 4s10-1.79 10-4V6c0-2.21-4.48-4-10-4zm0 8c-5.52 0-10-1.79-10-4v4c0 2.21 4.48 4 10 4s10-1.79 10-4V6c0 2.21-4.48 4-10 4zm0 6c-5.52 0-10-1.79-10-4v4c0 2.21 4.48 4 10 4s10-1.79 10-4v-4c0 2.21-4.48 4-10 4z" />
                  </svg>
                  <span className="font-semibold text-base bg-gradient-to-r from-[#04520e] to-[#0D9488] dark:from-gray-200 dark:to-teal-400 bg-clip-text text-transparent hover:0">
                    LightSave
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="flex flex-col px-6">
        {/* Main Navigation */}
        <div className="flex flex-col text-left items-start gap-1 list-none">
          {data.navMain.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a href={item.url} className="flex items-center gap-2">
                  <item.icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col text-left items-start gap-1 list-none mt-4">
          <h3 className="text-xs text-gray-500 uppercase mb-1">
            Quick Actions
          </h3>

          {/* ✅ Add Income now uses the prop from DashboardPage */}
          <AddIncomeComponent onAddIncome={onAddIncome} />
          <AddExpenseComponent onAddExpense={props.onAddExpense} />

          {data.quickActions.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link href={item.url} className="flex items-center gap-2">
                  <item.icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </div>

        {/* Notifications */}
        <div className="flex flex-col text-left items-start gap-1 list-none mt-4">
          <h3 className="text-xs text-gray-500 uppercase mb-1">
            Notifications
          </h3>
          {data.notifications.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a href={item.url} className="flex items-center gap-2">
                  <item.icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </div>

        {/* Secondary Navigation */}
        <div className="mt-auto flex flex-col text-left items-start gap-1 list-none">
          <NavSecondary items={data.navSecondary} />
        </div>
      </SidebarContent>

      {/* Footer with Profile & Logout */}
      <SidebarFooter>
        <Button
          onClick={handleLogout}
          className="w-full mt-2 text-white transition bg-gradient-to-r from-green-700 to-teal-900 hover:from-teal-900 hover:to-teal-600"
        >
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
