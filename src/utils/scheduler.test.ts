import test from 'node:test';
import assert from 'node:assert/strict';
import { generateSimulationTrace, DEFAULT_PROCESSES, computeMetrics } from './scheduler';
import { ProcessInput } from '../types/scheduler';

test('deterministic Round Robin with default 4 processes (TQ = 2)', () => {
  const snapshots = generateSimulationTrace(DEFAULT_PROCESSES, 2);
  assert.ok(snapshots.length > 0, 'Snapshots should not be empty');

  const finalSnapshot = snapshots[snapshots.length - 1];
  assert.equal(finalSnapshot.isAllCompleted, true, 'All processes must be completed');
  assert.equal(finalSnapshot.completedIds.length, 4, 'All 4 processes finished');

  // Total burst = 5 + 4 + 6 + 3 = 18.
  // With arrival times 0, 1, 2, 3 and no idle periods after t=0, total time should be 18.
  assert.equal(finalSnapshot.time, 18, 'Total execution time should equal sum of burst times when no idle gaps');

  // Verify process completion times and metrics
  const p1 = finalSnapshot.processes['P1'];
  const p2 = finalSnapshot.processes['P2'];
  const p3 = finalSnapshot.processes['P3'];
  const p4 = finalSnapshot.processes['P4'];

  assert.equal(p1.status, 'COMPLETED');
  assert.equal(p2.status, 'COMPLETED');
  assert.equal(p3.status, 'COMPLETED');
  assert.equal(p4.status, 'COMPLETED');

  // Verify TAT = CT - AT and WT = TAT - BT
  for (const p of [p1, p2, p3, p4]) {
    assert.equal(p.turnaroundTime, p.completionTime! - p.arrivalTime);
    assert.equal(p.waitingTime, p.turnaroundTime! - p.burstTime);
  }

  // CPU utilization should be 100% since no idle gaps exist
  assert.equal(finalSnapshot.metrics.cpuUtilization, 100);
});

test('crucial edge case: simultaneous arrival and quantum expiration tie', () => {
  // P1 starts at 0, BT=2. TQ=2.
  // At t=2, P1's quantum expires AND its burst is 2 so it finishes.
  // But let's test where P1 has BT=4:
  // At t=2, P1's quantum expires (2 units used, 2 left).
  // Suppose P2 arrives at t=2 with BT=3.
  // The rule states: "When a process's quantum expires at the same timestamp as another process arrives,
  // enqueue newly arrived processes before re-enqueuing the preempted process."
  // So at t=2, P2 must be enqueued FIRST, then P1 enqueued behind it.
  // Therefore, next running process at t=2 must be P2!
  const inputs: ProcessInput[] = [
    { id: 'P1', name: 'Child P1', arrivalTime: 0, burstTime: 4, color: '#8E44FF', avatarSeed: 0 },
    { id: 'P2', name: 'Child P2', arrivalTime: 2, burstTime: 3, color: '#10B981', avatarSeed: 1 },
  ];

  const snapshots = generateSimulationTrace(inputs, 2);
  const snapAtT2 = snapshots.find((s) => s.time === 2);
  assert.ok(snapAtT2, 'Snapshot at t=2 exists');

  // At t=2, P2 should be selected as the running process, while P1 is in the ready queue behind it
  assert.equal(snapAtT2.runningProcessId, 'P2', 'P2 arrived at t=2 and should take precedence over preempted P1');
  assert.deepEqual(snapAtT2.readyQueue, ['P1'], 'P1 should be placed in readyQueue behind new arrival P2');
});

test('a process uses one slide per quantum unit and resumes with its remaining burst', () => {
  const inputs: ProcessInput[] = [
    { id: 'P1', name: 'Maya', arrivalTime: 0, burstTime: 3, color: '#8E44FF', avatarSeed: 0 },
    { id: 'P2', name: 'Leo', arrivalTime: 0, burstTime: 1, color: '#10B981', avatarSeed: 1 },
  ];

  const snapshots = generateSimulationTrace(inputs, 2);
  const afterFirstTurn = snapshots.find((snapshot) => snapshot.time === 2);
  const afterResume = snapshots.find((snapshot) => snapshot.time === 4);

  assert.ok(afterFirstTurn);
  assert.equal(afterFirstTurn.processes.P1.completedSlides, 2);
  assert.equal(afterFirstTurn.processes.P1.remainingBurst, 1);
  assert.equal(afterFirstTurn.processes.P1.status, 'PREEMPTED');
  assert.equal(afterFirstTurn.runningProcessId, 'P2');
  assert.deepEqual(afterFirstTurn.readyQueue, ['P1']);

  assert.ok(afterResume);
  assert.equal(afterResume.processes.P1.completedSlides, 3);
  assert.equal(afterResume.processes.P1.remainingBurst, 0);
  assert.equal(afterResume.processes.P1.status, 'COMPLETED');
});

test('handles idle gaps cleanly when no processes are ready', () => {
  const inputs: ProcessInput[] = [
    { id: 'P1', name: 'Child P1', arrivalTime: 0, burstTime: 2, color: '#8E44FF', avatarSeed: 0 },
    { id: 'P2', name: 'Child P2', arrivalTime: 5, burstTime: 2, color: '#10B981', avatarSeed: 1 },
  ];

  const snapshots = generateSimulationTrace(inputs, 2);
  // P1 runs t=0..2. From t=2..5 the CPU is idle.
  const snapAtT3 = snapshots.find((s) => s.time === 3);
  assert.ok(snapAtT3);
  assert.equal(snapAtT3.runningProcessId, null, 'CPU should be IDLE at t=3');

  const finalSnap = snapshots[snapshots.length - 1];
  assert.equal(finalSnap.time, 7, 'Total time is 7 (2 burst + 3 idle + 2 burst)');
  assert.equal(finalSnap.metrics.idleTime, 3, 'Idle time should be 3');
  assert.equal(finalSnap.metrics.busyTime, 4, 'Busy time should be 4');
});
