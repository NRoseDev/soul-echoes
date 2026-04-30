"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { angels } from "@/data/angels";
import { angelChakraMap } from "@/data/angelChakraMap";
import { chakraColorMap } from "@/data/chakraColorMap";

export default function AngelProfileModal({ angelId, onClose }) {
  if (!angelId) return null;

  const angel = angels.find((a) => a.id === angelId);
  if (!angel) return null;

  const chakra = Object.entries(angelChakraMap).find(([_, ids]) =>
    ids.includes(angel.id)
  )?.[0];

  const glow = chakra ? chakraColorMap[chakra][0] : "#ffffff";

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
              src="/images/angels/default.jpg"
              alt={angel.name}
              width={420}
              height={420}
              className="rounded-lg"
              style={{ boxShadow: `0 0 25px ${glow}` }}
            />
          </div>

          <h2
            className="text-2xl font-bold text-center mb-2"
            style={{ color: glow }}
          >
            {angel.name}
          </h2>

          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-1" style={{ color: glow }}>
              Gifts
            </h3>
            <ul className="text-gray-300 space-y-1">
              {angel.gifts.map((g) => (
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
