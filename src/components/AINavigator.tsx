import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

import mainIcon from "@/assets/icons/Icon-AI navigator.png";
import aslIcon from "@/assets/icons/Icon-ASL.png";
import voiceIcon from "@/assets/icons/Icon-voice.png";
import sosIcon from "@/assets/icons/Icon-sos.png";
import prayerIcon from "@/assets/icons/Icon-prayer.png";
import portalIcon from "@/assets/icons/Icon-portal.png";

type SubButton = {
  id: string;
  label: string;
  icon: string;
  onClick: () => void;
};

export default function AINavigator() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const go = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  const subButtons: SubButton[] = [
    { id: "asl", label: "ASL", icon: aslIcon, onClick: () => go("/asl-images") },
    { id: "voice", label: "Voice Settings", icon: voiceIcon, onClick: () => go("/voice-settings") },
    {
      id: "sos",
      label: "SOS Angels",
      icon: sosIcon,
      onClick: () => {
        setOpen(false);
        window.dispatchEvent(new CustomEvent("soul-echoes-open-sos"));
      },
    },
    { id: "prayer", label: "Intercessor / Prayer", icon: prayerIcon, onClick: () => go("/community") },
    { id: "portal", label: "Healer Portal", icon: portalIcon, onClick: () => go("/shop") },
  ];

  // arrange the 5 sub-buttons in a quarter-circle arc to the upper-left of the main button
  const count = subButtons.length;
  const radius = 96;
  const startAngle = 180; // points left
  const endAngle = 270;   // points up
  const positions = subButtons.map((_, i) => {
    const t = count === 1 ? 0.5 : i / (count - 1);
    const angle = (startAngle + (endAngle - startAngle) * t) * (Math.PI / 180);
    return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
  });

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        <AnimatePresence>
          {open &&
            subButtons.map((btn, i) => (
              <motion.button
                key={btn.id}
                type="button"
                onClick={btn.onClick}
                aria-label={btn.label}
                title={btn.label}
                initial={{ opacity: 0, x: 0, y: 0, scale: 0.4 }}
                animate={{ opacity: 1, x: positions[i].x, y: positions[i].y, scale: 1 }}
                exit={{ opacity: 0, x: 0, y: 0, scale: 0.4 }}
                transition={{ duration: 0.25, delay: i * 0.04 }}
                className="absolute bottom-2 right-2 h-12 w-12 rounded-full bg-background/80 backdrop-blur-md border border-white/20 shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
              >
                <img src={btn.icon} alt={btn.label} className="h-9 w-9 object-contain" />
              </motion.button>
            ))}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label="AI Navigator"
          aria-expanded={open}
          whileTap={{ scale: 0.92 }}
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="relative h-16 w-16 rounded-full bg-background/70 backdrop-blur-md border border-white/20 shadow-xl flex items-center justify-center"
        >
          <img src={mainIcon} alt="AI Navigator" className="h-12 w-12 object-contain" />
        </motion.button>
      </div>
    </div>
  );
}
