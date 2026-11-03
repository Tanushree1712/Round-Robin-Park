import {
  ProcessInput,
  ProcessState,
  SimulationSnapshot,
  GanttSlice,
  SimulationMetrics,
  StepExplanation,
} from '../types/scheduler';

export const DEFAULT_PROCESSES: ProcessInput[] = [
  { id: 'P1', name: 'Maya', arrivalTime: 0, burstTime: 5, color: '#8E44FF', avatarSeed: 0 },
  { id: 'P2', name: 'Leo', arrivalTime: 1, burstTime: 4, color: '#10B981', avatarSeed: 1 },
  { id: 'P3', name: 'Sam', arrivalTime: 2, burstTime: 6, color: '#3B82F6', avatarSeed: 2 },
  { id: 'P4', name: 'Zoe', arrivalTime: 3, burstTime: 3, color: '#F59E0B', avatarSeed: 3 },
];

export const PRESET_SCENARIOS: { name: string; description: string; quantum: number; processes: ProcessInput[] }[] = [
  {
    name: 'Standard Fair Play (TQ = 2)',
    description: 'Classic textbook Round Robin with 4 children arriving consecutively.',
    quantum: 2,
    processes: [
      { id: 'P1', name: 'Maya', arrivalTime: 0, burstTime: 5, color: '#8E44FF', avatarSeed: 0 },
      { id: 'P2', name: 'Leo', arrivalTime: 1, burstTime: 4, color: '#10B981', avatarSeed: 1 },
      { id: 'P3', name: 'Sam', arrivalTime: 2, burstTime: 6, color: '#3B82F6', avatarSeed: 2 },
      { id: 'P4', name: 'Zoe', arrivalTime: 3, burstTime: 3, color: '#F59E0B', avatarSeed: 3 },
    ],
  },
  {
    name: 'Rapid Turns (TQ = 1)',
    description: 'Each child gets exactly 1 slide per turn. Maximum responsiveness and high preemption.',
    quantum: 1,
    processes: [
      { id: 'P1', name: 'Maya', arrivalTime: 0, burstTime: 4, color: '#8E44FF', avatarSeed: 0 },
      { id: 'P2', name: 'Leo', arrivalTime: 1, burstTime: 3, color: '#10B981', avatarSeed: 1 },
      { id: 'P3', name: 'Sam', arrivalTime: 2, burstTime: 2, color: '#3B82F6', avatarSeed: 2 },
    ],
  },
  {
    name: 'Idle Slide Demonstration',
    description: 'A quiet park period where the slide remains temporarily empty waiting for arrivals.',
    quantum: 2,
    processes: [
      { id: 'P1', name: 'Maya', arrivalTime: 0, burstTime: 3, color: '#8E44FF', avatarSeed: 0 },
      { id: 'P2', name: 'Chloe', arrivalTime: 5, burstTime: 4, color: '#EC4899', avatarSeed: 4 },
      { id: 'P3', name: 'Kai', arrivalTime: 6, burstTime: 2, color: '#06B6D4', avatarSeed: 5 },
    ],
  },
  {
    name: 'Equal Arrival Sprint (TQ = 3)',
    description: 'All 3 children arrive together at the gates at t = 0 with moderate turn quota.',
    quantum: 3,
    processes: [
      { id: 'P1', name: 'Maya', arrivalTime: 0, burstTime: 6, color: '#8E44FF', avatarSeed: 0 },
      { id: 'P2', name: 'Leo', arrivalTime: 0, burstTime: 4, color: '#10B981', avatarSeed: 1 },
      { id: 'P3', name: 'Sam', arrivalTime: 0, burstTime: 5, color: '#3B82F6', avatarSeed: 2 },
    ],
  },
];

export const COLOR_PALETTE = [
  '#8E44FF', // Purple
  '#10B981', // Emerald green
  '#3B82F6', // Blue
  '#F59E0B', // Amber orange
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#8B5CF6', // Violet
  '#F43F5E', // Rose
];

export function computeMetrics(
  processes: Record<string, ProcessState>,
  totalTime: number,
  busyTime: number
): SimulationMetrics {
  const processList = Object.values(processes);
  const completedList = processList.filter((p) => p.completionTime !== undefined);

  if (completedList.length === 0) {
    return {
      avgWaitTime: 0,
      avgTurnaroundTime: 0,
      avgResponseTime: 0,
      cpuUtilization: totalTime > 0 ? (busyTime / totalTime) * 100 : 0,
      totalExecutionTime: totalTime,
      idleTime: totalTime - busyTime,
      busyTime,
    };
  }

  const sumWT = completedList.reduce((acc, p) => acc + (p.waitingTime ?? 0), 0);
  const sumTAT = completedList.reduce((acc, p) => acc + (p.turnaroundTime ?? 0), 0);
  const sumRT = completedList.reduce((acc, p) => acc + (p.responseTime ?? 0), 0);

  return {
    avgWaitTime: Number((sumWT / completedList.length).toFixed(2)),
    avgTurnaroundTime: Number((sumTAT / completedList.length).toFixed(2)),
    avgResponseTime: Number((sumRT / completedList.length).toFixed(2)),
    cpuUtilization: totalTime > 0 ? Number(((busyTime / totalTime) * 100).toFixed(1)) : 0,
    totalExecutionTime: totalTime,
    idleTime: Math.max(0, totalTime - busyTime),
    busyTime,
  };
}

/**
 * Generates the complete, deterministic sequence of simulation snapshots from t=0
 * until all processes are completed.
 *
 * Each step corresponds to exactly 1 time unit (1 slide = 1 CPU burst unit).
 */
export function generateSimulationTrace(
  inputs: ProcessInput[],
  timeQuantum: number
): SimulationSnapshot[] {
  if (inputs.length === 0 || timeQuantum <= 0) {
    return [];
  }

  // Clone inputs into initial process states
  const processes: Record<string, ProcessState> = {};
  for (const p of inputs) {
    processes[p.id] = {
      id: p.id,
      name: p.name,
      arrivalTime: Math.max(0, p.arrivalTime),
      burstTime: Math.max(1, p.burstTime),
      remainingBurst: Math.max(1, p.burstTime),
      completedSlides: 0,
      color: p.color,
      avatarSeed: p.avatarSeed ?? 0,
      status: 'NOT_ARRIVED',
    };
  }

  const totalProcesses = inputs.length;
  const completedIds: string[] = [];
  const readyQueue: string[] = [];
  const ganttHistory: GanttSlice[] = [];

  let currentTime = 0;
  let runningProcessId: string | null = null;
  let currentQuantumRemaining = 0;
  let busyTime = 0;

  const snapshots: SimulationSnapshot[] = [];

  // Helper to clone process map
  const cloneProcesses = (map: Record<string, ProcessState>) => {
    const res: Record<string, ProcessState> = {};
    for (const k of Object.keys(map)) {
      res[k] = { ...map[k] };
    }
    return res;
  };

  // Helper to add or extend a Gantt slice
  const recordGanttUnit = (procId: string | null, start: number, end: number) => {
    const isIdle = procId === null;
    const proc = procId ? processes[procId] : null;
    const name = proc ? proc.name : 'IDLE';
    const color = proc ? proc.color : '#334155';

    const lastSlice = ganttHistory.length > 0 ? ganttHistory[ganttHistory.length - 1] : null;
    if (lastSlice && lastSlice.processId === procId && lastSlice.endTime === start) {
      lastSlice.endTime = end;
    } else {
      ganttHistory.push({
        id: `gantt-${ganttHistory.length}-${start}`,
        processId: procId,
        processName: name,
        startTime: start,
        endTime: end,
        color,
        isIdle,
      });
    }
  };

  // STEP 0: Initial state at t = 0
  // Check any processes that arrive at t = 0
  for (const p of inputs) {
    if (p.arrivalTime === 0) {
      processes[p.id].status = 'WAITING';
      readyQueue.push(p.id);
    }
  }

  // Select initial running process if available
  let initialExplanation: StepExplanation;
  if (readyQueue.length > 0) {
    runningProcessId = readyQueue.shift()!;
    const p = processes[runningProcessId];
    p.status = 'RUNNING';
    p.firstStartTime = 0;
    p.responseTime = 0 - p.arrivalTime;
    currentQuantumRemaining = timeQuantum;

    initialExplanation = {
      parkCommentary: `${p.name} arrived at the slide and climbs up for their first turn (Quantum: ${timeQuantum} slides).`,
      osCommentary: `Process ${p.id} arrived at t=0 and was dispatched to the CPU. Time Quantum initialized to ${timeQuantum}.`,
      highlightTerm: 'Ready Queue & CPU Dispatch',
      actionType: 'START_EXECUTION',
    };
  } else {
    runningProcessId = null;
    currentQuantumRemaining = 0;
    initialExplanation = {
      parkCommentary: `The playground slide is open, but no children have arrived at the park yet.`,
      osCommentary: `Simulation started at t=0. Ready queue is empty; CPU is currently IDLE waiting for arrivals.`,
      highlightTerm: 'CPU Idle',
      actionType: 'IDLE',
    };
  }

  snapshots.push({
    time: 0,
    runningProcessId,
    readyQueue: [...readyQueue],
    quantumRemaining: currentQuantumRemaining,
    timeQuantum,
    processes: cloneProcesses(processes),
    ganttHistory: JSON.parse(JSON.stringify(ganttHistory)),
    completedIds: [...completedIds],
    explanation: initialExplanation,
    isAllCompleted: false,
    metrics: computeMetrics(processes, 0, 0),
  });

  // Main simulation loop: tick 1 time unit per loop iteration
  // Safety bound: 500 ticks to avoid infinite loops if bad inputs
  const MAX_TICKS = 500;

  while (completedIds.length < totalProcesses && currentTime < MAX_TICKS) {
    const nextTime = currentTime + 1;

    let tickParkCommentary = '';
    let tickOsCommentary = '';
    let tickHighlight = '';
    let actionType: StepExplanation['actionType'] = 'SLIDE_TICK';

    if (runningProcessId !== null) {
      // Process executes 1 time unit
      busyTime++;
      const runningProc = processes[runningProcessId];
      runningProc.remainingBurst -= 1;
      runningProc.completedSlides += 1;
      currentQuantumRemaining -= 1;

      recordGanttUnit(runningProcessId, currentTime, nextTime);

      const isBurstFinished = runningProc.remainingBurst === 0;
      const isQuantumExpired = currentQuantumRemaining === 0;

      // 1. Check newly arriving processes at nextTime
      // Rule: Newly arriving processes enter ready queue at nextTime
      const newlyArrived: string[] = [];
      for (const p of inputs) {
        if (p.arrivalTime === nextTime && !readyQueue.includes(p.id) && runningProcessId !== p.id) {
          processes[p.id].status = 'WAITING';
          newlyArrived.push(p.id);
          readyQueue.push(p.id);
        }
      }

      // 2. Evaluate running process completion or preemption
      if (isBurstFinished) {
        // Process Completed
        runningProc.status = 'COMPLETED';
        runningProc.completionTime = nextTime;
        runningProc.turnaroundTime = nextTime - runningProc.arrivalTime;
        runningProc.waitingTime = runningProc.turnaroundTime - runningProc.burstTime;
        completedIds.push(runningProcessId);

        tickParkCommentary = `${runningProc.name} finished all ${runningProc.burstTime} slides! They cheer and head to the park picnic area.`;
        tickOsCommentary = `Process ${runningProc.id} completed execution at t=${nextTime}. CT=${nextTime}, TAT=${runningProc.turnaroundTime}, WT=${runningProc.waitingTime}.`;
        tickHighlight = 'Process Completion';
        actionType = 'COMPLETION';

        // Select next from readyQueue
        if (readyQueue.length > 0) {
          runningProcessId = readyQueue.shift()!;
          const nextProc = processes[runningProcessId];
          nextProc.status = 'RUNNING';
          if (nextProc.firstStartTime === undefined) {
            nextProc.firstStartTime = nextTime;
            nextProc.responseTime = nextTime - nextProc.arrivalTime;
          }
          currentQuantumRemaining = timeQuantum;
        } else {
          runningProcessId = null;
          currentQuantumRemaining = 0;
        }
      } else if (isQuantumExpired) {
        // Quantum Expired -> PREEMPTION
        // NOTE: per edge case rule: "When a process's quantum expires at the same timestamp
        // as another process arrives, enqueue newly arrived processes before re-enqueuing the preempted process."
        // We already added newlyArrived to readyQueue above, so now pushing preempted process
        // naturally places it behind new arrivals!
        runningProc.status = 'PREEMPTED';
        readyQueue.push(runningProcessId);

        const preemptedName = runningProc.name;
        const preemptedId = runningProc.id;

        // Next candidate
        runningProcessId = readyQueue.shift()!;
        const nextProc = processes[runningProcessId];
        nextProc.status = 'RUNNING';
        if (nextProc.firstStartTime === undefined) {
          nextProc.firstStartTime = nextTime;
          nextProc.responseTime = nextTime - nextProc.arrivalTime;
        }
        currentQuantumRemaining = timeQuantum;

        tickParkCommentary = `${preemptedName} finished their allotted ${timeQuantum} slides. They head to the back of the queue (PREEMPTION) as ${nextProc.name} takes the slide.`;
        tickOsCommentary = `Time Quantum expired for ${preemptedId}. Preempted to tail of Ready Queue. Context switch dispatched ${nextProc.id} to CPU.`;
        tickHighlight = 'Preemption & Context Switching';
        actionType = 'PREEMPTION';
      } else {
        // Process continues running next tick within the same quantum
        tickParkCommentary = `${runningProc.name} slides down! (Slide ${runningProc.completedSlides}/${runningProc.burstTime}, Quantum remaining: ${currentQuantumRemaining}).`;
        tickOsCommentary = `Process ${runningProc.id} executed 1 burst unit. Remaining BT: ${runningProc.remainingBurst}, Quantum left: ${currentQuantumRemaining}.`;
        tickHighlight = 'CPU Execution';
        actionType = 'SLIDE_TICK';
      }
    } else {
      // CPU was IDLE during currentTime -> nextTime
      recordGanttUnit(null, currentTime, nextTime);

      // Check newly arriving processes at nextTime
      for (const p of inputs) {
        if (p.arrivalTime === nextTime && !readyQueue.includes(p.id)) {
          processes[p.id].status = 'WAITING';
          readyQueue.push(p.id);
        }
      }

      if (readyQueue.length > 0) {
        runningProcessId = readyQueue.shift()!;
        const nextProc = processes[runningProcessId];
        nextProc.status = 'RUNNING';
        if (nextProc.firstStartTime === undefined) {
          nextProc.firstStartTime = nextTime;
          nextProc.responseTime = nextTime - nextProc.arrivalTime;
        }
        currentQuantumRemaining = timeQuantum;

        tickParkCommentary = `Slide was empty. Now ${nextProc.name} has arrived and steps onto the slide ladder!`;
        tickOsCommentary = `CPU was idle until t=${nextTime}. Process ${nextProc.id} dispatched from Ready Queue.`;
        tickHighlight = 'CPU Awakened / Dispatched';
        actionType = 'START_EXECUTION';
      } else {
        runningProcessId = null;
        currentQuantumRemaining = 0;
        tickParkCommentary = `The slide is still empty. Waiting for the next child to arrive at the playground...`;
        tickOsCommentary = `CPU is IDLE from t=${currentTime} to t=${nextTime}. Ready queue has 0 active processes.`;
        tickHighlight = 'CPU Idle';
        actionType = 'IDLE';
      }
    }

    currentTime = nextTime;
    const isAllDone = completedIds.length === totalProcesses;

    if (isAllDone) {
      actionType = 'ALL_COMPLETED';
      tickParkCommentary = `All children have finished all their slides! Everyone is celebrating at the park! 🎉`;
      tickOsCommentary = `All processes have terminated. Round Robin scheduling completed successfully.`;
      tickHighlight = 'Scheduling Complete';
    }

    snapshots.push({
      time: currentTime,
      runningProcessId,
      readyQueue: [...readyQueue],
      quantumRemaining: currentQuantumRemaining,
      timeQuantum,
      processes: cloneProcesses(processes),
      ganttHistory: JSON.parse(JSON.stringify(ganttHistory)),
      completedIds: [...completedIds],
      explanation: {
        parkCommentary: tickParkCommentary,
        osCommentary: tickOsCommentary,
        highlightTerm: tickHighlight,
        actionType,
      },
      isAllCompleted: isAllDone,
      metrics: computeMetrics(processes, currentTime, busyTime),
    });
  }

  return snapshots;
}
