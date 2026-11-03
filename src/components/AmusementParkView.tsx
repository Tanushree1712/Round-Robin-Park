import React from 'react';
import { ChildAvatar, CharacterActionState } from './ChildAvatar';
import { ProcessState, StepExplanation } from '../types/scheduler';
import { Users, PartyPopper, Sparkles } from 'lucide-react';

interface AmusementParkViewProps {
  processes: Record<string, ProcessState>;
  readyQueue: string[]; // FIFO order
  runningProcessId: string | null;
  completedIds: string[];
  quantumRemaining: number;
  timeQuantum: number;
  currentTime: number;
  lastExecutedProcessId: string | null;
  playbackSpeed: number;
  explanation: StepExplanation;
}

export const AmusementParkView: React.FC<AmusementParkViewProps> = ({
  processes,
  readyQueue,
  runningProcessId,
  completedIds,
  quantumRemaining,
  timeQuantum,
  currentTime,
  lastExecutedProcessId,
  playbackSpeed,
  explanation,
}) => {
  const runningChild = runningProcessId ? processes[runningProcessId] : null;
  const isPreempting = explanation.actionType === 'PREEMPTION';
  const isCompleting =
    explanation.actionType === 'COMPLETION' || explanation.actionType === 'ALL_COMPLETED';

  const hasSlideEvent = [
    'SLIDE_TICK',
    'PREEMPTION',
    'COMPLETION',
    'ALL_COMPLETED',
  ].includes(explanation.actionType);
  const slideChild =
    hasSlideEvent && lastExecutedProcessId
      ? processes[lastExecutedProcessId] ?? runningChild
      : runningChild;
  const slideAnimationDuration = Math.min(1250, 800 / playbackSpeed);

  const childActionState: CharacterActionState = hasSlideEvent ? 'sliding' : 'preparing';

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#BAE6FD] via-[#E0F2FE] to-[#DCFCE7] border-r border-slate-700/60 overflow-hidden relative shadow-inner select-none min-h-[580px]">
      
      {/* Top Banner Tag */}
      <div className="absolute top-3 left-4 z-20 flex items-center gap-2">
        <div className="bg-white/90 backdrop-blur-sm px-3.5 py-1 rounded-full shadow-sm border border-sky-200 text-sky-950 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="font-display font-bold text-xs tracking-wide">
            ROUND ROBIN PLAYGROUND
          </span>
          <span className="text-[10px] text-slate-500 font-medium hidden sm:inline">
            · 2D Storybook World
          </span>
        </div>
      </div>

      {/* =========================================================
          BACKGROUND ENVIRONMENT (STORYBOOK 2D ILLUSTRATION)
          ========================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        
        {/* Warm Storybook Sun */}
        <div className="absolute top-3 right-8 w-20 h-20">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
            {/* Sun Rays */}
            <g stroke="#FCD34D" strokeWidth="4" strokeLinecap="round" opacity="0.7">
              <line x1="50" y1="12" x2="50" y2="4" />
              <line x1="50" y1="88" x2="50" y2="96" />
              <line x1="12" y1="50" x2="4" y2="50" />
              <line x1="88" y1="50" x2="96" y2="50" />
              <line x1="23" y1="23" x2="17" y2="17" />
              <line x1="77" y1="77" x2="83" y2="83" />
              <line x1="23" y1="77" x2="17" y2="83" />
              <line x1="77" y1="23" x2="83" y2="17" />
            </g>
            {/* Sun Body */}
            <circle cx="50" cy="50" r="28" fill="#FBBF24" stroke="#F59E0B" strokeWidth="3" />
            {/* Cute Sun Smiling Face */}
            <circle cx="43" cy="46" r="2.8" fill="#78350F" />
            <circle cx="57" cy="46" r="2.8" fill="#78350F" />
            <path d="M 44 54 Q 50 60 56 54" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <circle cx="37" cy="51" r="3" fill="#F87171" opacity="0.6" />
            <circle cx="63" cy="51" r="3" fill="#F87171" opacity="0.6" />
          </svg>
        </div>

        {/* Fluffy Storybook Clouds */}
        <div className="absolute top-6 left-12 opacity-80 animate-cloud-slow">
          <svg width="140" height="48" viewBox="0 0 140 48" fill="#FFFFFF">
            <path d="M 25 36 C 12 36 6 22 18 14 C 24 4 44 4 52 12 C 60 4 82 2 92 12 C 102 4 122 8 126 22 C 138 24 138 36 122 36 Z" />
          </svg>
        </div>
        <div className="absolute top-14 right-32 opacity-70 animate-cloud-slow" style={{ animationDelay: '-6s' }}>
          <svg width="110" height="38" viewBox="0 0 140 48" fill="#FFFFFF">
            <path d="M 25 36 C 12 36 6 22 18 14 C 24 4 44 4 52 12 C 60 4 82 2 92 12 C 102 4 122 8 126 22 C 138 24 138 36 122 36 Z" />
          </svg>
        </div>

        {/* Whimsical Distant Circus Tent & Ferris Wheel Silhouette */}
        <div className="absolute top-18 right-6 opacity-30">
          <svg width="100" height="80" viewBox="0 0 120 100">
            {/* Ferris Wheel */}
            <circle cx="60" cy="50" r="36" fill="none" stroke="#0284C7" strokeWidth="2" strokeDasharray="5 5" />
            <line x1="60" y1="14" x2="60" y2="86" stroke="#0284C7" strokeWidth="1.5" />
            <line x1="24" y1="50" x2="96" y2="50" stroke="#0284C7" strokeWidth="1.5" />
            <line x1="34" y1="24" x2="86" y2="76" stroke="#0284C7" strokeWidth="1.5" />
            <line x1="86" y1="24" x2="34" y2="76" stroke="#0284C7" strokeWidth="1.5" />
            {/* Support triangle */}
            <polygon points="60,50 40,95 80,95" fill="#0284C7" opacity="0.3" />
          </svg>
        </div>

        {/* Whimsical Pastel Storybook Trees & Bushes */}
        <div className="absolute bottom-28 left-4 opacity-85">
          <svg width="60" height="90" viewBox="0 0 60 90">
            <rect x="26" y="50" width="8" height="40" rx="3" fill="#78350F" />
            {/* Puffy Foliage */}
            <circle cx="30" cy="35" r="24" fill="#34D399" stroke="#059669" strokeWidth="2.5" />
            <circle cx="20" cy="40" r="14" fill="#6EE7B7" />
            <circle cx="38" cy="32" r="16" fill="#10B981" />
          </svg>
        </div>
        <div className="absolute bottom-32 right-12 opacity-85">
          <svg width="65" height="95" viewBox="0 0 65 95">
            <rect x="28" y="55" width="9" height="40" rx="3" fill="#78350F" />
            <circle cx="32" cy="38" r="26" fill="#4ADE80" stroke="#16A34A" strokeWidth="2.5" />
            <circle cx="42" cy="42" r="16" fill="#86EFAC" />
          </svg>
        </div>

        {/* Rolling Storybook Green Hills */}
        <div className="absolute -bottom-8 left-0 right-0 h-44 bg-[#86EFAC] rounded-t-[140px] transform scale-x-125 opacity-60" />
        <div className="absolute -bottom-12 left-0 right-0 h-38 bg-[#4ADE80] rounded-t-[160px] shadow-sm" />
        <div className="absolute -bottom-16 left-0 right-0 h-32 bg-[#22C55E] rounded-t-[200px]" />

        {/* Cute Playground Wooden Picket Fence */}
        <div className="absolute bottom-28 left-0 right-0 flex justify-between px-6 opacity-40">
          {[...Array(14)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-[#92400E]" />
              <div className="w-3 h-10 bg-[#B45309] rounded-b-xs" />
            </div>
          ))}
        </div>

        {/* Little Ground Wildflowers (Daisies & Buttercups) */}
        <div className="absolute bottom-4 left-10 flex gap-6 opacity-75">
          <div className="w-3 h-3 rounded-full bg-white ring-2 ring-amber-300" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-300 ring-2 ring-amber-500" />
        </div>
        <div className="absolute bottom-6 right-24 flex gap-5 opacity-75">
          <div className="w-3 h-3 rounded-full bg-pink-300 ring-2 ring-pink-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-white ring-2 ring-amber-300" />
        </div>
      </div>

      {/* =========================================================
          FOREGROUND PARK STAGE: SLIDE (CENTER) + QUEUE + PICNIC
          ========================================================= */}
      <div className="relative z-10 flex-1 flex flex-col justify-between p-4 pt-14">
        
        {/* CENTER STAGE: THE PLAYGROUND SLIDE */}
        <div className="flex-1 flex flex-col items-center justify-center relative my-1">
          
          {/* Subtle Storybook Slide Status HUD (Uncluttered) */}
          <div className="mb-2 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full border border-amber-300 shadow-sm flex items-center gap-3">
            {slideChild ? (
              <div className="flex items-center gap-2.5 text-xs">
                <span
                  className="w-3 h-3 rounded-full shrink-0 shadow-2xs ring-1 ring-white"
                  style={{ backgroundColor: slideChild.color }}
                />
                <span className="font-display font-bold text-slate-800">
                  {slideChild.name} on the slide
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-600 font-medium">
                  Slide <b className="text-purple-700 font-bold">{slideChild.completedSlides}</b> of <b>{slideChild.burstTime}</b>
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-[11px] font-mono-code font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  {isPreempting
                    ? 'Turn complete'
                    : isCompleting
                    ? 'All slides complete'
                    : `Turn Quota: ${quantumRemaining}/${timeQuantum} left`}
                </span>
              </div>
            ) : (
              <div className="text-xs font-semibold text-slate-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" />
                <span>Playground Slide is Open · Awaiting Next Child</span>
              </div>
            )}
          </div>

          {/* THE 2D STORYBOOK SLIDE ATTRACTION */}
          <div className="relative w-full max-w-[540px] h-[260px]">
            
            {/* SVG Playground Slide Illustration */}
            <svg viewBox="0 0 540 260" className="w-full h-full drop-shadow-md">
              <defs>
                {/* Glossy Curved Chute Linear Gradient */}
                <linearGradient id="chuteGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FBBF24" />
                  <stop offset="35%" stopColor="#F59E0B" />
                  <stop offset="70%" stopColor="#EF4444" />
                  <stop offset="100%" stopColor="#DC2626" />
                </linearGradient>

                {/* Warm Storybook Wood Texture Gradient */}
                <linearGradient id="storybookWood" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D97706" />
                  <stop offset="50%" stopColor="#B45309" />
                  <stop offset="100%" stopColor="#78350F" />
                </linearGradient>
              </defs>

              {/* Wooden Tower Legs / Foundation Posts */}
              <rect x="76" y="70" width="12" height="175" rx="3" fill="url(#storybookWood)" stroke="#5A2E0E" strokeWidth="2.5" />
              <rect x="146" y="70" width="12" height="175" rx="3" fill="url(#storybookWood)" stroke="#5A2E0E" strokeWidth="2.5" />
              {/* Cross Bracing */}
              <line x1="76" y1="120" x2="158" y2="190" stroke="#78350F" strokeWidth="5" strokeLinecap="round" />
              <line x1="158" y1="120" x2="76" y2="190" stroke="#78350F" strokeWidth="5" strokeLinecap="round" />

              {/* Wooden Ladder Rungs on Left */}
              <g id="ladder-rungs">
                {[95, 120, 145, 170, 195, 220].map((y, idx) => (
                  <g key={idx}>
                    <line x1="82" y1={y} x2="148" y2={y} stroke="#F59E0B" strokeWidth="6" strokeLinecap="round" />
                    <line x1="82" y1={y} x2="148" y2={y} stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
                  </g>
                ))}
              </g>

              {/* Slide Under-support Steel Struts */}
              <line x1="260" y1="130" x2="260" y2="240" stroke="#94A3B8" strokeWidth="6" strokeLinecap="round" />
              <line x1="380" y1="185" x2="380" y2="240" stroke="#94A3B8" strokeWidth="6" strokeLinecap="round" />

              {/* Platform Launch Deck */}
              <rect x="66" y="65" width="112" height="14" rx="4" fill="#F59E0B" stroke="#78350F" strokeWidth="3" />
              {/* Railing Posts */}
              <rect x="74" y="38" width="8" height="28" fill="#B45309" stroke="#78350F" strokeWidth="2" />
              <rect x="114" y="38" width="8" height="28" fill="#B45309" stroke="#78350F" strokeWidth="2" />
              <rect x="154" y="38" width="8" height="28" fill="#B45309" stroke="#78350F" strokeWidth="2" />
              {/* Handrail */}
              <line x1="70" y1="40" x2="162" y2="40" stroke="#F59E0B" strokeWidth="7" strokeLinecap="round" />
              <line x1="70" y1="40" x2="162" y2="40" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />

              {/* Charming Storybook Pagoda / Gazebo Roof */}
              <polygon points="118,2 52,36 184,36" fill="#DC2626" stroke="#991B1B" strokeWidth="3.5" strokeLinejoin="round" />
              <polygon points="118,2 118,36 184,36" fill="#B91C1C" />
              {/* Pennant Flag on Top */}
              <line x1="118" y1="2" x2="118" y2="-16" stroke="#78350F" strokeWidth="3.5" strokeLinecap="round" />
              <polygon points="118,-16 150,-8 118,0" fill="#FBBF24" stroke="#D97706" strokeWidth="2" className="animate-flag" />

              {/* =========================================
                  THE CURVED SLIDE CHUTE (Realistic Depth)
                  ========================================= */}
              {/* Slide Chute Shadow Underbelly */}
              <path
                d="M 152 74 C 215 74, 275 142, 435 218 L 452 224"
                fill="none"
                stroke="#991B1B"
                strokeWidth="36"
                strokeLinecap="round"
              />
              {/* Slide Side Outer Rim */}
              <path
                d="M 152 72 C 215 72, 275 140, 435 216 L 452 222"
                fill="none"
                stroke="#DC2626"
                strokeWidth="30"
                strokeLinecap="round"
              />
              {/* Inner Smooth Sliding Chute Surface */}
              <path
                d="M 152 69 C 215 69, 275 137, 435 213 L 452 219"
                fill="none"
                stroke="url(#chuteGradient)"
                strokeWidth="24"
                strokeLinecap="round"
              />
              {/* Gleaming Sunlight Reflection Line */}
              <path
                d="M 152 65 C 215 65, 275 133, 435 209"
                fill="none"
                stroke="#FEF9C3"
                strokeWidth="4"
                strokeLinecap="round"
                opacity="0.9"
              />

              {/* Dynamic Wind Swoosh Trails when child is in active slide */}
              {hasSlideEvent && (
                <g stroke="#FFFFFF" strokeWidth="3.5" strokeDasharray="14 10" opacity="0.9" className="animate-pulse">
                  <path d="M 175 66 C 235 68, 290 135, 430 205" fill="none" />
                  <path d="M 160 76 C 220 78, 280 145, 420 215" fill="none" />
                </g>
              )}

              {/* Pillowy Clover-Green Landing Mat */}
              <ellipse cx="452" cy="232" rx="42" ry="11" fill="#15803D" opacity="0.3" />
              <rect x="410" y="222" width="76" height="15" rx="7" fill="#22C55E" stroke="#15803D" strokeWidth="2.5" />
              <text x="448" y="233" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                LANDING MAT
              </text>
            </svg>

            {/* DYNAMIC CHILD ON SLIDE (Synchronized 2D Storybook Trajectory) */}
            {slideChild && (
              <div
                key={`${slideChild.id}-${slideChild.completedSlides}-${currentTime}`}
                className={`absolute z-20 pointer-events-none transition-all duration-300 ${
                  hasSlideEvent ? 'animate-slide-down-realistic' : ''
                }`}
                style={
                  hasSlideEvent
                    ? { animationDuration: `${slideAnimationDuration}ms` }
                    : {
                        left: '26%',
                        top: '24%',
                        transform: 'translate(-50%, -50%) rotate(-4deg)',
                      }
                }
              >
                <div className="flex flex-col items-center relative">
                  {/* Preemption Notification (Returning to queue) */}
                  {isPreempting && (
                    <div className="absolute top-full mt-1.5 bg-amber-400 text-amber-950 font-bold text-[10px] px-2.5 py-0.5 rounded-full shadow-md animate-bounce border border-amber-600 whitespace-nowrap z-30">
                      Turn over! Walking to queue ↩
                    </div>
                  )}

                  {/* Process Completion Notification (Done!) */}
                  {isCompleting && (
                    <div className="absolute top-full mt-1.5 bg-emerald-500 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full shadow-md animate-bounce border border-emerald-700 whitespace-nowrap z-30 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-200" />
                      <span>Finished all slides! 🎉</span>
                    </div>
                  )}

                  {/* Character Avatar */}
                  <ChildAvatar
                    id={slideChild.id}
                    name={slideChild.name}
                    color={slideChild.color}
                    avatarSeed={slideChild.avatarSeed}
                    remainingSlides={slideChild.remainingBurst}
                    totalSlides={slideChild.burstTime}
                    status={slideChild.status}
                    actionState={childActionState}
                    size="hero"
                    showCard={false}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* =========================================================
            BOTTOM STORYBOOK ZONES: WAITING QUEUE (L) & PICNIC (R)
            ========================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-auto">
          
          {/* ZONE 1: WAITING QUEUE (Ready Queue Analogy) */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-3.5 border-2 border-sky-200 shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-sky-100">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Users className="w-4 h-4 text-sky-600" />
                <span>Waiting Line ({readyQueue.length} children)</span>
              </div>
              <span className="text-[10px] font-mono-code font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                FIFO Queue (1st → Last)
              </span>
            </div>

            {readyQueue.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500 italic bg-sky-50/50 rounded-xl border border-dashed border-sky-200">
                Queue is clear · No children waiting right now.
              </div>
            ) : (
              <div className="flex items-end gap-3.5 overflow-x-auto pb-1 pt-2 min-h-[105px]">
                {readyQueue.map((childId, idx) => {
                  const child = processes[childId];
                  if (!child) return null;
                  return (
                    <div key={childId} className="flex flex-col items-center shrink-0 relative group">
                      {/* Step Number Flag */}
                      <span className="absolute -top-3.5 text-[9px] font-bold text-sky-900 bg-sky-100 border border-sky-200 px-2 py-0.2 rounded-full shadow-2xs">
                        #{idx + 1}
                      </span>
                      <ChildAvatar
                        id={child.id}
                        name={child.name}
                        color={child.color}
                        avatarSeed={child.avatarSeed}
                        remainingSlides={child.remainingBurst}
                        totalSlides={child.burstTime}
                        status="WAITING"
                        actionState="idle"
                        size="md"
                        showCard={true}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ZONE 2: PICNIC CELEBRATION (Completed Processes) */}
          <div className="bg-emerald-50/95 backdrop-blur-sm rounded-2xl p-3.5 border-2 border-emerald-200 shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-emerald-100">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
                <PartyPopper className="w-4 h-4 text-emerald-600" />
                <span>Picnic Celebration ({completedIds.length} done)</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                Finished All Slides
              </span>
            </div>

            {completedIds.length === 0 ? (
              <div className="py-6 text-center text-xs text-emerald-800/60 italic bg-white/70 rounded-xl border border-dashed border-emerald-200">
                Children will join the picnic celebration once they complete all their slides!
              </div>
            ) : (
              <div className="flex items-center gap-3.5 overflow-x-auto pb-1 pt-2 min-h-[105px]">
                {completedIds.map((childId) => {
                  const child = processes[childId];
                  if (!child) return null;
                  return (
                    <div key={childId} className="flex flex-col items-center shrink-0 relative">
                      <Sparkles className="w-4 h-4 text-amber-400 absolute -top-2 -right-1 animate-spin" />
                      <ChildAvatar
                        id={child.id}
                        name={child.name}
                        color={child.color}
                        avatarSeed={child.avatarSeed}
                        remainingSlides={0}
                        totalSlides={child.burstTime}
                        status="COMPLETED"
                        actionState="celebrating"
                        size="md"
                        showCard={true}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
