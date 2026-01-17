export const NOISE_LEVELS = [
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

export const REFERENCE_GUIDE = [
  { label: "Whisper", db: 30, color: "text-cyan-400" },
  { label: "Conversation", db: 60, color: "text-cyan-400" },
  { label: "Vacuum", db: 70, color: "text-yellow-400" },
  { label: "Heavy Traffic", db: 85, color: "text-orange-400" },
  { label: "Concert", db: 110, color: "text-red-500" },
];

export const LEGEND_ITEMS = [
  {
    color: "bg-cyan-400",
    label: "Quiet",
    glow: "shadow-[0_0_8px_rgba(34,211,238,0.4)]",
  },
  {
    color: "bg-yellow-400",
    label: "Normal",
    glow: "shadow-[0_0_8px_rgba(250,204,21,0.4)]",
  },
  {
    color: "bg-orange-400",
    label: "Loud",
    glow: "shadow-[0_0_8px_rgba(251,146,60,0.4)]",
  },
  {
    color: "bg-red-500",
    label: "Danger",
    glow: "shadow-[0_0_8px_rgba(239,68,68,0.4)]",
  },
];

export type NoiseLevel = (typeof NOISE_LEVELS)[number];

export const SMOOTHING_SAMPLES = 15;
export const UPDATE_INTERVAL_MS = 100;
export const LABEL_STABILITY_MS = 500;
export const HISTORY_LENGTH = 60;
export const FREQUENCY_BARS_COUNT = 32;
export const MAX_DB = 120;
