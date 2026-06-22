import React, { useState } from "react";
import { ShadyBusinessReport, PractitionerViolationType, ReportStatus } from "@/types/compliance";
import { DisciplinaryLedger } from "@/services/compliance/DisciplinaryLedger";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shield, Lock, AlertTriangle, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ShadyBusinessReportingPortalProps {
  onReportSubmitted?: (report: ShadyBusinessReport) => void;
}

/**
 * Shady Business Reporting Portal
 * Anonymous reporting system for users to report practitioner violations
 * Evidence feeds into disciplinary system
 */
export const ShadyBusinessReportingPortal: React.FC<
  ShadyBusinessReportingPortalProps
> = ({ onReportSubmitted }) => {
  const [formData, setFormData] = useState({
    practitionerName: "",
    violationType: "" as PractitionerViolationType | "",
    description: "",
    dateOfIncident: new Date().toISOString().split("T")[0],
    anonymous: true,
    consent: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [confirmationCode] = useState(`RPT-${Date.now()}`);
  const ledger = new DisciplinaryLedger();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.consent) {
      alert("You must agree to the investigation consent.");
      return;
    }

    if (!formData.violationType) {
      alert("Please select a violation type.");
      return;
    }

    setSubmitting(true);
    try {
      const report = await ledger.submitShadyBusinessReport(
        "", // Reporter ID (empty if anonymous)
        "", // Practitioner ID (will be looked up)
        formData.practitionerName,
        formData.violationType as PractitionerViolationType,
        formData.description,
        [], // Evidence files would be uploaded separately
        new Date(formData.dateOfIncident),
        formData.anonymous
      );

      setSubmitted(true);
      onReportSubmitted?.(report);

      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          practitionerName: "",
          violationType: "",
          description: "",
          dateOfIncident: new Date().toISOString().split("T")[0],
          anonymous: true,
          consent: false,
        });
        setSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Error submitting report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-lg border-2 border-green-200 bg-green-50 p-8 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-green-900 mb-2">Thank You for Reporting</h2>
        <p className="text-green-800 mb-4">
          Your report has been submitted and will be reviewed within 48 hours by our admin team.
        </p>
        <div className="bg-white rounded-lg p-4 mb-4 border border-green-300 text-left">
          <p className="text-sm text-slate-700 mb-2">
            <strong>Confirmation Code:</strong>
          </p>
          <p className="font-mono text-lg font-bold text-green-600">{confirmationCode}</p>
          <p className="text-xs text-slate-600 mt-2">Keep this code for your records.</p>
        </div>
        <p className="text-sm text-green-700">
          {formData.anonymous
            ? "🔒 Your identity is completely protected. You will not be contacted."
            : "📧 Updates will be sent to your account email."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="border-b-2 border-rose-200 pb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2 text-slate-900">
          <AlertTriangle className="h-8 w-8 text-rose-500" />
          Report Shady Business Practices
        </h1>
        <p className="mt-2 text-slate-600">
          Help protect the Soul Echoes community by reporting practitioners who violate our
          ethical policies or engage in predatory behavior. All reports are confidential and
          thoroughly investigated.
        </p>
      </div>

      {/* Safety Notice */}
      <Alert className="border-2 border-blue-300 bg-blue-50">
        <Lock className="h-5 w-5 text-blue-600" />
        <AlertDescription className="text-blue-900">
          <strong>Your safety is our priority:</strong> Reports can be submitted anonymously.
          All information is confidential and reviewed only by administrators. False reports may
          result in action against your account.
        </AlertDescription>
      </Alert>

      {/* Form */}
      <Card className="p-6 border-2">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Practitioner Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Practitioner Name *
            </label>
            <Input
              value={formData.practitionerName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  practitionerName: e.target.value,
                }))
              }
              placeholder="Full name of the practitioner"
              required
              aria-label="Practitioner name"
            />
          </div>

          {/* Violation Type */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Type of Violation *
            </label>
            <Select
              value={formData.violationType}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  violationType: value as PractitionerViolationType,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select the type of violation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PractitionerViolationType.EXTERNAL_PAYMENT_LINK}>
                  💳 External Payment Links (PayPal, Venmo, etc.)
                </SelectItem>
                <SelectItem value={PractitionerViolationType.OFF_PLATFORM_SOLICITATION}>
                  🔗 Off-Platform Solicitation
                </SelectItem>
                <SelectItem value={PractitionerViolationType.PRICE_GOUGING}>
                  💰 Price Gouging (Over $55/hour)
                </SelectItem>
                <SelectItem value={PractitionerViolationType.PREDATORY_MESSAGING}>
                  ⚠️ Predatory Messaging or Coercion
                </SelectItem>
                <SelectItem value={PractitionerViolationType.FRAUD}>
                  🚨 Fraud or Deception
                </SelectItem>
                <SelectItem value={PractitionerViolationType.SHADY_BUSINESS_PRACTICE}>
                  ❌ Other Shady Practices
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date of Incident */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Date of Incident *
            </label>
            <Input
              type="date"
              value={formData.dateOfIncident}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  dateOfIncident: e.target.value,
                }))
              }
              required
              aria-label="Date of incident"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              What Happened? * <span className="text-rose-600">(Be specific)</span>
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Describe the violation in detail. Include:
- What was said or done
- Exact quotes if possible
- How it violated platform policy
- How it affected you or others
- Any threats or coercion"
              rows={6}
              required
              aria-label="Description of incident"
            />
            <p className="mt-2 text-xs text-slate-500">
              Be as specific as possible. Detailed reports lead to faster investigations.
            </p>
          </div>

          {/* Anonymous Toggle */}
          <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <Checkbox
              id="anonymous"
              checked={formData.anonymous}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  anonymous: checked as boolean,
                }))
              }
            />
            <label htmlFor="anonymous" className="text-sm text-slate-700 cursor-pointer">
              <strong>Submit anonymously</strong> — Your identity will never be disclosed to the
              practitioner or public
            </label>
          </div>

          {/* Consent */}
          <div className="flex items-start gap-3 bg-amber-50 p-4 rounded-lg border-2 border-amber-200">
            <Checkbox
              id="consent"
              checked={formData.consent}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  consent: checked as boolean,
                }))
              }
              className="mt-1"
            />
            <label htmlFor="consent" className="text-xs text-amber-900 cursor-pointer leading-relaxed">
              <strong>✓ I understand and consent</strong> that:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>This information will be investigated by the Soul Echoes admin team</li>
                <li>
                  False or malicious reports may result in action against my account
                </li>
                <li>
                  If the practitioner is verified to have violated policies, they will be
                  permanently banned and publicly listed in the Disciplinary Ledger
                </li>
                <li>I consent to this information being used in disciplinary proceedings</li>
              </ul>
            </label>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={submitting || !formData.consent || !formData.violationType}
            className="w-full bg-gradient-to-r from-rose-500 to-orange-500 text-white hover:from-rose-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
            size="lg"
          >
            {submitting ? "Submitting Report..." : "Submit Report & Protect the Community"}
          </Button>
        </form>
      </Card>

      {/* Info */}
      <div className="rounded-lg border-2 border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-900">
        <p className="font-bold mb-2">⚖️ Our Investigation Process</p>
        <ol className="space-y-1 text-xs list-decimal list-inside">
          <li>Your report is reviewed within 48 hours</li>
          <li>Admins investigate and collect evidence</li>
          <li>If verified, the practitioner is notified and given opportunity to respond</li>
          <li>Confirmed violations result in permanent ban</li>
          <li>Banned practitioners are added to the public Disciplinary Ledger</li>
          <li>Affected users are notified of the ban</li>
        </ol>
      </div>
    </div>
  );
};
