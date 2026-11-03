import React from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  Sparkles,
  BarChart3,
} from 'lucide-react';
import { PRESET_SCENARIOS } from '../utils/scheduler';
import { ProcessInput } from '../types/scheduler';

interface ControlsBarProps {
  isPlaying: boolean;
  onPlayToggle: () => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onReset: () => void;
  currentTime: number;
  maxTime: number;
  canStepNext: boolean;
  canStepPrev: boolean;
  playbackSpeed: number;
  onSpeedChange: (speed: number) => void;
  onSelectPreset: (scenario: { name: string; quantum: number; processes: ProcessInput[] }) => void;
  isAllCompleted: boolean;
  onOpenResults: () => void;
}

export const ControlsBar: React.FC<ControlsBarProps> = ({
  isPlaying,
  onPlayToggle,
  onNextStep,
  onPrevStep,
  onReset,
  currentTime,
  maxTime,
  canStepNext,
  canStepPrev,
  playbackSpeed,
  onSpeedChange,
  onSelectPreset,
  isAllCompleted,
  onOpenResults,
}) => {
  const speeds = [0.5, 1, 2, 4];

  return (
    <div className="bg-[#10172A] border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-slate-200 select-none shadow-sm">
      {/* Left: Playback controls */}
      <div className="flex items-center gap-2">
        {/* Play / Pause button */}
        <button
          onClick={onPlayToggle}
          disabled={isAllCompleted && !isPlaying}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
            isPlaying
              ? 'bg-amber-500 hover:bg-amber-400 text-amber-950 shadow-md shadow-amber-500/20'
              : isAllCompleted
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-emerald-500 hover:bg-emerald-400 text-emerald-950 shadow-md shadow-emerald-500/20'
          }`}
          title={isPlaying ? 'Pause simulation' : isAllCompleted ? 'Simulation completed' : 'Start simulation'}
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
          <span>{isPlaying ? 'PAUSE' : currentTime === 0 ? 'START SIMULATION' : 'RESUME'}</span>
        </button>

        {/* Previous Step */}
        <button
          onClick={onPrevStep}
          disabled={!canStepPrev || isPlaying}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 transition-colors text-slate-300 border border-slate-700"
          title="Go back 1 time unit (t - 1)"
        >
          <SkipBack className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Prev Unit</span>
        </button>

        {/* Next Step */}
        <button
          onClick={onNextStep}
          disabled={!canStepNext || isPlaying}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-purple-900/60 hover:bg-purple-800/80 active:bg-purple-800 text-purple-200 border border-purple-700 disabled:opacity-40 disabled:hover:bg-purple-900/60 transition-colors shadow-sm"
          title="Advance exactly 1 simulation time unit (1 slide / 1 CPU burst tick)"
        >
          <span>NEXT STEP</span>
          <SkipForward className="w-3.5 h-3.5" />
        </button>

        {/* Reset */}
        <button
          onClick={onReset}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          title="Reset simulation to t=0"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Reset</span>
        </button>

        {/* View Results Button */}
        {isAllCompleted && (
          <button
            onClick={onOpenResults}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400 transition-all animate-pulse"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>View Final Results</span>
          </button>
        )}
      </div>

      {/* Center: Current Time & Step explanation pill */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-slate-900 px-3 py-1 rounded-lg border border-slate-700">
          <span className="text-[11px] text-slate-400 uppercase font-semibold">Sim Time</span>
          <span className="font-mono-code font-bold text-sm text-purple-300">
            t = {currentTime}
          </span>
          <span className="text-slate-600 text-xs">/ {maxTime}</span>
        </div>

        {/* Speed Controller */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-700 text-xs">
          <span className="text-[10px] text-slate-400 px-1 font-semibold uppercase">Speed:</span>
          {speeds.map((s) => (
            <button
              key={s}
              onClick={() => onSpeedChange(s)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono-code font-bold transition-colors ${
                playbackSpeed === s
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Right: Quick Presets */}
      <div className="hidden lg:flex items-center gap-2">
        <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Presets:</span>
        </span>
        <select
          onChange={(e) => {
            const chosen = PRESET_SCENARIOS[Number(e.target.value)];
            if (chosen) {
              onSelectPreset(chosen);
            }
          }}
          className="bg-slate-900 text-slate-200 border border-slate-700 rounded-md text-xs px-2.5 py-1 focus:outline-none focus:border-purple-500"
          defaultValue="0"
        >
          {PRESET_SCENARIOS.map((scenario, idx) => (
            <option key={scenario.name} value={idx}>
              {scenario.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
