import { memo } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';
import { Card, CardContent } from "@/components/ui/card";
import type { PopularSport } from "@/types/dashboard";

const COLORS = ['#60A5FA', '#F87171', '#93C5FD', '#FBBF24', '#34D399', '#A78BFA'];

interface PopularSportsChartProps {
  data: PopularSport[];
}

const PopularSportsChart = ({ data }: PopularSportsChartProps) => {
  return (
    <Card className="border-none shadow-sm rounded-2xl bg-white">
      <CardContent className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6">
          <div className="text-left">
            <h3 className="text-base font-sans font-semibold text-[#0F172A]">Most Popular Sport</h3>
          </div>

          <div className="h-[200px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={0}
                  dataKey="percentage"
                  nameKey="sport"
                  stroke="none"
                >
                  {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3">
            {data.map((item, index) => (
              <div key={item.sport} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-sm font-sans text-slate-500 font-medium">{item.sport}</span>
                <span className="text-sm font-sans text-slate-500 font-medium ml-auto">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default memo(PopularSportsChart);
