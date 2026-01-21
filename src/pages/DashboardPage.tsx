import { useState } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { AlertTriangle, Activity, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Mock data generation
const generateMockHistory = (points: number) => {
  const now = Date.now();
  const data = [];
  for (let i = 0; i < points; i++) {
    // Generate a somewhat realistic noise pattern (sine wave + random noise)
    const time = now - (points - i) * 1000 * 60 * 5; // 5 min intervals
    const base = 45 + Math.sin(i * 0.1) * 15;
    const noise = Math.random() * 20 - 10;
    const value = Math.max(30, Math.min(100, Math.round(base + noise)));

    data.push({
      timestamp: time,
      timeLabel: new Date(time).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      value: value,
      level: value > 85 ? "Critical" : value > 70 ? "Loud" : "Normal",
    });
  }
  return data;
};

export function DashboardPage() {
  const { user, isGuest } = useAuth();
  // Generate mock data only once on mount
  const [data] = useState(() => generateMockHistory(24)); // 24 points (last 2 hours approx)

  if (isGuest) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
        <div className="p-4 rounded-full bg-slate-800/50 border border-white/10">
          <Activity className="w-12 h-12 text-slate-600" />
        </div>
        <div className="max-w-md mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-slate-200">
            History Unavailable
          </h2>
          <p className="text-slate-400">
            Sign in to view your noise level history, analytics, and critical
            events. Guest sessions are temporary and not saved.
          </p>
        </div>
      </div>
    );
  }

  const maxLevel = Math.max(...data.map((d) => d.value));
  const avgLevel = Math.round(
    data.reduce((acc, curr) => acc + curr.value, 0) / data.length,
  );
  const criticalEvents = data.filter((d) => d.value > 80).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Noise Analytics</h1>
          <p className="text-slate-400">
            Session history for{" "}
            <span className="text-cyan-400">{user?.name || user?.email}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm font-medium hover:bg-slate-700 transition-colors">
            Export CSV
          </button>
          <button className="px-4 py-2 rounded-lg bg-cyan-600 text-white border border-cyan-500 text-sm font-medium hover:bg-cyan-500 transition-colors shadow-lg shadow-cyan-500/20">
            Share Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900 border border-white/5 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity className="w-24 h-24 text-cyan-400" />
          </div>
          <div className="flex items-center gap-3 mb-2 text-cyan-400">
            <Activity className="w-5 h-5" />
            <span className="font-semibold text-sm uppercase tracking-wider">
              Average Level
            </span>
          </div>
          <div className="text-4xl font-bold text-slate-100">{avgLevel} dB</div>
          <div className="text-sm text-slate-500 mt-1">Last 2 hours</div>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900 border border-white/5 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <AlertTriangle className="w-24 h-24 text-orange-400" />
          </div>
          <div className="flex items-center gap-3 mb-2 text-orange-400">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-semibold text-sm uppercase tracking-wider">
              Max Peak
            </span>
          </div>
          <div className="text-4xl font-bold text-slate-100">{maxLevel} dB</div>
          <div className="text-sm text-slate-500 mt-1">
            Recorded at {data.find((d) => d.value === maxLevel)?.timeLabel}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900 border border-white/5 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Calendar className="w-24 h-24 text-purple-400" />
          </div>
          <div className="flex items-center gap-3 mb-2 text-purple-400">
            <Calendar className="w-5 h-5" />
            <span className="font-semibold text-sm uppercase tracking-wider">
              Events
            </span>
          </div>
          <div className="text-4xl font-bold text-slate-100">
            {criticalEvents}
          </div>
          <div className="text-sm text-slate-500 mt-1">Levels above 80dB</div>
        </div>
      </div>

      {/* Main Chart */}
      <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/5 shadow-xl backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-slate-200 mb-6">
          Decibel History
        </h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1e293b"
                vertical={false}
              />
              <XAxis
                dataKey="timeLabel"
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                unit=" dB"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#1e293b",
                  color: "#f1f5f9",
                }}
                itemStyle={{ color: "#22d3ee" }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#06b6d4"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
