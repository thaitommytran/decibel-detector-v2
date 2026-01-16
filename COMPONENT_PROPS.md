# Component Props Reference

Quick reference guide for all component props in the Decibel Detector application.

## FrequencyVisualizer

```typescript
interface FrequencyVisualizerProps {
  frequencyBars: number[]; // Array of frequency values (0-1)
  isListening: boolean; // Whether actively listening
  dbHistory: number[]; // Historical decibel readings
  historyLength: number; // Length of history array
}
```

**Usage:**

```tsx
<FrequencyVisualizer
  frequencyBars={frequencyBars}
  isListening={isListening}
  dbHistory={dbHistory}
  historyLength={60}
/>
```

---

## FrequencyBars

```typescript
interface FrequencyBarsProps {
  frequencyBars: number[]; // Array of frequency values (0-1)
  isListening: boolean; // Controls bar opacity and colors
}
```

**Usage:**

```tsx
<FrequencyBars frequencyBars={frequencyBars} isListening={isListening} />
```

---

## HistoryGraph

```typescript
interface HistoryGraphProps {
  dbHistory: number[]; // Historical decibel readings
  historyLength: number; // Number of data points to display
}
```

**Usage:**

```tsx
<HistoryGraph dbHistory={dbHistory} historyLength={60} />
```

---

## MainMeter

```typescript
interface NoiseLevel {
  max: number;
  label: string;
  color: string;
  ring: string;
  glow: string;
}

interface MainMeterProps {
  isListening: boolean; // Current listening state
  decibels: number; // Current decibel reading
  currentLevel: NoiseLevel; // Current noise level object
  displayLevel: NoiseLevel; // Stable display level
  displayPercent: number; // Percentage for circular progress
  glowColors: Record<string, string>; // Glow effect colors
  onStart: () => void; // Start listening callback
  onStop: () => void; // Stop listening callback
}
```

**Usage:**

```tsx
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
```

---

## Legend

```typescript
// No props - self-contained component
```

**Usage:**

```tsx
<Legend />
```

---

## SessionStats

```typescript
interface NoiseLevel {
  max: number;
  label: string;
  color: string;
  ring: string;
  glow: string;
}

interface SessionStatsProps {
  isListening: boolean; // Current listening state
  peakDecibels: number; // Peak decibel reading
  avgDecibels: number; // Average decibel reading
  sessionTime: number; // Session duration in seconds
  peakLevel: NoiseLevel; // Peak noise level object
  onResetPeak: () => void; // Reset peak callback
  formatTime: (seconds: number) => string; // Time formatting function
}
```

**Usage:**

```tsx
<SessionStats
  isListening={isListening}
  peakDecibels={peakDecibels}
  avgDecibels={avgDecibels}
  sessionTime={sessionTime}
  peakLevel={peakLevel}
  onResetPeak={resetPeak}
  formatTime={formatTime}
/>
```

---

## StatsCard

```typescript
interface StatsCardProps {
  label: string; // Card label
  value: string | number; // Value to display
  unit?: string; // Optional unit (e.g., "dB")
  color?: string; // Optional text color class
  action?: ReactNode; // Optional action button/element
}
```

**Usage:**

```tsx
<StatsCard
  label="Peak Level"
  value={peakDecibels}
  unit="dB"
  color="text-red-500"
  action={<button onClick={resetPeak}>Reset</button>}
/>
```

---

## Button (UI Component)

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg"; // Button size variant
}
```

**Usage:**

```tsx
<Button size="lg" onClick={handleClick} className="custom-classes">
  Click Me
</Button>
```

---

## Type Definitions

### NoiseLevel

Used by multiple components to represent noise level thresholds:

```typescript
interface NoiseLevel {
  max: number; // Maximum dB for this level
  label: string; // Display label (e.g., "Whisper quiet")
  color: string; // Tailwind text color class
  ring: string; // Tailwind stroke color class
  glow: string; // Glow effect identifier
}
```

**Example:**

```typescript
const level: NoiseLevel = {
  max: 40,
  label: "Whisper quiet",
  color: "text-cyan-400",
  ring: "stroke-cyan-400",
  glow: "cyan",
};
```
