import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface GlitterBurstProps {
  trigger: number; // increment to trigger
}

function randomParticles(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 300,
    y: (Math.random() - 0.5) * 300,
    scale: Math.random() * 1.5 + 0.5,
    rotation: Math.random() * 360,
    color: ["#C67A2E", "#FFD700", "#A8D5A2", "#8B5CF6", "#F472B6", "#FCD34D"][Math.floor(Math.random() * 6)],
    delay: Math.random() * 0.3,
  }));
}

export default function GlitterBurst({ trigger }: GlitterBurstProps) {
  const [particles, setParticles] = useState<ReturnType<typeof randomParticles>>([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (trigger > 0) {
      setParticles(randomParticles(30));
      setShow(true);
      const timer = setTimeout(() => setShow(false), 1500);
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
              transition={{ duration: 1.2, delay: p.delay, ease: "easeOut" }}
              className="absolute text-lg"
              style={{ color: p.color }}
            >
              ✨
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
