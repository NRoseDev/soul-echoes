import { useState } from "react";
import { motion } from "framer-motion";
import { Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const COLORS = [
  { hex: "#1E3A5F", name: "dark blue", meaning: "sadness, depth, melancholy" },
  { hex: "#E63946", name: "red", meaning: "anger, passion, intensity" },
  { hex: "#F4A261", name: "warm orange", meaning: "comfort, warmth, hope" },
  { hex: "#2A9D8F", name: "teal", meaning: "calm, healing, balance" },
  { hex: "#264653", name: "deep teal", meaning: "solitude, reflection, weight" },
  { hex: "#E9C46A", name: "golden yellow", meaning: "joy, energy, optimism" },
  { hex: "#6A0572", name: "deep purple", meaning: "grief, spirituality, mystery" },
  { hex: "#1D1D1D", name: "black", meaning: "emptiness, darkness, the unknown" },
  { hex: "#F1FAEE", name: "soft white", meaning: "peace, purity, new beginning" },
  { hex: "#A8DADC", name: "light blue", meaning: "gentleness, vulnerability, openness" },
  { hex: "#8B5E3C", name: "earth brown", meaning: "grounding, stability, safety" },
  { hex: "#C1666B", name: "dusty rose", meaning: "tenderness, longing, bittersweet" },
];

const SYMBOLS = [
  { emoji: "💔", name: "broken heart", meaning: "heartbreak, loss, betrayal" },
  { emoji: "🌊", name: "wave", meaning: "overwhelm, emotions crashing, flow" },
  { emoji: "🔥", name: "fire", meaning: "anger, transformation, burning feeling" },
  { emoji: "🌑", name: "dark moon", meaning: "darkness, hidden feelings, shadow" },
  { emoji: "🌅", name: "sunrise", meaning: "hope, new beginning, light ahead" },
  { emoji: "⛓️", name: "chains", meaning: "feeling trapped, stuck, bound" },
  { emoji: "🕊️", name: "dove", meaning: "peace, release, freedom" },
  { emoji: "🌱", name: "sprout", meaning: "growth, healing, something new" },
  { emoji: "💧", name: "tear", meaning: "crying, release, sadness" },
  { emoji: "⚡", name: "lightning", meaning: "shock, sudden change, energy" },
  { emoji: "🫂", name: "hug", meaning: "need comfort, connection, warmth" },
  { emoji: "🌀", name: "spiral", meaning: "confusion, spinning, anxiety" },
  { emoji: "🛡️", name: "shield", meaning: "protection, guarding, defense" },
  { emoji: "🦋", name: "butterfly", meaning: "transformation, beauty, fragility" },
  { emoji: "💤", name: "sleep", meaning: "exhaustion, need rest, numbness" },
  { emoji: "🌿", name: "herb", meaning: "healing, nature, grounding" },
];

interface Props {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ColorSymbolCanvas({ onSend, disabled }: Props) {
  const [selectedColors, setSelectedColors] = useState<typeof COLORS[number][]>([]);
  const [selectedSymbols, setSelectedSymbols] = useState<typeof SYMBOLS[number][]>([]);

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

  const handleSend = () => {
    if (selectedColors.length === 0 && selectedSymbols.length === 0) return;

    // Build a descriptive message the AI can interpret
    const colorDesc = selectedColors.map((c) => `${c.name} (${c.meaning})`).join(", ");
    const symbolDesc = selectedSymbols.map((s) => `${s.emoji} ${s.name} (${s.meaning})`).join(", ");

    let message = "[Expressed through colors and symbols]\n";
    if (selectedColors.length > 0) message += `Colors chosen: ${colorDesc}\n`;
    if (selectedSymbols.length > 0) message += `Symbols chosen: ${symbolDesc}`;

    onSend(message.trim());
    setSelectedColors([]);
    setSelectedSymbols([]);
  };

  const hasSelection = selectedColors.length > 0 || selectedSymbols.length > 0;

  return (
    <div className="space-y-4 p-4">
      {/* Selected items preview */}
      {hasSelection && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="flex flex-wrap gap-2 p-3 bg-card rounded-xl border border-border"
        >
          {selectedColors.map((c) => (
            <button
              key={c.hex}
              onClick={() => toggleColor(c)}
              className="w-8 h-8 rounded-full border-2 border-foreground/20 flex items-center justify-center"
              style={{ backgroundColor: c.hex }}
              aria-label={`Remove ${c.name}`}
            >
              <X className="h-3 w-3 text-white drop-shadow" />
            </button>
          ))}
          {selectedSymbols.map((s) => (
            <button
              key={s.emoji}
              onClick={() => toggleSymbol(s)}
              className="text-xl px-1 rounded hover:bg-muted"
              aria-label={`Remove ${s.name}`}
            >
              {s.emoji}
            </button>
          ))}
        </motion.div>
      )}

      {/* Colors */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
          Choose colors that match how you feel
        </p>
        <div className="grid grid-cols-6 gap-2">
          {COLORS.map((color) => {
            const selected = selectedColors.some((c) => c.hex === color.hex);
            return (
              <button
                key={color.hex}
                onClick={() => toggleColor(color)}
                disabled={disabled}
                className={`w-full aspect-square rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-ring ${
                  selected ? "ring-2 ring-primary scale-110 shadow-lg" : "hover:scale-105"
                }`}
                style={{ backgroundColor: color.hex }}
                aria-label={`${color.name} — ${color.meaning}`}
                aria-pressed={selected}
                title={color.name}
              />
            );
          })}
        </div>
      </div>

      {/* Symbols */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
          Choose symbols that express your feelings
        </p>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {SYMBOLS.map((symbol) => {
            const selected = selectedSymbols.some((s) => s.emoji === symbol.emoji);
            return (
              <button
                key={symbol.emoji}
                onClick={() => toggleSymbol(symbol)}
                disabled={disabled}
                className={`text-2xl p-2 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-ring ${
                  selected
                    ? "bg-primary/15 ring-2 ring-primary scale-110 shadow-md"
                    : "bg-card hover:bg-muted hover:scale-105"
                }`}
                aria-label={`${symbol.name} — ${symbol.meaning}`}
                aria-pressed={selected}
                title={symbol.name}
              >
                {symbol.emoji}
              </button>
            );
          })}
        </div>
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
