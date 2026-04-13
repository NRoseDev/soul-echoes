const VOICE_STORAGE_KEY = "soul-echoes-voice-settings";

export interface VoiceSettings {
  voiceURI: string | null;        // browser voice URI
  elevenLabsVoiceId: string | null;
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

// Curated voice list — 33 Microsoft voices across accents and genders.
// speakName is the substring matched against browser SpeechSynthesisVoice.name
// to find a native voice; falls back to a gender-appropriate browser voice.
export interface CuratedVoice {
  id: string;          // unique key
  name: string;        // display name
  accent: string;      // display accent label
  gender: "feminine" | "masculine" | "neutral";
  speakName: string;   // substring to match in browser voice name
}

export const CURATED_VOICES: CuratedVoice[] = [
  // Australia
  { id: "ms-natasha-au", name: "Natasha",  accent: "Australia",     gender: "feminine",  speakName: "Natasha"  },
  { id: "ms-carly-au",   name: "Carly",    accent: "Australia",     gender: "feminine",  speakName: "Carly"    },
  { id: "ms-tina-au",    name: "Tina",     accent: "Australia",     gender: "feminine",  speakName: "Tina"     },
  { id: "ms-annette-au", name: "Annette",  accent: "Australia",     gender: "feminine",  speakName: "Annette"  },
  { id: "ms-william-au", name: "William",  accent: "Australia",     gender: "masculine", speakName: "William"  },
  // UK
  { id: "ms-sonia-gb",   name: "Sonia",    accent: "UK",            gender: "feminine",  speakName: "Sonia"    },
  { id: "ms-libby-gb",   name: "Libby",    accent: "UK",            gender: "feminine",  speakName: "Libby"    },
  { id: "ms-olivia-gb",  name: "Olivia",   accent: "UK",            gender: "feminine",  speakName: "Olivia"   },
  { id: "ms-hollie-gb",  name: "Hollie",   accent: "UK",            gender: "feminine",  speakName: "Hollie"   },
  { id: "ms-maisie-gb",  name: "Maisie",   accent: "UK",            gender: "feminine",  speakName: "Maisie"   },
  { id: "ms-ryan-gb",    name: "Ryan",     accent: "UK",            gender: "masculine", speakName: "Ryan"     },
  // US
  { id: "ms-jenny-us",   name: "Jenny",    accent: "US",            gender: "feminine",  speakName: "Jenny"    },
  { id: "ms-aria-us",    name: "Aria",     accent: "US",            gender: "feminine",  speakName: "Aria"     },
  { id: "ms-emma-us",    name: "Emma",     accent: "US",            gender: "feminine",  speakName: "Emma"     },
  { id: "ms-ava-us",     name: "Ava",      accent: "US",            gender: "feminine",  speakName: "Ava"      },
  { id: "ms-michelle-us",name: "Michelle", accent: "US",            gender: "feminine",  speakName: "Michelle" },
  { id: "ms-monica-us",  name: "Monica",   accent: "US",            gender: "feminine",  speakName: "Monica"   },
  { id: "ms-guy-us",     name: "Guy",      accent: "US",            gender: "masculine", speakName: "Guy"      },
  { id: "ms-eric-us",    name: "Eric",     accent: "US",            gender: "masculine", speakName: "Eric"     },
  // Canada
  { id: "ms-clara-ca",   name: "Clara",    accent: "Canada",        gender: "feminine",  speakName: "Clara"    },
  { id: "ms-liam-ca",    name: "Liam",     accent: "Canada",        gender: "masculine", speakName: "Liam"     },
  // Ireland
  { id: "ms-emily-ie",   name: "Emily",    accent: "Ireland",       gender: "feminine",  speakName: "Emily"    },
  { id: "ms-connor-ie",  name: "Connor",   accent: "Ireland",       gender: "masculine", speakName: "Connor"   },
  // Africa & Other
  { id: "ms-asilia-ke",  name: "Asilia",   accent: "Kenya",         gender: "feminine",  speakName: "Asilia"   },
  { id: "ms-leah-za",    name: "Leah",     accent: "South Africa",  gender: "feminine",  speakName: "Leah"     },
  { id: "ms-ezinne-ng",  name: "Ezinne",   accent: "Nigeria",       gender: "feminine",  speakName: "Ezinne"   },
  // Asia-Pacific
  { id: "ms-luna-sg",    name: "Luna",     accent: "Singapore",     gender: "feminine",  speakName: "Luna"     },
  { id: "ms-neerja-in",  name: "Neerja",   accent: "India",         gender: "feminine",  speakName: "Neerja"   },
  { id: "ms-aarav-in",   name: "Aarav",    accent: "India",         gender: "masculine", speakName: "Aarav"    },
  { id: "ms-molly-nz",   name: "Molly",    accent: "New Zealand",   gender: "feminine",  speakName: "Molly"    },
  { id: "ms-mitchell-nz",name: "Mitchell", accent: "New Zealand",   gender: "masculine", speakName: "Mitchell" },
  { id: "ms-rosa-ph",    name: "Rosa",     accent: "Philippines",   gender: "feminine",  speakName: "Rosa"     },
  { id: "ms-sam-hk",     name: "Sam",      accent: "Hong Kong",     gender: "neutral",   speakName: "Sam"      },
];
