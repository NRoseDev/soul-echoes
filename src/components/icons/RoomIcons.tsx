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
  // Open hand cradling a heart — "the unspoken held with care"
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className ?? base} aria-hidden="true">
      <path d="M12 8c-.9-1.4-3.2-1.4-4.1 0-.8 1.2-.3 2.7.9 3.8L12 15l3.2-3.2c1.2-1.1 1.7-2.6.9-3.8-.9-1.4-3.2-1.4-4.1 0z" />
      <path d="M4.5 13c-.8 0-1.5.7-1.5 1.5v3C3 19.4 4.6 21 6.5 21h11c1.9 0 3.5-1.6 3.5-3.5v-3c0-.8-.7-1.5-1.5-1.5s-1.5.7-1.5 1.5V17H6v-2.5C6 13.7 5.3 13 4.5 13z" opacity=".85" />
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

export function ToolsIcon({ className }: Props) {
  // Flower of life / seed-of-life sacred geometry
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className={className ?? base} aria-hidden="true">
      <circle cx="12" cy="12" r="3.2" />
      <circle cx="12" cy="8.2" r="3.2" />
      <circle cx="12" cy="15.8" r="3.2" />
      <circle cx="8.7" cy="10.1" r="3.2" />
      <circle cx="15.3" cy="10.1" r="3.2" />
      <circle cx="8.7" cy="13.9" r="3.2" />
      <circle cx="15.3" cy="13.9" r="3.2" />
      <circle cx="12" cy="12" r="9" opacity=".5" />
    </svg>
  );
}

export function PortalIcon({ className }: Props) {
  // Celestial gateway — gold ring with starburst center
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className ?? base} aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="#2dd4bf" strokeWidth="1.2" strokeOpacity="0.6" />
      <circle cx="12" cy="12" r="8.5" stroke="#f59e0b" strokeWidth="2.2" />
      <circle cx="12" cy="12" r="6.5" stroke="#2dd4bf" strokeWidth="0.8" strokeOpacity="0.7" />
      <line x1="12" y1="6.8" x2="12" y2="9.2" stroke="#fbbf24" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="12" y1="14.8" x2="12" y2="17.2" stroke="#fbbf24" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="6.8" y1="12" x2="9.2" y2="12" stroke="#fbbf24" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="14.8" y1="12" x2="17.2" y2="12" stroke="#fbbf24" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="8.5" y1="8.5" x2="9.9" y2="9.9" stroke="#2dd4bf" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="14.1" y1="14.1" x2="15.5" y2="15.5" stroke="#2dd4bf" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="15.5" y1="8.5" x2="14.1" y2="9.9" stroke="#2dd4bf" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="9.9" y1="14.1" x2="8.5" y2="15.5" stroke="#2dd4bf" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="12" cy="12" r="1.8" fill="#fde68a" />
      <circle cx="12" cy="12" r="0.9" fill="#ffffff" />
    </svg>
  );
}
