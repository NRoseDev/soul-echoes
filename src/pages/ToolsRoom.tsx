import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Diamond, Droplet, Hash, Leaf, Zap, Heart, Volume2, CheckSquare, Smile, Wind, Brain, Sparkles
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LevelPath } from "@/components/levels/LevelPath";

const sections = [
  // Practical Tools (5)
  { id: "focus-soundscapes", title: "Focus Soundscapes", description: "Background sounds like brown noise, rain, ocean waves, white noise to help you focus or calm your brain.", icon: Volume2, colorClass: "text-sky-400" },
  { id: "micro-task-builder", title: "Micro-Task Builder", description: "Break overwhelming tasks into tiny manageable steps. Get small wins and build momentum.", icon: CheckSquare, colorClass: "text-green-400" },
  { id: "mood-check-ins", title: "Mood Check-Ins", description: "Quick emotional check-ins. Log how you're feeling, what triggered it, and discover your patterns over time.", icon: Smile, colorClass: "text-yellow-400" },
  { id: "breathing-exercises", title: "Breathing Exercises", description: "Guided breathing for when your brain is racing or overwhelmed. Calm your nervous system.", icon: Wind, colorClass: "text-cyan-400" },
  { id: "thought-reframing", title: "Thought Reframing", description: "Challenge negative thought loops. The AI asks questions to help you rewrite the thought.", icon: Brain, colorClass: "text-purple-400" },
  
  // Internal & External Aids (6)
  { id: "crystals-stones", title: "Crystals & Stones", description: "Earth medicine for healing, protection, and manifestation — used with Source-centered intention.", icon: Diamond, colorClass: "text-fuchsia-400" },
  { id: "essential-oils", title: "Essential Oils & Plant Medicine", description: "Sacred plant allies for protection, healing, and spiritual work — always Source-centered.", icon: Droplet, colorClass: "text-emerald-400" },
  { id: "numerology-angel-numbers", title: "Numerology & Angel Numbers", description: "Life Path numbers, soul urge, and the meaning behind repeating angel numbers.", icon: Hash, colorClass: "text-rose-300" },
  { id: "nature-signs", title: "Nature Signs & Synchronicities", description: "Nature speaks the language of the divine — learn to read its messages and signs.", icon: Leaf, colorClass: "text-lime-400" },
  { id: "energy-clearing", title: "Energy Clearing", description: "Clear blocks, toxic ties, or lingering residue in your space using sacred botanical elements like White Sage and Palo Santo wood.", icon: Zap, colorClass: "text-indigo-400" },
  { id: "soul-ties", title: "Soul Ties", description: "Deep emotional/spiritual connections between people — healthy and unhealthy bonds explained.", icon: Heart, colorClass: "text-pink-400" },
  
];

export default function ToolsRoom() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 overflow-y-auto p-4 pb-32" style={{ background: "radial-gradient(ellipse at 20% 20%, hsl(25,80%,5%) 0%, hsl(25,90%,14%) 45%, hsl(25,60%,26%) 100%)" }}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2 text-center">Tools</h1>
        <p className="text-muted-foreground text-center mb-6">Practical tools and aids for healing (22 total). Learn the WHY in Wisdom, then apply it here. The AI can also send you directly to a tool when you need immediate help.</p>
      </motion.div>

      <div className="max-w-2xl mx-auto mb-6">
        <LevelPath roomId="tools" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">

        {sections.map((s, i) => {
          const Icon = s.icon;
          const isPlaceholder = s.id.startsWith("placeholder");
          
          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            >
              <Card
                className={`${!isPlaceholder ? "cursor-pointer hover:border-primary/40" : "opacity-50"} transition-colors bg-card/80 backdrop-blur-sm`}
                onClick={() => !isPlaceholder && navigate(`/tools/${s.id}`)}
                role={!isPlaceholder ? "button" : undefined}
                tabIndex={!isPlaceholder ? 0 : -1}
                onKeyDown={(e) => !isPlaceholder && e.key === "Enter" && navigate(`/tools/${s.id}`)}
              >
                <CardHeader className="flex flex-row items-start gap-3 p-4">
                  <div className={`flex-shrink-0 h-10 w-10 rounded-full bg-muted flex items-center justify-center ${s.colorClass}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="text-base font-bold">{s.title}</CardTitle>
                    <CardDescription className="text-xs mt-1 leading-relaxed">{s.description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
