export function Legend() {
  const legendItems = [
    {
      color: "bg-cyan-400",
      label: "Quiet",
      glow: "shadow-[0_0_8px_rgba(34,211,238,0.4)]",
    },
    {
      color: "bg-yellow-400",
      label: "Normal",
      glow: "shadow-[0_0_8px_rgba(250,204,21,0.4)]",
    },
    {
      color: "bg-orange-400",
      label: "Loud",
      glow: "shadow-[0_0_8px_rgba(251,146,60,0.4)]",
    },
    {
      color: "bg-red-500",
      label: "Danger",
      glow: "shadow-[0_0_8px_rgba(239,68,68,0.4)]",
    },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-6 px-6 py-3 rounded-2xl glass-card border border-white/[0.02]">
      {legendItems.map((item) => (
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
