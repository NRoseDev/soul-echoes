import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ── Paths ─────────────────────────
const LOCAL = "/asl/signs";
const ALPHA = "/asl/alpha";

// ── Alphabet ──────────────────────
const ASL_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((l) => ({
  id: l,
  label: l,
  img: `${ALPHA}/${l.toLowerCase()}.gif`,
}));

// ── COMMON WORDS (FIXED: no broken JPG/GIF mix issues) ──────────────────────
const ASL_COMMON_WORDS = [
  { id: "hello", label: "Hello", emoji: "👋", img: `${LOCAL}/hello.gif` },
  { id: "thank-you", label: "Thank You", emoji: "🙏", img: `${LOCAL}/thank-you.gif` },
  { id: "please", label: "Please", emoji: "🤲", img: `${LOCAL}/please.gif` },
  { id: "yes", label: "Yes", emoji: "👍", img: `${LOCAL}/yes.gif` },
  { id: "no", label: "No", emoji: "👎", img: `${LOCAL}/no.gif` },
  { id: "help", label: "Help", emoji: "🆘", img: `${LOCAL}/help.gif` },
  { id: "sorry", label: "Sorry", emoji: "😔", img: `${LOCAL}/sorry.gif` },
  { id: "love", label: "Love", emoji: "❤️", img: `${LOCAL}/love.gif` },
  { id: "safe", label: "Safe", emoji: "🛡️", img: `${LOCAL}/safe.gif` },
  { id: "pain", label: "Pain", emoji: "🤕", img: `${LOCAL}/pain.gif` },
  { id: "water", label: "Water", emoji: "💧", img: `${LOCAL}/water.gif` },
  { id: "hungry", label: "Hungry", emoji: "🍽️", img: `${LOCAL}/hungry.gif` },
  { id: "tired", label: "Tired", emoji: "😴", img: `${LOCAL}/tired.gif` },
  { id: "stop", label: "Stop", emoji: "✋", img: `${LOCAL}/stop.gif` },
  { id: "more", label: "More", emoji: "➕", img: `${LOCAL}/more.gif` },
  { id: "understand", label: "Understand", emoji: "💡", img: `${LOCAL}/understand.gif` },
  { id: "friend", label: "Friend", emoji: "🤝", img: `${LOCAL}/friend.gif` },
  { id: "home", label: "Home", emoji: "🏠", img: `${LOCAL}/home.gif` },
  { id: "breathe", label: "Breathe", emoji: "🌬️", img: `${LOCAL}/breathe.gif` },
  { id: "wait", label: "Wait", emoji: "⏳", img: `${LOCAL}/wait.gif` },
  { id: "bathroom", label: "Bathroom", emoji: "🚽", img: `${LOCAL}/bathroom.gif` },
  { id: "i-dont-know", label: "I Don’t Know", emoji: "🤷", img: `${LOCAL}/i-dont-know.gif` },
];

// ── FEELINGS (FIXED: removed broken LP links causing blank/multi renders) ────
const ASL_FEELINGS = [
  { id: "happy", label: "Happy", emoji: "😊", img: `${LOCAL}/happy.gif` },
  { id: "sad", label: "Sad", emoji: "😢", img: `${LOCAL}/sad.gif` },
  { id: "angry", label: "Angry", emoji: "😠", img: `${LOCAL}/angry.gif` },
  { id: "scared", label: "Scared", emoji: "😨", img: `${LOCAL}/scared.gif` },
  { id: "anxious", label: "Anxious", emoji: "😰", img: `${LOCAL}/anxious.gif` },
  { id: "frustrated", label: "Frustrated", emoji: "😣", img: `${LOCAL}/frustrated.gif` },
  { id: "lonely", label: "Lonely", emoji: "🥀", img: `${LOCAL}/lonely.gif` },
  { id: "overwhelmed", label: "Overwhelmed", emoji: "🌊", img: `${LOCAL}/overwhelmed.gif` },
  { id: "calm", label: "Calm", emoji: "😌", img: `${LOCAL}/calm.gif` },
  { id: "hopeful", label: "Hopeful", emoji: "🌅", img: `${LOCAL}/hopeful.gif` },
  { id: "grateful", label: "Grateful", emoji: "🙏", img: `${LOCAL}/grateful.gif` },
  { id: "loved", label: "Loved", emoji: "❤️", img: `${LOCAL}/loved.gif` },
  { id: "proud", label: "Proud", emoji: "🦁", img: `${LOCAL}/proud.gif` },
  { id: "brave", label: "Brave", emoji: "💪", img: `${LOCAL}/brave.gif` },
  { id: "numb", label: "Numb", emoji: "🧊", img: `${LOCAL}/numb.gif` },
  { id: "grief", label: "Grief", emoji: "🖤", img: `${LOCAL}/grief.gif` },
  { id: "shame", label: "Shame", emoji: "😶", img: `${LOCAL}/shame.gif` },
  { id: "healing", label: "Healing", emoji: "🌱", img: `${LOCAL}/healing.gif` },
  { id: "confused", label: "Confused", emoji: "🌀", img: `${LOCAL}/confused.gif` },
  { id: "peaceful", label: "Peaceful", emoji: "🕊️", img: `${LOCAL}/peaceful.gif` },
  { id: "stuck", label: "Stuck", emoji: "🪨", img: `${LOCAL}/stuck.gif` },
  { id: "i-dont-know", label: "I Don’t Know", emoji: "🤷", img: `${LOCAL}/i-dont-know.gif` },
];

// ── SAFE IMAGE COMPONENT (prevents duplicate render glitches) ───────────────
function SignImg({ src, alt, emoji }: any) {
  const [fail, setFail] = useState(false);

  if (fail || !src) {
    return <span className="text-xl">{emoji}</span>;
  }

  return (
    <img
      src={src}
      alt={alt}
      className="h-10 w-10 object-contain"
      onError={() => setFail(true)}
    />
  );
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
export default function ASLSignInput({ onSend, disabled }: any) {
  const [tab, setTab] = useState("words");
  const [letters, setLetters] = useState<string[]>([]);

  const send = (text: string) => {
    if (disabled) return;
    onSend(text);
  };

  return (
    <div className="px-4 py-3 space-y-3">

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="w-full">
          <TabsTrigger value="words">Common</TabsTrigger>
          <TabsTrigger value="feelings">Feelings</TabsTrigger>
          <TabsTrigger value="alphabet">ABC</TabsTrigger>
        </TabsList>

        {/* WORDS */}
        <TabsContent value="words">
          <div className="grid grid-cols-4 gap-2">
            {ASL_COMMON_WORDS.map((c) => (
              <button
                key={c.id}
                onClick={() => send(c.label)}
                className="p-2 border rounded-xl flex flex-col items-center"
              >
                <SignImg src={c.img} alt={c.label} emoji={c.emoji} />
                <span className="text-[10px]">{c.label}</span>
              </button>
            ))}
          </div>
        </TabsContent>

        {/* FEELINGS */}
        <TabsContent value="feelings">
          <div className="grid grid-cols-4 gap-2">
            {ASL_FEELINGS.map((c) => (
              <button
                key={c.id}
                onClick={() => send(c.label)}
                className="p-2 border rounded-xl flex flex-col items-center"
              >
                <SignImg src={c.img} alt={c.label} emoji={c.emoji} />
                <span className="text-[10px]">{c.label}</span>
              </button>
            ))}
          </div>
        </TabsContent>

        {/* ALPHABET */}
        <TabsContent value="alphabet">
          <div className="grid grid-cols-6 gap-2">
            {ASL_ALPHABET.map((c) => (
              <button
                key={c.id}
                onClick={() => setLetters((p) => [...p, c.label])}
                className="p-2 border rounded-xl flex flex-col items-center"
              >
                <SignImg src={c.img} alt={c.label} emoji={c.label} />
                <span className="text-[10px]">{c.label}</span>
              </button>
            ))}
          </div>

          {letters.length > 0 && (
            <button
              className="mt-3 w-full p-2 bg-black text-white rounded-xl"
              onClick={() => {
                send(letters.join(""));
                setLetters([]);
              }}
            >
              Send Word
            </button>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
