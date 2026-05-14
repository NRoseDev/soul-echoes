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
          className="bg-[#0b0b0f] rounded-xl p-6 max-w-md w-full relative shadow-xl"
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
              src={angel.image}
              alt={angel.name}
              width={420}
              height={420}
              className="rounded-lg"
              style={{ boxShadow: `0 0 25px ${glow}` }}
            />
          </div>

          <h2 className="text-2xl font-bold text-center mb-2" style={{ color: glow }}>
            {angel.name}
          </h2>

          {angel.frequency && (
            <div className="mt-2 flex flex-col items-center">
              <button
                onClick={() => {
                  const hzNumber = parseInt(angel.frequency);
                  if (!isNaN(hzNumber)) playFrequency(hzNumber);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition active:scale-95 cursor-pointer shadow-md bg-white/5 hover:bg-white/10"
                style={{ borderColor: `${glow}44`, color: glow }}
              >
                <span>🔊</span>
                <span>Play {angel.frequency}</span>
              </button>
            </div>
          )}

          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-1" style={{ color: glow }}>
              Gifts
            </h3>
            <ul className="text-gray-300 space-y-1">
              {angel.gifts?.map((g) => (
                <li key={g}>• {g}</li>
              ))}
            </ul>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-1" style={{ color: glow }}>
              When to Call
            </h3>
            <p className="text-gray-300">{angel.description}</p>
          </div>

          {angel.ancestralConnections && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-1" style={{ color: glow }}>
                Ancestral Connections
              </h3>
              <ul className="text-gray-300 space-y-1">
                {angel.ancestralConnections.map((conn, idx) => (
                  <li key={idx}>☥ {conn}</li>
                ))}
              </ul>
            </div>
          )}

          {angel.spiritualTools && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-1" style={{ color: glow }}>
                Spiritual Tools
              </h3>
              <ul className="text-gray-300 space-y-1">
                {angel.spiritualTools.crystal && (
                  <li>✦ <span className="font-semibold">Crystal:</span> {angel.spiritualTools.crystal}</li>
                )}
                {angel.spiritualTools.association && (
                  <li>✶ <span className="font-semibold">Association:</span> {angel.spiritualTools.association}</li>
                )}
                {angel.spiritualTools.halo && (
                  <li>◎ <span className="font-semibold">Halo:</span> {angel.spiritualTools.halo}</li>
                )}
              </ul>
            </div>
          )}

          <button
            onClick={onClose}
            className="mt-6 w-full py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
          >
            Close
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
