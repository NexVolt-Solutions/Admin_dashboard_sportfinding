import { memo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MatchesPerDay } from "@/types/dashboard";

interface MatchesPerDayChartProps {
  data: MatchesPerDay[];
}

const MatchesPerDayChart = ({ data }: MatchesPerDayChartProps) => {
  return (
    <Card className="border-none shadow-sm rounded-2xl bg-white">
      <CardHeader className="pb-0 pt-5 px-5">
        <CardTitle className="text-base font-sans font-semibold text-[#0F172A]">Matches Per Day</CardTitle>
      </CardHeader>
      <CardContent className="h-[350px] p-5">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748B', fontSize: 12, fontWeight: 500 }}
              dy={15}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748B', fontSize: 12, fontWeight: 500 }}
            />
            <Tooltip
              cursor={{ fill: '#F1F5F9', radius: 8 }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 16px rgba(0,0,0,0.08)' }}
            />
            <Bar dataKey="count" radius={[6, 6, 6, 6]} barSize={24}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill="#A78BFA" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default memo(MatchesPerDayChart);
