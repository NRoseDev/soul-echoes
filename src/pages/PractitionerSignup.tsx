import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ChevronRight, ShieldCheck, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type PractitionerRole = "healer" | "counselor" | "guide" | "dispatcher" | "intercessor";

const ROLES: { id: PractitionerRole; label: string; icon: string; desc: string }[] = [
  { id: "healer", label: "Healer", icon: "🌿", desc: "Energy work, Reiki, sound healing" },
  { id: "counselor", label: "Counselor", icon: "🫂", desc: "Licensed or peer counseling" },
  { id: "guide", label: "Spiritual Guide", icon: "✨", desc: "Meditation, breathwork, spiritual direction" },
  { id: "dispatcher", label: "Dispatcher", icon: "⚔️", desc: "Receive and respond to distress signals" },
  { id: "intercessor", label: "Intercessor", icon: "🙏", desc: "Spiritual support and prayer for those in crisis" },
];

const SHARED_QUESTIONS = [
  "Why do you want this role?",
  "What does healing mean to you personally?",
  "Have you done your own healing work? Where are you in that journey?",
  "How do you handle someone else's pain without losing yourself?",
  "What would you do if you felt overwhelmed receiving a distress signal?",
];

const DISPATCHER_SCENARIO = "You receive a Michael 333 signal with no GPS. What do you do first?";
const INTERCESSOR_SCENARIO = "You receive a Faith 111 signal. How do you respond spiritually and practically?";

export default function PractitionerSignup() {
  const [selectedRole, setSelectedRole] = useState<PractitionerRole | null>(null);
  const [answers, setAnswers] = useState<string[]>(Array(5).fill(""));
  const [scenarioAnswer, setScenarioAnswer] = useState("");
  const [referenceName, setReferenceName] = useState("");
  const [referenceContact, setReferenceContact] = useState("");
  const [bgCheckConsent, setBgCheckConsent] = useState(false);
  const [codeOfConduct, setCodeOfConduct] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const isDispatcherOrIntercessor = selectedRole === "dispatcher" || selectedRole === "intercessor";
  const hasScenario = selectedRole === "dispatcher" || selectedRole === "intercessor";

  const canSubmit = selectedRole &&
    answers.every((a) => a.trim().length > 10) &&
    referenceName.trim() &&
    referenceContact.trim() &&
    bgCheckConsent &&
    codeOfConduct &&
    (!hasScenario || scenarioAnswer.trim().length > 10);

  const handleSubmit = async () => {
    if (!canSubmit || !selectedRole) return;
    setSubmitting(true);

    try {
      const { supabase } = await import("@/integrations/supabase/client");
      await supabase.from("practitioner_applications").insert({
        role: selectedRole,
        answers: JSON.stringify(answers),
        scenario_answer: scenarioAnswer || null,
        reference_name: referenceName,
        reference_contact: referenceContact,
        bg_check_consent: bgCheckConsent,
        code_of_conduct_agreed: codeOfConduct,
        status: "pending_review",
      });
      setSubmitted(true);
    } catch (err) {
      toast({ title: "Error", description: "Could not submit application. Please try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto">
            <Check className="h-8 w-8 text-secondary" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground">Application Received</h2>
          <p className="text-muted-foreground">
            Every application is reviewed by a Soul Echoes team member with grace and intention. We'll be in touch.
          </p>
          <p className="text-sm text-muted-foreground/60">No automated approvals — your heart matters to us.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8 pb-24">
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-bold text-foreground">Practitioner Application</h1>
        <p className="text-muted-foreground">This role saves lives and is not taken lightly.</p>
      </div>

      {/* Role selection */}
      <div className="space-y-3">
        <p className="font-display text-lg font-bold text-foreground">Choose your role</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ROLES.map((role) => (
            <button
              key={role.id}
              onClick={() => { setSelectedRole(role.id); setScenarioAnswer(""); }}
              className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all ${
                selectedRole === role.id
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border bg-card text-foreground hover:border-primary/40"
              }`}
              aria-pressed={selectedRole === role.id}
            >
              <span className="text-2xl">{role.icon}</span>
              <div>
                <p className="font-semibold">{role.label}</p>
                <p className="text-xs text-muted-foreground">{role.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedRole && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Shared questions */}
          {SHARED_QUESTIONS.map((q, i) => (
            <div key={i} className="space-y-2">
              <label className="text-sm font-medium text-foreground">{q}</label>
              <Textarea
                value={answers[i]}
                onChange={(e) => {
                  const next = [...answers];
                  next[i] = e.target.value;
                  setAnswers(next);
                }}
                placeholder="Share from your heart…"
                className="min-h-[100px]"
              />
            </div>
          ))}

          {/* Role-specific scenario */}
          {hasScenario && (
            <div className="space-y-2 p-4 rounded-2xl border-2 border-accent/30 bg-accent/5">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-accent" />
                {selectedRole === "dispatcher" ? DISPATCHER_SCENARIO : INTERCESSOR_SCENARIO}
              </label>
              <Textarea
                value={scenarioAnswer}
                onChange={(e) => setScenarioAnswer(e.target.value)}
                placeholder="Describe your response…"
                className="min-h-[120px]"
              />
            </div>
          )}

          {/* Reference */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground flex items-center gap-2">
              <Heart className="h-4 w-4 text-primary" />
              One character reference — someone who knows your heart now, not your past
            </p>
            <Input
              value={referenceName}
              onChange={(e) => setReferenceName(e.target.value)}
              placeholder="Reference name"
            />
            <Input
              value={referenceContact}
              onChange={(e) => setReferenceContact(e.target.value)}
              placeholder="Reference email or phone"
            />
          </div>

          {/* Consents */}
          <div className="space-y-3">
            <label className="flex items-start gap-3 p-4 rounded-2xl border border-border bg-card cursor-pointer">
              <input type="checkbox" checked={bgCheckConsent} onChange={(e) => setBgCheckConsent(e.target.checked)} className="mt-1" />
              <div>
                <p className="text-sm font-medium text-foreground">Background check consent</p>
                <p className="text-xs text-muted-foreground">Reviewed with grace — only patterns of predatory behavior are automatic disqualification.</p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 rounded-2xl border border-border bg-card cursor-pointer">
              <input type="checkbox" checked={codeOfConduct} onChange={(e) => setCodeOfConduct(e.target.checked)} className="mt-1" />
              <div>
                <p className="text-sm font-medium text-foreground">Sacred code of conduct agreement</p>
                <p className="text-xs text-muted-foreground">This role saves lives and is not taken lightly.</p>
              </div>
            </label>
          </div>

          {isDispatcherOrIntercessor && (
            <div className="p-4 rounded-2xl border border-border bg-card/50 space-y-2 text-sm text-muted-foreground">
              {selectedRole === "dispatcher" && (
                <>
                  <p>• Dispatchers start in supervised mode — first 10 responses reviewed by senior dispatcher</p>
                  <p>• Volunteer initially with compensation as app grows</p>
                </>
              )}
              {selectedRole === "intercessor" && (
                <>
                  <p>• Intercessors are volunteer and energy exchange based</p>
                  <p>• You receive 🙏 signals with angel and code only — no personal details</p>
                </>
              )}
              <p>• Free access to all healing rooms and practitioner directory profile</p>
              <p>• Soul Echoes community recognition</p>
            </div>
          )}

          <Button
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            size="lg"
            className="w-full rounded-2xl text-lg py-6"
          >
            {submitting ? "Submitting…" : "Submit Application"}
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}
