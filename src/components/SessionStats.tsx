import { RotateCcw } from "lucide-react";
import { StatsCard } from "./StatsCard";

interface NoiseLevel {
  max: number;
  label: string;
  color: string;
  ring: string;
  glow: string;
}

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
    <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border p-5 h-full">
      <h3 className="text-sm font-semibold text-foreground mb-4">
        Session Statistics
      </h3>

      <div className="space-y-4">
        {/* Peak */}
        <StatsCard
          label="Peak Level"
          value={isListening ? peakDecibels : "--"}
          unit="dB"
          color={peakLevel.color}
          action={
            <button
              onClick={onResetPeak}
              className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          }
        />

        {/* Average */}
        <StatsCard
          label="Average Level"
          value={isListening ? avgDecibels : "--"}
          unit="dB"
        />

        {/* Session time */}
        <StatsCard
          label="Session Duration"
          value={isListening ? formatTime(sessionTime) : "--:--"}
        />

        {/* Reference guide */}
        <div className="bg-background/50 rounded-xl p-4 border border-border/50">
          <span className="text-xs text-muted-foreground uppercase tracking-wider mb-3 block">
            Reference Guide
          </span>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Whisper</span>
              <span className="text-cyan-400 font-mono">30 dB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Normal Talk</span>
              <span className="text-cyan-400 font-mono">60 dB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Vacuum</span>
              <span className="text-yellow-400 font-mono">70 dB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Loud Music</span>
              <span className="text-orange-400 font-mono">85 dB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Concerts</span>
              <span className="text-red-500 font-mono">110 dB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
