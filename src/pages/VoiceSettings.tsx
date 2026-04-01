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
import { supabase } from "@/integrations/supabase/client";

const PREVIEW_TEXT = "Hello, I am here with you. Let me be your voice on this healing journey.";

const GENDER_OPTIONS: { id: VoiceSettings["genderPref"]; label: string }[] = [
  { id: "feminine", label: "Feminine" },
  { id: "masculine", label: "Masculine" },
  { id: "neutral", label: "Neutral" },
];

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
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        toast({ title: "Please sign in", description: "Voice preview requires authentication.", variant: "destructive" });
        setPlayingId(null);
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text: PREVIEW_TEXT, voiceId: voice.id }),
        }
      );

      if (!response.ok) {
        throw new Error(`TTS failed: ${response.status}`);
      }

      const audioBlob = await response.blob();
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
      };

      await audio.play();
    } catch (err) {
      console.error("ElevenLabs preview error:", err);
      toast({ title: "Preview failed", description: "Could not play voice preview. Please try again.", variant: "destructive" });
      setPlayingId(null);
    }
  }, [settings.volume, toast]);

  const testVoice = useCallback(() => {
    const selectedVoice = settings.elevenLabsVoiceId
      ? ELEVENLABS_VOICES.find((v) => v.id === settings.elevenLabsVoiceId)
      : ELEVENLABS_VOICES[0]; // default to Sarah
    if (selectedVoice) playElevenLabs(selectedVoice);
  }, [settings.elevenLabsVoiceId, playElevenLabs]);

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
        <p className="text-muted-foreground mt-1">
          Choose how Soul Echoes speaks to you. These settings apply to every room.
        </p>
      </motion.div>

      {/* Gender Preference */}
      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold text-foreground">Voice Gender Preference</h2>
        <div className="flex gap-3">
          {GENDER_OPTIONS.map((g) => (
            <button
              key={g.id}
              onClick={() => setSettings((s) => ({ ...s, genderPref: g.id }))}
              className={`flex-1 py-3 rounded-xl border-2 text-base font-medium transition-all focus:outline-none focus:ring-2 focus:ring-ring ${
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

      {/* Speed */}
      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold text-foreground">
          Speech Speed — <span className="text-primary">{speedLabel}</span>
        </h2>
        <Slider
          value={[settings.speed]}
          onValueChange={([v]) => setSettings((s) => ({ ...s, speed: v }))}
          min={0.5}
          max={1.5}
          step={0.1}
          className="py-2"
          aria-label="Speech speed"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Slow</span><span>Normal</span><span>Fast</span>
        </div>
      </section>

      {/* Volume */}
      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold text-foreground">
          Speech Volume — <span className="text-primary">{volumeLabel}</span>
        </h2>
        <Slider
          value={[settings.volume]}
          onValueChange={([v]) => setSettings((s) => ({ ...s, volume: v }))}
          min={0.1}
          max={1}
          step={0.05}
          className="py-2"
          aria-label="Speech volume"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Soft</span><span>Medium</span><span>Loud</span>
        </div>
      </section>

      {/* ElevenLabs Voice Picker */}
      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold text-foreground">
          Available Voices
        </h2>
        <p className="text-sm text-muted-foreground">
          Tap the play button to preview, then select a voice. Powered by ElevenLabs — works on every device.
        </p>
        <div className="space-y-1 max-h-[360px] overflow-y-auto pr-1">
          {filteredVoices.map((voice) => {
            const isSelected = settings.elevenLabsVoiceId === voice.id;
            const isPlaying = playingId === voice.id;
            return (
              <div
                key={voice.id}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-primary/40"
                }`}
                onClick={() =>
                  setSettings((s) => ({
                    ...s,
                    elevenLabsVoiceId: voice.id,
                    elevenLabsVoiceName: voice.name,
                  }))
                }
                role="radio"
                aria-checked={isSelected}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSettings((s) => ({
                      ...s,
                      elevenLabsVoiceId: voice.id,
                      elevenLabsVoiceName: voice.name,
                    }));
                  }
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playElevenLabs(voice);
                  }}
                  disabled={isPlaying}
                  className="shrink-0 h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary/20 transition-colors disabled:opacity-50"
                  aria-label={`Preview ${voice.name}`}
                >
                  {isPlaying ? (
                    <Loader2 className="h-3.5 w-3.5 text-foreground animate-spin" />
                  ) : (
                    <Play className="h-3.5 w-3.5 text-foreground" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{voice.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {voice.accent} · {voice.description}
                  </p>
                </div>
                {isSelected && <Check className="h-5 w-5 text-primary shrink-0" />}
              </div>
            );
          })}
        </div>
      </section>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pb-8">
        <Button
          onClick={testVoice}
          variant="outline"
          size="lg"
          className="flex-1 rounded-2xl text-base"
          disabled={playingId !== null}
        >
          {playingId ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Play className="h-4 w-4 mr-2" />
          )}
          Test Voice
        </Button>
        <Button
          onClick={handleSave}
          size="lg"
          className="flex-1 rounded-2xl text-base"
        >
          {saved ? <Check className="h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          {saved ? "Saved!" : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}
