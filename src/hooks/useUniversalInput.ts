import { useState, useCallback } from "react";
import { AccessibilityManager } from "@/services/accessibility/AccessibilityManager";
import { UniversalInput, AccessibilityModality } from "@/types/accessibility";

export const useUniversalInput = (accessibilityConfig?: any) => {
  const [input, setInput] = useState<UniversalInput | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const manager = new AccessibilityManager(accessibilityConfig);

  const captureInput = useCallback(
    async (modality: AccessibilityModality) => {
      setIsCapturing(true);
      setError(null);
      try {
        let result: UniversalInput;

        switch (modality) {
          case AccessibilityModality.VOICE:
            const audioBlob = await recordAudio();
            result = await manager.captureVoiceInput(audioBlob);
            break;
          case AccessibilityModality.SIGNING:
            const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
            result = await manager.captureSignInput(videoStream);
            break;
          case AccessibilityModality.EYE_TRACKING:
            result = await manager.captureEyeTrackingInput([]);
            break;
          case AccessibilityModality.AAC_SWITCHES:
            result = await manager.captureAACInput();
            break;
          case AccessibilityModality.BRAILLE:
            result = await manager.captureBrailleInput();
            break;
          case AccessibilityModality.TYPING:
          default:
            result = { content: "", inputModality: modality, timestamp: new Date() };
        }

        setInput(result);
        return result;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error";
        setError(errorMsg);
        console.error("Error capturing input:", err);
      } finally {
        setIsCapturing(false);
      }
    },
    [manager]
  );

  const clearInput = useCallback(() => {
    setInput(null);
    setError(null);
  }, []);

  return { input, captureInput, isCapturing, error, clearInput };
};

async function recordAudio(): Promise<Blob> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mediaRecorder = new MediaRecorder(stream);
  const chunks: BlobPart[] = [];

  return new Promise((resolve, reject) => {
    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: "audio/webm" });
      stream.getTracks().forEach((track) => track.stop());
      resolve(blob);
    };
    mediaRecorder.onerror = (e) => reject(e.error);

    mediaRecorder.start();
    setTimeout(() => mediaRecorder.stop(), 5000); // 5 second recording max
  });
}
