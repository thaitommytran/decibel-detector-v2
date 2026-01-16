interface FrequencyBarsProps {
  frequencyBars: number[];
  isListening: boolean;
}

export function FrequencyBars({
  frequencyBars,
  isListening,
}: FrequencyBarsProps) {
  const getBarColor = (index: number, value: number) => {
    if (!isListening || value < 0.1) return "bg-border";
    const intensity = index / 32;
    if (intensity < 0.3) return "bg-cyan-400";
    if (intensity < 0.6) return "bg-yellow-400";
    if (intensity < 0.8) return "bg-orange-400";
    return "bg-red-500";
  };

  return (
    <div className="flex items-end justify-between gap-1 h-32 mb-6">
      {frequencyBars.map((value, i) => (
        <div
          key={i}
          className={`flex-1 rounded-t transition-all duration-75 ${getBarColor(i, value)}`}
          style={{
            height: `${Math.max(4, value * 100)}%`,
            opacity: isListening ? 0.4 + value * 0.6 : 0.2,
            boxShadow:
              isListening && value > 0.3 ? `0 0 10px currentColor` : "none",
          }}
        />
      ))}
    </div>
  );
}
