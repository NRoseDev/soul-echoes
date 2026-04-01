const STORAGE_KEY = "soul-echoes-preferences";

export type InputMethod = "speak" | "sign" | "point" | "type" | "connect";

export interface UserPreferences {
  onboardingComplete: boolean;
  primaryLanguage: string;
  secondaryLanguage: string | null;
  signLanguageEnabled: boolean;
  communicationMethods: string[]; // up to 3
  autoReadEnabled: boolean;
  inputMethod: InputMethod;
}

const defaults: UserPreferences = {
  onboardingComplete: false,
  primaryLanguage: "en",
  secondaryLanguage: null,
  signLanguageEnabled: false,
  communicationMethods: ["type"],
  autoReadEnabled: true,
  inputMethod: "type",
};

export function getPreferences(): UserPreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw);
    // Migration: old single communicationMethod → array
    if (parsed.communicationMethod && !parsed.communicationMethods) {
      parsed.communicationMethods = [parsed.communicationMethod];
      delete parsed.communicationMethod;
    }
    return { ...defaults, ...parsed };
  } catch {
    return defaults;
  }
}

export function savePreferences(prefs: Partial<UserPreferences>) {
  const current = getPreferences();
  const updated = { ...current, ...prefs };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function clearPreferences() {
  localStorage.removeItem(STORAGE_KEY);
}

// Comprehensive world languages list
export const WORLD_LANGUAGES = [
  { code: "af", name: "Afrikaans", flag: "🇿🇦", color: "hsl(30,70%,50%)" },
  { code: "sq", name: "Albanian", flag: "🇦🇱", color: "hsl(0,70%,45%)" },
  { code: "am", name: "Amharic", flag: "🇪🇹", color: "hsl(120,50%,40%)" },
  { code: "ar", name: "Arabic", flag: "🇸🇦", color: "hsl(130,60%,35%)" },
  { code: "hy", name: "Armenian", flag: "🇦🇲", color: "hsl(25,80%,50%)" },
  { code: "az", name: "Azerbaijani", flag: "🇦🇿", color: "hsl(195,80%,45%)" },
  { code: "eu", name: "Basque", flag: "🏴", color: "hsl(0,70%,40%)" },
  { code: "be", name: "Belarusian", flag: "🇧🇾", color: "hsl(0,60%,45%)" },
  { code: "bn", name: "Bengali", flag: "🇧🇩", color: "hsl(140,60%,35%)" },
  { code: "bs", name: "Bosnian", flag: "🇧🇦", color: "hsl(220,70%,45%)" },
  { code: "bg", name: "Bulgarian", flag: "🇧🇬", color: "hsl(140,50%,40%)" },
  { code: "my", name: "Burmese", flag: "🇲🇲", color: "hsl(45,80%,50%)" },
  { code: "ca", name: "Catalan", flag: "🏴", color: "hsl(45,90%,50%)" },
  { code: "ceb", name: "Cebuano", flag: "🇵🇭", color: "hsl(220,60%,40%)" },
  { code: "zh", name: "Chinese (Mandarin)", flag: "🇨🇳", color: "hsl(0,80%,45%)" },
  { code: "zh-yue", name: "Chinese (Cantonese)", flag: "🇭🇰", color: "hsl(0,70%,50%)" },
  { code: "hr", name: "Croatian", flag: "🇭🇷", color: "hsl(0,60%,45%)" },
  { code: "cs", name: "Czech", flag: "🇨🇿", color: "hsl(210,70%,45%)" },
  { code: "da", name: "Danish", flag: "🇩🇰", color: "hsl(0,80%,45%)" },
  { code: "nl", name: "Dutch", flag: "🇳🇱", color: "hsl(20,80%,50%)" },
  { code: "en", name: "English", flag: "🇬🇧", color: "hsl(220,60%,45%)" },
  { code: "et", name: "Estonian", flag: "🇪🇪", color: "hsl(210,60%,40%)" },
  { code: "fil", name: "Filipino (Tagalog)", flag: "🇵🇭", color: "hsl(220,60%,40%)" },
  { code: "fi", name: "Finnish", flag: "🇫🇮", color: "hsl(210,70%,50%)" },
  { code: "fr", name: "French", flag: "🇫🇷", color: "hsl(220,80%,45%)" },
  { code: "gl", name: "Galician", flag: "🏴", color: "hsl(210,60%,45%)" },
  { code: "ka", name: "Georgian", flag: "🇬🇪", color: "hsl(0,70%,45%)" },
  { code: "de", name: "German", flag: "🇩🇪", color: "hsl(45,80%,50%)" },
  { code: "el", name: "Greek", flag: "🇬🇷", color: "hsl(210,70%,50%)" },
  { code: "gu", name: "Gujarati", flag: "🇮🇳", color: "hsl(25,80%,50%)" },
  { code: "ht", name: "Haitian Creole", flag: "🇭🇹", color: "hsl(220,60%,40%)" },
  { code: "ha", name: "Hausa", flag: "🇳🇬", color: "hsl(140,60%,35%)" },
  { code: "he", name: "Hebrew", flag: "🇮🇱", color: "hsl(215,70%,50%)" },
  { code: "hi", name: "Hindi", flag: "🇮🇳", color: "hsl(25,80%,50%)" },
  { code: "hmn", name: "Hmong", flag: "🏳️", color: "hsl(280,50%,50%)" },
  { code: "hu", name: "Hungarian", flag: "🇭🇺", color: "hsl(0,70%,42%)" },
  { code: "is", name: "Icelandic", flag: "🇮🇸", color: "hsl(210,70%,45%)" },
  { code: "ig", name: "Igbo", flag: "🇳🇬", color: "hsl(140,60%,35%)" },
  { code: "id", name: "Indonesian", flag: "🇮🇩", color: "hsl(0,70%,45%)" },
  { code: "ga", name: "Irish", flag: "🇮🇪", color: "hsl(140,60%,40%)" },
  { code: "it", name: "Italian", flag: "🇮🇹", color: "hsl(140,50%,40%)" },
  { code: "ja", name: "Japanese", flag: "🇯🇵", color: "hsl(0,70%,50%)" },
  { code: "jv", name: "Javanese", flag: "🇮🇩", color: "hsl(0,60%,45%)" },
  { code: "kn", name: "Kannada", flag: "🇮🇳", color: "hsl(25,70%,50%)" },
  { code: "kk", name: "Kazakh", flag: "🇰🇿", color: "hsl(195,70%,45%)" },
  { code: "km", name: "Khmer", flag: "🇰🇭", color: "hsl(210,60%,40%)" },
  { code: "rw", name: "Kinyarwanda", flag: "🇷🇼", color: "hsl(210,60%,45%)" },
  { code: "ko", name: "Korean", flag: "🇰🇷", color: "hsl(0,60%,45%)" },
  { code: "ku", name: "Kurdish", flag: "🏳️", color: "hsl(45,80%,45%)" },
  { code: "ky", name: "Kyrgyz", flag: "🇰🇬", color: "hsl(0,70%,45%)" },
  { code: "lo", name: "Lao", flag: "🇱🇦", color: "hsl(220,60%,40%)" },
  { code: "lv", name: "Latvian", flag: "🇱🇻", color: "hsl(0,60%,40%)" },
  { code: "lt", name: "Lithuanian", flag: "🇱🇹", color: "hsl(45,70%,45%)" },
  { code: "lb", name: "Luxembourgish", flag: "🇱🇺", color: "hsl(210,60%,45%)" },
  { code: "mk", name: "Macedonian", flag: "🇲🇰", color: "hsl(0,70%,45%)" },
  { code: "mg", name: "Malagasy", flag: "🇲🇬", color: "hsl(140,50%,40%)" },
  { code: "ms", name: "Malay", flag: "🇲🇾", color: "hsl(220,60%,40%)" },
  { code: "ml", name: "Malayalam", flag: "🇮🇳", color: "hsl(25,70%,50%)" },
  { code: "mt", name: "Maltese", flag: "🇲🇹", color: "hsl(0,60%,45%)" },
  { code: "mi", name: "Māori", flag: "🇳🇿", color: "hsl(210,60%,45%)" },
  { code: "mr", name: "Marathi", flag: "🇮🇳", color: "hsl(25,70%,50%)" },
  { code: "mn", name: "Mongolian", flag: "🇲🇳", color: "hsl(210,60%,40%)" },
  { code: "ne", name: "Nepali", flag: "🇳🇵", color: "hsl(0,70%,40%)" },
  { code: "no", name: "Norwegian", flag: "🇳🇴", color: "hsl(0,70%,45%)" },
  { code: "ny", name: "Nyanja (Chichewa)", flag: "🇲🇼", color: "hsl(0,60%,40%)" },
  { code: "or", name: "Odia", flag: "🇮🇳", color: "hsl(25,70%,50%)" },
  { code: "ps", name: "Pashto", flag: "🇦🇫", color: "hsl(140,50%,35%)" },
  { code: "fa", name: "Persian (Farsi)", flag: "🇮🇷", color: "hsl(140,60%,35%)" },
  { code: "pl", name: "Polish", flag: "🇵🇱", color: "hsl(0,70%,45%)" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹", color: "hsl(140,50%,35%)" },
  { code: "pa", name: "Punjabi", flag: "🇮🇳", color: "hsl(25,80%,50%)" },
  { code: "ro", name: "Romanian", flag: "🇷🇴", color: "hsl(220,60%,40%)" },
  { code: "ru", name: "Russian", flag: "🇷🇺", color: "hsl(220,60%,45%)" },
  { code: "sm", name: "Samoan", flag: "🇼🇸", color: "hsl(210,60%,40%)" },
  { code: "gd", name: "Scottish Gaelic", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", color: "hsl(210,60%,45%)" },
  { code: "sr", name: "Serbian", flag: "🇷🇸", color: "hsl(0,60%,40%)" },
  { code: "sn", name: "Shona", flag: "🇿🇼", color: "hsl(140,50%,35%)" },
  { code: "sd", name: "Sindhi", flag: "🇵🇰", color: "hsl(140,60%,35%)" },
  { code: "si", name: "Sinhala", flag: "🇱🇰", color: "hsl(45,70%,40%)" },
  { code: "sk", name: "Slovak", flag: "🇸🇰", color: "hsl(210,60%,45%)" },
  { code: "sl", name: "Slovenian", flag: "🇸🇮", color: "hsl(210,60%,45%)" },
  { code: "so", name: "Somali", flag: "🇸🇴", color: "hsl(200,70%,45%)" },
  { code: "st", name: "Southern Sotho", flag: "🇱🇸", color: "hsl(210,60%,40%)" },
  { code: "es", name: "Spanish", flag: "🇪🇸", color: "hsl(0,80%,45%)" },
  { code: "su", name: "Sundanese", flag: "🇮🇩", color: "hsl(0,60%,45%)" },
  { code: "sw", name: "Swahili", flag: "🇹🇿", color: "hsl(140,50%,35%)" },
  { code: "sv", name: "Swedish", flag: "🇸🇪", color: "hsl(210,80%,50%)" },
  { code: "tg", name: "Tajik", flag: "🇹🇯", color: "hsl(0,60%,40%)" },
  { code: "ta", name: "Tamil", flag: "🇮🇳", color: "hsl(25,70%,50%)" },
  { code: "tt", name: "Tatar", flag: "🏳️", color: "hsl(140,50%,40%)" },
  { code: "te", name: "Telugu", flag: "🇮🇳", color: "hsl(25,70%,50%)" },
  { code: "th", name: "Thai", flag: "🇹🇭", color: "hsl(220,60%,40%)" },
  { code: "ti", name: "Tigrinya", flag: "🇪🇷", color: "hsl(210,60%,45%)" },
  { code: "tr", name: "Turkish", flag: "🇹🇷", color: "hsl(0,80%,45%)" },
  { code: "tk", name: "Turkmen", flag: "🇹🇲", color: "hsl(140,60%,35%)" },
  { code: "uk", name: "Ukrainian", flag: "🇺🇦", color: "hsl(210,80%,50%)" },
  { code: "ur", name: "Urdu", flag: "🇵🇰", color: "hsl(140,60%,35%)" },
  { code: "ug", name: "Uyghur", flag: "🏳️", color: "hsl(200,50%,45%)" },
  { code: "uz", name: "Uzbek", flag: "🇺🇿", color: "hsl(200,60%,45%)" },
  { code: "vi", name: "Vietnamese", flag: "🇻🇳", color: "hsl(0,80%,45%)" },
  { code: "cy", name: "Welsh", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", color: "hsl(140,60%,35%)" },
  { code: "xh", name: "Xhosa", flag: "🇿🇦", color: "hsl(140,50%,35%)" },
  { code: "yi", name: "Yiddish", flag: "🏳️", color: "hsl(210,50%,45%)" },
  { code: "yo", name: "Yoruba", flag: "🇳🇬", color: "hsl(140,60%,35%)" },
  { code: "zu", name: "Zulu", flag: "🇿🇦", color: "hsl(140,50%,35%)" },
];

export const COMMUNICATION_METHODS = [
  { id: "speak", label: "I speak", icon: "🗣️", picture: "🗣️", color: "hsl(30,70%,50%)" },
  { id: "type", label: "I type", icon: "⌨️", picture: "⌨️", color: "hsl(210,60%,50%)" },
  { id: "sign", label: "I sign (ASL or other)", icon: "🤟", picture: "🤟", color: "hsl(280,50%,50%)" },
  { id: "pictures", label: "I point to pictures or cards", icon: "🖼️", picture: "🖼️", color: "hsl(140,50%,45%)" },
  { id: "colors", label: "I express through colors and symbols", icon: "🎨", picture: "🎨", color: "hsl(340,60%,50%)" },
  { id: "braille", label: "I use braille or assistive device", icon: "⠿", picture: "⠿", color: "hsl(45,70%,50%)" },
  { id: "aac", label: "I use a computer or device that speaks for me", icon: "💻", picture: "💻", color: "hsl(195,60%,45%)" },
  { id: "eyetrack", label: "I use eye tracking or switch access", icon: "👁️", picture: "👁️", color: "hsl(170,50%,45%)" },
];
