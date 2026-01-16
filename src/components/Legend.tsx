export function Legend() {
  const legendItems = [
    {
      color: "bg-cyan-400",
      label: "Quiet",
      shadow: "shadow-[0_0_8px_rgb(34_211_238)]",
    },
    {
      color: "bg-yellow-400",
      label: "Normal",
      shadow: "shadow-[0_0_8px_rgb(250_204_21)]",
    },
    {
      color: "bg-orange-400",
      label: "Loud",
      shadow: "shadow-[0_0_8px_rgb(251_146_60)]",
    },
    {
      color: "bg-red-500",
      label: "Too Loud",
      shadow: "shadow-[0_0_8px_rgb(239_68_68)]",
    },
  ];

  return (
    <div className="mt-6 flex items-center justify-center gap-4 text-xs flex-wrap">
      {legendItems.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <div
            className={`w-2 h-2 rounded-full ${item.color} ${item.shadow}`}
          />
          <span className="text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
