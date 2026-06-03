import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Accessibility, AlertTriangle, Apple, Bandage, Bath, BatteryLow, Bed, Bell, Brain,
  BrickWall, Bus, Car, Circle, CircleOff, ClipboardList, Clock, CloudFog, CloudLightning,
  Coffee, Compass, CupSoda, DollarSign, DoorClosed, DoorOpen, Droplets, Ear, Eye,
  Flame, Flower, Flower2, Footprints, Gem, GitBranch, Globe2, Hand, HandCoins,
  HandHeart, HandHelping, Handshake, Headphones, Heart, HeartCrack, HeartHandshake,
  HeartPulse, Home, KeyRound, Lamp, Leaf, Lightbulb, Link, Lock, MapPin, MessageCircle,
  Milk, Moon, Mountain, Pill, Rainbow, RefreshCcw, Route, Salad, Scissors, Send,
  Shield, ShieldAlert, ShieldCheck, Shirt, ShowerHead, Siren, Snowflake, Soup, Sparkles,
  Sprout, Star, Stethoscope, Sun, Sunrise, Sword, Theater, Thermometer, Toilet,
  TreePine, UserRound, Users, Utensils, VolumeX, Waves, Weight, Wind, X, Zap,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// 33 feelings — color is meaningful, not decorative
const FEELINGS = [
  { name: "Sad",         color: "#1E3A5F", desc: "heavy, low, tearful" },
  { name: "Angry",       color: "#E63946", desc: "mad, furious, heated" },
  { name: "Anxious",     color: "#9B7EBD", desc: "worried, on edge" },
  { name: "Scared",      color: "#4A4E69", desc: "afraid, fearful" },
  { name: "Lonely",      color: "#577590", desc: "alone, disconnected" },
  { name: "Hopeless",    color: "#2B2D42", desc: "no way out, dark" },
  { name: "Numb",        color: "#6C757D", desc: "empty, nothing, blank" },
  { name: "Tired",       color: "#5C6B73", desc: "exhausted, drained" },
  { name: "Overwhelmed", color: "#7251B5", desc: "too much, drowning" },
  { name: "Confused",    color: "#8338EC", desc: "lost, foggy, unclear" },
  { name: "Ashamed",     color: "#6A0572", desc: "small, hiding, guilty" },
  { name: "Guilty",      color: "#5B2A86", desc: "did wrong, regret" },
  { name: "Hurt",        color: "#C1666B", desc: "wounded, aching" },
  { name: "Betrayed",    color: "#8B2635", desc: "lied to, broken trust" },
  { name: "Rejected",    color: "#A4133C", desc: "pushed away, unwanted" },
  { name: "Jealous",     color: "#386641", desc: "envy, longing" },
  { name: "Frustrated",  color: "#BC4749", desc: "stuck, blocked" },
  { name: "Disgusted",   color: "#606C38", desc: "repulsed, turned off" },
  { name: "Restless",    color: "#DDA15E", desc: "can't sit still" },
  { name: "Embarrassed", color: "#E07A5F", desc: "exposed, awkward" },
  { name: "Calm",        color: "#A8DADC", desc: "settled, at ease" },
  { name: "Peaceful",    color: "#CAD2C5", desc: "quiet, still" },
  { name: "Safe",        color: "#8B5E3C", desc: "protected, grounded" },
  { name: "Hopeful",     color: "#F4A261", desc: "light ahead, expectant" },
  { name: "Grateful",    color: "#E9C46A", desc: "thankful, blessed" },
  { name: "Loved",       color: "#FF8FA3", desc: "held, cherished" },
  { name: "Happy",       color: "#FFD166", desc: "light, glad" },
  { name: "Joyful",      color: "#FFB627", desc: "bursting, alive" },
  { name: "Excited",     color: "#FB5607", desc: "energized, eager" },
  { name: "Proud",       color: "#FFB400", desc: "accomplished, strong" },
  { name: "Curious",     color: "#06AED5", desc: "wondering, open" },
  { name: "Inspired",    color: "#7B2CBF", desc: "moved, lit up" },
  { name: "Healing",     color: "#2A9D8F", desc: "growing, mending" },
  { name: "I don't know", color: "#6C757D", desc: "help me find it" },
];

// Colors with their emotional & spiritual meanings — shown as reference cards, not just dots
const COLOR_MEANINGS = [
  { hex: "#1E3A5F", name: "Deep Blue",      meaning: "Sadness, grief, the weight of sorrow" },
  { hex: "#E63946", name: "Red",            meaning: "Anger, passion, intense raw emotion" },
  { hex: "#F4A261", name: "Warm Orange",    meaning: "Comfort, warmth, hope returning" },
  { hex: "#2A9D8F", name: "Teal",           meaning: "Calm, healing, emotional flow" },
  { hex: "#264653", name: "Deep Teal",      meaning: "Solitude, withdrawal, heavy quiet" },
  { hex: "#E9C46A", name: "Golden Yellow",  meaning: "Joy, gratitude, inner light" },
  { hex: "#6A0572", name: "Deep Purple",    meaning: "Grief, mystery, spiritual pain" },
  { hex: "#9B7EBD", name: "Soft Purple",    meaning: "Anxiety, spiritual longing, sensitivity" },
  { hex: "#1D1D1D", name: "Black",          meaning: "Emptiness, the void, darkness inside" },
  { hex: "#F1FAEE", name: "Soft White",     meaning: "Peace, new beginning, surrender" },
  { hex: "#A8DADC", name: "Light Blue",     meaning: "Gentleness, openness, tearfulness" },
  { hex: "#8B5E3C", name: "Earth Brown",    meaning: "Grounding, safety, rootedness" },
  { hex: "#FF8FA3", name: "Soft Pink",      meaning: "Love, tenderness, nurturing care" },
  { hex: "#386641", name: "Forest Green",   meaning: "Growth, nature healing, envy" },
  { hex: "#C1666B", name: "Dusty Rose",     meaning: "Longing, old wounds, tender ache" },
  { hex: "#FFD166", name: "Bright Yellow",  meaning: "Happiness, childlike joy, lightness" },
];

// Better symbol list — 4 spiritually meaningful categories
const SYMBOL_GROUPS = [
  {
    title: "Pain & Struggle",
    symbols: [
      { icon: HeartCrack, name: "Heartbroken", meaning: "loss, breakup, grief" },
      { icon: CloudLightning, name: "Crisis", meaning: "everything feels urgent" },
      { icon: Flame, name: "Angry", meaning: "mad, heated, ready to snap" },
      { icon: Link, name: "Trapped", meaning: "can't get out" },
      { icon: CircleOff, name: "Empty", meaning: "hollow, nothing inside" },
      { icon: BrickWall, name: "Blocked", meaning: "can't move forward" },
      { icon: CloudFog, name: "Foggy", meaning: "can't think clearly" },
      { icon: RefreshCcw, name: "Spiraling", meaning: "thoughts won't stop" },
      { icon: Theater, name: "Masking", meaning: "hiding how I feel" },
      { icon: Weight, name: "Heavy", meaning: "weight on my body" },
      { icon: Moon, name: "Dark Place", meaning: "deep sadness" },
      { icon: Bandage, name: "Still Hurting", meaning: "the wound is active" },
      { icon: Snowflake, name: "Frozen", meaning: "shut down, can't act" },
      { icon: Zap, name: "Panic", meaning: "body alarm is going off" },
      { icon: ShieldAlert, name: "Unsafe", meaning: "I don't feel safe" },
      { icon: Flower2, name: "Grieving", meaning: "missing someone or something" },
      { icon: Sword, name: "Betrayed", meaning: "trust was broken" },
      { icon: Mountain, name: "Too Much", meaning: "overwhelmed by everything" },
      { icon: Lock, name: "Stuck", meaning: "can't get free" },
      { icon: DoorClosed, name: "Rejected", meaning: "shut out or unwanted" },
      { icon: GitBranch, name: "Tangled", meaning: "messy, complicated, trapped" },
      { icon: BatteryLow, name: "Exhausted", meaning: "running on empty" },
      { icon: UserRound, name: "Want to Hide", meaning: "don't want to be seen" },
      { icon: Scissors, name: "Cut Off", meaning: "disconnected from people" },
      { icon: Shield, name: "Guarded", meaning: "can't let anyone close" },
      { icon: Route, name: "Lost", meaning: "don't know what to do" },
      { icon: Droplets, name: "Crying", meaning: "tears need to come out" },
      { icon: AlertTriangle, name: "Triggered", meaning: "something set me off" },
      { icon: Siren, name: "Flashback", meaning: "the past feels present" },
      { icon: VolumeX, name: "Shutdown", meaning: "can't talk or respond" },
      { icon: HeartPulse, name: "Tight Chest", meaning: "pressure in my chest" },
      { icon: Brain, name: "Racing Thoughts", meaning: "mind won't slow down" },
      { icon: Thermometer, name: "Body Pain", meaning: "my body hurts" },
      { icon: Hand, name: "Headache", meaning: "head pain or pressure" },
      { icon: HeartPulse, name: "Stomach Pain", meaning: "sick or tight stomach" },
      { icon: Footprints, name: "Restless", meaning: "can't settle my body" },
      { icon: Wind, name: "Can't Breathe", meaning: "breath feels hard" },
      { icon: Bed, name: "Burned Out", meaning: "too drained to keep going" },
      { icon: Eye, name: "Dissociated", meaning: "not fully here" },
      { icon: MessageCircle, name: "Conflict", meaning: "argument or tension" },
      { icon: Users, name: "Lonely", meaning: "I need connection" },
      { icon: Headphones, name: "Overstimulated", meaning: "too much sound or input" },
      { icon: MapPin, name: "Pressed", meaning: "too much pressure on me" },
      { icon: Heart, name: "Not Okay", meaning: "I need help right now" },
    ],
  },
  {
    title: "Healing & Hope",
    symbols: [
      { emoji: "🌅", name: "Sunrise",        meaning: "a new day is coming" },
      { emoji: "🦋", name: "Butterfly",      meaning: "transformation in progress" },
      { emoji: "🌱", name: "Sprout",         meaning: "something new is growing" },
      { emoji: "🌈", name: "Rainbow",        meaning: "after the storm" },
      { emoji: "🕯️", name: "Candle",         meaning: "small light in darkness" },
      { emoji: "🗝️", name: "Key",            meaning: "a breakthrough unlocking" },
      { emoji: "🌸", name: "Bloom",          meaning: "opening up, becoming" },
      { emoji: "✨", name: "Sparkles",       meaning: "coming alive again" },
      { emoji: "🌊", name: "Wave",           meaning: "releasing, letting go" },
      { emoji: "🌿", name: "Leaves",         meaning: "grounding, returning to earth" },
      { emoji: "❤️‍🩹", name: "Mending Heart", meaning: "healing from pain" },
      { emoji: "🌟", name: "New Star",       meaning: "something bright emerging" },
      { emoji: "🌳", name: "Tree",           meaning: "rooted, growing strong" },
      { emoji: "🪴", name: "Potted Plant",   meaning: "tending to myself" },
      { emoji: "🌻", name: "Sunflower",      meaning: "turning toward the light" },
      { emoji: "🛤️", name: "Path",           meaning: "finding my way forward" },
      { emoji: "🧘", name: "Stillness",      meaning: "coming back to center" },
      { emoji: "🪷", name: "Lotus",          meaning: "beauty from the mud" },
      { emoji: "🌤️", name: "Sun Breaking",   meaning: "light through the clouds" },
      { emoji: "🪶", name: "Feather",        meaning: "light, soft, gentle with self" },
      { emoji: "🧵", name: "Thread",         meaning: "weaving myself back together" },
      { emoji: "🫧", name: "Bubbles",        meaning: "lightness, play returning" },
      { emoji: "🍃", name: "Soft Breeze",    meaning: "ease moving through me" },
      { emoji: "🐚", name: "Shell",          meaning: "carrying my own quiet" },
      { emoji: "🌷", name: "First Tulip",    meaning: "spring inside me again" },
      { emoji: "🪺", name: "Nest",           meaning: "tender, building safety" },
      { emoji: "🍯", name: "Honey",          meaning: "sweetness coming back" },
      { emoji: "🌠", name: "Wish",           meaning: "daring to hope again" },
      { emoji: "🏞️", name: "Wide Open",      meaning: "room to breathe and become" },
      { emoji: "🪞", name: "Clear Mirror",   meaning: "seeing my true self again" },
      { emoji: "🎶", name: "Song",           meaning: "music returning to me" },
      { emoji: "🌎", name: "Whole World",    meaning: "I'm part of something bigger" },
      { emoji: "🪟", name: "Open Window",    meaning: "light coming in" },
    ],
  },
  {
    title: "Spirit & Faith",
    symbols: [
      { emoji: "🕊️", name: "Dove",           meaning: "peace, the Holy Spirit" },
      { emoji: "🙏", name: "Prayer",         meaning: "turning to God" },
      { emoji: "🪽",  name: "Wings",          meaning: "watched over, angels near" },
      { emoji: "⭐", name: "Guiding Star",   meaning: "divine direction" },
      { emoji: "💫", name: "Holy Light",     meaning: "spiritual presence felt" },
      { emoji: "🫶", name: "Held Heart",     meaning: "God is holding me" },
      { emoji: "✝️", name: "Cross",          meaning: "faith, redemption, surrender" },
      { emoji: "🌙", name: "Sacred Night",   meaning: "rest in the mystery" },
      { emoji: "🔮", name: "Vision",         meaning: "receiving insight or clarity" },
      { emoji: "🌐", name: "Universe",       meaning: "I am not alone in this" },
      { emoji: "🪬", name: "Protection",     meaning: "I am shielded" },
      { emoji: "💎", name: "Diamond",        meaning: "refined by pressure, precious" },
      { emoji: "🔥", name: "Sacred Fire",    meaning: "Spirit is moving in me" },
      { emoji: "💧", name: "Living Water",   meaning: "being made new" },
      { emoji: "📜", name: "Scripture",      meaning: "a word for this moment" },
      { emoji: "🛐", name: "Surrender",      meaning: "I let go and trust" },
      { emoji: "🌀", name: "Sacred Spiral",  meaning: "unwound and remade" },
      { emoji: "🌞", name: "Sun Glory",      meaning: "His face shining on me" },
      { emoji: "🗻", name: "Holy Mountain",  meaning: "meeting God in the high place" },
      { emoji: "🕯️", name: "Sanctuary",      meaning: "this is holy ground" },
      { emoji: "🌌", name: "Heavens",        meaning: "held by something vast" },
      { emoji: "🧎", name: "Kneeling",       meaning: "humble before the Holy" },
      { emoji: "🤍", name: "Pure Heart",     meaning: "asking to be made clean" },
      { emoji: "🔔", name: "Call",           meaning: "I hear You; here I am" },
      { emoji: "🌊", name: "Tide of Grace",  meaning: "mercy washing over me" },
      { emoji: "🪔", name: "Inner Lamp",     meaning: "the Spirit lit within me" },
      { emoji: "🕌", name: "Holy House",     meaning: "I belong in sacred space" },
      { emoji: "📖", name: "Open Book",      meaning: "ready to receive a word" },
      { emoji: "🌒", name: "Crescent",       meaning: "growing into the light" },
      { emoji: "🫧", name: "Anointing",      meaning: "set apart, blessed today" },
      { emoji: "🐑", name: "Lamb",           meaning: "led by the Shepherd" },
      { emoji: "🌳", name: "Tree of Life",   meaning: "rooted in something eternal" },
      { emoji: "🤝", name: "Covenant",       meaning: "I am held by promise" },
    ],
  },
  {
    title: "What I Need",
    symbols: [
      { emoji: "🫂", name: "A Hug",          meaning: "need to be held" },
      { emoji: "😭", name: "To Cry",         meaning: "need to release it" },
      { emoji: "🗣️", name: "To Speak",       meaning: "need to say it out loud" },
      { emoji: "👂", name: "To Be Heard",    meaning: "just listen to me" },
      { emoji: "🛡️", name: "Safety",         meaning: "I need protection" },
      { emoji: "🤝", name: "Support",        meaning: "walk beside me" },
      { emoji: "💤", name: "Rest",           meaning: "I am depleted" },
      { emoji: "🤲", name: "Help",           meaning: "I am reaching out" },
      { emoji: "✋", name: "Boundary",       meaning: "I need space" },
      { emoji: "🌬️", name: "Fresh Air",      meaning: "I need to breathe" },
      { emoji: "🍵", name: "Comfort",        meaning: "warmth and care" },
      { emoji: "💬", name: "Validation",     meaning: "tell me I'm not alone" },
      { emoji: "🤫", name: "Quiet",          meaning: "I need it to be still" },
      { emoji: "🧎", name: "To Be Witnessed",meaning: "see me as I am" },
      { emoji: "🚪", name: "An Exit",        meaning: "I need to leave the situation" },
      { emoji: "🧊", name: "To Slow Down",   meaning: "pause, cool everything off" },
      { emoji: "🌱", name: "Tenderness",     meaning: "handle me gently" },
      { emoji: "🔦", name: "Clarity",        meaning: "help me see what's true" },
      { emoji: "🧭", name: "Direction",      meaning: "I don't know where to go" },
      { emoji: "🙇", name: "Forgiveness",    meaning: "to give it or receive it" },
      { emoji: "🤍", name: "To Be Loved",    meaning: "without having to earn it" },
      { emoji: "🍞", name: "Nourishment",    meaning: "feed my body and soul" },
      { emoji: "🧴", name: "Care",           meaning: "someone to tend to me" },
      { emoji: "📿", name: "Prayer Covering",meaning: "intercession around me" },
      { emoji: "🆘", name: "Rescue",         meaning: "I cannot do this alone" },
      { emoji: "🌡️", name: "Regulation",     meaning: "help me come back to baseline" },
      { emoji: "🧸", name: "Soft Comfort",   meaning: "something safe to hold" },
      { emoji: "🛁", name: "To Be Cleansed", meaning: "wash today off of me" },
      { emoji: "📞", name: "Connection",     meaning: "I need to hear a voice" },
      { emoji: "🪴", name: "Tending",        meaning: "I need to be cared for like a plant" },
      { emoji: "🕰️", name: "Time",           meaning: "let me move at my own pace" },
      { emoji: "🫀", name: "Be With Me",     meaning: "stay close, don't leave" },
      { emoji: "🤱", name: "Mothering",      meaning: "the kind of love I missed" },
    ],
  },
];

interface Props {
  onSend: (message: string) => void;
  disabled?: boolean;
}

type SelectedColor = typeof COLOR_MEANINGS[number];
type SelectedSymbol = { icon: LucideIcon; name: string; meaning: string };

export default function ColorSymbolCanvas({ onSend, disabled }: Props) {
  const [selectedFeelings, setSelectedFeelings] = useState<typeof FEELINGS[number][]>([]);
  const [selectedColors,   setSelectedColors]   = useState<SelectedColor[]>([]);
  const [selectedSymbols,  setSelectedSymbols]  = useState<SelectedSymbol[]>([]);

  const toggleFeeling = (f: typeof FEELINGS[number]) =>
    setSelectedFeelings((prev) =>
      prev.find((x) => x.name === f.name) ? prev.filter((x) => x.name !== f.name) : [...prev, f]
    );

  const toggleColor = (c: SelectedColor) =>
    setSelectedColors((prev) =>
      prev.find((x) => x.hex === c.hex) ? prev.filter((x) => x.hex !== c.hex) : [...prev, c]
    );

  const toggleSymbol = (s: SelectedSymbol) =>
    setSelectedSymbols((prev) =>
      prev.find((x) => x.emoji === s.emoji) ? prev.filter((x) => x.emoji !== s.emoji) : [...prev, s]
    );

  const hasSelection = selectedFeelings.length > 0 || selectedColors.length > 0 || selectedSymbols.length > 0;

  const handleSend = () => {
    if (!hasSelection) return;
    let message = "[Expressed without typing]\n";
    if (selectedFeelings.length > 0) {
      const names = selectedFeelings.map((f) => f.name.toLowerCase());
      message += `Feelings: ${names.join(", ")}\n`;
      if (names.includes("i don't know"))
        message += `(They can't name it yet — gently guide them to uncover the emotion underneath.)\n`;
    }
    if (selectedColors.length > 0)
      message += `Colors: ${selectedColors.map((c) => `${c.name} — ${c.meaning}`).join("; ")}\n`;
    if (selectedSymbols.length > 0)
      message += `Symbols: ${selectedSymbols.map((s) => `${s.emoji} ${s.name} (${s.meaning})`).join(", ")}`;
    onSend(message.trim());
    setSelectedFeelings([]);
    setSelectedColors([]);
    setSelectedSymbols([]);
  };

  return (
    <div className="space-y-5 p-4 max-h-[60vh] overflow-y-auto">

      {/* Selected preview */}
      {hasSelection && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="flex flex-wrap gap-2 p-3 bg-card rounded-xl border border-border"
          aria-live="polite"
        >
          {selectedFeelings.map((f) => (
            <button key={f.name} onClick={() => toggleFeeling(f)}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border-2 border-foreground/20"
              style={{ backgroundColor: f.color, color: "#fff", textShadow: "0 1px 2px rgba(0,0,0,0.4)" }}
              aria-label={`Remove ${f.name}`}
            >
              {f.name} <X className="h-3 w-3" />
            </button>
          ))}
          {selectedColors.map((c) => (
            <button key={c.hex} onClick={() => toggleColor(c)}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full border-2 border-foreground/20 text-xs font-medium"
              style={{ backgroundColor: c.hex, color: "#fff", textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
              aria-label={`Remove color ${c.name}`}
            >
              {c.name} <X className="h-3 w-3" />
            </button>
          ))}
          {selectedSymbols.map((s) => (
            <button key={s.emoji} onClick={() => toggleSymbol(s)}
              className="inline-flex items-center gap-1 text-sm px-2 py-1 rounded-full bg-muted hover:bg-muted/70"
              aria-label={`Remove ${s.name}`}
            >
              <span aria-hidden="true">{s.emoji}</span>
              <span>{s.name}</span>
              <X className="h-3 w-3" />
            </button>
          ))}
        </motion.div>
      )}

      {/* ── Feelings grid ── */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
          Tap any feelings that match — pick as many as you want
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2" role="group" aria-label="Feelings">
          {FEELINGS.map((f) => {
            const selected = selectedFeelings.some((x) => x.name === f.name);
            return (
              <button key={f.name} onClick={() => toggleFeeling(f)} disabled={disabled}
                className={`relative px-3 py-3 rounded-xl text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-ring text-left ${
                  selected ? "ring-2 ring-primary scale-[1.02] shadow-md" : "hover:scale-[1.02]"
                }`}
                style={{ backgroundColor: f.color, color: "#fff", textShadow: "0 1px 2px rgba(0,0,0,0.45)" }}
                aria-label={`${f.name} — ${f.desc}`} aria-pressed={selected}
              >
                <span className="block leading-tight">{f.name}</span>
                <span className="block text-[10px] font-normal opacity-90 mt-0.5 leading-tight">{f.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Color Meanings — reference cards with visible meaning text ── */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
          What color matches your feeling right now?
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {COLOR_MEANINGS.map((c) => {
            const selected = selectedColors.some((x) => x.hex === c.hex);
            return (
              <button key={c.hex} onClick={() => toggleColor(c)} disabled={disabled}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-ring text-left ${
                  selected ? "border-primary scale-[1.02] shadow-md" : "border-transparent hover:scale-[1.01]"
                }`}
                style={{ backgroundColor: c.hex + "22", borderColor: selected ? undefined : c.hex + "55" }}
                aria-label={`${c.name} — ${c.meaning}`} aria-pressed={selected}
              >
                <span className="flex-shrink-0 h-8 w-8 rounded-full border border-foreground/20 shadow-sm"
                  style={{ backgroundColor: c.hex }} aria-hidden="true" />
                <span className="min-w-0">
                  <span className="block text-xs font-semibold text-foreground leading-tight">{c.name}</span>
                  <span className="block text-[10px] text-muted-foreground leading-tight mt-0.5">{c.meaning}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Symbols — organized into 4 meaningful categories ── */}
      <div className="space-y-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Choose symbols that speak what words can't
        </p>
        {SYMBOL_GROUPS.map((group) => (
          <div key={group.title}>
            <p className="text-[11px] font-bold text-primary/80 uppercase tracking-widest mb-1.5">
              {group.title}
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
              {group.symbols.map((s) => {
                const selected = selectedSymbols.some((x) => x.emoji === s.emoji);
                return (
                  <button key={s.emoji} onClick={() => toggleSymbol(s)} disabled={disabled}
                    className={`flex flex-col items-center gap-0.5 p-2 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-ring ${
                      selected
                        ? "bg-primary/15 border-primary ring-1 ring-primary scale-105"
                        : "bg-card border-border hover:bg-muted"
                    }`}
                    aria-label={`${s.name} — ${s.meaning}`} aria-pressed={selected}
                    title={s.meaning}
                  >
                    <span className="text-2xl leading-none" aria-hidden="true">{s.emoji}</span>
                    <span className="text-[9px] font-medium text-foreground leading-tight text-center">{s.name}</span>
                    <span className="text-[8px] text-muted-foreground leading-tight text-center hidden sm:block">{s.meaning}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ── Send ── */}
      <div className="flex justify-center pt-1 pb-2">
        <Button onClick={handleSend} disabled={!hasSelection || disabled}
          size="lg" className="rounded-2xl px-8 text-base" aria-label="Send your expression"
        >
          <Send className="h-4 w-4 mr-2" /> Send Expression
        </Button>
      </div>
    </div>
  );
}
