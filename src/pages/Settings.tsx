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
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-2xl mx-auto space-y-8">
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

      <Button onClick={handleSave} size="lg" className="w-full rounded-2xl text-base">
        {saved ? <><Check className="h-4 w-4 mr-2" /> Saved!</> : "Save Settings"}
      </Button>
    </div>
  );
}
