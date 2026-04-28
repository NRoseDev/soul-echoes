import { useState, useRef, useEffect } from "react";
import { Hand, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ── ASL Alphabet ─────────────────────────────────────────────────────────────
const ASL_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => ({
  id: letter,
  label: letter,
  imgGif: `/asl/alpha/${letter.toLowerCase()}.gif`,
  imgJpg: `/asl/alpha/${letter.toLowerCase()}.jpg`,
}));

const LOCAL = "/asl/signs";
const LP = "https://www.lifeprint.com/asl101/gifs";

// ── COMMON WORDS ─────────────────────────────────────────────────────────────
const ASL_COMMON_WORDS = [
  { id: "hello", label: "Hello", emoji: "👋", img: `${LOCAL}/hello.jpg` },
  { id: "thank-you", label: "Thank You", emoji: "🙏", img: `${LOCAL}/thank-you.gif` },
  { id: "please", label: "Please", emoji: "🤲", img: `${LOCAL}/please.jpg` },
  { id: "yes", label: "Yes", emoji: "👍", img: `${LOCAL}/yes.gif` },
  { id: "no", label: "No", emoji: "👎", img: `${LOCAL}/no.gif` },
  { id: "help", label: "Help", emoji: "🆘", img: `${LOCAL}/help.gif` },
  { id: "sorry", label: "Sorry", emoji: "😔", img: `${LOCAL}/sorry.jpg` },
  { id: "love", label: "Love", emoji: "❤️", img: `${LOCAL}/love.gif` },
  { id: "safe", label: "Safe", emoji: "🛡️", img: `${LP}/s/safe.gif` },
  { id: "pain", label: "Pain", emoji: "🤕", img: `${LOCAL}/pain.gif` },
  { id: "water", label: "Water", emoji: "💧", img: `${LOCAL}/water.gif` },
  { id: "hungry", label: "Hungry", emoji: "🍽️", img: `${LOCAL}/hungry.jpg` },
  { id: "tired", label: "Tired", emoji: "😴", img: `${LOCAL}/tired.gif` },
  { id: "stop", label: "Stop", emoji: "✋", img: `${LOCAL}/stop.gif` },
  { id: "more", label: "More", emoji: "➕", img: `${LOCAL}/more.gif` },
  { id: "understand", label: "Understand", emoji: "💡", img: `${LOCAL}/understand.gif` },
  { id: "friend", label: "Friend", emoji: "🤝", img: `${LOCAL}/friend.gif` },
  { id: "home", label: "Home", emoji: "🏠", img: `${LOCAL}/home.gif` },
  { id: "breathe", label: "Breathe", emoji: "🌬️", img: `${LOCAL}/breathe.jpg` },
  { id: "wait", label: "Wait", emoji: "⏳", img: `${LOCAL}/wait.gif` },
  { id: "bathroom", label: "Bathroom", emoji: "🚽", img: `${LOCAL}/bathroom.gif` },
  { id: "i-dont-know", label: "I Don't Know", emoji: "🤷", img: `${LOCAL}/i-dont-know.gif` },
];

// ── FEELINGS ────────────────────────────────────────────────────────────────
const ASL_FEELINGS = [
  { id: "happy", label: "Happy", emoji: "😊", img: `${LOCAL}/happy.gif` },
  { id: "sad", label: "Sad", emoji: "😢", img: `${LOCAL}/sad.gif` },
  { id: "angry", label: "Angry", emoji: "😠", img: `${LOCAL}/angry.gif` },
  { id: "scared", label: "Scared", emoji: "😨", img: `${LOCAL}/scared.gif` },
  { id: "anxious", label: "Anxious", emoji: "😰", img: `${LOCAL}/anxious.gif` },
  { id: "frustrated", label: "Frustrated", emoji: "😣", img: `${LOCAL}/frustrated.gif` },
  { id: "lonely", label: "Lonely", emoji: "🥀", img: `${LOCAL}/lonely.gif` },
  { id: "overwhelmed", label: "Overwhelmed", emoji: "🌊", img: `${LP}/o/overwhelmed.gif` },
  { id: "calm", label: "Calm", emoji: "😌", img: `${LOCAL}/calm.jpg` },
  { id: "hopeful", label: "Hopeful", emoji: "🌅", img: `${LP}/h/hopeful.gif` },
  { id: "grateful", label: "Grateful", emoji: "🙏", img: `${LP}/g/grateful.gif` },
  { id: "loved", label: "Loved", emoji: "❤️", img: `${LOCAL}/loved.gif` },
  { id: "proud", label: "Proud", emoji: "🦁", img: `${LOCAL}/proud.gif` },
  { id: "brave", label: "Brave", emoji: "💪", img: `${LOCAL}/brave.gif` },
  { id: "numb", label: "Numb", emoji: "🧊", img: `${LP}/n/numb.gif` },
  { id: "grief", label: "Grief", emoji: "🖤", img: `${LP}/g/grief.gif` },
  { id: "shame", label: "Shame", emoji: "😶", img: `${LP}/s/shame.gif` },
  { id: "healing", label: "Healing", emoji: "🌱", img: `${LP}/h/healing.gif` },
  { id: "confused", label: "Confused", emoji: "🌀", img: `${LP}/c/confused.gif` },
  { id: "peaceful", label: "Peaceful", emoji: "🕊️", img: `${LP}/p/peaceful.gif` },
  { id: "stuck", label: "Stuck", emoji: "🪨", img: `${LOCAL}/stuck.gif` },
  { id: "i-dont-know", label: "I Don't Know", emoji: "🤷", img: `${LOCAL}/i-dont-know.gif` },
];

// ── FIXED SIGN CARD ──────────────────────────────────────────────────────────
function ASLSignCard({
  img,
  gifFallback,
  emoji,
  label,
}: {
  img: string;
  gifFallback?: string;
  emoji: string;
  label: string;
}) {
  const [step, setStep] = useState(0);

  const source =
    step === 0 ? img :
    step === 1 ? gifFallback :
    null;

  if (!source) {
    return (
      <span className="text-2xl w-10 h-10 flex items-center justify-center">
        {emoji}
      </span>
    );
  }

  return (
    <img
      src={source}
      alt={label}
      className="h-10 w-10 object-contain rounded bg-white shrink-0"
      onError={() => setStep((s) => s + 1)}
    />
  );
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
export default function ASLSignInput({ onSend, disabled }: any) {
  const [cardTab, setCardTab] = useState("words");
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [pendingCard, setPendingCard] = useState<any>(null);
  const [lastSent, setLastSent] = useState("");

  const sendCard = (label: string, emoji?: string) => {
    if (disabled) return;
    setPendingCard({ label, emoji });
  };

  const confirmCard = () => {
    if (!pendingCard) return;
    setLastSent(pendingCard.label);
    onSend(pendingCard.label);
    setPendingCard(null);
  };

  const sendSpelledWord = () => {
    const word = selectedLetters.join("");
    setLastSent(word);
    onSend(word);
    setSelectedLetters([]);
  };

  return (
    <div className="px-4 py-3 space-y-3">

      <Tabs value={cardTab} onValueChange={setCardTab}>
        <TabsList>
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
                onClick={() => sendCard(c.label, c.emoji)}
                className="flex flex-col items-center gap-1 p-2 border rounded-xl bg-white"
              >
                <ASLSignCard img={c.img} emoji={c.emoji} label={c.label} />
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
                onClick={() => sendCard(c.label, c.emoji)}
                className="flex flex-col items-center gap-1 p-2 border rounded-xl bg-white"
              >
                <ASLSignCard img={c.img} emoji={c.emoji} label={c.label} />
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
                onClick={() => setSelectedLetters((p) => [...p, c.label])}
                className="flex flex-col items-center p-2 border rounded-xl bg-white"
              >
                <ASLSignCard
                  img={c.imgGif}
                  gifFallback={c.imgJpg}
                  emoji={c.label}
                  label={c.label}
                />
                <span className="text-[10px] font-bold">{c.label}</span>
              </button>
            ))}
          </div>

          {selectedLetters.length > 0 && (
            <button onClick={sendSpelledWord} className="mt-2 w-full p-2 bg-black text-white rounded-xl">
              Send Word
            </button>
          )}
        </TabsContent>
      </Tabs>

      {pendingCard && (
        <div className="p-3 border rounded-xl">
          <p>Send {pendingCard.label}?</p>
          <button onClick={confirmCard}>Yes</button>
        </div>
      )}
    </div>
  );
}
