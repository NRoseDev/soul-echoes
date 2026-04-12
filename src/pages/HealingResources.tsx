import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Wind, Sparkles, Heart, Droplet, Hexagon, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

const resources = [
  {
    title: "Connect to a healer",
    description: "Find a practitioner for spiritual guidance, trauma-informed care, or intuitive support.",
    tags: ["Free Tier", "Paid Tier"],
    icon: Heart,
  },
  {
    title: "Guided meditations",
    description: "Calming audio journeys for grounding, release, and inner peace.",
    tags: ["Free Tier", "Paid Tier"],
    icon: Sparkles,
  },
  {
    title: "Guided breathwork",
    description: "Breath practices designed to soothe the nervous system and shift emotional charge.",
    tags: ["Free Tier", "Paid Tier"],
    icon: Wind,
  },
  {
    title: "Books",
    description: "Curated reading for healing, grief, boundaries, and self-discovery.",
    tags: ["Free Tier", "Paid Tier"],
    icon: BookOpen,
  },
  {
    title: "Essential oils",
    description: "Plant-powered scents to calm, uplift, and support emotional balance.",
    tags: ["Free Tier", "Paid Tier"],
    icon: Droplet,
  },
  {
    title: "Crystals",
    description: "Energy-supporting crystals for grounding, courage, and heart care.",
    tags: ["Free Tier", "Paid Tier"],
    icon: Hexagon,
  },
  {
    title: "Other healing tools",
    description: "Access rituals, journals, sound bowls, and supportive self-care practices.",
    tags: ["Free Tier", "Paid Tier"],
    icon: Wrench,
  },
];

export default function HealingResources() {
  return (
    <div className="min-h-full bg-gradient-to-br from-purple-900 via-violet-900 to-sky-700 text-white px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-6xl space-y-8"
      >
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-violet-200">Healing Resources</p>
          <h1 className="mt-3 text-4xl font-display font-bold text-white">Tools, practices, and support for your healing journey</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-violet-100">
            Explore guided offerings, support people, and practical tools. Everything is designed to help you move gently, safely, and with more ease.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <a href="/practitioner/signup" className="inline-flex items-center gap-2">
                Connect to a healer <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="secondary" asChild>
              <a href="/breathe" className="inline-flex items-center gap-2">
                Try a practice <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {resources.map((resource) => {
            const Icon = resource.icon;
            return (
              <div key={resource.title} className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-lg shadow-black/10 backdrop-blur-xl">
                <div className="flex items-center gap-4">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div>
                    <h2 className="text-xl font-semibold text-white">{resource.title}</h2>
                    <p className="mt-1 text-sm text-violet-100">{resource.description}</p>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {resource.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/80">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
