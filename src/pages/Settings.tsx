import { useState } from "react";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, Check, Search, Type, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getPreferences, savePreferences, WORLD_LANGUAGES, COMMUNICATION_METHODS, type DyslexiaFont } from "@/lib/preferences";
import { applyAccessibility } from "@/lib/accessibility";
import { useToast } from "@/hooks/use-toast";

const FONT_OPTIONS: { id: DyslexiaFont; label: string; sample: string; description: string }[] = [
  { id: "opendyslexic", label: "OpenDyslexic", sample: "Aa Bb Cc", description: "Weighted bottoms anchor each letter — designed for dyslexia." },
  { id: "legible", label: "Verdana / Comic Sans", sample: "Aa Bb Cc", description: "High-legibility fonts with generous letter spacing." },
  { id: "default", label: "System Default", sample: "Aa Bb Cc", description: "The app's sleek default typography." },
];

export default function SettingsPage() {
  const [prefs, setPrefs] = useState(getPreferences);
  const [search, setSearch] = useState("");
  const [saved, setSaved] = useState(false);
  const { toast } = useToast();

  const filteredLangs = WORLD_LANGUAGES.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase())
  );

  const updateFont = (font: DyslexiaFont) => {
    setPrefs((p) => ({ ...p, dyslexiaFont: font }));
    savePreferences({ dyslexiaFont: font });
    applyAccessibility({ dyslexiaFont: font });
  };

  const toggleCalm = (value: boolean) => {
    setPrefs((p) => ({ ...p, calmTones: value }));
    savePreferences({ calmTones: value });
    applyAccessibility({ calmTones: value });
  };

  const handleSave = () => {
    savePreferences(prefs);
    applyAccessibility();
    setSaved(true);
    toast({ title: "Settings saved", description: "Your preferences have been updated." });
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-32 max-w-2xl mx-auto space-y-8 w-full">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
          <SettingsIcon className="h-7 w-7 text-primary" /> Settings
        </h1>
        <p className="text-muted-foreground mt-1">Change your language and communication preferences.</p>
      </motion.div>

      {/* Primary Language */}
      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold text-foreground">Primary Language</h2>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…" className="pl-10 h-12" />
        </div>
        <div className="max-h-48 overflow-y-auto rounded-xl border border-border bg-card p-2 space-y-1">
          {filteredLangs.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setPrefs((p) => ({ ...p, primaryLanguage: lang.code }))}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors ${
                prefs.primaryLanguage === lang.code ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>
      </section>

      {/* Communication Methods */}
      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold text-foreground">Communication Methods</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          All methods are always available to you — switch between them anytime from any room using the button in the app header. You are never locked into one way.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {COMMUNICATION_METHODS.map((method) => (
            <div
              key={method.id}
              className="flex items-center gap-3 px-4 py-4 rounded-xl border-2 border-primary bg-primary/10 text-foreground"
              style={{ borderLeftWidth: 5, borderLeftColor: method.color }}
            >
              <span className="text-xl">{method.icon}</span>
              <span className="text-sm flex-1">{method.label}</span>
              <Check className="h-4 w-4 text-primary shrink-0" />
            </div>
          ))}
        </div>
      </section>

      {/* Sign Language */}
      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold text-foreground">Sign Language</h2>
        <div className="flex gap-3">
          <Button
            onClick={() => setPrefs((p) => ({ ...p, signLanguageEnabled: true }))}
            variant={prefs.signLanguageEnabled ? "default" : "outline"}
            className="rounded-xl"
          >
            Enabled
          </Button>
          <Button
            onClick={() => setPrefs((p) => ({ ...p, signLanguageEnabled: false }))}
            variant={!prefs.signLanguageEnabled ? "default" : "outline"}
            className="rounded-xl"
          >
            Disabled
          </Button>
        </div>
      </section>

      {/* Dyslexia & Visual Comfort */}
      <section className="space-y-4">
        <div>
          <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
            <Type className="h-5 w-5 text-primary" /> Dyslexia & Reading Comfort
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Choose a font that's easier on your eyes. Changes apply instantly across every page.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {FONT_OPTIONS.map((opt) => {
            const active = prefs.dyslexiaFont === opt.id;
            const fontFamily =
              opt.id === "opendyslexic"
                ? "'OpenDyslexic', 'Comic Sans MS', Verdana, sans-serif"
                : opt.id === "legible"
                ? "Verdana, 'Comic Sans MS', sans-serif"
                : "var(--font-body)";
            return (
              <button
                key={opt.id}
                onClick={() => updateFont(opt.id)}
                className={`text-left p-4 rounded-xl border-2 transition-all ${
                  active
                    ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-foreground">{opt.label}</span>
                  {active && <Check className="h-4 w-4 text-primary" />}
                </div>
                <div
                  className="text-xl text-foreground mb-2"
                  style={{ fontFamily, letterSpacing: opt.id !== "default" ? "0.03em" : undefined }}
                >
                  {opt.sample}
                </div>
                <p className="text-xs text-muted-foreground leading-snug">{opt.description}</p>
              </button>
            );
          })}
        </div>

        <div className="rounded-xl border-2 border-border bg-card p-4 flex items-start gap-4">
          <div className="rounded-lg bg-primary/10 p-2.5">
            <Sun className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-semibold text-foreground">Calm Tones</h3>
              <button
                role="switch"
                aria-checked={prefs.calmTones}
                onClick={() => toggleCalm(!prefs.calmTones)}
                className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                  prefs.calmTones ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-background shadow-lg transition-transform ${
                    prefs.calmTones ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              Switches harsh dark contrast to a soft cream background with charcoal text —
              gentler on the eyes and reduces visual vibration.
            </p>
          </div>
        </div>
      </section>



      <Button onClick={handleSave} size="lg" className="w-full rounded-2xl text-base">
        {saved ? <><Check className="h-4 w-4 mr-2" /> Saved!</> : "Save Settings"}
      </Button>
    </div>
  );
}
