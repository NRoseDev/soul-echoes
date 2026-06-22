import React, { useState } from "react";
import { ShadyBusinessReport, PractitionerViolationType } from "@/types/compliance";
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
import { Shield, Lock, AlertTriangle } from "lucide-react";

interface ShadyBusinessReportingPortalProps {
  onReportSubmitted?: (report: ShadyBusinessReport) => void;
}

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
  const ledger = new DisciplinaryLedger();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.consent) {
      alert("You must agree to the investigation consent.");
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

      // Reset form
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
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-lg border-2 border-green-200 bg-green-50 p-8 text-center">
        <div className="flex justify-center mb-4">
          <Shield className="h-12 w-12 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-green-900 mb-2">
          Thank You for Protecting the Community
        </h2>
        <p className="text-green-800 mb-4">
          Your report has been submitted for investigation. Our team will review it
          within 48 hours.
        </p>
        <p className="text-sm text-green-700">
          {formData.anonymous
            ? "Your identity is protected. You will not be contacted."
            : "You may receive updates on the status of this report."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2 text-slate-900">
          <AlertTriangle className="h-8 w-8 text-rose-500" />
          Report Shady Business Practices
        </h1>
        <p className="mt-2 text-slate-600">
          Help protect the community by reporting practitioners who violate our policies
          or engage in predatory behavior.
        </p>
      </div>

      {/* Safety Notice */}
      <Alert className="border-blue-300 bg-blue-50">
        <Lock className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-900">
          <strong>Your safety is protected:</strong> Reports can be submitted anonymously.
          All information is confidential and reviewed by administrators only.
        </AlertDescription>
      </Alert>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg border border-slate-200">
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
                ⚠️ Predatory Messaging
              </SelectItem>
              <SelectItem value={PractitionerViolationType.FRAUD}>
                🚨 Fraud
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
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            What Happened? *
          </label>
          <Textarea
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            placeholder="Please provide detailed information about the violation. Include what was said/done and how it affected you."
            rows={5}
            required
          />
          <p className="mt-2 text-xs text-slate-500">
            Be as specific as possible. Include quotes, dates, and any relevant context.
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
            <strong>Submit anonymously</strong> - Your identity will not be disclosed
          </label>
        </div>

        {/* Consent */}
        <div className="flex items-start gap-3 bg-amber-50 p-4 rounded-lg border border-amber-200">
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
          <label htmlFor="consent" className="text-xs text-amber-900 cursor-pointer">
            ✓ <strong>I understand</strong> that this information will be investigated by
            the Soul Echoes admin team. False reports may result in action against my
            account. I consent to the use of this information in disciplinary proceedings
            if the practitioner is verified to have violated platform policies.
          </label>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={submitting || !formData.consent}
          className="w-full bg-gradient-to-r from-rose-500 to-orange-500 text-white hover:from-rose-600 hover:to-orange-600"
          size="lg"
        >
          {submitting ? "Submitting Report..." : "Submit Report"}
        </Button>
      </form>
    </div>
  );
};
