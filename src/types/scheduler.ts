export interface ProcessInput {
  id: string;
  name: string;
  arrivalTime: number;
  burstTime: number;
  color: string;
  avatarSeed: number; // 0 to 5 for unique character hair/expression
}

export type ProcessStatus = 'NOT_ARRIVED' | 'WAITING' | 'RUNNING' | 'PREEMPTED' | 'COMPLETED';

export interface ProcessState {
  id: string;
  name: string;
  arrivalTime: number;
  burstTime: number;
  remainingBurst: number;
  completedSlides: number;
  color: string;
  avatarSeed: number;
  status: ProcessStatus;
  firstStartTime?: number;
  completionTime?: number;
  turnaroundTime?: number;
  waitingTime?: number;
  responseTime?: number;
}

export interface GanttSlice {
  id: string;
  processId: string | null;
  processName: string;
  startTime: number;
  endTime: number;
  color: string;
  isIdle: boolean;
}

export type ActionType =
  | 'INIT'
  | 'ARRIVAL'
  | 'START_EXECUTION'
  | 'SLIDE_TICK'
  | 'PREEMPTION'
  | 'COMPLETION'
  | 'IDLE'
  | 'ALL_COMPLETED';

export interface StepExplanation {
  parkCommentary: string;
  osCommentary: string;
  highlightTerm?: string;
  actionType: ActionType;
}

export interface SimulationMetrics {
  avgWaitTime: number;
  avgTurnaroundTime: number;
  avgResponseTime: number;
  cpuUtilization: number;
  totalExecutionTime: number;
  idleTime: number;
  busyTime: number;
}

export interface SimulationSnapshot {
  time: number;
  runningProcessId: string | null;
  readyQueue: string[]; // FIFO process IDs
  quantumRemaining: number;
  timeQuantum: number;
  processes: Record<string, ProcessState>;
  ganttHistory: GanttSlice[];
  completedIds: string[];
  explanation: StepExplanation;
  isAllCompleted: boolean;
  metrics: SimulationMetrics;
}
