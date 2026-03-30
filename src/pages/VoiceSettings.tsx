import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Volume2, Play, Save, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { getVoiceSettings, saveVoiceSettings, type VoiceSettings } from "@/lib/voiceSettings";
import { useToast } from "@/hooks/use-toast";

const WELCOME_TEXT =
  "Soul Echoes — Your daily healing advocate. A sacred space to release, heal, and find closure. Let the tools of the universe guide you home to your heart, where your journey began.";

const GENDER_OPTIONS: { id: VoiceSettings["genderPref"]; label: string }[] = [
  { id: "feminine", label: "Feminine" },
  { id: "masculine", label: "Masculine" },
  { id: "neutral", label: "Neutral" },
];

function guessGender(name: string): VoiceSettings["genderPref"] {
  const lower = name.toLowerCase();
  const feminineNames = ["samantha", "karen", "moira", "tessa", "fiona", "victoria", "alice", "amelie", "anna", "ellen", "ioana", "joana", "kanya", "kyoko", "lekha", "luciana", "mariska", "mei-jia", "melina", "milena", "monica", "nora", "paulina", "sara", "satu", "sin-ji", "ting-ting", "xander", "yelda", "yuna", "zosia", "zuzana", "google us english", "female"];
  const masculineNames = ["daniel", "alex", "fred", "jorge", "juan", "luca", "thomas", "xander", "male", "david", "mark", "ralph"];
  if (feminineNames.some((n) => lower.includes(n))) return "feminine";
  if (masculineNames.some((n) => lower.includes(n))) return "masculine";
  return "neutral";
}

function getAccentLabel(voice: SpeechSynthesisVoice): string {
  const lang = voice.lang;
  const accents: Record<string, string> = {
    "en-US": "US", "en-GB": "UK", "en-AU": "Australian", "en-IN": "Indian",
    "en-ZA": "South African", "en-IE": "Irish", "en-NZ": "New Zealand",
    "en-CA": "Canadian", "en-PH": "Filipino", "en-SG": "Singaporean",
    "es-ES": "Spain", "es-MX": "Mexican", "es-AR": "Argentine", "es-CO": "Colombian",
    "fr-FR": "France", "fr-CA": "Canadian", "fr-BE": "Belgian",
    "pt-BR": "Brazilian", "pt-PT": "Portugal",
    "zh-CN": "Mandarin", "zh-TW": "Taiwanese", "zh-HK": "Cantonese",
    "ar-SA": "Saudi", "ar-EG": "Egyptian",
  };
  return accents[lang] || lang;
}

function getLanguageName(langCode: string): string {
  try {
    const display = new Intl.DisplayNames(["en"], { type: "language" });
    return display.of(langCode.split("-")[0]) || langCode;
  } catch {
    return langCode;
  }
}

export default function VoiceSettingsPage() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [settings, setSettings] = useState<VoiceSettings>(getVoiceSettings);
  const [saved, setSaved] = useState(false);
  const { toast } = useToast();

  // Load voices (may load async)
  const loadVoices = useCallback(() => {
    const v = window.speechSynthesis.getVoices();
    if (v.length > 0) setVoices(v);
  }, []);

  useEffect(() => {
    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
  }, [loadVoices]);

  // Group voices by language
  const filteredVoices = voices.filter((v) => {
    if (settings.genderPref === "neutral") return true;
    return guessGender(v.name) === settings.genderPref || guessGender(v.name) === "neutral";
  });

  const groupedByLang = filteredVoices.reduce<Record<string, SpeechSynthesisVoice[]>>((acc, v) => {
    const lang = getLanguageName(v.lang);
    if (!acc[lang]) acc[lang] = [];
    acc[lang].push(v);
    return acc;
  }, {});

  const sortedLangs = Object.keys(groupedByLang).sort();

  const PREVIEW_PHRASES: Record<string, string> = {
    en: "Hello, I will be your voice.",
    es: "Hola, seré tu voz.",
    fr: "Bonjour, je serai votre voix.",
    pt: "Olá, eu serei sua voz.",
    de: "Hallo, ich werde deine Stimme sein.",
    it: "Ciao, sarò la tua voce.",
    ja: "こんにちは、私があなたの声になります。",
    ko: "안녕하세요, 제가 당신의 목소리가 되겠습니다.",
    zh: "你好，我将成为你的声音。",
    ar: "مرحبا، سأكون صوتك.",
    hi: "नमस्ते, मैं आपकी आवाज़ बनूँगा।",
    ru: "Здравствуйте, я буду вашим голосом.",
    nl: "Hallo, ik zal uw stem zijn.",
    pl: "Cześć, będę twoim głosem.",
    sv: "Hej, jag kommer att vara din röst.",
    da: "Hej, jeg vil være din stemme.",
    fi: "Hei, minä olen äänesi.",
    nb: "Hei, jeg vil være din stemme.",
    tr: "Merhaba, sesiniz ben olacağım.",
    th: "สวัสดี ฉันจะเป็นเสียงของคุณ",
    vi: "Xin chào, tôi sẽ là giọng nói của bạn.",
    id: "Halo, saya akan menjadi suaramu.",
    ms: "Hello, saya akan menjadi suara anda.",
    ro: "Bună, voi fi vocea ta.",
    uk: "Привіт, я буду вашим голосом.",
    cs: "Ahoj, budu tvůj hlas.",
    el: "Γεια σου, θα είμαι η φωνή σου.",
    he: "שלום, אני אהיה הקול שלך.",
    hu: "Helló, én leszek a hangod.",
    ca: "Hola, seré la teva veu.",
    sk: "Ahoj, budem tvoj hlas.",
    bg: "Здравей, аз ще бъда твоят глас.",
    hr: "Bok, ja ću biti tvoj glas.",
  };

  const getPreviewText = (voice: SpeechSynthesisVoice): string => {
    const langBase = voice.lang.split("-")[0].toLowerCase();
    return PREVIEW_PHRASES[langBase] || PREVIEW_PHRASES.en;
  };

  const playPreview = (voice: SpeechSynthesisVoice) => {
    window.speechSynthesis.cancel();
    const text = getPreviewText(voice);
    const u = new SpeechSynthesisUtterance(text);
    u.voice = voice;
    u.lang = voice.lang;
    u.rate = settings.speed;
    u.volume = settings.volume;
    window.speechSynthesis.speak(u);
  };

  const testVoice = () => {
    window.speechSynthesis.cancel();
    let selectedVoice: SpeechSynthesisVoice | undefined;
    if (settings.voiceURI) {
      selectedVoice = voices.find((v) => v.voiceURI === settings.voiceURI);
    }
    const text = selectedVoice ? getPreviewText(selectedVoice) : WELCOME_TEXT;
    const u = new SpeechSynthesisUtterance(text);
    if (selectedVoice) {
      u.voice = selectedVoice;
      u.lang = selectedVoice.lang;
    }
    u.rate = settings.speed;
    u.volume = settings.volume;
    window.speechSynthesis.speak(u);
  };

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

      {/* Voice Picker */}
      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold text-foreground">
          Available Voices
        </h2>
        <p className="text-sm text-muted-foreground">
          Tap the play button to preview, then select a voice.
        </p>
        {voices.length === 0 && (
          <p className="text-sm text-muted-foreground italic">Loading voices from your device…</p>
        )}
        <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
          {sortedLangs.map((lang) => (
            <div key={lang}>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {lang}
              </p>
              <div className="space-y-1">
                {groupedByLang[lang].map((voice) => {
                  const isSelected = settings.voiceURI === voice.voiceURI;
                  const accent = getAccentLabel(voice);
                  return (
                    <div
                      key={voice.voiceURI}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary/10"
                          : "border-border bg-card hover:border-primary/40"
                      }`}
                      onClick={() => setSettings((s) => ({ ...s, voiceURI: voice.voiceURI }))}
                      role="radio"
                      aria-checked={isSelected}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSettings((s) => ({ ...s, voiceURI: voice.voiceURI }));
                        }
                      }}
                    >
                      <button
                        onClick={(e) => { e.stopPropagation(); playPreview(voice); }}
                        className="shrink-0 h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary/20 transition-colors"
                        aria-label={`Preview ${voice.name}`}
                      >
                        <Play className="h-3.5 w-3.5 text-foreground" />
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{voice.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {accent} · {voice.lang}
                        </p>
                      </div>
                      {isSelected && <Check className="h-5 w-5 text-primary shrink-0" />}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pb-8">
        <Button
          onClick={testVoice}
          variant="outline"
          size="lg"
          className="flex-1 rounded-2xl text-base"
        >
          <Play className="h-4 w-4 mr-2" /> Test Voice
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
