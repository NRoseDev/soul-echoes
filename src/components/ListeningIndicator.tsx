import { motion } from "framer-motion";
import { Mic } from "lucide-react";

export default function ListeningIndicator({ visible }: { visible: boolean }) {
  if (!visible) return null;

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
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-10 h-10 rounded-full bg-primary/30"
          animate={{ scale: [1, 1.3, 1], opacity: [0.7, 0.2, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        />
        {/* Center mic icon */}
        <div className="relative z-10 w-10 h-10 rounded-full bg-primary flex items-center justify-center">
          <Mic className="h-5 w-5 text-primary-foreground" />
        </div>
      </div>
      <p className="text-sm text-muted-foreground font-body animate-pulse">
        Listening… speak your answer or tap to select
      </p>
    </motion.div>
  );
}
