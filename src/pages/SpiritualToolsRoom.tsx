import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Unlock, Eye, Shield, Star, Trees, Wind, Diamond,
  Droplet, Link2, Scissors, Hash, Leaf, Bird, Repeat,
  MessageSquare, HeartHandshake, Moon, Zap, Search, Sun,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const sections = [
  { id: "source-tools-vs-source", title: "Source Tools vs Source", description: "Tools point to Source — they are never the source. Understanding this protects your practice and keeps your power properly rooted.", icon: Unlock, colorClass: "text-amber-400" },
  { id: "understanding-spiritual-realm", title: "Understanding the Spiritual Realm", description: "What exists beyond what you can see, how realms are structured, and how to navigate the unseen with wisdom and safety.", icon: Eye, colorClass: "text-violet-400" },
  { id: "lightworker-persecution-clearing", title: "Lightworker Persecution Clearing", description: "Healing from spiritual targeting, rejection, and assignment. You were made for this — learn how to clear what has been sent against you.", icon: Shield, colorClass: "text-blue-400" },
  { id: "angels-and-archangels", title: "Angels and Archangels", description: "All 11 archangels — who they are, what they carry, and how to work with their assignments in Source-rooted practice.", icon: Star, colorClass: "text-yellow-400" },
  { id: "bloodline-healing", title: "Bloodline Healing", description: "Identifying and breaking inherited curses, covenants, and patterns in your family line through prayer, renunciation, and declaration.", icon: Trees, colorClass: "text-orange-400" },
  
  { id: "energy-clearing", title: "Energy Clearing", description: "How to clear your body, aura, space, and objects of stagnant, discordant, or foreign energy — practically and spiritually.", icon: Wind, colorClass: "text-cyan-400" },
  { id: "crystals-how-to-use", title: "Crystals and Stones — How to Use", description: "Cleansing, programming, placement, grids, and wearing crystals as tools that amplify divine intention — not replace it.", icon: Diamond, colorClass: "text-fuchsia-400" },
  { id: "essential-oils-how-to-use", title: "Essential Oils and Plant Medicine", description: "Safe blending, dilution ratios, application methods, and healing formulas rooted in the intelligence of creation.", icon: Droplet, colorClass: "text-emerald-400" },
  { id: "soul-ties", title: "Soul Ties", description: "What they are, how they form, the difference between covenant connection and entanglement — and how to break free.", icon: Link2, colorClass: "text-rose-400" },
  { id: "cord-cutting", title: "Cord Cutting Ritual", description: "A step-by-step practice for severing energetic cords to people, places, and experiences that are draining your life-force.", icon: Scissors, colorClass: "text-pink-400" },
  { id: "numerology-in-practice", title: "Numerology in Practice", description: "How to use your life path, personal year, and daily numbers as a practical spiritual compass in real decisions.", icon: Hash, colorClass: "text-indigo-400" },
  { id: "nature-signs-synchronicities", title: "Nature Signs and Synchronicities", description: "How Source speaks through clouds, weather, feathers, numbers, and perfectly timed events — and how to read it.", icon: Leaf, colorClass: "text-lime-400" },
  { id: "animal-messengers", title: "Animal Messengers", description: "The spiritual significance of animals that cross your path — totem animals, spirit messengers, and how to receive their guidance.", icon: Bird, colorClass: "text-teal-400" },
  
  { id: "generational-patterns-breaking-cycles", title: "Generational Patterns and Breaking Cycles", description: "The practical steps of identifying inherited patterns, renouncing them at the root, and establishing new declarations.", icon: Repeat, colorClass: "text-purple-400" },
  { id: "prayer-templates", title: "Prayer Templates", description: "Ready-to-use frameworks for morning prayer, intercession, healing, protection, repentance, warfare, and declaration.", icon: MessageSquare, colorClass: "text-violet-300" },
  { id: "intercessor-connection", title: "Intercessor Connection", description: "What intercessors carry, how to work with one, and what to expect when you invite this kind of spiritual partnership.", icon: HeartHandshake, colorClass: "text-pink-300" },
  { id: "dream-interpretation-spiritual", title: "Dream Interpretation for Spiritual Messages", description: "How to prepare for, record, test, and act on dreams that carry divine direction for your life.", icon: Moon, colorClass: "text-indigo-300" },
  { id: "spiritual-warfare-protection", title: "Spiritual Warfare and Protection", description: "Understanding the battle, wearing the full Armor of God, warfare prayer, and standing firm without fear.", icon: Zap, colorClass: "text-blue-300" },
  { id: "discernment", title: "Discernment — Knowing What is From God", description: "The fruit test, peace test, scripture alignment, and spirit-testing so you move with wisdom, not assumption.", icon: Search, colorClass: "text-green-400" },
  { id: "daily-healing-practice", title: "Your Daily Healing Practice", description: "Morning grounding, breathwork, hydration prompts, energy check-in, evening reflection, weekly chakra review, and monthly spiritual reset.", icon: Sun, colorClass: "text-yellow-300" },
];

export default function SpiritualToolsRoom() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 overflow-y-auto p-4 pb-24" style={{ background: "radial-gradient(ellipse at 20% 20%, hsl(0,80%,5%) 0%, hsl(0,80%,12%) 45%, hsl(0,50%,25%) 100%)" }}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2 text-center">Spiritual Tools</h1>
        <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
          How to use every tool — always rooted in Source, never dependent on the tool itself. Practice, ritual, and protection for the intentional healer.
        </p>
      </motion.div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((section, index) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.04 }}
            >
              <Card
                className="cursor-pointer hover:border-primary/40 transition-colors bg-card/80 backdrop-blur-sm h-full"
                onClick={() => navigate(`/spiritual-tools/${section.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && navigate(`/spiritual-tools/${section.id}`)}
              >
                <CardHeader className="flex items-start gap-3 p-4">
                  <div className={`flex-shrink-0 h-12 w-12 rounded-full bg-muted flex items-center justify-center ${section.colorClass}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="text-base font-bold">{section.title}</CardTitle>
                    <CardDescription className="text-xs mt-1 leading-relaxed">{section.description}</CardDescription>
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
