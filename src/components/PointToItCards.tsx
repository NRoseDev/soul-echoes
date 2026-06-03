import { useState } from "react";
import { motion } from "framer-motion";

// Local paths we have downloaded; undefined = emoji fallback
const S = "/asl/signs";
const A = "/asl/alpha";

type Card = { emoji: string; label: string; asl?: string };

const CATEGORIES: { title: string; cards: Card[] }[] = [
  {
    title: "Feelings",
    cards: [
      { emoji: "😢", label: "Sad",           asl: `${S}/sad.gif` },
      { emoji: "😤", label: "Angry",          asl: `${S}/angry.gif` },
      { emoji: "😰", label: "Anxious",        asl: `${S}/anxious.gif` },
      { emoji: "😔", label: "Depressed" },
      { emoji: "😶", label: "Numb" },
      { emoji: "💔", label: "Heartbroken" },
      { emoji: "🤯", label: "Overwhelmed" },
      { emoji: "😴", label: "Exhausted",      asl: `${S}/tired.gif` },
      { emoji: "😟", label: "Scared",         asl: `${S}/scared.gif` },
      { emoji: "😠", label: "Frustrated",     asl: `${S}/frustrated.gif` },
      { emoji: "😕", label: "Confused" },
      { emoji: "🥺", label: "Lonely",         asl: `${S}/lonely.gif` },
      { emoji: "😣", label: "In Pain",        asl: `${S}/pain.gif` },
      { emoji: "😑", label: "Shutdown" },
      { emoji: "🫠", label: "Melting Down" },
      { emoji: "😞", label: "Hopeless" },
      { emoji: "🫣", label: "Ashamed" },
      { emoji: "😒", label: "Jealous",        asl: `${S}/jealous.gif` },
      { emoji: "💢", label: "Betrayed" },
      { emoji: "🖤", label: "Grieving" },
      { emoji: "😬", label: "Restless" },
      { emoji: "🌫️", label: "Disconnected" },
    ],
  },
  {
    title: "Body Needs",
    cards: [
      { emoji: "🤒", label: "Sick",           asl: `${S}/sick.gif` },
      { emoji: "🍽️", label: "Hungry" },
      { emoji: "💧", label: "Thirsty",        asl: `${S}/water.gif` },
      { emoji: "😴", label: "Tired",          asl: `${S}/tired.gif` },
      { emoji: "🤕", label: "Hurting",        asl: `${S}/pain.gif` },
      { emoji: "🥶", label: "Cold" },
      { emoji: "🥵", label: "Hot" },
      { emoji: "💪", label: "Tense" },
      { emoji: "🤢", label: "Nauseous" },
      { emoji: "🌀", label: "Dizzy" },
      { emoji: "🫨", label: "Shaking" },
      { emoji: "😤", label: "Can't Flow" },
      { emoji: "💓", label: "Heart Racing" },
      { emoji: "🤦", label: "Headache" },
      { emoji: "🫀", label: "Tight Chest" },
      { emoji: "🌙", label: "Can't Sleep" },
      { emoji: "😪", label: "Weak" },
      { emoji: "🫥", label: "Numb Body" },
      { emoji: "🏋️", label: "Heavy" },
      { emoji: "💦", label: "Sweating" },
      { emoji: "🧊", label: "Frozen" },
      { emoji: "🔊", label: "Overstimulated" },
    ],
  },
  {
    title: "I Need",
    cards: [
      { emoji: "🤗", label: "A Hug" },
      { emoji: "🙏", label: "Help",           asl: `${S}/help.gif` },
      { emoji: "💊", label: "Resources" },
      { emoji: "🗣️", label: "To Talk" },
      { emoji: "🤫", label: "Quiet" },
      { emoji: "🏃", label: "Space" },
      { emoji: "💤", label: "Rest" },
      { emoji: "🌿", label: "To Calm Down" },
      { emoji: "🕊️", label: "Prayer" },
      { emoji: "😭", label: "To Cry" },
      { emoji: "🚶", label: "To Move" },
      { emoji: "🌬️", label: "Fresh Air" },
      { emoji: "🛡️", label: "Safety" },
      { emoji: "✍️", label: "To Write" },
      { emoji: "💨", label: "To Flow" },
      { emoji: "💬", label: "Validation" },
      { emoji: "👂", label: "Someone to Listen" },
      { emoji: "🤝", label: "To Be Held" },
      { emoji: "🌱", label: "Grounding" },
      { emoji: "🎮", label: "Distraction" },
      { emoji: "🍵", label: "Comfort" },
      { emoji: "🔍", label: "Clarity" },
    ],
  },
  {
    title: "I Don't Know",
    cards: [
      { emoji: "🤷", label: "I Don't Know" },
      { emoji: "🌀", label: "Everything Feels Wrong" },
      { emoji: "😶", label: "I Can't Explain It" },
      { emoji: "😞", label: "I'm Just Tired",   asl: `${S}/tired.gif` },
      { emoji: "🫙", label: "I Feel Empty" },
      { emoji: "🔇", label: "Something Is Off" },
      { emoji: "🪨", label: "I Feel Heavy" },
      { emoji: "🧭", label: "I Feel Lost" },
      { emoji: "🙋", label: "I Need Help",       asl: `${S}/help.gif` },
      { emoji: "🔌", label: "I'm Shutting Down" },
      { emoji: "💫", label: "I'm Spiraling" },
      { emoji: "📡", label: "I Feel Disconnected" },
      { emoji: "🌫️", label: "I Want to Disappear" },
      { emoji: "🫥", label: "I'm Numb" },
      { emoji: "⚠️", label: "I Can't Function" },
      { emoji: "🏔️", label: "It's Too Much" },
      { emoji: "👁️", label: "I'm Dissociating" },
      { emoji: "👻", label: "I Feel Invisible" },
      { emoji: "🚫", label: "I'm Not Okay" },
      { emoji: "👋", label: "I Need Someone" },
      { emoji: "🚨", label: "I Feel Unsafe" },
      { emoji: "💔", label: "I'm Falling Apart" },
    ],
  },
];

function ASLCardImage({ asl, emoji }: { asl?: string; emoji: string }) {
  const [failed, setFailed] = useState(false);

  if (!asl || failed) {
    return <span className="text-3xl leading-none">{emoji}</span>;
  }

  return (
    <div className="relative w-full flex flex-col items-center">
      <img
        src={asl}
        alt="ASL sign"
        className="h-14 w-14 object-contain rounded-lg bg-white"
        onError={() => setFailed(true)}
      />
      <span className="text-base leading-none mt-0.5">{emoji}</span>
    </div>
  );
}

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
                className="flex flex-col items-center gap-1 p-2 rounded-xl border-2 border-border bg-card hover:border-primary/40 hover:bg-primary/5 transition-all focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                aria-label={card.label}
              >
                <ASLCardImage asl={card.asl} emoji={card.emoji} />
                <span className="text-[10px] font-medium text-foreground leading-tight text-center w-full">{card.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
