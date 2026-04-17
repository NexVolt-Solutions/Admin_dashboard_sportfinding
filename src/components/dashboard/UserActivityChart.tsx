import { memo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { UsersByMonth } from "@/types/dashboard";

interface UserActivityChartProps {
  data: UsersByMonth[];
}

const UserActivityChart = ({ data }: UserActivityChartProps) => {
  return (
    <Card className="lg:col-span-2 border-none shadow-sm rounded-2xl bg-white">
      <CardHeader className="pb-0 pt-5 px-5">
        <CardTitle className="text-base font-sans font-semibold text-[#0F172A]">Total Users</CardTitle>
      </CardHeader>
      <CardContent className="h-[350px] p-5">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="0" vertical={false} stroke="#F1F5F9" />
            <XAxis
              dataKey="month"
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
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 16px rgba(0,0,0,0.08)' }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#10B981"
              strokeWidth={4}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0, fill: '#10B981' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default memo(UserActivityChart);
