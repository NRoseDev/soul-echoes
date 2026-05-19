/**
 * EmotionDetector Service
 * 
 * Unified emotion detection system that normalizes all input types
 * (text, voice transcript, pointed cards) into a standardized emotion signal.
 * 
 * This is the foundation for the entire AI routing system.
 */

export interface EmotionSignal {
  emotion: string;
  intensity: number; // 1-10
  clarity: number; // 1-10 (how clear/certain the emotion is)
  confidence: number; // 0-1 (how confident the detector is)
  keywords: string[]; // which keywords triggered this emotion
}

// Registered emotions from ai_routing_map.json
// These are the ONLY emotions the system recognizes
const EMOTION_REGISTRY = {
  fear: {
    keywords: [
      "afraid", "fear", "scared", "panic", "terrified", "anxious", "anxiety",
      "fearful", "frightened", "nervous", "worried", "worry", "dread", "apprehensive",
      "can't breathe", "heart racing", "chest tight", "trembling", "shaking"
    ],
    intensity_keywords: {
      high: ["terrified", "panic", "can't breathe", "heart racing"],
      medium: ["scared", "anxious", "worried"],
      low: ["nervous", "apprehensive", "uneasy"]
    }
  },

  overwhelm: {
    keywords: [
      "overwhelmed", "overwhelm", "too much", "can't handle", "drowning", "suffocating",
      "flooded", "swamped", "buried", "crushed", "breaking down", "falling apart",
      "losing it", "can't cope", "too many things", "everything at once"
    ],
    intensity_keywords: {
      high: ["drowning", "suffocating", "breaking down", "falling apart"],
      medium: ["overwhelmed", "too much", "can't handle"],
      low: ["swamped", "busy", "a lot going on"]
    }
  },

  heartbreak: {
    keywords: [
      "heartbroken", "heartbreak", "broken heart", "loss", "lost you", "miss you",
      "longing", "ache", "aching", "hurts", "hurting", "painful", "pain",
      "rejected", "abandoned", "left me", "gone", "missing", "empty"
    ],
    intensity_keywords: {
      high: ["heartbroken", "can't breathe", "dying inside", "will never recover"],
      medium: ["heartbreak", "missing", "aching"],
      low: ["wistful", "nostalgic", "tender sadness"]
    }
  },

  guilt: {
    keywords: [
      "guilty", "guilt", "my fault", "i messed up", "i ruined", "i failed",
      "i should have", "i shouldn't have", "regret", "regrets", "sorry", "ashamed",
      "shame", "bad person", "wrong", "mistake", "failed", "let down"
    ],
    intensity_keywords: {
      high: ["my fault", "i ruined everything", "i'm a bad person", "unforgivable"],
      medium: ["guilty", "regret", "i messed up"],
      low: ["wish i had", "could have done better"]
    }
  },

  numbness: {
    keywords: [
      "numb", "numbness", "empty", "nothing", "can't feel", "disconnected",
      "dissociated", "detached", "frozen", "stuck", "nothing matters",
      "don't care", "apathetic", "hollow", "blank", "gray", "lifeless"
    ],
    intensity_keywords: {
      high: ["completely numb", "nothing matters", "don't want to feel"],
      medium: ["numb", "empty", "disconnected"],
      low: ["tired", "worn out", "going through motions"]
    }
  },

  betrayal: {
    keywords: [
      "betrayed", "betrayal", "stabbed in the back", "lied to", "deceived",
      "tricked", "manipulated", "used", "taken advantage", "not trustworthy",
      "can't trust", "backstabber", "two-faced", "fake", "phony", "dishonest"
    ],
    intensity_keywords: {
      high: ["stabbed in the back", "complete betrayal", "can't trust anyone"],
      medium: ["betrayed", "lied to", "used"],
      low: ["disappointed", "let down", "not what i expected"]
    }
  },

  abandonment: {
    keywords: [
      "abandoned", "abandonment", "left me", "left alone", "alone", "lonely",
      "no one", "nobody", "forsaken", "forgotten", "invisible", "unseen",
      "don't matter", "disposable", "replaceable", "unwanted", "rejected"
    ],
    intensity_keywords: {
      high: ["completely alone", "no one cares", "better off without me"],
      medium: ["abandoned", "lonely", "left me"],
      low: ["left out", "excluded", "on the outside"]
    }
  },

  hopelessness: {
    keywords: [
      "hopeless", "hopelessness", "no point", "never get better", "never change",
      "stuck forever", "give up", "why try", "pointless", "meaningless",
      "dark", "darkness", "black", "void", "end", "nothing left", "done"
    ],
    intensity_keywords: {
      high: ["want to die", "end it", "no reason to live", "better off dead"],
      medium: ["hopeless", "never change", "stuck forever"],
      low: ["discouraged", "pessimistic", "doubtful"]
    }
  }
};

// Secondary emotions that might be detected but aren't in the primary registry
// These will be mapped to the closest primary emotion
const SECONDARY_EMOTIONS: Record<string, string | null> = {
  sadness: "heartbreak", // sadness → heartbreak (unspoken chamber)
  anger: "overwhelm", // anger → overwhelm (breathe first)
  confusion: "overwhelm", // confusion → overwhelm (breathe/clarity)
  shame: "guilt", // shame → guilt (journal/shadow work)
  peace: null, // no routing needed, user is stable
  joy: null, // no routing needed, user is stable
  pain: "heartbreak", // physical/emotional pain → heartbreak
};

/**
 * Detect emotion from text input
 * Returns the primary emotion and intensity level
 */
export function detectEmotionFromText(text: string): EmotionSignal | null {
  if (!text || text.trim().length === 0) {
    return null;
  }

  const lower = text.toLowerCase();
  const words = lower.split(/\s+/);

  let bestMatch: {
    emotion: string;
    matchCount: number;
    keywords: string[];
    intensity: number;
  } | null = null;

  // Check each registered emotion
  for (const [emotion, data] of Object.entries(EMOTION_REGISTRY)) {
    const matchedKeywords = data.keywords.filter(kw => lower.includes(kw));
    
    if (matchedKeywords.length > 0) {
      // Calculate intensity based on high/medium/low keywords
      let intensity = 5; // default medium
      
      if (matchedKeywords.some(kw => data.intensity_keywords.high.includes(kw))) {
        intensity = 8;
      } else if (matchedKeywords.some(kw => data.intensity_keywords.low.includes(kw))) {
        intensity = 3;
      }

      // Update best match if this emotion has more keyword hits
      if (!bestMatch || matchedKeywords.length > bestMatch.matchCount) {
        bestMatch = {
          emotion,
          matchCount: matchedKeywords.length,
          keywords: matchedKeywords,
          intensity
        };
      }
    }
  }

  if (!bestMatch) {
    return null;
  }

  return {
    emotion: bestMatch.emotion,
    intensity: bestMatch.intensity,
    clarity: Math.min(10, bestMatch.matchCount * 2), // more keywords = more clarity
    confidence: Math.min(1, bestMatch.matchCount / 3), // normalize to 0-1
    keywords: bestMatch.keywords
  };
}

/**
 * Detect emotion from a pointed card (Point It communication method)
 * Users tap cards like "Sad", "Angry", "Lost", etc.
 */
export function detectEmotionFromCard(cardLabel: string): EmotionSignal | null {
  if (!cardLabel || cardLabel.trim().length === 0) {
    return null;
  }

  const lower = cardLabel.toLowerCase().trim();

  // Direct emotion matches
  if (EMOTION_REGISTRY[lower as keyof typeof EMOTION_REGISTRY]) {
    return {
      emotion: lower,
      intensity: 7, // pointed cards indicate moderate-high intensity
      clarity: 10, // very clear when user points
      confidence: 0.95,
      keywords: [lower]
    };
  }

  // Secondary emotion mapping
  if (SECONDARY_EMOTIONS[lower as keyof typeof SECONDARY_EMOTIONS]) {
    const mapped = SECONDARY_EMOTIONS[lower as keyof typeof SECONDARY_EMOTIONS];
    if (mapped) {
      return {
        emotion: mapped,
        intensity: 6,
        clarity: 8,
        confidence: 0.85,
        keywords: [lower, "mapped_from_secondary"]
      };
    }
  }

  // Try to find partial matches
  for (const [emotion, data] of Object.entries(EMOTION_REGISTRY)) {
    if (data.keywords.some(kw => lower.includes(kw) || kw.includes(lower))) {
      return {
        emotion,
        intensity: 6,
        clarity: 7,
        confidence: 0.75,
        keywords: [lower]
      };
    }
  }

  return null;
}

/**
 * Detect emotion from voice transcript
 * Similar to text detection but may have speech recognition artifacts
 */
export function detectEmotionFromVoice(transcript: string): EmotionSignal | null {
  // Clean up common speech recognition artifacts
  let cleaned = transcript
    .toLowerCase()
    .replace(/\s+/g, " ") // normalize whitespace
    .replace(/[.,!?;:]/g, "") // remove punctuation
    .trim();

  // Remove filler words
  const fillers = ["um", "uh", "like", "you know", "i mean", "basically"];
  fillers.forEach(filler => {
    cleaned = cleaned.replace(new RegExp(`\\b${filler}\\b`, "g"), "");
  });

  return detectEmotionFromText(cleaned);
}

/**
 * Normalize multiple emotion signals (e.g., from a longer message)
 * Returns the dominant emotion
 */
export function normalizeEmotionSignals(signals: (EmotionSignal | null)[]): EmotionSignal | null {
  const validSignals = signals.filter((s): s is EmotionSignal => s !== null);

  if (validSignals.length === 0) {
    return null;
  }

  if (validSignals.length === 1) {
    return validSignals[0];
  }

  // If multiple emotions detected, weight by confidence and intensity
  const scored = validSignals.map(s => ({
    signal: s,
    score: s.confidence * (s.intensity / 10)
  }));

  scored.sort((a, b) => b.score - a.score);

  // Return the highest-scoring emotion, but average the intensity
  const dominant = scored[0].signal;
  const avgIntensity = Math.round(
    validSignals.reduce((sum, s) => sum + s.intensity, 0) / validSignals.length
  );

  return {
    ...dominant,
    intensity: avgIntensity,
    clarity: Math.min(10, dominant.clarity + 1) // multiple signals = more clarity
  };
}

/**
 * Get the registered emotions list
 * Useful for UI dropdowns or validation
 */
export function getRegisteredEmotions(): string[] {
  return Object.keys(EMOTION_REGISTRY);
}

/**
 * Validate that an emotion is registered
 */
export function isValidEmotion(emotion: string): boolean {
  return emotion in EMOTION_REGISTRY;
}

/**
 * Get emotion keywords for a specific emotion
 * Useful for debugging or UI display
 */
export function getEmotionKeywords(emotion: string): string[] {
  const data = EMOTION_REGISTRY[emotion as keyof typeof EMOTION_REGISTRY];
  return data ? data.keywords : [];
}

/**
 * Main detection function that handles all input types
 * This is the public API for the emotion detector
 */
export function detectEmotion(
  input: string,
  inputType: "text" | "voice" | "card" = "text"
): EmotionSignal | null {
  switch (inputType) {
    case "voice":
      return detectEmotionFromVoice(input);
    case "card":
      return detectEmotionFromCard(input);
    case "text":
    default:
      return detectEmotionFromText(input);
  }
}

/**
 * Format emotion signal for logging/debugging
 */
export function formatEmotionSignal(signal: EmotionSignal): string {
  return `[${signal.emotion.toUpperCase()}] intensity=${signal.intensity}/10 clarity=${signal.clarity}/10 confidence=${(signal.confidence * 100).toFixed(0)}%`;
}
