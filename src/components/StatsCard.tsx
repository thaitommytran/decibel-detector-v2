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
  color = "text-white",
  action,
}: StatsCardProps) {
  return (
    <div className="relative glass-card rounded-xl p-4 transition-all hover:bg-white/5 group border border-white/[0.03]">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
          {label}
        </span>
      </div>
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        {action}
      </div>
      <div className="flex items-baseline gap-2">
        <span
          className={`text-3xl font-mono font-bold tabular-nums tracking-tight ${color}`}
        >
          {value}
        </span>
        {unit && (
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}
