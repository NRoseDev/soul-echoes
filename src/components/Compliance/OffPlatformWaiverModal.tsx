import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
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

export const OffPlatformWaiverModal: React.FC<OffPlatformWaiverModalProps> = ({
  isOpen,
  practitionerName,
  onSigned,
  onRejected,
}) => {
  const sigRef = useRef<SignatureCanvas>(null);
  const [acknowledgments, setAcknowledgments] = useState({
    leavingSafeSpace: false,
    releasingPlatform: false,
    noLiability: false,
    privateAgreement: false,
  });
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const manager = new LiabilityWaiverManager();

  if (!isOpen) return null;

  const waiverText = manager.generateWaiverText(practitionerName);
  const allAcknowledged = Object.values(acknowledgments).every(Boolean);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const isAtBottom =
      element.scrollHeight - element.scrollTop === element.clientHeight;
    setScrolledToBottom(isAtBottom);
  };

  const handleSign = async () => {
    if (!sigRef.current) return;

    const signatureData = sigRef.current.toDataURL("image/png");
    const waiver = await manager.initiateWaiver(
      "", // Will be user ID from context
      "", // Will be practitioner ID
      practitionerName
    );

    const signedWaiver = await manager.signWaiver(
      waiver,
      signatureData,
      "0.0.0.0", // Will get actual IP
      navigator.userAgent,
      acknowledgments
    );

    onSigned(signedWaiver);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-3xl max-h-[90vh] flex flex-col bg-white rounded-lg shadow-2xl">
        {/* Header */}
        <div className="border-b border-slate-200 bg-gradient-to-r from-rose-50 to-orange-50 p-6">
          <h2 className="text-2xl font-bold text-rose-900">⚠️ Important: Off-Platform Services Waiver</h2>
          <p className="mt-2 text-sm text-rose-700">
            By continuing, you are leaving Soul Echoes and entering a private agreement.
          </p>
        </div>

        {/* Waiver Text */}
        <div
          className="flex-1 overflow-y-auto p-6 bg-slate-50 font-mono text-sm"
          onScroll={handleScroll}
        >
          <pre className="whitespace-pre-wrap text-slate-700">{waiverText}</pre>
        </div>

        {/* Acknowledgments */}
        <div className="border-t border-slate-200 bg-white p-6 space-y-4">
          <Alert className="border-amber-300 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-900">
              You must acknowledge all statements below to proceed.
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
              <label htmlFor="leaving" className="text-sm text-slate-700 cursor-pointer">
                ✓ I acknowledge I am leaving the Soul Echoes safe space and platform protections
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
              <label htmlFor="private" className="text-sm text-slate-700 cursor-pointer">
                ✓ I am entering a separate, private agreement with {practitionerName}
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
              <label htmlFor="release" className="text-sm text-slate-700 cursor-pointer">
                ✓ I fully release Soul Echoes and Rise Up Healing from ALL liability
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
              <label htmlFor="liability" className="text-sm text-slate-700 cursor-pointer">
                ✓ I assume full responsibility for my own safety and outcomes
              </label>
            </div>
          </div>
        </div>

        {/* Signature Pad */}
        <div className="border-t border-slate-200 bg-white p-6 space-y-3">
          <label className="block text-sm font-semibold text-slate-900">
            Digital Signature *
          </label>
          <div className="border-2 border-dashed border-slate-300 rounded-lg bg-slate-50">
            <SignatureCanvas
              ref={sigRef}
              canvasProps={{
                className: "w-full h-32 rounded-lg",
              }}
              backgroundColor="rgb(248, 250, 252)"
              penColor="rgb(15, 23, 42)"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => sigRef.current?.clear()}
            className="text-xs"
          >
            Clear Signature
          </Button>
        </div>

        {/* Actions */}
        <div className="border-t border-slate-200 bg-slate-50 p-6 flex gap-3">
          <Button
            variant="outline"
            onClick={onRejected}
            className="flex-1"
          >
            I Do Not Agree - Return to Platform
          </Button>
          <Button
            onClick={handleSign}
            disabled={!allAcknowledged || !scrolledToBottom}
            className="flex-1 bg-gradient-to-r from-rose-500 to-orange-500 text-white hover:from-rose-600 hover:to-orange-600"
          >
            I Understand & Sign Waiver
          </Button>
        </div>
      </div>
    </div>
  );
};
