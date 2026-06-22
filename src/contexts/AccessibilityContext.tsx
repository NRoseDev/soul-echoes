import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { AccessibilityInputConfig, AccessibilityModality } from "@/types/accessibility";
import { useAuth } from "@/contexts/AuthContext";

interface AccessibilityContextType {
  config: AccessibilityInputConfig;
  updateConfig: (partial: Partial<AccessibilityInputConfig>) => void;
  setPreferredModality: (modality: AccessibilityModality) => void;
  enableModality: (modality: AccessibilityModality) => void;
  disableModality: (modality: AccessibilityModality) => void;
  isModalityEnabled: (modality: AccessibilityModality) => boolean;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [config, setConfig] = useState<AccessibilityInputConfig>({
    enabledModalities: [AccessibilityModality.TYPING],
    preferredModality: AccessibilityModality.TYPING,
    screenReaderEnabled: false,
    brailleDisplayConnected: false,
    eyeTrackerCalibrated: false,
    aacDeviceConnected: false,
    voiceInputLanguage: "en-US",
    signLanguageModel: "asl",
    brailleGrade: "2",
  });

  // Load user's accessibility preferences from localStorage
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`a11y-config-${user.id}`);
      if (saved) {
        try {
          setConfig(JSON.parse(saved));
        } catch (error) {
          console.error("Error loading accessibility config:", error);
        }
      }
    }
  }, [user]);

  const updateConfig = (partial: Partial<AccessibilityInputConfig>) => {
    setConfig((prev) => {
      const updated = { ...prev, ...partial };
      if (user) {
        localStorage.setItem(`a11y-config-${user.id}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const setPreferredModality = (modality: AccessibilityModality) => {
    updateConfig({ preferredModality: modality });
  };

  const enableModality = (modality: AccessibilityModality) => {
    setConfig((prev) => {
      if (!prev.enabledModalities.includes(modality)) {
        const updated = {
          ...prev,
          enabledModalities: [...prev.enabledModalities, modality],
        };
        if (user) {
          localStorage.setItem(`a11y-config-${user.id}`, JSON.stringify(updated));
        }
        return updated;
      }
      return prev;
    });
  };

  const disableModality = (modality: AccessibilityModality) => {
    setConfig((prev) => {
      const updated = {
        ...prev,
        enabledModalities: prev.enabledModalities.filter((m) => m !== modality),
      };
      if (user) {
        localStorage.setItem(`a11y-config-${user.id}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const isModalityEnabled = (modality: AccessibilityModality): boolean => {
    return config.enabledModalities.includes(modality);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        config,
        updateConfig,
        setPreferredModality,
        enableModality,
        disableModality,
        isModalityEnabled,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within AccessibilityProvider");
  }
  return context;
};
