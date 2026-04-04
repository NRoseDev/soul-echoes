import { useState, useRef, useEffect } from "react";
import { Hand, Video, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ASL_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => ({
  id: letter,
  label: letter,
  img: `https://www.lifeprint.com/asl101/fingerspelling/abc-signs/${letter.toLowerCase()}.gif`,
}));

const ASL_COMMON_WORDS = [
  { id: "hello", label: "Hello", emoji: "👋" },
  { id: "thank-you", label: "Thank You", emoji: "🙏" },
  { id: "please", label: "Please", emoji: "🤲" },
  { id: "yes", label: "Yes", emoji: "👍" },
  { id: "no", label: "No", emoji: "👎" },
  { id: "help", label: "Help", emoji: "🆘" },
  { id: "sorry", label: "Sorry", emoji: "😔" },
  { id: "love", label: "Love", emoji: "❤️" },
  { id: "happy", label: "Happy", emoji: "😊" },
  { id: "sad", label: "Sad", emoji: "😢" },
  { id: "angry", label: "Angry", emoji: "😠" },
  { id: "scared", label: "Scared", emoji: "😨" },
  { id: "tired", label: "Tired", emoji: "😴" },
  { id: "hungry", label: "Hungry", emoji: "🍽️" },
  { id: "water", label: "Water", emoji: "💧" },
  { id: "pain", label: "Pain", emoji: "🤕" },
  { id: "family", label: "Family", emoji: "👨‍👩‍👧‍👦" },
  { id: "friend", label: "Friend", emoji: "🤝" },
  { id: "home", label: "Home", emoji: "🏠" },
  { id: "safe", label: "Safe", emoji: "🛡️" },
  { id: "understand", label: "Understand", emoji: "💡" },
  { id: "dont-understand", label: "Don't Understand", emoji: "❓" },
  { id: "stop", label: "Stop", emoji: "✋" },
  { id: "more", label: "More", emoji: "➕" },
];

const ASL_FEELINGS = [
  { id: "peaceful", label: "Peaceful", emoji: "🕊️" },
  { id: "anxious", label: "Anxious", emoji: "😰" },
  { id: "hopeful", label: "Hopeful", emoji: "🌅" },
  { id: "lonely", label: "Lonely", emoji: "🥀" },
  { id: "grateful", label: "Grateful", emoji: "✨" },
  { id: "confused", label: "Confused", emoji: "🌀" },
  { id: "overwhelmed", label: "Overwhelmed", emoji: "🌊" },
  { id: "numb", label: "Numb", emoji: "🧊" },
  { id: "healing", label: "Healing", emoji: "🌱" },
  { id: "grief", label: "Grief", emoji: "🖤" },
  { id: "shame", label: "Shame", emoji: "😶" },
  { id: "rage", label: "Rage", emoji: "🔥" },
  { id: "i-dont-know", label: "I Don't Know", emoji: "🤷" },
  { id: "frustrated", label: "Frustrated", emoji: "😣" },
  { id: "ashamed", label: "Ashamed", emoji: "😔" },
  { id: "safe-feeling", label: "Safe", emoji: "🛡️" },
];
function AISignResponse({ word }: { word: string }) {
  const letters = word.toUpperCase().replace(/[^A-Z]/g, "").split("");
  if (letters.length === 0) return null;
  return (
    <div className="rounded-xl border border-border bg-card p-3 space-y-2">
      <p className="text-xs text-muted-foreground text-center">AI signing: <span className="text-foreground font-medium">{word}</span></p>
      <div className="flex flex-wrap gap-1 justify-center">
        {letters.map((letter, i) => (
          <div key={i} className="flex flex-col items-center">
            <img src={`https://www.lifeprint.com/asl101/fingerspelling/abc-signs/${letter.toLowerCase()}.gif`} alt={letter} className="h-10 w-10 object-contain" />
            <span className="text-[10px] text-muted-foreground">{letter}</span>
          </div>
        ))}
      </div>
    </div>
  );
}function AISignResponse({ word }: { word: string }) {
  const letters = word.toUpperCase().replace(/[^A-Z]/g, "").split("");
  if (letters.length === 0) return null;
  return (
    <div className="rounded-xl border border-border bg-card p-3 space-y-2">
      <p className="text-xs text-muted-foreground text-center">AI signing: <span className="text-foreground font-medium">{word}</span></p>
      <div className="flex flex-wrap gap-1 justify-center">
        {letters.map((letter, i) => (
          <div key={i} className="flex flex-col items-center">
            <img src={`https://www.lifeprint.com/asl101/fingerspelling/abc-signs/${letter.toLowerCase()}.gif`} alt={letter} className="h-10 w-10 object-contain" />
            <span className="text-[10px] text-muted-foreground">{letter}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
interface ASLSignInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export default function ASLSignInput({ onSend, disabled }: ASLSignInputProps) {
  const [cameraActive, setCameraActive] = useState(false);
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [cardTab, setCardTab] = useState("words");
  const [lastSent, setLastSent] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

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

  const sendCard = (label: string) => {
  if (!disabled) { setLastSent(label); onSend(`[ASL Sign] ${label}`); }
  };

  const sendSpelledWord = () => {
    if (selectedLetters.length > 0 && !disabled) {
      onSend(`[ASL Fingerspell] ${selectedLetters.join("")}`);
      setSelectedLetters([]);
    }
  };

  return (
    <div className="px-4 py-3 space-y-3">
      <div className="flex items-center gap-2">
        {!cameraActive ? (
          <Button onClick={startCamera} variant="outline" size="sm" className="gap-2 rounded-xl" disabled={disabled}>
            <Hand className="h-4 w-4" /> Open Camera to Sign
          </Button>
        ) : (
          <Button onClick={stopCamera} variant="destructive" size="sm" className="gap-2 rounded-xl">
            <X className="h-4 w-4" /> Close Camera
          </Button>
        )}
      </div>

      {cameraActive && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl overflow-hidden border border-border bg-card relative">
            <video ref={videoRef} autoPlay playsInline muted className="w-full aspect-video object-cover" />
            <div className="absolute bottom-2 left-2 bg-background/80 text-xs px-2 py-1 rounded-lg text-foreground">You — Sign Here</div>
          </div>
          <div className="rounded-xl border border-border bg-card flex flex-col items-center justify-center aspect-video">
            <Video className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-xs text-muted-foreground text-center px-3">AI signing back to you</p>
            <p className="text-[10px] text-muted-foreground/60 text-center px-3 mt-1">ASL video response coming soon ✨</p>
          </div>
        </div>
      )}

      <Tabs value={cardTab} onValueChange={setCardTab}>
        <TabsList className="bg-muted w-full">
          <TabsTrigger value="words" className="text-xs flex-1">Common Signs</TabsTrigger>
          <TabsTrigger value="feelings" className="text-xs flex-1">Feelings</TabsTrigger>
          <TabsTrigger value="alphabet" className="text-xs flex-1">Fingerspell</TabsTrigger>
        </TabsList>

        <TabsContent value="words" className="mt-2">
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 max-h-48 overflow-y-auto p-1">
            {ASL_COMMON_WORDS.map((card) => (
              <button key={card.id} onClick={() => sendCard(card.label)} disabled={disabled}
                className="flex flex-col items-center gap-0.5 p-2 rounded-xl border border-border bg-card hover:bg-primary/10 transition-all disabled:opacity-50">
                <span className="text-lg">{card.emoji}</span>
                <span className="text-[10px] text-foreground leading-tight text-center">{card.label}</span>
              </button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="feelings" className="mt-2">
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 max-h-48 overflow-y-auto p-1">
            {ASL_FEELINGS.map((card) => (
              <button key={card.id} onClick={() => sendCard(card.label)} disabled={disabled}
                className="flex flex-col items-center gap-0.5 p-2 rounded-xl border border-border bg-card hover:bg-primary/10 transition-all disabled:opacity-50">
                <span className="text-lg">{card.emoji}</span>
                <span className="text-[10px] text-foreground leading-tight text-center">{card.label}</span>
              </button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="alphabet" className="mt-2 space-y-2">
          {selectedLetters.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex-1 flex flex-wrap gap-1 p-2 rounded-xl border border-border bg-card min-h-[36px]">
                {selectedLetters.map((l, i) => (
                  <span key={i} className="text-sm font-bold text-primary">{l}</span>
                ))}
              </div>
              <Button onClick={() => setSelectedLetters([])} variant="ghost" size="sm" className="text-xs">Clear</Button>
              <Button onClick={sendSpelledWord} size="sm" className="text-xs rounded-xl" disabled={disabled}>Send</Button>
            </div>
          )}
          <div className="grid grid-cols-6 sm:grid-cols-9 gap-1.5 max-h-52 overflow-y-auto p-1">
            {ASL_ALPHABET.map((card) => (
              <button key={card.id} onClick={() => setSelectedLetters((prev) => [...prev, card.label])} disabled={disabled}
                className="flex flex-col items-center justify-center gap-0.5 p-1 rounded-lg border border-border bg-card hover:bg-primary/10 transition-all disabled:opacity-50">
                <img src={card.img} alt={`ASL ${card.label}`} className="h-10 w-10 object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                <span className="text-[10px] font-bold text-foreground">{card.label}</span>
              </button>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
