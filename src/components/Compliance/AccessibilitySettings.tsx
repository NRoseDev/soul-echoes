import React from "react";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { AccessibilityModality } from "@/types/accessibility";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Keyboard,
  Mic,
  Hand,
  Eye,
  Radio,
  Volume2,
  Settings,
} from "lucide-react";
import { Card } from "@/components/ui/card";

export const AccessibilitySettings: React.FC = () => {
  const {
    config,
    updateConfig,
    setPreferredModality,
    enableModality,
    disableModality,
    isModalityEnabled,
  } = useAccessibility();

  const modalities = [
    {
      id: AccessibilityModality.TYPING,
      name: "Typing",
      icon: Keyboard,
      description: "Enter text using keyboard",
    },
    {
      id: AccessibilityModality.VOICE,
      name: "Voice (Speech-to-Text)",
      icon: Mic,
      description: "Speak to input text",
    },
    {
      id: AccessibilityModality.SIGNING,
      name: "Sign Language",
      icon: Hand,
      description: "Use camera-based sign language recognition",
    },
    {
      id: AccessibilityModality.EYE_TRACKING,
      name: "Eye Tracking",
      icon: Eye,
      description: "Navigate using eye movements",
    },
    {
      id: AccessibilityModality.AAC_SWITCHES,
      name: "AAC Device",
      icon: Radio,
      description: "Augmentative & Alternative Communication device",
    },
    {
      id: AccessibilityModality.BRAILLE,
      name: "Refreshable Braille Display",
      icon: Volume2,
      description: "Tactile Braille input and output",
    },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Settings className="h-8 w-8 text-slate-900" />
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Accessibility Settings</h1>
          <p className="text-sm text-slate-600">
            Configure universal input and output modalities for your preferred interaction style.
          </p>
        </div>
      </div>

      {/* Preferred Modality */}
      <Card className="p-6 border-2 border-indigo-200 bg-indigo-50">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Preferred Input Method</h2>
        <Select value={config.preferredModality} onValueChange={setPreferredModality}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {modalities.map((m) => (
              <SelectItem key={m.id} value={m.id}>
                {m.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-indigo-700 mt-3">
          This will be your default input method across all Soul Echoes rooms.
        </p>
      </Card>

      {/* Enabled Modalities */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Available Input Modalities</h2>
        <div className="space-y-3">
          {modalities.map((modality) => {
            const Icon = modality.icon;
            const isEnabled = isModalityEnabled(modality.id);

            return (
              <div
                key={modality.id}
                className="flex items-start gap-3 p-4 rounded-lg border border-slate-200 hover:bg-slate-50"
              >
                <Checkbox
                  id={modality.id}
                  checked={isEnabled}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      enableModality(modality.id);
                    } else {
                      disableModality(modality.id);
                    }
                  }}
                  className="mt-1"
                />
                <div className="flex-1">
                  <label
                    htmlFor={modality.id}
                    className="flex items-center gap-2 font-semibold text-slate-900 cursor-pointer"
                  >
                    <Icon className="h-5 w-5" />
                    {modality.name}
                  </label>
                  <p className="text-sm text-slate-600 mt-1">{modality.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Screen Reader */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Screen Reader Support</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-slate-900">Enable Screen Reader</p>
            <p className="text-sm text-slate-600">Output will include audio narration</p>
          </div>
          <Checkbox
            id="screenReader"
            checked={config.screenReaderEnabled}
            onCheckedChange={(checked) =>
              updateConfig({ screenReaderEnabled: checked as boolean })
            }
          />
        </div>
      </Card>

      {/* Voice Input Language */}
      {isModalityEnabled(AccessibilityModality.VOICE) && (
        <Card className="p-6 border-2 border-blue-200 bg-blue-50">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Voice Input Language</h2>
          <Select
            value={config.voiceInputLanguage}
            onValueChange={(value) =>
              updateConfig({ voiceInputLanguage: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en-US">English (US)</SelectItem>
              <SelectItem value="en-GB">English (UK)</SelectItem>
              <SelectItem value="es-ES">Spanish</SelectItem>
              <SelectItem value="fr-FR">French</SelectItem>
              <SelectItem value="de-DE">German</SelectItem>
              <SelectItem value="ja-JP">Japanese</SelectItem>
              <SelectItem value="zh-CN">Mandarin Chinese</SelectItem>
            </SelectContent>
          </Select>
        </Card>
      )}

      {/* Braille Settings */}
      {isModalityEnabled(AccessibilityModality.BRAILLE) && (
        <Card className="p-6 border-2 border-amber-200 bg-amber-50">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Braille Display Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-900 block mb-2">
                Braille Grade
              </label>
              <Select
                value={config.brailleGrade || "2"}
                onValueChange={(value) =>
                  updateConfig({ brailleGrade: value as "1" | "2" })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Grade 1 (Uncontracted)</SelectItem>
                  <SelectItem value="2">Grade 2 (Contracted)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900">Braille Display Connected</p>
                <p className="text-sm text-slate-600">Physical refreshable Braille display</p>
              </div>
              <Checkbox
                id="brailleConnected"
                checked={config.brailleDisplayConnected}
                onCheckedChange={(checked) =>
                  updateConfig({ brailleDisplayConnected: checked as boolean })
                }
              />
            </div>
          </div>
        </Card>
      )}

      {/* Save Notice */}
      <div className="rounded-lg border-2 border-green-200 bg-green-50 p-4 text-sm text-green-900">
        ✓ Your accessibility preferences are automatically saved and will follow you across all
        Soul Echoes rooms.
      </div>
    </div>
  );
};
