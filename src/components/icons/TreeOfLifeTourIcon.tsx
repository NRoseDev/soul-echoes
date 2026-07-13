interface Props {
  className?: string;
  title?: string;
}

/**
 * "AI Tour & System Guide" badge.
 * A minimalist glowing Tree of Life silhouette enclosed inside an open
 * compass / tracking ring, styled in iridescent purple + gold to match the
 * sanctuary aesthetic. Rendered at the same fidelity as the room icons.
 */
export function TreeOfLifeTourIcon({ className, title = "AI Tour & System Guide" }: Props) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <title>{title}</title>
      <defs>
        <radialGradient id="tourHalo" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="hsl(280 90% 78%)" stopOpacity="0.55" />
          <stop offset="70%" stopColor="hsl(45 95% 65%)" stopOpacity="0.12" />
          <stop offset="100%" stopColor="hsl(280 60% 20%)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="tourRing" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(45 95% 72%)" />
          <stop offset="45%" stopColor="hsl(300 85% 72%)" />
          <stop offset="100%" stopColor="hsl(265 90% 65%)" />
        </linearGradient>
        <linearGradient id="tourTree" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(45 100% 78%)" />
          <stop offset="55%" stopColor="hsl(300 85% 72%)" />
          <stop offset="100%" stopColor="hsl(260 90% 62%)" />
        </linearGradient>
      </defs>

      {/* Soft iridescent halo */}
      <circle cx="32" cy="32" r="28" fill="url(#tourHalo)" />

      {/* Open compass / tracking ring — dashed to feel like a navigation reticle */}
      <circle
        cx="32"
        cy="32"
        r="24"
        stroke="url(#tourRing)"
        strokeWidth="2"
        strokeDasharray="3 4"
        strokeLinecap="round"
        opacity="0.95"
      />
      {/* Cardinal tick marks */}
      <g stroke="url(#tourRing)" strokeWidth="2" strokeLinecap="round">
        <line x1="32" y1="4" x2="32" y2="10" />
        <line x1="32" y1="54" x2="32" y2="60" />
        <line x1="4" y1="32" x2="10" y2="32" />
        <line x1="54" y1="32" x2="60" y2="32" />
      </g>

      {/* Minimalist Tree of Life silhouette */}
      <g stroke="url(#tourTree)" strokeWidth="1.75" strokeLinecap="round" fill="none">
        {/* Trunk */}
        <path d="M32 44 L32 26" />
        {/* Roots */}
        <path d="M32 44 C 30 46, 26 47, 22 48" />
        <path d="M32 44 C 34 46, 38 47, 42 48" />
        <path d="M32 44 L28 49" />
        <path d="M32 44 L36 49" />
        {/* Branches */}
        <path d="M32 30 C 28 28, 24 25, 22 21" />
        <path d="M32 30 C 36 28, 40 25, 42 21" />
        <path d="M32 26 C 30 22, 28 20, 26 18" />
        <path d="M32 26 C 34 22, 36 20, 38 18" />
        <path d="M32 26 L32 17" />
      </g>

      {/* Canopy glow dots — subtle "leaves of light" */}
      <g fill="hsl(45 100% 82%)">
        <circle cx="32" cy="16" r="1.6" />
        <circle cx="25" cy="18" r="1.2" />
        <circle cx="39" cy="18" r="1.2" />
        <circle cx="21" cy="21" r="1" />
        <circle cx="43" cy="21" r="1" />
      </g>
    </svg>
  );
}

export default TreeOfLifeTourIcon;
