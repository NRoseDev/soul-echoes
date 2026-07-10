import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, Brain, Sparkles, MessageCircle, Users, Plus, Send,
  Activity, Flower2, Shield, Search, Hash, ArrowRight,
  Lock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import HealingJourneys from "@/components/HealingJourneys";
import communityIcon from "@/assets/community-icon.png";

type CircleId = "physical" | "mental" | "spiritual" | "energy";
type SectionId = "circles" | "stories" | "journeys" | "guidelines";

interface Circle {
  id: CircleId;
  label: string;
  tagline: string;
  desc: string;
  icon: React.ElementType;
  hue: "rose" | "violet" | "amber" | "emerald";
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

const CIRCLES: Circle[] = [
  {
    id: "physical",
    label: "Physical Healing",
    tagline: "Bodies that ache, bodies that remember",
    desc: "Chronic illness, pain, disability, recovery, nervous system, sleep, energy, food, movement.",
    icon: Activity,
    hue: "rose",
    topics: ["Chronic Pain", "Fatigue", "Sleep", "Disability", "Recovery", "Nervous System", "Food & Body", "Movement", "Gut Health", "Hormonal Balance", "Stress Response"],
  },
  {
    id: "mental",
    label: "Mental & Emotional",
    tagline: "Minds that won't quiet, hearts that hold too much",
    desc: "Anxiety, depression, trauma, grief, neurodivergence, relationships, identity, burnout, inner child.",
    icon: Brain,
    hue: "violet",
    topics: ["Anxiety", "Depression", "Trauma & PTSD", "Grief", "Neurodivergent", "Relationships", "Identity", "Burnout", "Inner Child", "Self-Worth", "Emotional Regulation"],
  },
  {
    id: "spiritual",
    label: "Spiritual Awakening",
    tagline: "Souls returning home",
    desc: "Awakening, dark night, faith shifts, ancestral healing, mysticism, prayer, signs, ceremony.",
    icon: Flower2,
    hue: "amber",
    topics: ["Awakening", "Dark Night", "Faith Shift", "Ancestors", "Prayer", "Signs", "Mysticism", "Ceremony", "Ritual", "Synchronicity", "Higher Self"],
  },
  {
    id: "energy",
    label: "Energy & Spirit",
    tagline: "Beyond the veil, within the flow",
    desc: "Chakras, aura, reiki, intuition, psychic abilities, mediumship, manifestation, cosmic connection, sacred geometry.",
    icon: Sparkles,
    hue: "emerald",
    topics: ["Chakras", "Aura", "Reiki", "Intuition", "Psychic", "Mediumship", "Manifestation", "Cosmic", "Sacred Geometry", "Energetic Boundaries", "Grounding"],
  },
];

const SEED_STORIES: Story[] = [
  { id: "s1", circle: "physical", author: "Maya R.", initial: "M", title: "Fibromyalgia flare — anyone else feeling the weather shift?", body: "Five days in. Trying gentle yin, magnesium, and warm baths. What's helping you right now?", hearts: 24, replies: 7, tag: "Chronic Pain", timeAgo: "2h" },
  { id: "s2", circle: "mental", author: "James O.", initial: "J", title: "I made it through a panic attack without leaving the room.", body: "Six months ago I would've run. Today I breathed, counted, and stayed. Small win — but it's mine.", hearts: 58, replies: 14, tag: "Anxiety", timeAgo: "5h" },
  { id: "s3", circle: "spiritual", author: "Sadé M.", initial: "S", title: "Dark night of the soul — month 4. Still here.", body: "Everything I believed has cracked open. It's terrifying. But I keep showing up. Anyone walked this path before?", hearts: 41, replies: 19, tag: "Dark Night", timeAgo: "8h" },
  { id: "s4", circle: "physical", author: "Lena V.", initial: "L", title: "Newly diagnosed with EDS. Looking for others who get it.", body: "Just got the diagnosis after years of being told it's anxiety. Both relieved and overwhelmed.", hearts: 32, replies: 11, tag: "Disability", timeAgo: "1d" },
  { id: "s5", circle: "mental", author: "Kwame A.", initial: "K", title: "Therapist said grief isn't linear. I'm learning what that means.", body: "Lost my dad last spring. Some days I'm functional, some I can't get out of bed. Both are okay, apparently.", hearts: 67, replies: 22, tag: "Grief", timeAgo: "1d" },
  { id: "s6", circle: "spiritual", author: "Rosa E.", initial: "R", title: "Started praying for my ancestors. Something shifted.", body: "I lit a candle, called their names, and asked for guidance. The weight I've carried for years felt lighter.", hearts: 53, replies: 16, tag: "Ancestors", timeAgo: "2d" },
];

const HUE_STYLES = {
  rose:   { text: "text-rose-300",   bg: "bg-rose-500/15",   border: "border-rose-400/40",   glow: "shadow-[0_0_24px_rgba(244,114,182,0.35)]", chip: "bg-rose-500/15 text-rose-200 border-rose-400/30" },
  violet: { text: "text-violet-300", bg: "bg-violet-500/15", border: "border-violet-400/40", glow: "shadow-[0_0_24px_rgba(167,139,250,0.35)]", chip: "bg-violet-500/15 text-violet-200 border-violet-400/30" },
  amber:  { text: "text-amber-300",  bg: "bg-amber-500/15",  border: "border-amber-400/40", glow: "shadow-[0_0_24px_rgba(251,191,36,0.35)]",  chip: "bg-amber-500/15 text-amber-200 border-amber-400/30" },
  emerald: { text: "text-emerald-300", bg: "bg-emerald-500/15", border: "border-emerald-400/40", glow: "shadow-[0_0_24px_rgba(52,211,153,0.35)]", chip: "bg-emerald-500/15 text-emerald-200 border-emerald-400/30" },
} as const;

const SECTION_TABS = [
  { id: "circles",    label: "Healing Circles",   icon: Users },
  { id: "stories",    label: "Stories & Support", icon: MessageCircle },
  { id: "journeys",   label: "Healing Journeys",  icon: Sparkles },
  { id: "guidelines", label: "Community Care",    icon: Shield },
] as const;

const GUIDELINES = [
  { title: "Confidentiality", desc: "What is shared in the circle stays in the circle. Respect the privacy and sacred stories of every seeker.", icon: Lock },
  { title: "Witness, Don't Fix", desc: "We are here to hold space, not to solve. Offer your presence, empathy, and 'I feel' statements before any advice.", icon: Heart },
  { title: "Content Notes", desc: "Use [CN] for heavy topics (trauma, loss, graphic detail) so others can choose when they are resourced enough to engage.", icon: Hash },
  { title: "No Diagnosing", desc: "We are peers walking the same path, not practitioners. Speak from your own lived experience, not from a place of authority.", icon: Shield },
  { title: "Crisis Routing", desc: "If you are in immediate danger or feeling unsafe, please visit the Portal → Crisis Counselor immediately. We are here to support, but we are not a crisis service.", icon: Activity, crisis: true },
];

export default function CommunityRoom() {
  const navigate = useNavigate();
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
    const isHearted = heartedIds.has(id);
    const next = new Set(heartedIds);
    if (isHearted) next.delete(id); else next.add(id);
    setHeartedIds(next);
    setStories((ss) => ss.map((s) => s.id === id ? { ...s, hearts: s.hearts + (isHearted ? -1 : 1) } : s));
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
      {/* Header */}
      <div className="px-4 pt-5 pb-3 shrink-0">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-white/[0.06] border border-white/15 shadow-[0_0_24px_rgba(167,139,250,0.4)]">
            <img src={communityIcon} alt="Community" className="w-full h-full object-cover" loading="eager" decoding="async" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold bg-gradient-to-r from-rose-300 via-violet-300 to-amber-300 bg-clip-text text-transparent leading-tight">
              Community
            </h1>
            <p className="text-xs text-foreground/60">You are not alone — heal alongside others walking the same path</p>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
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

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">

          {/* CIRCLES */}
          {activeSection === "circles" && (
            <motion.div key="circles" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 space-y-4">

              <div className="rounded-2xl bg-gradient-to-r from-rose-500/10 via-violet-500/10 to-amber-500/10 border border-white/10 p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-violet-300" />
                  <p className="text-sm font-semibold text-foreground">Four circles of healing</p>
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
                    <motion.div key={circle.id} layout className={`rounded-2xl border ${styles.border} ${styles.bg} overflow-hidden`}>
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
                        <span className="text-xs text-foreground/50 shrink-0">
                          {circleCount} {circleCount === 1 ? "story" : "stories"}
                        </span>
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
                                    <span key={t} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border ${styles.chip}`}>
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
                                  className={`flex-1 rounded-xl border ${styles.border} ${styles.text} bg-transparent hover:bg-white/5`}
                                  onClick={() => { setStoryFilter(circle.id); setActiveSection("stories"); }}
                                >
                                  <MessageCircle className="h-4 w-4 mr-1.5" />
                                  Read stories
                                </Button>
                                <Button
                                  size="sm"
                                  className={`flex-1 rounded-xl border-0 ${styles.bg} ${styles.text} hover:opacity-90`}
                                  onClick={() => { setComposeCircle(circle.id); setComposeOpen(true); }}
                                >
                                  <Plus className="h-4 w-4 mr-1.5" />
                                  Share yours
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STORIES */}
          {activeSection === "stories" && (
            <motion.div key="stories" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 space-y-4">

              {/* Filter */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {(["all", ...CIRCLES.map((c) => c.id)] as const).map((id) => {
                  const active = storyFilter === id;
                  const label = id === "all" ? "All Circles" : CIRCLES.find((c) => c.id === id)!.label;
                  return (
                    <button
                      key={id}
                      onClick={() => setStoryFilter(id as CircleId | "all")}
                      className={`shrink-0 px-3 py-1.5 rounded-xl border text-xs transition-all ${
                        active
                          ? "bg-violet-500/20 border-violet-400/50 text-violet-200"
                          : "bg-white/[0.03] border-white/10 text-foreground/60 hover:border-violet-400/20"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* Search + compose */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
                  <Input
                    placeholder="Search stories, tags, topics…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 h-9 rounded-xl bg-white/[0.04] border-white/10 text-sm"
                  />
                </div>
                <Button
                  size="sm"
                  className="h-9 rounded-xl bg-gradient-to-r from-rose-500/80 via-violet-500/80 to-amber-500/80 hover:opacity-90 border-0 text-white"
                  onClick={() => setComposeOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </div>

              {/* Story list */}
              <div className="space-y-3">
                {filteredStories.length === 0 && (
                  <div className="text-center py-12 space-y-2">
                    <MessageCircle className="h-10 w-10 text-foreground/20 mx-auto" />
                    <p className="text-sm text-foreground/60">No stories match yet.</p>
                    <p className="text-xs text-foreground/40">Be the first to share.</p>
                  </div>
                )}
                {filteredStories.map((story) => {
                  const circle = CIRCLES.find((c) => c.id === story.circle)!;
                  const styles = HUE_STYLES[circle.hue];
                  const isHearted = heartedIds.has(story.id);
                  return (
                    <motion.article
                      key={story.id}
                      layout
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 space-y-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`shrink-0 w-9 h-9 rounded-full ${styles.bg} ${styles.text} border ${styles.border} flex items-center justify-center text-sm font-bold`}>
                          {story.initial}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">{story.author}</p>
                          <p className="text-[11px] text-foreground/50">{circle.label} · {story.timeAgo}</p>
                        </div>
                        <span className={`shrink-0 text-[10px] px-2 py-1 rounded-full border ${styles.chip}`}>
                          <Hash className="h-2.5 w-2.5 inline mr-0.5" />{story.tag}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-display text-base font-semibold text-foreground leading-snug">{story.title}</h3>
                        <p className="text-sm text-foreground/75 leading-relaxed">{story.body}</p>
                      </div>

                      <div className="flex items-center gap-4 pt-1">
                        <button
                          onClick={() => toggleHeart(story.id)}
                          className={`flex items-center gap-1.5 text-xs transition-colors ${isHearted ? "text-rose-300" : "text-foreground/50 hover:text-rose-300"}`}
                          aria-label={isHearted ? "Remove heart" : "Send heart"}
                        >
                          <Heart className={`h-4 w-4 ${isHearted ? "fill-rose-300" : ""}`} />
                          {story.hearts}
                        </button>
                        <button
                          onClick={() => showToast("Replies are coming soon — thank you for showing up")}
                          className="flex items-center gap-1.5 text-xs text-foreground/50 hover:text-violet-300 transition-colors"
                        >
                          <MessageCircle className="h-4 w-4" />
                          {story.replies}
                        </button>
                        <button
                          onClick={() => showToast("Sending care 💜")}
                          className="ml-auto flex items-center gap-1.5 text-xs text-foreground/50 hover:text-amber-300 transition-colors"
                        >
                          <Send className="h-3.5 w-3.5" />
                          Send care
                        </button>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* JOURNEYS */}
          {activeSection === "journeys" && (
            <motion.div key="journeys" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
              <HealingJourneys onBack={() => setActiveSection("circles")} />
            </motion.div>
          )}

          {/* GUIDELINES */}
          {activeSection === "guidelines" && (
            <motion.div key="guidelines" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 space-y-4">
              <div className="rounded-2xl bg-gradient-to-r from-rose-500/10 via-violet-500/10 to-amber-500/10 border border-white/10 p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-violet-300" />
                  <p className="text-sm font-semibold text-foreground">How we hold this space</p>
                </div>
                <p className="text-xs text-foreground/70 leading-relaxed">
                  Community only works when everyone is safe. These aren't rules to police you — they're promises we make to each other.
                </p>
              </div>

              <div className="space-y-3">
                {GUIDELINES.map((g, i) => (
                  <div key={i} className={`rounded-2xl border p-4 space-y-1.5 transition-all ${g.crisis ? 'bg-rose-500/10 border-rose-400/30 shadow-[0_0_15px_rgba(244,63,94,0.1)]' : 'bg-white/[0.04] border-white/10'}`}>
                    <div className="flex items-center gap-2.5">
                      <g.icon className={`h-4 w-4 ${g.crisis ? 'text-rose-300' : 'text-violet-300'}`} />
                      <p className={`text-sm font-bold ${g.crisis ? 'text-rose-200' : 'text-foreground'}`}>{g.title}</p>
                    </div>
                    <p className="text-xs text-foreground/70 leading-relaxed pl-6.5">{g.desc}</p>
                    {g.crisis && (
                      <div className="pl-6.5 pt-1">
                        <Button 
                          variant="link" 
                          className="p-0 h-auto text-rose-300 text-[11px] font-bold hover:text-rose-200 underline underline-offset-2"
                          onClick={() => navigate("/shop")}
                        >
                          Go to Crisis Counselor →
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-center text-foreground/50 italic pt-2">
                Soul Echoes Community is peer support, not therapy. Be gentle with yourself and each other.
              </p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Compose modal */}
      <AnimatePresence>
        {composeOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
            onClick={() => setComposeOpen(false)}
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 p-5 space-y-4 shadow-2xl"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-violet-300" />
                <h3 className="font-display text-lg font-bold text-foreground">Share your story</h3>
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-wider text-foreground/50 mb-2">Which circle?</p>
                <div className="grid grid-cols-3 gap-2">
                  {CIRCLES.map((c) => {
                    const styles = HUE_STYLES[c.hue];
                    const active = composeCircle === c.id;
                    const Icon = c.icon;
                    return (
                      <button
                        key={c.id}
                        onClick={() => setComposeCircle(c.id)}
                        className={`flex flex-col items-center gap-1 p-3 rounded-2xl border transition-all ${
                          active ? `${styles.bg} ${styles.border} ${styles.text}` : "bg-white/[0.03] border-white/10 text-foreground/60"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="text-[11px] font-medium leading-tight text-center">{c.label.split(" ")[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Input
                  placeholder="Title — what is this about?"
                  value={composeTitle}
                  onChange={(e) => setComposeTitle(e.target.value)}
                  className="rounded-xl bg-white/[0.04] border-white/10"
                  maxLength={120}
                />
                <Textarea
                  placeholder="Share as much or as little as feels right. The circle is listening."
                  value={composeBody}
                  onChange={(e) => setComposeBody(e.target.value)}
                  className="rounded-xl bg-white/[0.04] border-white/10 min-h-[120px] resize-none"
                  maxLength={1200}
                />
                <p className="text-[10px] text-foreground/40 text-right">{composeBody.length}/1200</p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl border-white/15 bg-transparent text-foreground/70"
                  onClick={() => setComposeOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 rounded-xl bg-gradient-to-r from-rose-500 via-violet-500 to-amber-500 hover:opacity-90 border-0 text-white"
                  onClick={submitStory}
                >
                  Share <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-violet-600/90 backdrop-blur-sm text-white text-sm font-medium shadow-lg max-w-[90vw] text-center"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
