/**
 * Multi-Modal Input Handler
 * Accepts voice, text input, button clicks, and equipment inputs simultaneously.
 * Tracks which input method was used so the AI can respond appropriately.
 */

export type InputMethod = "voice" | "text" | "click" | "equipment";

export interface MultiModalInput {
  method: InputMethod;
  value: string; // The actual input (transcript, typed text, or button value)
  timestamp: number;
  confidence?: number; // For voice input
}

export interface MultiModalInputHandler {
  onInput: (input: MultiModalInput) => void;
  isListening: boolean;
  isWaitingForInput: boolean;
}

/**
 * Process multi-modal input and normalize it
 */
export function processMultiModalInput(input: MultiModalInput): string {
  const normalized = input.value.toLowerCase().trim();
  return normalized;
}

/**
 * Determine which input method was used and respond accordingly
 */
export function getInputMethodLabel(method: InputMethod): string {
  const labels: Record<InputMethod, string> = {
    voice: "heard you say",
    text: "read",
    click: "selected",
    equipment: "received from your device",
  };
  return labels[method];
}

/**
 * Create an AI response that acknowledges the input method
 */
export function createAcknowledgment(input: MultiModalInput): string {
  const methodLabel = getInputMethodLabel(input.method);
  return `I ${methodLabel}: "${input.value}". Let me confirm that's what you meant.`;
}

/**
 * Multi-modal input context for React components
 */
export interface MultiModalInputContext {
  registerVoiceHandler: (handler: (transcript: string) => void) => void;
  registerTextHandler: (handler: (text: string) => void) => void;
  registerClickHandler: (handler: (value: string) => void) => void;
  registerEquipmentHandler: (handler: (value: string) => void) => void;
  
  unregisterVoiceHandler: () => void;
  unregisterTextHandler: () => void;
  unregisterClickHandler: () => void;
  unregisterEquipmentHandler: () => void;
  
  emitInput: (input: MultiModalInput) => void;
  
  isListening: boolean;
  lastInput: MultiModalInput | null;
}

/**
 * Create a multi-modal input context manager
 */
export function createMultiModalInputContext(): MultiModalInputContext {
  let voiceHandler: ((transcript: string) => void) | null = null;
  let textHandler: ((text: string) => void) | null = null;
  let clickHandler: ((value: string) => void) | null = null;
  let equipmentHandler: ((value: string) => void) | null = null;
  let isListening = false;
  let lastInput: MultiModalInput | null = null;

  return {
    registerVoiceHandler: (handler) => {
      voiceHandler = handler;
      isListening = true;
    },
    registerTextHandler: (handler) => {
      textHandler = handler;
    },
    registerClickHandler: (handler) => {
      clickHandler = handler;
    },
    registerEquipmentHandler: (handler) => {
      equipmentHandler = handler;
    },

    unregisterVoiceHandler: () => {
      voiceHandler = null;
      isListening = false;
    },
    unregisterTextHandler: () => {
      textHandler = null;
    },
    unregisterClickHandler: () => {
      clickHandler = null;
    },
    unregisterEquipmentHandler: () => {
      equipmentHandler = null;
    },

    emitInput: (input: MultiModalInput) => {
      lastInput = input;
      
      switch (input.method) {
        case "voice":
          voiceHandler?.(input.value);
          break;
        case "text":
          textHandler?.(input.value);
          break;
        case "click":
          clickHandler?.(input.value);
          break;
        case "equipment":
          equipmentHandler?.(input.value);
          break;
      }
    },

    get isListening() {
      return isListening;
    },
    get lastInput() {
      return lastInput;
    },
  };
}
