import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, Brain, Sparkles, MessageCircle, Users, Plus, Send, Compass,
  Activity, Flower2, Shield, Search, Hash, ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import HealingJourneys from "@/components/HealingJourneys";
import communityIcon from "@/assets/community-icon.jpg.asset.json";

/* ─── Types ────────────────────────────────────────────────────────────── */
type CircleId = "physical" | "mental" | "spiritual";
type SectionId = "circles" | "journeys" | "stories" | "guidelines";

interface Circle {
  id: CircleId;
  label: string;
  tagline: string;
  desc: string;
  icon: React.ElementType;
  /** Tailwind utility — used in templated class names below */
  hue: "rose" | "violet" | "amber";
  topics: string[];
}

interface Story {
  id: string;
  circle: CircleId;
  author: string;
  initial: string;
  title: string;
  body: string;
  hearts: number;
  replies: number;
  tag: string;
  timeAgo: string;
}

/* ─── Data ─────────────────────────────────────────────────────────────── */
const CIRCLES: Circle[] = [
  {
    id: "physical",
    label: "Physical Healing",
    tagline: "Bodies that ache, bodies that remember",
    desc: "Chronic illness, pain, disability, recovery, nervous system, sleep, energy, food, movement. Share what your body carries.",
    icon: Activity,
    hue: "rose",
    topics: ["Chronic Pain", "Fatigue", "Sleep", "Disability", "Recovery", "Nervous System", "Food & Body", "Movement"],
  },
  {
    id: "mental",
    label: "Mental & Emotional",
    tagline: "Minds that won't quiet, hearts that hold too much",
    desc: "Anxiety, depression, trauma, grief, neurodivergence, relationships, identity, burnout, healing the inner child.",
    icon: Brain,
    hue: "violet",
    topics: ["Anxiety", "Depression", "Trauma & PTSD", "Grief", "Neurodivergent", "Relationships", "Inner Child", "Burnout"],
  },
  {
    id: "spiritual",
    label: "Spiritual Awakening",
    tagline: "Souls returning home",
    desc: "Awakening, dark night, faith shifts, ancestral healing, mysticism, prayer, signs & synchronicities, spiritual community.",
    icon: Flower2,
    hue: "amber",
    topics: ["Awakening", "Dark Night", "Faith Shift", "Ancestors", "Prayer", "Signs", "Mysticism", "Ceremony"],
  },
];

const SEED_STORIES: Story[] = [
  {
    id: "s1", circle: "physical", author: "Maya R.", initial: "M",
    title: "Fibromyalgia flare — anyone else feeling the weather shift?",
    body: "Five days in. Trying gentle yin, magnesium, and warm baths. What's helping you right now?",
    hearts: 24, replies: 7, tag: "Chronic Pain", timeAgo: "2h",
  },
  {
    id: "s2", circle: "mental", author: "James O.", initial: "J",
    title: "I made it through a panic attack without leaving the room.",
    body: "Six months ago I would've run. Today I breathed, counted, and stayed. Small win — but it's mine.",
    hearts: 58, replies: 14, tag: "Anxiety", timeAgo: "5h",
  },
  {
    id: "s3", circle: "spiritual", author: "Sadé M.", initial: "S",
    title: "Dark night of the soul — month 4. Still here.",
    body: "Everything I believed has cracked open. It's terrifying. But I keep showing up. Anyone walked this path before?",
    hearts: 41, replies: 19, tag: "Dark Night", timeAgo: "8h",
  },
  {
    id: "s4", circle: "physical", author: "Lena V.", initial: "L",
    title: "Newly diagnosed with EDS. Looking for others who get it.",
    body: "Just got the diagnosis after years of being told it's anxiety. Both relieved and overwhelmed.",
    hearts: 32, replies: 11, tag: "Disability", timeAgo: "1d",
  },
  {
    id: "s5", circle: "mental", author: "Kwame A.", initial: "K",
    title: "Therapist said grief isn't linear. I'm learning what that means.",
    body: "Lost my dad last spring. Some days I'm functional, some I can't get out of bed. Both are okay, apparently.",
    hearts: 67, replies: 22, tag: "Grief", timeAgo: "1d",
  },
  {
    id: "s6", circle: "spiritual", author: "Rosa E.", initial: "R",
    title: "Started praying for my ancestors. Something shifted.",
    body: "I lit a candle, called their names, and asked for guidance. The weight I've carried for years felt lighter.",
    hearts: 53, replies: 16, tag: "Ancestors", timeAgo: "2d",
  },
];

/* Direct class maps — Tailwind needs literal class strings to include them */
const HUE_STYLES = {
  rose:   { text: "text-rose-300",   bg: "bg-rose-500/15",   border: "border-rose-400/40",   glow: "shadow-[0_0_24px_rgba(244,114,182,0.35)]" },
  violet: { text: "text-violet-300", bg: "bg-violet-500/15", border: "border-violet-400/40", glow: "shadow-[0_0_24px_rgba(167,139,250,0.35)]" },
  amber:  { text: "text-amber-300",  bg: "bg-amber-500/15",  border: "border-amber-400/40", glow: "shadow-[0_0_24px_rgba(251,191,36,0.35)]"  },
} as const;

const SECTION_TABS = [
  { id: "circles",     label: "Healing Circles",  icon: Users      },
  { id: "stories",     label: "Stories & Support", icon: MessageCircle },
  { id: "journeys",    label: "Healing Journeys",  icon: Sparkles   },
  { id: "guidelines",  label: "Community Care",    icon: Shield     },
] as const;

/* ─── Component ────────────────────────────────────────────────────────── */
export default function CommunityRoom() {
  const [activeSection, setActiveSection] = useState<SectionId>("circles");
  const [openCircle, setOpenCircle] = useState<CircleId | null>(null);
  const [storyFilter, setStoryFilter] = useState<CircleId | "all">("all");
  const [search, setSearch] = useState("");
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeCircle, setComposeCircle] = useState<CircleId>("physical");
  const [composeTitle, setComposeTitle] = useState("");
  const [composeBody, setComposeBody] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [stories, setStories] = useState<Story[]>(SEED_STORIES);
  const [heartedIds, setHeartedIds] = useState<Set<string>>(new Set());

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  const filteredStories = stories.filter((s) => {
    const matchCircle = storyFilter === "all" || s.circle === storyFilter;
    const q = search.trim().toLowerCase();
    const matchSearch = !q || s.title.toLowerCase().includes(q) || s.body.toLowerCase().includes(q) || s.tag.toLowerCase().includes(q);
    return matchCircle && matchSearch;
  });

  const toggleHeart = (id: string) => {
    setHeartedIds((prev) => {
      const next = new Set(prev);
      const isHearted = next.has(id);
      if (isHearted) next.delete(id); else next.add(id);
      setStories((ss) => ss.map((s) => s.id === id ? { ...s, hearts: s.hearts + (isHearted ? -1 : 1) } : s));
      return next;
    });
  };

  const submitStory = () => {
    if (!composeTitle.trim() || !composeBody.trim()) {
      showToast("Add a title and a few words to share");
      return;
    }
    const circle = CIRCLES.find((c) => c.id === composeCircle)!;
    const newStory: Story = {
      id: `local-${Date.now()}`,
      circle: composeCircle,
      author: "You",
      initial: "Y",
      title: composeTitle.trim(),
      body: composeBody.trim(),
      hearts: 0,
      replies: 0,
      tag: circle.topics[0],
      timeAgo: "now",
    };
    setStories((s) => [newStory, ...s]);
    setComposeTitle("");
    setComposeBody("");
    setComposeOpen(false);
    setActiveSection("stories");
    setStoryFilter(composeCircle);
    showToast("Your story is shared — the circle is holding you");
  };

  return (
    <div
      className="flex-1 flex flex-col overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 25% 15%, hsl(0,0%,4%) 0%, hsl(280,20%,12%) 40%, hsl(20,35%,18%) 100%)",
      }}
    >
      {/* ── Header ── */}
      <div className="px-4 pt-5 pb-3 shrink-0">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-[0_0_24px_rgba(251,113,133,0.45)] bg-gradient-to-br from-rose-500/20 via-violet-500/20 to-amber-500/20 p-1.5 flex items-center justify-center">
            <img
              src={communityIcon.url}
              alt="Community"
              className="w-full h-full object-contain"
              loading="eager"
              decoding="async"
            />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold bg-gradient-to-r from-rose-300 via-violet-300 to-amber-300 bg-clip-text text-transparent leading-tight">
              Community
            </h1>
            <p className="text-xs text-foreground/60">You are not alone — heal alongside others walking the same path</p>
          </div>
        </motion.div>
      </div>

      {/* ── Section Tabs ── */}
      <div className="px-4 pt-1 pb-2 shrink-0">
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {SECTION_TABS.map((tab) => {
            const active = activeSection === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as SectionId)}
                className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-medium transition-all ${
                  active
                    ? "bg-violet-500/20 border-violet-400/50 text-violet-200 shadow-[0_0_12px_rgba(167,139,250,0.3)]"
                    : "bg-white/[0.04] border-white/10 text-foreground/60 hover:border-violet-400/30 hover:text-violet-300/80"
                }`}
                aria-selected={active}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">

          {/* ════ CIRCLES ════ */}
          {activeSection === "circles" && (
            <motion.div key="circles" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 space-y-4">

              <div className="rounded-2xl bg-gradient-to-r from-rose-500/10 via-violet-500/10 to-amber-500/10 border border-white/10 p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-violet-300" />
                  <p className="text-sm font-semibold text-foreground">Three circles of healing</p>
                </div>
                <p className="text-xs text-foreground/70 leading-relaxed">
                  Healing is never just one thing. Choose the circle that calls to you — body, mind, or spirit — and meet others walking the same road.
                </p>
              </div>

              <div className="space-y-3">
                {CIRCLES.map((circle) => {
                  const styles = HUE_STYLES[circle.hue];
                  const Icon = circle.icon;
                  const open = openCircle === circle.id;
                  const circleCount = stories.filter((s) => s.circle === circle.id).length;
                  return (
                    <motion.div
                      key={circle.id}
                      layout
                      className={`rounded-2xl border ${styles.border} ${styles.bg} overflow-hidden`}
                    >
                      <button
                        onClick={() => setOpenCircle(open ? null : circle.id)}
                        className="w-full flex items-center gap-3 p-4 text-left"
                        aria-expanded={open}
                      >
                        <div className={`shrink-0 w-12 h-12 rounded-2xl ${styles.bg} border ${styles.border} flex items-center justify-center ${styles.glow}`}>
                          <Icon className={`h-6 w-6 ${styles.text}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-base font-bold ${styles.text}`}>{circle.label}</p>
                          <p className="text-xs text-foreground/70 italic">{circle.tagline}</p>
                        </div>
                        <span className="text-xs text-foreground/50 shrink-0">{circleCount} {circleCount === 1 ? "story" : "stories"}</span>
                      </button>

                      <AnimatePresence>
                        {open && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.22 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 space-y-3 border-t border-white/10">
                              <p className="text-sm text-foreground/80 pt-3 leading-relaxed">{circle.desc}</p>

                              <div>
                                <p className="text-[11px] uppercase tracking-wider text-foreground/50 mb-2">Topics in this circle</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {circle.topics.map((t) => (
                                    <span key={t} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium ${styles.bg} ${styles.text} border ${styles.border}`}>
                                      <Hash className="h-2.5 w-2.5" />
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div className="flex gap-2 pt-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className={`flex-1 rounded-xl border ${styles.border} ${styles.text} hover:${