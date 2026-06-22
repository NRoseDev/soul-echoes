import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { LiabilityWaiverManager } from "@/services/compliance/LiabilityWaiverManager";
import { OffPlatformWaiver } from "@/types/compliance";

interface OffPlatformWaiverModalProps {
  isOpen: boolean;
  practitionerName: string;
  onSigned: (waiver: OffPlatformWaiver) => void;
  onRejected: () => void;
}

/**
 * Mandatory Off-Platform User Waiver
 * Freezes navigation and deploys digital contract when user exits Soul Echoes
 * to work with a practitioner under external fees
 */
export const OffPlatformWaiverModal: React.FC<OffPlatformWaiverModalProps> = ({
  isOpen,
  practitionerName,
  onSigned,
  onRejected,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [acknowledgments, setAcknowledgments] = useState({
    leavingSafeSpace: false,
    releasingPlatform: false,
    noLiability: false,
    privateAgreement: false,
  });
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const manager = new LiabilityWaiverManager();

  if (!isOpen) return null;

  const waiverText = manager.generateWaiverText(practitionerName);
  const allAcknowledged = Object.values(acknowledgments).every(Boolean);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const isAtBottom =
      element.scrollHeight - element.scrollTop <= element.clientHeight + 10;
    setScrolledToBottom(isAtBottom);
  };

  const handleSign = async () => {
    if (!allAcknowledged) {
      alert("You must acknowledge all statements to sign the waiver.");
      return;
    }

    setIsSigning(true);
    try {
      const waiver = await manager.initiateWaiver(
        "", // Will be user ID from context
        "", // Will be practitioner ID
        practitionerName
      );

      // Generate signature (in production, use digital signature pad)
      const signatureData = `signature-${Date.now()}`;

      const signedWaiver = await manager.signWaiver(
        waiver,
        signatureData,
        "0.0.0.0", // Will get actual IP
        navigator.userAgent,
        acknowledgments
      );

      onSigned(signedWaiver);
    } catch (error) {
      alert("Error signing waiver. Please try again.");
      console.error(error);
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-2xl my-8">
        {/* Header */}
        <div className="border-b border-slate-200 bg-gradient-to-r from-rose-50 to-orange-50 p-6 sticky top-0">
          <h2 className="text-2xl font-bold text-rose-900 flex items-center gap-2">
            <AlertTriangle className="h-6 w-6" />
            Off-Platform Services Liability Release
          </h2>
          <p className="mt-2 text-sm text-rose-700">
            You are leaving Soul Echoes. Please read and sign this waiver.
          </p>
        </div>

        {/* Scrollable Waiver Text */}
        <div
          className="max-h-96 overflow-y-auto p-6 bg-slate-50 font-mono text-sm border-b border-slate-200"
          onScroll={handleScroll}
        >
          <pre className="whitespace-pre-wrap text-slate-700">{waiverText}</pre>
        </div>

        {/* Acknowledgments */}
        <div className="border-b border-slate-200 bg-white p-6 space-y-4">
          <Alert className="border-amber-300 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-900 text-sm">
              <strong>You must confirm all statements below to proceed.</strong> This is a legally
              binding release of liability.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Checkbox
                id="leaving"
                checked={acknowledgments.leavingSafeSpace}
                onCheckedChange={(checked) =>
                  setAcknowledgments((prev) => ({
                    ...prev,
                    leavingSafeSpace: checked as boolean,
                  }))
                }
                className="mt-1"
              />
              <label htmlFor="leaving" className="text-sm text-slate-700 cursor-pointer leading-relaxed">
                <strong>✓ I acknowledge</strong> I am leaving the Soul Echoes safe space and
                platform protections, including pricing oversight and dispute resolution.
              </label>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="private"
                checked={acknowledgments.privateAgreement}
                onCheckedChange={(checked) =>
                  setAcknowledgments((prev) => ({
                    ...prev,
                    privateAgreement: checked as boolean,
                  }))
                }
                className="mt-1"
              />
              <label htmlFor="private" className="text-sm text-slate-700 cursor-pointer leading-relaxed">
                <strong>✓ I confirm</strong> I am entering a separate, private agreement with{" "}
                <strong>{practitionerName}</strong> outside the Soul Echoes ecosystem. Soul Echoes
                will not monitor, oversee, or regulate this private arrangement.
              </label>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="release"
                checked={acknowledgments.releasingPlatform}
                onCheckedChange={(checked) =>
                  setAcknowledgments((prev) => ({
                    ...prev,
                    releasingPlatform: checked as boolean,
                  }))
                }
                className="mt-1"
              />
              <label htmlFor="release" className="text-sm text-slate-700 cursor-pointer leading-relaxed">
                <strong>✓ I fully release</strong> Soul Echoes, the Rise Up Healing 501(c)(3)
                nonprofit, and all platform personnel from <strong>ALL liability</strong>
                —financial, physical, emotional, psychological, legal, and otherwise—arising from
                my private engagement with this practitioner.
              </label>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="liability"
                checked={acknowledgments.noLiability}
                onCheckedChange={(checked) =>
                  setAcknowledgments((prev) => ({
                    ...prev,
                    noLiability: checked as boolean,
                  }))
                }
                className="mt-1"
              />
              <label htmlFor="liability" className="text-sm text-slate-700 cursor-pointer leading-relaxed">
                <strong>✓ I assume full responsibility</strong> for my own safety, wellbeing,
                vetting the practitioner, negotiating terms, and seeking legal recourse
                separately if disputes arise. Soul Echoes will not intervene.
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-slate-50 p-6 flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={onRejected}
            className="flex-1"
            disabled={isSigning}
          >
            I Do Not Agree - Return to Soul Echoes
          </Button>
          <Button
            onClick={handleSign}
            disabled={!allAcknowledged || !scrolledToBottom || isSigning}
            className="flex-1 bg-gradient-to-r from-rose-500 to-orange-500 text-white hover:from-rose-600 hover:to-orange-600 disabled:opacity-50"
          >
            {isSigning ? "Signing..." : "I Understand & Agree - Sign Waiver"}
          </Button>
        </div>

        {/* Scroll reminder */}
        {!scrolledToBottom && (
          <div className="bg-amber-100 border-t border-amber-200 px-6 py-3 text-center text-sm text-amber-900">
            ⬇️ Please scroll to the bottom and read the entire waiver before signing.
          </div>
        )}
      </div>
    </div>
  );
};
