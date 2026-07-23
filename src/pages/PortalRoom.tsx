import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Gem, Droplet, Users, Star, Bookmark,
  BookmarkCheck, Bell, BellOff, Heart, Check, X,
  CreditCard, Sliders, Gift, Globe2, ArrowRight, ShieldCheck, Zap,
  Wind, Sun, Flame, ShieldAlert, Phone, MessageSquare, ExternalLink,
  Package, ShoppingCart, Leaf, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  applyTier,
  cartTier,
  cartTotals,
  itemBaseTier,
  itemMemberPrice,
  type PricingCategory,
  type PricingItem,
} from "@/lib/pricing";

/* ─── Types ──────────────────────────────────────────────────────────────── */
type ProductCategory = PricingCategory;

interface Product {
  id: string;
  title: string;
  desc: string;
  category: ProductCategory;
  kind: "individual" | "set";
  icon: React.ElementType;
  accentColor: string;
  accentBg: string;
  retailPrice: number;
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

interface CartItem {
  id: string;
  title: string;
  retailPrice: number;
  category: ProductCategory;
  kind: "individual" | "set";
  qty: number;
}

/* ─── Constants ──────────────────────────────────────────────────────────── */
const SAVED_KEY = "soul-echoes-portal-saved";
const CART_KEY = "soul-echoes-shop-cart";

const PRODUCT_CATEGORIES = [
  { id: "all",       label: "All Products",           icon: Globe2  },
  { id: "books",     label: "Books",                  icon: BookOpen },
  { id: "crystals",  label: "Crystals & Stones",      icon: Gem     },
  { id: "oils",      label: "Essential Oils",         icon: Droplet },
  { id: "cleansing", label: "Cleansing & Sage Sets",  icon: Leaf    },
] as const;

const PRODUCTS: Product[] = [
  // ── Books ──
  {
    id: "book-spiritual-activator",
    title: "Spiritual Activator",
    desc: "By Oleg Gleizer. A powerful guide to activating your spiritual gifts and clearing dense energies.",
    category: "books", kind: "individual", icon: BookOpen,
    accentColor: "text-amber-300", accentBg: "bg-amber-500/15",
    retailPrice: 24.99,
  },
  {
    id: "book-6-empaths",
    title: "6 Different Types of Empaths",
    desc: "Discover which empath type you are and how to protect and channel your sensitivity as a gift.",
    category: "books", kind: "individual", icon: BookOpen,
    accentColor: "text-amber-300", accentBg: "bg-amber-500/15",
    retailPrice: 19.99,
  },
  {
    id: "book-women-thou-art-loosed",
    title: "Women Thou Art Loosed",
    desc: "By T.D. Jakes. Healing the wounds of the past — a landmark work on emotional and spiritual freedom for women.",
    category: "books", kind: "individual", icon: BookOpen,
    accentColor: "text-amber-300", accentBg: "bg-amber-500/15",
    retailPrice: 16.99,
  },
  {
    id: "book-chakra-vagus",
    title: "Chakra and Vagus Nerve",
    desc: "The bridge between energy medicine and modern polyvagal science — regulate your nervous system through your chakras.",
    category: "books", kind: "individual", icon: BookOpen,
    accentColor: "text-amber-300", accentBg: "bg-amber-500/15",
    retailPrice: 22.99,
  },
  {
    id: "book-set-foundations",
    title: "Healing Foundations — 4 Book Set",
    desc: "All four foundational Soul Echoes books shipped together at the deepest member savings.",
    category: "books", kind: "set", icon: Package,
    accentColor: "text-amber-300", accentBg: "bg-amber-500/15",
    retailPrice: 84.96,
  },

  // ── Crystals ──
  {
    id: "crystal-rose-quartz",
    title: "Raw Rose Quartz — Individual Stone",
    desc: "Ethically sourced raw rose quartz for heart-opening, self-love and gentle emotional healing.",
    category: "crystals", kind: "individual", icon: Gem,
    accentColor: "text-rose-300", accentBg: "bg-rose-500/15",
    retailPrice: 14.99,
  },
  {
    id: "crystal-amethyst",
    title: "Raw Amethyst Cluster",
    desc: "Natural amethyst for intuition, calm and spiritual protection.",
    category: "crystals", kind: "individual", icon: Gem,
    accentColor: "text-violet-300", accentBg: "bg-violet-500/15",
    retailPrice: 19.99,
  },
  {
    id: "crystal-black-tourmaline",
    title: "Black Tourmaline — Protection Stone",
    desc: "Raw black tourmaline for grounding, EMF protection and clearing dense energy.",
    category: "crystals", kind: "individual", icon: Gem,
    accentColor: "text-slate-300", accentBg: "bg-slate-500/15",
    retailPrice: 12.99,
  },
  {
    id: "crystal-set-grounding",
    title: "Grounding Crystal Set (4 stones)",
    desc: "Curated set: black tourmaline, hematite, smoky quartz, and red jasper — for stability and safety.",
    category: "crystals", kind: "set", icon: Package,
    accentColor: "text-rose-300", accentBg: "bg-rose-500/15",
    retailPrice: 54.99,
  },
  {
    id: "crystal-set-heart",
    title: "Heart-Opening Crystal Set (3 stones)",
    desc: "Rose quartz, green aventurine, and rhodonite — for self-love, forgiveness and gentle heart healing.",
    category: "crystals", kind: "set", icon: Package,
    accentColor: "text-rose-300", accentBg: "bg-rose-500/15",
    retailPrice: 44.99,
  },
  {
    id: "crystal-set-chakra",
    title: "Full Chakra Crystal Set (7 stones)",
    desc: "One raw stone for each of the 7 chakras, with a printed care and placement guide.",
    category: "crystals", kind: "set", icon: Package,
    accentColor: "text-violet-300", accentBg: "bg-violet-500/15",
    retailPrice: 79.99,
  },

  // ── Essential Oils ──
  {
    id: "oil-lavender",
    title: "Lavender Essential Oil (15ml)",
    desc: "100% pure therapeutic-grade lavender for calm, sleep and nervous-system regulation.",
    category: "oils", kind: "individual", icon: Droplet,
    accentColor: "text-violet-300", accentBg: "bg-violet-500/15",
    retailPrice: 18.99,
  },
  {
    id: "oil-frankincense",
    title: "Frankincense Essential Oil (15ml)",
    desc: "Sacred resin oil for meditation, spiritual grounding and cellular renewal.",
    category: "oils", kind: "individual", icon: Droplet,
    accentColor: "text-amber-300", accentBg: "bg-amber-500/15",
    retailPrice: 32.99,
  },
  {
    id: "oil-peppermint",
    title: "Peppermint Essential Oil (15ml)",
    desc: "Cooling, uplifting and mentally clarifying — for focus, headaches and energy.",
    category: "oils", kind: "individual", icon: Droplet,
    accentColor: "text-emerald-300", accentBg: "bg-emerald-500/15",
    retailPrice: 16.99,
  },
  {
    id: "oil-set-nervous-system",
    title: "Nervous System Trio (3 × 15ml)",
    desc: "Lavender + Frankincense + Vetiver — a curated set for calming, grounding and trauma release.",
    category: "oils", kind: "set", icon: Package,
    accentColor: "text-violet-300", accentBg: "bg-violet-500/15",
    retailPrice: 79.99,
  },
  {
    id: "oil-set-starter",
    title: "Essential Oils Starter Set (6 oils)",
    desc: "Lavender, peppermint, lemon, tea tree, eucalyptus, frankincense — the six most-used healing oils.",
    category: "oils", kind: "set", icon: Package,
    accentColor: "text-emerald-300", accentBg: "bg-emerald-500/15",
    retailPrice: 129.99,
  },

  // ── Cleansing & Sage ──
  {
    id: "cleansing-white-sage",
    title: "White Sage Smudge Bundle",
    desc: "Ethically harvested California white sage — for clearing spaces, homes and objects.",
    category: "cleansing", kind: "individual", icon: Leaf,
    accentColor: "text-lime-300", accentBg: "bg-lime-500/15",
    retailPrice: 12.99,
  },
  {
    id: "cleansing-palo-santo",
    title: "Palo Santo Sticks (5 pack)",
    desc: "Sustainably sourced Palo Santo — sweet, protective and uplifting sacred wood.",
    category: "cleansing", kind: "individual", icon: Flame,
    accentColor: "text-amber-300", accentBg: "bg-amber-500/15",
    retailPrice: 14.99,
  },
  {
    id: "cleansing-selenite-wand",
    title: "Selenite Cleansing Wand",
    desc: "A pure selenite wand for clearing your aura and charging other crystals.",
    category: "cleansing", kind: "individual", icon: Sparkles,
    accentColor: "text-slate-200", accentBg: "bg-slate-400/15",
    retailPrice: 15.99,
  },
  {
    id: "cleansing-set-starter",
    title: "Home Cleansing Starter Set",
    desc: "White sage bundle, palo santo sticks, selenite wand, abalone shell + printed ritual guide.",
    category: "cleansing", kind: "set", icon: Package,
    accentColor: "text-lime-300", accentBg: "bg-lime-500/15",
    retailPrice: 59.99,
  },
  {
    id: "cleansing-set-ceremony",
    title: "Full Ceremony Cleansing Kit",
    desc: "Everything in the Starter Set plus florida water, sea salt, black tourmaline and a lighter.",
    category: "cleansing", kind: "set", icon: Package,
    accentColor: "text-lime-300", accentBg: "bg-lime-500/15",
    retailPrice: 89.99,
  },
];

const PRACTITIONERS: Practitioner[] = [
  { id: "breathwork-maya", name: "Maya R.", specialty: "Breathwork Teacher", tags: ["Trauma-Informed", "Online", "Sliding Scale"], emoji: "🌬️", bio: "Certified holotropic breathwork facilitator specializing in nervous system regulation and somatic trauma release. 8 years experience.", accentColor: "from-sky-500/20 to-teal-500/20" },
  { id: "meditation-james", name: "James O.", specialty: "Meditation Guide", tags: ["Mindfulness", "MBSR", "Grief Support"], emoji: "🧘", bio: "Trained in MBSR and Vipassana traditions. Leads one-on-one and group sessions for anxiety, grief, and burnout recovery.", accentColor: "from-violet-500/20 to-purple-500/20" },
  { id: "yoga-sade", name: "Sadé M.", specialty: "Yoga Teacher & Healer", tags: ["Trauma-Sensitive", "Restorative", "Donation-Based"], emoji: "🌿", bio: "Trauma-sensitive yoga teacher (500-RYT) offering restorative and yin practices for healing, rest, and body reconnection.", accentColor: "from-emerald-500/20 to-teal-500/20" },
  { id: "energy-lena", name: "Lena V.", specialty: "Energy Worker & Reiki Master", tags: ["Reiki", "Chakra Work", "Remote Sessions"], emoji: "✨", bio: "Reiki Master Teacher and intuitive energy worker. Offers distance sessions and in-person work focused on emotional clearing.", accentColor: "from-amber-500/20 to-yellow-500/20" },
  { id: "sound-kwame", name: "Kwame A.", specialty: "Sound Healer", tags: ["Crystal Bowls", "Gong Bath", "Group & 1:1"], emoji: "🔔", bio: "Certified sound healing practitioner using Tibetan bowls, crystal singing bowls, and gongs. Trained in Integrative Sound Healing.", accentColor: "from-teal-500/20 to-cyan-500/20" },
  { id: "shaman-rose", name: "Rosa E.", specialty: "Shamanic Practitioner", tags: ["Ancestral Healing", "Soul Retrieval", "Ceremony"], emoji: "🦅", bio: "Trained in traditional shamanic practices for over 15 years. Specialises in soul retrieval, ancestral healing, and ceremony.", accentColor: "from-orange-500/20 to-rose-500/20" },
  { id: "intercessor-faith", name: "Faith W.", specialty: "Intercessor & Spiritual Director", tags: ["Prayer", "Spiritual Direction", "Trauma & Faith"], emoji: "🕊️", bio: "Ordained minister and trained spiritual director offering intercessory prayer and spiritual companionship.", accentColor: "from-indigo-500/20 to-violet-500/20" },
  { id: "vetted-healer-nadia", name: "Nadia L.", specialty: "Trauma-Informed Healer", tags: ["IFS", "Parts Work", "Energy Exchange"], emoji: "🌸", bio: "Trained in Internal Family Systems (IFS) and somatic practices. Offers parts work, nervous system support, and energy-exchange pricing.", accentColor: "from-pink-500/20 to-rose-500/20" },
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
  { id: "products",       label: "Shop",                 icon: ShoppingCart },
  { id: "practitioners",  label: "Practitioner Connect", icon: Users      },
  { id: "crisis",         label: "Crisis Counselor",     icon: ShieldAlert },
  { id: "book",           label: "Book a Session",       icon: Star       },
  { id: "saved",          label: "Wait & Save",          icon: Bookmark   },
] as const;
type SectionId = typeof SECTION_TABS[number]["id"];

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function loadSaved(): SavedItem[] {
  try { return JSON.parse(localStorage.getItem(SAVED_KEY) || "[]"); } catch { return []; }
}
function persistSaved(items: SavedItem[]) {
  localStorage.setItem(SAVED_KEY, JSON.stringify(items));
}
function loadCart(): CartItem[] {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); } catch { return []; }
}
function persistCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
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
          Exclusive <span className="font-bold text-teal-300">Member Pricing</span> on every physical product.
        </span>
      </div>
    </div>
  );
}

/* ─── Product Card ───────────────────────────────────────────────────────── */
function ProductCard({
  product, savedIds, onToggleSave, onAddToCart, onBuyNow,
}: {
  product: Product;
  savedIds: Set<string>;
  onToggleSave: (id: string, title: string) => void;
  onAddToCart: (p: Product) => void;
  onBuyNow: (p: Product) => void;
}) {
  const isSaved = savedIds.has(product.id);
  const Icon = product.icon;
  const memberPrice = itemMemberPrice(product);
  const tier = itemBaseTier(product);
  const savings = tier;
  const titleId = `product-${product.id}-title`;

  return (
    <motion.article
      layout
      className="rounded-2xl border border-white/10 bg-white/[0.04] overflow-hidden"
      aria-labelledby={titleId}
    >
      <div className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          <div
            className={`shrink-0 w-11 h-11 rounded-xl ${product.accentBg} flex items-center justify-center`}
            aria-hidden="true"
          >
            <Icon className={`h-5 w-5 ${product.accentColor}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 id={titleId} className="text-sm font-semibold text-foreground leading-tight">
              {product.title}
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5 uppercase tracking-wide">
              {product.kind === "set" ? "Curated Set · Ships together" : "Individual item"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onToggleSave(product.id, product.title)}
            aria-label={isSaved ? `Remove ${product.title} from saved` : `Save ${product.title} for later`}
            aria-pressed={isSaved}
            className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-teal-400 transition-colors"
          >
            {isSaved
              ? <BookmarkCheck className="h-4 w-4 text-teal-400" aria-hidden="true" />
              : <Bookmark className="h-4 w-4 text-muted-foreground" aria-hidden="true" />}
          </button>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">{product.desc}</p>

        {/* Member pricing */}
        <div
          className="rounded-xl border border-teal-400/30 bg-teal-500/10 px-3 py-2.5 flex items-center justify-between"
          role="group"
          aria-label={`Member price ${memberPrice.toFixed(2)} dollars, retail ${product.retailPrice.toFixed(2)}, save ${savings} percent (tier ${tier}%)`}
        >
          <div>
            <p className="text-[10px] uppercase tracking-wider text-teal-300/80 font-semibold">Member Price · {tier}% off</p>
            <p className="text-2xl font-bold text-teal-300 leading-tight">
              ${memberPrice.toFixed(2)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground line-through">
              Retail ${product.retailPrice.toFixed(2)}
            </p>
            <p className="text-[11px] font-semibold text-emerald-300">Save {savings}%</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onAddToCart(product)}
            aria-label={`Add ${product.title} to cart`}
            className="rounded-xl border-teal-400/40 text-teal-200 hover:bg-teal-500/15 text-sm"
          >
            <ShoppingCart className="h-4 w-4 mr-1.5" aria-hidden="true" /> Add to Cart
          </Button>
          <Button
            type="button"
            onClick={() => onBuyNow(product)}
            aria-label={`Buy ${product.title} now — ships to your address`}
            className="rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 border-0 text-sm font-semibold"
          >
            Buy Now <ArrowRight className="h-4 w-4 ml-1" aria-hidden="true" />
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground/60 text-center">
          Physical product · ships to your address
        </p>
      </div>
    </motion.article>
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
              <ShieldCheck className="h-2.5 w-2.5"  aria-hidden="true" /> Vetted
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
              ? <BookmarkCheck className="h-4 w-4 text-teal-400"  aria-hidden="true" />
              : <Bookmark className="h-4 w-4 text-muted-foreground"  aria-hidden="true" />}
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
                Book with {p.name.split(" ")[0]} <ArrowRight className="h-3.5 w-3.5 ml-1.5"  aria-hidden="true" />
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

  useEffect(() => { setActiveSection(initialSection); }, [initialSection]);

  const [productCategory, setProductCategory] = useState<string>("all");
  const [savedItems, setSavedItems] = useState<SavedItem[]>(loadSaved);
  const [cart, setCart] = useState<CartItem[]>(loadCart);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [bookedFor, setBookedFor] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const savedIds = new Set(savedItems.map((s) => s.id));
  const cartCount = cart.reduce((n, c) => n + c.qty, 0);
  const cartPricing = cartTotals(
    cart.map<PricingItem>((c) => ({
      id: c.id, category: c.category, kind: c.kind,
      retailPrice: c.retailPrice, qty: c.qty,
    })),
  );

  useEffect(() => { persistSaved(savedItems); }, [savedItems]);
  useEffect(() => { persistCart(cart); }, [cart]);

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

  const addToCart = (p: Product) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === p.id);
      if (existing) {
        return prev.map((c) => c.id === p.id ? { ...c, qty: c.qty + 1 } : c);
      }
      return [...prev, {
        id: p.id, title: p.title,
        retailPrice: p.retailPrice, category: p.category, kind: p.kind,
        qty: 1,
      }];
    });
    showToast(`Added "${p.title}" to cart`);
  };

  const buyNow = (p: Product) => {
    addToCart(p);
    showToast(`Proceeding to checkout for "${p.title}"`);
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
              <ShoppingCart className="h-5 w-5 text-white"  aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-display text-2xl font-bold bg-gradient-to-r from-teal-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent leading-tight">
                Shop
              </h1>
              <p className="text-xs text-teal-400/70">Physical healing tools · Books · Crystals · Oils · Cleansing</p>
            </div>
            {cartCount > 0 && (
              <div
                className="shrink-0 flex flex-col items-end gap-0.5 px-3 py-1.5 rounded-full bg-teal-500/20 border border-teal-400/40 text-teal-200 text-xs font-semibold"
                aria-label={`${cartCount} items in cart, cart discount tier ${cartPricing.tier} percent, member total ${cartPricing.memberTotal.toFixed(2)} dollars`}
              >
                <div className="flex items-center gap-1.5">
                  <ShoppingCart className="h-3.5 w-3.5" aria-hidden="true" />
                  {cartCount} · {cartPricing.tier}% off
                </div>
                <span className="text-[10px] text-teal-100/90 font-normal">
                  ${cartPricing.memberTotal.toFixed(2)}
                </span>
              </div>
            )}
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

          {/* ════ SHOP — PHYSICAL PRODUCTS ════ */}
          {activeSection === "products" && (
            <motion.div key="products" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 space-y-4">

              {/* Category filter */}
              <div
                className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none"
                role="tablist"
                aria-label="Filter products by category"
              >
                {PRODUCT_CATEGORIES.map((cat) => {
                  const active = productCategory === cat.id;
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setProductCategory(cat.id)}
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
                Physical healing tools shipped directly to you at{" "}
                <span className="text-teal-300 font-medium">exclusive member pricing</span>.
                All meditations, sound therapy and digital packs are already free inside your{" "}
                <span className="text-teal-300 font-medium">Tools</span> section based on your subscription tier.
              </p>

              <section
                aria-label={`${filteredProducts.length} physical products available`}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    savedIds={savedIds}
                    onToggleSave={(id, title) => toggleSave(id, title, "product")}
                    onAddToCart={addToCart}
                    onBuyNow={buyNow}
                  />
                ))}
              </section>
            </motion.div>
          )}

          {/* ════ FIND A PRACTITIONER ════ */}
          {activeSection === "practitioners" && (
            <motion.div key="practitioners" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 space-y-4">
              <div className="rounded-2xl bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border border-teal-400/20 p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-teal-400 shrink-0"  aria-hidden="true" />
                  <p className="text-sm font-semibold text-foreground">Every practitioner is vetted</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  All healers, teachers, and guides have agreed to Soul Echoes values — trauma-informed practice, inclusive access, confidentiality, non-judgment, and sliding scale pricing.
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
              <div className="rounded-2xl bg-gradient-to-r from-rose-500/15 to-amber-500/15 border border-rose-400/30 p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-rose-300 shrink-0"  aria-hidden="true" />
                  <p className="text-sm font-semibold text-foreground">You are not alone — help is here right now</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  If you're in crisis, hurting yourself, or thinking about ending your life — please reach out. These services are free, confidential, and available 24/7. You matter.
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-xs uppercase tracking-wider text-rose-300/80 font-semibold px-1">Call or text now · 24/7</p>
                <a href="tel:988" className="flex items-center gap-3 p-4 rounded-2xl border border-rose-400/40 bg-rose-500/10 hover:bg-rose-500/15 transition-colors">
                  <div className="shrink-0 w-11 h-11 rounded-xl bg-rose-500/25 border border-rose-400/40 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-rose-300"  aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">988 — Suicide & Crisis Lifeline</p>
                    <p className="text-xs text-muted-foreground">Call or text 988 · Free, confidential, 24/7 (US & Canada)</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-rose-300 shrink-0"  aria-hidden="true" />
                </a>
                <a href="sms:741741?body=HOME" className="flex items-center gap-3 p-4 rounded-2xl border border-amber-400/40 bg-amber-500/10 hover:bg-amber-500/15 transition-colors">
                  <div className="shrink-0 w-11 h-11 rounded-xl bg-amber-500/25 border border-amber-400/40 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-amber-300"  aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">Crisis Text Line</p>
                    <p className="text-xs text-muted-foreground">Text <span className="font-semibold text-amber-300">HOME</span> to 741741 · Free, 24/7</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-amber-300 shrink-0"  aria-hidden="true" />
                </a>
                <a href="tel:911" className="flex items-center gap-3 p-4 rounded-2xl border border-red-500/40 bg-red-500/10 hover:bg-red-500/15 transition-colors">
                  <div className="shrink-0 w-11 h-11 rounded-xl bg-red-500/25 border border-red-400/40 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-red-300"  aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">911 — Emergency</p>
                    <p className="text-xs text-muted-foreground">If you or someone is in immediate physical danger</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-red-300 shrink-0"  aria-hidden="true" />
                </a>
              </div>

              <div className="space-y-2 pt-2">
                <p className="text-xs uppercase tracking-wider text-teal-300/80 font-semibold px-1">Specialized support</p>
                {[
                  { name: "The Trevor Project", desc: "LGBTQ+ youth · Call 1-866-488-7386 · Text START to 678-678", href: "tel:18664887386" },
                  { name: "Trans Lifeline", desc: "Peer support by & for trans people · 1-877-565-8860", href: "tel:18775658860" },
                  { name: "Veterans Crisis Line", desc: "Dial 988 then press 1 · Text 838255", href: "tel:988" },
                  { name: "SAMHSA National Helpline", desc: "Substance use & mental health · 1-800-662-4357", href: "tel:18006624357" },
                  { name: "RAINN — Sexual Assault Hotline", desc: "1-800-656-4673 · Confidential 24/7 support", href: "tel:18006564673" },
                  { name: "National Domestic Violence Hotline", desc: "1-800-799-7233 · Text START to 88788", href: "tel:18007997233" },
                ].map((r) => (
                  <a key={r.name} href={r.href} className="flex items-center gap-3 p-3.5 rounded-2xl border border-white/10 bg-white/[0.04] hover:border-white/20 transition-colors">
                    <div className="shrink-0 w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <Phone className="h-4 w-4 text-foreground/70"  aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{r.name}</p>
                      <p className="text-xs text-muted-foreground leading-snug">{r.desc}</p>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground shrink-0"  aria-hidden="true" />
                  </a>
                ))}
              </div>

              <div className="rounded-2xl bg-teal-500/10 border border-teal-400/25 p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-teal-300"  aria-hidden="true" />
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
                  <Star className="h-4 w-4 text-teal-400 shrink-0"  aria-hidden="true" />
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
                        active ? `${method.bg} ${method.border} shadow-[0_0_14px_rgba(45,212,191,0.2)]` : "bg-white/[0.03] border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className={`shrink-0 w-9 h-9 rounded-xl ${method.bg} border ${method.border} flex items-center justify-center`}>
                        <Icon className={`h-4 w-4 ${method.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{method.label}</p>
                        <p className="text-xs text-muted-foreground leading-snug">{method.desc}</p>
                      </div>
                      {active && <Check className="h-4 w-4 text-teal-400 shrink-0"  aria-hidden="true" />}
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
                    Confirm Booking <ArrowRight className="h-4 w-4 ml-2"  aria-hidden="true" />
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
              <div className="rounded-2xl bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border border-teal-400/20 p-4 space-y-1.5">
                <div className="flex items-center gap-2">
                  <BookmarkCheck className="h-5 w-5 text-teal-400"  aria-hidden="true" />
                  <p className="text-sm font-semibold text-foreground">Save now, purchase when ready</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Bookmark any product or practitioner. Turn on notifications and we'll let you know when you're ready — or when a spot opens up.
                </p>
              </div>
              {savedItems.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Bookmark className="h-10 w-10 text-teal-400/30 mx-auto"  aria-hidden="true" />
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
                    Browse Shop
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {savedItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/10 bg-white/[0.04]">
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
                        {item.notifyWhenReady ? <Bell className="h-3.5 w-3.5"  aria-hidden="true" /> : <BellOff className="h-3.5 w-3.5"  aria-hidden="true" />}
                      </button>
                      <button
                        onClick={() => toggleSave(item.id, item.title)}
                        aria-label="Remove from saved"
                        className="h-8 w-8 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-muted-foreground hover:text-rose-400 transition-colors"
                      >
                        <BookmarkCheck className="h-3.5 w-3.5"  aria-hidden="true" />
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
