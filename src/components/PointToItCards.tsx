import { motion } from "framer-motion";

const CATEGORIES = [
  {
    title: "Feelings",
    cards: [
      { emoji: "😢", label: "Sad" },
      { emoji: "😤", label: "Angry" },
      { emoji: "😰", label: "Anxious" },
      { emoji: "😔", label: "Depressed" },
      { emoji: "😶", label: "Numb" },
      { emoji: "💔", label: "Heartbroken" },
      { emoji: "🤯", label: "Overwhelmed" },
      { emoji: "😴", label: "Exhausted" },
      { emoji: "😟", label: "Scared" },
      { emoji: "😠", label: "Frustrated" },
      { emoji: "😕", label: "Confused" },
      { emoji: "🥺", label: "Lonely" },
      { emoji: "😣", label: "In Pain" },
      { emoji: "😑", label: "Shutdown" },
      { emoji: "🫠", label: "Melting Down" },
    ],
  },
  {
    title: "Body Needs",
    cards: [
      { emoji: "🤒", label: "Sick" },
      { emoji: "🍽️", label: "Hungry" },
      { emoji: "💧", label: "Thirsty" },
      { emoji: "😴", label: "Tired" },
      { emoji: "🤕", label: "Hurting" },
      { emoji: "🥶", label: "Cold" },
      { emoji: "🥵", label: "Hot" },
    ],
  },
  {
    title: "I Need",
    cards: [
      { emoji: "🤗", label: "A Hug" },
      { emoji: "🙏", label: "Help" },
      { emoji: "💊", label: "Resources" },
      { emoji: "🗣️", label: "To Talk" },
      { emoji: "🤫", label: "Quiet" },
      { emoji: "🏃", label: "Space" },
      { emoji: "💤", label: "Rest" },
      { emoji: "🌿", label: "To Calm Down" },
    ],
  },
  {
    title: "I Don't Know",
    cards: [
      { emoji: "🤷", label: "I Don't Know" },
      { emoji: "🌀", label: "Everything Feels Wrong" },
      { emoji: "😶", label: "I Can't Explain It" },
    ],
  },
];

interface Props {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function PointToItCards({ onSend, disabled }: Props) {
  const handleTap = (emoji: string, label: string, category: string) => {
    const msg = `[Pointed to: ${emoji} ${label}]\nCategory: ${category}\nI'm feeling: ${label}`;
    onSend(msg);
  };

  return (
    <div className="p-3 max-h-[50vh] overflow-y-auto space-y-4">
      {CATEGORIES.map((cat) => (
        <div key={cat.title}>
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 px-1">
            {cat.title}
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {cat.cards.map((card) => (
              <motion.button
                key={`${cat.title}-${card.label}`}
                whileTap={{ scale: 0.93 }}
                onClick={() => handleTap(card.emoji, card.label, cat.title)}
                disabled={disabled}
                className="flex flex-col items-center gap-1 p-3 rounded-xl border-2 border-border bg-card hover:border-primary/40 hover:bg-primary/5 transition-all focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                aria-label={card.label}
              >
                <span className="text-2xl">{card.emoji}</span>
                <span className="text-xs font-medium text-foreground">{card.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
