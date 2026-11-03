# Round Robin — The Amusement Park Simulator

An interactive learning tool for understanding the Round Robin CPU scheduling algorithm. Follow processes as children taking turns on a playground slide, and compare the analogy with an operating-system scheduling dashboard.

## Features

- Side-by-side amusement park and CPU scheduling visualizations
- Play, pause, step through, reset, and adjust simulation playback speed
- Configure processes, arrival times, burst times, and the time quantum
- Load preset scheduling scenarios
- Review the Gantt chart and scheduling metrics, including waiting, turnaround, and response times, and CPU utilization
- Get contextual explanations of scheduling events as they happen

## Getting Started

### Requirements

- Node.js 20.19+ or 22.12+
- npm

### Install and run

```bash
npm install
npm run dev
```

Open the local URL printed by Vite in your terminal.

## Available Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server on port 3000 |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run the TypeScript type check |

## Using the Simulator

1. Start playback or use the step controls to advance the simulation.
2. Open the configuration panel to edit processes and the time quantum.
3. Use a preset scenario to explore different scheduling cases.
4. Compare the amusement park queue with the operating-system ready queue and CPU timeline.
5. Open the results to review completion times and scheduling metrics.

Round Robin gives each ready process the CPU for up to one time quantum. If it is not finished when its turn ends, it returns to the end of the ready queue. Processes join the queue when they arrive, and the CPU remains idle when no process is ready.

## Technology

Built with React, TypeScript, Vite, Tailwind CSS, and Motion.
