import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sun, Layers, Brain, Activity, Music2, Map, GitBranch, Wind,
  Volume2, Zap, Gift, MessageSquare, Hand, Leaf, Droplet,
  Diamond, Flower2, Moon, Star, Hexagon, Sparkles, Hash, BookOpen,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LevelPath } from "@/components/levels/LevelPath";

const sections = [
  { id: "what-is-source", title: "What is Source", description: "The divine intelligence behind all creation — God, Universe, the All. Understanding your origin changes everything.", icon: Sun, colorClass: "text-amber-400" },
  { id: "chakra-system", title: "Chakra System", description: "All 12 energy centers plus the Earth Star — their locations, meanings, blockages, and how to restore flow.", icon: Layers, colorClass: "text-violet-400" },
  { id: "nervous-system", title: "Nervous System and Polyvagal Theory", description: "Why your body responds the way it does. The science of safety, trauma, and nervous system regulation.", icon: Brain, colorClass: "text-blue-400" },
  { id: "vagus-nerve", title: "Vagus Nerve Activation", description: "The master healing nerve. Learn what it is, how it regulates your entire body, and how to activate it.", icon: Activity, colorClass: "text-green-400" },
  { id: "tuning-fork-therapy", title: "Tuning Fork Therapy", description: "How precise frequencies restore harmony in the body and energy field. The science and spirit behind the sound.", icon: Music2, colorClass: "text-sky-400" },
  { id: "pain-body-map", title: "Emotional Pain Body Map", description: "Your body keeps score. A map of where grief, fear, anger, shame, and trauma live in physical tissue.", icon: Map, colorClass: "text-rose-400" },
  { id: "generational-illness", title: "Generational Illness and Clearing", description: "How ancestral trauma is encoded in DNA and passed through family lines — and how it can be released.", icon: GitBranch, colorClass: "text-orange-400" },
  { id: "how-breathwork-works", title: "How Breathwork Works", description: "The biochemistry and spirituality of breath. Why controlled breathing transforms your nervous system.", icon: Wind, colorClass: "text-cyan-400" },
  { id: "how-sound-healing-works", title: "How Sound Healing Works", description: "Resonance, entrainment, solfeggio frequencies, and cymatics — how sound restructures matter and mind.", icon: Volume2, colorClass: "text-purple-400" },
  { id: "how-energy-work-functions", title: "How Energy Work Functions", description: "The biofield, aura layers, and how practitioners move, clear, and restore life-force energy.", icon: Zap, colorClass: "text-indigo-400" },
  { id: "spiritual-gifts-explained", title: "Spiritual Gifts Explained", description: "The gifts of prophecy, healing, tongues, discernment, wisdom, and more — their true biblical roots.", icon: Gift, colorClass: "text-yellow-400" },
  { id: "power-of-words", title: "Power of Words", description: "Words carry vibration. Science and scripture both confirm that what you speak, you create.", icon: MessageSquare, colorClass: "text-pink-400" },
  { id: "reflexology-and-meridians", title: "Reflexology and Meridians", description: "The ancient Chinese meridian system, foot and hand reflexology, and the body's internal energy highways.", icon: Hand, colorClass: "text-teal-400" },
  { id: "sacred-nourishment", title: "Sacred Nourishment", description: "Food as frequency and medicine. The gut-brain connection, healing foods, and eating as a sacred act.", icon: Leaf, colorClass: "text-lime-400" },
  { id: "essential-oils", title: "Essential Oils Education", description: "How oils enter the body, their therapeutic properties, safe use, and which frequencies they carry.", icon: Droplet, colorClass: "text-emerald-400" },
  { id: "crystal-and-stone-properties", title: "Crystal and Stone Properties", description: "How crystals work energetically, common stones and their healing frequencies, and how to work with them.", icon: Diamond, colorClass: "text-fuchsia-400" },
  { id: "plant-medicine-and-herbs", title: "Plant Medicine and Herbs", description: "Adaptogens, nervines, and healing herbs across traditions. Tinctures, teas, and safe herbal practice.", icon: Flower2, colorClass: "text-green-300" },
  { id: "dream-interpretation", title: "Dream Interpretation", description: "Why we dream, what symbols mean, prophetic dreams, and how to journal and decode your nighttime messages.", icon: Moon, colorClass: "text-indigo-300" },
  { id: "astrology-basics", title: "Astrology Basics", description: "Sun, Moon, and Rising signs. The 12 houses, planetary influences, and your North Node soul purpose.", icon: Star, colorClass: "text-amber-300" },
  { id: "sacred-geometry", title: "Sacred Geometry", description: "The Flower of Life, Fibonacci sequence, golden ratio, and how divine patterns underlie all creation.", icon: Hexagon, colorClass: "text-violet-300" },
  { id: "your-spiritual-gifts", title: "Understanding Your Spiritual Gifts", description: "Empath, Prophet, Seer, Healer, Intercessor, Lightworker, Starseed, Medicine Person and more — honestly explained.", icon: Sparkles, colorClass: "text-sky-300" },
  { id: "numerology-and-angel-numbers", title: "Numerology and Angel Numbers", description: "Life Path numbers, soul urge, and the meaning behind 111, 222, 333, 444, 555, 777, 888, 999, and 1111.", icon: Hash, colorClass: "text-rose-300" },
  { id: "healing-scripture-by-emotion", title: "Healing Scripture by Emotion", description: "Scripture organized by what you are feeling right now — for fear, grief, anger, shame, loneliness, anxiety, and depression.", icon: BookOpen, colorClass: "text-amber-300" },
  
  // Placeholders (10 more to reach 33)
  { id: "placeholder-1", title: "[Coming Soon]", description: "More wisdom teachings will be added to the library.", icon: Sparkles, colorClass: "text-gray-400" },
  { id: "placeholder-2", title: "[Coming Soon]", description: "More wisdom teachings will be added to the library.", icon: Sparkles, colorClass: "text-gray-400" },
  { id: "placeholder-3", title: "[Coming Soon]", description: "More wisdom teachings will be added to the library.", icon: Sparkles, colorClass: "text-gray-400" },
  { id: "placeholder-4", title: "[Coming Soon]", description: "More wisdom teachings will be added to the library.", icon: Sparkles, colorClass: "text-gray-400" },
  { id: "placeholder-5", title: "[Coming Soon]", description: "More wisdom teachings will be added to the library.", icon: Sparkles, colorClass: "text-gray-400" },
  { id: "placeholder-6", title: "[Coming Soon]", description: "More wisdom teachings will be added to the library.", icon: Sparkles, colorClass: "text-gray-400" },
  { id: "placeholder-7", title: "[Coming Soon]", description: "More wisdom teachings will be added to the library.", icon: Sparkles, colorClass: "text-gray-400" },
  { id: "placeholder-8", title: "[Coming Soon]", description: "More wisdom teachings will be added to the library.", icon: Sparkles, colorClass: "text-gray-400" },
  { id: "placeholder-9", title: "[Coming Soon]", description: "More wisdom teachings will be added to the library.", icon: Sparkles, colorClass: "text-gray-400" },
  { id: "placeholder-10", title: "[Coming Soon]", description: "More wisdom teachings will be added to the library.", icon: Sparkles, colorClass: "text-gray-400" },
];

export default function WisdomRoom() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 overflow-y-auto p-4 pb-24" style={{ background: "radial-gradient(ellipse at 20% 20%, hsl(25,80%,5%) 0%, hsl(25,90%,14%) 45%, hsl(25,60%,26%) 100%)" }}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2 text-center">Wisdom</h1>
        <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
          Ancient to modern teachings on the why behind healing (33 total). Every section here is a doorway into a deeper understanding of yourself, your body, your energy, and your divine design.
        </p>
      </motion.div>

      <div className="max-w-6xl mx-auto mb-6">
        <LevelPath roomId="wisdom" />
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((section, index) => {

          const Icon = section.icon;
          const isPlaceholder = section.id.startsWith("placeholder");
          
          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.03 }}
            >
              <Card
                className={`${!isPlaceholder ? "cursor-pointer hover:border-primary/40" : "opacity-50"} transition-colors bg-card/80 backdrop-blur-sm`}
                onClick={() => !isPlaceholder && navigate(`/wisdom/${section.id}`)}
                role={!isPlaceholder ? "button" : undefined}
                tabIndex={!isPlaceholder ? 0 : -1}
                onKeyDown={(e) => !isPlaceholder && e.key === "Enter" && navigate(`/wisdom/${section.id}`)}
              >
                <CardHeader className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 h-10 w-10 rounded-full bg-muted flex items-center justify-center ${section.colorClass}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-base font-bold">{section.title}</CardTitle>
                      <CardDescription className="text-xs mt-1 leading-relaxed">{section.description}</CardDescription>
                    </div>
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
