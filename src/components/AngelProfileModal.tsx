import { motion } from "framer-motion";
import { X } from "lucide-react";
import AngelSvg from "@/components/AngelSvg";
import type { ArchangelProfile } from "@/data/angelData";

interface Props {
  angel: ArchangelProfile;
  onClose: () => void;
}

export default function AngelProfileModal({ angel, onClose }: Props) {
  const p = angel.palette;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col overflow-y-auto"
      style={{ background: "rgba(0,0,0,0.96)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        aria-label="Close angel profile"
      >
        <X className="h-5 w-5" />
      </button>

      <motion.div
        className="flex flex-col items-center px-5 pb-16 pt-6"
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.35 }}
      >
        {/* Angel illustration */}
        <div className="w-full max-w-xs">
          <AngelSvg palette={p} />
        </div>

        {/* Name */}
        <h1
          className="font-display text-3xl font-bold mt-3 tracking-widest"
          style={{ color: p.nameColor }}
        >
          {angel.name}
        </h1>
        <p className="text-sm italic mt-1 text-white/55">"{angel.meaning}"</p>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          <span
            className="px-3 py-1 rounded-full text-xs font-semibold border"
            style={{ borderColor: p.accentMid + "88", color: p.accentMid }}
          >
            {angel.energyColor}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold border border-white/20 text-white/60">
            {angel.frequency}
          </span>
        </div>

        <div className="w-full max-w-sm mt-2 border-t border-white/10 pt-5 space-y-5">
          {/* Healing Gifts */}
          <div className="space-y-2">
            <h2
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: p.subtitleColor }}
            >
              Healing Gifts
            </h2>
            <ul className="space-y-2">
              {angel.healingGifts.map((gift, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-white/75 leading-snug">
                  <span className="mt-0.5 shrink-0" style={{ color: p.accentMid }}>✦</span>
                  {gift}
                </li>
              ))}
            </ul>
          </div>

          {/* When to Call */}
          <div className="space-y-2">
            <h2
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: p.subtitleColor }}
            >
              When to Call
            </h2>
            <ul className="space-y-2">
              {angel.whenToCall.map((when, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-white/75 leading-snug">
                  <span className="mt-0.5 shrink-0">🪽</span>
                  {when}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
