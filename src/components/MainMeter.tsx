import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { Legend } from "./Legend";

interface NoiseLevel {
  max: number;
  label: string;
  color: string;
  ring: string;
  glow: string;
}

interface MainMeterProps {
  isListening: boolean;
  decibels: number;
  currentLevel: NoiseLevel;
  displayLevel: NoiseLevel;
  displayPercent: number;
  glowColors: Record<string, string>;
  onStart: () => void;
  onStop: () => void;
}

export function MainMeter({
  isListening,
  decibels,
  currentLevel,
  displayLevel,
  displayPercent,
  glowColors,
  onStart,
  onStop,
}: MainMeterProps) {
  return (
    <div>
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-3 mb-3">
          <div className="p-2 rounded-xl bg-primary/10 border border-primary/30">
            <Volume2 className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Decibel Detector
          </h1>
        </div>
        <p className="text-muted-foreground text-sm tracking-wide">
          Real-time audio analysis with scientific precision
        </p>
      </div>

      <div className="relative flex flex-col items-center">
        {/* Outer glow ring */}
        <div
          className={`absolute w-72 h-72 rounded-full transition-all duration-500 ${isListening ? "opacity-100" : "opacity-0"}`}
          style={{
            background: `radial-gradient(circle, transparent 60%, ${
              currentLevel.glow === "cyan"
                ? "rgb(34 211 238 / 0.1)"
                : currentLevel.glow === "yellow"
                  ? "rgb(250 204 21 / 0.1)"
                  : currentLevel.glow === "orange"
                    ? "rgb(251 146 60 / 0.1)"
                    : "rgb(239 68 68 / 0.1)"
            } 100%)`,
          }}
        />

        {/* Pulsing rings when listening */}
        {isListening && (
          <>
            <div
              className="absolute w-80 h-80 rounded-full border opacity-20 animate-ping"
              style={{
                borderColor:
                  currentLevel.glow === "cyan"
                    ? "rgb(34 211 238)"
                    : currentLevel.glow === "yellow"
                      ? "rgb(250 204 21)"
                      : currentLevel.glow === "orange"
                        ? "rgb(251 146 60)"
                        : "rgb(239 68 68)",
                animationDuration: "2s",
              }}
            />
            <div
              className="absolute w-72 h-72 rounded-full border opacity-30 animate-ping"
              style={{
                borderColor:
                  currentLevel.glow === "cyan"
                    ? "rgb(34 211 238)"
                    : currentLevel.glow === "yellow"
                      ? "rgb(250 204 21)"
                      : currentLevel.glow === "orange"
                        ? "rgb(251 146 60)"
                        : "rgb(239 68 68)",
                animationDuration: "2.5s",
                animationDelay: "0.5s",
              }}
            />
          </>
        )}

        {/* Main meter circle */}
        <div className="relative w-64 h-64">
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-card to-background border border-border" />
          <div className="absolute inset-3 rounded-full bg-background/80 backdrop-blur-sm" />

          <svg
            className="absolute inset-0 w-full h-full -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-border opacity-50"
            />
            {[...Array(12)].map((_, i) => (
              <line
                key={i}
                x1="50"
                y1="8"
                x2="50"
                y2="12"
                stroke="currentColor"
                strokeWidth="1"
                className="text-muted-foreground/50"
                transform={`rotate(${i * 30} 50 50)`}
              />
            ))}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${(displayPercent / 100) * 283} 283`}
              className={`${currentLevel.ring} transition-all duration-300`}
              style={{
                filter: isListening ? glowColors[currentLevel.glow] : "none",
              }}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className={`text-6xl font-mono font-bold tracking-tighter transition-colors duration-300 ${currentLevel.color}`}
              style={{
                textShadow: isListening ? `0 0 30px currentColor` : "none",
              }}
            >
              {isListening ? decibels : "--"}
            </span>
            <span className="text-muted-foreground text-sm font-medium tracking-widest uppercase mt-1">
              decibels
            </span>
            <p
              className={`text-sm font-semibold mt-3 px-4 text-center transition-all duration-300 ${displayLevel.color}`}
            >
              {isListening ? displayLevel.label : "Ready to listen"}
            </p>
          </div>
        </div>

        {/* Button */}
        <Button
          onClick={isListening ? onStop : onStart}
          size="lg"
          className={`mt-8 w-full max-w-xs h-14 text-base font-semibold rounded-full transition-all duration-300 ${
            isListening
              ? "bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50"
              : "bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50"
          }`}
          style={{
            boxShadow: isListening
              ? "0 0 30px rgb(239 68 68 / 0.3)"
              : "0 0 30px rgb(34 211 238 / 0.2)",
          }}
        >
          {isListening ? (
            <>
              <MicOff className="w-5 h-5 mr-2" />
              Stop Listening
            </>
          ) : (
            <>
              <Mic className="w-5 h-5 mr-2" />
              Start Listening
            </>
          )}
        </Button>

        {/* Legend */}
        <Legend />
      </div>
    </div>
  );
}
