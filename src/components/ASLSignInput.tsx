import { useState, useRef, useEffect } from "react";
import { Hand, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ── ASL Alphabet ──────────────────────────────────────────────────────────────
const ASL_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => ({
  id: letter,
  label: letter,
  img: `https://www.signingsavvy.com/media/signs/alphabet/${letter.toLowerCase()}.jpg`,
  fallback: `https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Sign_language_${letter}.svg/80px-Sign_language_${letter}.svg.png`,
}));

// ── Common Words ──────────────────────────────────────────────────────────────
const ASL_COMMON_WORDS = [
  { id: "hello",           label: "Hello",           emoji: "👋" },
  { id: "thank-you",       label: "Thank You",       emoji: "🙏" },
  { id: "please",          label: "Please",           emoji: "🤲" },
  { id: "yes",             label: "Yes",             emoji: "👍" },
  { id: "no",              label: "No",              emoji: "👎" },
  { id: "help",            label: "Help",            emoji: "🆘" },
  { id: "sorry",           label: "Sorry",           emoji: "😔" },
  { id: "love",            label: "Love",            emoji: "❤️" },
  { id: "happy",           label: "Happy",           emoji: "😊" },
  { id: "sad",             label: "Sad",             emoji: "😢" },
  { id: "angry",           label: "Angry",           emoji: "😠" },
  { id: "scared",          label: "Scared",          emoji: "😨" },
  { id: "tired",           label: "Tired",           emoji: "😴" },
  { id: "hungry",          label: "Hungry",          emoji: "🍽️" },
  { id: "water",           label: "Water",           emoji: "💧" },
  { id: "pain",            label: "Pain",            emoji: "🤕" },
  { id: "family",          label: "Family",          emoji: "👨‍👩‍👧‍👦" },
  { id: "friend",          label: "Friend",          emoji: "🤝" },
  { id: "home",            label: "Home",            emoji: "🏠" },
  { id: "safe",            label: "Safe",            emoji: "🛡️" },
  { id: "understand",      label: "Understand",      emoji: "💡" },
  { id: "dont-understand", label: "Don't Understand",emoji: "❓" },
  { id: "stop",            label: "Stop",            emoji: "✋" },
  { id: "more",            label: "More",            emoji: "➕" },
];

// ── Feelings ──────────────────────────────────────────────────────────────────
const ASL_FEELINGS = [
  { id: "peaceful",     label: "Peaceful",     emoji: "🕊️" },
  { id: "anxious",      label: "Anxious",      emoji: "😰" },
  { id: "hopeful",      label: "Hopeful",      emoji: "🌅" },
  { id: "lonely",       label: "Lonely",       emoji: "🥀" },
  { id: "grateful",     label: "Grateful",     emoji: "✨" },
  { id: "confused",     label: "Confused",     emoji: "🌀" },
  { id: "overwhelmed",  label: "Overwhelmed",  emoji: "🌊" },
  { id: "numb",         label: "Numb",         emoji: "🧊" },
  { id: "healing",      label: "Healing",      emoji: "🌱" },
  { id: "grief",        label: "Grief",        emoji: "🖤" },
  { id: "shame",        label: "Shame",        emoji: "😶" },
  { id: "rage",         label: "Rage",         emoji: "🔥" },
  { id: "i-dont-know",  label: "I Don't Know", emoji: "🤷" },
  { id: "frustrated",   label: "Frustrated",   emoji: "😣" },
  { id: "ashamed",      label: "Ashamed",      emoji: "😔" },
  { id: "safe-feeling", label: "Safe",         emoji: "🛡️" },
];

// ── AI Signs Back ─────────────────────────────────────────────────────────────
function AISignsBack({ word }: { word: string }) {
  const letters = word.toUpperCase().replace(/[^A-Z]/g, "").split("");
  if (letters.length === 0) return null;
  return (
    <div className="rounded-xl border border-primary/30 bg-primary/5 p-3 space-y-2">
      <p className="text-xs text-center text-muted-foreground">
        ✋ Soul Echoes is signing back:{" "}
        <span className="text-foreground font-semibold">{word}</span>
      </p>
      <div className="flex flex-wrap gap-2 justify-center">
        {letters.map((letter, i) => (
          <div key={i} className="flex flex-col items-center gap-0.5">
            <img
              src={`https://www.signingsavvy.com/media/signs/alphabet/${letter.toLowerCase()}.jpg`}
              alt={`ASL ${letter}`}
              className="h-12 w-12 object-contain rounded-lg border border-border bg-white"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.src = `https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Sign_language_${letter}.svg/80px-Sign_language_${letter}.svg.png`;
              }}
            />
            <span className="text-[11px] font-bold text-primary">{letter}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Learn A Sign Panel ────────────────────────────────────────────────────────
function LearnSign({ letter }: { letter: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 flex flex-col items-center gap-2">
      <p className="text-sm font-semibold text-foreground">How to sign "{letter}"</p>
      <img
        src={`https://www.signingsavvy.com/media/signs/alphabet/${letter.toLowerCase()}.jpg`}
        alt={`ASL ${letter}`}
        className="h-28 w-28 object-contain rounded-xl border border-border bg-white"
        onError={(e) => {
          const img = e.target as HTMLImageElement;
          img.src = `https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Sign_language_${letter}.svg/80px-Sign_language_${letter}.svg.png`;
        }}
      />
      <p className="text-xs text-muted-foreground text-center">
        Tap any letter below to see how to sign it
      </p>
    </div>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface ASLSignInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ASLSignInput({ onSend, disabled }: ASLSignInputProps) {
  const [cameraActive, setCameraActive]       = useState(false);
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [cardTab, setCardTab]                 = useState("words");
  const [lastSent, setLastSent]               = useState("");
  const [learnLetter, setLearnLetter]         = useState<string | null>(null);
  const [justSent, setJustSent]               = useState(false);
  const videoRef  = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraActive(true);
    } catch {
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraActive(false);
  };

  useEffect(() => {
    return () => { streamRef.current?.getTracks().forEach((t) => t.stop()); };
  }, []);

  // send a card tap
  const sendCard = (label: string) => {
    if (disabled) return;
    setLastSent(label);
    setJustSent(true);
    onSend(`[ASL Sign] ${label}`);
    setTimeout(() => setJustSent(false), 1500);
  };

  // send fingerspelled word
  const sendSpelledWord = () => {
    if (selectedLetters.length === 0 || disabled) return;
    const word = selectedLetters.join("");
    setLastSent(word);
    setJustSent(true);
    onSend(`[ASL Fingerspell] ${word}`);
    setSelectedLetters([]);
    setTimeout(() => setJustSent(false), 1500);
  };

  return (
    <div className="px-4 py-3 space-y-3">

      {/* ── Camera toggle ── */}
      <div className="flex items-center gap-2">
        {!cameraActive ? (
          <Button
            onClick={startCamera}
            variant="outline"
            size="sm"
            className="gap-2 rounded-xl"
            disabled={disabled}
          >
            <Hand className="h-4 w-4" /> Open Camera to Sign
          </Button>
        ) : (
          <Button
            onClick={stopCamera}
            variant="destructive"
            size="sm"
            className="gap-2 rounded-xl"
          >
            <X className="h-4 w-4" /> Close Camera
          </Button>
        )}
        {justSent && (
          <span className="text-xs text-green-500 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" /> Sent!
          </span>
        )}
      </div>

      {/* ── Camera view ── */}
      {cameraActive && (
        <div className="rounded-xl overflow-hidden border border-border bg-card relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full aspect-video object-cover"
          />
          <div className="absolute bottom-2 left-2 bg-background/80 text-xs px-2 py-1 rounded-lg text-foreground">
            You — Sign Here
          </div>
        </div>
      )}

      {/* ── AI signs back ── */}
      {lastSent.length > 0 && <AISignsBack word={lastSent} />}

      {/* ── Learn a sign panel ── */}
      {learnLetter && <LearnSign letter={learnLetter} />}

      {/* ── Tabs ── */}
      <Tabs value={cardTab} onValueChange={setCardTab}>
        <TabsList className="bg-muted w-full">
          <TabsTrigger value="words"    className="text-xs flex-1">Common Signs</TabsTrigger>
          <TabsTrigger value="feelings" className="text-xs flex-1">Feelings</TabsTrigger>
          <TabsTrigger value="alphabet" className="text-xs flex-1">Fingerspell</TabsTrigger>
        </TabsList>

        {/* ── Common words ── */}
        <TabsContent value="words" className="mt-2">
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 max-h-52 overflow-y-auto p-1">
            {ASL_COMMON_WORDS.map((card) => (
              <button
                key={card.id}
                onClick={() => sendCard(card.label)}
                disabled={disabled}
                className="flex flex-col items-center gap-0.5 p-2 rounded-xl border border-border bg-card hover:bg-primary/10 active:scale-95 transition-all disabled:opacity-50"
              >
                <span className="text-2xl">{card.emoji}</span>
                <span className="text-[10px] text-foreground leading-tight text-center">{card.label}</span>
              </button>
            ))}
          </div>
        </TabsContent>

        {/* ── Feelings ── */}
        <TabsContent value="feelings" className="mt-2">
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 max-h-52 overflow-y-auto p-1">
            {ASL_FEELINGS.map((card) => (
              <button
                key={card.id}
                onClick={() => sendCard(card.label)}
                disabled={disabled}
                className="flex flex-col items-center gap-0.5 p-2 rounded-xl border border-border bg-card hover:bg-primary/10 active:scale-95 transition-all disabled:opacity-50"
              >
                <span className="text-2xl">{card.emoji}</span>
                <span className="text-[10px] text-foreground leading-tight text-center">{card.label}</span>
              </button>
            ))}
          </div>
        </TabsContent>

        {/* ── Alphabet / Fingerspell ── */}
        <TabsContent value="alphabet" className="mt-2 space-y-2">
          <p className="text-[11px] text-muted-foreground text-center">
            Tap a letter to fingerspell • Long press to learn the sign
          </p>

          {/* word builder */}
          {selectedLetters.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex-1 flex flex-wrap gap-1 p-2 rounded-xl border border-border bg-card min-h-[36px]">
                {selectedLetters.map((l, i) => (
                  <span key={i} className="text-sm font-bold text-primary">{l}</span>
                ))}
              </div>
              <Button
                onClick={() => setSelectedLetters([])}
                variant="ghost"
                size="sm"
                className="text-xs"
              >
                Clear
              </Button>
              <Button
                onClick={sendSpelledWord}
                size="sm"
                className="text-xs rounded-xl"
                disabled={disabled}
              >
                Send
              </Button>
            </div>
          )}

          {/* alphabet grid with real ASL images */}
          <div className="grid grid-cols-6 sm:grid-cols-9 gap-1.5 max-h-64 overflow-y-auto p-1">
            {ASL_ALPHABET.map((card) => (
              <button
                key={card.id}
                onClick={() => {
                  setSelectedLetters((prev) => [...prev, card.label]);
                  setLearnLetter(card.label);
                }}
                disabled={disabled}
                className="flex flex-col items-center justify-center gap-0.5 p-1 rounded-lg border border-border bg-card hover:bg-primary/10 active:scale-95 transition-all disabled:opacity-50"
              >
                <img
                  src={card.img}
                  alt={`ASL ${card.label}`}
                  className="h-10 w-10 object-contain rounded bg-white"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    if (img.src !== card.fallback) img.src = card.fallback;
                  }}
                />
                <span className="text-[10px] font-bold text-foreground">{card.label}</span>
              </button>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
