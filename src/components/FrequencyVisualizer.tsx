import { Activity, Zap, TrendingUp } from "lucide-react";
import { FrequencyBars } from "./FrequencyBars";
import { HistoryGraph } from "./HistoryGraph";

interface FrequencyVisualizerProps {
  frequencyBars: number[];
  isListening: boolean;
  dbHistory: number[];
  historyLength: number;
}

export function FrequencyVisualizer({
  frequencyBars,
  isListening,
  dbHistory,
  historyLength,
}: FrequencyVisualizerProps) {
  return (
    <div className="glass-panel rounded-[2rem] p-6 h-full flex flex-col gap-6">
      {/* Frequency spectrum section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-500/5 border border-cyan-500/10 w-fit">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h3 className="text-[10px] font-bold text-cyan-400/80 uppercase tracking-[0.2em]">
            Frequency Spectrum
          </h3>
        </div>
        <div className="glass-card rounded-2xl p-4 overflow-hidden">
          <FrequencyBars
            frequencyBars={frequencyBars}
            isListening={isListening}
          />
        </div>
      </div>

      {/* Level history section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-yellow-500/5 border border-yellow-500/10 w-fit">
          <TrendingUp className="w-4 h-4 text-yellow-400" />
          <h3 className="text-[10px] font-bold text-yellow-400/80 uppercase tracking-[0.2em]">
            Level History
          </h3>
        </div>
        <div className="glass-card rounded-2xl p-4 overflow-hidden">
          <HistoryGraph dbHistory={dbHistory} historyLength={historyLength} />
        </div>
      </div>

      {/* Stats and pattern section */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card rounded-2xl p-4 transition-all hover:bg-white/5">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
            <div className="w-1 h-1 rounded-full bg-cyan-400" />
            Min Level
          </div>
          <div className="text-2xl font-mono font-bold text-white leading-none">
            {dbHistory.some((d) => d > 0)
              ? `${Math.round(Math.min(...dbHistory.filter((d) => d > 0))) || 0}`
              : "--"}
            <span className="text-[10px] text-slate-500 ml-1 font-sans uppercase">
              dB
            </span>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-4 transition-all hover:bg-white/5">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
            <div className="w-1 h-1 rounded-full bg-orange-400" />
            Max Level
          </div>
          <div className="text-2xl font-mono font-bold text-white leading-none">
            {dbHistory.some((d) => d > 0)
              ? `${Math.round(Math.max(...dbHistory))}`
              : "--"}
            <span className="text-[10px] text-slate-500 ml-1 font-sans uppercase">
              dB
            </span>
          </div>
        </div>
      </div>

      {/* Signal pattern footer */}
      <div className="glass-card rounded-2xl p-4 mt-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Zap className="w-3 h-3 text-cyan-400" />
            Signal Pattern
          </div>
          <div
            className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
              isListening
                ? "bg-cyan-400 animate-pulse glow-cyan"
                : "bg-slate-800"
            }`}
          />
        </div>
        <div className="flex items-center gap-1 h-12">
          {Array.from({ length: 32 }).map((_, i) => {
            const historyIndex = Math.floor((i / 32) * dbHistory.length);
            const value = dbHistory[historyIndex] || 0;
            const heightPercent = Math.max(8, (value / 120) * 100);

            return (
              <div
                key={i}
                className="flex-1 relative group"
                style={{ height: "100%" }}
              >
                <div
                  className={`absolute left-0 right-0 top-1/2 -translate-y-1/2 rounded-full transition-all duration-300 ${
                    isListening
                      ? "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.3)]"
                      : "bg-slate-700/50"
                  }`}
                  style={{
                    height: `${heightPercent}%`,
                    opacity: isListening ? 0.4 + (value / 120) * 0.6 : 0.2,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
