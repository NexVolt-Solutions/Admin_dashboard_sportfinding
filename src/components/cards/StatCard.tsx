import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  growth?: string;
  isPositive?: boolean;
  className?: string;
}

const StatCard = ({ icon: Icon, label, value, growth, isPositive = true, className }: StatCardProps) => {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className={cn("bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300", className)}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 bg-[#F0F9FF] rounded-xl flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        {growth && (
          <div className="flex items-center gap-1">
            {isPositive ? (
              <TrendingUp className="w-3 h-3 text-slate-400" />
            ) : (
              <TrendingDown className="w-3 h-3 text-slate-400" />
            )}
            <span className="text-xs font-sans font-medium text-slate-400">
              {growth}
            </span>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-[#0F172A] font-sans font-bold text-3xl mb-1 tracking-tight">{value}</h3>
        <p className="text-slate-500 font-sans text-sm font-medium">{label}</p>
      </div>
    </motion.div>
  );
};

export default React.memo(StatCard);
