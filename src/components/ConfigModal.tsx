import React, { useState } from 'react';
import { ProcessInput } from '../types/scheduler';
import { COLOR_PALETTE, DEFAULT_PROCESSES } from '../utils/scheduler';
import { CHARACTER_PRESETS } from './ChildAvatar';
import { Plus, Trash2, RotateCcw, Check, AlertCircle, X } from 'lucide-react';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  processes: ProcessInput[];
  timeQuantum: number;
  onSave: (processes: ProcessInput[], timeQuantum: number) => void;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({
  isOpen,
  onClose,
  processes: initialProcesses,
  timeQuantum: initialTimeQuantum,
  onSave,
}) => {
  const [localProcesses, setLocalProcesses] = useState<ProcessInput[]>(initialProcesses);
  const [localTQ, setLocalTQ] = useState<number>(initialTimeQuantum);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddProcess = () => {
    const nextIndex = localProcesses.length + 1;
    const newId = `P${nextIndex}`;
    const defaultNames = ['Maya', 'Leo', 'Sam', 'Zoe', 'Chloe', 'Kai'];
    const newProcess: ProcessInput = {
      id: newId,
      name: defaultNames[(nextIndex - 1) % defaultNames.length] || `Child ${newId}`,
      arrivalTime: localProcesses.length > 0 ? localProcesses[localProcesses.length - 1].arrivalTime + 1 : 0,
      burstTime: 3,
      color: COLOR_PALETTE[(nextIndex - 1) % COLOR_PALETTE.length],
      avatarSeed: (nextIndex - 1) % 6,
    };
    setLocalProcesses([...localProcesses, newProcess]);
    setErrorMsg(null);
  };

  const handleRemoveProcess = (id: string) => {
    if (localProcesses.length <= 1) {
      setErrorMsg('At least one child / process is required for simulation.');
      return;
    }
    setLocalProcesses(localProcesses.filter((p) => p.id !== id));
    setErrorMsg(null);
  };

  const handleUpdateProcess = (
    id: string,
    field: keyof ProcessInput,
    value: string | number
  ) => {
    setLocalProcesses(
      localProcesses.map((p) => {
        if (p.id !== id) return p;
        return {
          ...p,
          [field]: value,
        };
      })
    );
    setErrorMsg(null);
  };

  const handleResetDefaults = () => {
    setLocalProcesses(DEFAULT_PROCESSES);
    setLocalTQ(2);
    setErrorMsg(null);
  };

  const handleSaveAndApply = () => {
    // Validation
    if (localProcesses.length === 0) {
      setErrorMsg('At least one process is required.');
      return;
    }

    if (localTQ <= 0 || isNaN(localTQ)) {
      setErrorMsg('Time Quantum must be a positive integer (greater than 0).');
      return;
    }

    for (const p of localProcesses) {
      if (p.arrivalTime < 0 || isNaN(p.arrivalTime)) {
        setErrorMsg(`Process ${p.id} has an invalid arrival time. Arrival time cannot be negative.`);
        return;
      }
      if (p.burstTime <= 0 || isNaN(p.burstTime)) {
        setErrorMsg(`Process ${p.id} has an invalid burst time. Burst time must be greater than zero.`);
        return;
      }
    }

    onSave(localProcesses, localTQ);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs select-none">
      <div className="bg-[#10172A] border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl text-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold font-display text-white">
              Configure Simulator & Ready Queue
            </h2>
            <p className="text-xs text-slate-400">
              Set children arrival times, slide requirements (burst times), and Time Quantum.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Time Quantum Setting */}
          <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <label htmlFor="timeQuantumInput" className="text-xs font-bold uppercase tracking-wider text-purple-300">
                  Time Quantum (TQ) / Max Slides Per Visit
                </label>
                <p className="text-xs text-slate-400 mt-0.5">
                  How many consecutive units a child can use the slide before returning to the queue.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setLocalTQ(Math.max(1, localTQ - 1))}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center border border-slate-700"
                >
                  -
                </button>
                <input
                  id="timeQuantumInput"
                  type="number"
                  min="1"
                  max="20"
                  value={localTQ}
                  onChange={(e) => setLocalTQ(parseInt(e.target.value) || 1)}
                  className="w-16 h-8 text-center bg-slate-950 border border-purple-500 rounded-lg text-white font-mono-code font-bold text-sm focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setLocalTQ(localTQ + 1)}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center border border-slate-700"
                >
                  +
                </button>
                <span className="text-xs font-mono-code text-slate-400">units</span>
              </div>
            </div>
          </div>

          {/* Process / Child Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Children / Processes ({localProcesses.length})
              </span>
              <button
                type="button"
                onClick={handleAddProcess}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>ADD CHILD</span>
              </button>
            </div>

            <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/60">
              <table className="w-full text-left text-xs font-mono-code">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900 text-slate-400 text-[11px] uppercase">
                    <th className="py-2.5 px-3">Child / Process</th>
                    <th className="py-2.5 px-3">Arrival Time (AT)</th>
                    <th className="py-2.5 px-3">Burst Time (BT)</th>
                    <th className="py-2.5 px-3">Color</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {localProcesses.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          <select
                            value={p.avatarSeed ?? 0}
                            onChange={(e) => {
                              const seed = parseInt(e.target.value) || 0;
                              const chosenPreset = CHARACTER_PRESETS[seed % CHARACTER_PRESETS.length];
                              handleUpdateProcess(p.id, 'avatarSeed', seed);
                              if (chosenPreset) {
                                handleUpdateProcess(p.id, 'name', chosenPreset.characterName);
                                handleUpdateProcess(p.id, 'color', chosenPreset.clothingColor);
                              }
                            }}
                            className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-purple-300 font-bold focus:border-purple-500 focus:outline-none"
                            title="Select storybook character design"
                          >
                            {CHARACTER_PRESETS.map((cp, idx) => (
                              <option key={cp.characterName} value={idx}>
                                {p.id}: {cp.characterName}
                              </option>
                            ))}
                          </select>
                          <input
                            type="text"
                            value={p.name}
                            onChange={(e) => handleUpdateProcess(p.id, 'name', e.target.value)}
                            className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white w-24 focus:border-purple-500 focus:outline-none"
                          />
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          min="0"
                          value={p.arrivalTime}
                          onChange={(e) =>
                            handleUpdateProcess(p.id, 'arrivalTime', parseInt(e.target.value) || 0)
                          }
                          className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white w-20 text-right focus:border-purple-500 focus:outline-none"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          min="1"
                          value={p.burstTime}
                          onChange={(e) =>
                            handleUpdateProcess(p.id, 'burstTime', parseInt(e.target.value) || 1)
                          }
                          className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white w-20 text-right focus:border-purple-500 focus:outline-none"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-1.5">
                          {COLOR_PALETTE.slice(0, 5).map((col) => (
                            <button
                              key={col}
                              type="button"
                              onClick={() => handleUpdateProcess(p.id, 'color', col)}
                              className={`w-5 h-5 rounded-full transition-transform ${
                                p.color === col ? 'scale-125 ring-2 ring-white' : 'opacity-60 hover:opacity-100'
                              }`}
                              style={{ backgroundColor: col }}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="py-2 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveProcess(p.id)}
                          className="p-1 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
                          title="Remove child"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Validation Feedback */}
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/60 rounded-b-2xl">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Reset to Defaults</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveAndApply}
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-lg shadow-md transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Save & Initialize Simulator</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
