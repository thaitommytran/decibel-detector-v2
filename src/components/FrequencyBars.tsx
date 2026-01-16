interface FrequencyBarsProps {
  frequencyBars: number[];
  isListening: boolean;
}

export function FrequencyBars({
  frequencyBars,
  isListening,
}: FrequencyBarsProps) {
  const getBarColor = (index: number) => {
    if (!isListening) return "bg-slate-800";
    const intensity = index / 32;
    if (intensity < 0.3) return "bg-cyan-400";
    if (intensity < 0.6) return "bg-yellow-400";
    if (intensity < 0.8) return "bg-orange-400";
    return "bg-red-500";
  };

  return (
    <div className="flex items-end justify-between gap-[2px] h-20">
      {frequencyBars.map((value, i) => (
        <div
          key={i}
          className={`flex-1 rounded-sm transition-all duration-75 ${getBarColor(i)}`}
          style={{
            height: `${Math.max(4, value * 100)}%`,
            opacity: isListening ? 0.4 + value * 0.6 : 0.1,
            boxShadow:
              isListening && value > 0.5 ? `0 0 10px currentColor` : "none",
          }}
        />
      ))}
    </div>
  );
}
