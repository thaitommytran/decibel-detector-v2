import { Activity, Zap } from "lucide-react";
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
    <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border p-5 h-full">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">
          Frequency Spectrum
        </h3>
      </div>

      {/* Frequency bars */}
      <FrequencyBars frequencyBars={frequencyBars} isListening={isListening} />

      {/* History graph */}
      <div className="flex items-center gap-2 mb-3">
        <Zap className="w-4 h-4 text-yellow-400" />
        <h3 className="text-sm font-semibold text-foreground">Level History</h3>
      </div>
      <HistoryGraph dbHistory={dbHistory} historyLength={historyLength} />

      {/* Real-time stats section */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="bg-background/50 rounded-lg p-3 border border-border/50">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
            Min Level
          </div>
          <div className="text-lg font-mono font-bold text-cyan-400">
            {isListening
              ? `${Math.round(Math.min(...dbHistory.filter((d) => d > 0))) || 0}`
              : "--"}
            <span className="text-xs text-muted-foreground ml-1">dB</span>
          </div>
        </div>
        <div className="bg-background/50 rounded-lg p-3 border border-border/50">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
            Max Level
          </div>
          <div className="text-lg font-mono font-bold text-orange-400">
            {isListening ? `${Math.round(Math.max(...dbHistory))}` : "--"}
            <span className="text-xs text-muted-foreground ml-1">dB</span>
          </div>
        </div>
      </div>

      {/* Waveform pattern indicator */}
      <div className="mt-4 bg-background/50 rounded-lg p-3 border border-border/50">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
          Signal Pattern
        </div>
        <div className="flex items-center gap-1 h-8">
          {Array.from({ length: 24 }).map((_, i) => {
            const historyIndex = Math.floor((i / 24) * dbHistory.length);
            const value = dbHistory[historyIndex] || 0;
            return (
              <div
                key={i}
                className="flex-1 bg-cyan-400 rounded-full transition-all duration-150"
                style={{
                  height: `${Math.max(15, (value / 120) * 100)}%`,
                  opacity: isListening ? 0.4 + (value / 120) * 0.6 : 0.2,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
