import React, { useRef, useState } from "react";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useUniversalInput } from "@/hooks/useUniversalInput";
import { useEncryptedStorage } from "@/hooks/useEncryptedStorage";
import { AccessibilityModality } from "@/types/accessibility";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Hand, Eye, Keyboard, Lock, Loader } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

/**
 * Universal Brain Dump Room
 * Supports all accessibility modalities with end-to-end encryption
 */
export const BrainDump: React.FC = () => {
  const { config, isModalityEnabled } = useAccessibility();
  const { captureInput, isCapturing, error } = useUniversalInput(config);
  const { encryptAndStore, isInitialized } = useEncryptedStorage();
  const [brainDumpContent, setBrainDumpContent] = useState("");
  const [selectedModality, setSelectedModality] = useState<AccessibilityModality>(
    config.preferredModality
  );
  const [saving, setSaving] = useState(false);
  const [lastSave, setLastSave] = useState<Date | null>(null);

  const handleInputCapture = async (modality: AccessibilityModality) => {
    setSelectedModality(modality);
    const input = await captureInput(modality);
    if (input) {
      setBrainDumpContent((prev) => (prev ? prev + "\n\n" + input.content : input.content));
    }
  };

  const handleSave = async () => {
    if (!brainDumpContent.trim()) {
      alert("Please enter something to save.");
      return;
    }

    if (!isInitialized) {
      alert("Encryption not initialized. Please set up your encryption password first.");
      return;
    }

    setSaving(true);
    try {
      const timestamp = new Date().toISOString();
      const storageKey = `brain-dump-${timestamp}`;
      await encryptAndStore(brainDumpContent, storageKey);
      setLastSave(new Date());
      setBrainDumpContent("");
    } catch (err) {
      console.error("Save error:", err);
      alert("Error saving entry. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const accessibilityButtons = [
    {
      id: AccessibilityModality.TYPING,
      icon: Keyboard,
      label: "Type",
      description: "Enter text",
    },
    {
      id: AccessibilityModality.VOICE,
      icon: Mic,
      label: "Speak",
      description: "Voice to text",
    },
    {
      id: AccessibilityModality.SIGNING,
      icon: Hand,
      label: "Sign",
      description: "Sign language",
    },
    {
      id: AccessibilityModality.EYE_TRACKING,
      icon: Eye,
      label: "Eye Track",
      description: "Eye movement",
    },
  ].filter((btn) => isModalityEnabled(btn.id));

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b-2 border-indigo-200 pb-6">
        <h1 className="text-4xl font-bold text-slate-900">💭 Brain Dump</h1>
        <p className="mt-2 text-slate-600 text-lg">
          Empty your mind. No judgment. No limits. Always free and encrypted.
        </p>
      </div>

      {/* Encryption Status */}
      <Alert
        className={`border-2 ${
          isInitialized
            ? "border-green-300 bg-green-50"
            : "border-amber-300 bg-amber-50"
        }`}
      >
        <Lock className={`h-4 w-4 ${
          isInitialized ? "text-green-600" : "text-amber-600"
        }`} />
        <AlertDescription className={isInitialized ? "text-green-900" : "text-amber-900"}>
          {isInitialized ? (
            <>
              <strong>✓ End-to-End Encrypted:</strong> Your entries are encrypted locally before
              storage. Developers cannot access them.
            </>
          ) : (
            <>
              <strong>⚠️ Encryption Pending:</strong> Set up your encryption password in Settings
              to enable secure storage.
            </>
          )}
        </AlertDescription>
      </Alert>

      {/* Accessibility Modality Selector */}
      {accessibilityButtons.length > 0 && (
        <div className="rounded-lg border-2 border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-900 mb-3">Input Method:</p>
          <div className="flex flex-wrap gap-2">
            {accessibilityButtons.map(({ id, icon: Icon, label, description }) => (
              <Button
                key={id}
                variant={selectedModality === id ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  id === AccessibilityModality.TYPING
                    ? setSelectedModality(id)
                    : handleInputCapture(id)
                }
                disabled={isCapturing && id !== AccessibilityModality.TYPING}
                className="gap-2 flex flex-col items-center h-auto py-2 px-3"
                aria-pressed={selectedModality === id}
                title={description}
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs">{label}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <Alert className="border-2 border-red-300 bg-red-50">
          <AlertDescription className="text-red-900">
            <strong>Error:</strong> {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Text Input Area */}
      <div className="space-y-2">
        <label htmlFor="brain-dump-textarea" className="block text-sm font-semibold text-slate-900">
          Your Thoughts
        </label>
        <Textarea
          id="brain-dump-textarea"
          value={brainDumpContent}
          onChange={(e) => setBrainDumpContent(e.target.value)}
          placeholder="What's on your mind? Type, speak, sign, or use assistive devices..."
          className="min-h-64 text-base focus:ring-2 focus:ring-indigo-500"
          aria-label="Brain dump text area"
        />
        <div className="flex justify-between items-center text-xs text-slate-600">
          <span>{brainDumpContent.length} characters</span>
          {lastSave && (
            <span className="text-green-600">
              ✓ Last saved: {lastSave.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-3">
        <Button
          onClick={handleSave}
          disabled={saving || !isInitialized}
          size="lg"
          className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 gap-2"
        >
          {saving ? (
            <>
              <Loader className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Lock className="h-4 w-4" />
              Save Entry (Encrypted)
            </>
          )}
        </Button>
        <Button
          onClick={() => setBrainDumpContent("")}
          variant="outline"
          size="lg"
          disabled={!brainDumpContent.trim()}
        >
          Clear
        </Button>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-slate-200">
        <div className="rounded-lg bg-indigo-50 p-4 border border-indigo-200">
          <p className="font-semibold text-indigo-900 mb-1">♾️ Unlimited Entries</p>
          <p className="text-sm text-indigo-700">Save as many brain dumps as you want, forever free.</p>
        </div>
        <div className="rounded-lg bg-green-50 p-4 border border-green-200">
          <p className="font-semibold text-green-900 mb-1">🔒 100% Private</p>
          <p className="text-sm text-green-700">Zero-knowledge encryption. No one can access your thoughts.</p>
        </div>
        <div className="rounded-lg bg-purple-50 p-4 border border-purple-200">
          <p className="font-semibold text-purple-900 mb-1">♿ Fully Accessible</p>
          <p className="text-sm text-purple-700">Use typing, voice, sign language, or any assistive device.</p>
        </div>
      </div>
    </div>
  );
};
