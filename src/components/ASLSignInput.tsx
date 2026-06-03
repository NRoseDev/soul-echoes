import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LOCAL = "/asl/signs";
const ALPHA = "/asl/alpha";

// Try .gif first, then .jpg, then emoji fallback
const sign = (slug: string, emoji: string, label: string, exts: string[] = ["gif", "jpg"]) => ({
  id: slug,
  label,
  emoji,
  sources: exts.map((e) => `${LOCAL}/${slug}.${e}`),
});

const ASL_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((l) => ({
  id: l,
  label: l,
  emoji: l,
  sources: [`${ALPHA}/${l.toLowerCase()}.gif`],
}));

const ASL_COMMON_WORDS = [
  sign("hello", "👋", "Hello", ["jpg", "gif"]),
  sign("thank-you", "🙏", "Thank You"),
  sign("please", "🤲", "Please", ["jpg", "gif"]),
  { id: "sorry", label: "Sorry", emoji: "😔", sources: [] as string[] },
  sign("yes", "👍", "Yes"),
  sign("no", "👎", "No"),
  sign("help", "🆘", "Help"),
  sign("stop", "✋", "Stop"),
  sign("wait", "⏳", "Wait"),
  sign("more", "➕", "More"),
  sign("again", "🔁", "Again", ["jpg", "gif"]),
  { id: "want", label: "Want", emoji: "🙋", sources: [] as string[] },
  sign("need", "❗", "Need", ["jpg", "gif"]),
  sign("like", "💗", "Like", ["jpg", "gif"]),
  sign("love", "❤️", "Love"),
  sign("loved", "💞", "Loved"),
  sign("understand", "💡", "Understand"),
  sign("friend", "🤝", "Friend"),
  sign("family", "👨‍👩‍👧", "Family", ["jpg", "gif"]),
  sign("together", "🫂", "Together", ["jpg", "gif"]),
  sign("home", "🏠", "Home"),
  sign("water", "💧", "Water"),
  sign("drink", "🥤", "Drink", ["jpg", "gif"]),
  sign("eat", "🍽️", "Eat", ["jpg", "gif"]),
  sign("hungry", "🍞", "Hungry", ["jpg", "gif"]),
  sign("bathroom", "🚽", "Bathroom"),
  sign("sleep", "🛏️", "Sleep", ["jpg", "gif"]),
  sign("tired", "😴", "Tired"),
  sign("sick", "🤒", "Sick"),
  sign("hurt", "🤕", "Hurt", ["jpg", "gif"]),
  sign("pain", "😣", "Pain"),
  sign("breathe", "🌬️", "Flow", ["jpg", "gif"]),
  sign("good", "👌", "Good", ["jpg", "gif"]),
  { id: "how", label: "How", emoji: "❓", sources: [] as string[] },
  sign("what", "❔", "What", ["jpg", "gif"]),
  sign("when", "🕐", "When", ["jpg", "gif"]),
  sign("where", "📍", "Where", ["jpg", "gif"]),
  sign("who", "👤", "Who", ["jpg", "gif"]),
  sign("believe", "✨", "Believe", ["jpg", "gif"]),
  sign("hope", "🌅", "Hope", ["jpg", "gif"]),
  sign("trust", "🤲", "Trust", ["jpg", "gif"]),
  sign("peace", "🕊️", "Peace", ["jpg", "gif"]),
  sign("accept", "🙆", "Accept", ["jpg", "gif"]),
  { id: "i-dont-know", label: "I Don't Know", emoji: "🤷", sources: [] as string[] },
];

const ASL_FEELINGS = [
  sign("happy", "😊", "Happy"),
  sign("sad", "😢", "Sad"),
  sign("angry", "😠", "Angry"),
  sign("anger", "🔥", "Anger", ["jpg", "gif"]),
  sign("scared", "😨", "Scared"),
  sign("anxious", "😰", "Anxious"),
  sign("frustrated", "😣", "Frustrated"),
  sign("lonely", "🥀", "Lonely"),
  sign("jealous", "😒", "Jealous"),
  sign("embarrassed", "😳", "Embarrassed", ["jpg", "gif"]),
  { id: "depressed", label: "Depressed", emoji: "😔", sources: [] as string[] },
  sign("calm", "😌", "Calm", ["jpg", "gif"]),
  sign("hope", "🌅", "Hopeful", ["jpg", "gif"]),
  sign("grateful", "🙏", "Grateful", ["jpg", "gif"]),
  sign("loved", "❤️", "Loved"),
  sign("love", "💖", "Love"),
  sign("proud", "🦁", "Proud"),
  sign("brave", "💪", "Brave"),
  sign("strong", "🛡️", "Strong", ["jpg", "gif"]),
  sign("shame", "😶", "Shame", ["jpg", "gif"]),
  sign("cry", "😭", "Crying", ["jpg", "gif"]),
  sign("hurt", "💔", "Hurt", ["jpg", "gif"]),
  sign("stuck", "🪨", "Stuck"),
  sign("tired", "😴", "Tired"),
  sign("sick", "🤒", "Sick"),
  sign("peace", "🕊️", "Peaceful", ["jpg", "gif"]),
  sign("understand", "💡", "Understand"),
  sign("believe", "✨", "Believe", ["jpg", "gif"]),
  sign("trust", "🤲", "Trust", ["jpg", "gif"]),
  sign("accept", "🙆", "Accept", ["jpg", "gif"]),
  sign("breathe", "🌬️", "Flowing", ["jpg", "gif"]),
  sign("good", "👌", "Good", ["jpg", "gif"]),
  sign("like", "💗", "Like", ["jpg", "gif"]),
  { id: "numb", label: "Numb", emoji: "🧊", sources: [] as string[] },
  { id: "grief", label: "Grief", emoji: "🖤", sources: [] as string[] },
  { id: "healing", label: "Healing", emoji: "🌱", sources: [] as string[] },
  { id: "confused", label: "Confused", emoji: "🌀", sources: [] as string[] },
  { id: "overwhelmed", label: "Overwhelmed", emoji: "🌊", sources: [] as string[] },
  { id: "hopeless", label: "Hopeless", emoji: "😞", sources: [] as string[] },
  { id: "betrayed", label: "Betrayed", emoji: "💢", sources: [] as string[] },
  { id: "ashamed", label: "Ashamed", emoji: "🫣", sources: [] as string[] },
  { id: "restless", label: "Restless", emoji: "😬", sources: [] as string[] },
  { id: "disconnected", label: "Disconnected", emoji: "🌫️", sources: [] as string[] },
  { id: "i-dont-know", label: "I Don't Know", emoji: "🤷", sources: [] as string[] },
];

function SignImg({ sources, emoji, label }: { sources: string[]; emoji: string; label: string }) {
  const [step, setStep] = useState(0);
  const src = sources[step];
  if (!src) return <span className="text-2xl leading-none">{emoji}</span>;
  return (
    <img
      src={src}
      alt={`ASL sign for ${label}`}
      className="h-12 w-12 object-contain rounded bg-white"
      onError={() => setStep((s) => s + 1)}
    />
  );
}

export default function ASLSignInput({ onSend }: { onSend: (msg: string) => void; disabled?: boolean }) {
  const [tab, setTab] = useState("words");
  const [letters, setLetters] = useState<string[]>([]);

  return (
    <div className="px-4 py-3 space-y-3">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="w-full">
          <TabsTrigger value="words">Common ({ASL_COMMON_WORDS.length})</TabsTrigger>
          <TabsTrigger value="feelings">Feelings ({ASL_FEELINGS.length})</TabsTrigger>
          <TabsTrigger value="alphabet">ABC</TabsTrigger>
        </TabsList>

        <TabsContent value="words">
          <div className="grid grid-cols-4 gap-2 max-h-[55vh] overflow-y-auto">
            {ASL_COMMON_WORDS.map((c) => (
              <button
                key={c.id}
                onClick={() => onSend(c.label)}
                className="p-2 border rounded-xl flex flex-col items-center gap-1 hover:border-primary/40"
              >
                <SignImg sources={c.sources} emoji={c.emoji} label={c.label} />
                <span className="text-[10px] text-center leading-tight">{c.label}</span>
              </button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="feelings">
          <div className="grid grid-cols-4 gap-2 max-h-[55vh] overflow-y-auto">
            {ASL_FEELINGS.map((c) => (
              <button
                key={c.id}
                onClick={() => onSend(c.label)}
                className="p-2 border rounded-xl flex flex-col items-center gap-1 hover:border-primary/40"
              >
                <SignImg sources={c.sources} emoji={c.emoji} label={c.label} />
                <span className="text-[10px] text-center leading-tight">{c.label}</span>
              </button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="alphabet">
          <div className="grid grid-cols-6 gap-2 max-h-[50vh] overflow-y-auto">
            {ASL_ALPHABET.map((c) => (
              <button
                key={c.id}
                onClick={() => setLetters((p) => [...p, c.label])}
                className="p-2 border rounded-xl flex flex-col items-center gap-1"
              >
                <SignImg sources={c.sources} emoji={c.label} label={c.label} />
                <span className="text-[10px] font-bold">{c.label}</span>
              </button>
            ))}
          </div>

          {letters.length > 0 && (
            <div className="mt-3 space-y-2">
              <div className="p-2 bg-muted rounded-lg text-center font-mono tracking-widest">{letters.join("")}</div>
              <div className="flex gap-2">
                <button
                  className="flex-1 p-2 bg-primary text-primary-foreground rounded-xl"
                  onClick={() => {
                    onSend(letters.join(""));
                    setLetters([]);
                  }}
                >
                  Send Word
                </button>
                <button
                  className="px-3 p-2 border rounded-xl"
                  onClick={() => setLetters((p) => p.slice(0, -1))}
                >
                  ⌫
                </button>
                <button
                  className="px-3 p-2 border rounded-xl"
                  onClick={() => setLetters([])}
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
