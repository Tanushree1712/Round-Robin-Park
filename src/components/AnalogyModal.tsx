import React from 'react';
import { X, BookOpen, ArrowRight, Lightbulb } from 'lucide-react';

interface AnalogyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AnalogyModal: React.FC<AnalogyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const analogyMappings = [
    { park: 'Child', os: 'Process', desc: 'An independent entity requiring work / play time.' },
    { park: "Child's arrival at park gates", os: 'Arrival Time (AT)', desc: 'The exact timestamp when the entity enters the system.' },
    { park: 'Total number of slides required', os: 'Burst Time (BT)', desc: 'Total execution time needed to complete the entire job.' },
    { park: 'Maximum slides allowed per visit', os: 'Time Quantum (TQ)', desc: 'The fixed slice of CPU time allocated before mandatory preemption.' },
    { park: 'Playground Slide', os: 'CPU Core', desc: 'The single shared computational resource that performs work.' },
    { park: 'Waiting children in line', os: 'Ready Queue', desc: 'FIFO queue of processes waiting for their turn on the CPU.' },
    { park: 'Child playing on the slide', os: 'Running Process', desc: 'The currently active process consuming CPU cycles.' },
    { park: 'Child returning to back of queue', os: 'Preempted Process', desc: 'Process whose quantum expired, yielding CPU back to the queue.' },
    { park: 'Child finishing all slides', os: 'Process Completion', desc: 'Process finishes all burst time and leaves the system permanently.' },
    { park: 'Time spent changing children', os: 'Context Switching', desc: 'Overhead of saving previous state and loading next process.' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none">
      <div className="bg-[#0B0F1A] border border-slate-700 rounded-2xl w-full max-w-3xl shadow-2xl text-slate-100 flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-white">
                The Round Robin Analogy Guide
              </h2>
              <p className="text-xs text-slate-400">
                How playground slides teach CPU scheduling intuitively.
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* Core concept banner */}
          <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-800/60 text-xs leading-relaxed text-purple-200 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white mb-1">
                The Golden Rule: 1 Slide = 1 Unit of CPU Burst Time
              </p>
              <p className="text-slate-300">
                In Round Robin scheduling, the CPU is shared fairly among all ready tasks. No single job can monopolize the slide forever. When their Time Quantum expires, they must head to the back of the line so other children get their turn!
              </p>
            </div>
          </div>

          {/* Mapping Table */}
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/40">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900 text-slate-400 text-[11px] uppercase">
                  <th className="py-2.5 px-4 font-bold text-sky-400">Amusement Park Analogy</th>
                  <th className="py-2.5 px-4 font-bold text-purple-400">Operating System Concept</th>
                  <th className="py-2.5 px-4 font-bold text-slate-400">What It Means</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {analogyMappings.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 px-4 font-medium text-slate-200 flex items-center gap-2">
                      <span className="text-sky-400 font-bold">🎡</span>
                      <span>{item.park}</span>
                    </td>
                    <td className="py-2.5 px-4 font-mono-code font-bold text-purple-300">
                      {item.os}
                    </td>
                    <td className="py-2.5 px-4 text-slate-400">
                      {item.desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Formulas cheat card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                Turnaround Time (TAT)
              </span>
              <span className="font-mono-code text-xs text-white font-bold">
                TAT = CT - AT
              </span>
              <p className="text-[10px] text-slate-400 mt-1">Total time spent in the system from arrival to exit.</p>
            </div>
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                Waiting Time (WT)
              </span>
              <span className="font-mono-code text-xs text-white font-bold">
                WT = TAT - BT
              </span>
              <p className="text-[10px] text-slate-400 mt-1">Time spent waiting in the queue without being on the slide.</p>
            </div>
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                Response Time (RT)
              </span>
              <span className="font-mono-code text-xs text-white font-bold">
                RT = First Start - AT
              </span>
              <p className="text-[10px] text-slate-400 mt-1">Time until the child/process gets their first turn.</p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 flex justify-end bg-slate-950/60">
          <button
            onClick={onClose}
            className="px-5 py-1.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors"
          >
            Got It!
          </button>
        </div>

      </div>
    </div>
  );
};
