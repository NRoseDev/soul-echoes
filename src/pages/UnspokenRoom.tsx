import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Mic2,
  Feather,
  Keyboard,
  ImageIcon,
  Volume2,
  HeartHandshake,
  Users,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const sections = [
  {
    id: "healing-conversations",
    title: "Healing Conversations",
    description: "33 relationship cards to have a compassionate healing conversation with anyone living or passed.",
    icon: MessageCircle,
    colorClass: "text-healing-unspoken",
  },
  {
    id: "throat-clearing",
    title: "Throat Chakra Clearing",
    description: "Vocal toning, truth speaking prompts, and guided exercises to open your voice.",
    icon: Mic2,
    colorClass: "text-healing-wisdom",
  },
  {
    id: "speak-your-truth",
    title: "Speak Your Truth",
    description: "Free expression space using any communication method you choose.",
    icon: Feather,
    colorClass: "text-healing-breathe",
  },
  {
    id: "asl-dictionary",
    title: "ASL Dictionary",
    description: "111 signs for emotions, daily needs, healing terms, and therapy vocabulary with images.",
    icon: Keyboard,
    colorClass: "text-healing-community",
  },
  {
    id: "visual-board",
    title: "Visual Communication Board",
    description: "A picture-based tool designed for nonverbal users and everyone who communicates without words.",
    icon: ImageIcon,
    colorClass: "text-healing-tools",
  },
  {
    id: "speech-tools",
    title: "Speech Tools",
    description: "Speech to text and text to speech tools for easier expression and listening.",
    icon: Volume2,
    colorClass: "text-healing-breathe",
  },
  {
    id: "intercessor-connection",
    title: "Intercessor Connection",
    description: "Reach out to a prayer warrior when emotions surface and you need spiritual care.",
    icon: HeartHandshake,
    colorClass: "text-healing-practitioner",
  },
  {
    id: "connect-healer",
    title: "Connect to a Healer",
    description: "Access deeper support for healing, trauma processing, and energy work.",
    icon: Users,
    colorClass: "text-healing-practitioner",
  },
];

export default function UnspokenRoom() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 overflow-y-auto p-4 pb-24 bg-gradient-to-br from-violet-950 via-slate-950 to-sky-950">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2 text-center">Unspoken Chamber</h1>
        <p className="text-muted-foreground text-center mb-6">A safe, accessible place for expression beyond words. Use voice, sign, images, or quiet presence.</p>
      </motion.div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((section, index) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
            >
              <Card
                className="cursor-pointer hover:border-primary/40 transition-colors bg-card/80 backdrop-blur-sm"
                onClick={() => navigate(`/unspoken/${section.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && navigate(`/unspoken/${section.id}`)}
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
