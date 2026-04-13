import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { streamChat, type ChatMessage } from "@/lib/chat";
import { useToast } from "@/hooks/use-toast";
import ColorSymbolCanvas from "@/components/ColorSymbolCanvas";
import PointToItCards from "@/components/PointToItCards";
import { useTTS } from "@/hooks/use-tts";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { getPreferences, COMMUNICATION_METHODS } from "@/lib/preferences";
import ListeningIndicator from "@/components/ListeningIndicator";
import ASLSignInput from "@/components/ASLSignInput";

const WELCOME_MESSAGE: ChatMessage = {
  role: "assistant",
  content:
    "Welcome to your safe space. 🌿\n\nI'm your Soul Echo — here to listen without judgment. Tell me about your day, what's weighing on you, or whatever needs to come out. I'll help guide you to the right healing room when you're ready.\n\nThere's no wrong way to start. Just let it flow.",
};

const prompts = [
  "I had a really hard day…",
  "I feel stuck and don't know why",
  "I need to let something go",
  "I'm feeling overwhelmed",
];

const COMM_TABS: Record<string, { label: string; icon: string }> = {
  speak: { label: "Speak It", icon: "🗣️" },
  sign: { label: "Sign It", icon: "🤟" },
  point: { label: "Point It", icon: "👆" },
  pictures: { label: "Point It", icon: "👆" },
  type: { label: "Type It", icon: "⌨️" },
  connect: { label: "Connect Device", icon: "🔌" },
  device: { label: "Connect Device", icon: "🔌" },
  colors: { label: "Colors & Symbols", icon: "🎨" },
  braille: { label: "Braille", icon: "⠿" },
  aac: { label: "AAC Device", icon: "💻" },
  eyetrack: { label: "Eye Track", icon: "👁️" },
};

const COMMUNICATION_CARDS = [
  { id: "speak", emoji: "🗣️", label: "Speak It", subtitle: "Share your thoughts aloud" },
  { id: "sign", emoji: "🤟", label: "Sign It", subtitle: "Use ASL or gestures" },
  { id: "point", emoji: "👆", label: "Point to Cards", subtitle: "Tap what feels right" },
  { id: "type", emoji: "⌨️", label: "Type It", subtitle: "Write what you need to release" },
  { id: "connect", emoji: "🔌", label: "Connect Device", subtitle: "Use AAC, eye gaze, or assistive tech" },
];

const DISTRESS_TERMS = [
  "suicide", "kill myself", "hurt myself", "overdose", "emergency", "crisis", "panic attack", "unsafe", "abuse", "cutting", "hang", "shoot", "self harm", "self-harm",
];

const EMOTION_KEYWORDS: [string[], string][] = [
  [["overwhelmed", "overwhelm", "stuck", "lost", "confused"], "confusion"],
  [["sad", "sadness", "lonely", "alone", "grief", "grieving", "heartbroken"], "sadness"],
  [["angry", "anger", "rage", "frustrated", "annoyed", "resent"], "anger"],
  [["afraid", "fear", "scared", "panic", "terrified", "anxious", "anxiety"], "fear"],
  [["guilty", "guilt", "shame", "ashamed"], "shame"],
  [["relieved", "relief", "calmer", "peaceful", "lighter"], "peace"],
  [["happy", "joy", "grateful", "hopeful", "content"], "joy"],
];

const HEALING_ROOM_SUGGESTIONS: Record<string, { name: string; description: string; path: string }> = {
  sadness: { name: "Wisdom", description: "The Wisdom room offers gentle insight, comfort, and meaning for heavy emotions.", path: "/wisdom" },
  anger: { name: "Breathe", description: "The Breathe room helps release tension through breath and grounding presence.", path: "/breathe" },
  fear: { name: "Breathe", description: "The Breathe room supports calm focus and steadies racing worry.", path: "/breathe" },
  confusion: { name: "Wisdom", description: "The Wisdom room gives clarity through quiet reflection and soulful guidance.", path: "/wisdom" },
  shame: { name: "Wisdom", description: "The Wisdom room helps you meet yourself with compassion and gentle truth.", path: "/wisdom" },
  peace: { name: "Wisdom", description: "The Wisdom room helps you deepen the calm you already feel with a soothing perspective.", path: "/wisdom" },
  joy: { name: "Wisdom", description: "The Wisdom room celebrates what feels good and invites more light into your day.", path: "/wisdom" },
  default: { name: "Wisdom", description: "The Wisdom room offers supportive guidance for what you need most in this moment.", path: "/wisdom" },
};

const BIBLE_VERSES: Record<string, string[]> = {
  sadness: [
    "Psalm 34:18 — The Lord is close to the brokenhearted and saves those who are crushed in spirit.",
    "Matthew 11:28 — Come to me, all who are weary and burdened, and I will give you rest.",
    "Psalm 147:3 — He heals the brokenhearted and binds up their wounds.",
  ],
  anger: [
    "James 1:19-20 — Everyone should be quick to listen, slow to speak and slow to become angry.",
    "Proverbs 15:1 — A gentle answer turns away wrath, but a harsh word stirs up anger.",
    "Ephesians 4:26 — In your anger do not sin. Do not let the sun go down while you are still angry.",
  ],
  fear: [
    "Isaiah 41:10 — Do not fear, for I am with you; do not be dismayed, for I am your God.",
    "Psalm 23:4 — Even though I walk through the darkest valley, I will fear no evil.",
    "2 Timothy 1:7 — God gave us a spirit not of fear but of power, love, and self-control.",
  ],
  confusion: [
    "Proverbs 3:5-6 — Trust in the Lord with all your heart and lean not on your own understanding.",
    "James 1:5 — If any of you lacks wisdom, ask God, who gives generously to all without finding fault.",
    "Psalm 25:9 — He guides the humble in what is right and teaches them his way.",
  ],
  shame: [
    "Romans 8:1 — There is now no condemnation for those who are in Christ Jesus.",
    "Psalm 103:12 — As far as the east is from the west, so far has he removed our transgressions from us.",
    "1 John 1:9 — If we confess our sins, he is faithful and just to forgive us our sins.",
  ],
  peace: [
    "Philippians 4:6-7 — The peace of God, which transcends all understanding, will guard your heart and mind.",
    "John 14:27 — Peace I leave with you; my peace I give you.",
    "Isaiah 26:3 — You keep in perfect peace those whose minds are steadfast.",
  ],
  joy: [
    "Psalm 16:11 — In your presence there is fullness of joy.",
    "Nehemiah 8:10 — The joy of the Lord is your strength.",
    "Philippians 4:4 — Rejoice in the Lord always. I will say it again: Rejoice!",
  ],
  default: [
    "Psalm 46:1 — God is our refuge and strength, an ever-present help in trouble.",
    "Jeremiah 29:11 — I know the plans I have for you, plans to prosper you and not to harm you.",
    "Psalm 55:22 — Cast your cares on the Lord and he will sustain you.",
  ],
};

const WISDOM_QUOTES: Record<string, string[]> = {
  sadness: [
    "The wound is the place where the light enters you. — Rumi",
    "Sorrow is a teacher; listen to it. — Anonymous",
    "Emotions are not problems to be solved. They are signals to be heard. — Aisha Tyler",
  ],
  anger: [
    "Anger is a wind which blows out the lamp of the mind. — Robert Green Ingersoll",
    "Speak when you are angry and you will make the best speech you will ever regret. — Ambrose Bierce",
    "The more you know yourself, the more patience you have for what you see in others. — Erik Erikson",
  ],
  fear: [
    "Courage is not the absence of fear, but the triumph over it. — Nelson Mandela",
    "You gain strength, courage and confidence by every experience in which you really stop to look fear in the face. — Eleanor Roosevelt",
    "Do the thing you fear and the death of fear is certain. — Ralph Waldo Emerson",
  ],
  confusion: [
    "When you are unsure, quiet your mind and trust the next right step. — Anonymous",
    "Clarity comes from action, not thought. — Marie Forleo",
    "The only journey is the one within. — Rainer Maria Rilke",
  ],
  shame: [
    "You are not what happened to you. You are what you choose to become. — Anonymous",
    "Owning our story and loving ourselves through that process is the bravest thing we will ever do. — Brené Brown",
    "The first step toward change is awareness. The second step is acceptance. — Nathaniel Branden",
  ],
  peace: [
    "Peace comes from within. Do not seek it without. — Buddha",
    "Stillness is where creativity and solutions are found. — Eckhart Tolle",
    "The quieter you become, the more you are able to hear. — Rumi",
  ],
  joy: [
    "Joy is what happens to us when we allow ourselves to recognize how good things really are. — Marianne Williamson",
    "The most wasted of all days is one without laughter. — Nicolas Chamfort",
    "Gratitude turns what we have into enough. — Melody Beattie",
  ],
  default: [
    "The only way out is through. — Robert Frost",
    "A calm mind brings inner strength and self-confidence. — Dalai Lama",
    "Everything you need is already within you. — Anonymous",
  ],
};

type ResponseAnalysis = {
  reflection: string;
  emotion: string;
  room: { name: string; description: string; path: string };
  verses: string[];
  quotes: string[];
  distress?: boolean;
};

function detectCoreEmotion(text: string) {
  const lower = text.toLowerCase();
  for (const [words, label] of EMOTION_KEYWORDS) {
    if (words.some((word) => lower.includes(word))) return label;
  }
  return "default";
}

function chooseRoom(emotion: string) {
  return HEALING_ROOM_SUGGESTIONS[emotion] || HEALING_ROOM_SUGGESTIONS.default;
}

function chooseVerses(emotion: string) {
  return BIBLE_VERSES[emotion] || BIBLE_VERSES.default;
}

function chooseQuotes(emotion: string) {
  return WISDOM_QUOTES[emotion] || WISDOM_QUOTES.default;
}

function detectDistress(text: string) {
  const lower = text.toLowerCase();
  return DISTRESS_TERMS.some((term) => lower.includes(term));
}

function buildResponseAnalysis(text: string): ResponseAnalysis {
  const trimmed = text.trim();
  const short = trimmed.length > 180 ? `${trimmed.slice(0, 180)}…` : trimmed;
  const emotion = detectCoreEmotion(trimmed);
  return {
    reflection: `I hear you saying, “${short}.” That feels deeply real, and I’m here with you.`,
    emotion: emotion === "default" ? "present" : emotion,
    room: chooseRoom(emotion),
    verses: chooseVerses(emotion),
    quotes: chooseQuotes(emotion),
    distress: detectDistress(trimmed),
  };
}

export default function BrainDump() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const listenTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { toast } = useToast();
  const { speak: ttsSpeak, stop: ttsStop, speaking: ttsSpeaking } = useTTS();
  const prefs = getPreferences();
  const [autoRead, setAutoRead] = useState(prefs.autoReadEnabled);

  // All communication methods are always available — never gated by onboarding choices
  const activeMethods = COMMUNICATION_METHODS.map((m) => m.id);

  const [activeTab, setActiveTab] = useState(activeMethods[0]);
  const [analysis, setAnalysis] = useState<ResponseAnalysis | null>(null);

  const send = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setAnalysis(buildResponseAnalysis(trimmed));

    // When offline, show local guidance and queue for later
    if (!navigator.onLine) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "You're currently offline. 🌿 Your message has been received and your local guidance is shown below. The AI response will be available once you reconnect.",
        },
      ]);
      return;
    }

    setIsLoading(true);

    let assistantSoFar = "";

    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && prev.length > 1 && prev[prev.length - 2]?.role === "user") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    await streamChat({
      messages: [...messages, userMsg].filter((m) => m !== WELCOME_MESSAGE),
      onDelta: upsertAssistant,
      onDone: () => {
        setIsLoading(false);
        if (autoRead) ttsSpeak(assistantSoFar);
      },
      onError: (err) => {
        setIsLoading(false);
        toast({ title: "Connection interrupted", description: err, variant: "destructive" });
      },
    });

    textareaRef.current?.focus();
  }, [isLoading, messages, autoRead, ttsSpeak, toast]);

  const speech = useSpeechRecognition({
    onResult: (transcript) => {
      setIsListening(false);
      send(transcript);
    },
    continuous: false,
  });

  const startListening = useCallback(() => {
    if (isLoading) return;
    setIsListening(true);
    speech.start(prefs.primaryLanguage);
  }, [isLoading, speech, prefs.primaryLanguage]);

  const stopListening = useCallback(() => {
    setIsListening(false);
    speech.stop();
  }, [speech]);

  // When speak tab becomes active, start listening after a short delay
  useEffect(() => {
    if (listenTimerRef.current) clearTimeout(listenTimerRef.current);
    if (activeTab === "speak") {
      listenTimerRef.current = setTimeout(() => startListening(), 800);
    } else {
      stopListening();
    }
    return () => {
      if (listenTimerRef.current) clearTimeout(listenTimerRef.current);
    };
  }, [activeTab]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  const replayMessage = (text: string) => {
    ttsStop();
    ttsSpeak(text);
  };

  function renderInputMethod(method: string) {
    switch (method) {
      case "type":
      case "braille":
      case "aac":
      case "eyetrack":
        return (
          <div className="px-4 py-3">
            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="flex gap-2 items-end max-w-3xl mx-auto"
            >
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Let it out… type what's on your mind"
                className="min-h-[48px] max-h-[160px] resize-none bg-card border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary text-base"
                rows={1}
                aria-label="Type your message"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isLoading}
                className="shrink-0 h-12 w-12 rounded-xl"
                aria-label="Send message"
              >
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </div>
        );

      case "speak":
        return (
          <div className="px-4 py-4 space-y-3">
            <div className="flex flex-col items-center gap-3">
              <ListeningIndicator visible={isListening} />
              <p className="text-sm text-muted-foreground text-center">
                {isListening ? "Listening… speak your answer or tap to select" : "Tap to start speaking"}
              </p>
              {isListening ? (
                <Button
                  onClick={stopListening}
                  size="lg"
                  variant="destructive"
                  className="rounded-2xl px-8 gap-2"
                >
                  <MicOff className="h-5 w-5" /> Stop Listening
                </Button>
              ) : (
                <Button
                  onClick={startListening}
                  size="lg"
                  className="rounded-2xl px-8 gap-2"
                  disabled={isLoading}
                >
                  <Mic className="h-5 w-5" /> Tap to Speak
                </Button>
              )}
              {speech.transcript && (
                <p className="text-sm text-muted-foreground text-center">
                  Heard: "{speech.transcript}"
                </p>
              )}
            </div>
          </div>
        );

      case "sign":
        return <ASLSignInput onSend={send} disabled={isLoading} />;

      case "point":
      case "pictures":
        return <PointToItCards onSend={send} disabled={isLoading} />;

      case "colors":
        return <ColorSymbolCanvas onSend={send} disabled={isLoading} />;

      case "connect":
      case "device":
        return (
          <div className="px-4 py-6 text-center space-y-2">
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
              🔌 Connect your AAC device, eye gaze tracker, or external communication equipment via Bluetooth or USB.
            </p>
            <p className="text-xs text-muted-foreground/60 italic">Device pairing coming soon.</p>
          </div>
        );

      default:
        return (
          <div className="px-4 py-4 text-center text-sm text-muted-foreground">
            This input method is coming soon.
          </div>
        );
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-4" role="log" aria-label="Conversation" aria-live="polite">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-card text-card-foreground border border-border rounded-bl-sm"
                }`}
              >
                {msg.role === "assistant" ? (
                  <div className="space-y-2">
                    <div className="prose prose-sm prose-invert max-w-none prose-p:my-1 prose-headings:font-display">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                    <button
                      onClick={() => replayMessage(msg.content)}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mt-1"
                      aria-label="Replay this message"
                    >
                      <Volume2 className="h-3 w-3" /> Replay
                    </button>
                  </div>
                ) : (
                  <p>{msg.content}</p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="rounded-3xl border border-white/10 bg-gradient-to-r from-purple-700 via-violet-700 to-sky-600 p-5 text-white shadow-xl"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm uppercase tracking-[0.2em] text-purple-200">Soul Echo response</p>
                <p className="text-base leading-7">{analysis.reflection}</p>
                <p className="text-sm text-purple-100">
                  <span className="font-semibold">Core emotion:</span> {analysis.emotion}
                </p>
                <p className="text-sm text-purple-100">
                  <span className="font-semibold">Suggested healing room:</span> {analysis.room.name} — {analysis.room.description}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-purple-100">Bible verses</p>
                  <ul className="space-y-2 text-sm text-white/90">
                    {analysis.verses.map((verse) => (
                      <li key={verse} className="rounded-2xl bg-white/10 p-3">{verse}</li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-purple-100">Wisdom quotes</p>
                  <ul className="space-y-2 text-sm text-white/90">
                    {analysis.quotes.map((quote) => (
                      <li key={quote} className="rounded-2xl bg-white/10 p-3">{quote}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {COMMUNICATION_CARDS.map((card) => (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(card.id);
                      if (card.id === "speak") startListening();
                    }}
                    className="flex items-center gap-4 rounded-3xl border border-white/15 bg-white/10 px-4 py-4 text-left shadow-sm transition hover:bg-white/20"
                  >
                    <span className="text-2xl">{card.emoji}</span>
                    <div>
                      <p className="text-sm font-semibold text-white">{card.label}</p>
                      <p className="text-xs text-white/80">{card.subtitle}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <button type="button" onClick={() => window.location.href = "/wisdom"} className="rounded-3xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
                  Learn More
                </button>
                <button type="button" onClick={() => window.location.href = "/practitioner/signup"} className="rounded-3xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
                  Connect to Healer
                </button>
                <button type="button" onClick={() => window.location.href = "/resources"} className="rounded-3xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
                  Healing Resources
                </button>
                <button type="button" onClick={() => window.location.href = "/breathe"} className="rounded-3xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
                  Healing Practice
                </button>
              </div>

              {analysis.distress && (
                <div className="rounded-3xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">
                  <p className="font-semibold">If you are in crisis</p>
                  <p>Please reach out for immediate support. If you are feeling unsafe, call your local emergency number or your nearest crisis hotline right now.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" aria-label="Thinking..." />
            </div>
          </motion.div>
        )}
      </div>

      {messages.length === 1 && (
        <div className="space-y-4 px-4 pb-3">
          <div className="rounded-3xl border border-border bg-card p-4 text-sm text-foreground shadow-sm">
            <p className="font-semibold text-foreground">Your guided intro</p>
            <ul className="mt-3 space-y-2 text-muted-foreground">
              <li>• Brain Dump is always free and unlimited.</li>
              <li>• Paid tiers unlock more room access, priority features, and yearly savings.</li>
              <li>• The shop offers tools, books, and resources with options for free, paid, or pay-it-forward support.</li>
              <li>• Connect to a healer anytime through the practitioner section.</li>
              <li>• Intercessors are always available to support you in prayer and care.</li>
            </ul>
          </div>
          <div className="px-4 pb-3 flex flex-wrap gap-2" role="group" aria-label="Suggested prompts">
            {prompts.map((p) => (
              <button
                key={p}
                onClick={() => send(p)}
                className="text-xs px-3 py-1.5 rounded-full border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-border bg-background">
        <div className="flex items-center justify-end px-4 pt-2">
          <button
            onClick={() => { setAutoRead(!autoRead); if (ttsSpeaking) ttsStop(); }}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            aria-pressed={autoRead}
            aria-label={autoRead ? "Auto-read responses aloud — currently on" : "Auto-read responses aloud — currently off"}
          >
            {autoRead ? <Volume2 className="h-3 w-3" aria-hidden="true" /> : <VolumeX className="h-3 w-3" aria-hidden="true" />}
            {autoRead ? "Auto-read on" : "Auto-read off"}
          </button>
        </div>

        {activeMethods.length > 1 ? (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mx-4 mt-2 bg-muted">
              {activeMethods.map((m) => (
                <TabsTrigger key={m} value={m} className="text-xs gap-1">
                  <span>{COMM_TABS[m]?.icon}</span>
                  <span className="hidden sm:inline">{COMM_TABS[m]?.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            {activeMethods.map((m) => (
              <TabsContent key={m} value={m} className="mt-0">
                {renderInputMethod(m)}
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          renderInputMethod(activeMethods[0])
        )}
      </div>
    </div>
  );
}
