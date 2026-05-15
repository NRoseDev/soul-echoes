"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Activity, Brain, Heart, ScrollText } from "lucide-react";

// --- DEEP DIAGNOSTIC DATA ---
const CHAKRA_DATA: Record<string, any> = {
  root: {
    color: "#ef4444",
    name: "Root Chakra",
    sanskrit: "Muladhara",
    meaning: "Root Support",
    location: "Base of spine",
    focus: "Safety, Grounding, Survival",
    symptoms: ["Anxiety or panic attacks", "Financial fear", "Feeling ungrounded", "Lower back pain", "Immune issues"],
    affirmation: "I am safe. I am grounded. I have everything I need."
  },
  sacral: {
    color: "#f97316",
    name: "Sacral Chakra",
    sanskrit: "Svadhisthana",
    meaning: "Sweetness",
    location: "Below navel",
    focus: "Creativity, Sexuality, Emotions",
    symptoms: ["Creative blocks", "Emotional numbness", "Relationship drama", "Guilt or shame", "Reproductive issues"],
    affirmation: "I embrace my creativity. I feel my emotions deeply. I am worthy of pleasure."
  },
  solar_plexus: {
    color: "#eab308",
    name: "Solar Plexus",
    sanskrit: "Manipura",
    meaning: "Lustrous Gem",
    location: "Upper abdomen",
    focus: "Willpower, Confidence, Action",
    symptoms: ["Low self-esteem", "Indecision", "Digestive issues", "Victim mentality", "Anger outbursts"],
    affirmation: "I am powerful. I trust my gut. I stand in my authentic power."
  },
  heart: {
    color: "#22c55e",
    name: "Heart Chakra",
    sanskrit: "Anahata",
    meaning: "Unstruck",
    location: "Center of chest",
    focus: "Love, Compassion, Breath",
    symptoms: ["Grief or heartbreak", "Holding grudges", "Fear of intimacy", "Loneliness", "Respiratory issues"],
    affirmation: "I give and receive love effortlessly. I forgive myself and others."
  },
  throat: {
    color: "#3b82f6",
    name: "Throat Chakra",
    sanskrit: "Vishuddha",
    meaning: "Purification",
    location: "Throat",
    focus: "Truth, Expression, Listening",
    symptoms: ["Fear of speaking up", "Sore throat", "Dishonesty", "Shyness", "Thyroid issues"],
    affirmation: "I speak my truth with clarity and love. My voice matters."
  },
  third_eye: {
    color: "#8b5cf6",
    name: "Third Eye",
    sanskrit: "Ajna",
    meaning: "Command",
    location: "Between brows",
    focus: "Intuition, Insight, Vision",
    symptoms: ["Brain fog", "Lack of direction", "Headaches", "Disconnect from intuition", "Nightmares"],
    affirmation: "I trust my intuition. I see clearly. I am connected to divine wisdom."
  },
  crown: {
    color: "#a855f7",
    name: "Crown Chakra",
    sanskrit: "Sahasrara",
    meaning: "Thousand-Petaled",
    location: "Top of head",
    focus: "Divinity, Enlightenment",
    symptoms: ["Spiritual cynicism", "Feeling disconnected", "Existential crisis", "Isolation", "Migraines"],
    affirmation: "I am one with the Universe. I am guided by Divine light."
  },
  soul_star: {
    color: "#ffffff",
    name: "Soul Star",
    sanskrit: "Sutara",
    meaning: "Star Bridge",
    location: "Above head",
    focus: "Karmic Purpose, Akashic Records",
    symptoms: ["Lost life purpose", "Karmic cycles repeating", "Disconnect from Higher Self", "Spiritual amnesia"],
    affirmation: "I align with my soul's purpose. I access my highest timeline."
  }
};

export default function WisdomDetail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeChakra, setActiveChakra] = useState<string | null>(null);

  useEffect(() => {
    const chakraParam = searchParams.get("chakra");
    if (chakraParam) {
      setActiveChakra(chakraParam.toLowerCase());
    }
  }, [searchParams]);

  const handleToolsNavigation = () => {
    // Passes the diagnostic data forward to the Tools Dashboard
    navigate(`/spiritual-tools/angels?source=wisdom&chakra=${encodeURIComponent(activeChakra || "all")}`);
  };

  const data = activeChakra ? CHAKRA_DATA[activeChakra] : null;

  if (!data) {
    return (
      <div className="p-12 text-center text-gray-400 min-h-screen flex flex-col items-center justify-center bg-[#0b0b0f]">
        <Activity className="mb-4 text-purple-500 animate-pulse" size={40} />
        <p>Select a chakra from the Angel Portal to begin your diagnostic.</p>
        <button onClick={() => navigate("/angels")} className="mt-4 text-purple-400 hover:underline">Return to Portal</button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#0b0b0f] text-white min-h-screen w-full max-w-4xl mx-auto pb-24">
      
      {/* HEADER: The Scanner Visual */}
      <div className="mb-8 border-b border-purple-900/20 pb-8 text-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex flex-col items-center"
        >
          <div 
            className="w-20 h-20 rounded-full mb-4 blur-xl opacity-50 animate-pulse"
            style={{ backgroundColor: data.color }}
          />
          <h2 className="text-4xl font-extrabold uppercase tracking-widest flex items-center gap-3" style={{ color: data.color }}>
            <Sparkles size={28} /> {data.name}
          </h2>
          <p className="text-gray-400 italic text-sm mt-2 tracking-wide">
            Center of {data.focus}
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* CARD 1: DEEP INFO (History/Meaning) */}
        <div className="bg-purple-950/10 border border-purple-500/20 p-6 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-3">
            <ScrollText className="text-teal-400" />
            <h3 className="text-xl font-bold text-white">Ancient Wisdom</h3>
          </div>
          <div className="space-y-3 text-sm text-gray-300">
             <p><strong>Sanskrit:</strong> {data.sanskrit} ({data.meaning})</p>
             <p><strong>Location:</strong> {data.location}</p>
             <p className="italic border-l-2 border-purple-500 pl-3 py-1">
               "When this center is balanced, you feel grounded, secure, and present."
             </p>
          </div>
        </div>

        {/* CARD 2: DIAGNOSTIC (Symptoms) */}
        <div className="bg-purple-950/10 border border-purple-500/20 p-6 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-3">
            <Activity className="text-red-400" />
            <h3 className="text-xl font-bold text-white">Signs of Blockage</h3>
          </div>
          <ul className="space-y-3">
            {data.symptoms.map((s: string, i: number) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-200">
                <span className="text-red-400 font-bold">✕</span> {s}
              </li>
            ))}
          </ul>
        </div>

        {/* CARD 3: ALIGNMENT (Affirmation) */}
        <div className="bg-purple-950/10 border border-purple-500/20 p-6 rounded-2xl shadow-lg md:col-span-2">
          <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-3">
            <Brain className="text-teal-400" />
            <h3 className="text-xl font-bold text-white">Immediate Re-Calibration</h3>
          </div>
          <div className="p-6 bg-black/30 rounded-xl border-l-4 border-teal-500 italic text-xl text-center text-white/90 leading-relaxed">
            "{data.affirmation}"
          </div>
        </div>

      </div>

      {/* ACTION BAR: The Prescription */}
      <div className="mt-8 p-6 rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-950/20 to-purple-950/20 text-center shadow-xl">
        <div className="flex flex-col items-center">
          <Heart className="text-blue-400 mb-2" size={32} />
          <h3 className="text-xl font-bold text-white mb-2">Ready to Clear this Energy?</h3>
          <p className="text-sm text-gray-300 mb-6 max-w-lg">
            We have curated specific Crystals, Oils, and Angelic frequencies to balance the <strong>{data.name}</strong>.
          </p>
          <button
            onClick={handleToolsNavigation}
            className="px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-widest transition-all shadow-lg hover:shadow-blue-500/25 flex items-center gap-3"
          >
            Get Prescribed Tools <ArrowRight size={18} />
          </button>
        </div>
      </div>

    </div>
  );
}
