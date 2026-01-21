import { DecibelMeter } from "@/components/DecibelMeter";

export function DetectorPage() {
  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
      <div className="mb-8 text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          Real-time Monitor
        </h1>
        <p className="text-slate-400">
          Measure ambient noise levels and frequency distribution
        </p>
      </div>
      <DecibelMeter />
    </div>
  );
}
