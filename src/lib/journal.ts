import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type JournalSectionKey =
  | "daily-check-in"
  | "gratitude"
  | "dream-journal"
  | "shadow-work"
  | "emotional-release"
  | "manifestation"
  | "letters-never-sent"
  | "health-journal"
  | "healer-session-journal";

export type JournalFieldType = "text" | "textarea" | "date" | "select";

export interface JournalFieldDefinition {
  name: string;
  label: string;
  placeholder: string;
  type: JournalFieldType;
  rows?: number;
  options?: string[];
}

export interface JournalSectionDefinition {
  id: JournalSectionKey;
  title: string;
  description: string;
  emoji: string;
  fields: JournalFieldDefinition[];
}

export type JournalEntryData = Record<string, string>;

export interface JournalEntryRecord {
  id?: string;
  section: JournalSectionKey;
  data: JournalEntryData;
  created_at: string;
  updated_at: string;
}

const JOURNAL_STORAGE_KEY = "soul-echoes-journal-entries";

type StoredJournalEntries = Record<JournalSectionKey, JournalEntryRecord>;

export const JOURNAL_SECTIONS: JournalSectionDefinition[] = [
  {
    id: "daily-check-in",
    title: "Daily Check-In",
    description: "Mood and intention prompts to center your day.",
    emoji: "☀️",
    fields: [
      { name: "mood", label: "How are you feeling?", placeholder: "Describe your mood...", type: "text" },
      { name: "intention", label: "Set your intention", placeholder: "What do you want to invite in today?", type: "textarea", rows: 5 },
    ],
  },
  {
    id: "gratitude",
    title: "Gratitude",
    description: "Guided gratitude prompts for a kinder view.",
    emoji: "🌸",
    fields: [
      { name: "gratitude1", label: "I am grateful for…", placeholder: "List someone, something, or a moment.", type: "textarea", rows: 3 },
      { name: "gratitude2", label: "I am grateful for…", placeholder: "Another blessing worth noticing.", type: "textarea", rows: 3 },
      { name: "gratitude3", label: "I am grateful for…", placeholder: "One more thing that brings you warmth.", type: "textarea", rows: 3 },
      { name: "gratitudeReflection", label: "Why this matters", placeholder: "How does this gratitude shift your heart?", type: "textarea", rows: 4 },
    ],
  },
  {
    id: "dream-journal",
    title: "Dream Journal",
    description: "Capture dreams with date and detail.",
    emoji: "🌙",
    fields: [
      { name: "dreamDate", label: "Date", placeholder: "Select date", type: "date" },
      { name: "dreamNotes", label: "Dream notes", placeholder: "Describe what you remember from your dream.", type: "textarea", rows: 8 },
    ],
  },
  {
    id: "shadow-work",
    title: "Shadow Work Prompts",
    description: "Deep reflection questions for honest growth.",
    emoji: "🌑",
    fields: [
      { name: "prompt1", label: "What is the part of me that is afraid to be seen?", placeholder: "Write without censorship.", type: "textarea", rows: 5 },
      { name: "prompt2", label: "What repeating pattern wants attention?", placeholder: "Name the pattern and what it feels like.", type: "textarea", rows: 5 },
      { name: "prompt3", label: "What support do I need right now?", placeholder: "Be honest with yourself.", type: "textarea", rows: 5 },
    ],
  },
  {
    id: "emotional-release",
    title: "Emotional Release Writing",
    description: "Free-write space to let emotions move.",
    emoji: "🖋️",
    fields: [
      { name: "releaseWriting", label: "Write freely", placeholder: "Let your words flow without judgment.", type: "textarea", rows: 12 },
    ],
  },
  {
    id: "manifestation",
    title: "Manifestation",
    description: "Set intention and notice what you are calling in.",
    emoji: "✨",
    fields: [
      { name: "manifestationIntention", label: "Intention", placeholder: "What are you inviting into your life?", type: "textarea", rows: 5 },
      { name: "manifestationAction", label: "Action steps", placeholder: "What practical steps will support this intention?", type: "textarea", rows: 5 },
    ],
  },
  {
    id: "letters-never-sent",
    title: "Letters Never Sent",
    description: "Write to anyone living or passed.",
    emoji: "💌",
    fields: [
      { name: "recipient", label: "Recipient", placeholder: "Who are you writing to?", type: "text" },
      { name: "letter", label: "Letter content", placeholder: "Say what is true. This letter does not need to be sent.", type: "textarea", rows: 10 },
    ],
  },
  {
    id: "health-journal",
    title: "Health Journal",
    description: "Track food, herbs, sleep, symptoms, pain, and progress over time.",
    emoji: "🩺",
    fields: [
      { name: "food", label: "Food", placeholder: "Note meals, snacks, and nourishment.", type: "textarea", rows: 4 },
      { name: "herbs", label: "Herbs", placeholder: "List herbs you used today.", type: "textarea", rows: 3 },
      { name: "supplements", label: "Supplements", placeholder: "Write what you took and why.", type: "textarea", rows: 3 },
      { name: "sleepQuality", label: "Sleep quality", placeholder: "Select how you slept.", type: "select", options: ["Excellent", "Good", "Restless", "Poor"] },
      { name: "symptoms", label: "Symptoms", placeholder: "Record any symptoms or sensations.", type: "textarea", rows: 4 },
      { name: "painLevel", label: "Pain level", placeholder: "0 = no pain, 10 = intense pain.", type: "select", options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"] },
      { name: "healingProgress", label: "Healing progress", placeholder: "How is your body or spirit moving toward ease?", type: "textarea", rows: 5 },
    ],
  },
  {
    id: "healer-session-journal",
    title: "Healer Session Journal",
    description: "Log session notes, homework, progress, and shared insights with your healer.",
    emoji: "🧘",
    fields: [
      { name: "sessionDate", label: "Session date", placeholder: "Select the date of your session.", type: "date" },
      { name: "sessionNotes", label: "Session notes", placeholder: "What did you discuss or learn during the session?", type: "textarea", rows: 6 },
      { name: "homework", label: "Homework / practices", placeholder: "What did your healer assign?", type: "textarea", rows: 5 },
      { name: "progress", label: "Progress", placeholder: "What shifts are you noticing from your work together?", type: "textarea", rows: 5 },
      { name: "sharedNotes", label: "Shared notes", placeholder: "Shared notes visible to you and your connected healer.", type: "textarea", rows: 5 },
    ],
  },
];

export const JOURNAL_SECTION_MAP: Record<JournalSectionKey, JournalSectionDefinition> =
  JOURNAL_SECTIONS.reduce((map, section) => {
    map[section.id] = section;
    return map;
  }, {} as Record<JournalSectionKey, JournalSectionDefinition>);

export function createEmptyJournalEntry(sectionId: JournalSectionKey): JournalEntryRecord {
  const section = JOURNAL_SECTION_MAP[sectionId];
  const day = new Date().toISOString().slice(0, 10);
  const data: JournalEntryData = {};
  section.fields.forEach((field) => {
    data[field.name] = field.type === "date" ? day : "";
  });

  return {
    section: sectionId,
    data,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

function loadLocalJournalEntries(): StoredJournalEntries {
  if (typeof window === "undefined") return {} as StoredJournalEntries;
  try {
    const raw = localStorage.getItem(JOURNAL_STORAGE_KEY);
    if (!raw) return {} as StoredJournalEntries;
    return JSON.parse(raw) as StoredJournalEntries;
  } catch {
    return {} as StoredJournalEntries;
  }
}

function saveLocalJournalEntry(entry: JournalEntryRecord) {
  const existing = loadLocalJournalEntries();
  const next = {
    ...existing,
    [entry.section]: entry,
  };
  localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(next));
}

function chooseLatestEntry(localEntry: JournalEntryRecord | null, remoteEntry: JournalEntryRecord | null): JournalEntryRecord | null {
  if (!localEntry) return remoteEntry;
  if (!remoteEntry) return localEntry;
  return new Date(remoteEntry.updated_at) > new Date(localEntry.updated_at) ? remoteEntry : localEntry;
}

export async function loadJournalEntry(sectionId: JournalSectionKey): Promise<JournalEntryRecord> {
  const localEntries = loadLocalJournalEntries();
  const localEntry = localEntries[sectionId] ?? null;
  const currentUser = await supabase.auth.getUser();
  const user = currentUser.data?.user;

  if (!user) {
    return localEntry ?? createEmptyJournalEntry(sectionId);
  }

  const { data, error } = await (supabase as any)
    .from("journal_entries")
    .select("id,section,data,created_at,updated_at")
    .eq("user_id", user.id)
    .eq("section", sectionId)
    .single();

  const remoteEntry = data
    ? {
        id: data.id,
        section: data.section as JournalSectionKey,
        data: data.data as JournalEntryData,
        created_at: data.created_at,
        updated_at: data.updated_at,
      }
    : null;

  const chosen = chooseLatestEntry(localEntry, remoteEntry) ?? createEmptyJournalEntry(sectionId);
  saveLocalJournalEntry(chosen);
  return chosen;
}

export async function saveJournalEntry(sectionId: JournalSectionKey, data: JournalEntryData): Promise<JournalEntryRecord> {
  const now = new Date().toISOString();
  const currentUser = await supabase.auth.getUser();
  const user = currentUser.data?.user;
  const localEntry: JournalEntryRecord = {
    section: sectionId,
    data,
    created_at: now,
    updated_at: now,
  };

  saveLocalJournalEntry(localEntry);

  if (!user || !navigator.onLine) {
    return localEntry;
  }

  const { data: savedEntry, error } = await supabase
    .from("journal_entries")
    .upsert(
      {
        user_id: user.id,
        section: sectionId,
        data,
        created_at: localEntry.created_at,
        updated_at: now,
      },
      { onConflict: ["user_id", "section"] }
    )
    .select("id,section,data,created_at,updated_at")
    .single();

  if (error || !savedEntry) {
    return localEntry;
  }

  const syncedEntry: JournalEntryRecord = {
    id: savedEntry.id,
    section: savedEntry.section as JournalSectionKey,
    data: savedEntry.data as JournalEntryData,
    created_at: savedEntry.created_at,
    updated_at: savedEntry.updated_at,
  };

  saveLocalJournalEntry(syncedEntry);
  return syncedEntry;
}

export function getJournalSection(sectionId: string): JournalSectionDefinition | undefined {
  return JOURNAL_SECTION_MAP[sectionId as JournalSectionKey];
}
