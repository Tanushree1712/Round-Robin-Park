import React from 'react';
import { SimulationSnapshot } from '../types/scheduler';
import { ChildAvatar } from './ChildAvatar';
import { Trophy, CheckCircle, BarChart3, Clock, Zap, X } from 'lucide-react';

interface ResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  snapshot: SimulationSnapshot;
  onRestart: () => void;
}

export const ResultsModal: React.FC<ResultsModalProps> = ({
  isOpen,
  onClose,
  snapshot,
  onRestart,
}) => {
  if (!isOpen) return null;

  const { processes, ganttHistory, metrics, time } = snapshot;
  const processList = Object.values(processes);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none">
      <div className="bg-[#0B0F1A] border border-slate-700 rounded-2xl w-full max-w-4xl shadow-2xl text-slate-100 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header with Celebration Banner */}
        <div className="bg-gradient-to-r from-purple-900/60 via-indigo-900/40 to-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-white">
                Round Robin Simulation Completed! 🎉
              </h2>
              <p className="text-xs text-slate-300">
                All children completed their playground slides & all processes terminated.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Key Scheduling Performance Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                <span>Avg Waiting Time</span>
                <Clock className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <div className="font-mono-code text-xl font-bold text-white">
                {metrics.avgWaitTime} <span className="text-xs text-slate-400 font-normal">units</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Average time in ready queue</p>
            </div>

            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                <span>Avg Turnaround</span>
                <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <div className="font-mono-code text-xl font-bold text-white">
                {metrics.avgTurnaroundTime} <span className="text-xs text-slate-400 font-normal">units</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Completion Time - Arrival Time</p>
            </div>

            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                <span>Avg Response</span>
                <Zap className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="font-mono-code text-xl font-bold text-white">
                {metrics.avgResponseTime} <span className="text-xs text-slate-400 font-normal">units</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">First CPU dispatch - Arrival</p>
            </div>

            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                <span>CPU Utilization</span>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="font-mono-code text-xl font-bold text-emerald-400">
                {metrics.cpuUtilization}%
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Total run: {time} units</p>
            </div>

          </div>

          {/* Final Amusement Park Celebration Lawn */}
          <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-sky-950/60 rounded-xl p-4 border border-emerald-800/40">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wide flex items-center gap-1.5">
                <span>🎡</span>
                <span>Amusement Park Playground Celebration</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                100% Slides Completed!
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 py-2">
              {processList.map((proc) => (
                <div key={proc.id} className="flex flex-col items-center">
                  <ChildAvatar
                    id={proc.id}
                    name={proc.name}
                    color={proc.color}
                    avatarSeed={proc.avatarSeed}
                    status="COMPLETED"
                    size="md"
                    showCard={true}
                    remainingSlides={0}
                    totalSlides={proc.burstTime}
                  />
                  <span className="text-[10px] font-mono-code text-emerald-300 mt-1">
                    Finished at t={proc.completionTime}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Final Gantt Chart */}
          <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
              Final Complete Gantt Chart (0 → {time} units)
            </span>
            <div className="overflow-x-auto pb-1">
              <div className="min-w-[500px] flex flex-col">
                <div className="flex h-10 bg-slate-950 rounded-lg overflow-hidden border border-slate-800">
                  {ganttHistory.map((slice, index) => {
                    const duration = slice.endTime - slice.startTime;
                    return (
                      <div
                        key={index}
                        className={`h-full flex flex-col items-center justify-center text-xs font-mono-code font-bold border-r border-slate-950/50 ${
                          slice.isIdle ? 'bg-slate-800 text-slate-400' : 'text-white'
                        }`}
                        style={{
                          flexGrow: duration,
                          backgroundColor: slice.isIdle ? undefined : slice.color,
                        }}
                      >
                        <span>{slice.isIdle ? 'IDLE' : slice.processId}</span>
                        <span className="text-[9px] opacity-75 font-normal">
                          {duration}u
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between text-[9px] font-mono-code text-slate-400 mt-1 px-1">
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

          {/* Comprehensive Process Metrics Table */}
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/60">
            <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">
                Detailed Process Timing & Formula Verifications
              </span>
              <span className="text-[10px] text-slate-400 font-mono-code">
                WT = TAT - BT · RT = First Start - AT
              </span>
            </div>
            <table className="w-full text-left text-xs font-mono-code">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 text-[11px] uppercase">
                  <th className="py-2 px-3">Process</th>
                  <th className="py-2 px-3 text-right">Arrival Time (AT)</th>
                  <th className="py-2 px-3 text-right">Burst Time (BT)</th>
                  <th className="py-2 px-3 text-right">Completion (CT)</th>
                  <th className="py-2 px-3 text-right">Turnaround (TAT)</th>
                  <th className="py-2 px-3 text-right">Wait Time (WT)</th>
                  <th className="py-2 px-3 text-right">Response (RT)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {processList.map((proc) => (
                  <tr key={proc.id} className="hover:bg-slate-800/40">
                    <td className="py-2 px-3 flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: proc.color }}
                      />
                      <span className="font-bold text-white">{proc.name} ({proc.id})</span>
                    </td>
                    <td className="py-2 px-3 text-right">{proc.arrivalTime}</td>
                    <td className="py-2 px-3 text-right">{proc.burstTime}</td>
                    <td className="py-2 px-3 text-right font-bold text-white">{proc.completionTime}</td>
                    <td className="py-2 px-3 text-right text-blue-400 font-bold">{proc.turnaroundTime}</td>
                    <td className="py-2 px-3 text-right text-purple-400 font-bold">{proc.waitingTime}</td>
                    <td className="py-2 px-3 text-right text-amber-400 font-bold">{proc.responseTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/60">
          <span className="text-xs text-slate-400">
            Total simulation time: <b className="text-white">{time} units</b>
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onRestart();
              }}
              className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-lg shadow-md transition-colors"
            >
              Restart Simulation
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
