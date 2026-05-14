"use client";

import { useEffect, useState } from "react";

export default function WisdomDetail() {
  const [activeChakra, setActiveChakra] = useState<string | null>(null);

  useEffect(() => {
    // Reads the URL to see if an angel button passed a specific chakra name
    const handleUrlCheck = () => {
      const currentUrl = window.location.hash;
      if (currentUrl.includes("?chakra=")) {
        const extractedName = currentUrl.split("?chakra=")[1];
        setActiveChakra(decodeURIComponent(extractedName));
      }
    };

    handleUrlCheck();
    window.addEventListener("hashchange", handleUrlCheck);
    return () => window.removeEventListener("hashchange", handleUrlCheck);
  }, []);

  const handleToolsNavigation = () => {
    // Navigates the user smoothly into the Spiritual Tools view
    window.location.hash = `#/tools?source=wisdom&chakra=${encodeURIComponent(activeChakra || "all")}`;
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  };

  return (
    <div className="p-6 bg-[#0b0b0f] text-white min-h-screen max-w-2xl mx-auto rounded-xl border border-teal-900/30">
      {activeChakra ? (
        <div>
          <h2 className="text-3xl font-bold uppercase tracking-wider text-teal-400 mb-2">
            🔷 {activeChakra} Chakra Alignment
          </h2>
          <p className="text-gray-400 italic text-sm mb-6">
            Welcome from the Angelic Portal. Let's look closely at your energy signature here.
          </p>
          
          <div className="space-y-4 bg-teal-950/20 p-5 rounded-xl border border-teal-500/20">
            <h3 className="text-lg font-bold text-teal-300">Understanding this Center</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              When this chakra is congested, communication stalls, blockages form in your story, and alignment feels distant. Reviewing this center helps release stored historical dynamics.
            </p>
          </div>

          <div className="mt-8 p-4 rounded-xl border border-blue-500/20 bg-blue-950/10 text-center">
            <p className="text-sm text-gray-300 mb-3">
              Ready to gather the physical elements and crystals your ancestors used to balance this center?
            </p>
            <button
              onClick={handleToolsNavigation}
              className="px-6 py-2.5 rounded-full bg-teal-500 hover:bg-teal-400 text-black text-sm font-bold transition active:scale-95 cursor-pointer shadow-md"
            >
              Go to Spiritual Tools Room ➔
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400 text-sm">Select a chakra center to begin your diagnostic review flow.</p>
        </div>
      )}
    </div>
  );
}
