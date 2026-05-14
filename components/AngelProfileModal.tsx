"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { angelChakraMap } from "@/data/angelChakraMap";
import { chakraColorMap } from "@/data/chakraColorMap";

export default function AngelProfileModal({ angel, onClose }) {
  if (!angel) return null;

  const chakra = Object.entries(angelChakraMap).find(([_, ids]) =>
    ids.includes(angel.id)
  )?.[0];
  
  const glow = chakra ? chakraColorMap[chakra][0] : "#ffffff";

  const playFrequency = (frequencyHz: number) => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = frequencyHz;
      
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3);
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.start();
      oscillator.stop(ctx.currentTime + 3);
    } catch (error) {
      console.error("Audio error:", error);
    }
  };

  const handleChakraNavigation = (chakraName: string) => {
    // Closes the modal popup safely
    if (onClose) onClose();
    
    // Updates the browser URL path to go to the Wisdom page and passes the specific chakra to clear
    window.location.hash = `#/wisdom?chakra=${encodeURIComponent(chakraName.toLowerCase())}`;
    
    // Dispatches a state update event so Lovable's router shifts the view instantly
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-[#0b0b0f] rounded-xl p-6 max-w-md w-full relative shadow-xl overflow-y-auto max-h-[90vh]"
          style={{
            boxShadow: `0 0 40px ${glow}55`,
            border: `1px solid ${glow}55`,
          }}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-full flex justify-center mb-4">
            <Image
              src={angel.image || "/placeholder.svg"}
              alt={angel.name}
              width={420}
              height={420}
              className="rounded-lg"
              style={{ boxShadow: `0 0 25px ${glow}` }}
            />
          </div>

          <h2 className="text-2xl font-bold text-center mb-1" style={{ color: glow }}>
            {angel.name}
          </h2>
          
          {angel.title && (
            <p className="text-gray-400 italic text-center text-sm mb-3">
              "{angel.title}"
            </p>
          )}

          <div className="flex flex-col items-center gap-3 my-4">
            {angel.frequency && (
              <button
                onClick={() => {
                  const hzNumber = parseInt(angel.frequency);
                  if (!isNaN(hzNumber)) playFrequency(hzNumber);
                }}
                className="flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-wider transition active:scale-95 cursor-pointer shadow-md bg-white/5 hover:bg-white/10"
                style={{ borderColor: `${glow}44`, color: glow }}
              >
                <span>🔊 Play Tone</span>
                <span>•</span>
                <span>{angel.frequency}</span>
              </button>
            )}

            {chakra && (
              <button
                onClick={() => handleChakraNavigation(chakra)}
                className="w-full flex flex-col items-center justify-center p-3 rounded-xl border transition active:scale-[0.98] cursor-pointer shadow-md bg-blue-950/20 hover:bg-blue-950/40 group text-center"
                style={{ borderColor: `${glow}33` }}
              >
                <span className="text-xs uppercase font-bold tracking-widest opacity-60 mb-0.5" style={{ color: glow }}>
                  Associated Center
                </span>
                <span className="text-sm font-bold uppercase group-hover:underline flex items-center gap-1.5" style={{ color: glow }}>
                  🔷 {chakra.replace('_', ' ')} CHAKRA
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  Click to visit Wisdom & clear this center ➔
                </span>
              </button>
            )}
          </div>

          <div className="mt-4">
            <h3 className="text-md font-bold mb-1 uppercase tracking-wide" style={{ color: glow }}>
              Healing Gifts
            </h3>
            <ul className="text-gray-300 space-y-1 text-sm">
              {angel.gifts?.map((g) => (
                <li key={g} className="flex items-start gap-1.5">
                  <span style={{ color: glow }}>✦</span>
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4">
            <h3 className="text-md font-bold mb-1 uppercase tracking-wide" style={{ color: glow }}>
              When to Call
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">{angel.description}</p>
          </div>

          {angel.ancestralConnections && (
            <div className="mt-4">
              <h3 className="text-md font-bold mb-1 uppercase tracking-wide" style={{ color: glow }}>
                Ancestral Connections
              </h3>
              <ul className="text-gray-300 space-y-1 text-sm">
                {angel.ancestralConnections.map((conn, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span style={{ color: glow }}>☥</span>
                    <span>{conn}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {angel.spiritualTools && (
            <div className="mt-4">
              <h3 className="text-md font-bold mb-1 uppercase tracking-wide" style={{ color: glow }}>
                Spiritual Tools
              </h3>
              <ul className="text-gray-300 space-y-1 text-sm">
                {angel.spiritualTools.crystal && (
                  <li className="flex items-start gap-1.5">
                    <span style={{ color: glow }}>✦</span>
                    <span><span className="font-semibold text-gray-400">Crystal:</span> {angel.spiritualTools.crystal}</span>
                  </li>
                )}
                {angel.spiritualTools.association && (
                  <li className="flex items-start gap-1.5">
                    <span style={{ color: glow }}>✶</span>
                    <span><span className="font-semibold text-gray-400">Association:</span> {angel.spiritualTools.association}</span>
                  </li>
                )}
                {angel.spiritualTools.halo && (
                  <li className="flex items-start gap-1.5">
                    <span style={{ color: glow }}>◎</span>
                    <span><span className="font-semibold text-gray-400">Halo:</span> {angel.spiritualTools.halo}</span>
                  </li>
                )}
              </ul>
            </div>
          )}

          <button
            onClick={onClose}
            className="mt-6 w-full py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-medium transition"
          >
            Close Portal
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
