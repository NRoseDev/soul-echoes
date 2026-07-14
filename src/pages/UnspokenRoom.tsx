import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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

const SW = 1.6;

/* 1. Healing Conversations — two facing profiles with speech bubble (teal) */
function HealingConvoIcon({ className }: IconProps) {
  return (
    <GlowWrap color="#14B8A6">
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round" className={className}>
        {/* left profile facing right */}
        <path d="M20 54 C20 42 14 38 14 30 C14 22 20 16 26 18 L28 22 L26 24 L28 26 L26 30 L28 32 C28 34 26 36 24 36" />
        {/* right profile facing left */}
        <path d="M44 54 C44 42 50 38 50 30 C50 22 44 16 38 18 L36 22 L38 24 L36 26 L38 30 L36 32 C36 34 38 36 40 36" />
        {/* speech bubble above */}
        <path d="M22 6 H42 A3 3 0 0 1 45 9 V15 A3 3 0 0 1 42 18 H36 L32 22 L32 18 H22 A3 3 0 0 1 19 15 V9 A3 3 0 0 1 22 6 Z" />
        <path d="M24 10 H36 M24 13 H40" />
        {/* speech waves between mouths */}
        <path d="M28 40 C30 41 30 43 28 44 M30 38 C33 40 33 44 30 46" />
      </svg>
    </GlowWrap>
  );
}

/* 2. Throat Chakra — head/chest with spiked star at throat + arrows (cyan) */
function ThroatIcon({ className }: IconProps) {
  return (
    <GlowWrap color="#38BDF8">
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round" className={className}>
        {/* head */}
        <path d="M22 20 C22 12 28 8 32 8 C36 8 42 12 42 20 C42 26 38 30 32 30 C26 30 22 26 22 20 Z" />
        {/* neck */}
        <path d="M28 30 L28 36 M36 30 L36 36" />
        {/* shoulders/chest */}
        <path d="M28 36 C20 38 12 42 10 54 M36 36 C44 38 52 42 54 54" />
        {/* spiked star at throat */}
        <path d="M32 38 L34 40 L37 39 L36 42 L38 44 L35 45 L34 48 L32 46 L30 48 L29 45 L26 44 L28 42 L27 39 L30 40 Z" />
        {/* arrows pointing up to star */}
        <path d="M22 54 L28 44 M28 44 L26 44 M28 44 L28 46" />
        <path d="M42 54 L36 44 M36 44 L38 44 M36 44 L36 46" />
      </svg>
    </GlowWrap>
  );
}

/* 3. Speak Your Truth — speech bubble with two overlapping hearts (rose) */
function SpeakTruthIcon({ className }: IconProps) {
  return (
    <GlowWrap color="#FB7185">
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round" className={className}>
        {/* speech bubble */}
        <path d="M12 12 H52 A4 4 0 0 1 56 16 V44 A4 4 0 0 1 52 48 H24 L10 56 L14 48 A4 4 0 0 1 10 44 V16 A4 4 0 0 1 12 12 Z M14 12 Z" />
        {/* larger heart */}
        <path d="M26 22 C22 18 16 20 16 26 C16 32 26 40 28 40 C30 40 40 32 40 26 C40 20 34 18 30 22 C29 23 28 24 28 24 C28 24 27 23 26 22 Z" />
        {/* smaller overlapping heart */}
        <path d="M38 28 C36 26 32 27 32 31 C32 35 40 42 42 42 C44 42 52 35 52 31 C52 27 48 26 46 28 C45 29 42 29 42 29 C42 29 39 29 38 28 Z" />
      </svg>
    </GlowWrap>
  );
}

/* 4. ASL Dictionary — two interacting hands in bigger hand silhouette (deep blue) */
function ASLIcon({ className }: IconProps) {
  return (
    <GlowWrap color="#3B82F6">
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round" className={className}>
        {/* large background hand silhouette */}
        <path d="M8 34 C8 22 14 10 22 10 C24 10 26 12 26 16 L26 26 C28 24 32 24 34 26 C38 24 44 26 46 30 C50 30 56 34 56 40 C56 48 50 56 40 56 L24 56 C14 56 8 46 8 34 Z" opacity="0.6" />
        {/* left inner hand pointing right */}
        <path d="M18 40 C18 34 20 30 24 30 L28 30 L28 34 L32 34 L28 38 L32 40 L28 42 L28 46 L24 46 C20 46 18 44 18 40 Z" />
        {/* right inner hand pointing left */}
        <path d="M46 32 C46 28 44 26 40 26 L36 26 L36 30 L32 30 L36 34 L32 36 L36 38 L36 42 L40 42 C44 42 46 40 46 36 Z" />
      </svg>
    </GlowWrap>
  );
}

/* 5. Visual Communication Board — eye with speech bubble above iris (silver/white) */
function VisualBoardIcon({ className }: IconProps) {
  return (
    <GlowWrap color="#E5E7EB">
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round" className={className}>
        {/* eye */}
        <path d="M6 42 C14 32 24 28 32 28 C40 28 50 32 58 42 C50 52 40 56 32 56 C24 56 14 52 6 42 Z" />
        {/* iris */}
        <circle cx="32" cy="42" r="7" />
        <circle cx="32" cy="42" r="2.5" fill="currentColor" />
        {/* speech bubble above iris */}
        <path d="M22 8 H42 A3 3 0 0 1 45 11 V18 A3 3 0 0 1 42 21 H36 L32 26 L28 21 H22 A3 3 0 0 1 19 18 V11 A3 3 0 0 1 22 8 Z" />
        {/* minus sign inside bubble */}
        <path d="M28 14 H36" />
      </svg>
    </GlowWrap>
  );
}

/* 6. Speech Tools — speech bubble with crossed hammer + wrench (amber) */
function SpeechToolsIcon({ className }: IconProps) {
  return (
    <GlowWrap color="#F59E0B">
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round" className={className}>
        {/* speech bubble */}
        <path d="M10 10 H54 A4 4 0 0 1 58 14 V42 A4 4 0 0 1 54 46 H26 L14 56 L18 46 H10 A4 4 0 0 1 6 42 V14 A4 4 0 0 1 10 10 Z" />
        {/* hammer: handle diagonal + head */}
        <path d="M18 40 L38 20" />
        <path d="M34 14 L44 24 L40 28 L30 18 Z" />
        {/* wrench: handle diagonal opposite + open jaws */}
        <path d="M46 40 L28 22" />
        <path d="M24 18 A5 5 0 1 0 20 22 L26 28 L28 26 L22 20 Z" />
      </svg>
    </GlowWrap>
  );
}

/* 7. Intercessor Connection — praying hands in orbit ring w/ north star (emerald) */
function IntercessorIcon({ className }: IconProps) {
  return (
    <GlowWrap color="#10B981">
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round" className={className}>
        {/* crescent orbit ring */}
        <path d="M10 40 C10 22 22 10 40 10" />
        <path d="M10 40 C22 46 42 46 54 40" />
        {/* 4-point north star top right */}
        <path d="M48 8 L50 14 L56 16 L50 18 L48 24 L46 18 L40 16 L46 14 Z" />
        {/* praying hands */}
        <path d="M28 48 C28 40 30 32 32 26 L32 46 L28 48 Z" />
        <path d="M36 48 C36 40 34 32 32 26 L32 46 L36 48 Z" />
        {/* wrists */}
        <path d="M26 48 L30 52 L34 52 L38 48" />
      </svg>
    </GlowWrap>
  );
}

/* 8. Connect to Healer — three figures lifting central heart (amber) */
function ConnectHealerIcon({ className }: IconProps) {
  return (
    <GlowWrap color="#FBBF24">
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round" className={className}>
        {/* large central heart */}
        <path d="M32 14 C28 8 20 10 20 18 C20 26 32 34 32 34 C32 34 44 26 44 18 C44 10 36 8 32 14 Z" />
        {/* left figure */}
        <circle cx="12" cy="38" r="3" />
        <path d="M12 41 L12 58 M12 46 L22 30" />
        {/* center figure */}
        <circle cx="32" cy="42" r="3" />
        <path d="M32 45 L32 58 M28 50 L28 34 M36 50 L36 34" />
        {/* right figure */}
        <circle cx="52" cy="38" r="3" />
        <path d="M52 41 L52 58 M52 46 L42 30" />
      </svg>
    </GlowWrap>
  );
}

const sections = [
  { id: "healing-conversations", title: "Healing Conversations", description: "33 relationship cards to have a compassionate healing conversation with anyone living or passed.", Icon: HealingConvoIcon },
  { id: "throat-clearing", title: "Throat Chakra Clearing", description: "Vocal toning, truth speaking prompts, and guided exercises to open your voice.", Icon: ThroatIcon },
  { id: "speak-your-truth", title: "Speak Your Truth", description: "Free expression space using any communication method you choose.", Icon: SpeakTruthIcon },
  { id: "asl-dictionary", title: "ASL Dictionary", description: "111 signs for emotions, daily needs, healing terms, and therapy vocabulary with images.", Icon: ASLIcon },
  { id: "visual-board", title: "Visual Communication Board", description: "A picture-based tool designed for nonverbal users and everyone who communicates without words.", Icon: VisualBoardIcon },
  { id: "speech-tools", title: "Speech Tools", description: "Speech to text and text to speech tools for easier expression and listening.", Icon: SpeechToolsIcon },
  { id: "intercessor-connection", title: "Intercessor Connection", description: "Reach out to a prayer warrior when emotions surface and you need spiritual care.", Icon: IntercessorIcon },
  { id: "connect-healer", title: "Connect to a Healer", description: "Access deeper support for healing, trauma processing, and energy work.", Icon: ConnectHealerIcon },
];

export default function UnspokenRoom() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 overflow-y-auto p-4 pb-32" style={{ background: "radial-gradient(ellipse at 20% 20%, hsl(140,90%,4%) 0%, hsl(140,70%,10%) 45%, hsl(140,40%,22%) 100%)" }}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2 text-center">Unspoken Chamber</h1>
        <p className="text-muted-foreground text-center mb-6">A safe, accessible place for expression beyond words. Use voice, sign, images, or quiet presence.</p>
      </motion.div>

      <div className="max-w-6xl mx-auto mb-6">
        <LevelPath roomId="unspoken" />
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((section, index) => {
          const Icon = section.Icon;
          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
            >
              <Card
                className="cursor-pointer hover:border-primary/40 transition-colors bg-card/80 backdrop-blur-sm"
                onClick={() => navigate(`/unspoken/${section.id}`)}
                role="button"
                tabIndex={0}
                aria-label={`Open ${section.title}`}
                onKeyDown={(e) => e.key === "Enter" && navigate(`/unspoken/${section.id}`)}
              >
                <CardHeader className="flex flex-row items-start gap-3 p-4">
                  <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center">
                    <Icon className="w-full h-full" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="text-base font-bold">{section.title}</CardTitle>
                    <CardDescription className="text-xs mt-1 leading-relaxed">{section.description}</CardDescription>
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
