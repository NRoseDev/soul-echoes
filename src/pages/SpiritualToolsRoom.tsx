"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SpiritualToolsRoom() {
  const navigate = useNavigate();
  const [activeChakra, setActiveChakra] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const chakraParam = params.get("chakra");
      if (chakraParam && chakraParam !== "all") {
        setActiveChakra(chakraParam);
      }
    }
  }, []);

  const handleAngelsNavigation = () => {
    navigate("/angels");
  };

  return (
    <div className="p-6 bg-[#0b0b0f] text-white min-h-screen w-full rounded-xl border border-purple-900/20">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-extrabold uppercase tracking-wider text-purple-400 mb-2 flex items-center gap-2">
          🛠️ SPIRITUAL TOOLS CHAMBER
        </h2>
        <p className="text-gray-400 italic text-sm mb-6">
          Equipping your practice with material and energetic support structures.
        </p>

        {activeChakra && (
          <div className="mb-6 p-4 rounded-xl bg-purple-950/30 border border-purple-500/30">
            <p className="text-xs uppercase font-bold tracking-widest text-purple-300 mb-1">
              Active Focus Center
            </p>
            <p className="text-sm font-bold text-white uppercase">
              🔷 {activeChakra.replace('_', ' ')} Alignment Activated
            </p>
            <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
              Utilize your customized lineage crystal, alignment grids, and calibrated audio tones to anchor the insights gained from the Wisdom room.
            </p>
          </div>
        )}

        <div className="space-y-4 bg-purple-950/10 p-6 rounded-xl border border-purple-900/30 mb-8">
          <div className="flex items-start gap-3">
            <span className="text-purple-400 font-bold text-lg">•</span>
            <div>
              <h4 className="font-bold text-purple-300 text-sm uppercase tracking-wide">Lineage Crystals</h4>
              <p className="text-gray-300 text-sm mt-0.5">Program your Clear Quartz or specific profile stones to match your active focus center.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <span className="text-purple-400 font-bold text-lg">•</span>
            <div>
              <h4 className="font-bold text-purple-300 text-sm uppercase tracking-wide">Integration Meditations</h4>
              <p className="text-gray-300 text-sm mt-0.5">Focus your intention on shifting geometric DNA layers through purposeful application.</p>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-purple-500/20 bg-purple-950/20 text-center shadow-lg">
          <p className="text-sm text-gray-300 mb-4 font-medium">
            Ready to re-enter the presence of the guardians and integrate this work into your journey?
          </p>
          <button
            onClick={handleAngelsNavigation}
            className="px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 cursor-pointer shadow-md inline-flex items-center gap-2"
          >
            <span>Return to Angels Portal Room</span>
            <span>➔</span>
          </button>
        </div>
      </div>
    </div>
  );
}
