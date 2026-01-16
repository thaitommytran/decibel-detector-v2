import type { ReactNode } from "react";

interface StatsCardProps {
  label: string;
  value: string | number;
  unit?: string;
  color?: string;
  action?: ReactNode;
}

export function StatsCard({
  label,
  value,
  unit,
  color = "text-foreground",
  action,
}: StatsCardProps) {
  return (
    <div className="bg-background/50 rounded-xl p-4 border border-border/50">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        {action}
      </div>
      <div className="flex items-baseline gap-2">
        <span className={`text-3xl font-mono font-bold ${color}`}>{value}</span>
        {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
      </div>
    </div>
  );
}
