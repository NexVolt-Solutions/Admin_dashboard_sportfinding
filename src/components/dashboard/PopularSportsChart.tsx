import { memo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PopularSport } from "@/types/dashboard";

const COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
  "var(--color-chart-6)",
];

interface PopularSportsChartProps {
  data: PopularSport[];
}

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid #E5E7EB",
  boxShadow: "0 12px 24px -8px rgba(15, 23, 42, 0.08)",
  padding: "8px 12px",
  fontSize: 12,
};

const PopularSportsChart = ({ data }: PopularSportsChartProps) => {
  const defaultData: PopularSport[] = [
    { sport: "Football", count: 0, percentage: 0 },
    { sport: "Basketball", count: 0, percentage: 0 },
    { sport: "Cricket", count: 0, percentage: 0 },
  ];
  const list = data && data.length > 0 ? data : defaultData;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Most Popular Sports</CardTitle>
        <CardDescription>Share of matches by sport</CardDescription>
      </CardHeader>
      <CardContent className="min-w-0">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[200px_1fr]">
          <div className="relative h-48 min-w-0 md:h-56 lg:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={list}
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={88}
                  paddingAngle={2}
                  dataKey="percentage"
                  nameKey="sport"
                  stroke="var(--color-card)"
                  strokeWidth={3}
                >
                  {list.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {list.map((item, index) => (
              <li
                key={item.sport}
                className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-muted/40"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="truncate text-sm font-medium text-foreground">
                    {item.sport}
                  </span>
                </div>
                <span className="text-sm font-semibold tabular-nums text-muted-foreground">
                  {item.percentage}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default memo(PopularSportsChart);
