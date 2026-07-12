interface Props {
  className?: string;
  title?: string;
}

/**
 * Custom "Take a Tour" badge: a Tree of Life inside a soft glowing organic
 * circle, with a friendly hand pointing to it.
 */
export function TreeOfLifeTourIcon({ className, title = "Take a Tour" }: Props) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <defs>
        <radialGradient id="tolGlow" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="hsl(45 95% 78%)" stopOpacity="0.95" />
          <stop offset="60%" stopColor="hsl(28 85% 60%)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="hsl(20 60% 35%)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="tolLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(150 55% 55%)" />
          <stop offset="100%" stopColor="hsl(165 45% 38%)" />
        </linearGradient>
        <linearGradient id="tolTrunk" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(28 55% 55%)" />
          <stop offset="100%" stopColor="hsl(24 45% 32%)" />
        </linearGradient>
        <linearGradient id="tolSkin" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(28 78% 78%)" />
          <stop offset="100%" stopColor="hsl(20 60% 55%)" />
        </linearGradient>
      </defs>

      {/* Soft glowing organic halo */}
      <circle cx="28" cy="28" r="24" fill="url(#tolGlow)" />
      <circle
        cx="28"
        cy="28"
        r="21"
        fill="hsl(35 60% 12% / 0.55)"
        stroke="hsl(45 90% 75% / 0.75)"
        strokeWidth="1.2"
      />

      {/* Tree of Life */}
      {/* Foliage cluster */}
      <g>
        <circle cx="28" cy="20" r="7.5" fill="url(#tolLeaf)" />
        <circle cx="20.5" cy="24" r="5.5" fill="url(#tolLeaf)" opacity="0.9" />
        <circle cx="35.5" cy="24" r="5.5" fill="url(#tolLeaf)" opacity="0.9" />
        <circle cx="24" cy="16" r="4" fill="url(#tolLeaf)" opacity="0.85" />
        <circle cx="32" cy="16" r="4" fill="url(#tolLeaf)" opacity="0.85" />
      </g>
      {/* Trunk with branching roots */}
      <path
        d="M28 22 C 28 28, 26 32, 26 38 C 26 40, 24 41, 22 42 M28 22 C 28 28, 30 32, 30 38 C 30 40, 32 41, 34 42 M28 22 L28 42"
        stroke="url(#tolTrunk)"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Tiny fruit dots */}
      <circle cx="24" cy="20" r="0.9" fill="hsl(45 95% 70%)" />
      <circle cx="32" cy="22" r="0.9" fill="hsl(45 95% 70%)" />
      <circle cx="28" cy="17" r="0.9" fill="hsl(45 95% 70%)" />

      {/* Friendly pointing hand, bottom-right */}
      <g transform="translate(38 34) rotate(-18)">
        {/* palm */}
        <rect
          x="0"
          y="4"
          width="14"
          height="12"
          rx="4"
          fill="url(#tolSkin)"
          stroke="hsl(20 55% 30%)"
          strokeWidth="0.8"
        />
        {/* pointing index finger */}
        <rect
          x="-9"
          y="7"
          width="11"
          height="4"
          rx="2"
          fill="url(#tolSkin)"
          stroke="hsl(20 55% 30%)"
          strokeWidth="0.8"
        />
        {/* thumb */}
        <rect
          x="2"
          y="1"
          width="4"
          height="6"
          rx="2"
          fill="url(#tolSkin)"
          stroke="hsl(20 55% 30%)"
          strokeWidth="0.8"
        />
        {/* fingernail hint */}
        <circle cx="-8" cy="9" r="0.9" fill="hsl(40 90% 88%)" />
      </g>
    </svg>
  );
}

export default TreeOfLifeTourIcon;
