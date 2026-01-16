# Decibel Detector Component Structure

## Overview

The decibel detector application has been refactored from a single monolithic component into smaller, reusable components for better maintainability and code organization.

## Component Hierarchy

```
DecibelMeter (Main Component)
├── FrequencyVisualizer (Left Panel)
│   ├── FrequencyBars
│   └── HistoryGraph
├── MainMeter (Center Panel)
│   └── Legend
└── SessionStats (Right Panel)
    └── StatsCard (used multiple times)
```

## Component Details

### 1. **DecibelMeter** (`src/decibel-meter.tsx`)

- **Purpose**: Main container component that manages all audio processing logic and state
- **Responsibilities**:
  - Audio context management
  - Microphone access and permissions
  - Real-time audio analysis
  - State management for decibels, frequency data, and session stats
  - Coordinating data flow to child components
- **Props**: None (root component)

### 2. **FrequencyVisualizer** (`src/components/FrequencyVisualizer.tsx`)

- **Purpose**: Left panel displaying frequency spectrum and history
- **Props**:
  - `frequencyBars: number[]` - Array of frequency values
  - `isListening: boolean` - Whether the app is actively listening
  - `dbHistory: number[]` - Historical decibel readings
  - `historyLength: number` - Length of history to display
- **Child Components**: FrequencyBars, HistoryGraph

### 3. **FrequencyBars** (`src/components/FrequencyBars.tsx`)

- **Purpose**: Displays real-time frequency spectrum as vertical bars
- **Props**:
  - `frequencyBars: number[]` - Array of frequency values (0-1)
  - `isListening: boolean` - Controls bar opacity and colors
- **Features**: Dynamic color coding based on frequency intensity

### 4. **HistoryGraph** (`src/components/HistoryGraph.tsx`)

- **Purpose**: SVG-based line chart showing decibel level history
- **Props**:
  - `dbHistory: number[]` - Historical decibel readings
  - `historyLength: number` - Number of data points to display
- **Features**: Gradient fill, grid lines, responsive scaling

### 5. **MainMeter** (`src/components/MainMeter.tsx`)

- **Purpose**: Central circular decibel meter with controls
- **Props**:
  - `isListening: boolean` - Current listening state
  - `decibels: number` - Current decibel reading
  - `currentLevel: NoiseLevel` - Current noise level object
  - `displayLevel: NoiseLevel` - Stable display level
  - `displayPercent: number` - Percentage for circular progress
  - `glowColors: Record<string, string>` - Glow effect colors
  - `onStart: () => void` - Start listening callback
  - `onStop: () => void` - Stop listening callback
- **Features**: Animated rings, glow effects, start/stop button
- **Child Components**: Legend

### 6. **Legend** (`src/components/Legend.tsx`)

- **Purpose**: Color-coded legend for noise levels
- **Props**: None
- **Features**: Displays Quiet, Normal, Loud, and Too Loud indicators

### 7. **SessionStats** (`src/components/SessionStats.tsx`)

- **Purpose**: Right panel showing session statistics
- **Props**:
  - `isListening: boolean` - Current listening state
  - `peakDecibels: number` - Peak decibel reading
  - `avgDecibels: number` - Average decibel reading
  - `sessionTime: number` - Session duration in seconds
  - `peakLevel: NoiseLevel` - Peak noise level object
  - `onResetPeak: () => void` - Reset peak callback
  - `formatTime: (seconds: number) => string` - Time formatting function
- **Child Components**: StatsCard (used 3 times)

### 8. **StatsCard** (`src/components/StatsCard.tsx`)

- **Purpose**: Reusable card component for displaying statistics
- **Props**:
  - `label: string` - Card label
  - `value: string | number` - Value to display
  - `unit?: string` - Optional unit (e.g., "dB")
  - `color?: string` - Optional text color class
  - `action?: ReactNode` - Optional action button/element
- **Features**: Consistent styling, flexible content

## Data Flow

1. **Audio Processing** (DecibelMeter)
   - Captures microphone input
   - Analyzes frequency and amplitude data
   - Updates state with processed values

2. **State Distribution**
   - DecibelMeter passes data as props to child components
   - Each component receives only the data it needs
   - Callbacks flow up for user interactions

3. **Rendering**
   - Components render based on received props
   - Visual effects respond to state changes
   - Real-time updates via React state management

## Benefits of This Structure

1. **Separation of Concerns**: Each component has a single, well-defined responsibility
2. **Reusability**: Components like StatsCard can be used multiple times
3. **Maintainability**: Easier to locate and fix bugs in specific components
4. **Testability**: Smaller components are easier to unit test
5. **Readability**: Main component is much cleaner and easier to understand
6. **Scalability**: Easy to add new features or modify existing ones

## File Structure

```
src/
├── components/
│   ├── ui/
│   │   └── button.tsx
│   ├── FrequencyBars.tsx
│   ├── FrequencyVisualizer.tsx
│   ├── HistoryGraph.tsx
│   ├── Legend.tsx
│   ├── MainMeter.tsx
│   ├── SessionStats.tsx
│   ├── StatsCard.tsx
│   └── index.ts
└── decibel-meter.tsx
```

## Usage Example

```tsx
import { DecibelMeter } from "./decibel-meter";

function App() {
  return <DecibelMeter />;
}
```

The DecibelMeter component handles everything internally and renders all child components automatically.
