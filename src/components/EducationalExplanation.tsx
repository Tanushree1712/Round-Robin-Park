import React, { useState } from 'react';
import { StepExplanation } from '../types/scheduler';
import { Lightbulb, Info, ArrowRightLeft, BookOpen } from 'lucide-react';

interface EducationalExplanationProps {
  explanation: StepExplanation;
  timeQuantum: number;
  onOpenAnalogy: () => void;
}

export const EducationalExplanation: React.FC<EducationalExplanationProps> = ({
  explanation,
  timeQuantum,
  onOpenAnalogy,
}) => {
  const [activeTab, setActiveTab] = useState<'both' | 'park' | 'os'>('both');

  return (
    <div className="bg-[#0F172A] border-t border-slate-800 p-4 select-none shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch gap-4">
        
        {/* Left concept badge */}
        <div className="flex md:flex-col justify-between items-start shrink-0 min-w-[200px] border-b md:border-b-0 md:border-r border-slate-800 pb-3 md:pb-0 md:pr-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                Synchronized Event
              </span>
              <span className="text-xs font-bold text-amber-300">
                {explanation.highlightTerm || 'Round Robin Tick'}
              </span>
            </div>
          </div>

          {/* Quick Concept Cheatsheet Button */}
          <button
            onClick={onOpenAnalogy}
            className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 transition-colors font-medium mt-2 group"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="underline underline-offset-2">Mapping Table</span>
          </button>
        </div>

        {/* Center: Dual commentary cards */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
          
          {/* Amusement Park Narrative */}
          <div className="bg-gradient-to-r from-sky-950/40 to-slate-900 rounded-lg p-3 border border-sky-800/40 shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wide flex items-center gap-1">
                <span>🎡</span>
                <span>Amusement Park World</span>
              </span>
              <span className="text-[9px] text-sky-500 font-mono-code">Playground Action</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              {explanation.parkCommentary}
            </p>
          </div>

          {/* Operating System Technical Terminology */}
          <div className="bg-gradient-to-r from-purple-950/40 to-slate-900 rounded-lg p-3 border border-purple-800/40 shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wide flex items-center gap-1">
                <span>⚙️</span>
                <span>Operating System World</span>
              </span>
              <span className="text-[9px] text-purple-500 font-mono-code">CPU Scheduler Action</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              {explanation.osCommentary}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
