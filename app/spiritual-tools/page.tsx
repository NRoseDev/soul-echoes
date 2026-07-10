"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function SpiritualToolsPage() {
  const searchParams = useSearchParams();
  
  // Safely retains any active chakra variables passed down from the Wisdom screens
  const currentChakra = searchParams.get("chakra");
  const currentSource = searchParams.get("source");
  
  // Build the parameter string dynamically to maintain the connection loop
  const queryString = currentChakra 
    ? `?chakra=${encodeURIComponent(currentChakra)}${currentSource ? `&source=${encodeURIComponent(currentSource)}` : ""}`
    : "";

  const tools = [
    {
      id: "angels",
      title: "Angels & Archangels",
      description: "Meet the 11 archangels and guardian angels — their gifts, when to call them, and prayers to invoke each one.",
      icon: "🪽"
    },
    {
      id: "lightworker-persecution",
      title: "Lightworker Persecution Clearing",
      description: "Healing from spiritual targeting, rejection, and breaking ancient persecution wounds that block visibility and abundance.",
      icon: "✨"
    },
    {
      id: "bloodline-healing",
      title: "Bloodline Healing",
      description: "Deeper than breaking generational curses — clearing spiritual attacks on your entire family's divine purpose and destiny.",
      icon: "🧬"
    }
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 pb-24">
      {/* Directory Title Layout */}
      <div className="border-b border-purple-900/20 pb-4">
        <h1 className="text-3xl font-extrabold uppercase tracking-wider text-purple-400">
          Spiritual Tools Chamber
        </h1>
        <p className="text-gray-400 italic text-sm mt-1">
          Equipping your practice with material and energetic support structures. Used with Source-centered intention. 🤍
        </p>
      </div>

      {/* Dynamic Link Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <Link
            key={tool.id}
            href={`/spiritual-tools/${tool.id}${queryString}`}
            className="p-5 rounded-2xl bg-purple-950/10 hover:bg-purple-950/20 transition-all duration-200 border border-purple-900/20 hover:border-purple-500/30 flex flex-col justify-between shadow-md active:scale-[0.99] group text-left"
          >
            <div>
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform w-fit">
                {tool.icon}
              </div>
              <h2 className="text-xl font-bold tracking-wide text-purple-300 group-hover:underline">
                {tool.title}
              </h2>
              <p className="text-gray-300 text-xs mt-2 leading-relaxed">
                {tool.description}
              </p>
            </div>
            <div className="mt-4 pt-2 text-right">
              <span className="text-[10px] uppercase font-bold tracking-widest text-purple-400 group-hover:text-purple-300">
                Enter Room ➔
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
