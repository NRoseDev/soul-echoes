import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen, Wind, VolumeX, Eclipse, Sparkles, Compass, Users, Stethoscope, ShieldAlert,
} from "lucide-react";

const rooms: Record<string, { title: string; description: string; icon: React.ElementType; colorClass: string }> = {
  "/journal": { title: "Journal", description: "Write freely. No rules, no judgment — just you and the page. Let your thoughts find their shape.", icon: BookOpen, colorClass: "text-healing-journal" },
  "/flow": { title: "Flow", description: "Guided breathing exercises to calm your nervous system and reconnect with your body.", icon: Wind, colorClass: "text-healing-breathe" },
  "/unspoken": { title: "Unspoken Chamber", description: "A space for the things you can't say out loud. Express through symbols, colors, and movement.", icon: VolumeX, colorClass: "text-healing-unspoken" },
  "/shadow-work": { title: "Shadow Work", description: "Gently explore the parts of yourself you've hidden. Growth lives in the shadows.", icon: Eclipse, colorClass: "text-healing-shadow" },
  "/wisdom": { title: "Wisdom", description: "Receive daily insights, affirmations, and ancient wisdom curated for your journey.", icon: Sparkles, colorClass: "text-healing-wisdom" },
  "/tools": { title: "Tools", description: "Tarot pulls, oracle cards, moon phases, chakra guides, and more — all in one place.", icon: Compass, colorClass: "text-healing-tools" },
  "/community": { title: "Community", description: "Connect with fellow seekers. Share, support, and grow together in a safe space.", icon: Users, colorClass: "text-healing-community" },
  "/practitioner": { title: "Practitioner Connect", description: "Find and connect with verified spiritual practitioners, healers, and therapists.", icon: Stethoscope, colorClass: "text-healing-practitioner" },
  "/crisis": { title: "Crisis Counselor", description: "You're not alone. Immediate support and resources are available for you right now.", icon: ShieldAlert, colorClass: "text-healing-crisis" },
};

export default function HealingRoom() {
  const location = useLocation();
  const room = rooms[location.pathname];

  if (!room) return null;

  const Icon = room.icon;

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center max-w-md space-y-6"
      >
        <div className={`inline-flex items-center justify-center h-20 w-20 rounded-full bg-muted ${room.colorClass}`}>
          <Icon className="h-10 w-10" aria-hidden="true" />
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground">{room.title}</h1>
        <p className="text-muted-foreground text-lg leading-relaxed">{room.description}</p>
        <p className="text-sm text-muted-foreground/60 italic">This healing room is coming soon ✨</p>
      </motion.div>
    </div>
  );
}
