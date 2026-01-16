interface HistoryGraphProps {
  dbHistory: number[];
  historyLength: number;
}

export function HistoryGraph({ dbHistory, historyLength }: HistoryGraphProps) {
  return (
    <div className="relative h-24 overflow-hidden">
      <svg
        className="w-full h-full"
        preserveAspectRatio="none"
        viewBox={`0 0 ${historyLength} 120`}
      >
        <defs>
          <linearGradient id="historyGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(34, 211, 238, 0.4)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Dynamic Grid lines */}
        {[30, 60, 90].map((y) => (
          <line
            key={y}
            x1="0"
            y1={120 - y}
            x2={historyLength}
            y2={120 - y}
            stroke="rgba(255,255,255,0.03)"
            strokeWidth="1"
          />
        ))}

        {/* Area fill */}
        <path
          d={`M 0 120 ${dbHistory.map((db, i) => `L ${i} ${120 - db}`).join(" ")} L ${historyLength - 1} 120 Z`}
          fill="url(#historyGradient)"
          className="transition-all duration-300"
        />

        {/* Main Line with Glow */}
        <path
          d={`M 0 ${120 - dbHistory[0]} ${dbHistory.map((db, i) => `L ${i} ${120 - db}`).join(" ")}`}
          fill="none"
          stroke="rgb(34, 211, 238)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
          className="transition-all duration-300"
          filter="url(#glow)"
        />
      </svg>

      {/* Numerical Indicators */}
      <div className="absolute inset-y-0 right-0 flex flex-col justify-between py-1 px-2 pointer-events-none">
        <span className="text-[8px] font-bold text-slate-600 uppercase">
          90dB
        </span>
        <span className="text-[8px] font-bold text-slate-600 uppercase">
          0dB
        </span>
      </div>
    </div>
  );
}
