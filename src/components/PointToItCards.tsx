import { useState } from "react";
import { motion } from "framer-motion";

// Local paths we have downloaded; undefined = emoji fallback
const S = "/asl/signs";
const F = "/asl/fingerspell";

type Card = { emoji: string; label: string; asl?: string };

const CATEGORIES: { title: string; cards: Card[] }[] = [
  {
    title: "Feelings",
    cards: [
      { emoji: "😢", label: "Sad",           asl: `${S}/sad.gif` },
      { emoji: "😤", label: "Angry",          asl: `${S}/angry.gif` },
      { emoji: "🔥", label: "Anger",          asl: `${S}/anger.jpg` },
      { emoji: "😰", label: "Anxious",        asl: `${S}/anxious.gif` },
      { emoji: "😔", label: "Depressed",      asl: `${S}/depressed-created.jpg` },
      { emoji: "😶", label: "Numb",           asl: `${S}/numb-created.jpg` },
      { emoji: "💔", label: "Heartbroken",    asl: `${S}/hurt.jpg` },
      { emoji: "🤯", label: "Overwhelmed",    asl: `${F}/overwhelmed.jpg` },
      { emoji: "😴", label: "Exhausted",      asl: `${S}/tired.gif` },
      { emoji: "😟", label: "Scared",         asl: `${S}/scared.gif` },
      { emoji: "😠", label: "Frustrated",     asl: `${S}/frustrated.gif` },
      { emoji: "😕", label: "Confused",       asl: `${F}/confused.jpg` },
      { emoji: "🥺", label: "Lonely",         asl: `${S}/lonely.gif` },
      { emoji: "😣", label: "In Pain",        asl: `${S}/pain.gif` },
      { emoji: "😑", label: "Shutdown",       asl: `${F}/shutdown.jpg` },
      { emoji: "🫠", label: "Melting Down",   asl: `${F}/melting-down.jpg` },
      { emoji: "😞", label: "Hopeless",       asl: `${F}/hopeless.jpg` },
      { emoji: "🫣", label: "Ashamed",        asl: `${S}/shame.jpg` },
      { emoji: "😳", label: "Embarrassed",    asl: `${S}/embarrassed.jpg` },
      { emoji: "😒", label: "Jealous",        asl: `${S}/jealous.gif` },
      { emoji: "💢", label: "Betrayed",       asl: `${F}/betrayed.jpg` },
      { emoji: "🖤", label: "Grieving",       asl: `${S}/cry.jpg` },
      { emoji: "😬", label: "Restless",       asl: `${F}/restless.jpg` },
      { emoji: "🌫️", label: "Disconnected",  asl: `${F}/disconnected.jpg` },
      { emoji: "😭", label: "Crying",         asl: `${S}/cry.jpg` },
      { emoji: "😌", label: "Calm",           asl: `${S}/calm.jpg` },
      { emoji: "🕊️", label: "Peaceful",       asl: `${S}/peace.jpg` },
      { emoji: "🌅", label: "Hopeful",        asl: `${S}/hope.jpg` },
      { emoji: "🙏", label: "Grateful",       asl: `${S}/grateful.jpg` },
      { emoji: "❤️", label: "Loved",          asl: `${S}/loved.gif` },
      { emoji: "💪", label: "Brave",          asl: `${S}/brave.gif` },
      { emoji: "🛡️", label: "Strong",         asl: `${S}/strong.jpg` },
      { emoji: "🦁", label: "Proud",          asl: `${S}/proud.gif` },
      { emoji: "😊", label: "Happy",          asl: `${S}/happy.gif` },
      { emoji: "💡", label: "Understanding",  asl: `${S}/understand.gif` },
      { emoji: "🪨", label: "Stuck",          asl: `${S}/stuck.gif` },
    ],
  },
  {
    title: "Body Needs",
    cards: [
      { emoji: "🤒", label: "Sick",           asl: `${S}/sick.gif` },
      { emoji: "🍽️", label: "Hungry",         asl: `${S}/hungry.jpg` },
      { emoji: "🍞", label: "Eat",            asl: `${S}/eat.jpg` },
      { emoji: "💧", label: "Thirsty",        asl: `${S}/water.gif` },
      { emoji: "🥤", label: "Drink",          asl: `${S}/drink.jpg` },
      { emoji: "🛏️", label: "Sleep",          asl: `${S}/sleep.jpg` },
      { emoji: "😴", label: "Tired",          asl: `${S}/tired.gif` },
      { emoji: "🚽", label: "Bathroom",       asl: `${S}/bathroom.gif` },
      { emoji: "🤕", label: "Hurting",        asl: `${S}/hurt.jpg` },
      { emoji: "😣", label: "Pain",           asl: `${S}/pain.gif` },
      { emoji: "🥶", label: "Cold",           asl: `${F}/cold.jpg` },
      { emoji: "🥵", label: "Hot",            asl: `${F}/hot.jpg` },
      { emoji: "💪", label: "Tense",          asl: `${F}/tense.jpg` },
      { emoji: "🤢", label: "Nauseous",       asl: `${F}/nauseous.jpg` },
      { emoji: "🌀", label: "Dizzy",          asl: `${F}/dizzy.jpg` },
      { emoji: "🫨", label: "Shaking",        asl: `${F}/shaking.jpg` },
      { emoji: "🌬️", label: "Can't Flow",     asl: `${S}/breathe.jpg` },
      { emoji: "💓", label: "Heart Racing",   asl: `${F}/heart-racing.jpg` },
      { emoji: "🤦", label: "Headache",       asl: `${F}/headache.jpg` },
      { emoji: "🫀", label: "Tight Chest",    asl: `${F}/tight-chest.jpg` },
      { emoji: "🌙", label: "Can't Sleep",    asl: `${S}/sleep.jpg` },
      { emoji: "😪", label: "Weak",           asl: `${F}/weak.jpg` },
      { emoji: "🫥", label: "Numb Body",      asl: `${F}/numb-body.jpg` },
      { emoji: "🏋️", label: "Heavy",          asl: `${F}/heavy.jpg` },
      { emoji: "💦", label: "Sweating",       asl: `${F}/sweating.jpg` },
      { emoji: "🧊", label: "Frozen",         asl: `${F}/frozen.jpg` },
      { emoji: "🔊", label: "Overstimulated", asl: `${F}/overstimulated.jpg` },
    ],
  },
  {
    title: "I Need",
    cards: [
      { emoji: "🤗", label: "A Hug",          asl: `${S}/love.gif` },
      { emoji: "🙏", label: "Help",           asl: `${S}/help.gif` },
      { emoji: "❗", label: "Need",           asl: `${S}/need.jpg` },
      { emoji: "🙋", label: "Want",           asl: `${S}/want-created.jpg` },
      { emoji: "💊", label: "Resources",      asl: `${F}/resources.jpg` },
      { emoji: "🗣️", label: "To Talk",        asl: `${F}/to-talk.jpg` },
      { emoji: "🤫", label: "Quiet",          asl: `${F}/quiet.jpg` },
      { emoji: "🏃", label: "Space",          asl: `${F}/space.jpg` },
      { emoji: "💤", label: "Rest",           asl: `${S}/sleep.jpg` },
      { emoji: "🌿", label: "To Calm Down",   asl: `${S}/calm.jpg` },
      { emoji: "🕊️", label: "Prayer",         asl: `${S}/peace.jpg` },
      { emoji: "😭", label: "To Cry",         asl: `${S}/cry.jpg` },
      { emoji: "🚶", label: "To Move",        asl: `${F}/to-move.jpg` },
      { emoji: "🌬️", label: "Fresh Air",      asl: `${S}/breathe.jpg` },
      { emoji: "🛡️", label: "Safety",         asl: `${S}/strong.jpg` },
      { emoji: "✍️", label: "To Write",       asl: `${F}/to-write.jpg` },
      { emoji: "💨", label: "To Flow",        asl: `${S}/breathe.jpg` },
      { emoji: "💬", label: "Validation",     asl: `${F}/validation.jpg` },
      { emoji: "👂", label: "Someone to Listen", asl: `${F}/someone-to-listen.jpg` },
      { emoji: "🤝", label: "To Be Held",     asl: `${S}/friend.gif` },
      { emoji: "🌱", label: "Grounding",      asl: `${F}/grounding.jpg` },
      { emoji: "🎮", label: "Distraction",    asl: `${F}/distraction.jpg` },
      { emoji: "🍵", label: "Comfort",        asl: `${S}/loved.gif` },
      { emoji: "🔍", label: "Clarity",        asl: `${S}/understand.gif` },
      { emoji: "✨", label: "To Believe",     asl: `${S}/believe.jpg` },
      { emoji: "🤲", label: "To Trust",       asl: `${S}/trust.jpg` },
      { emoji: "🙆", label: "To Accept",      asl: `${S}/accept.jpg` },
      { emoji: "🌅", label: "Hope",           asl: `${S}/hope.jpg` },
      { emoji: "🫂", label: "Togetherness",   asl: `${S}/together.jpg` },
      { emoji: "👨‍👩‍👧", label: "Family",       asl: `${S}/family.jpg` },
      { emoji: "🏠", label: "Home",           asl: `${S}/home.gif` },
    ],
  },
  {
    title: "I Don't Know",
    cards: [
      { emoji: "🤷", label: "I Don't Know",      asl: `${F}/i-dont-know.jpg` },
      { emoji: "🌀", label: "Everything Feels Wrong", asl: `${F}/everything-feels-wrong.jpg` },
      { emoji: "😶", label: "I Can't Explain It", asl: `${F}/i-cant-explain-it.jpg` },
      { emoji: "😞", label: "I'm Just Tired",    asl: `${S}/tired.gif` },
      { emoji: "🫙", label: "I Feel Empty",     asl: `${F}/i-feel-empty.jpg` },
      { emoji: "🔇", label: "Something Is Off", asl: `${F}/something-is-off.jpg` },
      { emoji: "🪨", label: "I Feel Heavy",      asl: `${S}/stuck.gif` },
      { emoji: "🧭", label: "I Feel Lost",      asl: `${F}/i-feel-lost.jpg` },
      { emoji: "🙋", label: "I Need Help",       asl: `${S}/help.gif` },
      { emoji: "🔌", label: "I'm Shutting Down", asl: `${F}/im-shutting-down.jpg` },
      { emoji: "💫", label: "I'm Spiraling",    asl: `${F}/im-spiraling.jpg` },
      { emoji: "📡", label: "I Feel Disconnected", asl: `${F}/i-feel-disconnected.jpg` },
      { emoji: "🌫️", label: "I Want to Disappear", asl: `${F}/i-want-to-disappear.jpg` },
      { emoji: "🫥", label: "I'm Numb",         asl: `${F}/im-numb.jpg` },
      { emoji: "⚠️", label: "I Can't Function", asl: `${F}/i-cant-function.jpg` },
      { emoji: "🏔️", label: "It's Too Much",    asl: `${F}/its-too-much.jpg` },
      { emoji: "👁️", label: "I'm Dissociating", asl: `${F}/im-dissociating.jpg` },
      { emoji: "👻", label: "I Feel Invisible", asl: `${F}/i-feel-invisible.jpg` },
      { emoji: "🚫", label: "I'm Not Okay",     asl: `${F}/im-not-okay.jpg` },
      { emoji: "👋", label: "I Need Someone",    asl: `${S}/friend.gif` },
      { emoji: "🚨", label: "I Feel Unsafe",    asl: `${F}/i-feel-unsafe.jpg` },
      { emoji: "💔", label: "I'm Falling Apart", asl: `${S}/hurt.jpg` },
      { emoji: "⏳", label: "I Need to Wait",    asl: `${S}/wait.gif` },
      { emoji: "✋", label: "I Need to Stop",    asl: `${S}/stop.gif` },
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
        className="h-16 w-16 object-contain rounded-lg bg-white"
        onError={() => setFailed(true)}
      />
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
