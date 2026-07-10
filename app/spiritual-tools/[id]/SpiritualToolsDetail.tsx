"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle, Circle, Sparkles } from "lucide-react";

// --- CONTENT DATABASE (All your text/data is stored here cleanly) ---
const SECTIONS = [
  {
    id: "source",
    title: "Understanding Source",
    icon: "🤍",
    desc: "God/Source is your power - tools are just the connection.",
    content: (
      <div className="space-y-6">
        <div className="p-5 bg-purple-900/20 border border-purple-500/30 rounded-xl">
          <h3 className="text-lg font-bold text-purple-300 mb-2">Tools vs Source</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• The crystal isn't healing you - <strong>GOD through you</strong> is healing you.</li>
            <li>• The angel numbers aren't magic - they're <strong>Source</strong> getting your attention.</li>
            <li>• If a tool pulls you AWAY from God, drop it immediately.</li>
          </ul>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-black/20 rounded-lg border border-white/10">
            <h4 className="font-bold text-teal-400 text-sm mb-1">Stay God-Centered</h4>
            <p className="text-xs text-gray-400">Pray/meditate before using any tool. Ask God to guide your usage of the crystal, card, or oil.</p>
          </div>
          <div className="p-4 bg-black/20 rounded-lg border border-white/10">
            <h4 className="font-bold text-teal-400 text-sm mb-1">The Goal</h4>
            <p className="text-xs text-gray-400">Tools are training wheels. Eventually, you won't need them - you'll just BE connected to Source at all times.</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "numerology",
    title: "Numerology & Angel Numbers",
    icon: "🔮",
    desc: "Decode the repeating numbers (111, 333) you see daily.",
    content: (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        {[
          { num: "111", title: "Awakening", meaning: "New beginnings, manifestation, alignment." },
          { num: "222", title: "Harmony", meaning: "Trust the process, balance is returning." },
          { num: "333", title: "Protection", meaning: "Divine trinity, ascended masters are near." },
          { num: "444", title: "Foundation", meaning: "Angels are with you, stability is forming." },
          { num: "555", title: "Change", meaning: "Major transformation or freedom coming." },
          { num: "777", title: "Confirmation", meaning: "You are on the right path. Keep going." },
          { num: "888", title: "Abundance", meaning: "Financial blessings and infinity loops." },
          { num: "1111", title: "Portal", meaning: "Wake-up call. Manifest now. Pay attention." },
        ].map((n) => (
          <div key={n.num} className="p-4 bg-black/20 rounded-lg border border-purple-900/50 hover:border-purple-500/50 transition">
            <div className="flex items-center gap-2 mb-1">
              <strong className="text-purple-400 text-xl">{n.num}</strong>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{n.title}</span>
            </div>
            <p className="text-gray-300 text-xs">{n.meaning}</p>
          </div>
        ))}
      </div>
    )
  },
  {
    id: "soul-ties",
    title: "Soul Ties & Cord Cutting",
    icon: "💫",
    desc: "Release unhealthy attachments and heal relationships.",
    content: (
      <div className="space-y-4">
        <p className="text-sm text-gray-300 italic">Deep emotional connections can be healthy (love) or unhealthy (trauma bonding). Use this ritual to release what no longer serves you.</p>
        <div className="p-5 bg-red-950/20 border border-red-500/20 rounded-xl">
          <h4 className="font-bold text-red-300 text-sm mb-3 flex items-center gap-2">✂️ Cord Cutting Ritual</h4>
          <ol className="list-decimal list-inside text-sm text-gray-300 space-y-3">
            <li>Visualize the person you need to release standing in front of you.</li>
            <li>See the energetic cord connecting your hearts or solar plexus.</li>
            <li>Ask Archangel Michael to use his sword to sever the cord completely.</li>
            <li>Watch the cord dissolve into light. Wish them well, and send them away.</li>
            <li>Say: <strong>"I release you. I call my energy back. I am free."</strong></li>
          </ol>
        </div>
      </div>
    )
  },
  {
    id: "nature",
    title: "Nature Signs",
    icon: "🌿",
    desc: "Read the messages in feathers, rainbows, and weather.",
    content: (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
        {[
          { icon: "🌈", label: "Rainbow", sub: "Promise & Hope" },
          { icon: "🪶", label: "Feather", sub: "Angels Near" },
          { icon: "🌙", label: "Moon Phases", sub: "Divine Timing" },
          { icon: "⭐", label: "Shooting Star", sub: "Miracle Coming" },
          { icon: "🌊", label: "Ocean Waves", sub: "Emotional Flow" },
          { icon: "🔥", label: "Fire", sub: "Purification" },
        ].map((item) => (
          <div key={item.label} className="p-4 bg-black/20 rounded-lg border border-purple-900/30 text-center hover:bg-purple-900/10 transition">
            <div className="text-2xl mb-2">{item.icon}</div>
            <div className="font-bold text-gray-200">{item.label}</div>
            <div className="text-xs text-gray-500">{item.sub}</div>
          </div>
        ))}
      </div>
    )
  },
  {
    id: "animals",
    title: "Animal Messengers",
    icon: "🦋",
    desc: "Understand what it means when specific animals appear.",
    content: (
      <div className="space-y-4 text-sm">
        <div className="p-4 bg-black/20 rounded-lg border border-purple-900/30">
          <h4 className="text-purple-400 font-bold mb-2 uppercase tracking-wider text-xs">Interpretation Guide</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-gray-400">
            <span>☠️ Dead = Energy transforming</span>
            <span>✨ Healthy = Energy activating</span>
            <span>🔄 Repeated = Urgent message</span>
          </div>
        </div>
        <div className="space-y-2">
           <div className="flex items-center gap-3 p-2 border-b border-white/5">
             <span className="text-xl">🦅</span>
             <div><strong className="text-gray-200">Eagle</strong><p className="text-xs text-gray-400">Vision, rising above, spiritual courage.</p></div>
           </div>
           <div className="flex items-center gap-3 p-2 border-b border-white/5">
             <span className="text-xl">🦉</span>
             <div><strong className="text-gray-200">Owl</strong><p className="text-xs text-gray-400">Wisdom, intuition, seeing hidden truths.</p></div>
           </div>
           <div className="flex items-center gap-3 p-2 border-b border-white/5">
             <span className="text-xl">🟥</span>
             <div><strong className="text-gray-200">Cardinal</strong><p className="text-xs text-gray-400">Loved ones visiting from heaven.</p></div>
           </div>
           <div className="flex items-center gap-3 p-2 border-b border-white/5">
             <span className="text-xl">🦋</span>
             <div><strong className="text-gray-200">Butterfly</strong><p className="text-xs text-gray-400">Transformation, rebirth, new cycles.</p></div>
           </div>
        </div>
      </div>
    )
  },
  {
    id: "scripture",
    title: "Healing Scripture",
    icon: "📖",
    desc: "Biblical foundations for protection and peace.",
    content: (
      <div className="grid grid-cols-1 gap-3 text-sm">
         <div className="p-4 border border-purple-500/20 rounded-lg bg-purple-950/10">
           <strong className="text-purple-300 block mb-1">Anxiety (Phil 4:6-7)</strong>
           <p className="text-gray-400 italic">"Do not be anxious about anything, but in every situation... present your requests to God."</p>
         </div>
         <div className="p-4 border border-purple-500/20 rounded-lg bg-purple-950/10">
           <strong className="text-purple-300 block mb-1">Fear (Isaiah 41:10)</strong>
           <p className="text-gray-400 italic">"Do not fear, for I am with you; do not be dismayed, for I am your God."</p>
         </div>
         <div className="p-4 border border-purple-500/20 rounded-lg bg-purple-950/10">
           <strong className="text-purple-300 block mb-1">Broken Heart (Psalm 34:18)</strong>
           <p className="text-gray-400 italic">"The Lord is close to the brokenhearted and saves those who are crushed in spirit."</p>
         </div>
      </div>
    )
  },
  {
    id: "generation",
    title: "Breaking Patterns",
    icon: "🔥",
    desc: "Clear inherited trauma and family cycles.",
    content: (
      <div className="text-center space-y-4">
        <p className="text-sm text-gray-300">Speak this declaration out loud to shift the energy of your lineage.</p>
        <div className="p-6 bg-purple-950/40 border border-purple-500/40 rounded-xl italic text-white font-medium leading-relaxed shadow-inner">
          "I acknowledge the pain passed down through my lineage. I honor my ancestors and release what no longer serves. The cycle ends with me. I choose healing. I choose peace. I choose love. I am the cycle breaker."
        </div>
        <p className="text-xs text-gray-500">Scriptural Basis: Exodus 20:5-6, Galatians 3:13</p>
      </div>
    )
  }
];

export default function SpiritualToolsDetail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeView, setActiveView] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string[]>([]);
  const [activeChakra, setActiveChakra] = useState<string | null>(null);

  // --- 1. INITIALIZATION & PARAMS ---
  useEffect(() => {
    const chakra = searchParams.get("chakra");
    if (chakra && chakra !== "all") {
      setActiveChakra(chakra);
    }
  }, [searchParams]);

  const toggleComplete = (id: string) => {
    setCompleted(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleReturn = () => {
    // Routes safely back to the Angels portal card grid
    router.push("/spiritual-tools/angels");
  };

  // --- 2. DASHBOARD VIEW (THE GRID) ---
  if (!activeView) {
    return (
      <div className="p-6 bg-[#0b0b0f] text-white min-h-screen w-full max-w-5xl mx-auto pb-24">
        {/* Header */}
        <div className="mb-8 border-b border-purple-900/20 pb-4">
          <h2 className="text-3xl font-extrabold uppercase tracking-wider text-purple-400 flex items-center gap-2">
            🛠️ Tool Dashboard
          </h2>
          <p className="text-gray-400 italic text-sm mt-1">
            Select a tool below to enter its workspace and apply its wisdom.
          </p>
        </div>

        {/* Chakra Banner (Only appears if flow is connected) */}
        {activeChakra && (
          <div className="mb-8 p-4 rounded-xl bg-teal-950/30 border border-teal-500/30 flex items-center gap-3 animate-fade-in">
            <Sparkles className="text-teal-400" size={20} />
            <div>
              <p className="text-xs uppercase font-bold tracking-widest text-teal-300">Active Flow</p>
              <p className="text-sm font-bold text-white">Aligning tools for {activeChakra.replace('_', ' ')} Chakra</p>
            </div>
          </div>
        )}

        {/* The Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveView(section.id)}
              className="group relative p-5 bg-purple-950/10 rounded-2xl border border-purple-900/30 hover:border-purple-500/50 hover:bg-purple-900/20 transition-all duration-300 text-left flex flex-col h-full shadow-md active:scale-[0.99]"
            >
               {completed.includes(section.id) && (
                 <div className="absolute top-3 right-3 text-teal-500"><CheckCircle size={16} /></div>
               )}
               <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300 w-fit">{section.icon}</div>
               <h3 className="text-lg font-bold text-purple-200 group-hover:text-white mb-1">{section.title}</h3>
               <p className="text-xs text-gray-400 leading-relaxed">{section.desc}</p>
               <div className="mt-auto pt-4 flex items-center text-xs text-purple-400 font-bold tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                 OPEN WORKSPACE ➔
               </div>
            </button>
          ))}
        </div>

        {/* Footer Navigation */}
        <div className="mt-12 p-6 rounded-xl border border-purple-500/20 bg-purple-950/20 text-center shadow-lg max-w-md mx-auto">
           <p className="text-sm text-gray-300 mb-3">Ready to integrate this session?</p>
           <button
             onClick={handleReturn}
             className="px-6 py-2 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold transition shadow-md"
           >
             Return to Angels Portal ➔
           </button>
        </div>
      </div>
    );
  }

  // --- 3. WORKSPACE VIEW (THE DETAILS) ---
  const currentSection = SECTIONS.find(s => s.id === activeView);
  if (!currentSection) return null;

  return (
    <div className="p-6 bg-[#0b0b0f] text-white min-h-screen w-full max-w-3xl mx-auto pb-24">
      <button 
        onClick={() => setActiveView(null)}
        className="flex items-center gap-2 text-sm text-purple-400 hover:text-white mb-6 transition"
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="bg-purple-950/10 border border-purple-500/20 rounded-2xl p-6 sm:p-8 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-purple-900/30">
          <div className="flex items-center gap-4">
            <span className="text-4xl bg-black/30 p-3 rounded-xl border border-white/10 shadow-inner">{currentSection.icon}</span>
            <div>
              <h1 className="text-2xl font-bold text-white">{currentSection.title}</h1>
              <p className="text-sm text-purple-300">Interactive Workspace</p>
            </div>
          </div>
          <button 
            onClick={() => toggleComplete(currentSection.id)}
            className={`p-2 rounded-full transition ${completed.includes(currentSection.id) ? "text-teal-400 bg-teal-950/30" : "text-gray-600 hover:text-gray-400"}`}
            title={completed.includes(currentSection.id) ? "Completed" : "Mark as Complete"}
          >
            {completed.includes(currentSection.id) ? <CheckCircle size={28} /> : <Circle size={28} />}
          </button>
        </div>

        <div className="prose prose-invert max-w-none">
          {currentSection.content}
        </div>

        <div className="mt-8 pt-6 border-t border-purple-900/30 flex justify-center">
          <button 
            onClick={() => { toggleComplete(currentSection.id); setActiveView(null); }}
            className={`px-8 py-3 rounded-full font-bold transition shadow-lg flex items-center gap-2 ${completed.includes(currentSection.id) ? "bg-teal-600 hover:bg-teal-500 text-white" : "bg-purple-600 hover:bg-purple-500 text-white"}`}
          >
            {completed.includes(currentSection.id) ? "Saved & Return" : "Mark Complete & Return"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
