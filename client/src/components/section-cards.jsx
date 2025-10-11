import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { RefreshCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@tanstack/react-router";

export function SectionCards({ totalIncome, totalExpenses }) {
  const currentBalance = totalIncome - totalExpenses;

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Current Balance */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Current Balance</CardDescription>
          <CardTitle
            className={`text-2xl font-semibold tabular-nums ${
              currentBalance < 0 ? "text-red-600" : ""
            }`}
          >
            ₦{currentBalance.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {currentBalance >= 0 ? (
                <>
                  <IconTrendingUp /> +
                  {totalIncome
                    ? ((currentBalance / totalIncome) * 100).toFixed(1)
                    : 0}
                  %
                </>
              ) : (
                <>
                  <IconTrendingDown />{" "}
                  {totalIncome
                    ? ((currentBalance / totalIncome) * 100).toFixed(1)
                    : 0}
                  %
                </>
              )}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total funds available after expenses{" "}
            {currentBalance >= 0 ? (
              <IconTrendingUp className="size-4" />
            ) : (
              <IconTrendingDown className="size-4" />
            )}
          </div>
          <div className="text-muted-foreground">
            Total funds available after expenses
          </div>
        </CardFooter>
      </Card>

      {/* Total Income */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Income</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            ₦{totalIncome.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp /> +10%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Higher than last period <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            All income tracked in real-time
          </div>
        </CardFooter>
      </Card>

      {/* Total Expenses */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Expenses</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums text-red-600">
            ₦{totalExpenses.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingDown /> -8%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Reduced expenses this period <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Track and manage your spending
          </div>
        </CardFooter>
      </Card>

      {/* Savings Goals */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Savings Goals</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            4.5%
          </CardTitle>
          <CardAction>
            <Link
              to="/SavingGoals"
              aria-label="Navigate to Savings Goals"
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-[#1b5e20] hover:scale-110 hover:shadow-lg transition-transform duration-300"
            >
              <RefreshCcw className="animate-spin text-white" />
              <span className="sr-only">Loading</span>
            </Link>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Progress towards targets <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Stay motivated and reach your goals
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
