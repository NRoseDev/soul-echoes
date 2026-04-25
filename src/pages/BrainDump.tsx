```tsx
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, Mic, MicOff, Volume2, VolumeX, ArrowRight, ArrowLeft } from "lucide-react";
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

/* ─────────────────────────────── */

const WELCOME_MESSAGE: ChatMessage = {
  role: "assistant",
  content:
    "Welcome to your safe space. 🌿\n\nI'm here with you. Share whatever you need.",
};

/* ─────────────────────────────── */

export default function BrainDump() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [autoRead, setAutoRead] = useState(getPreferences().autoReadEnabled);

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { speak, stop, speaking } = useTTS();

  const send = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = { role: "user", content: trimmed };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    let assistantText = "";

    try {
      await streamChat({
        messages: nextMessages,
        onDelta: (chunk) => {
          assistantText += chunk;

          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];

            if (last?.role === "assistant") {
              updated[updated.length - 1] = {
                role: "assistant",
                content: assistantText,
              };
            } else {
              updated.push({
                role: "assistant",
                content: assistantText,
              });
            }

            return updated;
          });
        },
        onDone: () => {
          setIsLoading(false);
          if (autoRead) speak(assistantText);
        },
        onError: (err) => {
          setIsLoading(false);
          toast({
            title: "Something went wrong",
            description: err,
            variant: "destructive",
          });
        },
      });
    } catch (e) {
      setIsLoading(false);
    }

    textareaRef.current?.focus();
  }, [messages, isLoading, autoRead, speak, toast]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className="max-w-[80%] rounded-xl px-4 py-3 text-sm bg-card border">
              {m.role === "assistant" ? (
                <>
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                  <button
                    onClick={() => speak(m.content)}
                    className="text-xs flex items-center gap-1 mt-2 opacity-70"
                  >
                    <Volume2 className="h-3 w-3" /> replay
                  </button>
                </>
              ) : (
                <p>{m.content}</p>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <Loader2 className="animate-spin h-4 w-4" />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex gap-2"
        >
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Say what you need..."
          />
          <Button disabled={!input.trim() || isLoading}>
            <Send />
          </Button>
        </form>
      </div>
    </div>
  );
}
```
