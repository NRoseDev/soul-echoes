import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, Mic, MicOff, Volume2, VolumeX, ArrowRight } from "lucide-react";
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
import { useNavigate } from "react-router-dom";

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
  "suicide", "kill myself", "hurt myself", "overdose", "emergency", "crisis",
  "panic attack", "unsafe", "abuse", "cutting", "hang", "shoot",
  "self harm", "self-harm", "scared of myself", "want to die", "end my life",
];

const EMOTION_KEYWORDS: [string[], string][] = [
  [["pain", "hurting", "hurt", "aching", "suffering", "agony", "sore", "in pain", "physical pain", "emotional pain", "body pain"], "pain"],
  [["overwhelmed", "overwhelm", "stuck", "lost", "confused"], "confusion"],
  [["lonely", "loneliness", "alone", "isolated", "no one", "nobody", "abandoned", "left out", "unseen", "invisible"], "loneliness"],
  [["sad", "sadness", "grief", "grieving", "heartbroken"], "sadness"],
  [["angry", "anger", "rage", "frustrated", "annoyed", "resent", "betrayed", "jealous"], "anger"],
  [["afraid", "fear", "scared", "panic", "terrified", "anxious", "anxiety", "fearful", "frightened"], "fear"],
  [["guilty", "guilt", "shame", "ashamed"], "shame"],
  [["relieved", "relief", "calmer", "peaceful", "lighter"], "peace"],
  [["happy", "joy", "grateful", "hopeful", "content"], "joy"],
];

/* ─── Specific exercise suggestion per emotion ─── */

const EXERCISE_SUGGESTION: Record<string, { text: string; path: string; buttonLabel: string }> = {
  pain: {
    text: "Box Breathing for 4 minutes in the Breathe room may help soften this pain and release the tension your body is holding.",
    path: "/breathe/breathwork",
    buttonLabel: "Start Box Breathing",
  },
  sadness: {
    text: "Body Scan Meditation in the Breathe room can locate where sadness sits in your body and give it permission to move.",
    path: "/breathe/meditation",
    buttonLabel: "Start Body Scan",
  },
  anger: {
    text: "Box Breathing for 4 minutes in the Breathe room can interrupt the tension anger builds in your body and give your nervous system relief.",
    path: "/breathe/breathwork",
    buttonLabel: "Start Box Breathing",
  },
  fear: {
    text: "4-7-8 Breathing in the Breathe room is designed to activate your body's safety response and calm a racing, anxious heart.",
    path: "/breathe/breathwork",
    buttonLabel: "Start 4-7-8 Breathing",
  },
  confusion: {
    text: "Breath Focus Meditation in the Breathe room can quiet the mental noise and let the next right answer surface from within.",
    path: "/breathe/meditation",
    buttonLabel: "Start Breath Focus",
  },
  shame: {
    text: "Heart Coherence Breathing in the Breathe room can soften the self-criticism and bring warmth and gentleness back into your chest.",
    path: "/breathe/breathwork",
    buttonLabel: "Start Heart Coherence",
  },
  peace: {
    text: "Grounding Breath in the Breathe room can deepen and anchor the calm you already feel into your body and nervous system.",
    path: "/breathe/breathwork",
    buttonLabel: "Start Grounding Breath",
  },
  joy: {
    text: "Heart Coherence Breathing in the Breathe room can anchor this joy in your heart and help your body remember this feeling.",
    path: "/breathe/breathwork",
    buttonLabel: "Start Heart Coherence",
  },
  default: {
    text: "Box Breathing for 4 minutes in the Breathe room can help you ground into your body and find a moment of stillness.",
    path: "/breathe/breathwork",
    buttonLabel: "Start Box Breathing",
  },
};

/* ─── Healing pathways per emotion ─── */

interface Pathway {
  room: string;
  emoji: string;
  path: string;
  exercise: string;
  why: string;
}

const HEALING_PATHWAYS: Record<string, Pathway[]> = {
  pain: [
    { room: "Breathe", emoji: "🌬️", path: "/breathe/breathwork", exercise: "Body Scan or Box Breathing", why: "Physical tension in the body often stores pain. Breathwork can soften and release it." },
    { room: "Unspoken", emoji: "🤫", path: "/unspoken", exercise: "Healing Conversation", why: "Sometimes pain lives in what we haven't been able to say. A healing conversation can release it." },
    { room: "Shadow Work", emoji: "🌑", path: "/shadow-work", exercise: "Emotional Root Exploration", why: "Exploring the emotional root or trauma bond connected to your pain can reveal what truly needs healing." },
    { room: "Spiritual Tools", emoji: "✨", path: "/spiritual-tools", exercise: "Cord Cutting or Energy Clearing", why: "If this pain feels like it belongs to someone else, cord cutting or energy clearing may help release it." },
    { room: "Portal", emoji: "🌀", path: "/shop", exercise: "Connect to a Healer", why: "For deeper support, connect with a verified healer who specializes in what you are carrying." },
  ],
  sadness: [
    { room: "Wisdom", emoji: "📖", path: "/wisdom", exercise: "Daily Insight", why: "Wisdom and gentle truth can hold you in sadness without rushing you through it." },
    { room: "Journal", emoji: "📓", path: "/journal", exercise: "Free Write", why: "Writing to yourself in grief is one of the most honest and healing things you can do." },
    { room: "Shadow Work", emoji: "🌑", path: "/shadow-work", exercise: "Grief Exploration", why: "Sadness often carries older grief beneath it. Shadow work brings it into the light gently." },
    { room: "Breathe", emoji: "🌬️", path: "/breathe/meditation", exercise: "Body Scan Meditation", why: "A body scan can locate where sadness lives in your body and give it permission to move." },
    { room: "Spiritual Tools", emoji: "✨", path: "/spiritual-tools", exercise: "Aura Cleansing", why: "Emotional heaviness can linger in your energy field. Cleansing may help lift some of the weight." },
  ],
  anger: [
    { room: "Breathe", emoji: "🌬️", path: "/breathe/breathwork", exercise: "Box Breathing", why: "Anger lives in the body as tension. Four minutes of box breathing can interrupt the fire." },
    { room: "Shadow Work", emoji: "🌑", path: "/shadow-work", exercise: "Anger Root Exploration", why: "Anger often protects a wound. Shadow work can help you find what is underneath it." },
    { room: "Journal", emoji: "📓", path: "/journal", exercise: "Uncensored Write", why: "Writing your rage uncensored — then closing the page — safely discharges what needs to move." },
    { room: "Spiritual Tools", emoji: "✨", path: "/spiritual-tools", exercise: "Cord Cutting", why: "If your anger is tied to a person, cord cutting can help you release without needing their apology." },
    { room: "Unspoken", emoji: "🤫", path: "/unspoken", exercise: "Healing Conversation", why: "Sometimes anger just needs to be witnessed without judgment. The Unspoken chamber holds that space." },
  ],
  fear: [
    { room: "Breathe", emoji: "🌬️", path: "/breathe/breathwork", exercise: "Vagus Nerve Activation", why: "Vagus nerve activation through breath signals safety to your body and calms the fight-or-flight response." },
    { room: "Shadow Work", emoji: "🌑", path: "/shadow-work", exercise: "Explore the Root", why: "Most fear has a root. Shadow work can help you trace it back and release its grip." },
    { room: "Unspoken", emoji: "🤫", path: "/unspoken", exercise: "Give Fear a Voice", why: "Fear loses power when it is named and witnessed. Speak what scares you in a safe space." },
    { room: "Spiritual Tools", emoji: "✨", path: "/spiritual-tools", exercise: "Protection Prayer", why: "A protection prayer wraps you in spiritual safety and reminds you that you are not alone." },
    { room: "Portal", emoji: "🌀", path: "/shop", exercise: "Trauma-Informed Healer", why: "If fear is persistent or rooted in trauma, a trauma-informed healer can walk through it with you safely." },
  ],
  loneliness: [
    { room: "Brain Dump", emoji: "💭", path: "/brain-dump", exercise: "Speak What Feels Unseen", why: "Sometimes the first step out of loneliness is letting the unseen parts of you be heard." },
    { room: "Unspoken", emoji: "🤫", path: "/unspoken", exercise: "Healing Conversation", why: "A healing conversation can fill the silence with understanding and reconnect you to feeling known." },
    { room: "Journal", emoji: "📓", path: "/journal", exercise: "Write with Self-Love", why: "Writing to yourself with the tenderness of a dear friend reminds you that you are never truly alone with you." },
    { room: "Spiritual Tools", emoji: "✨", path: "/spiritual-tools", exercise: "Prayer & Angels", why: "Prayer and connection to angels open you to the unseen presence that has always surrounded you." },
    { room: "Portal", emoji: "🌀", path: "/shop", exercise: "Intercessor Connection", why: "An intercessor can hold space and pray with you, offering the human and spiritual connection your soul is seeking." },
  ],
  confusion: [
    { room: "Wisdom", emoji: "📖", path: "/wisdom", exercise: "Guided Reflection", why: "Wisdom offers clarity when your mind cannot find the thread on its own." },
    { room: "Journal", emoji: "📓", path: "/journal", exercise: "Clarity Write", why: "Writing without direction often reveals the direction. Let your hand lead." },
    { room: "Breathe", emoji: "🌬️", path: "/breathe/meditation", exercise: "Breath Focus Meditation", why: "Slowing your breath can quiet the mental noise and let the next right step surface." },
    { room: "Shadow Work", emoji: "🌑", path: "/shadow-work", exercise: "Inner Conflict Exploration", why: "Confusion is often two parts of you wanting different things. Shadow work can mediate that." },
    { room: "Spiritual Tools", emoji: "✨", path: "/spiritual-tools", exercise: "Chakra Alignment", why: "Energetic confusion may respond to chakra work, especially the third eye and crown chakras." },
  ],
  shame: [
    { room: "Journal", emoji: "📓", path: "/journal", exercise: "Compassionate Letter", why: "Writing to yourself with the compassion you would show a friend is one of the fastest paths through shame." },
    { room: "Shadow Work", emoji: "🌑", path: "/shadow-work", exercise: "Inner Critic Work", why: "Shame thrives in the dark. Shadow work brings your inner critic into the light where it loses power." },
    { room: "Spiritual Tools", emoji: "✨", path: "/spiritual-tools", exercise: "Aura and Cord Clearing", why: "Shame often comes from others. Energy clearing separates what is yours from what was placed on you." },
    { room: "Unspoken", emoji: "🤫", path: "/unspoken", exercise: "Witnessed Healing", why: "Being witnessed without judgment is one of the most powerful antidotes to shame." },
    { room: "Wisdom", emoji: "📖", path: "/wisdom", exercise: "Gentle Truth", why: "The Wisdom room can remind you of who you truly are beyond what shame says about you." },
  ],
  peace: [
    { room: "Breathe", emoji: "🌬️", path: "/breathe/breathwork", exercise: "Grounding Breath", why: "Grounding breath can deepen and anchor the calm you already feel into your nervous system." },
    { room: "Journal", emoji: "📓", path: "/journal", exercise: "Gratitude Write", why: "Writing what you are grateful for in this moment can amplify and extend the peace." },
    { room: "Wisdom", emoji: "📖", path: "/wisdom", exercise: "Reflective Insight", why: "The Wisdom room can add meaning and depth to what you are already experiencing." },
    { room: "Spiritual Tools", emoji: "✨", path: "/spiritual-tools", exercise: "Sound Healing", why: "Sound healing can help you integrate this peace at a cellular and energetic level." },
    { room: "Shadow Work", emoji: "🌑", path: "/shadow-work", exercise: "Integration Work", why: "Peace is a good time to gently revisit what you have been carrying — your nervous system is resourced." },
  ],
  joy: [
    { room: "Journal", emoji: "📓", path: "/journal", exercise: "Joy Capture", why: "Writing joy down is how you keep it. It becomes something you can return to on harder days." },
    { room: "Breathe", emoji: "🌬️", path: "/breathe/breathwork", exercise: "Heart Coherence", why: "Heart coherence breathing anchors joy in your heart and nervous system so it lasts longer." },
    { room: "Wisdom", emoji: "📖", path: "/wisdom", exercise: "Celebration Reflection", why: "The Wisdom room celebrates what feels good and invites even more light into your day." },
    { room: "Spiritual Tools", emoji: "✨", path: "/spiritual-tools", exercise: "Chakra Activation", why: "Activating your upper chakras during joy amplifies your spiritual connection and alignment." },
    { room: "Portal", emoji: "🌀", path: "/shop", exercise: "Share the Gift", why: "Joy multiplies when shared. The Portal connects you to others who are on this healing path." },
  ],
  default: [
    { room: "Breathe", emoji: "🌬️", path: "/breathe/breathwork", exercise: "Box Breathing", why: "When you are not sure where to start, breathwork gives your nervous system a safe place to land." },
    { room: "Wisdom", emoji: "📖", path: "/wisdom", exercise: "Guided Reflection", why: "The Wisdom room meets you wherever you are with insight and gentle truth." },
    { room: "Journal", emoji: "📓", path: "/journal", exercise: "Free Write", why: "Writing without direction is how the direction often finds you." },
    { room: "Shadow Work", emoji: "🌑", path: "/shadow-work", exercise: "Inner Exploration", why: "Whatever you are feeling, Shadow Work can help you look at it without turning away." },
    { room: "Portal", emoji: "🌀", path: "/shop", exercise: "Connect to a Healer", why: "A verified healer can walk with you through whatever is present right now." },
  ],
};

/* ─── Bible verses — matched to specific feeling ─── */

const BIBLE_VERSES: Record<string, string[]> = {
  pain: [
    "Revelation 21:4 — He will wipe every tear from their eyes. There will be no more death, mourning, crying, or pain.",
    "2 Corinthians 12:9 — My grace is sufficient for you, for my power is made perfect in weakness.",
    "Psalm 22:24 — He has not despised the suffering of the afflicted one; he has not hidden his face but has listened to his cry.",
  ],
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
    "Isaiah 41:10 — Do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you.",
    "2 Timothy 1:7 — God gave us a spirit not of fear but of power, love, and self-control.",
    "Psalm 23:4 — Even though I walk through the darkest valley, I will fear no evil, for you are with me.",
  ],
  loneliness: [
    "Psalm 68:6 — God sets the lonely in families, he leads out the prisoners with singing.",
    "Hebrews 13:5 — Never will I leave you; never will I forsake you.",
    "Isaiah 43:2 — When you pass through the waters, I will be with you; and when you pass through the rivers, they will not sweep over you.",
  ],
  confusion: [
    "Proverbs 3:5-6 — Trust in the Lord with all your heart and lean not on your own understanding.",
    "James 1:5 — If any of you lacks wisdom, ask God, who gives generously to all without finding fault.",
    "Psalm 25:9 — He guides the humble in what is right and teaches them his way.",
  ],
  shame: [
    "Romans 8:1 — There is now no condemnation for those who are in Christ Jesus.",
    "Psalm 103:12 — As far as the east is from the west, so far has he removed our transgressions from us.",
    "1 John 1:9 — If we confess our sins, he is faithful and just to forgive us and purify us from all unrighteousness.",
  ],
  peace: [
    "Philippians 4:6-7 — The peace of God, which transcends all understanding, will guard your heart and mind.",
    "John 14:27 — Peace I leave with you; my peace I give you. Not as the world gives do I give to you.",
    "Isaiah 26:3 — You keep in perfect peace those whose minds are steadfast, because they trust in you.",
  ],
  joy: [
    "Psalm 16:11 — In your presence there is fullness of joy; at your right hand are pleasures forevermore.",
    "Nehemiah 8:10 — The joy of the Lord is your strength.",
    "Philippians 4:4 — Rejoice in the Lord always. I will say it again: Rejoice!",
  ],
  default: [
    "Psalm 46:1 — God is our refuge and strength, an ever-present help in trouble.",
    "Jeremiah 29:11 — I know the plans I have for you, plans to prosper you and not to harm you.",
    "Psalm 55:22 — Cast your cares on the Lord and he will sustain you; he will never let the righteous be shaken.",
  ],
};

/* ─── Wisdom quotes — matched to specific feeling ─── */

const WISDOM_QUOTES: Record<string, string[]> = {
  pain: [
    "The wound is the place where the light enters you. — Rumi",
    "Pain is inevitable. Suffering is optional. — Haruki Murakami",
    "What hurts you today makes you stronger tomorrow, if you let it move through you. — Anonymous",
  ],
  sadness: [
    "The wound is the place where the light enters you. — Rumi",
    "Sorrow is a teacher; listen to it deeply. — Anonymous",
    "Emotions are not problems to be solved. They are signals to be heard. — Aisha Tyler",
  ],
  loneliness: [
    "Loneliness is the human condition. No one is ever going to fill that space. The best you can do is know somebody who understands it. — Janet Fitch",
    "What a lovely surprise to finally discover how unlonely being alone can be. — Ellen Burstyn",
    "We are most alive when we are in love, and most awake when we are seen. — Anonymous",
  ],
  anger: [
    "Anger is a wind which blows out the lamp of the mind. — Robert Green Ingersoll",
    "Speak when you are angry and you will make the best speech you will ever regret. — Ambrose Bierce",
    "The more you know yourself, the more patience you have for what you see in others. — Erik Erikson",
  ],
  fear: [
    "Courage is not the absence of fear, but the triumph over it. — Nelson Mandela",
    "You gain strength and confidence by every experience in which you really stop to look fear in the face. — Eleanor Roosevelt",
    "Do the thing you fear and the death of fear is certain. — Ralph Waldo Emerson",
  ],
  confusion: [
    "When you are unsure, quiet your mind and trust the next right step. — Anonymous",
    "Clarity comes from action, not thought. — Marie Forleo",
    "The only journey is the one within. — Rainer Maria Rilke",
  ],
  shame: [
    "You are not what happened to you. You are what you choose to become. — Carl Jung",
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
    "Gratitude turns what we have into enough, and more. — Melody Beattie",
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
  exerciseSuggestion: { text: string; path: string; buttonLabel: string };
  pathways: Pathway[];
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

function detectDistress(text: string) {
  const lower = text.toLowerCase();
  return DISTRESS_TERMS.some((term) => lower.includes(term));
}

function buildResponseAnalysis(text: string): ResponseAnalysis {
  const trimmed = text.trim();
  const short = trimmed.length > 180 ? `${trimmed.slice(0, 180)}…` : trimmed;
  const emotion = detectCoreEmotion(trimmed);
  const displayEmotion = emotion === "default" ? "present" : emotion;
  return {
    reflection: `I hear you saying, "${short}." That feels deeply real, and I'm here with you.`,
    emotion: displayEmotion,
    exerciseSuggestion: EXERCISE_SUGGESTION[emotion] ?? EXERCISE_SUGGESTION.default,
    pathways: HEALING_PATHWAYS[emotion] ?? HEALING_PATHWAYS.default,
    verses: BIBLE_VERSES[emotion] ?? BIBLE_VERSES.default,
    quotes: WISDOM_QUOTES[emotion] ?? WISDOM_QUOTES.default,
    distress: detectDistress(trimmed),
  };
}

export default function BrainDump() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [userMessageCount, setUserMessageCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const listenTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { toast } = useToast();
  const { speak: ttsSpeak, stop: ttsStop, speaking: ttsSpeaking } = useTTS();
  const prefs = getPreferences();
  const [autoRead, setAutoRead] = useState(prefs.autoReadEnabled);

  const activeMethods = COMMUNICATION_METHODS.map((m) => m.id);
  const [activeTab, setActiveTab] = useState(activeMethods[0]);
  const [analysis, setAnalysis] = useState<ResponseAnalysis | null>(null);
  const [showPathways, setShowPathways] = useState(false);

  const send = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setAnalysis(buildResponseAnalysis(trimmed));
    setUserMessageCount((prev) => {
      const next = prev + 1;
      if (next >= 2) setShowPathways(true);
      return next;
    });
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

  useEffect(() => {
    if (listenTimerRef.current) clearTimeout(listenTimerRef.current);
    if (activeTab === "speak") {
      listenTimerRef.current = setTimeout(() => startListening(), 800);
    } else {
      stopListening();
    }
    return () => { if (listenTimerRef.current) clearTimeout(listenTimerRef.current); };
  }, [activeTab]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); }
  };

  const replayMessage = (text: string) => { ttsStop(); ttsSpeak(text); };

  function renderInputMethod(method: string) {
    switch (method) {
      case "type":
      case "braille":
      case "aac":
      case "eyetrack":
        return (
          <div className="px-4 py-3">
            <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2 items-end max-w-3xl mx-auto">
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
              <Button type="submit" size="icon" disabled={!input.trim() || isLoading} className="shrink-0 h-12 w-12 rounded-xl" aria-label="Send message">
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
                <Button onClick={stopListening} size="lg" variant="destructive" className="rounded-2xl px-8 gap-2">
                  <MicOff className="h-5 w-5" /> Stop Listening
                </Button>
              ) : (
                <Button onClick={startListening} size="lg" className="rounded-2xl px-8 gap-2" disabled={isLoading}>
                  <Mic className="h-5 w-5" /> Tap to Speak
                </Button>
              )}
              {speech.transcript && (
                <p className="text-sm text-muted-foreground text-center">Heard: "{speech.transcript}"</p>
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
    <div className="flex flex-col h-full" style={{ background: "radial-gradient(ellipse at 30% 20%, hsl(270,80%,5%) 0%, hsl(270,60%,12%) 45%, hsl(270,30%,28%) 100%)" }}>
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-4" role="log" aria-label="Conversation" aria-live="polite">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === "user" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-card text-card-foreground border border-border rounded-bl-sm"}`}>
                {msg.role === "assistant" ? (
                  <div className="space-y-2">
                    <div className="prose prose-sm prose-invert max-w-none prose-p:my-1 prose-headings:font-display">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                    <button onClick={() => replayMessage(msg.content)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mt-1" aria-label="Replay this message">
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
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="rounded-3xl border border-white/10 bg-gradient-to-br from-purple-900 via-violet-800 to-sky-900 p-5 text-white shadow-xl space-y-5">

            {/* Reflection + emotion */}
            <div className="space-y-1.5">
              <p className="text-xs uppercase tracking-[0.2em] text-purple-300 font-semibold">Soul Echo response</p>
              <p className="text-base leading-7">{analysis.reflection}</p>
              <p className="text-sm text-purple-200">
                <span className="font-semibold">Core feeling detected:</span> {analysis.emotion}
              </p>
            </div>

            {/* Specific exercise suggestion */}
            <div className="rounded-2xl bg-white/10 border border-white/15 p-4 space-y-3">
              <p className="text-sm text-purple-100 leading-relaxed">{analysis.exerciseSuggestion.text}</p>
              <button
                onClick={() => navigate(analysis.exerciseSuggestion.path)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500/25 border border-teal-400/40 text-teal-200 hover:bg-teal-500/35 transition-all text-sm font-semibold"
              >
                {analysis.exerciseSuggestion.buttonLabel} <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Bible verses + wisdom quotes */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <p className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Bible verses</p>
                <ul className="space-y-2 text-sm text-white/90">
                  {analysis.verses.map((verse) => (
                    <li key={verse} className="rounded-2xl bg-white/8 border border-white/10 p-3 leading-relaxed">{verse}</li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Wisdom</p>
                <ul className="space-y-2 text-sm text-white/90">
                  {analysis.quotes.map((quote) => (
                    <li key={quote} className="rounded-2xl bg-white/8 border border-white/10 p-3 leading-relaxed italic">{quote}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Communication method cards */}
            <div className="grid gap-2 sm:grid-cols-2">
              {COMMUNICATION_CARDS.map((card) => (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => { setActiveTab(card.id); if (card.id === "speak") startListening(); }}
                  className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/8 px-4 py-3 text-left transition hover:bg-white/15"
                >
                  <span className="text-xl">{card.emoji}</span>
                  <div>
                    <p className="text-sm font-semibold text-white">{card.label}</p>
                    <p className="text-xs text-white/70">{card.subtitle}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Healing pathways — shown after follow-up response */}
            <AnimatePresence>
              {showPathways && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-3">
                  <div className="border-t border-white/15 pt-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-purple-300 font-semibold mb-1">Choose your healing path</p>
                    <p className="text-sm text-white/60 mb-3">Each path below connects to what you are carrying. Choose what calls to you.</p>
                  </div>
                  <div className="space-y-2">
                    {analysis.pathways.map((p) => (
                      <button
                        key={p.room}
                        onClick={() => navigate(p.path)}
                        className="w-full flex items-start gap-3 rounded-2xl border border-white/15 bg-white/8 hover:bg-white/15 px-4 py-3.5 text-left transition-all group"
                      >
                        <span className="text-2xl shrink-0 mt-0.5">{p.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-white">{p.room}</p>
                            <span className="text-xs text-purple-300 font-medium">— {p.exercise}</span>
                          </div>
                          <p className="text-xs text-white/60 mt-0.5 leading-relaxed">{p.why}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-white/30 group-hover:text-white/70 transition-colors shrink-0 mt-1" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Distress warning */}
            {analysis.distress && (
              <div className="rounded-3xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">
                <p className="font-semibold mb-1">If you are in crisis</p>
                <p>Please reach out for immediate support. If you are feeling unsafe, call your local emergency number or your nearest crisis hotline right now.</p>
              </div>
            )}
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
              <button key={p} onClick={() => send(p)} className="text-xs px-3 py-1.5 rounded-full border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-border bg-background">
        <div className="flex items-center justify-end px-4 pt-2">
          <button onClick={() => { setAutoRead(!autoRead); if (ttsSpeaking) ttsStop(); }} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
            {autoRead ? <Volume2 className="h-3 w-3" /> : <VolumeX className="h-3 w-3" />}
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
