import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Users, Headphones, Volume2, Gem, Droplet, Wrench,
  Gift, Heart, Check, ChevronDown, ChevronUp, ShoppingBag,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────────────────────────── */
type TierType = "free" | "paid" | "forward";
interface Tier {
  type: TierType;
  label: string;
  price?: string;
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
}

/* ─── Category list ──────────────────────────────────────────────────────── */
const CATEGORIES = [
  { id: "all",         label: "All",               icon: ShoppingBag },
  { id: "books",       label: "Books",              icon: BookOpen    },
  { id: "sessions",    label: "Healer Sessions",    icon: Users       },
  { id: "meditations", label: "Meditations",        icon: Headphones  },
  { id: "sound",       label: "Sound Therapy",      icon: Volume2     },
  { id: "crystals",    label: "Crystals",           icon: Gem         },
  { id: "oils",        label: "Essential Oils",     icon: Droplet     },
  { id: "tools",       label: "Healing Tools",      icon: Wrench      },
];

/* ─── Catalogue ──────────────────────────────────────────────────────────── */
const ITEMS: ShopItem[] = [
  /* ── Books ── */
  {
    id: "body-keeps-score",
    title: "The Body Keeps the Score",
    desc: "Bessel van der Kolk's landmark book on trauma, the body, and the brain's path to recovery.",
    category: "books", icon: BookOpen, color: "text-amber-400", bg: "bg-amber-500/15",
    tiers: [
      { type: "free",    label: "Sample",          note: "First 3 chapters — no cost, no account" },
      { type: "paid",    label: "Full Book",        price: "$18.99", note: "Digital edition, lifetime access" },
      { type: "forward", label: "Pay It Forward",   price: "$18.99", note: "Buy a copy for someone who needs healing" },
    ],
  },
  {
    id: "you-can-heal",
    title: "You Can Heal Your Life",
    desc: "Louise Hay's essential guide to understanding the mental causes of physical illness and creating lasting change.",
    category: "books", icon: BookOpen, color: "text-amber-400", bg: "bg-amber-500/15",
    tiers: [
      { type: "free",    label: "Introduction",    note: "First chapter and affirmations list free" },
      { type: "paid",    label: "Full Book",        price: "$14.99", note: "Digital edition with affirmation workbook" },
      { type: "forward", label: "Pay It Forward",   price: "$14.99", note: "Gift to a survivor in our community" },
    ],
  },
  {
    id: "power-of-now",
    title: "The Power of Now",
    desc: "Eckhart Tolle's spiritual guide to ending the tyranny of the thinking mind and finding peace in presence.",
    category: "books", icon: BookOpen, color: "text-amber-400", bg: "bg-amber-500/15",
    tiers: [
      { type: "free",    label: "Excerpt",          note: "Chapters 1–2 and key practices free" },
      { type: "paid",    label: "Full Book",         price: "$16.99", note: "Digital edition, permanent access" },
      { type: "forward", label: "Pay It Forward",    price: "$16.99", note: "Fund a copy for someone on the waiting list" },
    ],
  },
  {
    id: "healing-shame",
    title: "Healing the Shame That Binds You",
    desc: "John Bradshaw's breakthrough work on toxic shame — identifying it, understanding it, and breaking free.",
    category: "books", icon: BookOpen, color: "text-amber-400", bg: "bg-amber-500/15",
    tiers: [
      { type: "free",    label: "Sample",            note: "Shame inventory exercise included free" },
      { type: "paid",    label: "Full Book",          price: "$15.99", note: "Digital edition with guided exercises" },
      { type: "forward", label: "Pay It Forward",     price: "$15.99", note: "Give the gift of freedom from shame" },
    ],
  },
  {
    id: "waking-the-tiger",
    title: "Waking the Tiger",
    desc: "Peter Levine's somatic experiencing approach to healing trauma stored in the body.",
    category: "books", icon: BookOpen, color: "text-amber-400", bg: "bg-amber-500/15",
    tiers: [
      { type: "free",    label: "Preview",           note: "First chapter and core concepts free" },
      { type: "paid",    label: "Full Book",          price: "$17.99", note: "Digital edition, lifetime access" },
      { type: "forward", label: "Pay It Forward",     price: "$17.99", note: "Support someone beginning their healing" },
    ],
  },

  /* ── Healer Sessions ── */
  {
    id: "energy-healing-30",
    title: "Energy Healing Session — 30 min",
    desc: "One-on-one distant energy clearing with a certified practitioner. Biofield clearing, chakra balancing, and grounding.",
    category: "sessions", icon: Users, color: "text-violet-400", bg: "bg-violet-500/15",
    tiers: [
      { type: "free",    label: "Community Session", note: "Monthly group healing circles — free to join" },
      { type: "paid",    label: "Private Session",    price: "$55.00", note: "1:1 with certified healer, recorded summary included" },
      { type: "forward", label: "Pay It Forward",     price: "$55.00", note: "Fund a session for a survivor who cannot pay" },
    ],
  },
  {
    id: "reiki-60",
    title: "Reiki Session — 60 min",
    desc: "Full distant Reiki session covering all energy centers. Includes pre-session intake and post-session notes.",
    category: "sessions", icon: Users, color: "text-violet-400", bg: "bg-violet-500/15",
    tiers: [
      { type: "free",    label: "Intro Call",         note: "15-min clarity call with a Reiki practitioner, free" },
      { type: "paid",    label: "Full Session",        price: "$95.00", note: "60 min distant Reiki with written session report" },
      { type: "forward", label: "Pay It Forward",      price: "$95.00", note: "Give someone a full healing session at no cost to them" },
    ],
  },
  {
    id: "trauma-integration",
    title: "Trauma Integration Session",
    desc: "Somatic-based session combining breathwork, body mapping, and guided emotional release with a trauma-informed practitioner.",
    category: "sessions", icon: Users, color: "text-violet-400", bg: "bg-violet-500/15",
    tiers: [
      { type: "free",    label: "Resource Pack",      note: "Grounding exercises and nervous system guide free" },
      { type: "paid",    label: "Private Session",     price: "$120.00", note: "90 min session with trauma-certified guide" },
      { type: "forward", label: "Pay It Forward",      price: "$120.00", note: "Sponsor a trauma session for someone in need" },
    ],
  },
  {
    id: "ancestral-clearing",
    title: "Ancestral Clearing Session",
    desc: "A guided session to identify and release inherited trauma patterns, family system entanglements, and generational wounds.",
    category: "sessions", icon: Users, color: "text-violet-400", bg: "bg-violet-500/15",
    tiers: [
      { type: "free",    label: "Family Map Guide",   note: "Ancestral wound identification worksheet, free" },
      { type: "paid",    label: "Full Session",        price: "$110.00", note: "75 min guided ancestral clearing with practitioner" },
      { type: "forward", label: "Pay It Forward",      price: "$110.00", note: "Fund generational healing for a family in need" },
    ],
  },

  /* ── Guided Meditations ── */
  {
    id: "morning-light",
    title: "Morning Light Meditation",
    desc: "A 15-minute sunrise meditation for grounding, intention setting, and opening the heart to the day ahead.",
    category: "meditations", icon: Headphones, color: "text-sky-400", bg: "bg-sky-500/15",
    tiers: [
      { type: "free",    label: "Free Access",        note: "Full 15-min audio, always free" },
      { type: "paid",    label: "Full Library",        price: "$9.99/mo", note: "Unlimited access to all 40+ guided meditations" },
      { type: "forward", label: "Pay It Forward",      price: "$9.99", note: "Gift one month of the full library to someone healing" },
    ],
  },
  {
    id: "trauma-release",
    title: "Trauma Release Meditation",
    desc: "A somatic 25-minute meditation guiding the body through safe, gentle release of stored trauma and frozen energy.",
    category: "meditations", icon: Headphones, color: "text-sky-400", bg: "bg-sky-500/15",
    tiers: [
      { type: "free",    label: "5-min Preview",       note: "Introductory grounding portion free" },
      { type: "paid",    label: "Full Audio",           price: "$7.99", note: "Full 25-min session, lifetime download" },
      { type: "forward", label: "Pay It Forward",       price: "$7.99", note: "Give this healing audio to a survivor" },
    ],
  },
  {
    id: "sleep-healing",
    title: "Sleep Healing Meditation",
    desc: "A 40-minute deep sleep journey combining theta wave music, body scan, and subconscious healing affirmations.",
    category: "meditations", icon: Headphones, color: "text-sky-400", bg: "bg-sky-500/15",
    tiers: [
      { type: "free",    label: "10-min Version",      note: "Shortened sleep entry meditation, free" },
      { type: "paid",    label: "Full Session",         price: "$8.99", note: "Full 40-min deep sleep healing audio" },
      { type: "forward", label: "Pay It Forward",       price: "$8.99", note: "Help someone find peaceful sleep tonight" },
    ],
  },
  {
    id: "inner-child",
    title: "Inner Child Healing",
    desc: "A 30-minute guided journey to meet, comfort, and begin healing your wounded inner child.",
    category: "meditations", icon: Headphones, color: "text-sky-400", bg: "bg-sky-500/15",
    tiers: [
      { type: "free",    label: "Free Preview",        note: "Opening visualization section free" },
      { type: "paid",    label: "Full Audio",           price: "$8.99", note: "Full 30-min inner child session, lifetime access" },
      { type: "forward", label: "Pay It Forward",       price: "$8.99", note: "Gift healing to someone's inner child" },
    ],
  },

  /* ── Sound Therapy ── */
  {
    id: "solfeggio-set",
    title: "Solfeggio Frequency Collection",
    desc: "All 9 sacred Solfeggio frequencies — 174Hz to 963Hz — as individual 30-minute healing tracks.",
    category: "sound", icon: Volume2, color: "text-purple-400", bg: "bg-purple-500/15",
    tiers: [
      { type: "free",    label: "528Hz Track",         note: "The DNA repair frequency — full 30 min, always free" },
      { type: "paid",    label: "Full Collection",      price: "$24.99", note: "All 9 frequencies, studio quality, lifetime download" },
      { type: "forward", label: "Pay It Forward",       price: "$24.99", note: "Gift the full collection to a healer in need" },
    ],
  },
  {
    id: "binaural-beats",
    title: "Binaural Beats for Deep Healing",
    desc: "Theta and delta binaural beats designed for deep meditation, trauma processing, and nervous system repair.",
    category: "sound", icon: Volume2, color: "text-purple-400", bg: "bg-purple-500/15",
    tiers: [
      { type: "free",    label: "Theta Sample",        note: "20-min theta track free" },
      { type: "paid",    label: "Full Set",             price: "$19.99", note: "8 tracks covering all healing states, lifetime access" },
      { type: "forward", label: "Pay It Forward",       price: "$19.99", note: "Fund sound healing for someone who needs calm" },
    ],
  },
  {
    id: "singing-bowl-sessions",
    title: "Tibetan Singing Bowl Sessions",
    desc: "Recorded live bowl sessions in different keys for each chakra. Pure, unedited resonance for deep listening.",
    category: "sound", icon: Volume2, color: "text-purple-400", bg: "bg-purple-500/15",
    tiers: [
      { type: "free",    label: "Heart Chakra Bowl",   note: "Full F-note session free — no sign-up required" },
      { type: "paid",    label: "All 7 Chakras",        price: "$21.99", note: "Seven live recordings, one per chakra, permanent access" },
      { type: "forward", label: "Pay It Forward",       price: "$21.99", note: "Give the gift of resonance to someone in grief" },
    ],
  },
  {
    id: "432hz-music",
    title: "432Hz Healing Music",
    desc: "Ambient healing music tuned to 432Hz — the natural harmonic frequency believed to align with the universe.",
    category: "sound", icon: Volume2, color: "text-purple-400", bg: "bg-purple-500/15",
    tiers: [
      { type: "free",    label: "30-min Track",        note: "One full ambient piece free" },
      { type: "paid",    label: "Full Album",           price: "$14.99", note: "6 hours of 432Hz ambient music, lifetime download" },
      { type: "forward", label: "Pay It Forward",       price: "$14.99", note: "Send healing frequencies to someone who needs them" },
    ],
  },

  /* ── Crystals ── */
  {
    id: "amethyst",
    title: "Amethyst Crystal",
    desc: "Raw or tumbled amethyst for spiritual protection, intuition, and calming an anxious mind and energy field.",
    category: "crystals", icon: Gem, color: "text-fuchsia-400", bg: "bg-fuchsia-500/15",
    tiers: [
      { type: "free",    label: "Crystal Guide",       note: "Full amethyst properties PDF free" },
      { type: "paid",    label: "Crystal + Shipping",  price: "$18.00", note: "Cleansed and charged tumbled stone, ships worldwide" },
      { type: "forward", label: "Pay It Forward",       price: "$18.00", note: "Send a crystal to someone beginning their healing" },
    ],
  },
  {
    id: "rose-quartz",
    title: "Rose Quartz Crystal",
    desc: "The stone of unconditional love. Supports emotional healing, self-compassion, and heart chakra restoration.",
    category: "crystals", icon: Gem, color: "text-fuchsia-400", bg: "bg-fuchsia-500/15",
    tiers: [
      { type: "free",    label: "Properties Guide",    note: "Rose quartz healing guide and pairing suggestions free" },
      { type: "paid",    label: "Crystal + Shipping",  price: "$15.00", note: "Cleansed and intention-set tumbled stone" },
      { type: "forward", label: "Pay It Forward",       price: "$15.00", note: "Gift self-love to someone who has forgotten it" },
    ],
  },
  {
    id: "black-tourmaline",
    title: "Black Tourmaline",
    desc: "Powerful protection stone. Grounds scattered energy, blocks psychic attack, and clears the aura of dense energy.",
    category: "crystals", icon: Gem, color: "text-fuchsia-400", bg: "bg-fuchsia-500/15",
    tiers: [
      { type: "free",    label: "Protection Guide",    note: "Grounding and protection crystal guide free" },
      { type: "paid",    label: "Crystal + Shipping",  price: "$16.00", note: "Raw black tourmaline, cleansed and ready to use" },
      { type: "forward", label: "Pay It Forward",       price: "$16.00", note: "Send protection to someone in a dark place" },
    ],
  },
  {
    id: "selenite-wand",
    title: "Selenite Cleansing Wand",
    desc: "High-vibration crystal for cleansing your energy field, other crystals, and spaces. Never needs recharging.",
    category: "crystals", icon: Gem, color: "text-fuchsia-400", bg: "bg-fuchsia-500/15",
    tiers: [
      { type: "free",    label: "Cleansing Ritual",    note: "Selenite cleansing ritual guide PDF free" },
      { type: "paid",    label: "Wand + Shipping",      price: "$22.00", note: "6-inch natural selenite wand, ethically sourced" },
      { type: "forward", label: "Pay It Forward",       price: "$22.00", note: "Gift energetic cleansing to someone who needs a reset" },
    ],
  },

  /* ── Essential Oils ── */
  {
    id: "lavender-oil",
    title: "Lavender Essential Oil",
    desc: "Therapeutic-grade lavender for calm, sleep, anxiety relief, and emotional soothing. The foundational healing oil.",
    category: "oils", icon: Droplet, color: "text-emerald-400", bg: "bg-emerald-500/15",
    tiers: [
      { type: "free",    label: "Usage Guide",         note: "Safe use, dilution ratios, and blending recipes free" },
      { type: "paid",    label: "10ml Bottle",          price: "$19.00", note: "100% pure, therapeutic-grade, ships worldwide" },
      { type: "forward", label: "Pay It Forward",       price: "$19.00", note: "Send calming energy to someone who is struggling" },
    ],
  },
  {
    id: "frankincense-oil",
    title: "Frankincense Essential Oil",
    desc: "Sacred resin oil for deep meditation, spiritual connection, immune support, and nervous system grounding.",
    category: "oils", icon: Droplet, color: "text-emerald-400", bg: "bg-emerald-500/15",
    tiers: [
      { type: "free",    label: "Sacred Oil Guide",    note: "Frankincense history, uses, and ritual applications free" },
      { type: "paid",    label: "10ml Bottle",          price: "$28.00", note: "Boswellia sacra resin — the purest grade" },
      { type: "forward", label: "Pay It Forward",       price: "$28.00", note: "Gift spiritual grounding to someone on their path" },
    ],
  },
  {
    id: "trauma-blend",
    title: "Trauma Release Blend",
    desc: "A custom blend of clary sage, bergamot, ylang ylang, and rose — formulated specifically for trauma and grief.",
    category: "oils", icon: Droplet, color: "text-emerald-400", bg: "bg-emerald-500/15",
    tiers: [
      { type: "free",    label: "Blend Recipe",        note: "Make-your-own trauma blend recipe free" },
      { type: "paid",    label: "15ml Blend",           price: "$34.00", note: "Pre-made therapeutic blend, ready to diffuse or apply" },
      { type: "forward", label: "Pay It Forward",       price: "$34.00", note: "Send healing in a bottle to a survivor" },
    ],
  },
  {
    id: "grounding-blend",
    title: "Grounding and Protection Blend",
    desc: "Cedarwood, vetiver, black pepper, and myrrh — for nervous system stability, presence, and energetic protection.",
    category: "oils", icon: Droplet, color: "text-emerald-400", bg: "bg-emerald-500/15",
    tiers: [
      { type: "free",    label: "Grounding Guide",     note: "10 grounding rituals using essential oils — free PDF" },
      { type: "paid",    label: "15ml Blend",           price: "$31.00", note: "Handcrafted grounding blend, therapeutic grade" },
      { type: "forward", label: "Pay It Forward",       price: "$31.00", note: "Give someone the feeling of being grounded and safe" },
    ],
  },

  /* ── Healing Tools ── */
  {
    id: "tuning-fork-set",
    title: "Tuning Fork Set — Solfeggio",
    desc: "A set of 9 precision-tuned aluminum forks calibrated to the sacred Solfeggio frequencies for body and biofield work.",
    category: "tools", icon: Wrench, color: "text-teal-400", bg: "bg-teal-500/15",
    tiers: [
      { type: "free",    label: "How-To Guide",        note: "Tuning fork therapy technique guide free" },
      { type: "paid",    label: "9-Fork Set",           price: "$89.00", note: "Full Solfeggio set with carrying pouch and instruction card" },
      { type: "forward", label: "Pay It Forward",       price: "$89.00", note: "Equip a healer in a low-income community" },
    ],
  },
  {
    id: "singing-bowl-kit",
    title: "Tibetan Singing Bowl Starter Kit",
    desc: "A hand-hammered Tibetan bowl with mallet and cushion. Includes a guide to bowl selection, placement, and technique.",
    category: "tools", icon: Wrench, color: "text-teal-400", bg: "bg-teal-500/15",
    tiers: [
      { type: "free",    label: "Technique Guide",     note: "Singing bowl beginner technique video and PDF free" },
      { type: "paid",    label: "Bowl Kit",             price: "$65.00", note: "5-inch hand-hammered bowl with mallet and cushion" },
      { type: "forward", label: "Pay It Forward",       price: "$65.00", note: "Gift sound healing tools to a practitioner in need" },
    ],
  },
  {
    id: "oracle-deck",
    title: "Sacred Healing Oracle Deck",
    desc: "A 52-card deck channelled for shadow work, self-healing, and daily spiritual guidance. Full guidebook included.",
    category: "tools", icon: Wrench, color: "text-teal-400", bg: "bg-teal-500/15",
    tiers: [
      { type: "free",    label: "3-Card Spread",       note: "Daily digital reading using the deck — free in the app" },
      { type: "paid",    label: "Physical Deck",        price: "$38.00", note: "Printed card deck with 80-page guidebook" },
      { type: "forward", label: "Pay It Forward",       price: "$38.00", note: "Send guidance to someone who needs direction" },
    ],
  },
  {
    id: "sage-bundle",
    title: "White Sage Cleansing Bundle",
    desc: "Ethically wildcrafted California white sage for space and energy clearing rituals.",
    category: "tools", icon: Wrench, color: "text-teal-400", bg: "bg-teal-500/15",
    tiers: [
      { type: "free",    label: "Cleansing Ritual",    note: "Full space clearing ritual guide free" },
      { type: "paid",    label: "Bundle × 3",           price: "$22.00", note: "Three hand-tied sage bundles, ethically sourced" },
      { type: "forward", label: "Pay It Forward",       price: "$22.00", note: "Clear the energy in a home that needs peace" },
    ],
  },
  {
    id: "journal-kit",
    title: "Shadow Work Journal Kit",
    desc: "A guided journal with 90 prompts for trauma processing, inner child work, and shadow integration.",
    category: "tools", icon: Wrench, color: "text-teal-400", bg: "bg-teal-500/15",
    tiers: [
      { type: "free",    label: "10 Free Prompts",     note: "First 10 shadow work prompts in the app, always free" },
      { type: "paid",    label: "Full Journal",         price: "$29.00", note: "Printed 200-page guided journal shipped to your door" },
      { type: "forward", label: "Pay It Forward",       price: "$29.00", note: "Give the gift of guided self-discovery to a survivor" },
    ],
  },
];

/* ─── Tier badge styles ──────────────────────────────────────────────────── */
const TIER_STYLES: Record<TierType, { pill: string; btn: string; icon: React.ElementType; iconColor: string }> = {
  free:    { pill: "bg-teal-500/15 text-teal-300 border-teal-400/30",   btn: "border-teal-400/40 hover:bg-teal-500/15 text-teal-300",   icon: Gift,  iconColor: "text-teal-400"   },
  paid:    { pill: "bg-violet-500/15 text-violet-300 border-violet-400/30", btn: "border-violet-400/40 hover:bg-violet-500/15 text-violet-300", icon: ShoppingBag, iconColor: "text-violet-400" },
  forward: { pill: "bg-rose-500/15 text-rose-300 border-rose-400/30",   btn: "border-rose-400/40 hover:bg-rose-500/15 text-rose-300",   icon: Heart, iconColor: "text-rose-400"   },
};

const TIER_LABEL: Record<TierType, string> = {
  free: "Free",
  paid: "Paid",
  forward: "Pay It Forward",
};

/* ─── Item Card ──────────────────────────────────────────────────────────── */
function ItemCard({ item }: { item: ShopItem }) {
  const [open, setOpen] = useState(false);
  const Icon = item.icon;

  return (
    <motion.div
      layout
      className="rounded-2xl border border-white/[0.07] bg-card/60 backdrop-blur-sm overflow-hidden"
    >
      {/* Header row */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-start gap-3 p-4 text-left hover:bg-white/[0.03] transition-colors"
        aria-expanded={open}
      >
        <div className={`shrink-0 h-11 w-11 rounded-xl ${item.bg} flex items-center justify-center`}>
          <Icon className={`h-5 w-5 ${item.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground leading-snug">{item.title}</p>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">{item.desc}</p>
          {/* Tier pills */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {item.tiers.map((t) => (
              <span
                key={t.type}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-medium ${TIER_STYLES[t.type].pill}`}
              >
                {t.price ?? TIER_LABEL[t.type]}
              </span>
            ))}
          </div>
        </div>
        <div className="shrink-0 mt-1 text-muted-foreground/40">
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>

      {/* Expanded tiers */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 space-y-2 border-t border-white/[0.06]">
              {item.tiers.map((tier) => {
                const s = TIER_STYLES[tier.type];
                const TierIcon = s.icon;
                return (
                  <div
                    key={tier.type}
                    className="flex items-start gap-3 p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]"
                  >
                    <div className={`shrink-0 mt-0.5 h-7 w-7 rounded-lg bg-white/5 flex items-center justify-center`}>
                      <TierIcon className={`h-3.5 w-3.5 ${s.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-foreground/90">{tier.label}</span>
                        {tier.price && (
                          <span className={`text-xs font-bold ${tier.type === "forward" ? "text-rose-300" : "text-violet-300"}`}>
                            {tier.price}
                          </span>
                        )}
                        {tier.type === "free" && (
                          <span className="text-[10px] font-bold text-teal-300 flex items-center gap-0.5">
                            <Check className="h-3 w-3" /> Free
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground/70 mt-0.5 leading-relaxed">{tier.note}</p>
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Main page ──────────────────────────────────────────────────────────── */
export default function ShopRoom() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = activeCategory === "all"
    ? ITEMS
    : ITEMS.filter((i) => i.category === activeCategory);

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-rose-950 via-slate-950 to-violet-950">
      {/* Hero */}
      <div className="px-4 pt-6 pb-4 max-w-4xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/15 border border-rose-400/20 mb-4">
            <ShoppingBag className="h-3.5 w-3.5 text-rose-300" />
            <span className="text-xs font-medium text-rose-300 tracking-wide uppercase">Healing Shop</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold bg-gradient-to-r from-rose-300 via-violet-300 to-teal-300 bg-clip-text text-transparent mb-2">
            Tools for Your Journey
          </h1>
          <p className="text-muted-foreground/70 text-sm max-w-xl mx-auto leading-relaxed">
            Every item offers a free option, a paid option, and a way to pay it forward — so healing is never out of reach.
          </p>
        </motion.div>
      </div>

      {/* Category filter — horizontal scroll */}
      <div className="sticky top-0 z-10 bg-gradient-to-b from-rose-950/95 via-slate-950/95 to-transparent backdrop-blur-sm border-b border-white/[0.05] px-4 py-3">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none max-w-4xl mx-auto">
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat.id;
            const CatIcon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-200 ${
                  active
                    ? "bg-violet-500/25 border-violet-400/50 text-violet-200 shadow-[0_0_12px_rgba(167,139,250,0.3)]"
                    : "border-white/10 bg-white/[0.04] text-muted-foreground hover:border-white/20 hover:text-foreground/80"
                }`}
              >
                <CatIcon className="h-3 w-3" />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Item grid */}
      <div className="px-4 py-5 max-w-4xl mx-auto">
        {/* Legend */}
        <div className="flex flex-wrap gap-3 mb-5 text-[11px] text-muted-foreground/60">
          <span className="flex items-center gap-1.5"><Gift className="h-3 w-3 text-teal-400" /> Free — no payment, no barrier</span>
          <span className="flex items-center gap-1.5"><ShoppingBag className="h-3 w-3 text-violet-400" /> Paid — support the creator</span>
          <span className="flex items-center gap-1.5"><Heart className="h-3 w-3 text-rose-400" /> Pay It Forward — gift it to someone who can't afford it</span>
        </div>

        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          {filtered.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </motion.div>

        {/* Pay It Forward note */}
        <div className="mt-8 mb-4 rounded-2xl border border-rose-400/20 bg-rose-500/[0.07] p-5 text-center space-y-2">
          <Heart className="h-6 w-6 text-rose-400 mx-auto" />
          <p className="text-sm font-semibold text-foreground/90">The Pay It Forward Promise</p>
          <p className="text-xs text-muted-foreground/70 leading-relaxed max-w-md mx-auto">
            Every Pay It Forward purchase funds a free item for someone who cannot afford it. No application needed — it is distributed to whoever needs it first. Healing should never be a privilege.
          </p>
        </div>
      </div>
    </div>
  );
}
