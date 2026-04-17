import { Search, ChevronDown, MapPin, User, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FilterGroupProps {
  search: string;
  onSearchChange: (value: string) => void;
  name: string;
  onNameChange: (value: string) => void;
  location: string;
  onLocationChange: (value: string) => void;
  dateFilter: string;
  onDateFilterChange: (value: string) => void;
  isFetching?: boolean;
  onReset: () => void;
}

export default function FilterGroup({
  search,
  onSearchChange,
  name,
  onNameChange,
  location,
  onLocationChange,
  dateFilter,
  onDateFilterChange,
  isFetching,
  onReset,
}: FilterGroupProps) {
  const isDefault = !search && !name && !location && !dateFilter;

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
      <div className="relative w-full lg:w-[400px]">
        {isFetching ? (
          <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary animate-spin" />
        ) : (
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        )}
        <Input
          placeholder="Search matches..."
          className="pl-12 bg-[#F8FAFC] border-slate-200 rounded-xl h-12 font-sans text-[15px] focus:ring-primary/20"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
        <button
          onClick={onReset}
          className={cn(
            "px-8 py-2 rounded-xl text-[15px] font-sans font-bold whitespace-nowrap h-11 transition-all",
            isDefault
              ? "bg-[#60A5FA] text-white shadow-lg shadow-blue-100"
              : "bg-white border border-slate-200 text-slate-400 hover:text-[#0F172A]"
          )}
        >
          All
        </button>

        <div className="relative">
          <User
            className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none",
              name ? "text-white" : "text-slate-400"
            )}
          />
          <Input
            placeholder="Host name"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className={cn(
              "pl-10 w-40 rounded-xl text-[14px] font-sans font-bold h-11 border transition-all",
              name
                ? "bg-[#60A5FA] text-white border-[#60A5FA] placeholder:text-white/70"
                : "bg-white border-slate-200 text-slate-400"
            )}
          />
        </div>

        <div className="relative">
          <MapPin
            className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none",
              location ? "text-white" : "text-slate-400"
            )}
          />
          <Input
            placeholder="Location"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            className={cn(
              "pl-10 w-40 rounded-xl text-[14px] font-sans font-bold h-11 border transition-all",
              location
                ? "bg-[#60A5FA] text-white border-[#60A5FA] placeholder:text-white/70"
                : "bg-white border-slate-200 text-slate-400"
            )}
          />
        </div>

        <div className="relative">
          <select
            value={dateFilter}
            onChange={(e) => onDateFilterChange(e.target.value)}
            aria-label="Date filter"
            className={cn(
              "appearance-none px-5 py-2.5 rounded-xl text-[15px] font-sans font-bold pr-10 transition-all focus:outline-none border h-11",
              dateFilter
                ? "bg-[#60A5FA] text-white border-[#60A5FA]"
                : "bg-white border-slate-200 text-slate-400 hover:text-[#0F172A]"
            )}
          >
            <option value="" className="text-slate-900">Any date</option>
            <option value="today" className="text-slate-900">Today</option>
            <option value="week" className="text-slate-900">This Week</option>
            <option value="month" className="text-slate-900">This Month</option>
          </select>
          <ChevronDown
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none",
              dateFilter ? "text-white" : "text-slate-400"
            )}
          />
        </div>
      </div>
    </div>
  );
}
