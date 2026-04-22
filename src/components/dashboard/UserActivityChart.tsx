import { memo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { UsersByMonth } from "@/types/dashboard";

interface UserActivityChartProps {
  data: UsersByMonth[];
}

const tickStyle = { fill: "#64748B", fontSize: 12, fontWeight: 500 };
const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid #E5E7EB",
  boxShadow: "0 12px 24px -8px rgba(15, 23, 42, 0.08)",
  padding: "8px 12px",
  fontSize: 12,
};

const UserActivityChart = ({ data }: UserActivityChartProps) => {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Total Users</CardTitle>
        <CardDescription>Monthly cumulative growth</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="0" vertical={false} stroke="#F1F5F9" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={tickStyle}
              dy={12}
            />
            <YAxis axisLine={false} tickLine={false} tick={tickStyle} />
            <Tooltip contentStyle={tooltipStyle} cursor={false} />
            <Line
              type="monotone"
              dataKey="count"
              stroke="var(--color-chart-2)"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, strokeWidth: 0, fill: "var(--color-chart-2)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default memo(UserActivityChart);
