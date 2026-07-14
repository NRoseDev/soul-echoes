import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Scissors } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LevelPath } from "@/components/levels/LevelPath";

/* ---------- Neon glow wrapper ---------- */
type IconProps = { className?: string };
const GlowWrap = ({ color, children }: { color: string; children: React.ReactNode }) => (
  <div
    className="w-full h-full"
    style={{ filter: `drop-shadow(0 0 3px ${color}) drop-shadow(0 0 6px ${color}88)`, color }}
    aria-hidden="true"
  >
    {children}
  </div>
);

const SW = 1.6; // unified stroke weight

/* 1. Meditation — figure in diamond frame with alignment dashes (sapphire) */
function MeditationIcon({ className }: IconProps) {
  return (
    <GlowWrap color="#1E90FF">
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round" className={className}>
        {/* diamond frame */}
        <path d="M32 6 L54 40 L10 40 Z" />
        {/* alignment dashes bottom */}
        <path d="M6 46 H20 M24 46 H40 M44 46 H58" />
        <path d="M14 50 H22 M42 50 H50" />
        {/* small triangle below */}
        <path d="M32 46 L36 54 L28 54 Z" />
        {/* head */}
        <circle cx="32" cy="20" r="3.5" />
        {/* torso */}
        <path d="M27 26 C27 32 27 34 26 38 L38 38 C37 34 37 32 37 26" />
        {/* arms on knees */}
        <path d="M27 30 C24 33 22 36 22 39 M37 30 C40 33 42 36 42 39" />
        {/* crossed legs */}
        <path d="M22 39 C26 40 38 40 42 39" />
      </svg>
    </GlowWrap>
  );
}

/* 2. Breathwork — head profile with internal heart + breath waves (turquoise) */
function BreathworkIcon({ className }: IconProps) {
  return (
    <GlowWrap color="#22D3D3">
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round" className={className}>
        {/* head profile facing right */}
        <path d="M18 12 C8 16 6 32 14 42 C16 46 18 50 18 56" />
        <path d="M14 42 C20 44 30 42 34 36 L38 32 L34 30 L36 27 L34 25 L38 22 C34 18 30 14 26 12 C22 10 20 10 18 12 Z" />
        {/* interior heart */}
        <path d="M18 22 C16 20 13 20 12 22 C10 24 12 28 16 30 C20 28 22 24 20 22 C19 20 19 20 18 22 Z" />
        {/* breath waves */}
        <path d="M44 22 C48 20 50 18 50 14" />
        <path d="M46 28 C50 27 52 25 53 22" />
        <path d="M46 34 C50 34 53 36 54 40" />
      </svg>
    </GlowWrap>
  );
}

/* 3. Vagus Nerve — head silhouette with branching root/tree brain (soft rose pink) */
function VagusIcon({ className }: IconProps) {
  return (
    <GlowWrap color="#FF9EC4">
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round" className={className}>
        {/* head profile facing left */}
        <path d="M42 10 C52 12 56 22 54 34 C53 40 50 44 48 48 L48 56 L26 56 L26 50 C22 48 18 44 16 38 C12 26 18 14 30 10 C34 9 38 9 42 10 Z" />
        {/* lips/chin small notch */}
        <path d="M16 40 L20 42" opacity="0.7" />
        {/* brain outline */}
        <path d="M28 22 C24 22 22 26 24 30 C22 34 26 38 30 36 C32 40 40 40 42 34 C46 34 48 28 44 24 C44 20 38 18 34 20 C32 18 28 18 28 22 Z" />
        {/* branching nerve tree */}
        <path d="M34 34 L34 24" />
        <path d="M34 30 L30 26 M30 26 L27 25 M30 26 L29 22" />
        <path d="M34 30 L38 26 M38 26 L41 24 M38 26 L40 22" />
        <path d="M34 26 L31 22 M34 26 L37 22" />
      </svg>
    </GlowWrap>
  );
}

/* 4. Sound Healing — headphones with lotus (magenta) */
function SoundIcon({ className }: IconProps) {
  return (
    <GlowWrap color="#FF3DCB">
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round" className={className}>
        {/* headphones band */}
        <path d="M14 34 C14 20 26 12 34 14" />
        {/* left cup */}
        <rect x="10" y="34" width="10" height="16" rx="3" />
        {/* right cup */}
        <rect x="30" y="34" width="10" height="16" rx="3" />
        {/* sound waves left */}
        <path d="M22 38 C24 40 24 44 22 46" />
        <path d="M25 36 C28 39 28 45 25 48" />
        {/* sound waves right */}
        <path d="M42 38 C40 40 40 44 42 46" />
        <path d="M45 36 C42 39 42 45 45 48" />
        {/* lotus floating top right */}
        <path d="M50 22 L50 14" />
        <path d="M50 22 C46 20 44 16 46 12 C48 14 50 18 50 22 Z" />
        <path d="M50 22 C54 20 56 16 54 12 C52 14 50 18 50 22 Z" />
        <path d="M50 22 C47 20 45 18 44 16 M50 22 C53 20 55 18 56 16" />
        <path d="M44 22 C46 26 54 26 56 22" />
      </svg>
    </GlowWrap>
  );
}

/* 5. Aura Cleansing — head/shoulders with layered crescent aura halos (violet) */
function AuraIcon({ className }: IconProps) {
  return (
    <GlowWrap color="#B266FF">
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round" className={className}>
        {/* aura halos */}
        <path d="M14 26 C14 14 22 6 32 6 C42 6 50 14 50 26" />
        <path d="M10 28 C10 12 20 2 32 2" opacity="0.85" />
        <path d="M54 28 C54 12 44 2 32 2" opacity="0.85" />
        <path d="M18 22 C20 16 26 12 32 12" opacity="0.75" />
        <path d="M46 22 C44 16 38 12 32 12" opacity="0.75" />
        {/* head */}
        <circle cx="32" cy="30" r="6" />
        {/* shoulders */}
        <path d="M14 58 C14 46 22 40 32 40 C42 40 50 46 50 58" />
        {/* chest lines */}
        <path d="M24 50 L26 58 M32 46 L32 58 M40 50 L38 58" opacity="0.75" />
      </svg>
    </GlowWrap>
  );
}

/* 6. Cord Cutting — open scissors slicing an elongated braided cord (deep red) */
function CordCuttingIcon({ className }: IconProps) {
  return (
    <GlowWrap color="#FF1A1A">
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
        {/* LEFT SIDE: Open Scissor Handles / Finger Loops */}
        <circle cx="12" cy="20" r="5" fill="#1e1b4b" fillOpacity="0.4" />
        <circle cx="12" cy="44" r="5" fill="#1e1b4b" fillOpacity="0.4" />
        
        {/* SCISSOR BLADES: Crossing and pivoting at coordinates (24, 32) */}
        {/* Top Handle moving through the pivot, cutting down toward center-right */}
        <path d="M16 23 L24 32 L36 38" />
        {/* Bottom Handle moving through the pivot, cutting up toward center-right */}
        <path d="M16 41 L24 32 L36 26" />
        
        {/* Blade Back Edges to give the scissor blades realistic visual thickness */}
        <path d="M15 21 L24 32 L36 28" />
        <path d="M15 43 L24 32 L36 36" />
        
        {/* Pivot center screw right where the blades meet */}
        <circle cx="24" cy="32" r="1.5" fill="currentColor" />

        {/* RIGHT SIDE: Elongated Braided Cord with center knot structure being sliced */}
        {/* The active knot sitting right between the open scissor blades */}
        <path d="M34 32 C38 24, 40 40, 44 32" strokeWidth={2.5} />
        <path d="M36 30 C38 28, 42 36, 44 34" strokeWidth={1.5} className="opacity-80" />
        
        {/* Braided segments looping and dynamically extending entirely off to the right side */}
        <path d="M44 32 C48 24, 52 38, 58 28 C60 25, 61 24, 63 26" strokeDasharray="3 1.5" />
        <path d="M44 32 C46 36, 50 26, 54 36 C57 41, 60 38, 63 40" strokeDasharray="3 1.5" />
        
        {/* Small energy release dots around the cut junction */}
        <circle cx="39" cy="23" r="0.8" fill="currentColor" stroke="none" />
        <circle cx="42" cy="41" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    </GlowWrap>
  );
}

/* 7. Movement — fluid intersecting double-loop arrows (emerald) */
function MovementIcon({ className }: IconProps) {
  return (
    <GlowWrap color="#22E27A">
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round" className={className}>
        {/* loop 1: top-left to bottom-right */}
        <path d="M10 10 C30 10 54 34 54 54" />
        {/* loop 2: top-right to bottom-left */}
        <path d="M54 10 C34 10 10 34 10 54" />
        {/* arrow head bottom-right */}
        <path d="M54 54 L54 44 M54 54 L44 54" />
        {/* arrow head bottom-left */}
        <path d="M10 54 L10 44 M10 54 L20 54" />
      </svg>
    </GlowWrap>
  );
}

/* 8. 13 Chakras — meditating figure with vertical column of stacked stars */
function ChakrasIcon({ className }: IconProps) {
  const starColors = [
    "#FFFFFF", // cosmic gateway
    "#FFD500", // universal
    "#DDDDDD", // stellar
    "#FF3DCB", // soul star
    "#AF52DE", // crown (crown chakra above head area)
    "#5856D6", // third eye
    "#007AFF", // throat
    "#34C759", // heart
    "#FFCC00", // solar
    "#FF9500", // sacral
    "#FF3B30", // root
    "#8B4513", // earth star
    "#FFFFFF", // gaia gateway
  ];
  const Star = ({ cx, cy, r, color }: { cx: number; cy: number; r: number; color: string }) => (
    <g style={{ filter: `drop-shadow(0 0 2px ${color})` }}>
      <path
        d={`M${cx} ${cy - r} L${cx + r * 0.3} ${cy - r * 0.3} L${cx + r} ${cy} L${cx + r * 0.3} ${cy + r * 0.3} L${cx} ${cy + r} L${cx - r * 0.3} ${cy + r * 0.3} L${cx - r} ${cy} L${cx - r * 0.3} ${cy - r * 0.3} Z`}
        fill={color}
        stroke={color}
        strokeWidth="0.4"
      />
    </g>
  );
  return (
    <div className="w-full h-full" aria-hidden="true">
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        {/* seated silhouette */}
        <g stroke="#E8E8FF" strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round" fill="none"
           style={{ filter: "drop-shadow(0 0 2px #E8E8FF88)" }}>
          <circle cx="32" cy="26" r="3" />
          <path d="M28 30 C28 34 27 36 27 40 L37 40 C37 36 36 34 36 30" />
          <path d="M27 34 C24 36 22 38 22 42 M37 34 C40 36 42 38 42 42" />
          <path d="M22 42 C26 44 38 44 42 42" />
        </g>
        {/* vertical column of stars — above head */}
        <Star cx={32} cy={4}  r={1.6} color={starColors[0]} />
        <Star cx={32} cy={8}  r={1.6} color={starColors[1]} />
        <Star cx={32} cy={12} r={1.6} color={starColors[2]} />
        <Star cx={32} cy={16} r={1.6} color={starColors[3]} />
        {/* along body */}
        <Star cx={32} cy={22} r={1.4} color={starColors[4]} />
        <Star cx={32} cy={26} r={1.2} color={starColors[5]} />
        <Star cx={32} cy={30} r={1.2} color={starColors[6]} />
        <Star cx={32} cy={34} r={1.2} color={starColors[7]} />
        <Star cx={32} cy={38} r={1.2} color={starColors[8]} />
        <Star cx={32} cy={42} r={1.2} color={starColors[9]} />
        {/* below seat */}
        <Star cx={32} cy={50} r={1.4} color={starColors[10]} />
        <Star cx={32} cy={56} r={1.6} color={starColors[11]} />
        <Star cx={32} cy={60} r={1.6} color={starColors[12]} />
      </svg>
    </div>
  );
}

/* 9. Connect to Healer — three figures holding heart (amber) */
function ConnectHealerIcon({ className }: IconProps) {
  return (
    <GlowWrap color="#FFB347">
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round" className={className}>
        {/* central heart */}
        <path d="M32 14 C28 8 20 10 20 18 C20 26 32 32 32 32 C32 32 44 26 44 18 C44 10 36 8 32 14 Z" />
        {/* left figure */}
        <circle cx="12" cy="34" r="3" />
        <path d="M8 40 C8 46 8 52 10 58 M16 40 C16 46 16 52 14 58" />
        <path d="M12 38 L22 30" />
        {/* right figure */}
        <circle cx="52" cy="34" r="3" />
        <path d="M48 40 C48 46 48 52 50 58 M56 40 C56 46 56 52 54 58" />
        <path d="M52 38 L42 30" />
        {/* center figure */}
        <circle cx="32" cy="38" r="3" />
        <path d="M28 44 C28 50 28 54 30 58 M36 44 C36 50 36 54 34 58" />
        <path d="M32 42 L32 34" />
      </svg>
    </GlowWrap>
  );
}

const sections = [
  { id: "meditation", title: "Meditation", description: "Discover the art of stillness and inner peace through 5 powerful meditation techniques.", Icon: MeditationIcon },
  { id: "breathwork", title: "Breathwork", description: "Master box breathing, 4-7-8, belly breathing, alternate nostril, humming breath, ocean breath, triangle breathing, cooling breath, power breathing, heart coherence, grounding breath.", Icon: BreathworkIcon },
  { id: "vagus-nerve", title: "Vagus Nerve & Nervous System", description: "Learn 5 quick techniques to activate your vagus nerve and calm your body.", Icon: VagusIcon },
  { id: "sound-healing", title: "Sound Healing", description: "All 7 Solfeggio frequencies — which chakra each heals and what it does.", Icon: SoundIcon },
  { id: "aura-cleansing", title: "Aura Cleansing", description: "3 simple techniques anyone can do at home to cleanse and protect your energy.", Icon: AuraIcon },
  { id: "cord-cutting", title: "Cord Cutting & Soul Ties", description: "Identify unhealthy attachments and perform a powerful 5-step cord cutting ritual.", Icon: CordCuttingIcon },
  { id: "movement", title: "Movement as Medicine", description: "11 powerful movement practices that release stuck emotions and restore flow.", Icon: MovementIcon },
  { id: "chakras", title: "The 13 Chakras", description: "Explore all 12 chakras plus Earth Star — from root to divine gateway.", Icon: ChakrasIcon },
  { id: "connect-healer", title: "Connect to a Healer", description: "Book a one-on-one session with a verified spiritual practitioner.", Icon: ConnectHealerIcon },
];

export default function FlowRoom() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 overflow-y-auto p-4 pb-32" style={{ background: "radial-gradient(ellipse at 20% 20%, hsl(210,90%,5%) 0%, hsl(210,80%,12%) 45%, hsl(210,40%,28%) 100%)" }}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2 text-center">Flow</h1>
        <p className="text-muted-foreground text-center mb-6">Body, energy, and movement practices. Learn how to activate, move, and embody your healing through breathwork, meditation, sound, and somatic practices.</p>
      </motion.div>

      <div className="max-w-2xl mx-auto mb-6">
        <LevelPath roomId="flow" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {sections.map((s, i) => {
          const Icon = s.Icon;
          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
            >
              <Card
                className="cursor-pointer hover:border-primary/40 transition-colors bg-card/80 backdrop-blur-sm"
                onClick={() => navigate(`/flow/${s.id}`)}
                role="button"
                tabIndex={0}
                aria-label={`Open ${s.title}`}
                onKeyDown={(e) => e.key === "Enter" && navigate(`/flow/${s.id}`)}
              >
                <CardHeader className="flex flex-row items-start gap-3 p-4">
                  <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center">
                    <Icon className="w-full h-full" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="text-base font-bold">{s.title}</CardTitle>
                    <CardDescription className="text-xs mt-1 leading-relaxed">{s.description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
