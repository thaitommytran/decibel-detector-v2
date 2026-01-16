interface HistoryGraphProps {
  dbHistory: number[];
  historyLength: number;
}

export function HistoryGraph({ dbHistory, historyLength }: HistoryGraphProps) {
  return (
    <div className="relative h-32 bg-background/50 rounded-lg overflow-hidden border border-border/50">
      <svg
        className="w-full h-full"
        preserveAspectRatio="none"
        viewBox={`0 0 ${historyLength} 120`}
      >
        {/* Grid lines */}
        <line
          x1="0"
          y1="30"
          x2={historyLength}
          y2="30"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-border"
        />
        <line
          x1="0"
          y1="60"
          x2={historyLength}
          y2="60"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-border"
        />
        <line
          x1="0"
          y1="90"
          x2={historyLength}
          y2="90"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-border"
        />

        {/* Area fill */}
        <path
          d={`M 0 120 ${dbHistory.map((db, i) => `L ${i} ${120 - db}`).join(" ")} L ${historyLength - 1} 120 Z`}
          fill="url(#historyGradient)"
          opacity="0.3"
        />

        {/* Line */}
        <path
          d={`M 0 ${120 - dbHistory[0]} ${dbHistory.map((db, i) => `L ${i} ${120 - db}`).join(" ")}`}
          fill="none"
          stroke="rgb(34 211 238)"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />

        <defs>
          <linearGradient id="historyGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(34 211 238)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>

      {/* Labels */}
      <div className="absolute right-2 top-1 text-[10px] text-muted-foreground">
        90dB
      </div>
      <div className="absolute right-2 bottom-1 text-[10px] text-muted-foreground">
        0dB
      </div>
    </div>
  );
}
