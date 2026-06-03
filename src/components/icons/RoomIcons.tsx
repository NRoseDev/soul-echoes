/**
 * Custom spiritual / sacred-geometry style icons for the healing rooms.
 * All icons use currentColor so existing text-color tokens still apply.
 */
type Props = { className?: string };

const base = "w-full h-full";

export function BrainDumpIcon({ className }: Props) {
  // Meditating figure with a glow halo — "thoughts flowing out"
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className ?? base} aria-hidden="true">
      <circle cx="12" cy="5.5" r="2.2" />
      <path d="M12 8.2c-1.6 0-3 1.2-3 2.8 0 1.1.6 2 1.4 2.6-1.9.4-3.4 1.8-4.1 3.6-.3.7.2 1.4.9 1.4h13.6c.7 0 1.2-.7.9-1.4-.7-1.8-2.2-3.2-4.1-3.6.8-.6 1.4-1.5 1.4-2.6 0-1.6-1.4-2.8-3-2.8" opacity=".9" />
      <circle cx="5" cy="6" r=".8" opacity=".5" />
      <circle cx="19" cy="7" r=".6" opacity=".5" />
      <circle cx="3.5" cy="10" r=".5" opacity=".4" />
      <circle cx="20.5" cy="11" r=".5" opacity=".4" />
    </svg>
  );
}

export function JournalIcon({ className }: Props) {
  // Closed journal: spine, ruled lines, bold SE monogram on cover, heart + bookmark
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className ?? base} aria-hidden="true">
      {/* book body */}
      <rect x="4" y="2.5" width="15" height="19" rx="1.4" />
      {/* spine */}
      <path d="M7.2 2.5v19" />
      {/* ruled lines */}
      <path d="M9.5 6.5h6M9.5 8.5h6" opacity=".75" />
      {/* SE monogram — large, bold, clearly readable */}
      <text x="13" y="14.2" textAnchor="middle" fontSize="5.2" fontWeight="800"
        fill="currentColor" stroke="none"
        fontFamily="'Nunito', ui-sans-serif, system-ui" letterSpacing="-0.3">SE</text>
      {/* small heart */}
      <path d="M16.2 16.5c-.45-.55-1.35-.55-1.8 0-.32.4-.2.95.25 1.4l1.55 1.4 1.55-1.4c.45-.45.57-1 .25-1.4-.45-.55-1.35-.55-1.8 0z" fill="currentColor" stroke="none" />
      {/* bookmark tail */}
      <path d="M10.5 21.5v2.2l1.6-1 1.6 1v-2.2" fill="currentColor" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export function FlowIcon({ className }: Props) {
  // Yin-yang style swirl — two interlocking currents
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className ?? base} aria-hidden="true">
      {/* outer ring */}
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 2a8 8 0 0 1 0 16 4 4 0 0 1 0-8 4 4 0 0 0 0-8z" />
      {/* small dots — the seed of each current */}
      <circle cx="12" cy="8" r="1.3" fill="hsl(var(--background))" />
      <circle cx="12" cy="16" r="1.3" />
    </svg>
  );
}

export function UnspokenIcon({ className }: Props) {
  // Microphone framed by neon brackets — "the unspoken truth, spoken aloud"
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className ?? base} aria-hidden="true">
      {/* left bracket < */}
      <path d="M5 8l-2.2 4L5 16" />
      {/* right bracket > */}
      <path d="M19 8l2.2 4L19 16" />
      {/* mic capsule */}
      <rect x="9.5" y="4.5" width="5" height="10" rx="2.5" fill="currentColor" stroke="none" />
      {/* mic grille lines */}
      <path d="M10.5 7.5h3M10.5 9.5h3M10.5 11.5h3" stroke="hsl(var(--background))" strokeWidth="0.6" opacity=".8" />
      {/* mic stand arc */}
      <path d="M7.5 13a4.5 4.5 0 0 0 9 0" />
      {/* stand pole + base */}
      <path d="M12 17.5v2.5M9.5 20h5" />
    </svg>
  );
}

export function ToolsIcon({ className }: Props) {
  // Toolbox with a heart floating above — care + craft
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className ?? base} aria-hidden="true">
      {/* floating heart above */}
      <path d="M12 2.8c-.9-1.1-2.7-1.1-3.6 0-.8 1-.5 2.3.4 3.2L12 9.4l3.2-3.4c.9-.9 1.2-2.2.4-3.2-.9-1.1-2.7-1.1-3.6 0z" />
      {/* toolbox handle */}
      <path d="M9 11.5v-.5a3 3 0 0 1 6 0v.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* toolbox body */}
      <rect x="3.5" y="11.5" width="17" height="9" rx="1.5" />
      {/* latch */}
      <rect x="10.5" y="14" width="3" height="2" rx="0.4" fill="hsl(var(--background))" />
    </svg>
  );
}

export function ShadowIcon({ className }: Props) {
  // Crescent moon embracing a small star — shadow + light
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className ?? base} aria-hidden="true">
      <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
      <path d="M15 6l.7 1.7L17.5 8l-1.8.6L15 10.5l-.7-1.9L12.5 8l1.8-.3z" opacity=".9" />
    </svg>
  );
}

export function WisdomIcon({ className }: Props) {
  // Third eye inside a radiant burst
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={className ?? base} aria-hidden="true">
      <path d="M3 12c2.5-3.5 6-5 9-5s6.5 1.5 9 5c-2.5 3.5-6 5-9 5s-6.5-1.5-9-5z" fill="currentColor" fillOpacity=".15" />
      <circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none" />
      <path d="M12 3v2M12 19v2M4.5 4.5l1.4 1.4M18.1 18.1l1.4 1.4M3 12h2M19 12h2M4.5 19.5l1.4-1.4M18.1 5.9l1.4-1.4" opacity=".7" />
    </svg>
  );
}

export function PortalIcon({ className }: Props) {
  // Spiraling vortex gateway — silver arms fading to gold tips, dark event horizon at center
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className ?? base} aria-hidden="true">
      <defs>
        <linearGradient id="portal-silver-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#cbd5e1" />
          <stop offset="55%" stopColor="#e5e7eb" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <radialGradient id="portal-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0a0a0a" />
          <stop offset="100%" stopColor="#27272a" />
        </radialGradient>
      </defs>
      {/* six spiral arms rotating around center */}
      <g stroke="url(#portal-silver-gold)" strokeWidth="1.6" strokeLinecap="round" fill="none">
        <path d="M12 12c0-3.5 2.5-6.5 6-7" />
        <path d="M12 12c0 3.5-2.5 6.5-6 7" />
        <g transform="rotate(60 12 12)">
          <path d="M12 12c0-3.5 2.5-6.5 6-7" />
          <path d="M12 12c0 3.5-2.5 6.5-6 7" />
        </g>
        <g transform="rotate(120 12 12)">
          <path d="M12 12c0-3.5 2.5-6.5 6-7" />
          <path d="M12 12c0 3.5-2.5 6.5-6 7" />
        </g>
      </g>
      {/* glowing gold tips */}
      <circle cx="18" cy="5" r="0.7" fill="#fbbf24" />
      <circle cx="6" cy="19" r="0.7" fill="#fbbf24" />
      <circle cx="19" cy="15" r="0.7" fill="#fbbf24" />
      <circle cx="5" cy="9" r="0.7" fill="#fbbf24" />
      <circle cx="15" cy="19" r="0.7" fill="#fbbf24" />
      <circle cx="9" cy="5" r="0.7" fill="#fbbf24" />
      {/* dark event horizon with silver rim */}
      <circle cx="12" cy="12" r="3.2" fill="url(#portal-core)" stroke="#e5e7eb" strokeWidth="0.5" />
    </svg>
  );
}
