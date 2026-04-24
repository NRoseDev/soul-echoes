import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

// 33 feelings (angel number) — each with a name, color, and short description
// Color is decorative/supportive only; the WORD is the primary signal so this
// works for color-blind, low-vision, and screen-reader users.
const FEELINGS = [
  { name: "Sad", color: "#1E3A5F", desc: "heavy, low, tearful" },
  { name: "Angry", color: "#E63946", desc: "mad, furious, heated" },
  { name: "Anxious", color: "#9B7EBD", desc: "worried, on edge" },
  { name: "Scared", color: "#4A4E69", desc: "afraid, fearful" },
  { name: "Lonely", color: "#577590", desc: "alone, disconnected" },
  { name: "Hopeless", color: "#2B2D42", desc: "no way out, dark" },
  { name: "Numb", color: "#6C757D", desc: "empty, nothing, blank" },
  { name: "Tired", color: "#5C6B73", desc: "exhausted, drained" },
  { name: "Overwhelmed", color: "#7251B5", desc: "too much, drowning" },
  { name: "Confused", color: "#8338EC", desc: "lost, foggy, unclear" },
  { name: "Ashamed", color: "#6A0572", desc: "small, hiding, guilty" },
  { name: "Guilty", color: "#5B2A86", desc: "did wrong, regret" },
  { name: "Hurt", color: "#C1666B", desc: "wounded, aching" },
  { name: "Betrayed", color: "#8B2635", desc: "lied to, broken trust" },
  { name: "Rejected", color: "#A4133C", desc: "pushed away, unwanted" },
  { name: "Jealous", color: "#386641", desc: "envy, longing" },
  { name: "Frustrated", color: "#BC4749", desc: "stuck, blocked" },
  { name: "Disgusted", color: "#606C38", desc: "repulsed, turned off" },
  { name: "Restless", color: "#DDA15E", desc: "can't sit still" },
  { name: "Embarrassed", color: "#E07A5F", desc: "exposed, awkward" },
  { name: "Calm", color: "#A8DADC", desc: "settled, at ease" },
  { name: "Peaceful", color: "#CAD2C5", desc: "quiet, still" },
  { name: "Safe", color: "#8B5E3C", desc: "protected, grounded" },
  { name: "Hopeful", color: "#F4A261", desc: "light ahead, expectant" },
  { name: "Grateful", color: "#E9C46A", desc: "thankful, blessed" },
  { name: "Loved", color: "#FF8FA3", desc: "held, cherished" },
  { name: "Happy", color: "#FFD166", desc: "light, glad" },
  { name: "Joyful", color: "#FFB627", desc: "bursting, alive" },
  { name: "Excited", color: "#FB5607", desc: "energized, eager" },
  { name: "Proud", color: "#FFB400", desc: "accomplished, strong" },
  { name: "Curious", color: "#06AED5", desc: "wondering, open" },
  { name: "Inspired", color: "#7B2CBF", desc: "moved, lit up" },
  { name: "Healing", color: "#2A9D8F", desc: "growing, mending" },
  { name: "I don't know", color: "#6C757D", desc: "help me find it" },
];

const COLORS = [
  { hex: "#1E3A5F", name: "dark blue", meaning: "sadness, depth" },
  { hex: "#E63946", name: "red", meaning: "anger, intensity" },
  { hex: "#F4A261", name: "warm orange", meaning: "comfort, hope" },
  { hex: "#2A9D8F", name: "teal", meaning: "calm, healing" },
  { hex: "#264653", name: "deep teal", meaning: "solitude, weight" },
  { hex: "#E9C46A", name: "golden yellow", meaning: "joy, energy" },
  { hex: "#6A0572", name: "deep purple", meaning: "grief, mystery" },
  { hex: "#1D1D1D", name: "black", meaning: "emptiness, unknown" },
  { hex: "#F1FAEE", name: "soft white", meaning: "peace, new start" },
  { hex: "#A8DADC", name: "light blue", meaning: "gentleness, openness" },
  { hex: "#8B5E3C", name: "earth brown", meaning: "grounding, safety" },
  { hex: "#C1666B", name: "dusty rose", meaning: "tenderness, longing" },
];

// 33 symbols (angel number) — visual metaphors for what's hard to put into words
const SYMBOLS = [
  { emoji: "💔", name: "broken heart", meaning: "heartbreak, loss" },
  { emoji: "❤️‍🩹", name: "mending heart", meaning: "healing from pain" },
  { emoji: "🫀", name: "raw heart", meaning: "tender, exposed" },
  { emoji: "🌊", name: "wave", meaning: "overwhelm, flooding" },
  { emoji: "💧", name: "tear", meaning: "crying, release" },
  { emoji: "🌧️", name: "rain", meaning: "sadness, grieving" },
  { emoji: "⛈️", name: "storm", meaning: "chaos inside" },
  { emoji: "🔥", name: "fire", meaning: "anger, rage, burning" },
  { emoji: "🌋", name: "volcano", meaning: "about to erupt" },
  { emoji: "⚡", name: "lightning", meaning: "shock, sudden hit" },
  { emoji: "🌑", name: "dark moon", meaning: "hidden, shadow self" },
  { emoji: "🕳️", name: "hole", meaning: "empty, falling in" },
  { emoji: "🧱", name: "wall", meaning: "shut down, blocked" },
  { emoji: "⛓️", name: "chains", meaning: "trapped, bound" },
  { emoji: "🪨", name: "heavy stone", meaning: "weight on chest" },
  { emoji: "🌫️", name: "fog", meaning: "lost, can't see clearly" },
  { emoji: "🌀", name: "spiral", meaning: "spinning thoughts, anxiety" },
  { emoji: "🪞", name: "mirror", meaning: "facing myself" },
  { emoji: "🎭", name: "mask", meaning: "hiding how I really feel" },
  { emoji: "🧩", name: "puzzle piece", meaning: "missing something" },
  { emoji: "🪤", name: "trap", meaning: "stuck, can't escape" },
  { emoji: "🩸", name: "blood drop", meaning: "deep wound, pain" },
  { emoji: "🫂", name: "hug", meaning: "need to be held" },
  { emoji: "🛡️", name: "shield", meaning: "protecting myself" },
  { emoji: "🪽", name: "wing", meaning: "watched over, angels" },
  { emoji: "🕊️", name: "dove", meaning: "peace, letting go" },
  { emoji: "🌱", name: "sprout", meaning: "new growth, beginning" },
  { emoji: "🌿", name: "leaves", meaning: "grounding, calm" },
  { emoji: "🦋", name: "butterfly", meaning: "transformation, becoming" },
  { emoji: "🌅", name: "sunrise", meaning: "hope, new day" },
  { emoji: "🌈", name: "rainbow", meaning: "after the storm" },
  { emoji: "⭐", name: "star", meaning: "guidance, hope" },
  { emoji: "✨", name: "sparkles", meaning: "magic, alive again" },
  { emoji: "🕯️", name: "candle", meaning: "small light in dark" },
];

interface Props {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ColorSymbolCanvas({ onSend, disabled }: Props) {
  const [selectedFeelings, setSelectedFeelings] = useState<typeof FEELINGS[number][]>([]);
  const [selectedColors, setSelectedColors] = useState<typeof COLORS[number][]>([]);
  const [selectedSymbols, setSelectedSymbols] = useState<typeof SYMBOLS[number][]>([]);
  const [showExtras, setShowExtras] = useState(false);

  const toggleFeeling = (f: typeof FEELINGS[number]) => {
    setSelectedFeelings((prev) =>
      prev.find((x) => x.name === f.name)
        ? prev.filter((x) => x.name !== f.name)
        : [...prev, f]
    );
  };

  const toggleColor = (color: typeof COLORS[number]) => {
    setSelectedColors((prev) =>
      prev.find((c) => c.hex === color.hex)
        ? prev.filter((c) => c.hex !== color.hex)
        : [...prev, color]
    );
  };

  const toggleSymbol = (symbol: typeof SYMBOLS[number]) => {
    setSelectedSymbols((prev) =>
      prev.find((s) => s.emoji === symbol.emoji)
        ? prev.filter((s) => s.emoji !== symbol.emoji)
        : [...prev, symbol]
    );
  };

  const hasSelection =
    selectedFeelings.length > 0 || selectedColors.length > 0 || selectedSymbols.length > 0;

  const handleSend = () => {
    if (!hasSelection) return;

    let message = "[Expressed without typing]\n";
    if (selectedFeelings.length > 0) {
      const names = selectedFeelings.map((f) => f.name.toLowerCase());
      message += `Feelings: ${names.join(", ")}\n`;
      if (names.includes("i don't know")) {
        message += `(They can't name it yet — gently guide them to uncover the true emotion underneath and explore the root.)\n`;
      }
    }
    if (selectedColors.length > 0) {
      message += `Colors chosen: ${selectedColors
        .map((c) => `${c.name} (${c.meaning})`)
        .join(", ")}\n`;
    }
    if (selectedSymbols.length > 0) {
      message += `Symbols chosen: ${selectedSymbols
        .map((s) => `${s.emoji} ${s.name} (${s.meaning})`)
        .join(", ")}`;
    }

    onSend(message.trim());
    setSelectedFeelings([]);
    setSelectedColors([]);
    setSelectedSymbols([]);
  };

  return (
    <div className="space-y-4 p-4">
      {/* Selected preview */}
      {hasSelection && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="flex flex-wrap gap-2 p-3 bg-card rounded-xl border border-border"
          aria-live="polite"
        >
          {selectedFeelings.map((f) => (
            <button
              key={f.name}
              onClick={() => toggleFeeling(f)}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border-2 border-foreground/20"
              style={{ backgroundColor: f.color, color: "#fff", textShadow: "0 1px 2px rgba(0,0,0,0.4)" }}
              aria-label={`Remove feeling ${f.name}`}
            >
              {f.name}
              <X className="h-3 w-3" />
            </button>
          ))}
          {selectedColors.map((c) => (
            <button
              key={c.hex}
              onClick={() => toggleColor(c)}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full border-2 border-foreground/20 text-xs font-medium"
              style={{ backgroundColor: c.hex, color: "#fff", textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
              aria-label={`Remove color ${c.name}`}
            >
              {c.name}
              <X className="h-3 w-3" />
            </button>
          ))}
          {selectedSymbols.map((s) => (
            <button
              key={s.emoji}
              onClick={() => toggleSymbol(s)}
              className="inline-flex items-center gap-1 text-sm px-2 py-1 rounded-full bg-muted hover:bg-muted/70"
              aria-label={`Remove symbol ${s.name}`}
            >
              <span aria-hidden="true">{s.emoji}</span>
              <span>{s.name}</span>
              <X className="h-3 w-3" />
            </button>
          ))}
        </motion.div>
      )}

      {/* Feelings grid — primary input */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
          Tap any feelings that match how you feel — pick as many as you want
        </p>
        <div
          role="group"
          aria-label="Feelings to choose from"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2"
        >
          {FEELINGS.map((f) => {
            const selected = selectedFeelings.some((x) => x.name === f.name);
            return (
              <button
                key={f.name}
                onClick={() => toggleFeeling(f)}
                disabled={disabled}
                className={`relative px-3 py-3 rounded-xl text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-ring text-left ${
                  selected ? "ring-2 ring-primary scale-[1.02] shadow-md" : "hover:scale-[1.02]"
                }`}
                style={{
                  backgroundColor: f.color,
                  color: "#fff",
                  textShadow: "0 1px 2px rgba(0,0,0,0.45)",
                }}
                aria-label={`${f.name} — ${f.desc}`}
                aria-pressed={selected}
                title={`${f.name} — ${f.desc}`}
              >
                <span className="block leading-tight">{f.name}</span>
                <span className="block text-[10px] font-normal opacity-90 mt-0.5 leading-tight">
                  {f.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Optional: colors + symbols layer */}
      <div className="border-t border-border pt-3">
        <button
          type="button"
          onClick={() => setShowExtras((v) => !v)}
          className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded px-2 py-1"
          aria-expanded={showExtras}
          aria-controls="extras-panel"
        >
          {showExtras ? <Minus className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
          {showExtras ? "Hide colors & symbols" : "Add colors & symbols (optional)"}
        </button>

        <AnimatePresence initial={false}>
          {showExtras && (
            <motion.div
              id="extras-panel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 pt-4">
                {/* Colors */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                    Colors — tap any that match the feeling
                  </p>
                  <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2">
                    {COLORS.map((color) => {
                      const selected = selectedColors.some((c) => c.hex === color.hex);
                      return (
                        <button
                          key={color.hex}
                          onClick={() => toggleColor(color)}
                          disabled={disabled}
                          className={`aspect-square rounded-full border border-foreground/20 transition-all focus:outline-none focus:ring-2 focus:ring-ring ${
                            selected ? "ring-2 ring-primary scale-110 shadow-md" : "hover:scale-110"
                          }`}
                          style={{ backgroundColor: color.hex }}
                          aria-label={`${color.name} — ${color.meaning}`}
                          aria-pressed={selected}
                          title={`${color.name} — ${color.meaning}`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Symbols */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                    Symbols (each is labeled)
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {SYMBOLS.map((symbol) => {
                      const selected = selectedSymbols.some((s) => s.emoji === symbol.emoji);
                      return (
                        <button
                          key={symbol.emoji}
                          onClick={() => toggleSymbol(symbol)}
                          disabled={disabled}
                          className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-ring bg-card hover:bg-muted ${
                            selected
                              ? "bg-primary/15 ring-2 ring-primary scale-105"
                              : ""
                          }`}
                          aria-label={`${symbol.name} — ${symbol.meaning}`}
                          aria-pressed={selected}
                          title={`${symbol.name} — ${symbol.meaning}`}
                        >
                          <span className="text-2xl" aria-hidden="true">
                            {symbol.emoji}
                          </span>
                          <span className="text-[10px] font-medium text-foreground leading-tight text-center">
                            {symbol.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Send */}
      <div className="flex justify-center pt-2">
        <Button
          onClick={handleSend}
          disabled={!hasSelection || disabled}
          size="lg"
          className="rounded-2xl px-8 text-base"
          aria-label="Send your expression"
        >
          <Send className="h-4 w-4 mr-2" /> Send Expression
        </Button>
      </div>
    </div>
  );
}
