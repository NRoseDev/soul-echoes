const VOICE_STORAGE_KEY = "soul-echoes-voice-settings";

export interface VoiceSettings {
  voiceURI: string | null;        // legacy browser voice
  elevenLabsVoiceId: string | null; // ElevenLabs voice ID
  elevenLabsVoiceName: string | null;
  speed: number;     // 0.6 - 1.6
  volume: number;    // 0 - 1
  genderPref: "feminine" | "masculine" | "neutral";
}

const voiceDefaults: VoiceSettings = {
  voiceURI: null,
  elevenLabsVoiceId: null,
  elevenLabsVoiceName: null,
  speed: 1,
  volume: 0.8,
  genderPref: "neutral",
};

export function getVoiceSettings(): VoiceSettings {
  try {
    const raw = localStorage.getItem(VOICE_STORAGE_KEY);
    if (!raw) return voiceDefaults;
    return { ...voiceDefaults, ...JSON.parse(raw) };
  } catch {
    return voiceDefaults;
  }
}

export function saveVoiceSettings(settings: Partial<VoiceSettings>) {
  const current = getVoiceSettings();
  const updated = { ...current, ...settings };
  localStorage.setItem(VOICE_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

// ElevenLabs curated voice list
export interface ElevenLabsVoice {
  id: string;
  name: string;
  gender: "feminine" | "masculine" | "neutral";
  accent: string;
  description: string;
}

export const ELEVENLABS_VOICES: ElevenLabsVoice[] = [
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah", gender: "feminine", accent: "US", description: "Warm & conversational" },
  { id: "FGY2WhTYpPnrIDTdsKH5", name: "Laura", gender: "feminine", accent: "US", description: "Calm & soothing" },
  { id: "XrExE9yKIg1WjnnlVkGX", name: "Matilda", gender: "feminine", accent: "US", description: "Friendly & expressive" },
  { id: "Xb7hH8MSUJpSbSDYk0k2", name: "Alice", gender: "feminine", accent: "UK", description: "Confident & clear" },
  { id: "pFZP5JQG7iQjIQuC4Bku", name: "Lily", gender: "feminine", accent: "UK", description: "Gentle & nurturing" },
  { id: "cgSgspJ2msm6clMCkdW9", name: "Jessica", gender: "feminine", accent: "US", description: "Bright & engaging" },
  { id: "SAz9YHcvj6GT2YYXdXww", name: "River", gender: "neutral", accent: "US", description: "Soft & androgynous" },
  { id: "CwhRBWXzGAHq8TQ4Fs17", name: "Roger", gender: "masculine", accent: "US", description: "Calm & reassuring" },
  { id: "IKne3meq5aSn9XLyUdCD", name: "Charlie", gender: "masculine", accent: "Australian", description: "Warm & natural" },
  { id: "JBFqnCBsd6RMkjVDRZzb", name: "George", gender: "masculine", accent: "UK", description: "Deep & steady" },
  { id: "TX3LPaxmHKxFdv7VOQHJ", name: "Liam", gender: "masculine", accent: "US", description: "Friendly & grounded" },
  { id: "onwK4e9ZLuTAKqWW03F9", name: "Daniel", gender: "masculine", accent: "UK", description: "Strong & kind" },
  { id: "nPczCjzI2devNBz1zQrb", name: "Brian", gender: "masculine", accent: "US", description: "Smooth & articulate" },
  { id: "cjVigY5qzO86Huf0OWal", name: "Eric", gender: "masculine", accent: "US", description: "Easygoing & clear" },
  { id: "bIHbv24MWmeRgasZH58o", name: "Will", gender: "masculine", accent: "US", description: "Upbeat & energetic" },
  { id: "iP95p4xoKVk53GoZ742B", name: "Chris", gender: "masculine", accent: "US", description: "Casual & approachable" },
  { id: "N2lVS1w4EtoT3dr4eOWO", name: "Callum", gender: "masculine", accent: "UK", description: "Confident & polished" },
  { id: "pqHfZKP75CvOlQylNhV4", name: "Bill", gender: "masculine", accent: "US", description: "Mature & thoughtful" },
];
