import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface GlitterBurstProps {
  trigger: number; // increment to trigger
  unicorn?: boolean; // rainbow unicorn mode
}

const STANDARD_COLORS = ["#C67A2E", "#FFD700", "#A8D5A2", "#8B5CF6", "#F472B6", "#FCD34D"];
const UNICORN_COLORS  = ["#f472b6", "#c084fc", "#818cf8", "#34d399", "#fbbf24", "#60a5fa", "#f87171", "#a78bfa", "#4ade80", "#fb923c"];
const UNICORN_EMOJIS  = ["🦄", "✨", "🌈", "💜", "🌟", "💫", "🦋", "🌸"];

function randomParticles(count: number, unicorn: boolean) {
  const colors = unicorn ? UNICORN_COLORS : STANDARD_COLORS;
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * (unicorn ? 500 : 300),
    y: (Math.random() - 0.5) * (unicorn ? 500 : 300),
    scale: Math.random() * (unicorn ? 2.5 : 1.5) + 0.5,
    rotation: Math.random() * 360,
    color: colors[Math.floor(Math.random() * colors.length)],
    delay: Math.random() * (unicorn ? 0.5 : 0.3),
    emoji: unicorn ? UNICORN_EMOJIS[Math.floor(Math.random() * UNICORN_EMOJIS.length)] : "✨",
  }));
}

export default function GlitterBurst({ trigger, unicorn = false }: GlitterBurstProps) {
  const [particles, setParticles] = useState<ReturnType<typeof randomParticles>>([]);
  const [show, setShow] = useState(false);
  const [isUnicorn, setIsUnicorn] = useState(false);

  useEffect(() => {
    if (trigger > 0) {
      setIsUnicorn(unicorn);
      setParticles(randomParticles(unicorn ? 60 : 30, unicorn));
      setShow(true);
      const timer = setTimeout(() => setShow(false), unicorn ? 2500 : 1500);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] pointer-events-none flex items-center justify-center"
        >
          {isUnicorn && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0] }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute text-8xl"
            >
              🦄
            </motion.div>
          )}
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
              animate={{
                x: p.x,
                y: p.y,
                scale: p.scale,
                opacity: 0,
                rotate: p.rotation,
              }}
              transition={{ duration: isUnicorn ? 2 : 1.2, delay: p.delay, ease: "easeOut" }}
              className="absolute"
              style={{ color: p.color, fontSize: isUnicorn ? "1.5rem" : "1.125rem" }}
            >
              {p.emoji}
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
