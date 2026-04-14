import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Users, Headphones, Volume2, Gem, Droplet,
  Gift, Heart, Check, ChevronDown, ChevronUp, ShoppingBag,
  Bookmark, BookmarkCheck, CreditCard, Info, Sliders, X,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────────────────────────── */
type TierType = "free" | "paid" | "forward";
interface Tier {
  type: TierType;
  label: string;
  price?: string;          // display price string
  priceNum?: number;       // numeric for BNPL calc
  note: string;
}
interface ShopItem {
  id: string;
  title: string;
  desc: string;
  category: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  tiers: Tier[];
  slideMin?: number;       // sliding scale min (undefined = fixed price)
  slideMax?: number;
}

/* ─── Constants ─────────────────────────────────────────────────────────── */
const SAVED_KEY = "soul-echoes-saved-items";

const CATEGORIES = [
  { id: "all",         label: "All",             icon: ShoppingBag },
  { id: "books",       label: "Books",           icon: BookOpen    },
  { id: "sessions",    label: "Healer Sessions", icon: Users       },
  { id: "meditations", label: "Meditations",     icon: Headphones  },
  { id: "sound",       label: "Sound Therapy",   icon: Volume2     },
  { id: "crystals",    label: "Crystals",        icon: Gem         },
  { id: "oils",        label: "Essential Oils",  icon: Droplet     },
];

/* ─── Catalogue ─────────────────────────────────────────────────────────── */
const ITEMS: ShopItem[] = [
  /* ── Books ── */
  {
    id: "body-keeps-score",
    title: "The Body Keeps the Score",
    desc: "Bessel van der Kolk's landmark book on trauma, the body, and the brain's path to recovery.",
    category: "books", icon: BookOpen, color: "text-amber-400", bg: "bg-amber-500/15",
    tiers: [
      { type: "free",    label: "Sample",         note: "First 3 chapters — no cost, no account" },
      { type: "paid",    label: "Full Book",       price: "$12.67", priceNum: 12.67, note: "Digital edition, lifetime access · member price (33% off $18.99)" },
      { type: "forward", label: "Pay It Forward",  price: "$12.67", priceNum: 12.67, note: "Buy a copy for someone who needs healing" },
    ],
  },
  {
    id: "you-can-heal",
    title: "You Can Heal Your Life",
    desc: "Louise Hay's essential guide to understanding the mental causes of physical illness and creating lasting change.",
    category: "books", icon: BookOpen, color: "text-amber-400", bg: "bg-amber-500/15",
    tiers: [
      { type: "free",    label: "Introduction",   note: "First chapter and affirmations list free" },
      { type: "paid",    label: "Full Book",       price: "$10.04", priceNum: 10.04, note: "Digital edition with affirmation workbook · member price (33% off $14.99)" },
      { type: "forward", label: "Pay It Forward",  price: "$10.04", priceNum: 10.04, note: "Gift to a survivor in our community" },
    ],
  },
  {
    id: "power-of-now",
    title: "The Power of Now",
    desc: "Eckhart Tolle's spiritual guide to ending the tyranny of the thinking mind and finding peace in presence.",
    category: "books", icon: BookOpen, color: "text-amber-400", bg: "bg-amber-500/15",
    tiers: [
      { type: "free",    label: "Excerpt",         note: "Chapters 1–2 and key practices free" },
      { type: "paid",    label: "Full Book",        price: "$11.38", priceNum: 11.38, note: "Digital edition · member price (33% off $16.99)" },
      { type: "forward", label: "Pay It Forward",   price: "$11.38", priceNum: 11.38, note: "Fund a copy for someone on the waiting list" },
    ],
  },
  {
    id: "healing-shame",
    title: "Healing the Shame That Binds You",
    desc: "John Bradshaw's breakthrough work on toxic shame — identifying it, understanding it, and breaking free.",
    category: "books", icon: BookOpen, color: "text-amber-400", bg: "bg-amber-500/15",
    tiers: [
      { type: "free",    label: "Sample",           note: "Shame inventory exercise included free" },
      { type: "paid",    label: "Full Book",         price: "$10.71", priceNum: 10.71, note: "Digital edition with guided exercises · member price (33% off $15.99)" },
      { type: "forward", label: "Pay It Forward",    price: "$10.71", priceNum: 10.71, note: "Give the gift of freedom from shame" },
    ],
  },
  {
    id: "waking-the-tiger",
    title: "Waking the Tiger",
    desc: "Peter Levine's somatic experiencing approach to healing trauma stored in the body.",
    category: "books", icon: BookOpen, color: "text-amber-400", bg: "bg-amber-500/15",
    tiers: [
      { type: "free",    label: "Preview",          note: "First chapter and core concepts free" },
      { type: "paid",    label: "Full Book",         price: "$12.05", priceNum: 12.05, note: "Digital edition · member price (33% off $17.99)" },
      { type: "forward", label: "Pay It Forward",    price: "$12.05", priceNum: 12.05, note: "Support someone beginning their healing" },
    ],
  },

  /* ── Healer Sessions ── */
  {
    id: "energy-healing-30",
    title: "Energy Healing Session — 30 min",
    desc: "One-on-one distant energy clearing with a certified practitioner. Biofield clearing, chakra balancing, and grounding.",
    category: "sessions", icon: Users, color: "text-teal-300", bg: "bg-teal-500/15",
    slideMin: 25, slideMax: 55,
    tiers: [
      { type: "free",    label: "Community Circle", note: "Monthly group healing sessions — free to join" },
      { type: "paid",    label: "Private Session",   price: "$36.85", priceNum: 36.85, note: "1:1 with certified healer · member price (33% off $55). Sliding scale $25–$55." },
      { type: "forward", label: "Pay It Forward",    price: "$36.85", priceNum: 36.85, note: "Fund a session for a survivor who cannot pay" },
    ],
  },
  {
    id: "reiki-60",
    title: "Reiki Session — 60 min",
    desc: "Full distant Reiki session covering all energy centers. Includes pre-session intake and post-session notes.",
    category: "sessions", icon: Users, color: "text-teal-300", bg: "bg-teal-500/15",
    slideMin: 45, slideMax: 95,
    tiers: [
      { type: "free",    label: "Intro Call",        note: "15-min clarity call with a Reiki practitioner, free" },
      { type: "paid",    label: "Full Session",       price: "$63.65", priceNum: 63.65, note: "60 min distant Reiki · member price (33% off $95). Sliding scale $45–$95." },
      { type: "forward", label: "Pay It Forward",     price: "$63.65", priceNum: 63.65, note: "Give someone a full healing session at no cost to them" },
    ],
  },
  {
    id: "trauma-integration",
    title: "Trauma Integration Session",
    desc: "Somatic-based session combining breathwork, body mapping, and guided emotional release with a trauma-informed practitioner.",
    category: "sessions", icon: Users, color: "text-teal-300", bg: "bg-teal-500/15",
    slideMin: 55, slideMax: 120,
    tiers: [
      { type: "free",    label: "Resource Pack",     note: "Grounding exercises and nervous system guide free" },
      { type: "paid",    label: "Private Session",    price: "$80.40", priceNum: 80.40, note: "90 min session with trauma-certified guide · member price (33% off $120). Sliding scale $55–$120." },
      { type: "forward", label: "Pay It Forward",     price: "$80.40", priceNum: 80.40, note: "Sponsor a trauma session for someone in need" },
    ],
  },
  {
    id: "ancestral-clearing",
    title: "Ancestral Clearing Session",
    desc: "A guided session to identify and release inherited trauma patterns, family system entanglements, and generational wounds.",
    category: "sessions", icon: Users, color: "text-teal-300", bg: "bg-teal-500/15",
    slideMin: 50, slideMax: 110,
    tiers: [
      { type: "free",    label: "Family Map Guide",  note: "Ancestral wound identification worksheet, free" },
      { type: "paid",    label: "Full Session",       price: "$73.70", priceNum: 73.70, note: "75 min guided ancestral clearing · member price (33% off $110). Sliding scale $50–$110." },
      { type: "forward", label: "Pay It Forward",     price: "$73.70", priceNum: 73.70, note: "Fund generational healing for a family in need" },
    ],
  },

  /* ── Guided Meditations ── */
  {
    id: "morning-light",
    title: "Morning Light Meditation",
    desc: "A 15-minute sunrise meditation for grounding, intention setting, and opening the heart to the day ahead.",
    category: "meditations", icon: Headphones, color: "text-sky-400", bg: "bg-sky-500/15",
    tiers: [
      { type: "free",    label: "Free Access",       note: "Full 15-min audio, always free" },
      { type: "paid",    label: "Full Library",       price: "$6.69/mo", priceNum: 6.69, note: "Unlimited access to all 40+ guided meditations · member price (33% off $9.99/mo)" },
      { type: "forward", label: "Pay It Forward",     price: "$6.69", priceNum: 6.69, note: "Gift one month of the full library to someone healing" },
    ],
  },
  {
    id: "trauma-release",
    title: "Trauma Release Meditation",
    desc: "A somatic 25-minute meditation guiding the body through safe, gentle release of stored trauma and frozen energy.",
    category: "meditations", icon: Headphones, color: "text-sky-400", bg: "bg-sky-500/15",
    tiers: [
      { type: "free",    label: "5-min Preview",      note: "Introductory grounding portion free" },
      { type: "paid",    label: "Full Audio",          price: "$5.35", priceNum: 5.35, note: "Full 25-min session, lifetime download · member price (33% off $7.99)" },
      { type: "forward", label: "Pay It Forward",      price: "$5.35", priceNum: 5.35, note: "Give this healing audio to a survivor" },
    ],
  },
  {
    id: "sleep-healing",
    title: "Sleep Healing Meditation",
    desc: "A 40-minute deep sleep journey combining theta wave music, body scan, and subconscious healing affirmations.",
    category: "meditations", icon: Headphones, color: "text-sky-400", bg: "bg-sky-500/15",
    tiers: [
      { type: "free",    label: "10-min Version",     note: "Shortened sleep entry meditation, free" },
      { type: "paid",    label: "Full Session",        price: "$6.02", priceNum: 6.02, note: "Full 40-min deep sleep healing audio · member price (33% off $8.99)" },
      { type: "forward", label: "Pay It Forward",      price: "$6.02", priceNum: 6.02, note: "Help someone find peaceful sleep tonight" },
    ],
  },
  {
    id: "inner-child",
    title: "Inner Child Healing",
    desc: "A 30-minute guided journey to meet, comfort, and begin healing your wounded inner child.",
    category: "meditations", icon: Headphones, color: "text-sky-400", bg: "bg-sky-500/15",
    tiers: [
      { type: "free",    label: "Free Preview",       note: "Opening visualization section free" },
      { type: "paid",    label: "Full Audio",          price: "$6.02", priceNum: 6.02, note: "Full 30-min inner child session, lifetime access · member price (33% off $8.99)" },
      { type: "forward", label: "Pay It Forward",      price: "$6.02", priceNum: 6.02, note: "Gift healing to someone's inner child" },
    ],
  },

  /* ── Sound Therapy ── */
  {
    id: "solfeggio-set",
    title: "Solfeggio Frequency Collection",
    desc: "All 9 sacred Solfeggio frequencies — 174Hz to 963Hz — as individual 30-minute healing tracks.",
    category: "sound", icon: Volume2, color: "text-cyan-400", bg: "bg-cyan-500/15",
    slideMin: 12, slideMax: 25,
    tiers: [
      { type: "free",    label: "528Hz Track",        note: "The DNA repair frequency — full 30 min, always free" },
      { type: "paid",    label: "Full Collection",     price: "$16.74", priceNum: 16.74, note: "All 9 frequencies, studio quality · member price (33% off $24.99). Sliding scale $12–$25." },
      { type: "forward", label: "Pay It Forward",      price: "$16.74", priceNum: 16.74, note: "Gift the full collection to a healer in need" },
    ],
  },
  {
    id: "binaural-beats",
    title: "Binaural Beats for Deep Healing",
    desc: "Theta and delta binaural beats designed for deep meditation, trauma processing, and nervous system repair.",
    category: "sound", icon: Volume2, color: "text-cyan-400", bg: "bg-cyan-500/15",
    slideMin: 10, slideMax: 20,
    tiers: [
      { type: "free",    label: "Theta Sample",       note: "20-min theta track free" },
      { type: "paid",    label: "Full Set",            price: "$13.39", priceNum: 13.39, note: "8 tracks covering all healing states · member price (33% off $19.99). Sliding scale $10–$20." },
      { type: "forward", label: "Pay It Forward",      price: "$13.39", priceNum: 13.39, note: "Fund sound healing for someone who needs calm" },
    ],
  },
  {
    id: "singing-bowl-sessions",
    title: "Tibetan Singing Bowl Sessions",
    desc: "Recorded live bowl sessions in different keys for each chakra. Pure, unedited resonance for deep listening.",
    category: "sound", icon: Volume2, color: "text-cyan-400", bg: "bg-cyan-500/15",
    tiers: [
      { type: "free",    label: "Heart Chakra Bowl",  note: "Full F-note session free — no sign-up required" },
      { type: "paid",    label: "All 7 Chakras",       price: "$14.73", priceNum: 14.73, note: "Seven live recordings, one per chakra · member price (33% off $21.99)" },
      { type: "forward", label: "Pay It Forward",      price: "$14.73", priceNum: 14.73, note: "Give the gift of resonance to someone in grief" },
    ],
  },
  {
    id: "432hz-music",
    title: "432Hz Healing Music",
    desc: "Ambient healing music tuned to 432Hz — the natural harmonic frequency believed to align with the universe.",
    category: "sound", icon: Volume2, color: "text-cyan-400", bg: "bg-cyan-500/15",
    tiers: [
      { type: "free",    label: "30-min Track",       note: "One full ambient piece free" },
      { type: "paid",    label: "Full Album",          price: "$10.04", priceNum: 10.04, note: "6 hours of 432Hz ambient music · member price (33% off $14.99)" },
      { type: "forward", label: "Pay It Forward",      price: "$10.04", priceNum: 10.04, note: "Send healing frequencies to someone who needs them" },
    ],
  },

  /* ── Crystals ── */
  {
    id: "amethyst",
    title: "Amethyst Crystal",
    desc: "Raw or tumbled amethyst for spiritual protection, intuition, and calming an anxious mind and energy field.",
    category: "crystals", icon: Gem, color: "text-fuchsia-400", bg: "bg-fuchsia-500/15",
    slideMin: 10, slideMax: 18,
    tiers: [
      { type: "free",    label: "Crystal Guide",      note: "Full amethyst properties PDF free" },
      { type: "paid",    label: "Crystal + Shipping",  price: "$12.06", priceNum: 12.06, note: "Cleansed and charged tumbled stone · member price (33% off $18). Sliding scale $10–$18." },
      { type: "forward", label: "Pay It Forward",      price: "$12.06", priceNum: 12.06, note: "Send a crystal to someone beginning their healing" },
    ],
  },
  {
    id: "rose-quartz",
    title: "Rose Quartz Crystal",
    desc: "The stone of unconditional love. Supports emotional healing, self-compassion, and heart chakra restoration.",
    category: "crystals", icon: Gem, color: "text-fuchsia-400", bg: "bg-fuchsia-500/15",
    slideMin: 8, slideMax: 15,
    tiers: [
      { type: "free",    label: "Properties Guide",   note: "Rose quartz healing guide and pairing suggestions free" },
      { type: "paid",    label: "Crystal + Shipping",  price: "$10.05", priceNum: 10.05, note: "Cleansed and intention-set tumbled stone · member price (33% off $15). Sliding scale $8–$15." },
      { type: "forward", label: "Pay It Forward",      price: "$10.05", priceNum: 10.05, note: "Gift self-love to someone who has forgotten it" },
    ],
  },
  {
    id: "black-tourmaline",
    title: "Black Tourmaline",
    desc: "Powerful protection stone. Grounds scattered energy, blocks psychic attack, and clears the aura of dense energy.",
    category: "crystals", icon: Gem, color: "text-fuchsia-400", bg: "bg-fuchsia-500/15",
    slideMin: 9, slideMax: 16,
    tiers: [
      { type: "free",    label: "Protection Guide",   note: "Grounding and protection crystal guide free" },
      { type: "paid",    label: "Crystal + Shipping",  price: "$10.72", priceNum: 10.72, note: "Raw black tourmaline, cleansed · member price (33% off $16). Sliding scale $9–$16." },
      { type: "forward", label: "Pay It Forward",      price: "$10.72", priceNum: 10.72, note: "Send protection to someone in a dark place" },
    ],
  },
  {
    id: "selenite-wand",
    title: "Selenite Cleansing Wand",
    desc: "High-vibration crystal for cleansing your energy field, other crystals, and spaces. Never needs recharging.",
    category: "crystals", icon: Gem, color: "text-fuchsia-400", bg: "bg-fuchsia-500/15",
    slideMin: 12, slideMax: 22,
    tiers: [
      { type: "free",    label: "Cleansing Ritual",   note: "Selenite cleansing ritual guide PDF free" },
      { type: "paid",    label: "Wand + Shipping",     price: "$14.74", priceNum: 14.74, note: "6-inch natural selenite wand · member price (33% off $22). Sliding scale $12–$22." },
      { type: "forward", label: "Pay It Forward",      price: "$14.74", priceNum: 14.74, note: "Gift energetic cleansing to someone who needs a reset" },
    ],
  },

  /* ── Essential Oils ── */
  {
    id: "lavender-oil",
    title: "Lavender Essential Oil",
    desc: "Therapeutic-grade lavender for calm, sleep, anxiety relief, and emotional soothing. The foundational healing oil.",
    category: "oils", icon: Droplet, color: "text-emerald-400", bg: "bg-emerald-500/15",
    slideMin: 12, slideMax: 19,
    tiers: [
      { type: "free",    label: "Usage Guide",        note: "Safe use, dilution ratios, and blending recipes free" },
      { type: "paid",    label: "10ml Bottle",         price: "$12.73", priceNum: 12.73, note: "100% pure, therapeutic-grade · member price (33% off $19). Sliding scale $12–$19." },
      { type: "forward", label: "Pay It Forward",      price: "$12.73", priceNum: 12.73, note: "Send calming energy to someone who is struggling" },
    ],
  },
  {
    id: "frankincense-oil",
    title: "Frankincense Essential Oil",
    desc: "Sacred resin oil for deep meditation, spiritual connection, immune support, and nervous system grounding.",
    category: "oils", icon: Droplet, color: "text-emerald-400", bg: "bg-emerald-500/15",
    slideMin: 16, slideMax: 28,
    tiers: [
      { type: "free",    label: "Sacred Oil Guide",   note: "Frankincense history, uses, and ritual applications free" },
      { type: "paid",    label: "10ml Bottle",         price: "$18.76", priceNum: 18.76, note: "Boswellia sacra resin, purest grade · member price (33% off $28). Sliding scale $16–$28." },
      { type: "forward", label: "Pay It Forward",      price: "$18.76", priceNum: 18.76, note: "Gift spiritual grounding to someone on their path" },
    ],
  },
  {
    id: "trauma-blend",
    title: "Trauma Release Blend",
    desc: "A custom blend of clary sage, bergamot, ylang ylang, and rose — formulated specifically for trauma and grief.",
    category: "oils", icon: Droplet, color: "text-emerald-400", bg: "bg-emerald-500/15",
    slideMin: 20, slideMax: 34,
    tiers: [
      { type: "free",    label: "Blend Recipe",       note: "Make-your-own trauma blend recipe free" },
      { type: "paid",    label: "15ml Blend",          price: "$22.78", priceNum: 22.78, note: "Pre-made therapeutic blend · member price (33% off $34). Sliding scale $20–$34." },
      { type: "forward", label: "Pay It Forward",      price: "$22.78", priceNum: 22.78, note: "Send healing in a bottle to a survivor" },
    ],
  },
  {
    id: "grounding-blend",
    title: "Grounding and Protection Blend",
    desc: "Cedarwood, vetiver, black pepper, and myrrh — for nervous system stability, presence, and energetic protection.",
    category: "oils", icon: Droplet, color: "text-emerald-400", bg: "bg-emerald-500/15",
    slideMin: 18, slideMax: 31,
    tiers: [
      { type: "free",    label: "Grounding Guide",    note: "10 grounding rituals using essential oils — free PDF" },
      { type: "paid",    label: "15ml Blend",          price: "$20.77", priceNum: 20.77, note: "Handcrafted grounding blend · member price (33% off $31). Sliding scale $18–$31." },
      { type: "forward", label: "Pay It Forward",      price: "$20.77", priceNum: 20.77, note: "Give someone the feeling of being grounded and safe" },
    ],
  },
];

/* ─── Tier styles (teal palette) ─────────────────────────────────────────── */
const TIER_STYLES: Record<TierType, { pill: string; btn: string; icon: React.ElementType; iconColor: string }> = {
  free:    { pill: "bg-teal-500/15 text-teal-300 border-teal-400/30",     btn: "border-teal-400/40 hover:bg-teal-500/20 text-teal-300",   icon: Gift,        iconColor: "text-teal-400"  },
  paid:    { pill: "bg-cyan-500/15 text-cyan-300 border-cyan-400/30",     btn: "border-cyan-400/40 hover:bg-cyan-500/20 text-cyan-300",   icon: ShoppingBag, iconColor: "text-cyan-400"  },
  forward: { pill: "bg-rose-500/15 text-rose-300 border-rose-400/30",     btn: "border-rose-400/40 hover:bg-rose-500/20 text-rose-300",   icon: Heart,       iconColor: "text-rose-400"  },
};

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function bnpl(num: number) {
  const inst = num / 4;
  return `4 × $${inst.toFixed(2)} with Klarna`;
}

function loadSaved(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(SAVED_KEY) || "[]")); }
  catch { return new Set(); }
}
function persistSaved(s: Set<string>) {
  localStorage.setItem(SAVED_KEY, JSON.stringify([...s]));
}

/* ─── Item Card ──────────────────────────────────────────────────────────── */
function ItemCard({
  item, saved, onToggleSave,
}: { item: ShopItem; saved: boolean; onToggleSave: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const [slideVal, setSlideVal] = useState<number>(
    item.slideMin !== undefined && item.slideMax !== undefined
      ? Math.round((item.slideMin + item.slideMax) / 2)
      : 0
  );
  const [waitSaved, setWaitSaved] = useState(false);
  const Icon = item.icon;

  const hasSlider = item.slideMin !== undefined && item.slideMax !== undefined;

  return (
    <motion.div layout className="rounded-2xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-sm overflow-hidden">
      {/* Header row */}
      <div className="flex items-start gap-3 p-4">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex-1 flex items-start gap-3 text-left"
          aria-expanded={open}
        >
          <div className={`shrink-0 h-11 w-11 rounded-xl ${item.bg} flex items-center justify-center`}>
            <Icon className={`h-5 w-5 ${item.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground leading-snug">{item.title}</p>
            <p className="text-xs text-muted-foreground/70 mt-0.5 leading-relaxed line-clamp-2">{item.desc}</p>
            {/* Tier pills */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {item.tiers.map((t) => (
                <span key={t.type} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-medium ${TIER_STYLES[t.type].pill}`}>
                  {t.type === "free" ? "Free" : t.type === "paid" ? (t.price ?? "Paid") : "Pay It Forward"}
                </span>
              ))}
              {hasSlider && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-teal-400/20 bg-teal-500/10 text-[10px] font-medium text-teal-400">
                  <Sliders className="h-2.5 w-2.5" /> Sliding Scale
                </span>
              )}
            </div>
          </div>
        </button>
        {/* Bookmark + expand */}
        <div className="flex flex-col items-center gap-1.5 shrink-0 pt-0.5">
          <button
            onClick={() => onToggleSave(item.id)}
            aria-label={saved ? "Remove from saved" : "Save for later"}
            className={`h-7 w-7 rounded-lg flex items-center justify-center transition-all ${saved ? "bg-teal-500/20 text-teal-300" : "bg-white/5 text-muted-foreground/40 hover:text-teal-400 hover:bg-teal-500/10"}`}
          >
            {saved ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
          </button>
          <button onClick={() => setOpen((o) => !o)} className="text-muted-foreground/30 hover:text-muted-foreground/70 transition-colors">
            {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Expanded detail */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 space-y-3 border-t border-white/[0.05]">
              {/* Sliding scale slider */}
              {hasSlider && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-teal-400 flex items-center gap-1">
                      <Sliders className="h-3 w-3" /> Pay what you can
                    </span>
                    <span className="text-sm font-bold text-teal-300">${slideVal}.00</span>
                  </div>
                  <input
                    type="range"
                    min={item.slideMin} max={item.slideMax} value={slideVal}
                    onChange={(e) => setSlideVal(Number(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none bg-white/10 accent-teal-400 cursor-pointer"
                    aria-label="Choose your price"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground/50">
                    <span>${item.slideMin}</span>
                    <span className="text-muted-foreground/30">Move to choose your price</span>
                    <span>${item.slideMax}</span>
                  </div>
                </div>
              )}

              {/* Tier rows */}
              {item.tiers.map((tier) => {
                const s = TIER_STYLES[tier.type];
                const TierIcon = s.icon;
                const displayPrice = hasSlider && tier.type === "paid"
                  ? `$${slideVal}.00`
                  : tier.price;
                const numericPrice = hasSlider && tier.type === "paid"
                  ? slideVal
                  : tier.priceNum;
                const showBnpl = tier.type === "paid" && numericPrice !== undefined && numericPrice >= 10;
                return (
                  <div key={tier.type} className="flex items-start gap-3 p-3 rounded-xl border border-white/[0.05] bg-white/[0.02]">
                    <div className="shrink-0 mt-0.5 h-7 w-7 rounded-lg bg-white/5 flex items-center justify-center">
                      <TierIcon className={`h-3.5 w-3.5 ${s.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-foreground/90">{tier.label}</span>
                        {displayPrice && (
                          <span className={`text-xs font-bold ${tier.type === "forward" ? "text-rose-300" : "text-cyan-300"}`}>
                            {displayPrice}
                          </span>
                        )}
                        {tier.type === "free" && (
                          <span className="text-[10px] font-bold text-teal-300 flex items-center gap-0.5">
                            <Check className="h-3 w-3" /> Free
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground/60 leading-relaxed">{tier.note}</p>
                      {/* BNPL */}
                      {showBnpl && (
                        <div className="flex items-center gap-1.5 mt-1">
                          <CreditCard className="h-3 w-3 text-pink-400 shrink-0" />
                          <span className="text-[11px] text-pink-300/80 font-medium">{bnpl(numericPrice!)}</span>
                          <span className="text-[10px] text-muted-foreground/40">· 0% interest</span>
                        </div>
                      )}
                    </div>
                    <button
                      className={`shrink-0 mt-0.5 px-3 py-1.5 rounded-lg border text-[11px] font-semibold transition-all duration-200 ${s.btn}`}
                      aria-label={`${tier.label} — ${item.title}`}
                    >
                      {tier.type === "free" ? "Get Free" : tier.type === "forward" ? "Gift It" : "Get It"}
                    </button>
                  </div>
                );
              })}

              {/* Wait & Save */}
              {waitSaved ? (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-teal-500/10 border border-teal-400/20">
                  <Check className="h-3.5 w-3.5 text-teal-400 shrink-0" />
                  <p className="text-xs text-teal-300">Saved. We'll let you know when you're ready for this one.</p>
                  <button onClick={() => setWaitSaved(false)} className="ml-auto shrink-0 text-teal-400/50 hover:text-teal-400">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setWaitSaved(true); onToggleSave(item.id); }}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-white/[0.07] text-xs text-muted-foreground/50 hover:text-teal-300 hover:border-teal-400/30 hover:bg-teal-500/5 transition-all duration-200"
                >
                  <Bookmark className="h-3.5 w-3.5" />
                  Wait &amp; Save — bookmark this for when I'm ready
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Practitioner Info Panel ────────────────────────────────────────────── */
function PractitionerPanel() {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-teal-400/20 bg-teal-500/[0.07] overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left"
        aria-expanded={open}
      >
        <div className="shrink-0 h-8 w-8 rounded-lg bg-teal-500/20 flex items-center justify-center">
          <Info className="h-4 w-4 text-teal-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-teal-300">For Practitioners &amp; Sellers</p>
          <p className="text-xs text-muted-foreground/60">How the platform works for you</p>
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-teal-400/60" /> : <ChevronDown className="h-4 w-4 text-teal-400/60" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-teal-400/10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                <div className="rounded-xl bg-teal-500/10 border border-teal-400/15 p-3 space-y-1">
                  <p className="text-xs font-bold text-teal-300">Platform Fee</p>
                  <p className="text-2xl font-display font-bold text-teal-200">3%</p>
                  <p className="text-[11px] text-muted-foreground/60 leading-relaxed">
                    Soul Echoes takes only 3% of each sale. The remaining 97% goes directly to you. No monthly fees. No listing fees. No surprises.
                  </p>
                </div>
                <div className="rounded-xl bg-cyan-500/10 border border-cyan-400/15 p-3 space-y-1">
                  <p className="text-xs font-bold text-cyan-300">Member Discount</p>
                  <p className="text-2xl font-display font-bold text-cyan-200">33%</p>
                  <p className="text-[11px] text-muted-foreground/60 leading-relaxed">
                    All Soul Echoes members automatically receive 33% off every item in the shop. You set your full price — we handle the discount on our end.
                  </p>
                </div>
              </div>
              <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 space-y-2">
                <p className="text-xs font-semibold text-foreground/80">How it works</p>
                <div className="space-y-1.5 text-[11px] text-muted-foreground/60 leading-relaxed">
                  <p>1. List your sessions, products, or digital downloads — free to list.</p>
                  <p>2. Set your full price. Members see 33% off automatically. Non-members see the full price.</p>
                  <p>3. At checkout, 3% is deducted from the member price and the rest is transferred to your connected account within 2 business days.</p>
                  <p>4. Sliding scale items: you set the minimum — members can pay anywhere between the minimum and the full price. You receive whatever the member chooses.</p>
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground/40 text-center">
                To list your services or products, visit the Practitioner Connect room.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────────────────── */
export default function ShopRoom() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [savedIds, setSavedIds] = useState<Set<string>>(() => loadSaved());
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  useEffect(() => { persistSaved(savedIds); }, [savedIds]);

  const toggleSave = (id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const filtered = ITEMS.filter((i) => {
    if (showSavedOnly && !savedIds.has(i.id)) return false;
    if (activeCategory !== "all" && i.category !== activeCategory) return false;
    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-teal-950 via-[hsl(185,60%,6%)] to-cyan-950">
      {/* Hero */}
      <div className="px-4 pt-6 pb-4 max-w-4xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/15 border border-teal-400/20 mb-4">
            <ShoppingBag className="h-3.5 w-3.5 text-teal-300" />
            <span className="text-xs font-medium text-teal-300 tracking-wide uppercase">Healing Shop</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold bg-gradient-to-r from-teal-300 via-cyan-200 to-teal-400 bg-clip-text text-transparent mb-2">
            Tools for Your Journey
          </h1>
          <p className="text-muted-foreground/70 text-sm max-w-xl mx-auto leading-relaxed">
            Members receive 33% off everything. Every item has a free option, a sliding-scale paid option, and a way to pay it forward.
          </p>
          {/* Member discount badge */}
          <div className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-xl bg-teal-500/10 border border-teal-400/20">
            <Check className="h-3.5 w-3.5 text-teal-400" />
            <span className="text-xs font-semibold text-teal-300">You save 33% on every item as a member</span>
          </div>
        </motion.div>
      </div>

      {/* Practitioner panel */}
      <div className="px-4 pb-4 max-w-4xl mx-auto">
        <PractitionerPanel />
      </div>

      {/* Sticky filter bar */}
      <div className="sticky top-0 z-10 bg-gradient-to-b from-teal-950/95 via-[hsl(185,60%,6%)]/95 to-transparent backdrop-blur-sm border-b border-white/[0.05] px-4 py-3">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none max-w-4xl mx-auto">
          {CATEGORIES.map((cat) => {
            const active = !showSavedOnly && activeCategory === cat.id;
            const CatIcon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => { setShowSavedOnly(false); setActiveCategory(cat.id); }}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-200 ${
                  active
                    ? "bg-teal-500/25 border-teal-400/50 text-teal-200 shadow-[0_0_12px_rgba(20,184,166,0.3)]"
                    : "border-white/10 bg-white/[0.04] text-muted-foreground hover:border-teal-400/30 hover:text-foreground/80"
                }`}
              >
                <CatIcon className="h-3 w-3" />
                {cat.label}
              </button>
            );
          })}
          {/* Saved filter */}
          <button
            onClick={() => setShowSavedOnly((v) => !v)}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-200 ${
              showSavedOnly
                ? "bg-teal-500/25 border-teal-400/50 text-teal-200 shadow-[0_0_12px_rgba(20,184,166,0.3)]"
                : "border-white/10 bg-white/[0.04] text-muted-foreground hover:border-teal-400/30 hover:text-foreground/80"
            }`}
          >
            <BookmarkCheck className="h-3 w-3" />
            Saved {savedIds.size > 0 && `(${savedIds.size})`}
          </button>
        </div>
      </div>

      {/* Item grid */}
      <div className="px-4 py-5 max-w-4xl mx-auto">
        {/* Legend */}
        <div className="flex flex-wrap gap-3 mb-4 text-[11px] text-muted-foreground/50">
          <span className="flex items-center gap-1.5"><Gift className="h-3 w-3 text-teal-400" /> Free — always available</span>
          <span className="flex items-center gap-1.5"><ShoppingBag className="h-3 w-3 text-cyan-400" /> Paid — 33% member discount applied</span>
          <span className="flex items-center gap-1.5"><Heart className="h-3 w-3 text-rose-400" /> Pay It Forward — gifts it to someone in need</span>
          <span className="flex items-center gap-1.5"><CreditCard className="h-3 w-3 text-pink-400" /> Klarna — split into 4 payments, 0% interest</span>
          <span className="flex items-center gap-1.5"><Sliders className="h-3 w-3 text-teal-400" /> Sliding scale — pay what feels right</span>
        </div>

        {showSavedOnly && filtered.length === 0 && (
          <div className="text-center py-12 space-y-2">
            <Bookmark className="h-8 w-8 text-teal-400/30 mx-auto" />
            <p className="text-sm text-muted-foreground/50">Nothing saved yet.</p>
            <p className="text-xs text-muted-foreground/30">Tap the bookmark on any item to save it here.</p>
          </div>
        )}

        <motion.div
          key={activeCategory + String(showSavedOnly)}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          {filtered.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              saved={savedIds.has(item.id)}
              onToggleSave={toggleSave}
            />
          ))}
        </motion.div>

        {/* Pay It Forward promise */}
        <div className="mt-8 mb-4 rounded-2xl border border-teal-400/15 bg-teal-500/[0.06] p-5 text-center space-y-2">
          <Heart className="h-6 w-6 text-rose-400 mx-auto" />
          <p className="text-sm font-semibold text-foreground/90">The Pay It Forward Promise</p>
          <p className="text-xs text-muted-foreground/60 leading-relaxed max-w-md mx-auto">
            Every Pay It Forward purchase funds a free item for someone who cannot afford it. No application needed — distributed to whoever needs it first. Healing is never a privilege here.
          </p>
        </div>
      </div>
    </div>
  );
}
