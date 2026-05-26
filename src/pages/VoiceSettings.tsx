import { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Volume2, Play, Save, Check, Loader2, Mic, MicOff, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  getVoiceSettings,
  saveVoiceSettings,
  CURATED_VOICES,
  type VoiceSettings,
  type CuratedVoice,
} from "@/lib/voiceSettings";
import { getPreferences, savePreferences, COMMUNICATION_METHODS, type InputMethod } from "@/lib/preferences";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { useGuidedSetup } from "@/hooks/use-guided-setup";
import { useToast } from "@/hooks/use-toast";

const PREVIEW_TEXT = "Hello, I am here with you. Let me be your voice on this healing journey.";

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

    let picked = pool.find((v) => v.name.toLowerCase().includes(voice.speakName.toLowerCase()));

    if (!picked) {
      const nameLower = (v: SpeechSynthesisVoice) => v.name.toLowerCase();
      if (voice.gender === "feminine") {
        picked = pool.find((v) => FEMININE_KEYWORDS.some((k) => nameLower(v).includes(k)));
      } else if (voice.gender === "masculine") {
        picked = pool.find((v) => MASCULINE_KEYWORDS.some((k) => nameLower(v).includes(k)));
      }
    }

    if (!picked) picked = pool[0];
    if (picked) u.voice = picked;

    onStart();
    const clear = () => onDone();
    u.onend = clear;
    u.onerror = clear;
    synth.resume();
    synth.speak(u);
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
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>(getVoiceSettings);
  const [preferences, setPreferences] = useState(getPreferences());
  const [saved, setSaved] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [guidedSetupEnabled, setGuidedSetupEnabled] = useState(false);
  const { toast } = useToast();

  // Define setup steps for guided mode
  const setupSteps = [
    {
      id: "communication-method",
      question: "How would you like to communicate? You can say: Speak, Type, Sign, or Point.",
      options: [
        { keyword: "speak", value: "speak", label: "Speak" },
        { keyword: "type", value: "type", label: "Type" },
        { keyword: "sign", value: "sign", label: "Sign" },
        { keyword: "point", value: "point", label: "Point" },
      ],
      onAnswer: (value: string) => {
        setPreferences((p) => ({ ...p, inputMethod: value as InputMethod }));
      },
    },
    {
      id: "voice-gender",
      question: "Would you like a feminine or masculine voice?",
      options: [
        { keyword: "feminine", value: "feminine", label: "Feminine" },
        { keyword: "masculine", value: "masculine", label: "Masculine" },
      ],
      onAnswer: (value: string) => {
        const voiceId = value === "feminine" ? CURATED_VOICES[0].id : CURATED_VOICES[1].id;
        setVoiceSettings((s) => ({
          ...s,
          elevenLabsVoiceId: voiceId,
          elevenLabsVoiceName: CURATED_VOICES.find((v) => v.id === voiceId)?.name || "",
        }));
      },
    },
  ];

  const setup = useGuidedSetup({
    steps: setupSteps,
    enabled: guidedSetupEnabled,
    onComplete: () => {
      saveVoiceSettings(voiceSettings);
      savePreferences(preferences);
      setGuidedSetupEnabled(false);
      toast({ title: "Setup complete", description: "Your preferences are saved." });
    },
  });

  const speech = useSpeechRecognition({
    onResult: (transcript) => {
      setIsListening(false);
      toast({ title: "Heard", description: `"${transcript}"` });
    },
    continuous: false,
  });

  const startListening = useCallback(() => {
    if (isListening) return;
    setIsListening(true);
    speech.start(preferences.primaryLanguage || "en-US");
  }, [isListening, speech, preferences.primaryLanguage]);

  const stopListening = useCallback(() => {
    setIsListening(false);
    speech.stop();
  }, [speech]);

  const playVoice = useCallback(
    (voice: CuratedVoice) => {
      setPlayingId(voice.id);
      speakVoice(
        voice,
        voiceSettings.speed,
        voiceSettings.volume,
        () => {},
        () => setPlayingId(null)
      );
    },
    [voiceSettings.speed, voiceSettings.volume]
  );

  const testVoice = useCallback(() => {
    const selected =
      (voiceSettings.elevenLabsVoiceId
        ? CURATED_VOICES.find((v) => v.id === voiceSettings.elevenLabsVoiceId)
        : null) ?? CURATED_VOICES[0];
    playVoice(selected);
  }, [voiceSettings.elevenLabsVoiceId, playVoice]);

  const handleSave = () => {
    saveVoiceSettings(voiceSettings);
    savePreferences(preferences);
    setSaved(true);
    toast({ title: "Settings saved", description: "Your communication preferences have been updated." });
    setTimeout(() => setSaved(false), 2000);
  };

  const speedLabel = voiceSettings.speed <= 0.75 ? "Slow" : voiceSettings.speed >= 1.25 ? "Fast" : "Normal";
  const volumeLabel = voiceSettings.volume <= 0.35 ? "Soft" : voiceSettings.volume >= 0.75 ? "Loud" : "Medium";

  // Show guided setup if enabled
  if (guidedSetupEnabled && setup.currentStep) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 max-w-2xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
            <Mic className="h-8 w-8 text-primary animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">{setup.currentStep.question}</h2>
          <p className="text-sm text-muted-foreground">
            Step {setup.progress} of {setup.totalSteps}
          </p>
        </motion.div>

        {setup.isListeningForAnswer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-primary"
          >
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium">Listening…</span>
          </motion.div>
        )}

        <div className="flex flex-col gap-2 w-full">
          <Button
            onClick={setup.skipStep}
            variant="outline"
            size="lg"
            className="rounded-2xl gap-2"
          >
            <SkipForward className="h-4 w-4" /> Skip This Step
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-2xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
          <Volume2 className="h-7 w-7 text-primary" /> Communication & Voice
        </h1>
        <p className="text-muted-foreground mt-1">Choose how you communicate and how Soul Echoes speaks to you.</p>
        <Button
          onClick={() => setGuidedSetupEnabled(true)}
          variant="outline"
          size="sm"
          className="mt-3 gap-2"
        >
          <Mic className="h-4 w-4" /> Start Guided Setup
        </Button>
      </motion.div>

      {/* ── Communication Method Selection ── */}
      <section className="space-y-3" aria-labelledby="method-heading">
        <h2 id="method-heading" className="font-display text-lg font-semibold text-foreground">
          How You Communicate
        </h2>
        <p className="text-sm text-muted-foreground">Select your primary communication method.</p>
        <div className="grid grid-cols-2 gap-2">
          {COMMUNICATION_METHODS.map((method) => {
            const isSelected = preferences.inputMethod === method.id;
            return (
              <button
                key={method.id}
                onClick={() =>
                  setPreferences((p) => ({ ...p, inputMethod: method.id as InputMethod }))
                }
                className={`flex flex-col items-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                  isSelected ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <span className="text-2xl">{method.icon}</span>
                <span className="text-xs font-medium text-foreground text-center">{method.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Voice Selection ── */}
      <section className="space-y-3" aria-labelledby="voices-heading">
        <h2 id="voices-heading" className="font-display text-lg font-semibold text-foreground">
          Soul Echo's Voice
        </h2>
        <p className="text-sm text-muted-foreground">Tap play to preview, then tap a voice to select it.</p>

        <div className="space-y-1 max-h-[400px] overflow-y-auto pr-1" role="listbox" aria-label="Voice options">
          {CURATED_VOICES.map((voice) => {
            const isSelected = voiceSettings.elevenLabsVoiceId === voice.id;
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
                  setVoiceSettings((s) => ({
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

      {/* ── Speech Speed ── */}
      <section className="space-y-3" aria-labelledby="speed-heading">
        <h2 id="speed-heading" className="font-display text-lg font-semibold text-foreground">
          Speech Speed — <span className="text-primary">{speedLabel}</span>
        </h2>
        <Slider
          value={[voiceSettings.speed]}
          onValueChange={([v]) => setVoiceSettings((s) => ({ ...s, speed: v }))}
          min={0.5} max={1.5} step={0.1}
          aria-label="Speech speed"
        />
        <div className="flex justify-between text-xs text-muted-foreground" aria-hidden="true">
          <span>Slow</span><span>Normal</span><span>Fast</span>
        </div>
      </section>

      {/* ── Speech Volume ── */}
      <section className="space-y-3" aria-labelledby="volume-heading">
        <h2 id="volume-heading" className="font-display text-lg font-semibold text-foreground">
          Speech Volume — <span className="text-primary">{volumeLabel}</span>
        </h2>
        <Slider
          value={[voiceSettings.volume]}
          onValueChange={([v]) => setVoiceSettings((s) => ({ ...s, volume: v }))}
          min={0.1} max={1} step={0.05}
          aria-label="Speech volume"
        />
        <div className="flex justify-between text-xs text-muted-foreground" aria-hidden="true">
          <span>Soft</span><span>Medium</span><span>Loud</span>
        </div>
      </section>

      {/* ── Save & Test ── */}
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
