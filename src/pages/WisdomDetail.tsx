"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function WisdomDetail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeChakra, setActiveChakra] = useState<string | null>(null);

  useEffect(() => {
    // Correctly reads the real application URL parameters passed from your Angel components
    const chakraParam = searchParams.get("chakra");
    if (chakraParam) {
      setActiveChakra(chakraParam);
    }
  }, [searchParams]);

  const handleToolsNavigation = () => {
    // Cleanly routes into the correct fullscreen Spiritual Tools view with parameters intact
    navigate(`/spiritual-tools?source=wisdom&chakra=${encodeURIComponent(activeChakra || "all")}`);
  };

  return (
    <div className="p-6 bg-[#0b0b0f] text-white min-h-screen max-w-4xl mx-auto rounded-xl border border-teal-900/20 shadow-2xl pb-24">
      {activeChakra ? (
        <div className="space-y-6 animate-fade-in">
          {/* Title Header */}
          <div className="border-b border-teal-900/30 pb-4">
            <h2 className="text-3xl font-extrabold uppercase tracking-wider text-teal-400 flex items-center gap-2">
              🔷 {activeChakra.replace('_', ' ')} Chakra Alignment
            </h2>
            <p className="text-gray-400 italic text-sm mt-1">
              Welcome from the Angelic Portal. Let's look closely at your energy signature here.
            </p>
          </div>
          
          {/* Main Visual Content Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4 bg-teal-950/10 p-6 rounded-xl border border-teal-500/20 shadow-md">
              <h3 className="text-lg font-bold text-teal-300 uppercase tracking-wide">Understanding this Center</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                When this chakra is congested, communication stalls, blockages form in your story, and alignment feels distant. Reviewing this center helps release stored historical dynamics and clean inherited bloodline imprints.
              </p>
            </div>

            <div className="space-y-4 bg-teal-950/10 p-6 rounded-xl border border-teal-500/20 shadow-md flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-teal-300 uppercase tracking-wide">Lineage Blueprint</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Your ancestors utilized specific harmonic keynotes, minerals, and organic compounds to stabilize this specific frequency center within the human field.
                </p>
              </div>
            </div>
          </div>

          {/* Action Route Button Container */}
          <div className="mt-8 p-6 rounded-xl border border-blue-500/20 bg-blue-950/20 text-center shadow-lg max-w-xl mx-auto">
            <p className="text-sm text-gray-200 mb-4 font-medium">
              Ready to gather the physical elements and crystals your ancestors used to balance this center?
            </p>
            <button
              onClick={handleToolsNavigation}
              className="px-6 py-3 rounded-full bg-teal-500 hover:bg-teal-400 text-black text-sm font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 cursor-pointer shadow-md inline-flex items-center gap-2"
            >
              <span>Go to Spiritual Tools Room</span>
              <span>➔</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-24 border border-dashed border-teal-900/30 rounded-xl bg-teal-950/5">
          <span className="text-4xl">👁️</span>
          <p className="text-gray-400 text-sm mt-3 max-w-xs mx-auto leading-relaxed">
            Select a chakra center from your Angel Profile view to begin your dynamic review flow sequence.
          </p>
        </div>
      )}
    </div>
  );
}
