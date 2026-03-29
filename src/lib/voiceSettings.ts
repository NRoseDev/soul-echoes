const VOICE_STORAGE_KEY = "soul-echoes-voice-settings";

export interface VoiceSettings {
  voiceURI: string | null;
  speed: number;     // 0.6 - 1.6
  volume: number;    // 0 - 1
  genderPref: "feminine" | "masculine" | "neutral";
}

const voiceDefaults: VoiceSettings = {
  voiceURI: null,
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
