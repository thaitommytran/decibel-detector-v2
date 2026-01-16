"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { FrequencyVisualizer } from "@/components/FrequencyVisualizer";
import { MainMeter } from "@/components/MainMeter";
import { SessionStats } from "@/components/SessionStats";

const NOISE_LEVELS = [
  {
    max: 40,
    label: "Whisper quiet",
    color: "text-cyan-400",
    ring: "stroke-cyan-400",
    glow: "cyan",
  },
  {
    max: 55,
    label: "Nice and peaceful",
    color: "text-cyan-400",
    ring: "stroke-cyan-400",
    glow: "cyan",
  },
  {
    max: 65,
    label: "Normal conversation",
    color: "text-yellow-400",
    ring: "stroke-yellow-400",
    glow: "yellow",
  },
  {
    max: 75,
    label: "Getting louder...",
    color: "text-orange-400",
    ring: "stroke-orange-400",
    glow: "orange",
  },
  {
    max: 85,
    label: "Pretty loud!",
    color: "text-orange-500",
    ring: "stroke-orange-500",
    glow: "orange",
  },
  {
    max: 95,
    label: "Very loud!",
    color: "text-red-500",
    ring: "stroke-red-500",
    glow: "red",
  },
  {
    max: 105,
    label: "Dangerously loud",
    color: "text-red-600",
    ring: "stroke-red-600",
    glow: "red",
  },
  {
    max: Number.POSITIVE_INFINITY,
    label: "Hearing damage risk",
    color: "text-red-700",
    ring: "stroke-red-700",
    glow: "red",
  },
];

function getNoiseLevel(db: number) {
  return (
    NOISE_LEVELS.find((level) => db <= level.max) ||
    NOISE_LEVELS[NOISE_LEVELS.length - 1]
  );
}

const SMOOTHING_SAMPLES = 15;
const UPDATE_INTERVAL_MS = 100;
const LABEL_STABILITY_MS = 500;
const HISTORY_LENGTH = 60;

export function DecibelMeter() {
  const [isListening, setIsListening] = useState(false);
  const [decibels, setDecibels] = useState(0);
  const [peakDecibels, setPeakDecibels] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [stableLabel, setStableLabel] = useState<
    (typeof NOISE_LEVELS)[0] | null
  >(null);
  const [frequencyBars, setFrequencyBars] = useState<number[]>(
    new Array(32).fill(0)
  );
  const [dbHistory, setDbHistory] = useState<number[]>(
    new Array(HISTORY_LENGTH).fill(0)
  );
  const [sessionTime, setSessionTime] = useState(0);
  const [avgDecibels, setAvgDecibels] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);
  const samplesRef = useRef<number[]>([]);
  const lastUpdateRef = useRef<number>(0);
  const labelTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingLabelRef = useRef<(typeof NOISE_LEVELS)[0] | null>(null);
  const sessionStartRef = useRef<number>(0);
  const allSamplesRef = useRef<number[]>([]);

  const startListening = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      setIsListening(true);
      samplesRef.current = [];
      allSamplesRef.current = [];
      sessionStartRef.current = Date.now();
      lastUpdateRef.current = 0;
      setDbHistory(new Array(HISTORY_LENGTH).fill(0));

      const dataArray = new Float32Array(analyser.fftSize);
      const freqDataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateDecibels = (timestamp: number) => {
        analyser.getFloatTimeDomainData(dataArray);
        analyser.getByteFrequencyData(freqDataArray);

        let sumSquares = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sumSquares += dataArray[i] * dataArray[i];
        }
        const rms = Math.sqrt(sumSquares / dataArray.length);
        const db = rms > 0 ? Math.round(20 * Math.log10(rms) + 94) : 0;
        const clampedDb = Math.max(0, Math.min(120, db));

        samplesRef.current.push(clampedDb);
        if (samplesRef.current.length > SMOOTHING_SAMPLES) {
          samplesRef.current.shift();
        }

        const bars: number[] = [];
        const barsCount = 32;
        const step = Math.floor(freqDataArray.length / barsCount);
        for (let i = 0; i < barsCount; i++) {
          let sum = 0;
          for (let j = 0; j < step; j++) {
            sum += freqDataArray[i * step + j];
          }
          bars.push(sum / step / 255);
        }
        setFrequencyBars(bars);

        if (timestamp - lastUpdateRef.current >= UPDATE_INTERVAL_MS) {
          lastUpdateRef.current = timestamp;

          const smoothedDb = Math.round(
            samplesRef.current.reduce((a, b) => a + b, 0) /
              samplesRef.current.length
          );

          setDecibels(smoothedDb);
          setPeakDecibels((prev) => Math.max(prev, smoothedDb));

          allSamplesRef.current.push(smoothedDb);
          setDbHistory((prev) => [...prev.slice(1), smoothedDb]);
          setAvgDecibels(
            Math.round(
              allSamplesRef.current.reduce((a, b) => a + b, 0) /
                allSamplesRef.current.length
            )
          );
          setSessionTime(
            Math.floor((Date.now() - sessionStartRef.current) / 1000)
          );

          const newLevel = getNoiseLevel(smoothedDb);
          if (pendingLabelRef.current?.label !== newLevel.label) {
            pendingLabelRef.current = newLevel;

            if (labelTimeoutRef.current) {
              clearTimeout(labelTimeoutRef.current);
            }

            labelTimeoutRef.current = setTimeout(() => {
              setStableLabel(pendingLabelRef.current);
            }, LABEL_STABILITY_MS);
          }
        }

        animationRef.current = requestAnimationFrame(updateDecibels);
      };

      updateDecibels(0);
    } catch {
      setError(
        "Microphone access denied. Please allow microphone access to use this app."
      );
    }
  }, []);

  const stopListening = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (labelTimeoutRef.current) {
      clearTimeout(labelTimeoutRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setIsListening(false);
    setStableLabel(null);
    setFrequencyBars(new Array(32).fill(0));
    samplesRef.current = [];
  }, []);

  const resetPeak = useCallback(() => {
    setPeakDecibels(0);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  const currentLevel = getNoiseLevel(decibels);
  const displayLevel = stableLabel || currentLevel;
  const peakLevel = getNoiseLevel(peakDecibels);

  const displayPercent = Math.min(100, (decibels / 120) * 100);

  const glowColors: Record<string, string> = {
    cyan: "drop-shadow(0 0 20px rgb(34 211 238)) drop-shadow(0 0 40px rgb(34 211 238 / 0.5))",
    yellow:
      "drop-shadow(0 0 20px rgb(250 204 21)) drop-shadow(0 0 40px rgb(250 204 21 / 0.5))",
    orange:
      "drop-shadow(0 0 20px rgb(251 146 60)) drop-shadow(0 0 40px rgb(251 146 60 / 0.5))",
    red: "drop-shadow(0 0 20px rgb(239 68 68)) drop-shadow(0 0 40px rgb(239 68 68 / 0.5))",
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left panel - Frequency Visualizer */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <FrequencyVisualizer
            frequencyBars={frequencyBars}
            isListening={isListening}
            dbHistory={dbHistory}
            historyLength={HISTORY_LENGTH}
          />
        </div>

        {/* Center panel - Main meter */}
        <div className="lg:col-span-1 order-1 lg:order-2">
          <MainMeter
            isListening={isListening}
            decibels={decibels}
            currentLevel={currentLevel}
            displayLevel={displayLevel}
            displayPercent={displayPercent}
            glowColors={glowColors}
            onStart={startListening}
            onStop={stopListening}
          />
        </div>

        {/* Right panel - Stats */}
        <div className="lg:col-span-1 order-3">
          <SessionStats
            isListening={isListening}
            peakDecibels={peakDecibels}
            avgDecibels={avgDecibels}
            sessionTime={sessionTime}
            peakLevel={peakLevel}
            onResetPeak={resetPeak}
            formatTime={formatTime}
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-6 p-4 bg-destructive/10 border border-destructive/30 rounded-xl text-destructive text-sm text-center max-w-md mx-auto">
          {error}
        </div>
      )}
    </div>
  );
}
