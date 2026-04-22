import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

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
      className={cn("bg-white p-4 rounded-2xl border border-border shadow-sm", className)}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        {growth && (
          <span className={cn(
            "text-xs font-sans font-bold px-2 py-1 rounded-full",
            isPositive ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"
          )}>
            {growth}
          </span>
        )}
      </div>
      <div>
        <h3 className="text-darkText font-sans font-bold text-2xl mb-1">{value}</h3>
        <p className="text-sidebarText font-sans text-sm">{label}</p>
      </div>
    </motion.div>
  );
};

export default React.memo(StatCard);
