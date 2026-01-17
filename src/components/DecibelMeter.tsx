"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { FrequencyVisualizer } from "@/components/FrequencyVisualizer";
import { MainMeter } from "@/components/MainMeter";
import { SessionStats } from "@/components/SessionStats";
import { MicOff } from "lucide-react";
import {
  NOISE_LEVELS,
  SMOOTHING_SAMPLES,
  UPDATE_INTERVAL_MS,
  LABEL_STABILITY_MS,
  HISTORY_LENGTH,
  FREQUENCY_BARS_COUNT,
  MAX_DB,
} from "@/constants";

function getNoiseLevel(db: number) {
  return (
    NOISE_LEVELS.find((level) => db <= level.max) ||
    NOISE_LEVELS[NOISE_LEVELS.length - 1]
  );
}

export function DecibelMeter() {
  const [isListening, setIsListening] = useState(false);
  const [decibels, setDecibels] = useState(0);
  const [peakDecibels, setPeakDecibels] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [stableLabel, setStableLabel] = useState<
    (typeof NOISE_LEVELS)[0] | null
  >(null);
  const [frequencyBars, setFrequencyBars] = useState<number[]>(
    new Array(FREQUENCY_BARS_COUNT).fill(0),
  );
  const [dbHistory, setDbHistory] = useState<number[]>(
    new Array(HISTORY_LENGTH).fill(0),
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
      setStableLabel(null);
      setFrequencyBars(new Array(FREQUENCY_BARS_COUNT).fill(0));
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
        const clampedDb = Math.max(0, Math.min(MAX_DB, db));

        samplesRef.current.push(clampedDb);
        if (samplesRef.current.length > SMOOTHING_SAMPLES) {
          samplesRef.current.shift();
        }

        const bars: number[] = [];
        const barsCount = FREQUENCY_BARS_COUNT;
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
              samplesRef.current.length,
          );

          setDecibels(smoothedDb);
          setPeakDecibels((prev) => Math.max(prev, smoothedDb));

          allSamplesRef.current.push(smoothedDb);
          setDbHistory((prev) => [...prev.slice(1), smoothedDb]);
          setAvgDecibels(
            Math.round(
              allSamplesRef.current.reduce((a, b) => a + b, 0) /
                allSamplesRef.current.length,
            ),
          );
          setSessionTime(
            Math.floor((Date.now() - sessionStartRef.current) / 1000),
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
        "Microphone access denied. Please allow microphone access to use this app.",
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
  }, []);

  const resetPeak = useCallback(() => {
    setPeakDecibels(0);
  }, []);

  const clearSession = useCallback(() => {
    setDecibels(0);
    setPeakDecibels(0);
    setAvgDecibels(0);
    setSessionTime(0);
    setDbHistory(new Array(HISTORY_LENGTH).fill(0));
    setFrequencyBars(new Array(FREQUENCY_BARS_COUNT).fill(0));
    setStableLabel(null);
    allSamplesRef.current = [];
    samplesRef.current = [];
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

  const displayPercent = Math.min(100, (decibels / MAX_DB) * 100);

  return (
    <div className="w-full max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left panel - Frequency Visualizer */}
        <div className="lg:col-span-3 order-2 lg:order-1 flex flex-col">
          <FrequencyVisualizer
            frequencyBars={frequencyBars}
            isListening={isListening}
            dbHistory={dbHistory}
            historyLength={HISTORY_LENGTH}
          />
        </div>

        {/* Center panel - Main meter */}
        <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col justify-start">
          <MainMeter
            isListening={isListening}
            decibels={decibels}
            currentLevel={currentLevel}
            displayLevel={displayLevel}
            displayPercent={displayPercent}
            onStart={startListening}
            onStop={stopListening}
            onClearSession={clearSession}
            onSignIn={() => console.log("Sign in clicked")}
          />
        </div>

        {/* Right panel - Stats */}
        <div className="lg:col-span-3 order-3 flex flex-col">
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
        <div className="mt-12 max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="glass-card bg-red-500/5 border-red-500/20 rounded-2xl p-4 flex items-center gap-4">
            <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20">
              <MicOff className="w-5 h-5 text-red-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">
                Access Error
              </span>
              <p className="text-sm text-red-200/80 leading-tight">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
