import { useState, useRef, useEffect } from "react";
import { Hand, Video, Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ASL Alphabet cards
const ASL_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => ({
  id: letter,
  label: letter,
  img: `https://www.lifeprint.com/asl101/fingerspelling/abc-signs/${letter}.gif`,
}));
// Common ASL word cards
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

// ASL Feeling cards
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
];

interface ASLSignInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export default function ASLSignInput({ onSend, disabled }: ASLSignInputProps) {
  const [cameraActive, setCameraActive] = useState(false);
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [cardTab, setCardTab] = useState("words");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Camera management
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
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
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const sendCard = (label: string) => {
    if (!disabled) onSend(`[ASL Sign] ${label}`);
  };

  const sendSpelledWord = () => {
    if (selectedLetters.length > 0 && !disabled) {
      onSend(`[ASL Fingerspell] ${selectedLetters.join("")}`);
      setSelectedLetters([]);
    }
  };

  const toggleLetter = (letter: string) => {
    setSelectedLetters((prev) => [...prev, letter]);
  };

  return (
    <div className="px-4 py-3 space-y-3">
      {/* Camera section */}
      <div className="flex items-center gap-2">
        {!cameraActive ? (
          <Button
            onClick={startCamera}
            variant="outline"
            size="sm"
            className="gap-2 rounded-xl"
            disabled={disabled}
            aria-label="Open camera to sign"
          >
            <Hand className="h-4 w-4" /> Open Camera to Sign
          </Button>
        ) : (
          <Button
            onClick={stopCamera}
            variant="destructive"
            size="sm"
            className="gap-2 rounded-xl"
            aria-label="Close camera"
          >
            <X className="h-4 w-4" /> Close Camera
          </Button>
        )}
      </div>

      {/* Camera feed + AI video side by side */}
      {cameraActive && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* User camera */}
          <div className="rounded-xl overflow-hidden border border-border bg-card relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full aspect-video object-cover"
              aria-label="Your camera — sign here"
            />
            <div className="absolute bottom-2 left-2 bg-background/80 text-xs px-2 py-1 rounded-lg text-foreground">
              You — Sign Here
            </div>
          </div>
          {/* AI ASL response video placeholder */}
          <div className="rounded-xl border border-border bg-card flex flex-col items-center justify-center aspect-video">
            <Video className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-xs text-muted-foreground text-center px-3">
              AI signing back to you
            </p>
            <p className="text-[10px] text-muted-foreground/60 text-center px-3 mt-1">
              ASL video response coming soon ✨
            </p>
          </div>
        </div>
      )}

      {/* Cards section */}
      <Tabs value={cardTab} onValueChange={setCardTab}>
        <TabsList className="bg-muted w-full">
          <TabsTrigger value="words" className="text-xs flex-1">Common Signs</TabsTrigger>
          <TabsTrigger value="feelings" className="text-xs flex-1">Feelings</TabsTrigger>
          <TabsTrigger value="alphabet" className="text-xs flex-1">Fingerspell</TabsTrigger>
        </TabsList>

        {/* Common words */}
        <TabsContent value="words" className="mt-2">
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 max-h-48 overflow-y-auto p-1">
            {ASL_COMMON_WORDS.map((card) => (
              <button
                key={card.id}
                onClick={() => sendCard(card.label)}
                disabled={disabled}
                className="flex flex-col items-center gap-0.5 p-2 rounded-xl border border-border bg-card hover:bg-primary/10 hover:border-primary/30 transition-all disabled:opacity-50"
                aria-label={`Sign: ${card.label}`}
              >
                <span className="text-lg">{card.emoji}</span>
                <span className="text-[10px] text-foreground leading-tight text-center">{card.label}</span>
              </button>
            ))}
          </div>
        </TabsContent>

        {/* Feelings */}
        <TabsContent value="feelings" className="mt-2">
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 max-h-48 overflow-y-auto p-1">
            {ASL_FEELINGS.map((card) => (
              <button
                key={card.id}
                onClick={() => sendCard(card.label)}
                disabled={disabled}
                className="flex flex-col items-center gap-0.5 p-2 rounded-xl border border-border bg-card hover:bg-primary/10 hover:border-primary/30 transition-all disabled:opacity-50"
                aria-label={`Sign: ${card.label}`}
              >
                <span className="text-lg">{card.emoji}</span>
                <span className="text-[10px] text-foreground leading-tight text-center">{card.label}</span>
              </button>
            ))}
          </div>
        </TabsContent>

        {/* Fingerspelling alphabet */}
        <TabsContent value="alphabet" className="mt-2 space-y-2">
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
                aria-label="Clear letters"
              >
                Clear
              </Button>
              <Button
                onClick={sendSpelledWord}
                size="sm"
                className="text-xs rounded-xl"
                disabled={disabled}
                aria-label="Send spelled word"
              >
                Send
              </Button>
            </div>
          )}
          <div className="grid grid-cols-7 sm:grid-cols-9 gap-1 max-h-40 overflow-y-auto p-1">
            {ASL_ALPHABET.map((card) => (
              <button
                key={card.id}
                onClick={() => toggleLetter(card.label)}
                disabled={disabled}
                className="flex items-center justify-center h-10 w-full rounded-lg border border-border bg-card hover:bg-primary/10 hover:border-primary/30 transition-all font-bold text-sm text-foreground disabled:opacity-50"
                aria-label={`Letter ${card.label}`}
              >
                {card.label}
              </button>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
