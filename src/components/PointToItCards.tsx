import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const EMOTION_CARDS = [
  { emoji: "😢", label: "Sad" },
  { emoji: "😠", label: "Angry" },
  { emoji: "😰", label: "Anxious" },
  { emoji: "😔", label: "Lonely" },
  { emoji: "😊", label: "Happy" },
  { emoji: "😐", label: "Numb" },
  { emoji: "😤", label: "Frustrated" },
  { emoji: "😨", label: "Scared" },
  { emoji: "🥲", label: "Bittersweet" },
  { emoji: "😩", label: "Overwhelmed" },
  { emoji: "🤗", label: "Grateful" },
  { emoji: "😶", label: "Confused" },
];

const BODY_CARDS = [
  { emoji: "💔", label: "Chest hurts" },
  { emoji: "🤯", label: "Head spinning" },
  { emoji: "😴", label: "Exhausted" },
  { emoji: "🫁", label: "Can't breathe" },
  { emoji: "🤢", label: "Sick feeling" },
  { emoji: "💪", label: "Tense muscles" },
  { emoji: "🥶", label: "Cold / Shaking" },
  { emoji: "🔥", label: "Hot / Flushed" },
];

const SITUATION_CARDS = [
  { emoji: "👪", label: "Family issue" },
  { emoji: "💼", label: "Work / School" },
  { emoji: "💔", label: "Relationship" },
  { emoji: "🏠", label: "Home life" },
  { emoji: "💰", label: "Money stress" },
  { emoji: "🌍", label: "World events" },
  { emoji: "🕊️", label: "Loss / Grief" },
  { emoji: "🪞", label: "Self-image" },
];

interface Props {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function PointToItCards({ onSend, disabled }: Props) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (label: string) => {
    setSelected((prev) =>
      prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]
    );
  };

  const handleSend = () => {
    if (selected.length === 0) return;
    const msg = `[Pointed to cards]\nI'm expressing: ${selected.join(", ")}`;
    onSend(msg);
    setSelected([]);
  };

  const renderCards = (cards: { emoji: string; label: string }[]) => (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {cards.map((card) => {
        const isSelected = selected.includes(card.label);
        return (
          <button
            key={card.label}
            onClick={() => toggle(card.label)}
            disabled={disabled}
            className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-ring ${
              isSelected
                ? "border-primary bg-primary/10 scale-105 shadow-md"
                : "border-border bg-card hover:border-primary/40 hover:scale-102"
            }`}
            aria-pressed={isSelected}
            aria-label={card.label}
          >
            <span className="text-2xl">{card.emoji}</span>
            <span className="text-xs font-medium text-foreground">{card.label}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="p-4 space-y-4">
      <Tabs defaultValue="emotions">
        <TabsList className="w-full bg-muted">
          <TabsTrigger value="emotions" className="flex-1">Emotions</TabsTrigger>
          <TabsTrigger value="body" className="flex-1">Body</TabsTrigger>
          <TabsTrigger value="situation" className="flex-1">Situation</TabsTrigger>
        </TabsList>
        <TabsContent value="emotions">{renderCards(EMOTION_CARDS)}</TabsContent>
        <TabsContent value="body">{renderCards(BODY_CARDS)}</TabsContent>
        <TabsContent value="situation">{renderCards(SITUATION_CARDS)}</TabsContent>
      </Tabs>

      {selected.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 flex-wrap p-3 bg-card rounded-xl border border-border"
        >
          <span className="text-xs text-muted-foreground">Selected:</span>
          {selected.map((s) => (
            <span key={s} className="text-xs px-2 py-1 rounded-full bg-primary/15 text-foreground">
              {s}
            </span>
          ))}
        </motion.div>
      )}

      <div className="flex justify-center">
        <Button
          onClick={handleSend}
          disabled={selected.length === 0 || disabled}
          size="lg"
          className="rounded-2xl px-8"
        >
          <Send className="h-4 w-4 mr-2" /> Send Cards
        </Button>
      </div>
    </div>
  );
}
