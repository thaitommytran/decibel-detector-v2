import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { Legend } from "./Legend";
import type { NoiseLevel } from "@/constants";

interface MainMeterProps {
  isListening: boolean;
  decibels: number;
  currentLevel: NoiseLevel;
  displayLevel: NoiseLevel;
  displayPercent: number;
  onStart: () => void;
  onStop: () => void;
  onClearSession: () => void;
  onSignIn: () => void;
}

export function MainMeter({
  isListening,
  decibels,
  currentLevel,
  displayLevel,
  displayPercent,
  onStart,
  onStop,
  onClearSession,
  onSignIn,
}: MainMeterProps) {
  return (
    <div className="flex flex-col items-center">
      {/* Title Section */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 mb-2 pl-2 pr-2.5 py-2 rounded-xl glass-card">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
            <Volume2 className="w-5 h-5 text-cyan-400" />
          </div>
          <h1 className="mb-1 text-2xl font-bold tracking-tight text-white uppercase leading-tight">
            Decibel Detector
          </h1>
        </div>
        <p className="text-slate-400 text-xs font-medium tracking-[0.2em] uppercase">
          Real-time audio analysis
        </p>
      </div>

      <div className="relative group">
        {/* Animated Background Glow */}
        <div
          className={`absolute inset-[-60px] rounded-full transition-all duration-1000 ${
            isListening ? "opacity-30 scale-100" : "opacity-0 scale-90"
          }`}
          style={{
            background: `radial-gradient(circle, ${
              currentLevel.glow === "cyan"
                ? "#22d3ee"
                : currentLevel.glow === "yellow"
                  ? "#facc15"
                  : currentLevel.glow === "orange"
                    ? "#fb923c"
                    : "#ef4444"
            } 0%, transparent 60%)`,
            filter: "blur(60px)",
          }}
        />

        {/* Outer Ring Decorations */}
        <div className="absolute inset-[-4px] rounded-full border border-white/5 pointer-events-none" />
        <div className="absolute inset-[-12px] rounded-full border border-white/5 pointer-events-none opacity-50" />

        {/* Main Gauge Container */}
        <div className="relative w-80 h-80 rounded-full glass-panel flex items-center justify-center p-8 transition-transform duration-500 hover:scale-[1.02]">
          {/* SVG Gauge */}
          <svg
            className="absolute inset-0 w-full h-full -rotate-90"
            viewBox="0 0 100 100"
          >
            {/* Background Track */}
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="rgba(255,255,255,0.03)"
              strokeWidth="4"
            />

            {/* Tick Marks */}
            {[...Array(48)].map((_, i) => (
              <line
                key={i}
                x1="50"
                y1="6"
                x2="50"
                y2={i % 4 === 0 ? "11" : "9"}
                stroke={
                  i % 4 === 0
                    ? "rgba(255,255,255,0.2)"
                    : "rgba(255,255,255,0.1)"
                }
                strokeWidth={i % 4 === 0 ? "0.8" : "0.4"}
                transform={`rotate(${i * 7.5} 50 50)`}
              />
            ))}

            {/* Active Progress Ring */}
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray={`${(displayPercent / 100) * 276} 276`}
              className={`transition-all duration-500 ease-out ${currentLevel.color}`}
            />
          </svg>

          {/* Internal Display */}
          <div className="relative flex flex-col items-center justify-center z-10 text-center">
            <span className="text-slate-500 text-[10px] font-bold tracking-[0.3em] uppercase mb-1">
              Decibels
            </span>
            <div className="relative">
              <span
                className={`text-8xl font-mono font-bold transition-all duration-300 tabular-nums ${
                  isListening ? "text-white" : "text-slate-500"
                }`}
                style={{
                  textShadow: isListening
                    ? "0 0 40px rgba(255,255,255,0.2)"
                    : "none",
                }}
              >
                {decibels > 0 || isListening
                  ? decibels.toString().padStart(2, "0")
                  : "--"}
              </span>
            </div>
            <div
              className={`mt-4 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-500 ${
                isListening
                  ? `${currentLevel.color} bg-black/40 border border-white/5`
                  : "text-slate-600 bg-slate-900/40 border border-white/5"
              }`}
            >
              {decibels > 0 || isListening
                ? displayLevel.label
                : "Device Ready"}
            </div>
          </div>
        </div>
      </div>

      {/* Control Actions */}
      <div className="mt-12 w-full max-w-sm px-6 flex flex-col gap-4">
        {/* Main Control Button */}
        <Button
          onClick={isListening ? onStop : onStart}
          className={`w-full h-16 group rounded-2xl text-sm font-bold uppercase tracking-[.2em] transition-all duration-500 overflow-hidden relative ${
            isListening
              ? "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30"
              : "bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <div className="relative z-10 flex items-center justify-center gap-3">
            {isListening ? (
              <>
                <MicOff className="w-5 h-5 animate-pulse" />
                <span>Stop Recording</span>
              </>
            ) : (
              <>
                <Mic className="w-5 h-5" />
                <span>Start Recording</span>
              </>
            )}
          </div>
        </Button>

        <div className="flex gap-4">
          {/* Clear Button */}
          <button
            onClick={onClearSession}
            disabled={isListening}
            className="flex-1 h-16 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed group flex items-center justify-center gap-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-trash-2"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              <line x1="10" x2="10" y1="11" y2="17" />
              <line x1="14" x2="14" y1="11" y2="17" />
            </svg>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
              Clear
            </span>
          </button>

          {/* Sign In Button */}
          <button
            onClick={onSignIn}
            className="flex-1 h-16 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-400 hover:text-white transition-all flex items-center justify-center gap-3 group"
          >
            <svg
              xmlns="http://www.w3.org/2000/xml"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-log-in"
            >
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" x2="3" y1="12" y2="12" />
            </svg>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
              Sign In
            </span>
          </button>
        </div>
      </div>

      {/* Footer Legend */}
      <div className="mt-8">
        <Legend />
      </div>
    </div>
  );
}
