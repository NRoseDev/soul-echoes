/**
 * Room icons — original uploaded images from the repo root, wrapped in the
 * existing glowing chakra aura styling. Colors match each room's chakra tone.
 */
import braindumpAsset from "@/assets/rooms/braindump.jpg.asset.json";
import unspokenAsset from "@/assets/rooms/unspoken.png.asset.json";
import shadowAsset from "@/assets/rooms/shadow.jpg.asset.json";
import wisdomAsset from "@/assets/rooms/wisdom.png.asset.json";
import tribeAsset from "@/assets/rooms/tribe.jpg.asset.json";
import portalAsset from "@/assets/rooms/portal.png.asset.json";

type Props = { className?: string };
const base = "w-full h-full";

/** Shared glow wrapper — preserves the neon chakra aura across all room icons. */
function GlowImg({
  src,
  alt,
  color,
  className,
  rounded = "rounded-full",
}: {
  src: string;
  alt: string;
  color: string;
  className?: string;
  rounded?: string;
}) {
  return (
    <div
      className={`${rounded} overflow-hidden ${className ?? base}`}
      style={{
        filter: `drop-shadow(0 0 3px ${color}) drop-shadow(0 0 6px ${color}AA)`,
      }}
      aria-hidden="true"
    >
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </div>
  );
}

export function BrainDumpIcon({ className }: Props) {
  return <GlowImg src={braindumpAsset.url} alt="Brain Dump" color="#A855F7" className={className} />;
}

export function JournalIcon({ className }: Props) {
  // Journal room uses its own per-section icons in Journal.tsx; keep a simple
  // SE monogram fallback for the sidebar.
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className ?? base} aria-hidden="true">
      <rect x="4" y="2.5" width="15" height="19" rx="1.4" />
      <path d="M7.2 2.5v19" />
      <path d="M9.5 6.5h6M9.5 8.5h6" opacity=".75" />
      <text x="13" y="14.2" textAnchor="middle" fontSize="5.2" fontWeight="800"
        fill="currentColor" stroke="none"
        fontFamily="'Nunito', ui-sans-serif, system-ui" letterSpacing="-0.3">SE</text>
      <path d="M16.2 16.5c-.45-.55-1.35-.55-1.8 0-.32.4-.2.95.25 1.4l1.55 1.4 1.55-1.4c.45-.45.57-1 .25-1.4-.45-.55-1.35-.55-1.8 0z" fill="currentColor" stroke="none" />
      <path d="M10.5 21.5v2.2l1.6-1 1.6 1v-2.2" fill="currentColor" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export function FlowIcon({ className }: Props) {
  // Yin-yang style swirl for the Flow / Breathe room
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className ?? base} aria-hidden="true">
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 2a8 8 0 0 1 0 16 4 4 0 0 1 0-8 4 4 0 0 0 0-8z" />
      <circle cx="12" cy="8" r="1.3" fill="hsl(var(--background))" />
      <circle cx="12" cy="16" r="1.3" />
    </svg>
  );
}

export function UnspokenIcon({ className }: Props) {
  return <GlowImg src={unspokenAsset.url} alt="Unspoken Chamber" color="#38BDF8" className={className} />;
}

export function ToolsIcon({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className ?? base} aria-hidden="true">
      <path d="M12 2.8c-.9-1.1-2.7-1.1-3.6 0-.8 1-.5 2.3.4 3.2L12 9.4l3.2-3.4c.9-.9 1.2-2.2.4-3.2-.9-1.1-2.7-1.1-3.6 0z" />
      <path d="M9 11.5v-.5a3 3 0 0 1 6 0v.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="3.5" y="11.5" width="17" height="9" rx="1.5" />
      <rect x="10.5" y="14" width="3" height="2" rx="0.4" fill="hsl(var(--background))" />
    </svg>
  );
}

export function ShadowIcon({ className }: Props) {
  return <GlowImg src={shadowAsset.url} alt="Shadow Work" color="#DC2626" className={className} />;
}

export function WisdomIcon({ className }: Props) {
  return <GlowImg src={wisdomAsset.url} alt="Wisdom" color="#6366F1" className={className} />;
}

export function PortalIcon({ className }: Props) {
  return <GlowImg src={portalAsset.url} alt="Portal" color="#14B8A6" className={className} />;
}

export function CommunityIcon({ className }: Props) {
  return <GlowImg src={tribeAsset.url} alt="Tribe" color="#A78BFA" className={className} />;
}
