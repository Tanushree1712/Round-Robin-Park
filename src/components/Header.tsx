import React from 'react';
import { SlidersHorizontal, BookOpen, RotateCcw } from 'lucide-react';

interface HeaderProps {
  onOpenConfig: () => void;
  onOpenAnalogy: () => void;
  onReset: () => void;
  timeQuantum: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenConfig,
  onOpenAnalogy,
  onReset,
  timeQuantum,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 bg-[#0B0F1A] border-b border-slate-800 text-white select-none">
      {/* Zone 1: Brand Wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19 L10 5 L14 12 L20 19" />
            <circle cx="10" cy="5" r="2" fill="currentColor" />
          </svg>
        </div>
        <div className="flex flex-col">
          <a href="#" className="text-base font-bold font-display tracking-tight text-white whitespace-nowrap hover:text-purple-300 transition-colors">
            Round Robin Park
          </a>
          <span className="text-[10px] text-slate-400 font-medium">Dual-World CPU Scheduler Simulator</span>
        </div>
      </div>

      {/* Zone 2: Clean single-line nav links */}
      <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
        <button
          onClick={onOpenAnalogy}
          className="flex items-center gap-1.5 hover:text-white transition-colors whitespace-nowrap"
        >
          <BookOpen className="w-3.5 h-3.5 text-purple-400" />
          <span>Analogy Concept Guide</span>
        </button>
        <span className="text-slate-700">·</span>
        <div className="flex items-center gap-1.5 text-slate-300">
          <span className="text-slate-400">Time Quantum:</span>
          <span className="font-mono-code font-bold text-emerald-400 bg-slate-800/80 px-2 py-0.5 rounded text-[11px] border border-slate-700">
            {timeQuantum} slides / burst
          </span>
        </div>
        <span className="text-slate-700">·</span>
        <button
          onClick={onReset}
          className="flex items-center gap-1 hover:text-amber-300 transition-colors whitespace-nowrap"
          title="Restart simulation from t=0"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
          <span>Reset Time</span>
        </button>
      </nav>

      {/* Zone 3: Primary Action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onOpenConfig}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 active:bg-purple-700 rounded-lg shadow-sm transition-all whitespace-nowrap"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Configure Children & TQ</span>
        </button>
      </div>
    </header>
  );
};
