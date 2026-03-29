const SAFETY_KEY = "soul-echoes-safety";

export type AngelType = "michael" | "faith";
export type AccessMethod = "pin" | "codeword" | "symbol" | "colorseq" | "sign" | "pattern";

export interface SafetySettings {
  angel: AngelType | null;
  accessMethod: AccessMethod | null;
  accessValue: string; // PIN digits, codeword, symbol ID, color sequence, etc.
  setupComplete: boolean;
}

const defaults: SafetySettings = {
  angel: null,
  accessMethod: null,
  accessValue: "",
  setupComplete: false,
};

export function getSafetySettings(): SafetySettings {
  try {
    const raw = localStorage.getItem(SAFETY_KEY);
    if (!raw) return defaults;
    return { ...defaults, ...JSON.parse(raw) };
  } catch {
    return defaults;
  }
}

export function saveSafetySettings(settings: Partial<SafetySettings>) {
  const current = getSafetySettings();
  const updated = { ...current, ...settings };
  localStorage.setItem(SAFETY_KEY, JSON.stringify(updated));
  return updated;
}

// Michael situations (physical safety)
export const MICHAEL_SITUATIONS = [
  { code: "111", color: "🔴", label: "I am in immediate danger", emoji: "⚔️" },
  { code: "222", color: "🟠", label: "I am being held against my will", emoji: "🔒" },
  { code: "333", color: "🟡", label: "I am being hurt right now", emoji: "💔" },
  { code: "444", color: "🟣", label: "I need police immediately", emoji: "🚨" },
  { code: "555", color: "⚫", label: "Trafficking situation", emoji: "🆘" },
];

// Faith situations (inner crisis)
export const FAITH_SITUATIONS = [
  { code: "111", color: "🔴", label: "I want to end my life", emoji: "🕊️" },
  { code: "222", color: "🟠", label: "I am having a mental breakdown", emoji: "🌊" },
  { code: "333", color: "🟡", label: "I am unsafe but not immediate physical danger", emoji: "⚠️" },
  { code: "444", color: "🟣", label: "I need medical help", emoji: "🏥" },
  { code: "555", color: "⚪", label: "Please check on me", emoji: "💛" },
];

// Symbols for symbol-based access method
export const ACCESS_SYMBOLS = [
  "🌙", "⭐", "🔥", "🌊", "🌸", "🦋", "🕊️", "🐉",
  "💎", "🌿", "☀️", "🌈", "🦄", "🪷", "🔮", "🫧",
];

// Colors for color-sequence access method
export const ACCESS_COLORS = [
  { id: "red", hsl: "0 70% 50%", label: "Red" },
  { id: "orange", hsl: "30 70% 50%", label: "Orange" },
  { id: "gold", hsl: "45 70% 50%", label: "Gold" },
  { id: "green", hsl: "120 40% 40%", label: "Green" },
  { id: "blue", hsl: "220 60% 50%", label: "Blue" },
  { id: "purple", hsl: "270 50% 50%", label: "Purple" },
  { id: "pink", hsl: "330 60% 60%", label: "Pink" },
  { id: "white", hsl: "0 0% 90%", label: "White" },
];
