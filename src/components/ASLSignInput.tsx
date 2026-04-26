import { useState, useRef, useEffect } from "react";
import { Hand, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ── ASL Alphabet — Handspeak.com (reliable per-letter images) ────────────────
const ASL_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => ({
  id: letter,
  label: letter,
  img: `https://www.handspeak.com/spell/index/asl-abc-${letter.toLowerCase()}.jpg`,
}));

// lifeprint.com hosts free ASL sign GIFs by word name
const LP = "https://www.lifeprint.com/asl101/gifs";

// ── Common Words ──────────────────────────────────────────────────────────────
const ASL_COMMON_WORDS = [
  { id: "hello",           label: "Hello",           emoji: "👋",  img: `${LP}/h/hello.gif` },
  { id: "thank-you",       label: "Thank You",       emoji: "🙏",  img: `${LP}/t/thank-you.gif` },
  { id: "please",          label: "Please",          emoji: "🤲",  img: `${LP}/p/please.gif` },
  { id: "yes",             label: "Yes",             emoji: "👍",  img: `${LP}/y/yes.gif` },
  { id: "no",              label: "No",              emoji: "👎",  img: `${LP}/n/no.gif` },
  { id: "help",            label: "Help",            emoji: "🆘",  img: `${LP}/h/help.gif` },
  { id: "sorry",           label: "Sorry",           emoji: "😔",  img: `${LP}/s/sorry.gif` },
  { id: "love",            label: "Love",            emoji: "❤️",  img: `${LP}/l/love.gif` },
  { id: "safe",            label: "Safe",            emoji: "🛡️", img: `${LP}/s/safe.gif` },
  { id: "pain",            label: "Pain",            emoji: "🤕",  img: `${LP}/p/pain.gif` },
  { id: "water",           label: "Water",           emoji: "💧",  img: `${LP}/w/water.gif` },
  { id: "hungry",          label: "Hungry",          emoji: "🍽️", img: `${LP}/h/hungry.gif` },
  { id: "tired",           label: "Tired",           emoji: "😴",  img: `${LP}/t/tired.gif` },
  { id: "stop",            label: "Stop",            emoji: "✋",  img: `${LP}/s/stop.gif` },
  { id: "more",            label: "More",            emoji: "➕",  img: `${LP}/m/more.gif` },
  { id: "understand",      label: "Understand",      emoji: "💡",  img: `${LP}/u/understand.gif` },
  { id: "friend",          label: "Friend",          emoji: "🤝",  img: `${LP}/f/friend.gif` },
  { id: "home",            label: "Home",            emoji: "🏠",  img: `${LP}/h/home.gif` },
  { id: "breathe",         label: "Breathe",         emoji: "🌬️", img: `${LP}/b/breathe.gif` },
  { id: "wait",            label: "Wait",            emoji: "⏳",  img: `${LP}/w/wait.gif` },
  { id: "together",        label: "Together",        emoji: "🫂",  img: `${LP}/t/together.gif` },
  { id: "bathroom",        label: "Bathroom",        emoji: "🚽",  img: `${LP}/b/bathroom.gif` },
];

// ── Feelings ──────────────────────────────────────────────────────────────────
const ASL_FEELINGS = [
  { id: "peaceful",      label: "Peaceful",      emoji: "🕊️", img: `${LP}/p/peaceful.gif` },
  { id: "anxious",       label: "Anxious",       emoji: "😰",  img: `${LP}/a/anxious.gif` },
  { id: "hopeful",       label: "Hopeful",       emoji: "🌅",  img: `${LP}/h/hopeful.gif` },
  { id: "lonely",        label: "Lonely",        emoji: "🥀",  img: `${LP}/l/lonely.gif` },
  { id: "grateful",      label: "Grateful",      emoji: "🙏",  img: `${LP}/g/grateful.gif` },
  { id: "confused",      label: "Confused",      emoji: "🌀",  img: `${LP}/c/confused.gif` },
  { id: "overwhelmed",   label: "Overwhelmed",   emoji: "🌊",  img: `${LP}/o/overwhelmed.gif` },
  { id: "numb",          label: "Numb",          emoji: "🧊",  img: `${LP}/n/numb.gif` },
  { id: "healing",       label: "Healing",       emoji: "🌱",  img: `${LP}/h/healing.gif` },
  { id: "grief",         label: "Grief",         emoji: "🖤",  img: `${LP}/g/grief.gif` },
  { id: "shame",         label: "Shame",         emoji: "😶",  img: `${LP}/s/shame.gif` },
  { id: "rage",          label: "Rage",          emoji: "🔥",  img: `${LP}/r/rage.gif` },
  { id: "frustrated",    label: "Frustrated",    emoji: "😣",  img: `${LP}/f/frustrated.gif` },
  { id: "ashamed",       label: "Ashamed",       emoji: "😔",  img: `${LP}/a/ashamed.gif` },
  { id: "brave",         label: "Brave",         emoji: "💪",  img: `${LP}/b/brave.gif` },
  { id: "loved",         label: "Loved",         emoji: "❤️",  img: `${LP}/l/loved.gif` },
  { id: "broken",        label: "Broken",        emoji: "💔",  img: `${LP}/b/broken.gif` },
  { id: "curious",       label: "Curious",       emoji: "🔍",  img: `${LP}/c/curious.gif` },
  { id: "proud",         label: "Proud",         emoji: "🦁",  img: `${LP}/p/proud.gif` },
  { id: "free",          label: "Free",          emoji: "🦋",  img: `${LP}/f/free.gif` },
  { id: "happy",         label: "Happy",         emoji: "😊",  img: `${LP}/h/happy.gif` },
  { id: "sad",           label: "Sad",           emoji: "😢",  img: `${LP}/s/sad.gif` },
  { id: "angry",         label: "Angry",         emoji: "😠",  img: `${LP}/a/angry.gif` },
  { id: "scared",        label: "Scared",        emoji: "😨",  img: `${LP}/s/scared.gif` },
  { id: "calm",          label: "Calm",          emoji: "😌",  img: `${LP}/c/calm.gif` },
  { id: "i-dont-know",   label: "I Don't Know",  emoji: "🤷",  img: `${LP}/i/i-dont-know.gif` },
  { id: "safe-feeling",  label: "Safe",          emoji: "🛡️", img: `${LP}/s/safe.gif` },
  { id: "abandoned",     label: "Abandoned",     emoji: "🏚️", img: `${LP}/a/abandoned.gif` },
  { id: "nurtured",      label: "Nurtured",      emoji: "🤗",  img: `${LP}/n/nurtured.gif` },
  { id: "empowered",     label: "Empowered",     emoji: "⚡",  img: `${LP}/e/empowered.gif` },
  { id: "stuck",         label: "Stuck",         emoji: "🪨",  img: `${LP}/s/stuck.gif` },
  { id: "connected",     label: "Connected",     emoji: "🤝",  img: `${LP}/c/connected.gif` },
  { id: "at-peace",      label: "At Peace",      emoji: "☮️",  img: `${LP}/a/at-peace.gif` },
];

// ── Sign Card: shows real ASL image, falls back to emoji if image fails ───────
function ASLSignCard({ img, emoji, label }: { img: string; emoji: string; label: string }) {
  const [failed, setFailed] = useState(false);
  return failed ? (
    <span className="text-2xl h-10 w-10 flex items-center justify-center">{emoji}</span>
  ) : (
    <img
      src={img}
      alt={`ASL sign for ${label}`}
      className="h-10 w-10 object-contain rounded bg-white"
      onError={() => setFailed(true)}
    />
  );
}

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
              src={`https://www.handspeak.com/spell/index/asl-abc-${letter.toLowerCase()}.jpg`}
              alt={`ASL ${letter}`}
              className="h-12 w-12 object-contain rounded-lg border border-border bg-white"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
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
        src={`https://www.handspeak.com/spell/index/asl-abc-${letter.toLowerCase()}.jpg`}
        alt={`ASL ${letter}`}
        className="h-28 w-28 object-contain rounded-xl border border-border bg-white"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
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
  const [pendingCard, setPendingCard]         = useState<{ label: string; emoji?: string } | null>(null);
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

  // confirm a card tap
  const sendCard = (label: string, emoji?: string) => {
    if (disabled) return;
    setPendingCard({ label, emoji });
  };

  const confirmCard = () => {
    if (!pendingCard) return;
    setLastSent(pendingCard.label);
    setJustSent(true);
    onSend(`[ASL Sign] ${pendingCard.label}`);
    setPendingCard(null);
    setTimeout(() => setJustSent(false), 1500);
  };

  const cancelCard = () => setPendingCard(null);

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

      {/* ── Confirmation card ── */}
      {pendingCard && (
        <div className="rounded-2xl border-2 border-primary/40 bg-primary/10 p-4 space-y-3 text-center">
          <p className="text-sm font-semibold text-foreground">
            {pendingCard.emoji && <span className="mr-2 text-xl">{pendingCard.emoji}</span>}
            Send <span className="text-primary">"{pendingCard.label}"</span>?
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={confirmCard} size="sm" className="rounded-xl px-6">
              Yes
            </Button>
            <Button onClick={cancelCard} size="sm" variant="outline" className="rounded-xl px-6">
              No
            </Button>
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
                onClick={() => sendCard(card.label, card.emoji)}
                disabled={disabled}
                className="flex flex-col items-center gap-0.5 p-1.5 rounded-xl border border-border bg-card hover:bg-primary/10 active:scale-95 transition-all disabled:opacity-50"
              >
                <ASLSignCard img={card.img} emoji={card.emoji} label={card.label} />
                <span className="text-[10px] text-foreground leading-tight text-center w-full truncate">{card.label}</span>
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
                onClick={() => sendCard(card.label, card.emoji)}
                disabled={disabled}
                className="flex flex-col items-center gap-0.5 p-1.5 rounded-xl border border-border bg-card hover:bg-primary/10 active:scale-95 transition-all disabled:opacity-50"
              >
                <ASLSignCard img={card.img} emoji={card.emoji} label={card.label} />
                <span className="text-[10px] text-foreground leading-tight text-center w-full truncate">{card.label}</span>
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
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
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
