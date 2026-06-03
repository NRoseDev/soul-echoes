import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Gem, Droplet, Volume2, Headphones, Users, Star, Bookmark,
  BookmarkCheck, Bell, BellOff, ChevronDown, ChevronUp, Heart, Check,
  CreditCard, Sliders, Gift, Globe2, ArrowRight, ShieldCheck, Zap,
  Wind, Sun, Flame, Music2, Sparkles, ShieldAlert, Phone, MessageSquare, ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import HealingJourneys from "@/components/HealingJourneys";

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface Product {
  id: string;
  title: string;
  desc: string;
  category: "books" | "crystals" | "oils" | "sound" | "meditations";
  icon: React.ElementType;
  accentColor: string;
  accentBg: string;
  basePrice: number;   // retail / suggested price
  minPrice: number;    // sliding scale floor
  maxPrice: number;    // sliding scale ceiling
}

interface Practitioner {
  id: string;
  name: string;
  specialty: string;
  tags: string[];
  emoji: string;
  bio: string;
  accentColor: string;
}

interface SavedItem {
  id: string;
  title: string;
  type: "product" | "practitioner";
  notifyWhenReady: boolean;
}

/* ─── Constants ──────────────────────────────────────────────────────────── */
const SAVED_KEY = "soul-echoes-portal-saved";

const PRODUCT_CATEGORIES = [
  { id: "all",         label: "All",              icon: Globe2     },
  { id: "books",       label: "Books",            icon: BookOpen   },
  { id: "crystals",    label: "Crystals",         icon: Gem        },
  { id: "oils",        label: "Essential Oils",   icon: Droplet    },
  { id: "sound",       label: "Sound Therapy",    icon: Volume2    },
  { id: "meditations", label: "Meditations",      icon: Headphones },
] as const;

const PRODUCTS: Product[] = [
  /* ── Books ── */
  {
    id: "body-keeps-score",
    title: "The Body Keeps the Score",
    desc: "Bessel van der Kolk's landmark guide to how trauma reshapes the body and mind, and the path toward healing.",
    category: "books", icon: BookOpen,
    accentColor: "text-amber-400", accentBg: "bg-amber-500/15",
    basePrice: 18.99, minPrice: 1, maxPrice: 25,
  },
  {
    id: "you-can-heal",
    title: "You Can Heal Your Life",
    desc: "Louise Hay on understanding the mental causes behind physical illness and building a life of self-love.",
    category: "books", icon: BookOpen,
    accentColor: "text-amber-400", accentBg: "bg-amber-500/15",
    basePrice: 14.99, minPrice: 1, maxPrice: 20,
  },
  {
    id: "power-of-now",
    title: "The Power of Now",
    desc: "Eckhart Tolle's guide to ending the tyranny of the thinking mind and finding peace in pure presence.",
    category: "books", icon: BookOpen,
    accentColor: "text-amber-400", accentBg: "bg-amber-500/15",
    basePrice: 16.99, minPrice: 1, maxPrice: 22,
  },
  {
    id: "waking-tiger",
    title: "Waking the Tiger",
    desc: "Peter Levine on the body's innate capacity to heal trauma through somatic experiencing.",
    category: "books", icon: BookOpen,
    accentColor: "text-amber-400", accentBg: "bg-amber-500/15",
    basePrice: 15.99, minPrice: 1, maxPrice: 21,
  },
  /* ── Crystals ── */
  {
    id: "rose-quartz-set",
    title: "Rose Quartz Heart Set",
    desc: "Ethically sourced rose quartz tumbles + heart palm stone. Promotes self-love, emotional healing, and calm.",
    category: "crystals", icon: Gem,
    accentColor: "text-rose-400", accentBg: "bg-rose-500/15",
    basePrice: 24.00, minPrice: 8, maxPrice: 35,
  },
  {
    id: "amethyst-cluster",
    title: "Amethyst Cluster",
    desc: "Natural amethyst cluster for stress relief, intuition, and peaceful sleep. Comes with care guide.",
    category: "crystals", icon: Gem,
    accentColor: "text-purple-400", accentBg: "bg-purple-500/15",
    basePrice: 32.00, minPrice: 10, maxPrice: 45,
  },
  {
    id: "black-tourmaline",
    title: "Black Tourmaline Protection Set",
    desc: "Raw black tourmaline + selenite wand for energetic protection and grounding. Ethically sourced.",
    category: "crystals", icon: Gem,
    accentColor: "text-slate-400", accentBg: "bg-slate-500/15",
    basePrice: 28.00, minPrice: 9, maxPrice: 40,
  },
  /* ── Essential Oils ── */
  {
    id: "trauma-release-blend",
    title: "Trauma Release Blend",
    desc: "Lavender, frankincense, and bergamot — a grounding blend crafted for nervous system regulation.",
    category: "oils", icon: Droplet,
    accentColor: "text-violet-400", accentBg: "bg-violet-500/15",
    basePrice: 22.00, minPrice: 7, maxPrice: 32,
  },
  {
    id: "heart-opening-blend",
    title: "Heart Opening Blend",
    desc: "Rose absolute, ylang ylang, and sandalwood to support grief, heartbreak, and emotional release.",
    category: "oils", icon: Droplet,
    accentColor: "text-pink-400", accentBg: "bg-pink-500/15",
    basePrice: 26.00, minPrice: 8, maxPrice: 36,
  },
  {
    id: "grounding-blend",
    title: "Grounding & Clarity Blend",
    desc: "Vetiver, cedarwood, and patchouli. Anchors anxiety and brings presence to an overwhelmed mind.",
    category: "oils", icon: Droplet,
    accentColor: "text-emerald-400", accentBg: "bg-emerald-500/15",
    basePrice: 19.00, minPrice: 6, maxPrice: 28,
  },
  /* ── Sound Therapy ── */
  {
    id: "singing-bowl-set",
    title: "7-Chakra Singing Bowl Set",
    desc: "Hand-hammered Tibetan bowls tuned to each chakra frequency. Includes mallet and cushions.",
    category: "sound", icon: Music2,
    accentColor: "text-teal-400", accentBg: "bg-teal-500/15",
    basePrice: 89.00, minPrice: 30, maxPrice: 120,
  },
  {
    id: "tuning-fork-set",
    title: "Solfeggio Tuning Fork Set",
    desc: "Six precision tuning forks at 396, 417, 528, 639, 741, 852 Hz. Activator mallet included.",
    category: "sound", icon: Volume2,
    accentColor: "text-teal-400", accentBg: "bg-teal-500/15",
    basePrice: 64.00, minPrice: 20, maxPrice: 85,
  },
  {
    id: "binaural-beats-pack",
    title: "Binaural Beats Healing Pack",
    desc: "12-track digital collection: theta waves for trauma processing, delta for deep sleep, alpha for calm.",
    category: "sound", icon: Headphones,
    accentColor: "text-sky-400", accentBg: "bg-sky-500/15",
    basePrice: 18.00, minPrice: 1, maxPrice: 25,
  },
  /* ── Meditations ── */
  {
    id: "somatic-series",
    title: "Somatic Healing Meditation Series",
    desc: "10-session guided series for releasing stored trauma from the body. Includes breathwork and body scans.",
    category: "meditations", icon: Headphones,
    accentColor: "text-sky-400", accentBg: "bg-sky-500/15",
    basePrice: 35.00, minPrice: 1, maxPrice: 50,
  },
  {
    id: "inner-child-meditations",
    title: "Inner Child Healing Meditations",
    desc: "8 guided sessions to reconnect with, comfort, and reparent your inner child. Safe and gentle.",
    category: "meditations", icon: Headphones,
    accentColor: "text-pink-400", accentBg: "bg-pink-500/15",
    basePrice: 28.00, minPrice: 1, maxPrice: 40,
  },
  {
    id: "grief-meditations",
    title: "Grief & Loss Meditation Pack",
    desc: "6 meditations for moving through grief without bypassing it. Written with trauma-informed care.",
    category: "meditations", icon: Headphones,
    accentColor: "text-indigo-400", accentBg: "bg-indigo-500/15",
    basePrice: 24.00, minPrice: 1, maxPrice: 35,
  },
];

const PRACTITIONERS: Practitioner[] = [
  {
    id: "breathwork-maya",
    name: "Maya R.",
    specialty: "Breathwork Teacher",
    tags: ["Trauma-Informed", "Online", "Sliding Scale"],
    emoji: "🌬️",
    bio: "Certified holotropic breathwork facilitator specializing in nervous system regulation and somatic trauma release. 8 years experience.",
    accentColor: "from-sky-500/20 to-teal-500/20",
  },
  {
    id: "meditation-james",
    name: "James O.",
    specialty: "Meditation Guide",
    tags: ["Mindfulness", "MBSR", "Grief Support"],
    emoji: "🧘",
    bio: "Trained in MBSR and Vipassana traditions. Leads one-on-one and group sessions for anxiety, grief, and burnout recovery.",
    accentColor: "from-violet-500/20 to-purple-500/20",
  },
  {
    id: "yoga-sade",
    name: "Sadé M.",
    specialty: "Yoga Teacher & Healer",
    tags: ["Trauma-Sensitive", "Restorative", "Donation-Based"],
    emoji: "🌿",
    bio: "Trauma-sensitive yoga teacher (500-RYT) offering restorative and yin practices for healing, rest, and body reconnection.",
    accentColor: "from-emerald-500/20 to-teal-500/20",
  },
  {
    id: "energy-lena",
    name: "Lena V.",
    specialty: "Energy Worker & Reiki Master",
    tags: ["Reiki", "Chakra Work", "Remote Sessions"],
    emoji: "✨",
    bio: "Reiki Master Teacher and intuitive energy worker. Offers distance sessions and in-person work focused on emotional clearing.",
    accentColor: "from-amber-500/20 to-yellow-500/20",
  },
  {
    id: "sound-kwame",
    name: "Kwame A.",
    specialty: "Sound Healer",
    tags: ["Crystal Bowls", "Gong Bath", "Group & 1:1"],
    emoji: "🔔",
    bio: "Certified sound healing practitioner using Tibetan bowls, crystal singing bowls, and gongs. Trained in Integrative Sound Healing.",
    accentColor: "from-teal-500/20 to-cyan-500/20",
  },
  {
    id: "shaman-rose",
    name: "Rosa E.",
    specialty: "Shamanic Practitioner",
    tags: ["Ancestral Healing", "Soul Retrieval", "Ceremony"],
    emoji: "🦅",
    bio: "Trained in traditional shamanic practices for over 15 years. Specialises in soul retrieval, ancestral healing, and ceremony.",
    accentColor: "from-orange-500/20 to-rose-500/20",
  },
  {
    id: "intercessor-faith",
    name: "Faith W.",
    specialty: "Intercessor & Spiritual Director",
    tags: ["Prayer", "Spiritual Direction", "Trauma & Faith"],
    emoji: "🕊️",
    bio: "Ordained minister and trained spiritual director offering intercessory prayer and spiritual companionship to those healing from trauma and crisis of faith.",
    accentColor: "from-indigo-500/20 to-violet-500/20",
  },
  {
    id: "vetted-healer-nadia",
    name: "Nadia L.",
    specialty: "Trauma-Informed Healer",
    tags: ["IFS", "Parts Work", "Energy Exchange"],
    emoji: "🌸",
    bio: "Trained in Internal Family Systems (IFS) and somatic practices. Offers parts work, nervous system support, and energy-exchange pricing.",
    accentColor: "from-pink-500/20 to-rose-500/20",
  },
];

const PAYMENT_METHODS = [
  { id: "sliding",   label: "Sliding Scale",       icon: Sliders,     desc: "Pay what you can within a suggested range",      color: "text-teal-400",   border: "border-teal-400/40",   bg: "bg-teal-500/10"   },
  { id: "energy",    label: "Energy Exchange",      icon: Zap,         desc: "Offer a skill, time, or service in return",      color: "text-amber-400",  border: "border-amber-400/40",  bg: "bg-amber-500/10"  },
  { id: "donation",  label: "Donation Based",       icon: Heart,       desc: "Give freely — any amount received with gratitude", color: "text-pink-400",   border: "border-pink-400/40",   bg: "bg-pink-500/10"   },
  { id: "forward",   label: "Pay It Forward",       icon: Gift,        desc: "Cover a session for someone who cannot afford it", color: "text-violet-400", border: "border-violet-400/40", bg: "bg-violet-500/10" },
  { id: "stripe",    label: "Card (Stripe)",         icon: CreditCard,  desc: "Visa, Mastercard, Amex — secure & encrypted",    color: "text-sky-400",    border: "border-sky-400/40",    bg: "bg-sky-500/10"    },
  { id: "paypal",    label: "PayPal",               icon: Globe2,      desc: "Pay via your PayPal account or guest checkout",   color: "text-blue-400",   border: "border-blue-400/40",   bg: "bg-blue-500/10"   },
  { id: "apple",     label: "Apple Pay",            icon: Wind,        desc: "One-tap payment on supported Apple devices",      color: "text-foreground", border: "border-white/20",       bg: "bg-white/5"       },
  { id: "google",    label: "Google Pay",           icon: Sun,         desc: "One-tap payment via Google Wallet",              color: "text-green-400",  border: "border-green-400/40",  bg: "bg-green-500/10"  },
  { id: "bnpl",      label: "Buy Now Pay Later",    icon: Flame,       desc: "Klarna or Afterpay — split into instalments",    color: "text-rose-400",   border: "border-rose-400/40",   bg: "bg-rose-500/10"   },
];

const SECTION_TABS = [
  { id: "products",       label: "Marketplace",          icon: Gem        },
  { id: "practitioners",  label: "Practitioner Connect", icon: Users      },
  { id: "crisis",         label: "Crisis Counselor",     icon: ShieldAlert },
  { id: "book",           label: "Book a Session",       icon: Star       },
  { id: "saved",          label: "Wait & Save",          icon: Bookmark   },
] as const;
type SectionId = typeof SECTION_TABS[number]["id"];

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function memberPrice(base: number) {
  return (base * 0.67).toFixed(2);
}

function loadSaved(): SavedItem[] {
  try { return JSON.parse(localStorage.getItem(SAVED_KEY) || "[]"); } catch { return []; }
}
function persistSaved(items: SavedItem[]) {
  localStorage.setItem(SAVED_KEY, JSON.stringify(items));
}

/* ─── Sub-components ─────────────────────────────────────────────────────── */
function ImpactBanner() {
  return (
    <div className="mx-4 mt-4 mb-1 rounded-2xl bg-gradient-to-r from-teal-500/20 to-emerald-500/20 border border-teal-400/30 px-4 py-3 flex flex-col sm:flex-row items-center gap-3">
      <div className="flex items-center gap-2 shrink-0">
        <Heart className="h-5 w-5 text-rose-400" />
        <span className="text-sm font-semibold text-foreground/90">3% of every sale</span>
        <span className="text-sm text-muted-foreground">supports</span>
        <span className="text-sm font-semibold text-teal-300">Rise Up Healing</span>
      </div>
      <div className="hidden sm:block w-px h-5 bg-white/10" />
      <div className="flex items-center gap-2">
        <Check className="h-4 w-4 text-teal-400 shrink-0" />
        <span className="text-sm text-foreground/80">
          You receive a <span className="font-bold text-teal-300">33% member discount</span> on all products
        </span>
      </div>
    </div>
  );
}

/* ─── Product Card ───────────────────────────────────────────────────────── */
function ProductCard({
  product, savedIds, onToggleSave, onAddToSession,
}: {
  product: Product;
  savedIds: Set<string>;
  onToggleSave: (id: string, title: string) => void;
  onAddToSession: (title: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [slideVal, setSlideVal] = useState(
    () => Math.round((product.minPrice + product.maxPrice) / 2)
  );
  const isSaved = savedIds.has(product.id);
  const Icon = product.icon;
  const memberDiscount = Number(memberPrice(product.basePrice));

  return (
    <motion.div
      layout
      className="rounded-2xl border border-white/10 bg-white/[0.04] overflow-hidden"
    >
      {/* Header row */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/[0.03] transition-colors"
        aria-expanded={expanded}
      >
        <div className={`shrink-0 w-10 h-10 rounded-xl ${product.accentBg} flex items-center justify-center`}>
          <Icon className={`h-5 w-5 ${product.accentColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground leading-tight">{product.title}</p>
          <p className="text-xs text-teal-300 mt-0.5">
            From <span className="font-bold">${product.minPrice}</span>
            {" "}· Member price <span className="font-bold">${memberDiscount}</span>
            <span className="text-muted-foreground ml-1">(was ${product.basePrice})</span>
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); onToggleSave(product.id, product.title); }}
            aria-label={isSaved ? "Remove from saved" : "Save for later"}
            className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            {isSaved
              ? <BookmarkCheck className="h-4 w-4 text-teal-400" />
              : <Bookmark className="h-4 w-4 text-muted-foreground" />}
          </button>
          {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4 border-t border-white/[0.06]">
              <p className="text-sm text-muted-foreground pt-3 leading-relaxed">{product.desc}</p>

              {/* Sliding scale */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-xs font-medium text-foreground/70 uppercase tracking-wide flex items-center gap-1.5">
                    <Sliders className="h-3 w-3" /> Pay What You Can
                  </p>
                  <span className="text-base font-bold text-teal-300">${slideVal}</span>
                </div>
                <Slider
                  value={[slideVal]}
                  onValueChange={([v]) => setSlideVal(v)}
                  min={product.minPrice}
                  max={product.maxPrice}
                  step={1}
                  aria-label="Choose your price"
                />
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>Min ${product.minPrice}</span>
                  <span className="text-teal-400/80">Suggested ${memberDiscount}</span>
                  <span>Max ${product.maxPrice}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => onAddToSession(product.title)}
                  className="flex-1 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 border-0 text-sm"
                >
                  Add to Cart — ${slideVal}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onToggleSave(product.id, product.title)}
                  className="rounded-xl border-white/20 text-xs"
                >
                  {isSaved ? "Saved" : "Save"}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Practitioner Card ──────────────────────────────────────────────────── */
function PractitionerCard({
  p, savedIds, onToggleSave, onBook,
}: {
  p: Practitioner;
  savedIds: Set<string>;
  onToggleSave: (id: string, title: string) => void;
  onBook: (name: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const isSaved = savedIds.has(p.id);

  return (
    <motion.div layout className="rounded-2xl border border-white/10 bg-white/[0.04] overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/[0.03] transition-colors"
        aria-expanded={expanded}
      >
        <div className={`shrink-0 w-11 h-11 rounded-2xl bg-gradient-to-br ${p.accentColor} flex items-center justify-center text-xl border border-white/10`}>
          {p.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-foreground">{p.name}</p>
            <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30">
              <ShieldCheck className="h-2.5 w-2.5" /> Vetted
            </span>
          </div>
          <p className="text-xs text-muted-foreground">{p.specialty}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); onToggleSave(p.id, p.name); }}
            aria-label={isSaved ? "Remove from saved" : "Save for later"}
            className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            {isSaved
              ? <BookmarkCheck className="h-4 w-4 text-teal-400" />
              : <Bookmark className="h-4 w-4 text-muted-foreground" />}
          </button>
          {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-white/[0.06]">
              <p className="text-sm text-muted-foreground pt-3 leading-relaxed">{p.bio}</p>
              <div className="flex flex-wrap gap-1.5">
                {p.tags.map((tag) => (
                  <span key={tag} className="text-[11px] px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/10 text-foreground/70">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-xs text-muted-foreground/60 italic">
                All practitioners have agreed to Soul Echoes values: trauma-informed care, confidentiality, inclusive access, and sliding scale availability.
              </p>
              <Button
                size="sm"
                onClick={() => onBook(p.name)}
                className="w-full rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 border-0"
              >
                Book with {p.name.split(" ")[0]} <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────────── */
export default function PortalRoom() {
  const [activeSection, setActiveSection] = useState<SectionId>("products");
  const [productCategory, setProductCategory] = useState("all");
  const [savedItems, setSavedItems] = useState<SavedItem[]>(loadSaved);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [bookedFor, setBookedFor] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const savedIds = new Set(savedItems.map((s) => s.id));

  useEffect(() => { persistSaved(savedItems); }, [savedItems]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const toggleSave = (id: string, title: string, type: "product" | "practitioner" = "product") => {
    setSavedItems((prev) => {
      const exists = prev.find((s) => s.id === id);
      if (exists) {
        showToast(`Removed "${title}" from saved`);
        return prev.filter((s) => s.id !== id);
      }
      showToast(`"${title}" saved — we'll notify you when you're ready`);
      return [...prev, { id, title, type, notifyWhenReady: false }];
    });
  };

  const toggleNotify = (id: string) => {
    setSavedItems((prev) =>
      prev.map((s) => s.id === id ? { ...s, notifyWhenReady: !s.notifyWhenReady } : s)
    );
  };

  const filteredProducts =
    productCategory === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === productCategory);

  return (
    <div
      className="flex-1 flex flex-col overflow-hidden"
      style={{ background: "radial-gradient(ellipse at 20% 20%, hsl(0,0%,4%) 0%, hsl(30,20%,12%) 45%, hsl(35,35%,22%) 100%)" }}
    >
      {/* ── Page Header ── */}
      <div className="px-4 pt-5 pb-3 shrink-0">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-[0_0_24px_rgba(45,212,191,0.45)]">
              <Globe2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold bg-gradient-to-r from-teal-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent leading-tight">
                The Portal
              </h1>
              <p className="text-xs text-teal-400/70">Healing products · Practitioners · Sessions</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Impact Banner ── */}
      <ImpactBanner />

      {/* ── Section Tabs ── */}
      <div className="px-4 pt-3 pb-2 shrink-0">
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {SECTION_TABS.map((tab) => {
            const active = activeSection === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-medium transition-all ${
                  active
                    ? "bg-teal-500/20 border-teal-400/50 text-teal-300 shadow-[0_0_12px_rgba(45,212,191,0.25)]"
                    : "bg-white/[0.04] border-white/10 text-muted-foreground hover:border-teal-400/30 hover:text-teal-300/70"
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

      {/* ── Section Content ── */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">

          {/* ════ HEALING PRODUCTS ════ */}
          {activeSection === "products" && (
            <motion.div key="products" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 space-y-4">

              {/* Category filter */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {PRODUCT_CATEGORIES.map((cat) => {
                  const active = productCategory === cat.id;
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setProductCategory(cat.id)}
                      className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs transition-all ${
                        active
                          ? "bg-teal-500/20 border-teal-400/50 text-teal-300"
                          : "bg-white/[0.03] border-white/10 text-muted-foreground hover:border-teal-400/20"
                      }`}
                    >
                      <Icon className="h-3 w-3" />
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              <p className="text-xs text-muted-foreground/60">
                All prices shown are your <span className="text-teal-300 font-medium">33% member price</span>. Sliding scale — pay what you can.
              </p>

              <div className="space-y-2">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    savedIds={savedIds}
                    onToggleSave={(id, title) => toggleSave(id, title, "product")}
                    onAddToSession={(title) => { showToast(`"${title}" added to cart`); }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* ════ FIND A PRACTITIONER ════ */}
          {activeSection === "practitioners" && (
            <motion.div key="practitioners" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 space-y-4">

              {/* Values pledge */}
              <div className="rounded-2xl bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border border-teal-400/20 p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-teal-400 shrink-0" />
                  <p className="text-sm font-semibold text-foreground">Every practitioner is vetted</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  All healers, teachers, and guides in The Portal have agreed to Soul Echoes values — trauma-informed practice, inclusive access, confidentiality, non-judgment, and sliding scale pricing for those who need it.
                </p>
              </div>

              <div className="space-y-2">
                {PRACTITIONERS.map((p) => (
                  <PractitionerCard
                    key={p.id}
                    p={p}
                    savedIds={savedIds}
                    onToggleSave={(id, title) => toggleSave(id, title, "practitioner")}
                    onBook={(name) => { setBookedFor(name); setActiveSection("book"); }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* ════ CRISIS COUNSELOR ════ */}
          {activeSection === "crisis" && (
            <motion.div key="crisis" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 space-y-4">

              {/* You are not alone banner */}
              <div className="rounded-2xl bg-gradient-to-r from-rose-500/15 to-amber-500/15 border border-rose-400/30 p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-rose-300 shrink-0" />
                  <p className="text-sm font-semibold text-foreground">You are not alone — help is here right now</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  If you're in crisis, hurting yourself, or thinking about ending your life — please reach out. These services are free, confidential, and available 24/7. You matter.
                </p>
              </div>

              {/* Immediate crisis lines */}
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-wider text-rose-300/80 font-semibold px-1">Call or text now · 24/7</p>

                <a
                  href="tel:988"
                  className="flex items-center gap-3 p-4 rounded-2xl border border-rose-400/40 bg-rose-500/10 hover:bg-rose-500/15 transition-colors"
                >
                  <div className="shrink-0 w-11 h-11 rounded-xl bg-rose-500/25 border border-rose-400/40 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-rose-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">988 — Suicide & Crisis Lifeline</p>
                    <p className="text-xs text-muted-foreground">Call or text 988 · Free, confidential, 24/7 (US & Canada)</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-rose-300 shrink-0" />
                </a>

                <a
                  href="sms:741741?body=HOME"
                  className="flex items-center gap-3 p-4 rounded-2xl border border-amber-400/40 bg-amber-500/10 hover:bg-amber-500/15 transition-colors"
                >
                  <div className="shrink-0 w-11 h-11 rounded-xl bg-amber-500/25 border border-amber-400/40 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-amber-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">Crisis Text Line</p>
                    <p className="text-xs text-muted-foreground">Text <span className="font-semibold text-amber-300">HOME</span> to 741741 · Free, 24/7</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-amber-300 shrink-0" />
                </a>

                <a
                  href="tel:911"
                  className="flex items-center gap-3 p-4 rounded-2xl border border-red-500/40 bg-red-500/10 hover:bg-red-500/15 transition-colors"
                >
                  <div className="shrink-0 w-11 h-11 rounded-xl bg-red-500/25 border border-red-400/40 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-red-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">911 — Emergency</p>
                    <p className="text-xs text-muted-foreground">If you or someone is in immediate physical danger</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-red-300 shrink-0" />
                </a>
              </div>

              {/* Specialized support */}
              <div className="space-y-2 pt-2">
                <p className="text-xs uppercase tracking-wider text-teal-300/80 font-semibold px-1">Specialized support</p>

                {[
                  { name: "The Trevor Project", desc: "LGBTQ+ youth · Call 1-866-488-7386 · Text START to 678-678", href: "tel:18664887386", color: "violet" },
                  { name: "Trans Lifeline", desc: "Peer support by & for trans people · 1-877-565-8860", href: "tel:18775658860", color: "pink" },
                  { name: "Veterans Crisis Line", desc: "Dial 988 then press 1 · Text 838255", href: "tel:988", color: "emerald" },
                  { name: "SAMHSA National Helpline", desc: "Substance use & mental health · 1-800-662-4357", href: "tel:18006624357", color: "sky" },
                  { name: "RAINN — Sexual Assault Hotline", desc: "1-800-656-4673 · Confidential 24/7 support", href: "tel:18006564673", color: "indigo" },
                  { name: "National Domestic Violence Hotline", desc: "1-800-799-7233 · Text START to 88788", href: "tel:18007997233", color: "rose" },
                ].map((r) => (
                  <a
                    key={r.name}
                    href={r.href}
                    className="flex items-center gap-3 p-3.5 rounded-2xl border border-white/10 bg-white/[0.04] hover:border-white/20 transition-colors"
                  >
                    <div className="shrink-0 w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <Phone className="h-4 w-4 text-foreground/70" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{r.name}</p>
                      <p className="text-xs text-muted-foreground leading-snug">{r.desc}</p>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  </a>
                ))}
              </div>

              {/* Grounding right now */}
              <div className="rounded-2xl bg-teal-500/10 border border-teal-400/25 p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-teal-300" />
                  <p className="text-sm font-semibold text-foreground">While you wait — try this</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Breathe in for 4, hold for 4, breathe out for 8. Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste. You are here. You are safe in this moment.
                </p>
              </div>

              <p className="text-[11px] text-center text-muted-foreground/60 italic pt-2">
                Soul Echoes is not a replacement for emergency services or licensed mental health care.
              </p>
            </motion.div>
          )}
          {activeSection === "journeys" && (
            <motion.div key="journeys" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
              <HealingJourneys onBack={() => setActiveSection("practitioners")} />
            </motion.div>
          )}

          {/* ════ BOOK A SESSION ════ */}
          {activeSection === "book" && (
            <motion.div key="book" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 space-y-5">

              {bookedFor && (
                <div className="rounded-2xl bg-teal-500/10 border border-teal-400/20 px-4 py-3 flex items-center gap-2">
                  <Star className="h-4 w-4 text-teal-400 shrink-0" />
                  <p className="text-sm text-teal-300">Booking with <span className="font-semibold">{bookedFor}</span></p>
                  <button onClick={() => setBookedFor(null)} className="ml-auto text-xs text-muted-foreground hover:text-foreground">Change</button>
                </div>
              )}

              <div className="space-y-1">
                <h2 className="font-display text-lg font-bold text-foreground">Choose How to Pay</h2>
                <p className="text-sm text-muted-foreground">All options are valid. Pay in the way that honours where you are right now.</p>
              </div>

              <div className="space-y-2">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon;
                  const active = selectedPayment === method.id;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl border transition-all text-left ${
                        active
                          ? `${method.bg} ${method.border} shadow-[0_0_14px_rgba(45,212,191,0.2)]`
                          : "bg-white/[0.03] border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className={`shrink-0 w-9 h-9 rounded-xl ${method.bg} border ${method.border} flex items-center justify-center`}>
                        <Icon className={`h-4 w-4 ${method.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{method.label}</p>
                        <p className="text-xs text-muted-foreground leading-snug">{method.desc}</p>
                      </div>
                      {active && <Check className="h-4 w-4 text-teal-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {selectedPayment && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  <Button
                    size="lg"
                    className="w-full rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 border-0 text-base font-semibold shadow-[0_0_24px_rgba(45,212,191,0.35)]"
                    onClick={() => showToast("Booking confirmed — your practitioner will be in touch shortly")}
                  >
                    Confirm Booking <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                  <p className="text-center text-[11px] text-muted-foreground/50 mt-2">
                    3% of this session fee supports Rise Up Healing nonprofit
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ════ WAIT & SAVE ════ */}
          {activeSection === "saved" && (
            <motion.div key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 space-y-4">

              {/* Explainer */}
              <div className="rounded-2xl bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border border-teal-400/20 p-4 space-y-1.5">
                <div className="flex items-center gap-2">
                  <BookmarkCheck className="h-5 w-5 text-teal-400" />
                  <p className="text-sm font-semibold text-foreground">Save now, purchase when ready</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Bookmark any product or practitioner. Turn on notifications and we'll let you know when you're ready — or when a spot opens up. No pressure, no rush.
                </p>
              </div>

              {savedItems.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Bookmark className="h-10 w-10 text-teal-400/30 mx-auto" />
                  <p className="text-sm text-muted-foreground">Nothing saved yet.</p>
                  <p className="text-xs text-muted-foreground/60">
                    Tap the bookmark icon on any product or practitioner to save it here.
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-xl border-teal-400/30 text-teal-300 mt-2"
                    onClick={() => setActiveSection("products")}
                  >
                    Browse Products
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {savedItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/10 bg-white/[0.04]"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                        <p className="text-xs text-muted-foreground capitalize">{item.type}</p>
                      </div>
                      <button
                        onClick={() => toggleNotify(item.id)}
                        aria-label={item.notifyWhenReady ? "Turn off notification" : "Notify me when ready"}
                        className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors ${
                          item.notifyWhenReady ? "bg-teal-500/20 border border-teal-400/40 text-teal-400" : "bg-white/5 border border-white/10 text-muted-foreground hover:text-teal-400"
                        }`}
                      >
                        {item.notifyWhenReady ? <Bell className="h-3.5 w-3.5" /> : <BellOff className="h-3.5 w-3.5" />}
                      </button>
                      <button
                        onClick={() => toggleSave(item.id, item.title)}
                        aria-label="Remove from saved"
                        className="h-8 w-8 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-muted-foreground hover:text-rose-400 transition-colors"
                      >
                        <BookmarkCheck className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-teal-600/90 backdrop-blur-sm text-white text-sm font-medium shadow-lg max-w-[90vw] text-center"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
