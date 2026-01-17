import { RotateCcw, BarChart3, Info } from "lucide-react";
import { StatsCard } from "./StatsCard";

import { REFERENCE_GUIDE } from "@/constants";
import type { NoiseLevel } from "@/constants";

interface SessionStatsProps {
  isListening: boolean;
  peakDecibels: number;
  avgDecibels: number;
  sessionTime: number;
  peakLevel: NoiseLevel;
  onResetPeak: () => void;
  formatTime: (seconds: number) => string;
}

export function SessionStats({
  isListening,
  peakDecibels,
  avgDecibels,
  sessionTime,
  peakLevel,
  onResetPeak,
  formatTime,
}: SessionStatsProps) {
  return (
    <div className="glass-panel rounded-2xl p-6 h-full flex flex-col gap-6">
      <div className="flex items-center justify-start">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-500/5 border border-cyan-500/10 w-fit">
          <BarChart3 className="w-4 h-4 text-cyan-400" />
          <h3 className="text-[10px] font-bold text-cyan-400/80 uppercase tracking-[0.2em]">
            Session Analysis
          </h3>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Peak */}
        <StatsCard
          label="Peak Observed"
          value={peakDecibels > 0 || isListening ? peakDecibels : "--"}
          unit="dB"
          color={isListening ? peakLevel.color : "text-slate-500"}
          action={
            <button
              onClick={onResetPeak}
              className="p-1.5 rounded-lg bg-black/20 hover:bg-black/40 border border-white/5 transition-all text-slate-400 hover:text-white"
              title="Reset Peak"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          }
        />

        {/* Average */}
        <StatsCard
          label="Average Level"
          value={avgDecibels > 0 || isListening ? avgDecibels : "--"}
          unit="dB"
          color={isListening ? "text-cyan-400" : "text-slate-500"}
        />

        {/* Session time */}
        <StatsCard
          label="Active Session"
          value={
            sessionTime > 0 || isListening ? formatTime(sessionTime) : "--:--"
          }
          color={isListening ? "text-white" : "text-slate-500"}
        />
      </div>

      {/* Reference guide */}
      <div className="mt-auto">
        <div className="glass-card rounded-xl p-5 border border-white/[0.02]">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
              Reference Guide
            </span>
          </div>
          <div className="space-y-3">
            {REFERENCE_GUIDE.map((item) => (
              <div
                key={item.label}
                className="flex justify-between items-center group"
              >
                <span className="text-[10px] text-slate-400 group-hover:text-slate-300 transition-colors">
                  {item.label}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-[1px] bg-white/5" />
                  <span
                    className={`text-[10px] font-mono font-bold ${item.color}`}
                  >
                    {item.db} dB
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
