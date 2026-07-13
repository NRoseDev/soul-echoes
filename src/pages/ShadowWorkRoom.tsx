import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Baby,
  Moon,
  Brain,
  Sparkles,
  GitBranch,
  Zap,
  Heart,
  Infinity,
  HeartHandshake,
  Users,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LevelPath } from "@/components/levels/LevelPath";
import { Button } from "@/components/ui/button";

const modules = [
  {
    id: "inner-child-healing",
    title: "Inner Child Healing",
    description: "Reconnect with your younger self. Offer the love, safety, and reassurance you needed most.",
    icon: Baby,
    colorClass: "text-violet-400",
  },
  {
    id: "meeting-your-shadow",
    title: "Meeting Your Shadow",
    description: "Gently face the parts of yourself you have hidden, judged, or exiled. Growth lives here.",
    icon: Moon,
    colorClass: "text-indigo-400",
  },
  {
    id: "limiting-beliefs",
    title: "Limiting Beliefs",
    description: "Uncover the stories that hold you back and rewrite them with truth and compassion.",
    icon: Brain,
    colorClass: "text-blue-400",
  },
  {
    id: "authentic-self",
    title: "Authentic Self",
    description: "Return to who you were before the world shaped you. Reclaim your truest expression.",
    icon: Sparkles,
    colorClass: "text-sky-400",
  },
  {
    id: "generational-patterns",
    title: "Generational Patterns",
    description: "Explore what has been inherited through your lineage and choose what to pass forward.",
    icon: GitBranch,
    colorClass: "text-purple-400",
  },
  {
    id: "emotional-triggers",
    title: "Emotional Triggers",
    description: "Trace your reactions to their roots. Understand and soften what keeps taking over.",
    icon: Zap,
    colorClass: "text-fuchsia-400",
  },
  {
    id: "self-forgiveness",
    title: "Self Forgiveness",
    description: "Release the weight of guilt and shame. You deserve the mercy you give to others.",
    icon: Heart,
    colorClass: "text-pink-400",
  },
  {
    id: "integration-and-wholeness",
    title: "Integration and Wholeness",
    description: "Bring all your parts into harmony. This is where healing becomes a way of being.",
    icon: Infinity,
    colorClass: "text-violet-300",
  },
];

export default function ShadowWorkRoom() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 overflow-y-auto p-4 pb-32" style={{ background: "radial-gradient(ellipse at 20% 20%, hsl(48,80%,5%) 0%, hsl(48,90%,12%) 45%, hsl(48,60%,25%) 100%)" }}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2 text-center">Shadow Work</h1>
        <p className="text-muted-foreground text-center mb-6">
          Gently explore the parts of yourself you have hidden. Growth lives in the shadows.
        </p>
      </motion.div>

      <div className="max-w-6xl mx-auto mb-6">
        <LevelPath roomId="shadow-work" />
      </div>

      {/* What is Shadow Work */}

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="max-w-6xl mx-auto mb-5 bg-card/80 backdrop-blur-sm border border-border rounded-3xl p-5 space-y-3"
      >
        <h2 className="font-display text-lg font-bold text-foreground">What is Shadow Work?</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Shadow work is the practice of exploring the unconscious parts of yourself — the emotions, memories,
          and beliefs you have pushed into the dark to survive, to be loved, or to belong. These hidden fragments
          are not your enemy. They are unmet needs, untold truths, and unprocessed pain waiting for your attention.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Pioneered by psychologist Carl Jung, shadow work invites you to turn toward what you have turned away from.
          When you meet your shadow with honesty and compassion, you reclaim your wholeness. You stop reacting from
          old wounds and start responding from your true self. This is not about reliving pain — it is about freeing
          yourself from it.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Move through these eight modules at your own pace. There is no rush. Each prompt is an invitation, not a demand.
          You are safe here.
        </p>
      </motion.div>

      {/* Safety Disclaimer */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="max-w-6xl mx-auto mb-6 bg-muted/70 border border-border/80 rounded-3xl p-4 space-y-3"
      >
        <p className="text-sm leading-relaxed text-muted-foreground">
          Shadow work can surface deep emotions, old grief, and unexpected reactions. If you feel overwhelmed at any
          point, stop and reach out. Intercessors and healers are available to hold space for you right now.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            className="w-full bg-white/10 text-foreground border border-border hover:bg-white/20"
            onClick={() => navigate("/community")}
          >
            <HeartHandshake className="h-4 w-4 mr-2" />
            Talk to an Intercessor
          </Button>
          <Button
            className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground"
            onClick={() => navigate("/practitioner")}
          >
            <Users className="h-4 w-4 mr-2" />
            Connect to a Healer
          </Button>
        </div>
      </motion.div>

      {/* Module Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((mod, index) => {
          const Icon = mod.icon;
          return (
            <motion.div
              key={mod.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.15 + index * 0.05 }}
            >
              <Card
                className="cursor-pointer hover:border-primary/40 transition-colors bg-card/80 backdrop-blur-sm"
                onClick={() => navigate(`/shadow-work/${mod.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && navigate(`/shadow-work/${mod.id}`)}
              >
                <CardHeader className="flex items-start gap-3 p-4">
                  <div className={`flex-shrink-0 h-12 w-12 rounded-full bg-muted flex items-center justify-center ${mod.colorClass}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="text-base font-bold">{mod.title}</CardTitle>
                    <CardDescription className="text-xs mt-1 leading-relaxed">{mod.description}</CardDescription>
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
