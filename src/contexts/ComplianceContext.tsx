import React, { createContext, useContext, useState, ReactNode } from "react";
import { ComplianceViolation, ShadyBusinessReport } from "@/types/compliance";
import { ComplianceEngine } from "@/services/compliance/ComplianceEngine";
import { DisciplinaryLedger } from "@/services/compliance/DisciplinaryLedger";

interface ComplianceContextType {
  flaggedViolations: ComplianceViolation[];
  bannnedPractitioners: string[];
  addViolation: (violation: ComplianceViolation) => void;
  removeViolation: (violationId: string) => void;
  isBanned: (practitionerId: string) => boolean;
  getViolationsByPractitioner: (practitionerId: string) => ComplianceViolation[];
}

const ComplianceContext = createContext<ComplianceContextType | undefined>(undefined);

export const ComplianceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [flaggedViolations, setFlaggedViolations] = useState<ComplianceViolation[]>([]);
  const [bannedPractitioners, setBannedPractitioners] = useState<string[]>([]);
  const complianceEngine = new ComplianceEngine();
  const disciplinaryLedger = new DisciplinaryLedger();

  // Load banned practitioners on mount
  React.useEffect(() => {
    const loadBannedPractitioners = async () => {
      const records = await disciplinaryLedger.getPublicDisciplinaryLedger();
      setBannedPractitioners(records.map((r) => r.practitionerId || ""));
    };
    loadBannedPractitioners();
  }, []);

  const addViolation = (violation: ComplianceViolation) => {
    setFlaggedViolations((prev) => [...prev, violation]);
  };

  const removeViolation = (violationId: string) => {
    setFlaggedViolations((prev) => prev.filter((v) => v.id !== violationId));
  };

  const isBanned = (practitionerId: string): boolean => {
    return bannedPractitioners.includes(practitionerId);
  };

  const getViolationsByPractitioner = (practitionerId: string): ComplianceViolation[] => {
    return flaggedViolations.filter((v) => v.practitionerId === practitionerId);
  };

  return (
    <ComplianceContext.Provider
      value={{
        flaggedViolations,
        bannnedPractitioners: bannedPractitioners,
        addViolation,
        removeViolation,
        isBanned,
        getViolationsByPractitioner,
      }}
    >
      {children}
    </ComplianceContext.Provider>
  );
};

export const useCompliance = () => {
  const context = useContext(ComplianceContext);
  if (!context) {
    throw new Error("useCompliance must be used within ComplianceProvider");
  }
  return context;
};
