import { Search, ChevronDown, MapPin, User, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative w-full lg:max-w-96">
        {isFetching ? (
          <Loader2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        ) : (
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        )}
        <Input
          placeholder="Search matches…"
          className="pl-9"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onReset}
          disabled={isDefault}
        >
          Reset
        </Button>

        <div className="relative">
          <User
            className={cn(
              "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2",
              name ? "text-primary" : "text-muted-foreground"
            )}
          />
          <Input
            placeholder="Host name"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className="h-9 w-40 pl-9"
          />
        </div>

        <div className="relative">
          <MapPin
            className={cn(
              "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2",
              location ? "text-primary" : "text-muted-foreground"
            )}
          />
          <Input
            placeholder="Location"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            className="h-9 w-40 pl-9"
          />
        </div>

        <div className="relative">
          <select
            value={dateFilter}
            onChange={(e) => onDateFilterChange(e.target.value)}
            aria-label="Date filter"
            className={cn(
              "h-9 appearance-none rounded-lg border border-input bg-card pl-3 pr-8 text-sm shadow-xs outline-none transition-colors",
              "hover:border-input/80 focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/30",
              dateFilter ? "text-foreground" : "text-muted-foreground"
            )}
          >
            <option value="">Any date</option>
            <option value="today">Today</option>
            <option value="week">This week</option>
            <option value="month">This month</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}
