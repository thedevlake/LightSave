import * as React from "react";
import {
  IconListDetails,
  IconUsers,
  IconSettings,
  IconHelp,
  IconSearch,
  IconBell,
  IconTransfer,
  IconCirclePlusFilled,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { AddIncomeComponent } from "./AddIncome";
import { AddExpenseComponent } from "./AddExpenses";
import { Link } from "@tanstack/react-router";

const data = {
  navMain: [
    {
      title: "Savings Goals",
      url: "/SavingGoals",
      icon: IconListDetails,
      isLink: true,
    },
    { title: "Accounts", url: "#", icon: IconUsers },
  ],
  quickActions: [{ title: "Transfer Funds", url: "#", icon: IconTransfer }],
  notifications: [{ title: "Alerts", url: "#", icon: IconBell }],
  navSecondary: [
    { title: "Settings", url: "/settings", icon: IconSettings },
    { title: "Support", url: "#", icon: IconHelp },
    { title: "Search", url: "#", icon: IconSearch },
  ],
};

export function AppSidebar({ onAddIncome, onAddExpense, ...props }) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            className="data-[slot=sidebar-menu-button]:!p-1.5"
          >
            <a href="#">
              <div className="flex items-center gap-2 ml-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 text-[#1d7f77]"
                >
                  <path d="M12 2C6.48 2 2 3.79 2 6v2c0 2.21 4.48 4 10 4s10-1.79 10-4V6c0-2.21-4.48-4-10-4zm0 8c-5.52 0-10-1.79-10-4v4c0 2.21 4.48 4 10 4s10-1.79 10-4V6c0 2.21-4.48 4-10 4zm0 6c-5.52 0-10-1.79-10-4v4c0 2.21 4.48 4 10 4s10-1.79 10-4v-4c0 2.21-4.48 4-10 4z" />
                </svg>
                <span className="font-semibold text-base bg-gradient-to-r from-[#04520e] to-[#63b8b1] dark:from-gray-100 dark:bg-[#727e7d] bg-clip-text text-transparent">
                  LightSave
                </span>
              </div>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarHeader>

      <SidebarContent className="flex flex-col px-6">
        {/* Main Navigation */}
        <div className="flex flex-col text-left items-start gap-1 list-none">
          <NavMain items={data.navMain} />
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col text-left items-start gap-1 list-none mt-4">
          <h3 className="text-xs text-gray-500 uppercase mb-1">
            Quick Actions
          </h3>
          <AddIncomeComponent onAddIncome={onAddIncome} />
          <AddExpenseComponent onAddExpense={onAddExpense} />
        </div>
      </SidebarContent>

      <SidebarFooter>
        {/* Notifications */}
        <div className="flex flex-col text-left items-start gap-1 list-none mt-4 mb-6">
          <NavSecondary items={data.navSecondary} />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
