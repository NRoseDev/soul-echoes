"use client";

import { useEffect, useState } from "react";

export default function SpiritualToolsRoom() {
  const [activeChakra, setActiveChakra] = useState<string | null>(null);

  useEffect(() => {
    const handleUrlCheck = () => {
      const currentUrl = window.location.hash;
      if (currentUrl.includes("?source=wisdom")) {
        const params = new URLSearchParams(currentUrl.split("?")[1]);
        const chakraParam = params.get("chakra");
        if (chakraParam && chakraParam !== "all") {
          setActiveChakra(chakraParam);
        }
      }
    };

    handleUrlCheck();
    window.addEventListener("hashchange", handleUrlCheck);
    return () => window.removeEventListener("hashchange", handleUrlCheck);
  }, []);

  const handleAngelsNavigation = () => {
    // Closes the loop and routes the user directly back to the main Angels Portal page
    window.location.hash = `#/angels`;
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  };

  return (
    <div className="p-6 bg-[#0b0b0f] text-white min-h-screen max-w-2xl mx-auto rounded-xl border border-purple-900/30">
      <h2 className="text-3xl font-bold uppercase tracking-wider text-purple-400 mb-2">
        🛠️ Spiritual Tools Chamber
      </h2>
      <p className="text-gray-400 italic text-sm mb-6">
        Equipping your practice with material and energetic support structures.
      </p>

      {activeChakra && (
        <div className="mb-6 p-4 rounded-xl bg-purple-950/20 border border-purple-500/20">
          <p className="text-sm font-semibold text-purple-300 uppercase tracking-wider mb-1">
            Active Focus: {activeChakra} Alignment
          </p>
          <p className="text-xs text-gray-400 leading-relaxed">
            Utilize your customized lineage crystal, alignment grids, and calibrated audio tones to anchor the insights gained from the Wisdom room.
          </p>
        </div>
      )}

      <div className="space-y-4 text-sm text-gray-300">
        <p>• <span className="font-semibold text-purple-400">Lineage Crystals:</span> Program your Clear Quartz or specific profile stones.</p>
        <p>• <span className="font-semibold text-purple-400">Integration Meditations:</span> Focus your intention on shifting geometric DNA layers.</p>
      </div>

      <div className="mt-10 p-5 rounded-xl border border-teal-500/20 bg-teal-950/10 text-center">
        <p className="text-sm text-gray-300 mb-3">
          Ready to re-enter the presence of the guardians and integrate this work into your journey?
        </p>
        <button
          onClick={handleAngelsNavigation}
          className="px-6 py-2.5 rounded-full bg-purple-500 hover:bg-purple-400 text-white text-sm font-bold transition active:scale-95 cursor-pointer shadow-md"
        >
          Return to Angels Portal Room ➔
        </button>
      </div>
    </div>
  );
}
