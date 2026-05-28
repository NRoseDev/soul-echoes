import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, Wind, Zap, Music, Sparkles, Scissors, Activity, Users, Circle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const sections = [
  { id: "meditation", title: "Meditation", description: "Discover the art of stillness and inner peace through 5 powerful meditation techniques.", icon: Brain, colorClass: "text-blue-400" },
  { id: "breathwork", title: "Breathwork", description: "Master box breathing, 4-7-8, belly breathing, alternate nostril, humming breath, ocean breath, triangle breathing, cooling breath, power breathing, heart coherence, grounding breath.", icon: Wind, colorClass: "text-cyan-400" },
  { id: "vagus-nerve", title: "Vagus Nerve & Nervous System", description: "Learn 5 quick techniques to activate your vagus nerve and calm your body.", icon: Zap, colorClass: "text-yellow-400" },
  { id: "sound-healing", title: "Sound Healing", description: "All 7 Solfeggio frequencies — which chakra each heals and what it does.", icon: Music, colorClass: "text-purple-400" },
  { id: "aura-cleansing", title: "Aura Cleansing", description: "3 simple techniques anyone can do at home to cleanse and protect your energy.", icon: Sparkles, colorClass: "text-pink-400" },
  { id: "cord-cutting", title: "Cord Cutting & Soul Ties", description: "Identify unhealthy attachments and perform a powerful 5-step cord cutting ritual.", icon: Scissors, colorClass: "text-red-400" },
  { id: "movement", title: "Movement as Medicine", description: "11 powerful movement practices that release stuck emotions and restore flow.", icon: Activity, colorClass: "text-green-400" },
  { id: "chakras", title: "The 13 Chakras", description: "Explore all 12 chakras plus Earth Star — from root to divine gateway.", icon: Circle, colorClass: "text-violet-400" },
  { id: "connect-healer", title: "Connect to a Healer", description: "Book a one-on-one session with a verified spiritual practitioner.", icon: Users, colorClass: "text-orange-400" },
];

export default function FlowRoom() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 overflow-y-auto p-4 pb-24" style={{ background: "radial-gradient(ellipse at 20% 20%, hsl(210,90%,5%) 0%, hsl(210,80%,12%) 45%, hsl(210,40%,28%) 100%)" }}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2 text-center">Flow</h1>
        <p className="text-muted-foreground text-center mb-6">Body, energy, and movement practices. Learn how to activate, move, and embody your healing through breathwork, meditation, sound, and somatic practices.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {sections.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
            >
              <Card
                className="cursor-pointer hover:border-primary/40 transition-colors bg-card/80 backdrop-blur-sm"
                onClick={() => navigate(`/flow/${s.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && navigate(`/flow/${s.id}`)}
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
