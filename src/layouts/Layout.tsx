import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Mic, LogOut, User } from "lucide-react";
import type { ReactNode } from "react";

export function Layout({ children }: { children: ReactNode }) {
  const { user, isGuest, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-cyan-500/30 flex flex-col">
      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-b border-white/5 bg-slate-950/50 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 group-hover:bg-cyan-500/20 transition-colors">
              <Mic className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
              Decibel<span className="font-light text-cyan-400">Detector</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/detector"
              className={`text-sm font-medium transition-colors hover:text-cyan-400 ${
                location.pathname === "/detector"
                  ? "text-cyan-400"
                  : "text-slate-400"
              }`}
            >
              Detector
            </Link>

            {(user || isGuest) && (
              <Link
                to="/dashboard"
                className={`text-sm font-medium transition-colors hover:text-cyan-400 ${
                  location.pathname === "/dashboard"
                    ? "text-cyan-400"
                    : "text-slate-400"
                }`}
              >
                History
              </Link>
            )}

            <div className="h-4 w-px bg-white/10 mx-2" />

            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{user.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-red-400 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : isGuest ? (
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono px-2 py-1 rounded bg-white/5 text-slate-500 border border-white/5">
                  GUEST MODE
                </span>
                <button
                  onClick={logout}
                  className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
                >
                  Exit
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-semibold text-sm hover:bg-cyan-400 transition-colors shadow-[0_0_15px_-3px_rgba(6,182,212,0.4)]"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex-1 container mx-auto py-8">
        {children}
      </main>
    </div>
  );
}
