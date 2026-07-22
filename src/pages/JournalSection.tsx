import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CircleCheck } from "lucide-react";
import ASLSignInput from "@/components/ASLSignInput";
import {
  JOURNAL_SECTIONS,
  JOURNAL_SECTION_MAP,
  JournalEntryData,
  JournalSectionDefinition,
  JournalSectionKey,
  createEmptyJournalEntry,
  loadJournalEntry,
  saveJournalEntry,
} from "@/lib/journal";

const PAGE_TEXT = {
  dailyCheckIn: "Mood + intention prompts",
  gratitude: "Guided gratitude practice",
  dreamJournal: "Capture dreams and their meaning",
  shadowWork: "Reflect on the parts of you that need light",
  emotionalRelease: "Free writing for emotion release",
  manifestation: "Set intention and notice the path ahead",
  lettersNeverSent: "Write letters you may never send",
  healthJournal: "Track food, rest, symptoms, and healing progress",
};

export default function JournalSection() {
  const navigate = useNavigate();
  const params = useParams<{ section?: string }>();
  const sectionId = params.section as JournalSectionKey | undefined;
  const section = useMemo(
    () => (sectionId ? JOURNAL_SECTION_MAP[sectionId] : undefined),
    [sectionId]
  );

  const [entry, setEntry] = useState<JournalEntryData | null>(null);
  const [status, setStatus] = useState<string>("Loading your journal...");
  const [isSaving, setIsSaving] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const saveTimerRef = useRef<number | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (saveTimerRef.current !== null) window.clearTimeout(saveTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!sectionId || !section) return;
    setHasLoaded(false);
    setStatus("Loading saved journal...");

    loadJournalEntry(sectionId)
      .then((record) => {
        if (!mountedRef.current) return;
        setEntry(record.data);
        setHasLoaded(true);
        setStatus("Your entry is ready. Changes save automatically.");
      })
      .catch(() => {
        if (!mountedRef.current) return;
        setEntry(createEmptyJournalEntry(sectionId).data);
        setHasLoaded(true);
        setStatus("Unable to load cloud entry. Working locally.");
      });
  }, [sectionId, section]);

  const scheduleSave = useCallback(
    (nextData: JournalEntryData) => {
      if (!sectionId) return;
      if (saveTimerRef.current !== null) window.clearTimeout(saveTimerRef.current);
      setIsSaving(true);
      setStatus("Saving…");
      saveTimerRef.current = window.setTimeout(async () => {
        try {
          await saveJournalEntry(sectionId, nextData);
          if (!mountedRef.current) return;
          setStatus("Saved.");
        } catch {
          if (!mountedRef.current) return;
          setStatus("Save failed. Changes remain local.");
        } finally {
          if (!mountedRef.current) return;
          setIsSaving(false);
        }
      }, 750);
    },
    [sectionId]
  );

  const updateField = useCallback(
    (field: string, value: string) => {
      setEntry((current) => {
        const next = { ...(current ?? {}), [field]: value };
        scheduleSave(next);
        return next;
      });
    },
    [scheduleSave]
  );

  if (!section) {
    return (
      <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-violet-950 via-indigo-950 to-sky-800 text-white px-4 py-8">
        <div className="max-w-3xl mx-auto rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-black/25">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} aria-label="Back">
            <ArrowLeft className="h-4 w-4"  aria-hidden="true" />
          </Button>
          <h1 className="mt-6 text-3xl font-bold">Journal section not found</h1>
          <p className="mt-4 text-muted-foreground">Return to the Journal room and choose a valid section.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-violet-950 via-indigo-950 to-sky-800 text-white px-4 py-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            <Button onClick={() => navigate(-1)} variant="secondary" size="sm" className="bg-white/10 text-white hover:bg-white/15">
              <ArrowLeft className="h-4 w-4"  aria-hidden="true" /> Back
            </Button>
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.2em] text-sky-200">Journal</p>
              <h1 className="text-3xl md:text-4xl font-display font-bold">{section.emoji} {section.title}</h1>
              <p className="max-w-3xl text-muted-foreground leading-relaxed">{section.description}</p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-slate-100">
            <CircleCheck className="h-4 w-4 text-emerald-300"  aria-hidden="true" />
            <span>{hasLoaded ? status : "Loading…"}</span>
          </div>
        </div>

        <div className="grid gap-6">
          {section.fields.map((field) => (
            <div key={field.name} className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/10">
              <label className="block text-sm font-semibold text-slate-100 mb-3">{field.label}</label>
              {field.type === "textarea" ? (
                <Textarea
                  value={entry?.[field.name] ?? ""}
                  onChange={(e) => updateField(field.name, e.target.value)}
                  onFocus={() => setFocusedField(field.name)}
                  placeholder={field.placeholder}
                  rows={field.rows ?? 6}
                  className="min-h-[140px] resize-none bg-slate-950/80 border-white/10 text-white placeholder:text-slate-500"
                />
              ) : field.type === "text" ? (
                <Input
                  value={entry?.[field.name] ?? ""}
                  onChange={(e) => updateField(field.name, e.target.value)}
                  onFocus={() => setFocusedField(field.name)}
                  placeholder={field.placeholder}
                  className="bg-slate-950/80 border-white/10 text-white placeholder:text-slate-500"
                />
              ) : field.type === "date" ? (
                <Input
                  type="date"
                  value={entry?.[field.name] ?? ""}
                  onChange={(e) => updateField(field.name, e.target.value)}
                  className="bg-slate-950/80 border-white/10 text-white"
                />
              ) : (
                <select
                  value={entry?.[field.name] ?? ""}
                  onChange={(e) => updateField(field.name, e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-sky-400"
                >
                  <option value="" disabled>
                    {field.placeholder}
                  </option>
                  {field.options?.map((option) => (
                    <option key={option} value={option} className="bg-slate-950 text-white">
                      {option}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>

        {/* ── ASL Sign Input ── */}
        <div className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
          <p className="text-xs text-slate-400 px-5 pt-4 pb-1">
            Sign your thoughts — tap a field above first, then use ASL cards below to add to it
          </p>
          <ASLSignInput
            onSend={(text) => {
              const target = focusedField ?? section?.fields?.[0]?.name;
              if (!target) return;
              updateField(target, `${entry?.[target] ?? ""} ${text}`.trimStart());
            }}
          />
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-slate-200">
          <p className="font-semibold">How this works</p>
          <p className="mt-2 text-muted-foreground">Your journal is saved automatically to your device immediately and synced to the cloud when you are signed in and online. Use the back button to return to the Journal room at any time.</p>
        </div>
      </div>
    </div>
  );
}
