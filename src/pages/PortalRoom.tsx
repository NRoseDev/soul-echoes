import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Gem, Droplet, Volume2, Headphones, Users, Star, Bookmark,
  BookmarkCheck, Bell, BellOff, Heart, Check, X,
  CreditCard, Sliders, Gift, Globe2, ArrowRight, ShieldCheck, Zap,
  Wind, Sun, Flame, Music2, ShieldAlert, Phone, MessageSquare, ExternalLink,
  Package, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface BundleItem {
  title: string;
  kind: string; // e.g. "meditation", "track", "ebook"
}

interface Bundle {
  id: string;
  title: string;
  desc: string;
  category: "audio" | "meditations" | "reading" | "physical";
  icon: React.ElementType;
  accentColor: string;
  accentBg: string;
  sellerName: string;
  sellerAskingPrice: number; // full seller asking price (USD)
  items: BundleItem[];
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

const BUNDLE_CATEGORIES = [
  { id: "all",         label: "All Bundles",     icon: Globe2     },
  { id: "meditations", label: "Meditation Packs", icon: Headphones },
  { id: "audio",       label: "Sound & Music",    icon: Music2     },
  { id: "reading",     label: "Reading Packs",    icon: BookOpen   },
  { id: "physical",    label: "Physical Kits",    icon: Gem        },
] as const;

/**
 * Bundles group multiple items so nothing is ever sold one-by-one.
 * `sellerAskingPrice` is the FULL asking price the seller receives.
 * The UI hides pricing math — the 33% discount is applied at checkout only.
 */
const BUNDLES: Bundle[] = [
  {
    id: "somatic-release-collection",
    title: "Somatic Release Collection",
    desc: "A complete guided journey for releasing stored trauma from the body — breathwork, body scans and grounding rituals bundled together.",
    category: "meditations", icon: Headphones,
    accentColor: "text-sky-400", accentBg: "bg-sky-500/15",
    sellerName: "Maya R.",
    sellerAskingPrice: 48,
    items: [
      { title: "10-Session Somatic Series", kind: "meditation pack" },
      { title: "Nervous System Reset Breathwork", kind: "breathwork" },
      { title: "Body Scan Companion Audio", kind: "audio" },
    ],
  },
  {
    id: "inner-child-sanctuary",
    title: "Inner Child Sanctuary Bundle",
    desc: "Reparent, comfort and reconnect with the child within. A tender, trauma-informed collection.",
    category: "meditations", icon: Headphones,
    accentColor: "text-pink-400", accentBg: "bg-pink-500/15",
    sellerName: "Sadé M.",
    sellerAskingPrice: 42,
    items: [
      { title: "8 Guided Inner-Child Meditations", kind: "meditation pack" },
      { title: "Reparenting Journal Prompts (PDF)", kind: "workbook" },
      { title: "Bedtime Comfort Audio", kind: "audio" },
    ],
  },
  {
    id: "grief-passage-pack",
    title: "Grief Passage Pack",
    desc: "A gentle companion for moving through loss without bypassing it. Six meditations plus written reflections.",
    category: "meditations", icon: Headphones,
    accentColor: "text-indigo-400", accentBg: "bg-indigo-500/15",
    sellerName: "James O.",
    sellerAskingPrice: 36,
    items: [
      { title: "6 Grief Meditations", kind: "meditation pack" },
      { title: "Written Reflections eBook", kind: "ebook" },
      { title: "Candle Ritual Guide", kind: "guide" },
    ],
  },
  {
    id: "solfeggio-sound-collection",
    title: "Solfeggio Sound Collection",
    desc: "A full spectrum of healing frequencies. Every solfeggio tone bundled together — never sold as single tracks.",
    category: "audio", icon: Music2,
    accentColor: "text-teal-400", accentBg: "bg-teal-500/15",
    sellerName: "Kwame A.",
    sellerAskingPrice: 54,
    items: [
      { title: "396 Hz — Release", kind: "track" },
      { title: "417 Hz — Change", kind: "track" },
      { title: "528 Hz — Repair", kind: "track" },
      { title: "639 Hz — Connection", kind: "track" },
      { title: "741 Hz — Expression", kind: "track" },
      { title: "852 Hz — Intuition", kind: "track" },
    ],
  },
  {
    id: "binaural-deep-rest",
    title: "Binaural Deep Rest Bundle",
    desc: "12 binaural sessions across theta, delta and alpha — bundled for trauma processing, deep sleep and calm.",
    category: "audio", icon: Volume2,
    accentColor: "text-sky-400", accentBg: "bg-sky-500/15",
    sellerName: "Lena V.",
    sellerAskingPrice: 30,
    items: [
      { title: "4 Theta Sessions", kind: "audio" },
      { title: "4 Delta Sessions", kind: "audio" },
      { title: "4 Alpha Sessions", kind: "audio" },
    ],
  },
  {
    id: "trauma-informed-library",
    title: "Trauma-Informed Reading Library",
    desc: "The foundational reading pack. Four landmark books bundled together for a full self-guided study.",
    category: "reading", icon: BookOpen,
    accentColor: "text-amber-400", accentBg: "bg-amber-500/15",
    sellerName: "Soul Echoes Editors",
    sellerAskingPrice: 66,
    items: [
      { title: "The Body Keeps the Score", kind: "book" },
      { title: "Waking the Tiger", kind: "book" },
      { title: "The Power of Now", kind: "book" },
      { title: "You Can Heal Your Life", kind: "book" },
    ],
  },
  {
    id: "grounding-crystal-kit",
    title: "Grounding Crystal Kit",
    desc: "A curated set of ethically sourced crystals for protection, calm and heart-opening — shipped as one kit.",
    category: "physical", icon: Gem,
    accentColor: "text-rose-400", accentBg: "bg-rose-500/15",
    sellerName: "Rosa E.",
    sellerAskingPrice: 78,
    items: [
      { title: "Rose Quartz Heart Set", kind: "crystal" },
      { title: "Amethyst Cluster", kind: "crystal" },
      { title: "Black Tourmaline + Selenite", kind: "crystal" },
      { title: "Printed Care Guide", kind: "guide" },
    ],
  },
  {
    id: "essential-oils-trio",
    title: "Nervous System Essential Oils Trio",
    desc: "Three signature blends — grounding, heart-opening and trauma release — shipped together as one healing trio.",
    category: "physical", icon: Droplet,
    accentColor: "text-violet-400", accentBg: "bg-violet-500/15",
    sellerName: "Faith W.",
    sellerAskingPrice: 60,
    items: [
      { title: "Trauma Release Blend", kind: "oil" },
      { title: "Heart Opening Blend", kind: "oil" },
      { title: "Grounding & Clarity Blend", kind: "oil" },
    ],
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
const PLATFORM_DISCOUNT_RATE = 0.33;

function loadSaved(): SavedItem[] {
  try { return JSON.parse(localStorage.getItem(SAVED_KEY) || "[]"); } catch { return []; }
}
function persistSaved(items: SavedItem[]) {
  localStorage.setItem(SAVED_KEY, JSON.stringify(items));
}

/* ─── Sub-components ─────────────────────────────────────────────────────── */
function ImpactBanner() {
  return (
    <div
      className="mx-4 mt-4 mb-1 rounded-2xl bg-gradient-to-r from-teal-500/20 to-emerald-500/20 border border-teal-400/30 px-4 py-3 flex flex-col sm:flex-row items-center gap-3"
      role="note"
      aria-label="Community impact and member benefit"
    >
      <div className="flex items-center gap-2 shrink-0">
        <Heart className="h-5 w-5 text-rose-400" aria-hidden="true" />
        <span className="text-sm font-semibold text-foreground/90">3% of every sale</span>
        <span className="text-sm text-muted-foreground">supports</span>
        <span className="text-sm font-semibold text-teal-300">Rise Up Healing</span>
      </div>
      <div className="hidden sm:block w-px h-5 bg-white/10" aria-hidden="true" />
      <div className="flex items-center gap-2">
        <Check className="h-4 w-4 text-teal-400 shrink-0" aria-hidden="true" />
        <span className="text-sm text-foreground/80">
          Every bundle includes an <span className="font-bold text-teal-300">automatic member discount</span> — applied at checkout.
        </span>
      </div>
    </div>
  );
}

/* ─── Bundle Card ────────────────────────────────────────────────────────── */
function BundleCard({
  bundle, savedIds, onToggleSave, onCheckout,
}: {
  bundle: Bundle;
  savedIds: Set<string>;
  onToggleSave: (id: string, title: string) => void;
  onCheckout: (bundle: Bundle) => void;
}) {
  const isSaved = savedIds.has(bundle.id);
  const Icon = bundle.icon;
  const itemCount = bundle.items.length;
  const summaryId = `bundle-${bundle.id}-summary`;
  const contentsId = `bundle-${bundle.id}-contents`;

  return (
    <motion.article
      layout
      className="rounded-2xl border border-white/10 bg-white/[0.04] overflow-hidden"
      aria-labelledby={summaryId}
    >
      <div className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          <div
            className={`shrink-0 w-11 h-11 rounded-xl ${bundle.accentBg} flex items-center justify-center`}
            aria-hidden="true"
          >
            <Icon className={`h-5 w-5 ${bundle.accentColor}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3
              id={summaryId}
              className="text-sm font-semibold text-foreground leading-tight"
            >
              {bundle.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              <Package className="inline h-3 w-3 mr-1 -mt-0.5" aria-hidden="true" />
              <span>{itemCount}-item bundle · by {bundle.sellerName}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => onToggleSave(bundle.id, bundle.title)}
            aria-label={isSaved ? `Remove ${bundle.title} from saved` : `Save ${bundle.title} for later`}
            aria-pressed={isSaved}
            className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-teal-400 transition-colors"
          >
            {isSaved
              ? <BookmarkCheck className="h-4 w-4 text-teal-400" aria-hidden="true" />
              : <Bookmark className="h-4 w-4 text-muted-foreground" aria-hidden="true" />}
          </button>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">{bundle.desc}</p>

        <div>
          <p className="text-[11px] uppercase tracking-wide font-semibold text-teal-300/80 mb-1.5">
            What's included
          </p>
          <ul id={contentsId} className="space-y-1" aria-label={`${bundle.title} contents`}>
            {bundle.items.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-foreground/80">
                <Check className="h-3 w-3 text-teal-400 mt-0.5 shrink-0" aria-hidden="true" />
                <span>
                  <span className="font-medium text-foreground/90">{item.title}</span>
                  <span className="text-muted-foreground"> · {item.kind}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="text-[11px] text-muted-foreground/70 mt-2 italic">
            Sold as a complete bundle — individual items are not available separately.
          </p>
        </div>

        <Button
          type="button"
          size="lg"
          onClick={() => onCheckout(bundle)}
          aria-label={`Buy the ${bundle.title} bundle — ${itemCount} items — proceed to secure checkout`}
          aria-describedby={contentsId}
          className="w-full rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 border-0 text-sm font-semibold focus-visible:ring-2 focus-visible:ring-teal-300"
        >
          Buy Bundle <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
        </Button>
      </div>
    </motion.article>
  );
}

/* ─── Bundle Checkout Modal ──────────────────────────────────────────────── */
function BundleCheckoutModal({
  bundle, onClose, onConfirmed,
}: {
  bundle: Bundle;
  onClose: () => void;
  onConfirmed: (msg: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userCharge = Math.round(bundle.sellerAskingPrice * (1 - PLATFORM_DISCOUNT_RATE) * 100) / 100;

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error: fnError } = await supabase.functions.invoke("bundle-purchase", {
        body: {
          bundleId: bundle.id,
          bundleTitle: bundle.title,
          sellerId: bundle.sellerName,
          sellerAskingPrice: bundle.sellerAskingPrice,
        },
      });
      if (fnError) throw fnError;
      onConfirmed(`Purchased "${bundle.title}" — enjoy your bundle`);
      onClose();
    } catch (e) {
      console.error(e);
      setError("Checkout could not complete. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-title"
      aria-describedby="checkout-desc"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl bg-neutral-900 border border-white/10 p-5 space-y-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id="checkout-title" className="font-display text-lg font-bold text-foreground">
              Confirm Bundle Purchase
            </h2>
            <p id="checkout-desc" className="text-xs text-muted-foreground mt-0.5">
              {bundle.items.length} items · by {bundle.sellerName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close checkout"
            className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-teal-400"
          >
            <X className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </button>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-sm font-semibold text-foreground mb-2">{bundle.title}</p>
          <ul className="space-y-1 text-xs text-foreground/80" aria-label="Bundle contents at checkout">
            {bundle.items.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <Check className="h-3 w-3 text-teal-400 mt-0.5 shrink-0" aria-hidden="true" />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </div>

        <div
          className="rounded-2xl border border-teal-400/30 bg-teal-500/10 p-4"
          role="group"
          aria-label="Pricing summary"
        >
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-foreground/80">You pay today</span>
            <span
              className="text-3xl font-bold text-teal-300"
              aria-live="polite"
              aria-label={`Total: ${userCharge.toFixed(2)} US dollars`}
            >
              ${userCharge.toFixed(2)}
            </span>
          </div>
          <p className="text-[11px] text-teal-200/80 mt-1">
            Automatic member discount already applied.
          </p>
        </div>

        {error && (
          <p role="alert" className="text-xs text-rose-300 text-center">{error}</p>
        )}

        <Button
          type="button"
          size="lg"
          disabled={loading}
          onClick={handleConfirm}
          aria-label={`Confirm purchase of ${bundle.title} for ${userCharge.toFixed(2)} US dollars`}
          className="w-full rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 border-0 text-base font-semibold focus-visible:ring-2 focus-visible:ring-teal-300"
        >
          {loading
            ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" /> Processing…</>)
            : (<>Confirm & Pay <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" /></>)}
        </Button>

        <p className="text-[11px] text-center text-muted-foreground/70">
          Secure checkout · 3% of every bundle supports Rise Up Healing
        </p>
      </motion.div>
    </div>
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
          <span className="text-xs text-muted-foreground" aria-hidden="true">{expanded ? "▲" : "▼"}</span>
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
interface PortalRoomProps {
  initialSection?: SectionId;
}

export default function PortalRoom({ initialSection = "products" }: PortalRoomProps) {
  const [activeSection, setActiveSection] = useState<SectionId>(initialSection);

  useEffect(() => {
    setActiveSection(initialSection);
  }, [initialSection]);
  const [bundleCategory, setBundleCategory] = useState<string>("all");
  const [savedItems, setSavedItems] = useState<SavedItem[]>(loadSaved);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [bookedFor, setBookedFor] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [checkoutBundle, setCheckoutBundle] = useState<Bundle | null>(null);

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

  const filteredBundles =
    bundleCategory === "all" ? BUNDLES : BUNDLES.filter((b) => b.category === bundleCategory);

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
              <div
                className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none"
                role="tablist"
                aria-label="Filter bundles by category"
              >
                {BUNDLE_CATEGORIES.map((cat) => {
                  const active = bundleCategory === cat.id;
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setBundleCategory(cat.id)}
                      className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs transition-all focus-visible:ring-2 focus-visible:ring-teal-400 ${
                        active
                          ? "bg-teal-500/20 border-teal-400/50 text-teal-300"
                          : "bg-white/[0.03] border-white/10 text-muted-foreground hover:border-teal-400/20"
                      }`}
                    >
                      <Icon className="h-3 w-3" aria-hidden="true" />
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              <p className="text-xs text-muted-foreground/70">
                Every listing is a curated <span className="text-teal-300 font-medium">complete bundle</span>. Individual songs, tracks or items are not sold separately. Your discount is applied automatically at checkout.
              </p>

              <section
                aria-label={`${filteredBundles.length} healing bundles available`}
                className="space-y-3"
              >
                {filteredBundles.map((bundle) => (
                  <BundleCard
                    key={bundle.id}
                    bundle={bundle}
                    savedIds={savedIds}
                    onToggleSave={(id, title) => toggleSave(id, title, "product")}
                    onCheckout={(b) => setCheckoutBundle(b)}
                  />
                ))}
              </section>
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

      {/* ── Bundle Checkout Modal ── */}
      <AnimatePresence>
        {checkoutBundle && (
          <BundleCheckoutModal
            bundle={checkoutBundle}
            onClose={() => setCheckoutBundle(null)}
            onConfirmed={(msg) => showToast(msg)}
          />
        )}
      </AnimatePresence>

      {/* ── Toast ── */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">{toast ?? ""}</div>
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            role="status"
            className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-teal-600/90 backdrop-blur-sm text-white text-sm font-medium shadow-lg max-w-[90vw] text-center"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
