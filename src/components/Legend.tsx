import { LEGEND_ITEMS } from "@/constants";

export function Legend() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 px-6 py-3 rounded-xl glass-card border border-white/[0.02]">
      {LEGEND_ITEMS.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-2 group transition-all cursor-default"
        >
          <div
            className={`w-1.5 h-1.5 rounded-full transition-transform duration-300 group-hover:scale-150 ${item.color} ${item.glow}`}
          />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] group-hover:text-slate-300 transition-colors">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
