import { motion } from "framer-motion";
import { Mic } from "lucide-react";

export default function ListeningIndicator({ visible, level = 0 }: { visible: boolean; level?: number }) {
  if (!visible) return null;

  const glowScale = 1 + Math.min(0.6, level * 1.2);
  const glowOpacity = 0.35 + Math.min(0.5, level * 1.2);
  const iconBrightness = 0.6 + Math.min(0.4, level);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="flex flex-col items-center gap-2 py-3"
    >
      <div className="relative flex items-center justify-center">
        {/* Pulsing rings */}
        <motion.div
          className="absolute w-14 h-14 rounded-full bg-primary/20"
          animate={{ scale: glowScale, opacity: glowOpacity }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        />
        <motion.div
          className="absolute w-10 h-10 rounded-full bg-primary/30"
          animate={{ scale: glowScale * 0.9, opacity: glowOpacity * 0.9 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        />
        {/* Center mic icon */}
        <div className="relative z-10 w-10 h-10 rounded-full bg-primary flex items-center justify-center"
          style={{ filter: `brightness(${iconBrightness})` }}>
          <Mic className="h-5 w-5 text-primary-foreground" />
        </div>
      </div>
      <p className="text-sm text-muted-foreground font-body animate-pulse">
        Listening… speak your answer or tap to select
      </p>
    </motion.div>
  );
}
