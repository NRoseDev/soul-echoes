/**
 * Waiting Cues System
 * Provides auditory and visual feedback to signal when the app is waiting for user input.
 * Designed for accessibility: works for blind users (sound), deaf users (visual), and all others.
 */

export type CueType = "ready" | "listening" | "processing" | "error";

interface CueConfig {
  sound?: string; // URL or data URI for audio
  duration: number; // milliseconds
  frequency?: number; // Hz for tone generation
}

const CUE_CONFIGS: Record<CueType, CueConfig> = {
  ready: {
    duration: 200,
    frequency: 800, // Higher pitch = "ready"
  },
  listening: {
    duration: 100,
    frequency: 600, // Medium pitch = "listening"
  },
  processing: {
    duration: 150,
    frequency: 500, // Lower pitch = "processing"
  },
  error: {
    duration: 300,
    frequency: 300, // Low pitch = "error"
  },
};

let audioContextRef: AudioContext | null = null;

/**
 * Play an auditory cue (tone) to signal state
 * For blind users, this is the primary feedback mechanism
 */
export function playAuditoryCue(type: CueType): Promise<void> {
  return new Promise((resolve) => {
    try {
      const config = CUE_CONFIGS[type];
      const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) {
        resolve();
        return;
      }

      if (!audioContextRef) {
        audioContextRef = new AudioCtx();
      }

      const ctx = audioContextRef;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.frequency.value = config.frequency || 600;
      osc.type = "sine";

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + config.duration / 1000);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + config.duration / 1000);

      setTimeout(resolve, config.duration);
    } catch {
      resolve();
    }
  });
}

/**
 * Visual cue component context
 * Used to signal visual feedback for deaf and hard-of-hearing users
 */
export interface VisualCueState {
  type: CueType | null;
  intensity: number; // 0-1
  isActive: boolean;
}

export const VISUAL_CUE_COLORS: Record<CueType, string> = {
  ready: "bg-green-500/30 border-green-400",
  listening: "bg-blue-500/30 border-blue-400",
  processing: "bg-purple-500/30 border-purple-400",
  error: "bg-red-500/30 border-red-400",
};

export const VISUAL_CUE_LABELS: Record<CueType, string> = {
  ready: "Ready to listen",
  listening: "Listening…",
  processing: "Processing…",
  error: "Try again",
};

/**
 * Emit a visual cue event that components can listen to
 */
export function emitVisualCue(type: CueType, duration: number = 1000) {
  window.dispatchEvent(
    new CustomEvent("soul-echoes-visual-cue", {
      detail: { type, duration },
    })
  );
}

/**
 * Combined cue: play sound AND emit visual cue
 * This ensures all users are informed, regardless of ability
 */
export async function playCue(type: CueType, visualDuration: number = 1000) {
  emitVisualCue(type, visualDuration);
  await playAuditoryCue(type);
}
