import React, { useState } from 'react';
import {
  Cpu,
  Layers,
  BarChart2,
  Table as TableIcon,
  ArrowRight,
  RotateCcw,
  Activity,
} from 'lucide-react';
import { ProcessState, GanttSlice, StepExplanation } from '../types/scheduler';

interface OsDashboardViewProps {
  processes: Record<string, ProcessState>;
  readyQueue: string[];
  runningProcessId: string | null;
  ganttHistory: GanttSlice[];
  quantumRemaining: number;
  timeQuantum: number;
  currentTime: number;
  explanation: StepExplanation;
}

export const OsDashboardView: React.FC<OsDashboardViewProps> = ({
  processes,
  readyQueue,
  runningProcessId,
  ganttHistory,
  quantumRemaining,
  timeQuantum,
  currentTime,
  explanation,
}) => {
  const [activeTab, setActiveTab] = useState<'stream' | 'table'>('stream');

  const runningProcess = runningProcessId ? processes[runningProcessId] : null;
  const isIdle = runningProcessId === null;
  const isPreempted = explanation.actionType === 'PREEMPTION';
  const processList = Object.values(processes);

  // Total span for Gantt
  const totalGanttTime = Math.max(16, currentTime + 2);

  return (
    <div className="flex flex-col h-full bg-[#0B0F1A] text-slate-100 overflow-hidden relative select-none p-4 min-h-[580px]">
      
      {/* Top Header: Calm, clean 2-zone header with Segmented View Switcher */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 gap-3">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full transition-all ${
              isIdle
                ? 'bg-amber-400'
                : 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]'
            }`}
          />
          <span className="font-display font-semibold text-xs text-slate-200 tracking-wide">
            OPERATING SYSTEM VISUALIZER
          </span>
          <span className="text-[10px] text-slate-500 font-mono-code hidden sm:inline">
            Tick: t = {currentTime}
          </span>
        </div>

        {/* View Segmented Tabs: De-clutters the view and provides generous breathing room! */}
        <div className="flex items-center p-0.5 bg-slate-900 border border-slate-800 rounded-lg text-xs">
          <button
            onClick={() => setActiveTab('stream')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'stream'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Live Stream</span>
          </button>
          <button
            onClick={() => setActiveTab('table')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'table'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Process Table</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col justify-between gap-3 pt-3 overflow-y-auto">
        
        {activeTab === 'stream' ? (
          /* TAB 1: CALM, SLEEK LIVE STREAM (CPU + READY QUEUE + GANTT) */
          <div className="flex-1 flex flex-col justify-between gap-3">
            
            {/* TOP ROW: CPU Core Card & FIFO Ready Queue Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              
              {/* CPU CORE CARD */}
              <div
                className={`rounded-xl p-4 border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                  isIdle
                    ? 'bg-slate-900/40 border-slate-800'
                    : 'bg-slate-900/90 border-purple-500/60 shadow-lg shadow-purple-950/40 animate-cpu-active'
                }`}
              >
                {/* Microprocessor Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                    <Cpu className={`w-4 h-4 ${isIdle ? 'text-slate-500' : 'text-purple-400 animate-pulse'}`} />
                    <span>CPU Core 0</span>
                  </div>
                  <span
                    className={`text-[10px] font-mono-code font-semibold px-2 py-0.5 rounded ${
                      isIdle
                        ? 'bg-slate-800 text-slate-400'
                        : 'bg-emerald-950 text-emerald-400 border border-emerald-800/80'
                    }`}
                  >
                    {isIdle ? 'STANDBY / IDLE' : 'BUSY EXEC'}
                  </span>
                </div>

                {/* Central Microprocessor Core Visual */}
                <div className="py-2 flex flex-col items-center justify-center">
                  {isIdle ? (
                    <div className="py-4 text-center">
                      <div className="w-12 h-12 rounded-xl bg-slate-800/60 border border-slate-700/60 mx-auto mb-2 flex items-center justify-center text-slate-500">
                        <Cpu className="w-6 h-6" />
                      </div>
                      <span className="font-mono-code text-xs font-bold text-slate-400">
                        CPU IDLE
                      </span>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        Slide is empty · Awaiting arriving process
                      </p>
                    </div>
                  ) : (
                    <div className="w-full">
                      {/* Active Process Title */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3.5 h-3.5 rounded-full ring-2 ring-slate-900 shrink-0 shadow-sm"
                            style={{ backgroundColor: runningProcess?.color }}
                          />
                          <span className="font-mono-code font-bold text-lg text-white">
                            {runningProcess?.id}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">
                            ({runningProcess?.name})
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                            Burst Left
                          </span>
                          <span className="font-mono-code font-bold text-sm text-emerald-400">
                            {runningProcess?.remainingBurst} / {runningProcess?.burstTime}
                          </span>
                        </div>
                      </div>

                      {/* Quantum Countdown Digital Bar */}
                      <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80">
                        <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1.5 font-mono-code">
                          <span className="flex items-center gap-1">
                            <span>Quantum Countdown</span>
                            <span className="text-purple-400 font-bold">({quantumRemaining} / {timeQuantum})</span>
                          </span>
                          <span className="text-amber-400 font-bold">
                            {Math.round((quantumRemaining / timeQuantum) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5">
                          <div
                            className="bg-gradient-to-r from-purple-500 via-indigo-400 to-emerald-400 h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${(quantumRemaining / timeQuantum) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Preemption notification badge */}
                {isPreempted && (
                  <div className="mt-1 bg-amber-950/80 border border-amber-700 text-amber-300 text-[10px] font-mono-code font-semibold px-2 py-1 rounded flex items-center gap-1.5 animate-pulse">
                    <RotateCcw className="w-3 h-3 text-amber-400" />
                    <span>Time Quantum Expired → Preempted to queue tail</span>
                  </div>
                )}
              </div>

              {/* FIFO READY QUEUE CARD */}
              <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                    <Layers className="w-4 h-4 text-emerald-400" />
                    <span>Ready Queue (FIFO)</span>
                  </div>
                  <span className="text-[10px] font-mono-code text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    Front → Tail ({readyQueue.length})
                  </span>
                </div>

                {/* Queue Conveyor */}
                <div className="flex-1 flex flex-col justify-center py-2">
                  {readyQueue.length === 0 ? (
                    <div className="py-5 text-center text-xs text-slate-500 italic bg-slate-950/30 rounded-lg border border-dashed border-slate-800/80">
                      No processes waiting in the Ready Queue.
                    </div>
                  ) : (
                    <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                      {readyQueue.map((pid, idx) => {
                        const proc = processes[pid];
                        if (!proc) return null;
                        return (
                          <div
                            key={pid}
                            className="flex flex-col shrink-0 p-2.5 rounded-lg bg-slate-950 border border-slate-800 min-w-[92px] shadow-sm relative hover:border-purple-500 transition-all transform hover:-translate-y-0.5"
                          >
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: proc.color }}
                              />
                              <span className="font-mono-code font-bold text-xs text-white">
                                {proc.id}
                              </span>
                              <span className="text-[9px] font-mono-code text-slate-500 bg-slate-900 px-1 rounded">
                                #{idx + 1}
                              </span>
                            </div>
                            <div className="text-[10px] font-mono-code text-slate-400 flex justify-between">
                              <span>Rem:</span>
                              <span className="text-emerald-400 font-bold">{proc.remainingBurst}u</span>
                            </div>
                            <div className="text-[9px] font-mono-code text-slate-500 flex justify-between mt-0.5">
                              <span>AT:</span>
                              <span>t={proc.arrivalTime}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Queue Footer status */}
                <div className="text-[10px] text-slate-500 pt-1.5 border-t border-slate-800/80 flex items-center justify-between font-mono-code">
                  <span className="flex items-center gap-1">
                    <ArrowRight className="w-3 h-3 text-purple-400" />
                    <span>Next to dispatch:</span>
                  </span>
                  <span className="font-bold text-purple-300">
                    {readyQueue.length > 0 ? readyQueue[0] : 'None (Idle)'}
                  </span>
                </div>
              </div>

            </div>

            {/* LIVE GANTT TIMELINE */}
            <div className="bg-slate-900/60 rounded-xl p-3.5 border border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                  <BarChart2 className="w-4 h-4 text-cyan-400" />
                  <span>Live Gantt Execution Timeline</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono-code">
                  Elapsed: 0 → {currentTime} units
                </span>
              </div>

              {/* Gantt Bar */}
              <div className="overflow-x-auto pb-1">
                <div className="min-w-[440px] flex flex-col">
                  <div className="flex h-10 bg-slate-950 rounded-lg overflow-hidden border border-slate-800 relative shadow-inner">
                    {ganttHistory.length === 0 ? (
                      <div className="w-full flex items-center justify-center text-xs text-slate-500 font-mono-code">
                        Simulation at t=0 · Ready for first dispatch...
                      </div>
                    ) : (
                      ganttHistory.map((slice, index) => {
                        const duration = slice.endTime - slice.startTime;
                        return (
                          <div
                            key={slice.id || index}
                            className={`h-full flex flex-col items-center justify-center text-xs font-mono-code font-bold transition-all relative border-r border-slate-950/60 ${
                              slice.isIdle ? 'bg-slate-800/80 text-slate-400' : 'text-white'
                            }`}
                            style={{
                              flexGrow: duration,
                              backgroundColor: slice.isIdle ? undefined : slice.color,
                            }}
                            title={`${slice.processName}: t=${slice.startTime} to t=${slice.endTime} (Duration: ${duration} units)`}
                          >
                            <span className="text-[11px] truncate px-1 font-bold">
                              {slice.isIdle ? 'IDLE' : slice.processId}
                            </span>
                            <span className="text-[9px] opacity-75 font-normal">
                              {duration}u
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Tick Marks along axis */}
                  <div className="flex justify-between text-[9px] font-mono-code text-slate-500 mt-1 px-1">
                    <span>0</span>
                    {ganttHistory.map((slice, idx) => (
                      <span key={idx} style={{ flexGrow: slice.endTime - slice.startTime, textAlign: 'right' }}>
                        {slice.endTime}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Process Status Overview Bar */}
            <div className="bg-slate-900/40 rounded-xl p-2.5 border border-slate-800 flex items-center justify-between overflow-x-auto text-xs font-mono-code">
              <span className="text-[10px] text-slate-500 uppercase font-bold shrink-0 mr-2">
                Process States:
              </span>
              <div className="flex items-center gap-3">
                {processList.map((p) => (
                  <div key={p.id} className="flex items-center gap-1.5 shrink-0">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: p.color }}
                    />
                    <span className="font-bold text-white text-[11px]">{p.id}:</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                        p.status === 'RUNNING'
                          ? 'bg-purple-900 text-purple-200 border border-purple-600'
                          : p.status === 'COMPLETED'
                          ? 'bg-emerald-950 text-emerald-300'
                          : p.status === 'PREEMPTED'
                          ? 'bg-amber-950 text-amber-300'
                          : p.status === 'WAITING'
                          ? 'bg-blue-950 text-blue-300'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {p.status === 'RUNNING' ? `EXEC (${p.remainingBurst} left)` : p.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          /* TAB 2: DETAILED PROCESS EXECUTION TABLE WITH FORMULAS */
          <div className="flex-1 flex flex-col justify-between bg-slate-900/60 rounded-xl p-4 border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                <TableIcon className="w-4 h-4 text-purple-400" />
                <span>Process Timing & Scheduling Formulas</span>
              </div>
              <span className="text-[10px] font-mono-code text-slate-400">
                TAT = CT - AT · WT = TAT - BT · RT = First Start - AT
              </span>
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left text-sm font-mono-code">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase bg-slate-950/60">
                    <th className="py-3 px-3">Process</th>
                    <th className="py-3 px-3 text-right">AT</th>
                    <th className="py-3 px-3 text-right">BT</th>
                    <th className="py-3 px-3 text-right">Rem BT</th>
                    <th className="py-3 px-3 text-right">CT</th>
                    <th className="py-3 px-3 text-right">TAT</th>
                    <th className="py-3 px-3 text-right">WT</th>
                    <th className="py-3 px-3 text-right">RT</th>
                    <th className="py-3 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {processList.map((proc) => {
                    const isCurrent = proc.id === runningProcessId;
                    return (
                      <tr
                        key={proc.id}
                        className={`transition-colors ${
                          isCurrent
                            ? 'bg-purple-950/40 text-purple-200 font-bold'
                            : proc.status === 'COMPLETED'
                            ? 'text-slate-300'
                            : 'text-slate-400'
                        }`}
                      >
                        <td className="py-3 px-3 flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: proc.color }}
                          />
                          <span className="font-bold text-white">{proc.id}</span>
                          <span className="text-xs text-slate-500 font-normal">({proc.name})</span>
                        </td>
                        <td className="py-3 px-3 text-right">{proc.arrivalTime}</td>
                        <td className="py-3 px-3 text-right">{proc.burstTime}</td>
                        <td className="py-3 px-3 text-right text-emerald-400 font-bold">
                          {proc.remainingBurst}
                        </td>
                        <td className="py-3 px-3 text-right">
                          {proc.completionTime !== undefined ? proc.completionTime : '—'}
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-blue-400">
                          {proc.turnaroundTime !== undefined ? proc.turnaroundTime : '—'}
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-purple-400">
                          {proc.waitingTime !== undefined ? proc.waitingTime : '—'}
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-amber-400">
                          {proc.responseTime !== undefined ? proc.responseTime : '—'}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                              proc.status === 'RUNNING'
                                ? 'bg-purple-900 text-purple-200 border border-purple-500 animate-pulse'
                                : proc.status === 'COMPLETED'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                                : proc.status === 'PREEMPTED'
                                ? 'bg-amber-950 text-amber-300 border border-amber-700'
                                : proc.status === 'WAITING'
                                ? 'bg-blue-950 text-blue-300 border border-blue-700'
                                : 'bg-slate-800 text-slate-500'
                            }`}
                          >
                            {proc.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Explanatory footer card */}
            <div className="mt-3 p-3 bg-slate-950/80 rounded-lg border border-slate-800/80 text-[11px] text-slate-400 font-mono-code grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <span className="text-white font-bold block">CT (Completion Time):</span>
                <span>Time at which process finishes all execution.</span>
              </div>
              <div>
                <span className="text-blue-300 font-bold block">TAT (Turnaround Time):</span>
                <span>CT - AT (Total duration in the system).</span>
              </div>
              <div>
                <span className="text-purple-300 font-bold block">WT (Waiting Time):</span>
                <span>TAT - BT (Time spent waiting in queue).</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
