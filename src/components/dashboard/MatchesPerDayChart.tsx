import { memo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { MatchesPerDay } from "@/types/dashboard";

interface MatchesPerDayChartProps {
  data: MatchesPerDay[];
}

const tickStyle = { fill: "#64748B", fontSize: 12, fontWeight: 500 };
const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid #E5E7EB",
  boxShadow: "0 12px 24px -8px rgba(15, 23, 42, 0.08)",
  padding: "8px 12px",
  fontSize: 12,
};

const MatchesPerDayChart = ({ data }: MatchesPerDayChartProps) => {
  // normalize to a 7-day series (Mon - Sun) and default missing days to 0
  const daysOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const normalized = daysOrder.map((d) => {
    const found = data.find((x) => x.day && x.day.toLowerCase().startsWith(d.toLowerCase()));
    return { day: d, count: found ? found.count : 0 };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Matches Per Day</CardTitle>
        <CardDescription>Last 7 days</CardDescription>
      </CardHeader>
      <CardContent className="h-64 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={normalized}
            margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
          >
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={tickStyle}
              dy={12}
            />
            <YAxis axisLine={false} tickLine={false} tick={tickStyle} />
            <Tooltip cursor={false} contentStyle={tooltipStyle} />
            <Bar dataKey="count" radius={[8, 8, 8, 8]} barSize={20}>
              {normalized.map((_, index) => (
                <Cell key={`cell-${index}`} fill="var(--color-chart-3)" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default memo(MatchesPerDayChart);
