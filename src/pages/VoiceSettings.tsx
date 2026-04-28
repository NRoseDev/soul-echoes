import { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Volume2, Play, Save, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  getVoiceSettings,
  saveVoiceSettings,
  CURATED_VOICES,
  type VoiceSettings,
  type CuratedVoice,
} from "@/lib/voiceSettings";
import { useToast } from "@/hooks/use-toast";


const PREVIEW_TEXT = "Hello, I am here with you. Let me be your voice on this healing journey.";

// Keyword lists to find a gender-matching browser voice as fallback
const FEMININE_KEYWORDS = ["female", "woman", "girl", "zira", "samantha", "victoria", "karen", "moira", "tessa", "fiona", "jenny", "aria", "natasha", "hazel", "susan", "kate", "allison", "ava", "emily", "emma", "sarah", "laura", "lisa", "nicky"];
const MASCULINE_KEYWORDS = ["male", "man", "daniel", "david", "mark", "james", "fred", "alex", "ralph", "tom", "bruce", "george", "liam", "charlie", "brian", "eric", "will", "chris", "callum", "bill", "roger"];

function speakVoice(
  voice: CuratedVoice,
  speed: number,
  volume: number,
  onStart: () => void,
  onDone: () => void
) {
  if (!("speechSynthesis" in window)) { onDone(); return; }
  const synth = window.speechSynthesis;
  synth.cancel();

  const doSpeak = () => {
    const allVoices = synth.getVoices();
    const enVoices = allVoices.filter((v) => v.lang.startsWith("en"));
    const pool = enVoices.length > 0 ? enVoices : allVoices;

    const u = new SpeechSynthesisUtterance(PREVIEW_TEXT);
    u.rate = speed;
    u.volume = volume;
    u.pitch = 1;

    // 1. Try to find the exact Microsoft voice by name
    let picked = pool.find((v) => v.name.toLowerCase().includes(voice.speakName.toLowerCase()));

    // 2. Fall back to a gender-matching browser voice
    if (!picked) {
      const nameLower = (v: SpeechSynthesisVoice) => v.name.toLowerCase();
      if (voice.gender === "feminine") {
        picked = pool.find((v) => FEMININE_KEYWORDS.some((k) => nameLower(v).includes(k)));
      } else if (voice.gender === "masculine") {
        picked = pool.find((v) => MASCULINE_KEYWORDS.some((k) => nameLower(v).includes(k)));
      }
    }

    // 3. Fall back to first available English voice
    if (!picked) picked = pool[0];
    if (picked) u.voice = picked;

    onStart();
    const clear = () => onDone();
    u.onend = clear;
    u.onerror = clear;
    synth.resume();
    synth.speak(u);
    // Safety: re-enable if events never fire
    setTimeout(clear, 8000);
  };

  if (synth.getVoices().length > 0) {
    doSpeak();
  } else {
    synth.onvoiceschanged = () => {
      synth.onvoiceschanged = null;
      doSpeak();
    };
  }
}

export default function VoiceSettingsPage() {
  const [settings, setSettings] = useState<VoiceSettings>(getVoiceSettings);
  const [saved, setSaved] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const filteredVoices = ELEVENLABS_VOICES.filter((v) => {
    if (settings.genderPref === "neutral") return true;
    return v.gender === settings.genderPref || v.gender === "neutral";
  });

  const playElevenLabs = useCallback(async (voice: ElevenLabsVoice) => {
    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setPlayingId(voice.id);

    try {
      const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: anonKey,
            Authorization: `Bearer ${anonKey}`,
          },
          body: JSON.stringify({ text: PREVIEW_TEXT, voiceId: voice.id }),
        }
      );

      if (!response.ok) throw new Error(`TTS failed: ${response.status}`);

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.volume = settings.volume;
      audioRef.current = audio;

      audio.onended = () => { setPlayingId(null); URL.revokeObjectURL(audioUrl); };
      audio.onerror = () => { setPlayingId(null); URL.revokeObjectURL(audioUrl); };

      await audio.play();
    } catch (err) {
      console.warn("ElevenLabs failed, falling back to browser voice:", err);
      // --- Browser speechSynthesis fallback ---
      try {
        const synth = window.speechSynthesis;
        synth.cancel();
        const utterance = new SpeechSynthesisUtterance(PREVIEW_TEXT);
        const allVoices = synth.getVoices();
        const browserVoice = allVoices.find(v => v.name.toLowerCase().includes(voice.name.toLowerCase()))
          || allVoices.find(v => v.lang.startsWith("en"))
          || null;
        if (browserVoice) utterance.voice = browserVoice;
        utterance.rate = settings.speed;
        utterance.volume = settings.volume;
        utterance.onend = () => setPlayingId(null);
        utterance.onerror = () => setPlayingId(null);
        synth.speak(utterance);
      } catch (fallbackErr) {
        console.error("Browser voice fallback also failed:", fallbackErr);
        toast({ title: "Preview failed", description: "Could not play voice preview.", variant: "destructive" });
        setPlayingId(null);
      }
    }
  }, [settings.volume, toast]);
  const playVoice = useCallback(
    (voice: CuratedVoice) => {
      // Stop any browser speech in progress
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
      setPlayingId(voice.id);
      speakVoice(
        voice,
        settings.speed,
        settings.volume,
        () => {}, // onStart — state already set above
        () => setPlayingId(null)
      );
    },
    [settings.speed, settings.volume]
  );

  const testVoice = useCallback(() => {
    const selected =
      (settings.elevenLabsVoiceId
        ? CURATED_VOICES.find((v) => v.id === settings.elevenLabsVoiceId)
        : null) ?? CURATED_VOICES[0];
    playVoice(selected);
  }, [settings.elevenLabsVoiceId, playVoice]);

  const handleSave = () => {
    saveVoiceSettings(settings);
    setSaved(true);
    toast({ title: "Voice settings saved", description: "Your voice will be used across all rooms." });
    setTimeout(() => setSaved(false), 2000);
  };

  const speedLabel = settings.speed <= 0.75 ? "Slow" : settings.speed >= 1.25 ? "Fast" : "Normal";
  const volumeLabel = settings.volume <= 0.35 ? "Soft" : settings.volume >= 0.75 ? "Loud" : "Medium";

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-2xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
          <Volume2 className="h-7 w-7 text-primary" /> Voice Settings
        </h1>
        <p className="text-muted-foreground mt-1">Choose how Soul Echoes speaks to you.</p>
      </motion.div>

      <section className="space-y-3" aria-labelledby="speed-heading">
        <h2 id="speed-heading" className="font-display text-lg font-semibold text-foreground">
          Speech Speed — <span className="text-primary">{speedLabel}</span>
        </h2>
        <Slider
          value={[settings.speed]}
          onValueChange={([v]) => setSettings((s) => ({ ...s, speed: v }))}
          min={0.5} max={1.5} step={0.1}
          aria-label="Speech speed"
        />
        <div className="flex justify-between text-xs text-muted-foreground" aria-hidden="true">
          <span>Slow</span><span>Normal</span><span>Fast</span>
        </div>
      </section>

      <section className="space-y-3" aria-labelledby="volume-heading">
        <h2 id="volume-heading" className="font-display text-lg font-semibold text-foreground">
          Speech Volume — <span className="text-primary">{volumeLabel}</span>
        </h2>
        <Slider
          value={[settings.volume]}
          onValueChange={([v]) => setSettings((s) => ({ ...s, volume: v }))}
          min={0.1} max={1} step={0.05}
          aria-label="Speech volume"
        />
        <div className="flex justify-between text-xs text-muted-foreground" aria-hidden="true">
          <span>Soft</span><span>Medium</span><span>Loud</span>
        </div>
      </section>

      <section className="space-y-3" aria-labelledby="voices-heading">
        <h2 id="voices-heading" className="font-display text-lg font-semibold text-foreground">
          Available Voices
        </h2>
        <p className="text-sm text-muted-foreground">Tap play to preview, then tap a voice to select it.</p>

        <div className="space-y-1 max-h-[400px] overflow-y-auto pr-1" role="listbox" aria-label="Voice options">
          {CURATED_VOICES.map((voice) => {
            const isSelected = settings.elevenLabsVoiceId === voice.id;
            const isPlaying = playingId === voice.id;
            return (
              <div
                key={voice.id}
                role="option"
                aria-selected={isSelected}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/40"
                }`}
                onClick={() =>
                  setSettings((s) => ({
                    ...s,
                    elevenLabsVoiceId: voice.id,
                    elevenLabsVoiceName: voice.name,
                  }))
                }
              >
                <button
                  onClick={(e) => { e.stopPropagation(); playVoice(voice); }}
                  disabled={playingId !== null}
                  aria-label={isPlaying ? `Playing ${voice.name}` : `Preview ${voice.name}`}
                  className="shrink-0 h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary/20 disabled:opacity-50"
                >
                  {isPlaying
                    ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                    : <Play className="h-3.5 w-3.5" aria-hidden="true" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{voice.name}</p>
                  <p className="text-xs text-muted-foreground">{voice.accent}</p>
                </div>
                {isSelected && <Check className="h-5 w-5 text-primary shrink-0" aria-label="Selected" />}
              </div>
            );
          })}
        </div>
      </section>

      <div className="flex flex-col sm:flex-row gap-3 pb-8">
        <Button
          onClick={testVoice}
          variant="outline"
          size="lg"
          className="flex-1 rounded-2xl text-base"
          disabled={playingId !== null}
          aria-label={playingId ? "Playing voice preview" : "Test selected voice"}
        >
          {playingId
            ? <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
            : <Play className="h-4 w-4 mr-2" aria-hidden="true" />}
          Test Voice
        </Button>
        <Button onClick={handleSave} size="lg" className="flex-1 rounded-2xl text-base">
          {saved
            ? <Check className="h-4 w-4 mr-2" aria-hidden="true" />
            : <Save className="h-4 w-4 mr-2" aria-hidden="true" />}
          {saved ? "Saved!" : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}
