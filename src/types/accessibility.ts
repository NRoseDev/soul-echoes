// Universal Input & Output Protocols
// Required in ALL Rooms: Typing, Voice, Signing, Pointing, AAC, Eye-Tracking, Braille

export enum AccessibilityModality {
  TYPING = "typing",
  VOICE = "voice",
  SIGNING = "signing",
  POINTING = "pointing",
  AAC_SWITCHES = "aac_switches",
  EYE_TRACKING = "eye_tracking",
  BRAILLE = "braille",
}

export interface AccessibilityInputConfig {
  enabledModalities: AccessibilityModality[];
  preferredModality: AccessibilityModality;
  screenReaderEnabled: boolean;
  brailleDisplayConnected: boolean;
  eyeTrackerCalibrated: boolean;
  aacDeviceConnected: boolean;
  voiceInputLanguage: string;
  signLanguageModel: "asl" | "bsl" | "jsl" | "other";
  pointingDeviceType?: "mouse" | "touchscreen" | "stylus" | "other";
  brailleGrade?: "1" | "2"; // Grade 1 = Uncontracted, Grade 2 = Contracted
}

export interface UniversalInput {
  content: string;
  inputModality: AccessibilityModality;
  timestamp: Date;
  metadata?: Record<string, any>;
  encryptedPayload?: string; // For end-to-end encryption
}

export interface UniversalOutput {
  text: string;
  audioUrl?: string; // For screen readers
  brailleString?: string; // For refreshable Braille display
  semanticMarkup: string; // ARIA-enhanced HTML
  visualDescription?: string; // Alt text for images
}

export interface AccessibilitySession {
  userId: string;
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  primaryModality: AccessibilityModality;
  secondaryModalities: AccessibilityModality[];
  assistiveDevicesUsed: string[];
  customizations: Record<string, any>;
}
