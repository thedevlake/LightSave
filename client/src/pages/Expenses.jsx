import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const data = [
  { name: "Food", value: 400 },
  { name: "Transport", value: 300 },
  { name: "Rent", value: 600 },
  { name: "Entertainment", value: 200 },
  { name: "Utilities", value: 150 },
];

const COLORS = [
  "#2563EB", // Deep Blue – professional
  "#10B981", // Emerald Green – clean and modern
  "#F59E0B", // Amber – balanced highlight
  "#EF4444", // Red – subtle contrast
  "#6B7280", // Neutral Gray – understated
];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) / 2;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#374151"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

function Expenses() {
  return (
    <Card className="w-full h-[400px] sm:h-[450px] md:h-[500px]">
      <CardHeader>
        <CardTitle className="text-center text-gray-800 dark:text-gray-200 text-base sm:text-lg md:text-xl font-bold">
          Expense Breakdown by Category
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[280px] sm:h-[320px] md:h-[380px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius="70%"
              innerRadius="50%"
              paddingAngle={2}
              label={renderCustomizedLabel}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke="#FFFFFF"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`₦${value.toLocaleString()}`, name]}
              contentStyle={{ color: "#374151" }}
              labelStyle={{ color: "#374151" }}
              wrapperStyle={{ fontSize: "0.8rem" }}
            />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              wrapperStyle={{ color: "#374151", fontSize: "0.75rem" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default Expenses;
