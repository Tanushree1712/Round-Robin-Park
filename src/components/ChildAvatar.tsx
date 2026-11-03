import React from 'react';

export type CharacterActionState =
  | 'idle'
  | 'walking'
  | 'climbing'
  | 'preparing'
  | 'sliding'
  | 'landing'
  | 'returning'
  | 'celebrating';

interface ChildAvatarProps {
  id: string;
  name: string;
  color: string;
  avatarSeed?: number;
  remainingSlides?: number;
  totalSlides?: number;
  status?: 'WAITING' | 'RUNNING' | 'PREEMPTED' | 'COMPLETED' | 'NOT_ARRIVED';
  actionState?: CharacterActionState;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showCard?: boolean;
}

export interface CharacterPreset {
  characterName: string;
  hairColor: string;
  hairHighlight: string;
  skinTone: string;
  eyeColor: string;
  blushColor: string;
  clothingColor: string;
  clothingAccent: string;
  style: 'ribbonBangs' | 'capBlonde' | 'curlyFreckles' | 'glassesPuffs' | 'bobCherry' | 'bandanaSpiky';
}

export const CHARACTER_PRESETS: CharacterPreset[] = [
  {
    characterName: 'Maya',
    hairColor: '#5C3826', // Warm milk chocolate
    hairHighlight: '#7C4A32',
    skinTone: '#FDEBD0', // Soft creamy peach
    eyeColor: '#4A2810', // Warm amber brown
    blushColor: '#FB7185',
    clothingColor: '#8E44FF',
    clothingAccent: '#F3E8FF',
    style: 'ribbonBangs',
  },
  {
    characterName: 'Leo',
    hairColor: '#D97706', // Sunny golden
    hairHighlight: '#F59E0B',
    skinTone: '#FED7AA', // Warm apricot
    eyeColor: '#047857', // Forest emerald
    blushColor: '#F43F5E',
    clothingColor: '#10B981',
    clothingAccent: '#ECFDF5',
    style: 'capBlonde',
  },
  {
    characterName: 'Sam',
    hairColor: '#C2410C', // Auburn copper
    hairHighlight: '#EA580C',
    skinTone: '#FEF3C7', // Fair peach
    eyeColor: '#1D4ED8', // Warm cobalt blue
    blushColor: '#FDA4AF',
    clothingColor: '#3B82F6',
    clothingAccent: '#EFF6FF',
    style: 'curlyFreckles',
  },
  {
    characterName: 'Zoe',
    hairColor: '#27272A', // Soft espresso
    hairHighlight: '#3F3F46',
    skinTone: '#F59E0B', // Golden honey
    eyeColor: '#582C0E', // Dark hazel
    blushColor: '#F43F5E',
    clothingColor: '#F59E0B',
    clothingAccent: '#FFFBEB',
    style: 'glassesPuffs',
  },
  {
    characterName: 'Chloe',
    hairColor: '#18181B', // Soft black
    hairHighlight: '#27272A',
    skinTone: '#FEE2E2', // Porcelain rose
    eyeColor: '#831843', // Rose berry
    blushColor: '#FB7185',
    clothingColor: '#EC4899',
    clothingAccent: '#FDF2F8',
    style: 'bobCherry',
  },
  {
    characterName: 'Kai',
    hairColor: '#1E293B', // Deep navy
    hairHighlight: '#334155',
    skinTone: '#FED7AA', // Sun-kissed tan
    eyeColor: '#0891B2', // Cyan ocean
    blushColor: '#F87171',
    clothingColor: '#06B6D4',
    clothingAccent: '#ECFEFF',
    style: 'bandanaSpiky',
  },
];

export const ChildAvatar: React.FC<ChildAvatarProps> = ({
  id,
  name,
  color,
  avatarSeed = 0,
  remainingSlides,
  totalSlides,
  status = 'WAITING',
  actionState,
  size = 'md',
  showCard = false,
}) => {
  const preset = CHARACTER_PRESETS[Math.abs(avatarSeed) % CHARACTER_PRESETS.length];

  // Derive animation state if not explicitly passed
  const effectiveState: CharacterActionState =
    actionState ||
    (status === 'COMPLETED'
      ? 'celebrating'
      : status === 'PREEMPTED'
      ? 'returning'
      : status === 'RUNNING'
      ? 'sliding'
      : 'idle');

  // Scaling dimensions
  const sizePixels =
    size === 'sm'
      ? 52
      : size === 'md'
      ? 74
      : size === 'lg'
      ? 96
      : 114; // 'hero' size on slide

  const isSliding = effectiveState === 'sliding';
  const isCelebrating = effectiveState === 'celebrating';
  const isWalking = effectiveState === 'walking' || effectiveState === 'returning';
  const isClimbing = effectiveState === 'climbing';
  const isPreparing = effectiveState === 'preparing';

  const strokeColor = '#334155'; // Soft charcoal outline

  return (
    <div className="flex flex-col items-center select-none group relative">
      {/* Information Tag: Compact & Elegant */}
      {showCard && (
        <div
          className="mb-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-xs transition-all border flex items-center gap-1.5 bg-white/95 backdrop-blur-xs"
          style={{ borderColor: color, color: '#1E293B' }}
        >
          <span
            className="w-2.5 h-2.5 rounded-full inline-block shrink-0 ring-1 ring-white"
            style={{ backgroundColor: color }}
          />
          <span className="font-display tracking-tight text-[11px]">
            {name || preset.characterName}
          </span>
          {totalSlides !== undefined && remainingSlides !== undefined && (
            <span className="text-[10px] text-slate-500 font-mono-code font-semibold pl-1 border-l border-slate-200">
              {remainingSlides}/{totalSlides}
            </span>
          )}
        </div>
      )}

      {/* Storybook Illustrated Character Container */}
      <div
        className={`relative transition-all duration-300 ${
          effectiveState === 'idle'
            ? 'animate-kid-idle'
            : isWalking
            ? 'animate-kid-walk'
            : isCelebrating
            ? 'animate-kid-celebrate'
            : ''
        }`}
        style={{ width: sizePixels, height: sizePixels }}
      >
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.1)]"
        >
          <defs>
            {/* Soft cheek blush */}
            <radialGradient id={`blush-${id}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={preset.blushColor} stopOpacity="0.75" />
              <stop offset="100%" stopColor={preset.blushColor} stopOpacity="0" />
            </radialGradient>

            {/* Soft hair shine gradient */}
            <linearGradient id={`hairShine-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={preset.hairHighlight} />
              <stop offset="100%" stopColor={preset.hairColor} />
            </linearGradient>

            {/* Soft cloth shading */}
            <linearGradient id={`clothGrad-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#0F172A" stopOpacity="0.12" />
            </linearGradient>
          </defs>

          {/* Contact Ground Shadow */}
          <ellipse cx="60" cy="112" rx="28" ry="5.5" fill="#0F172A" opacity="0.15" />

          {/* =========================================
              LEGS & SNEAKERS
              ========================================= */}
          <g id="legs">
            {isSliding ? (
              // Sliding: Legs stretched forward comfortably
              <g stroke={strokeColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="54" y="88" width="28" height="12" rx="6" fill="#3B82F6" />
                {/* Cute white & red sneaker */}
                <ellipse cx="82" cy="94" rx="7.5" ry="5.5" fill="#FFFFFF" />
                <path d="M 78 91 Q 88 93 88 97 Q 80 100 76 94 Z" fill="#EF4444" />
                <circle cx="83" cy="93" r="1.5" fill="#FFFFFF" />
              </g>
            ) : isClimbing ? (
              // Climbing: Alternating steps
              <g stroke={strokeColor} strokeWidth="2.2" strokeLinecap="round">
                <rect x="44" y="86" width="10" height="18" rx="5" fill="#3B82F6" />
                <ellipse cx="49" cy="104" rx="7" ry="4.5" fill="#FFFFFF" stroke={strokeColor} strokeWidth="1.8" />
                <ellipse cx="49" cy="103" rx="4" ry="2" fill="#EF4444" />
                <rect x="64" y="80" width="10" height="18" rx="5" fill="#3B82F6" />
                <ellipse cx="69" cy="98" rx="7" ry="4.5" fill="#FFFFFF" stroke={strokeColor} strokeWidth="1.8" />
                <ellipse cx="69" cy="97" rx="4" ry="2" fill="#EF4444" />
              </g>
            ) : (
              // Idle / Walking / Standing pose
              <g stroke={strokeColor} strokeWidth="2.2" strokeLinecap="round">
                <rect x="44" y="88" width="10" height="18" rx="5" fill="#3B82F6" />
                <ellipse cx="49" cy="106" rx="7.5" ry="4.5" fill="#FFFFFF" stroke={strokeColor} strokeWidth="1.8" />
                <ellipse cx="49" cy="105" rx="4.5" ry="2.2" fill="#EF4444" />
                <rect x="64" y="88" width="10" height="18" rx="5" fill="#3B82F6" />
                <ellipse cx="69" cy="106" rx="7.5" ry="4.5" fill="#FFFFFF" stroke={strokeColor} strokeWidth="1.8" />
                <ellipse cx="69" cy="105" rx="4.5" ry="2.2" fill="#EF4444" />
              </g>
            )}
          </g>

          {/* =========================================
              ARMS
              ========================================= */}
          <g id="arms">
            {isSliding || isCelebrating ? (
              // Pure Joy: Raised arms (\o/)
              <g stroke={strokeColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 40 68 L 26 44 L 20 36" fill="none" />
                <circle cx="20" cy="35" r="4.5" fill={preset.skinTone} stroke={strokeColor} strokeWidth="2" />
                <path d="M 80 68 L 94 44 L 100 36" fill="none" />
                <circle cx="100" cy="35" r="4.5" fill={preset.skinTone} stroke={strokeColor} strokeWidth="2" />
              </g>
            ) : isClimbing ? (
              // Climbing: Hands grasping
              <g stroke={strokeColor} strokeWidth="2.8" strokeLinecap="round">
                <path d="M 40 70 L 28 52" fill="none" />
                <circle cx="28" cy="50" r="4" fill={preset.skinTone} stroke={strokeColor} strokeWidth="2" />
                <path d="M 80 70 L 74 48" fill="none" />
                <circle cx="74" cy="46" r="4" fill={preset.skinTone} stroke={strokeColor} strokeWidth="2" />
              </g>
            ) : isPreparing ? (
              // Sitting atop the slide
              <g stroke={strokeColor} strokeWidth="2.8" strokeLinecap="round">
                <path d="M 38 70 Q 28 78 28 84" fill="none" />
                <circle cx="28" cy="84" r="4" fill={preset.skinTone} stroke={strokeColor} strokeWidth="2" />
                <path d="M 82 70 Q 92 78 92 84" fill="none" />
                <circle cx="92" cy="84" r="4" fill={preset.skinTone} stroke={strokeColor} strokeWidth="2" />
              </g>
            ) : (
              // Idle / Walk: Cute hands by sides
              <g stroke={strokeColor} strokeWidth="2.8" strokeLinecap="round">
                <path d="M 38 68 Q 30 78 34 86" fill="none" />
                <circle cx="34" cy="86" r="4" fill={preset.skinTone} stroke={strokeColor} strokeWidth="2" />
                <path d="M 82 68 Q 90 78 86 86" fill="none" />
                <circle cx="86" cy="86" r="4" fill={preset.skinTone} stroke={strokeColor} strokeWidth="2" />
              </g>
            )}
          </g>

          {/* =========================================
              TORSO / CLOTHING (Cute Kids Storybook)
              ========================================= */}
          <g id="torso">
            {/* Main Sweater/Dungarees */}
            <path
              d="M 36 62 Q 60 56 84 62 L 88 90 Q 60 95 32 90 Z"
              fill={color}
              stroke={strokeColor}
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <path
              d="M 36 62 Q 60 56 84 62 L 88 90 Q 60 95 32 90 Z"
              fill={`url(#clothGrad-${id})`}
            />

            {/* Overalls straps */}
            <path d="M 44 62 L 46 90" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
            <circle cx="45" cy="72" r="2" fill="#FCD34D" stroke="#78350F" strokeWidth="0.8" />
            <path d="M 76 62 L 74 90" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
            <circle cx="75" cy="72" r="2" fill="#FCD34D" stroke="#78350F" strokeWidth="0.8" />

            {/* Front Pocket with Process Badge */}
            <rect
              x="51"
              y="71"
              width="18"
              height="14"
              rx="4"
              fill="#FFFFFF"
              stroke={strokeColor}
              strokeWidth="1.8"
            />
            <text
              x="60"
              y="81.5"
              textAnchor="middle"
              fill="#0F172A"
              fontSize="9"
              fontWeight="bold"
              fontFamily="monospace"
            >
              {id}
            </text>

            {/* Soft Peter Pan Neck Collar */}
            <path d="M 50 56 Q 60 62 70 56" stroke={strokeColor} strokeWidth="2" fill="none" />
          </g>

          {/* =========================================
              HEAD & HAIR (Soft, Lovable Storybook Art)
              ========================================= */}
          {/* Back Hair Layer */}
          {preset.style === 'ribbonBangs' && (
            // Maya: Soft wavy hair falling behind shoulders
            <g id="maya-back-hair">
              <path
                d="M 31 38 C 20 48 19 66 27 75 C 33 80 40 76 38 64 C 36 54 38 45 37 38 Z"
                fill={preset.hairColor}
                stroke={strokeColor}
                strokeWidth="2.2"
                strokeLinejoin="round"
              />
              <path
                d="M 89 38 C 100 48 101 66 93 75 C 87 80 80 76 82 64 C 84 54 82 45 83 38 Z"
                fill={preset.hairColor}
                stroke={strokeColor}
                strokeWidth="2.2"
                strokeLinejoin="round"
              />
            </g>
          )}

          {preset.style === 'bobCherry' && (
            // Chloe: Full rounded bob back swing
            <path
              d="M 28 36 C 18 52 20 68 32 68 C 45 68 55 64 60 64 C 65 64 75 68 88 68 C 100 68 102 52 92 36 Z"
              fill={preset.hairColor}
              stroke={strokeColor}
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
          )}

          {preset.style === 'curlyFreckles' && (
            // Sam: Fluffy back cloud curls extending behind ears and shoulders
            <g id="sam-back-curls">
              <circle cx="28" cy="38" r="8" fill={preset.hairColor} stroke={strokeColor} strokeWidth="2" />
              <circle cx="27" cy="48" r="7" fill={preset.hairColor} stroke={strokeColor} strokeWidth="2" />
              <circle cx="92" cy="38" r="8" fill={preset.hairColor} stroke={strokeColor} strokeWidth="2" />
              <circle cx="93" cy="48" r="7" fill={preset.hairColor} stroke={strokeColor} strokeWidth="2" />
            </g>
          )}

          {preset.style === 'glassesPuffs' && (
            // Zoe: Two voluminous Afro puffs on upper sides
            <g id="zoe-afro-puffs">
              {/* Left Afro Puff */}
              <g>
                <circle cx="23" cy="22" r="14" fill={preset.hairColor} stroke={strokeColor} strokeWidth="2.2" />
                <circle cx="16" cy="18" r="7" fill={preset.hairColor} />
                <circle cx="20" cy="12" r="7" fill={preset.hairColor} />
                <circle cx="28" cy="12" r="7" fill={preset.hairColor} />
                <circle cx="32" cy="20" r="6" fill={preset.hairColor} />
                {/* Cute Coral & Gold Puff Hair Scrunchie */}
                <ellipse cx="32" cy="28" rx="5" ry="3.5" fill="#F59E0B" stroke={strokeColor} strokeWidth="1.2" transform="rotate(-30 32 28)" />
                <circle cx="33" cy="27" r="2" fill="#EF4444" />
              </g>

              {/* Right Afro Puff */}
              <g>
                <circle cx="97" cy="22" r="14" fill={preset.hairColor} stroke={strokeColor} strokeWidth="2.2" />
                <circle cx="104" cy="18" r="7" fill={preset.hairColor} />
                <circle cx="100" cy="12" r="7" fill={preset.hairColor} />
                <circle cx="92" cy="12" r="7" fill={preset.hairColor} />
                <circle cx="88" cy="20" r="6" fill={preset.hairColor} />
                {/* Cute Coral & Gold Puff Hair Scrunchie */}
                <ellipse cx="88" cy="28" rx="5" ry="3.5" fill="#F59E0B" stroke={strokeColor} strokeWidth="1.2" transform="rotate(30 88 28)" />
                <circle cx="87" cy="27" r="2" fill="#EF4444" />
              </g>
            </g>
          )}

          {/* Cute Soft Rounded Ears */}
          <circle cx="33" cy="42" r="5" fill={preset.skinTone} stroke={strokeColor} strokeWidth="2" />
          <circle cx="33" cy="42" r="2" fill="#F43F5E" opacity="0.3" />
          <circle cx="87" cy="42" r="5" fill={preset.skinTone} stroke={strokeColor} strokeWidth="2" />
          <circle cx="87" cy="42" r="2" fill="#F43F5E" opacity="0.3" />

          {/* Soft Rounded Head */}
          <circle
            cx="60"
            cy="40"
            r="27"
            fill={preset.skinTone}
            stroke={strokeColor}
            strokeWidth="2.5"
          />

          {/* FRONT HAIR STYLES */}
          {preset.style === 'ribbonBangs' && (
            // Maya: Soft wispy bangs with lilac ribbon bow
            <g id="maya-front-hair">
              {/* Main hair dome & side locks */}
              <path
                d="M 31 46 C 30 32 30 22 42 12 C 50 7 70 7 78 12 C 90 22 90 32 89 46 C 85 41 84 34 83 32 C 77 30 71 33 66 30 C 60 28 54 32 48 30 C 42 32 37 30 34 35 C 33 39 33 43 31 46 Z"
                fill={`url(#hairShine-${id})`}
                stroke={strokeColor}
                strokeWidth="2.2"
                strokeLinejoin="round"
              />
              {/* Soft brow bangs tips with warm shading */}
              <path
                d="M 34 32 C 40 30 46 32 50 30 C 56 32 62 28 68 31 C 74 32 80 29 84 32 C 81 26 71 23 60 23 C 49 23 39 26 34 32 Z"
                fill={preset.hairColor}
              />
              {/* Hair shine sweep */}
              <path d="M 42 16 Q 60 11 78 16 Q 77 19 60 15 Q 43 19 42 16 Z" fill={preset.hairHighlight} opacity="0.7" />
              {/* Sweet Lilac Ribbon Bow */}
              <g>
                <circle cx="76" cy="22" r="3.5" fill="#C084FC" stroke={strokeColor} strokeWidth="1.2" />
                <polygon points="76,22 86,16 85,26" fill="#C084FC" stroke={strokeColor} strokeWidth="1.2" />
                <polygon points="76,22 66,16 67,26" fill="#C084FC" stroke={strokeColor} strokeWidth="1.2" />
                <path d="M 75 25 Q 73 31 71 33" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d="M 77 25 Q 79 31 81 33" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" fill="none" />
              </g>
            </g>
          )}

          {preset.style === 'capBlonde' && (
            // Leo: Rich Blonde Locks & Backwards Skater Cap
            <g id="leo-hair">
              {/* Side Hair Strands (Framing cheeks and ears) */}
              <path
                d="M 33 36 C 28 42 28 50 34 54 C 37 56 39 51 38 44 C 37 40 37 36 37 36 Z"
                fill={preset.hairColor}
                stroke={strokeColor}
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M 87 36 C 92 42 92 50 86 54 C 83 56 81 51 82 44 C 83 40 83 36 83 36 Z"
                fill={preset.hairColor}
                stroke={strokeColor}
                strokeWidth="2"
                strokeLinejoin="round"
              />

              {/* Generous Thick Blonde Bangs Sweeping Across Forehead */}
              <path
                d="M 34 32 C 37 25 43 27 46 31 C 49 26 55 26 58 31 C 62 25 68 26 72 31 C 76 26 82 27 86 32 C 84 25 78 22 68 21 C 56 21 44 24 34 32 Z"
                fill={preset.hairColor}
                stroke={strokeColor}
                strokeWidth="2"
                strokeLinejoin="round"
              />
              {/* Cute textured hair tufts right above brow */}
              <polygon points="44,30 48,34 49,29" fill={preset.hairHighlight} />
              <polygon points="57,29 61,34 62,29" fill={preset.hairHighlight} />
              <polygon points="70,29 74,34 75,29" fill={preset.hairHighlight} />

              {/* Backwards Cap Body */}
              <path
                d="M 33 26 C 33 11 87 11 87 26 C 76 23 60 22 44 23 Z"
                fill={color}
                stroke={strokeColor}
                strokeWidth="2.2"
                strokeLinejoin="round"
              />
              {/* Cap Rim / Headband */}
              <path d="M 33 26 Q 60 23 87 26" stroke={strokeColor} strokeWidth="2.2" fill="none" />
              {/* Backwards Visor Bill */}
              <path
                d="M 47 21 C 42 26 78 26 73 21 C 69 17 51 17 47 21 Z"
                fill="#1E293B"
                stroke={strokeColor}
                strokeWidth="1.8"
              />
              {/* Cap Button on Crown */}
              <circle cx="60" cy="11" r="3" fill="#FFFFFF" stroke={strokeColor} strokeWidth="1.2" />
              {/* Eyelet ventilation holes */}
              <circle cx="48" cy="18" r="1.2" fill="#0F172A" opacity="0.4" />
              <circle cx="72" cy="18" r="1.2" fill="#0F172A" opacity="0.4" />
            </g>
          )}

          {preset.style === 'curlyFreckles' && (
            // Sam: Fluffy, Bouncy Auburn Cloud Curls
            <g id="sam-hair">
              {/* Main Full Curly Cloud Volume */}
              <path
                d="M 29 46 C 24 40 23 32 26 24 C 23 16 32 8 42 8 C 48 4 60 4 68 7 C 76 4 86 8 92 15 C 98 22 97 32 94 40 C 97 46 92 50 88 47 C 84 41 83 35 81 33 C 77 30 73 34 68 30 C 64 28 60 32 55 30 C 50 28 46 33 41 30 C 37 34 35 40 32 46 Z"
                fill={`url(#hairShine-${id})`}
                stroke={strokeColor}
                strokeWidth="2.2"
                strokeLinejoin="round"
              />
              {/* Bouncy Curly Bangs Lobes across Forehead (Touching brow line y=30-32) */}
              <g fill={preset.hairColor} stroke={strokeColor} strokeWidth="1.6">
                <circle cx="40" cy="30" r="5" />
                <circle cx="50" cy="29" r="5.5" />
                <circle cx="60" cy="28.5" r="5.5" />
                <circle cx="70" cy="29" r="5.5" />
                <circle cx="79" cy="31" r="5" />
              </g>

              {/* Storybook Curl Texture Swirls */}
              <g stroke={preset.hairHighlight} strokeWidth="2.2" strokeLinecap="round" fill="none">
                <path d="M 36 18 Q 42 12 40 22" />
                <path d="M 50 13 Q 56 8 57 16" />
                <path d="M 66 12 Q 72 8 71 16" />
                <path d="M 80 17 Q 86 13 83 23" />
                <path d="M 45 27 Q 50 24 48 29" stroke={preset.hairColor} strokeWidth="1.8" />
                <path d="M 65 26 Q 70 23 68 29" stroke={preset.hairColor} strokeWidth="1.8" />
              </g>

              {/* Whimsical Bouncy Spring Curl on Top */}
              <path d="M 58 7 Q 66 1 63 9" stroke={preset.hairColor} strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M 58 7 Q 66 1 63 9" stroke={preset.hairHighlight} strokeWidth="1.5" strokeLinecap="round" fill="none" />
            </g>
          )}

          {preset.style === 'glassesPuffs' && (
            // Zoe: Afro Head Volume & Soft Curly Fringe with Round Spectacles
            <g id="zoe-hair">
              {/* Head Silhouette Covering Crown Down to Brow */}
              <path
                d="M 31 44 C 28 32 28 20 40 10 C 50 5 70 5 80 10 C 92 20 92 32 89 44 C 84 38 84 34 82 31 C 77 28 73 32 68 29 C 62 28 58 31 52 29 C 47 31 42 28 38 31 C 36 34 35 39 31 44 Z"
                fill={preset.hairColor}
                stroke={strokeColor}
                strokeWidth="2.2"
                strokeLinejoin="round"
              />
              {/* Cute Scalloped Ringlet Bangs (Reaching y=30 across forehead) */}
              <g fill={preset.hairColor} stroke={strokeColor} strokeWidth="1.6">
                <circle cx="42" cy="30" r="4.5" />
                <circle cx="51" cy="29" r="4.5" />
                <circle cx="60" cy="28.5" r="4.5" />
                <circle cx="69" cy="29" r="4.5" />
                <circle cx="78" cy="30" r="4.5" />
              </g>
              {/* Hair Highlight Sheen */}
              <path d="M 44 14 Q 60 10 76 14" stroke={preset.hairHighlight} strokeWidth="3" strokeLinecap="round" fill="none" />
            </g>
          )}

          {preset.style === 'bobCherry' && (
            // Chloe: Sleek Rounded Bob with Thick Bangs & Cherry Pin
            <g id="chloe-hair">
              {/* Sleek Bob Front Layer with Cheeks Framing */}
              <path
                d="M 31 56 C 28 44 28 24 40 10 C 50 6 70 6 80 10 C 92 24 92 44 89 56 C 85 48 84 38 83 34 C 76 30.5 68 31 60 29.5 C 52 31 44 30.5 37 34 C 36 38 35 48 31 56 Z"
                fill={preset.hairColor}
                stroke={strokeColor}
                strokeWidth="2.2"
                strokeLinejoin="round"
              />
              {/* Glossy Hair Shine Arc */}
              <path d="M 42 16 Q 60 11 78 16" stroke={preset.hairHighlight} strokeWidth="2.5" strokeLinecap="round" fill="none" />

              {/* Sweet Red Double Cherry Hairpin */}
              <g>
                <circle cx="77" cy="27" r="3.5" fill="#EF4444" stroke={strokeColor} strokeWidth="1" />
                <circle cx="83" cy="26" r="3.5" fill="#DC2626" stroke={strokeColor} strokeWidth="1" />
                <circle cx="76" cy="26" r="1" fill="#FFFFFF" />
                <circle cx="82" cy="25" r="1" fill="#FFFFFF" />
                <path d="M 77 24 Q 79 18 82 20" stroke="#15803D" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                <path d="M 83 23 Q 81 18 82 20" stroke="#15803D" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                <polygon points="82,20 87,17 85,21" fill="#22C55E" stroke="#15803D" strokeWidth="0.8" />
              </g>
            </g>
          )}

          {preset.style === 'bandanaSpiky' && (
            // Kai: Dynamic Spiky Hair with Headband
            <g id="kai-hair">
              {/* Spikes Rising on Top of Head */}
              <path
                d="M 31 34 L 24 24 L 33 22 L 35 12 L 44 18 L 52 7 L 60 16 L 68 7 L 76 18 L 85 12 L 87 22 L 96 24 L 89 34 Z"
                fill={preset.hairColor}
                stroke={strokeColor}
                strokeWidth="2.2"
                strokeLinejoin="round"
              />
              {/* Side Locks Framing Cheeks */}
              <path d="M 32 34 C 29 40 29 48 35 52" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" fill="none" />
              <path d="M 88 34 C 91 40 91 48 85 52" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" fill="none" />

              {/* Bandana Wrapping Across Forehead */}
              <path
                d="M 30 28 Q 60 22 90 28 L 89 33 Q 60 27 31 33 Z"
                fill="#06B6D4"
                stroke={strokeColor}
                strokeWidth="2"
                strokeLinejoin="round"
              />
              {/* Fluttering Bandana Tails on Left */}
              <polygon points="30,28 17,23 23,31" fill="#06B6D4" stroke={strokeColor} strokeWidth="1.5" />
              <polygon points="31,31 19,37 26,35" fill="#0891B2" stroke={strokeColor} strokeWidth="1.5" />

              {/* Front Spiky Fringe Spilling Under Bandana (Touching brows at y=30-32) */}
              <g fill={preset.hairColor} stroke={strokeColor} strokeWidth="1.6" strokeLinejoin="round">
                <polygon points="38,32 42,36 46,31" />
                <polygon points="48,31 53,37 57,30" />
                <polygon points="59,30 64,36 68,31" />
                <polygon points="70,31 75,37 79,32" />
              </g>
            </g>
          )}

          {/* Rosy Airbrushed Cheeks */}
          <circle cx="43" cy="46" r="6" fill={`url(#blush-${id})`} />
          <circle cx="77" cy="46" r="6" fill={`url(#blush-${id})`} />

          {/* Sam's Soft Freckles */}
          {preset.style === 'curlyFreckles' && (
            <g fill="#B45309" opacity="0.6">
              <circle cx="44" cy="45" r="0.9" />
              <circle cx="47" cy="47" r="0.9" />
              <circle cx="73" cy="47" r="0.9" />
              <circle cx="76" cy="45" r="0.9" />
              <circle cx="60" cy="44" r="0.9" />
            </g>
          )}

          {/* Zoe's Cute Glasses */}
          {preset.style === 'glassesPuffs' && (
            <g stroke="#78350F" strokeWidth="2" fill="none">
              <circle cx="49" cy="40" r="7.5" />
              <circle cx="71" cy="40" r="7.5" />
              <line x1="56.5" y1="40" x2="63.5" y2="40" />
            </g>
          )}

          {/* Delicate Eyebrows */}
          <path d="M 45 32 Q 50 29 55 32" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <path d="M 65 32 Q 70 29 75 32" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" fill="none" />

          {/* =========================================
              LOVABLE STORYBOOK EYES (Soft, Warm, Alive)
              ========================================= */}
          {isCelebrating ? (
            // Joyful closed laughing eyes ^ ^
            <g stroke={strokeColor} strokeWidth="2.6" strokeLinecap="round" fill="none">
              <path d="M 45 40 Q 50 33 55 40" />
              <path d="M 65 40 Q 70 33 75 40" />
            </g>
          ) : (
            // Soft warm storybook eyes with gentle lash & shine
            <g id="storybook-eyes">
              {/* Left Eye */}
              <circle cx="50" cy="40" r="4.8" fill={preset.eyeColor} />
              <circle cx="50" cy="40" r="2.8" fill="#0F172A" />
              {/* Sparkling light catches */}
              <circle cx="48.5" cy="38.5" r="1.6" fill="#FFFFFF" />
              <circle cx="51.5" cy="41.5" r="0.8" fill="#FFFFFF" />
              {/* Upper soft curved lash */}
              <path d="M 44 38 Q 50 34 55 38" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" fill="none" />

              {/* Right Eye */}
              <circle cx="70" cy="40" r="4.8" fill={preset.eyeColor} />
              <circle cx="70" cy="40" r="2.8" fill="#0F172A" />
              {/* Sparkling light catches */}
              <circle cx="68.5" cy="38.5" r="1.6" fill="#FFFFFF" />
              <circle cx="71.5" cy="41.5" r="0.8" fill="#FFFFFF" />
              {/* Upper soft curved lash */}
              <path d="M 65 38 Q 70 34 76 38" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" fill="none" />
            </g>
          )}

          {/* Cute Button Nose */}
          <circle cx="60" cy="44" r="1.2" fill="#B45309" opacity="0.4" />

          {/* Sweet Storybook Smile */}
          {isSliding || isCelebrating ? (
            // Happy open laugh with little tongue
            <g>
              <path
                d="M 53 47 Q 60 57 67 47 Z"
                fill="#EF4444"
                stroke={strokeColor}
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <path d="M 55 48 Q 60 51 65 48" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" />
              <ellipse cx="60" cy="53" rx="3.5" ry="2" fill="#FDA4AF" />
            </g>
          ) : (
            // Sweet happy curved smile
            <path
              d="M 54 48 Q 60 53 66 48"
              fill="none"
              stroke={strokeColor}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          )}
        </svg>

        {/* Done badge for completed */}
        {status === 'COMPLETED' && (
          <div className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full shadow-xs ring-1 ring-white">
            DONE!
          </div>
        )}
      </div>

      {/* Name label (only shown when not on active slide) */}
      {!showCard && status !== 'RUNNING' && (
        <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 mt-0.5">
          {name || preset.characterName}
        </span>
      )}
    </div>
  );
};
