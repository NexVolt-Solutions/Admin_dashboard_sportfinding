import { memo, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PopularSport } from "@/types/dashboard";

function sportLabel(sport: PopularSport["sport"]): string {
  if (sport == null) return "—";
  if (typeof sport === "string") return sport;
  if (typeof sport === "object" && sport !== null && "name" in sport && sport.name) {
    return String(sport.name);
  }
  return "—";
}

function sportRowKey(sport: PopularSport["sport"], index: number): string {
  if (sport && typeof sport === "object" && "id" in sport && sport.id != null) {
    return String(sport.id);
  }
  if (typeof sport === "string") return sport;
  return `sport-${index}`;
}

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

const DEFAULT_POPULAR_SPORTS: PopularSport[] = [
  { sport: "Football", count: 0, percentage: 0 },
  { sport: "Basketball", count: 0, percentage: 0 },
  { sport: "Cricket", count: 0, percentage: 0 },
];

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid #E5E7EB",
  boxShadow: "0 12px 24px -8px rgba(15, 23, 42, 0.08)",
  padding: "8px 12px",
  fontSize: 12,
};

const PopularSportsChart = ({ data }: PopularSportsChartProps) => {
  const list = useMemo(() => {
    const raw = data && data.length > 0 ? data : DEFAULT_POPULAR_SPORTS;
    return raw.map((item, index) => ({
      ...item,
      sportLabel: sportLabel(item.sport),
      rowKey: sportRowKey(item.sport, index),
      percentageNum: Number(item.percentage),
    }));
  }, [data]);
  return (
    <Card className="max-h-none">
      <CardHeader>
        <CardTitle>Most Popular Sports</CardTitle>
        <CardDescription>Share of matches by sport</CardDescription>
      </CardHeader>
      <CardContent className="min-w-0">
        <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-[minmax(0,160px)_1fr] md:gap-5">
          <div className="relative mx-auto h-36 min-h-36 w-full max-w-[160px] min-w-0 md:mx-0 md:h-40 md:min-h-40 md:max-w-none lg:h-44 lg:min-h-44">
            <ResponsiveContainer
              width="100%"
              height="100%"
              minWidth={1}
              initialDimension={{ width: 180, height: 176 }}
            >
              <PieChart>
                <Pie
                  data={list}
                  cx="50%"
                  cy="50%"
                  innerRadius={42}
                  outerRadius={62}
                  paddingAngle={2}
                  dataKey="percentageNum"
                  nameKey="sportLabel"
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

          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {list.map((item, index) => (
              <li
                key={item.rowKey}
                className="flex items-center justify-between gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-muted/40"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="truncate text-sm font-medium text-foreground">
                    {item.sportLabel}
                  </span>
                </div>
                <span className="text-sm font-semibold tabular-nums text-muted-foreground">
                  {item.percentageNum}%
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
