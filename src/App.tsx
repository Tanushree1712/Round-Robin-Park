import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Header } from './components/Header';
import { ControlsBar } from './components/ControlsBar';
import { AmusementParkView } from './components/AmusementParkView';
import { OsDashboardView } from './components/OsDashboardView';
import { EducationalExplanation } from './components/EducationalExplanation';
import { ConfigModal } from './components/ConfigModal';
import { ResultsModal } from './components/ResultsModal';
import { AnalogyModal } from './components/AnalogyModal';
import { DEFAULT_PROCESSES, generateSimulationTrace } from './utils/scheduler';
import { ProcessInput } from './types/scheduler';

export default function App() {
  // Simulator configuration state
  const [processes, setProcesses] = useState<ProcessInput[]>(DEFAULT_PROCESSES);
  const [timeQuantum, setTimeQuantum] = useState<number>(2);

  // Playback control state
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  // Modal dialog states
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);
  const [isAnalogyOpen, setIsAnalogyOpen] = useState<boolean>(false);
  const [isResultsOpen, setIsResultsOpen] = useState<boolean>(false);

  // Auto-generate deterministic simulation snapshots whenever inputs change
  const snapshots = useMemo(() => {
    return generateSimulationTrace(processes, timeQuantum);
  }, [processes, timeQuantum]);

  // Current active snapshot (synchronized single source of truth!)
  const currentSnapshot = snapshots[currentStepIndex] || snapshots[0];
  const maxStepIndex = Math.max(0, snapshots.length - 1);
  const maxTime = snapshots.length > 0 ? snapshots[snapshots.length - 1].time : 0;
  const isAllCompleted = currentSnapshot ? currentSnapshot.isAllCompleted : false;

  // Playback interval driver
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      const intervalMs = Math.round(1000 / playbackSpeed);
      timerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < maxStepIndex) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            setIsResultsOpen(true);
            return prev;
          }
        });
      }, intervalMs);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, playbackSpeed, maxStepIndex]);

  // Play / Pause Toggle
  const handlePlayToggle = () => {
    if (isAllCompleted) {
      // If at end, restart and play
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  // Step controls
  const handleNextStep = () => {
    if (currentStepIndex < maxStepIndex) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handleRestart = () => {
    setCurrentStepIndex(0);
    setIsPlaying(true);
  };

  // Handle preset scenario selection
  const handleSelectPreset = (scenario: {
    name: string;
    quantum: number;
    processes: ProcessInput[];
  }) => {
    setIsPlaying(false);
    setProcesses(scenario.processes);
    setTimeQuantum(scenario.quantum);
    setCurrentStepIndex(0);
  };

  // Handle configuration save
  const handleSaveConfig = (newProcesses: ProcessInput[], newQuantum: number) => {
    setIsPlaying(false);
    setProcesses(newProcesses);
    setTimeQuantum(newQuantum);
    setCurrentStepIndex(0);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F1A] text-slate-100 font-sans selection:bg-purple-500 selection:text-white">
      {/* 1. Header (Top Bar Contract) */}
      <Header
        onOpenConfig={() => setIsConfigOpen(true)}
        onOpenAnalogy={() => setIsAnalogyOpen(true)}
        onReset={handleReset}
        timeQuantum={timeQuantum}
      />

      {/* 2. Controls Bar */}
      <ControlsBar
        isPlaying={isPlaying}
        onPlayToggle={handlePlayToggle}
        onNextStep={handleNextStep}
        onPrevStep={handlePrevStep}
        onReset={handleReset}
        currentTime={currentSnapshot?.time ?? 0}
        maxTime={maxTime}
        canStepNext={currentStepIndex < maxStepIndex}
        canStepPrev={currentStepIndex > 0}
        playbackSpeed={playbackSpeed}
        onSpeedChange={setPlaybackSpeed}
        onSelectPreset={handleSelectPreset}
        isAllCompleted={isAllCompleted}
        onOpenResults={() => setIsResultsOpen(true)}
      />

      {/* 3. Central Dual-World Split Screen Simulator */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
        {/* LEFT HALF: THE AMUSEMENT PARK */}
        <section aria-label="Amusement Park Playground Simulator" className="h-full">
          <AmusementParkView
            processes={currentSnapshot?.processes || {}}
            readyQueue={currentSnapshot?.readyQueue || []}
            runningProcessId={currentSnapshot?.runningProcessId || null}
            completedIds={currentSnapshot?.completedIds || []}
            quantumRemaining={currentSnapshot?.quantumRemaining || 0}
            timeQuantum={timeQuantum}
            currentTime={currentSnapshot?.time || 0}
            lastExecutedProcessId={
              currentSnapshot?.ganttHistory[currentSnapshot.ganttHistory.length - 1]?.processId ?? null
            }
            playbackSpeed={playbackSpeed}
            explanation={
              currentSnapshot?.explanation || {
                parkCommentary: 'Initializing park...',
                osCommentary: 'Initializing scheduler...',
                actionType: 'INIT',
              }
            }
          />
        </section>

        {/* RIGHT HALF: THE OPERATING SYSTEM VISUALIZER */}
        <section aria-label="Operating System CPU Scheduling Visualization" className="h-full">
          <OsDashboardView
            processes={currentSnapshot?.processes || {}}
            readyQueue={currentSnapshot?.readyQueue || []}
            runningProcessId={currentSnapshot?.runningProcessId || null}
            ganttHistory={currentSnapshot?.ganttHistory || []}
            quantumRemaining={currentSnapshot?.quantumRemaining || 0}
            timeQuantum={timeQuantum}
            currentTime={currentSnapshot?.time || 0}
            explanation={
              currentSnapshot?.explanation || {
                parkCommentary: 'Initializing park...',
                osCommentary: 'Initializing scheduler...',
                actionType: 'INIT',
              }
            }
          />
        </section>
      </main>

      {/* 4. Live Contextual Educational Explanation */}
      {currentSnapshot && (
        <EducationalExplanation
          explanation={currentSnapshot.explanation}
          timeQuantum={timeQuantum}
          onOpenAnalogy={() => setIsAnalogyOpen(true)}
        />
      )}

      {/* 5. Modals */}
      <ConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        processes={processes}
        timeQuantum={timeQuantum}
        onSave={handleSaveConfig}
      />

      {currentSnapshot && (
        <ResultsModal
          isOpen={isResultsOpen}
          onClose={() => setIsResultsOpen(false)}
          snapshot={snapshots[snapshots.length - 1]}
          onRestart={handleRestart}
        />
      )}

      <AnalogyModal
        isOpen={isAnalogyOpen}
        onClose={() => setIsAnalogyOpen(false)}
      />
    </div>
  );
}
