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

  const send = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
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

        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" aria-label="Thinking..." />
            </div>
          </motion.div>
        )}
      </div>

      {messages.length === 1 && (
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
      )}

      <div className="border-t border-border bg-background">
        <div className="flex items-center justify-end px-4 pt-2">
          <button
            onClick={() => { setAutoRead(!autoRead); if (ttsSpeaking) ttsStop(); }}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
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
