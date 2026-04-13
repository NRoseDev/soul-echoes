import { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Volume2, Play, Save, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  getVoiceSettings,
  saveVoiceSettings,
  ELEVENLABS_VOICES,
  type VoiceSettings,
  type ElevenLabsVoice,
} from "@/lib/voiceSettings";
import { useToast } from "@/hooks/use-toast";

const PREVIEW_TEXT = "Hello, I am here with you. Let me be your voice on this healing journey.";

const GENDER_OPTIONS: { id: VoiceSettings["genderPref"]; label: string }[] = [
  { id: "feminine", label: "Feminine" },
  { id: "masculine", label: "Masculine" },
  { id: "neutral", label: "Neutral" },
];

// Keyword lists used to pick a gender-appropriate browser fallback voice
const FEMININE_KEYWORDS = ["female", "woman", "girl", "zira", "samantha", "victoria", "karen", "moira", "tessa", "fiona", "jenny", "aria", "natasha", "hazel", "susan", "kate"];
const MASCULINE_KEYWORDS = ["male", "man", "daniel", "david", "mark", "james", "fred", "alex", "ralph", "tom", "bruce", "lee"];

function browserFallback(
  text: string,
  speed: number,
  volume: number,
  genderPref: VoiceSettings["genderPref"] = "neutral"
) {
  if (!("speechSynthesis" in window)) return;
  const synth = window.speechSynthesis;
  synth.cancel();

  const doSpeak = () => {
    const allVoices = synth.getVoices();
    const enVoices = allVoices.filter((v) => v.lang.startsWith("en"));
    const pool = enVoices.length > 0 ? enVoices : allVoices;

    const u = new SpeechSynthesisUtterance(text);
    u.rate = speed;
    u.volume = volume;

    if (pool.length > 0) {
      let picked: SpeechSynthesisVoice | undefined;
      const nameLower = (v: SpeechSynthesisVoice) => v.name.toLowerCase();

      if (genderPref === "feminine") {
        picked = pool.find((v) => FEMININE_KEYWORDS.some((k) => nameLower(v).includes(k)));
      } else if (genderPref === "masculine") {
        picked = pool.find((v) => MASCULINE_KEYWORDS.some((k) => nameLower(v).includes(k)));
      }
      // Fallback to first English voice if no gender match found
      if (!picked) picked = pool[0];
      if (picked) u.voice = picked;
    }

    synth.speak(u);
  };

  // Chrome loads voices asynchronously — wait if not ready yet
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

  // Strict filter: each category shows only voices that exactly match that gender
  const filteredVoices = ELEVENLABS_VOICES.filter((v) => v.gender === settings.genderPref);

  // Switch gender and auto-select the first voice in the new category
  const switchGender = (pref: VoiceSettings["genderPref"]) => {
    const voicesInCategory = ELEVENLABS_VOICES.filter((v) => v.gender === pref);
    const first = voicesInCategory[0] ?? null;
    setSettings((s) => ({
      ...s,
      genderPref: pref,
      elevenLabsVoiceId: first?.id ?? null,
      elevenLabsVoiceName: first?.name ?? null,
    }));
  };

  const playElevenLabs = useCallback(
    async (voice: ElevenLabsVoice) => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setPlayingId(voice.id);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({ text: PREVIEW_TEXT, voiceId: voice.id }),
          }
        );

        if (!response.ok) throw new Error(`TTS failed: ${response.status}`);

        const audioBlob = await response.blob();
        if (audioBlob.size === 0) throw new Error("Empty audio response");

        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.volume = settings.volume;
        audioRef.current = audio;
        audio.onended = () => {
          setPlayingId(null);
          URL.revokeObjectURL(audioUrl);
        };
        audio.onerror = () => {
          setPlayingId(null);
          URL.revokeObjectURL(audioUrl);
          browserFallback(PREVIEW_TEXT, settings.speed, settings.volume, settings.genderPref);
        };
        await audio.play();
      } catch (err) {
        console.warn("ElevenLabs preview unavailable, using browser TTS:", err);
        setPlayingId(null);
        browserFallback(PREVIEW_TEXT, settings.speed, settings.volume, settings.genderPref);
      }
    },
    [settings.volume, settings.speed, settings.genderPref]
  );

  const testVoice = useCallback(() => {
    // Use the currently selected voice, or the first in the filtered list
    const selectedVoice =
      (settings.elevenLabsVoiceId
        ? ELEVENLABS_VOICES.find((v) => v.id === settings.elevenLabsVoiceId)
        : null) ?? filteredVoices[0] ?? null;

    if (selectedVoice) {
      playElevenLabs(selectedVoice);
    } else {
      browserFallback(PREVIEW_TEXT, settings.speed, settings.volume, settings.genderPref);
    }
  }, [settings.elevenLabsVoiceId, settings.speed, settings.volume, settings.genderPref, filteredVoices, playElevenLabs]);

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

      <section className="space-y-3" aria-labelledby="gender-heading">
        <h2 id="gender-heading" className="font-display text-lg font-semibold text-foreground">
          Voice Gender Preference
        </h2>
        <div className="flex gap-3" role="radiogroup" aria-label="Voice gender preference">
          {GENDER_OPTIONS.map((g) => (
            <button
              key={g.id}
              role="radio"
              aria-checked={settings.genderPref === g.id}
              onClick={() => switchGender(g.id)}
              className={`flex-1 py-3 rounded-xl border-2 text-base font-medium transition-all ${
                settings.genderPref === g.id
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3" aria-labelledby="speed-heading">
        <h2 id="speed-heading" className="font-display text-lg font-semibold text-foreground">
          Speech Speed — <span className="text-primary">{speedLabel}</span>
        </h2>
        <Slider
          value={[settings.speed]}
          onValueChange={([v]) => setSettings((s) => ({ ...s, speed: v }))}
          min={0.5}
          max={1.5}
          step={0.1}
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
          min={0.1}
          max={1}
          step={0.05}
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

        {filteredVoices.length === 0 && (
          <p className="text-sm text-muted-foreground italic">No voices in this category.</p>
        )}

        <div className="space-y-1 max-h-[360px] overflow-y-auto pr-1" role="listbox" aria-label="Voice options">
          {filteredVoices.map((voice) => {
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
                  onClick={(e) => {
                    e.stopPropagation();
                    playElevenLabs(voice);
                  }}
                  disabled={isPlaying}
                  aria-label={isPlaying ? `Playing ${voice.name}` : `Preview ${voice.name}`}
                  className="shrink-0 h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary/20 disabled:opacity-50"
                >
                  {isPlaying ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                  ) : (
                    <Play className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{voice.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {voice.accent} · {voice.description}
                  </p>
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
          {playingId ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
          ) : (
            <Play className="h-4 w-4 mr-2" aria-hidden="true" />
          )}
          Test Voice
        </Button>
        <Button onClick={handleSave} size="lg" className="flex-1 rounded-2xl text-base">
          {saved ? (
            <Check className="h-4 w-4 mr-2" aria-hidden="true" />
          ) : (
            <Save className="h-4 w-4 mr-2" aria-hidden="true" />
          )}
          {saved ? "Saved!" : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}
