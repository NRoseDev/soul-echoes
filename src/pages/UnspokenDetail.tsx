import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Mic2, Feather, Keyboard, ImageIcon, Volume2, HeartHandshake, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import ASLSignInput from "@/components/ASLSignInput";

const relationshipCards = [
  "Mother", "Father", "Partner", "Sibling", "Child", "Grandparent", "Best Friend", "Mentor", "Teacher", "Therapist",
  "Coach", "Colleague", "Neighbor", "Ex-Partner", "Soulmate", "Twin Flame", "Ancestor", "Passed Loved One", "Spirit Guide", "Animal Companion",
  "Divine Presence", "Inner Child", "Future Self", "Past Self", "Stranger", "Boss", "Lover", "Parent of a Child", "Community Member", "Healer",
  "Intercessor", "Prayer Partner", "Guardian Angel",
];

const aslSigns = [
  { name: "Happy", category: "Emotions" },
  { name: "Sad", category: "Emotions" },
  { name: "Angry", category: "Emotions" },
  { name: "Calm", category: "Emotions" },
  { name: "Scared", category: "Emotions" },
  { name: "Loved", category: "Emotions" },
  { name: "Healing", category: "Emotions" },
  { name: "Safe", category: "Emotions" },
  { name: "Alone", category: "Emotions" },
  { name: "Grateful", category: "Emotions" },
  { name: "Peace", category: "Emotions" },
  { name: "Hope", category: "Emotions" },
  { name: "Tired", category: "Emotions" },
  { name: "Brave", category: "Emotions" },
  { name: "Embarrassed", category: "Emotions" },
  { name: "Overwhelmed", category: "Emotions" },
  { name: "Confident", category: "Emotions" },
  { name: "Joy", category: "Emotions" },
  { name: "Hungry", category: "Daily Needs" },
  { name: "Thirsty", category: "Daily Needs" },
  { name: "Bathroom", category: "Daily Needs" },
  { name: "Sleep", category: "Daily Needs" },
  { name: "Help", category: "Daily Needs" },
  { name: "Yes", category: "Daily Needs" },
  { name: "No", category: "Daily Needs" },
  { name: "More", category: "Daily Needs" },
  { name: "Less", category: "Daily Needs" },
  { name: "Stop", category: "Daily Needs" },
  { name: "Go", category: "Daily Needs" },
  { name: "Feel", category: "Daily Needs" },
  { name: "Listen", category: "Daily Needs" },
  { name: "Wait", category: "Daily Needs" },
  { name: "Quiet", category: "Daily Needs" },
  { name: "Pain", category: "Healing Terms" },
  { name: "Release", category: "Healing Terms" },
  { name: "Comfort", category: "Healing Terms" },
  { name: "Balance", category: "Healing Terms" },
  { name: "Trust", category: "Healing Terms" },
  { name: "Restore", category: "Healing Terms" },
  { name: "Ground", category: "Healing Terms" },
  { name: "Hold", category: "Healing Terms" },
  { name: "Allow", category: "Healing Terms" },
  { name: "Flow", category: "Healing Terms" },
  { name: "Calm", category: "Healing Terms" },
  { name: "Open", category: "Healing Terms" },
  { name: "Soft", category: "Healing Terms" },
  { name: "Float", category: "Healing Terms" },
  { name: "Mend", category: "Healing Terms" },
  { name: "Gentle", category: "Healing Terms" },
  { name: "Support", category: "Healing Terms" },
  { name: "Therapy", category: "Therapy Vocabulary" },
  { name: "Session", category: "Therapy Vocabulary" },
  { name: "Counselor", category: "Therapy Vocabulary" },
  { name: "Trigger", category: "Therapy Vocabulary" },
  { name: "Boundary", category: "Therapy Vocabulary" },
  { name: "Emotion", category: "Therapy Vocabulary" },
  { name: "Trauma", category: "Therapy Vocabulary" },
  { name: "Anchor", category: "Therapy Vocabulary" },
  { name: "Grounding", category: "Therapy Vocabulary" },
  { name: "Resilience", category: "Therapy Vocabulary" },
  { name: "Reflect", category: "Therapy Vocabulary" },
  { name: "Release", category: "Therapy Vocabulary" },
  { name: "Healing", category: "Therapy Vocabulary" },
  { name: "Listen", category: "Therapy Vocabulary" },
  { name: "Share", category: "Therapy Vocabulary" },
  { name: "Change", category: "Therapy Vocabulary" },
  { name: "Voice", category: "Therapy Vocabulary" },
  { name: "Touch", category: "Therapy Vocabulary" },
  { name: "Trust", category: "Therapy Vocabulary" },
  { name: "Yes", category: "Therapy Vocabulary" },
  { name: "No", category: "Therapy Vocabulary" },
  { name: "Brain", category: "Therapy Vocabulary" },
  { name: "Heart", category: "Therapy Vocabulary" },
  { name: "Body", category: "Therapy Vocabulary" },
  { name: "Breath", category: "Therapy Vocabulary" },
  { name: "Hope", category: "Therapy Vocabulary" },
  { name: "Listen", category: "Therapy Vocabulary" },
  { name: "Safe", category: "Therapy Vocabulary" },
  { name: "Comfort", category: "Therapy Vocabulary" },
  { name: "Share", category: "Therapy Vocabulary" },
  { name: "Signal", category: "Communication Tools" },
  { name: "Picture", category: "Communication Tools" },
  { name: "Gesture", category: "Communication Tools" },
  { name: "Symbol", category: "Communication Tools" },
  { name: "Point", category: "Communication Tools" },
  { name: "Write", category: "Communication Tools" },
  { name: "Draw", category: "Communication Tools" },
  { name: "Tap", category: "Communication Tools" },
  { name: "Blink", category: "Communication Tools" },
  { name: "Eye Gaze", category: "Communication Tools" },
  { name: "Board", category: "Communication Tools" },
  { name: "Choice", category: "Communication Tools" },
  { name: "Support", category: "Communication Tools" },
  { name: "Assist", category: "Communication Tools" },
  { name: "Guide", category: "Communication Tools" },
  { name: "Listen", category: "Communication Tools" },
  { name: "Record", category: "Communication Tools" },
  { name: "Play", category: "Communication Tools" },
  { name: "Pause", category: "Communication Tools" },
  { name: "Speak", category: "Communication Tools" },
  { name: "Quiet", category: "Communication Tools" },
  { name: "Touch", category: "Communication Tools" },
  { name: "Alert", category: "Communication Tools" },
  { name: "Need", category: "Support Access" },
  { name: "Choice", category: "Support Access" },
  { name: "Accessibility", category: "Support Access" },
  { name: "Device", category: "Support Access" },
  { name: "AAC", category: "Support Access" },
  { name: "Switch", category: "Support Access" },
  { name: "Braille", category: "Support Access" },
  { name: "Caption", category: "Support Access" },
  { name: "Interpreter", category: "Support Access" },
  { name: "Support", category: "Support Access" },
  { name: "Alternative", category: "Support Access" },
  { name: "Quiet", category: "Support Access" },
  { name: "Pause", category: "Support Access" },
  { name: "Adjust", category: "Support Access" },
  { name: "Repeat", category: "Support Access" },
  { name: "Describe", category: "Support Access" },
  { name: "Notice", category: "Support Access" },
  { name: "Accessible", category: "Support Access" },
  { name: "Choice", category: "Support Access" },
  { name: "Express", category: "Support Access" },
  { name: "Hear", category: "Support Access" },
];

const sectionTitles: Record<SectionKey, string> = {
  "healing-conversations": "Healing Conversations",
  "throat-clearing": "Throat Chakra Clearing",
  "speak-your-truth": "Speak Your Truth",
  "asl-dictionary": "ASL Dictionary",
  "visual-board": "Visual Communication Board",
  "speech-tools": "Speech Tools",
  "intercessor-connection": "Intercessor Connection",
  "connect-healer": "Connect to a Healer",
};

type SectionKey =
  | "healing-conversations"
  | "throat-clearing"
  | "speak-your-truth"
  | "asl-dictionary"
  | "visual-board"
  | "speech-tools"
  | "intercessor-connection"
  | "connect-healer";

function SectionContent({ id }: { id: SectionKey }) {
  const navigate = useNavigate();
  switch (id) {
    case "healing-conversations":
      return (
        <div className="space-y-6">
          <p className="text-muted-foreground leading-relaxed">
            Use any input method — voice, typing, sign, image, or silence — and let the AI create a gentle, compassionate conversation with someone you love, respect, or remember.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {relationshipCards.map((relationship) => (
              <Card key={relationship} className="bg-muted/70 border border-border">
                <CardHeader className="p-4">
                  <CardTitle className="text-sm font-semibold text-foreground">{relationship}</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground mt-1">Build a healing message for this connection.</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
          <p className="text-xs text-muted-foreground italic">33 cards for living and passed relationships — each one invites a safe, restorative exchange.</p>
        </div>
      );

    case "throat-clearing":
      return (
        <div className="space-y-6">
          <div className="bg-muted/70 rounded-3xl p-4 space-y-3">
            <h2 className="font-display text-lg font-bold text-foreground">Vocal Toning</h2>
            <p className="text-sm text-muted-foreground">Use simple sounds to stimulate the throat center, clear tension, and release trapped truth from the voice.</p>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground text-sm">
              <li>Gather in a comfortable seated position with your spine long.</li>
              <li>Take a deep inhale through the nose.</li>
              <li>Exhale while humming on a steady "M" or "OM" sound for 5–8 seconds.</li>
              <li>Repeat for 5 cycles, feeling vibration in the throat.</li>
            </ol>
          </div>
          <div className="bg-muted/70 rounded-3xl p-4 space-y-3">
            <h2 className="font-display text-lg font-bold text-foreground">Truth Speaking Prompts</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm">
              <li>"What do I need to say to feel more whole?"</li>
              <li>"What is true in my heart right now?"</li>
              <li>"What voice needs to be heard with kindness?"</li>
              <li>"What boundary do I want to speak with love?"</li>
            </ul>
          </div>
          <div className="bg-muted/70 rounded-3xl p-4 space-y-3">
            <h2 className="font-display text-lg font-bold text-foreground">Guided Exercises</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm">
              <li>Say a true sentence softly, then say it louder, then whisper it.</li>
              <li>Write one honest phrase on paper, then read it out loud with care.</li>
              <li>Speak your intention for the day: "I will share my truth with courage and compassion."</li>
            </ul>
          </div>
        </div>
      );

    case "speak-your-truth":
      return (
        <div className="space-y-6">
          <p className="text-muted-foreground leading-relaxed">
            This is a free expression space for any method you choose. Speak, type, sign, draw, or send an image. Your voice and your silence both matter here.
          </p>
          <div className="bg-muted/70 rounded-3xl p-4 space-y-3">
            <h2 className="font-display text-lg font-bold text-foreground">Ways to Express</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm">
              <li>Write a message to someone you need to forgive.</li>
              <li>Describe a feeling using color, shape, or movement.</li>
              <li>Record a voice note with what you are truly feeling.</li>
              <li>Sketch a scene that represents your present experience.</li>
            </ul>
          </div>
          <div className="bg-muted/70 rounded-3xl p-4">
            <h2 className="font-display text-lg font-bold text-foreground">How to Begin</h2>
            <p className="text-sm text-muted-foreground">Choose one of these prompts and use the communication mode that feels safest:</p>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground text-sm">
              <li>"Today I need to share..."</li>
              <li>"If my emotions had a voice, it would say..."</li>
              <li>"What feels true for me in this moment is..."</li>
            </ol>
          </div>
          <div className="bg-muted/70 rounded-3xl border border-border overflow-hidden">
            <p className="text-sm font-semibold text-foreground px-4 pt-4 pb-2">Sign Your Truth</p>
            <ASLSignInput onSend={(text) => { console.log("Speak Your Truth:", text); }} />
          </div>
        </div>
      );

    case "asl-dictionary":
      return (
        <div className="space-y-6">
          <p className="text-muted-foreground leading-relaxed">Explore 111 ASL signs grouped by emotion, daily needs, healing, therapy vocabulary, communication tools, and accessibility support.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            {aslSigns.map((sign) => {
              const letters = sign.name.toUpperCase().replace(/[^A-Z]/g, "").split("");
              return (
                <div key={`${sign.category}-${sign.name}`} className="bg-muted/70 rounded-3xl p-4 space-y-2 border border-border">
                  <div className="rounded-2xl bg-slate-900/60 p-2 flex flex-wrap gap-0.5 justify-center min-h-16 items-center">
                    {letters.map((letter, i) => (
                      <img
                        key={i}
                        src={`/asl/alpha/${letter.toLowerCase()}.gif`}
                        alt={`ASL ${letter}`}
                        className="h-8 w-8 object-contain bg-white rounded"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{sign.name}</p>
                    <p className="text-xs text-muted-foreground">{sign.category}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground italic">111 signs for emotions, needs, healing, therapy, and accessible connection.</p>
        </div>
      );

    case "visual-board":
      return (
        <div className="space-y-6">
          <p className="text-muted-foreground leading-relaxed">The Visual Communication Board lets you choose pictures, symbols, and emotion icons to share exactly how you feel without using spoken words.</p>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="bg-muted/70 rounded-3xl p-4 space-y-3">
              <h2 className="font-display text-lg font-bold text-foreground">How to Use It</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm">
                <li>Select images that match your mood or need.</li>
                <li>Arrange them in the order that feels right.</li>
                <li>Share the board with someone who is listening.</li>
                <li>Use it for yes/no choices, feelings, comfort, and support.</li>
              </ul>
            </div>
            <div className="bg-muted/70 rounded-3xl p-4 space-y-3">
              <h2 className="font-display text-lg font-bold text-foreground">What It Supports</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm">
                <li>Nonverbal communication</li>
                <li>Autism, speech differences, and mobility limitations</li>
                <li>Emotion sharing without pressure</li>
                <li>Comfort through visual choice</li>
              </ul>
            </div>
          </div>
        </div>
      );

    case "speech-tools":
      return (
        <div className="space-y-6">
          <div className="bg-muted/70 rounded-3xl p-4 space-y-3">
            <h2 className="font-display text-lg font-bold text-foreground">Speech to Text</h2>
            <p className="text-sm text-muted-foreground">Speak aloud and see your words appear as text. This tool makes it easier to capture feelings, memories, and honest expression.</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm">
              <li>Speak clearly into your device microphone.</li>
              <li>Review the text and edit if you want.</li>
              <li>Use it to write messages, prayers, or truth statements.</li>
            </ul>
          </div>
          <div className="bg-muted/70 rounded-3xl p-4 space-y-3">
            <h2 className="font-display text-lg font-bold text-foreground">Text to Speech</h2>
            <p className="text-sm text-muted-foreground">Type or paste words, then let the system speak them back. It can help you hear the truth in your own voice and soften difficult feelings.</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm">
              <li>Choose a voice that feels soothing.</li>
              <li>Listen to your message before sharing it.</li>
              <li>Use it when speaking feels too hard.</li>
            </ul>
          </div>
        </div>
      );

    case "intercessor-connection":
      return (
        <div className="space-y-6">
          <p className="text-muted-foreground leading-relaxed">When emotions surface, an intercessor is available to hold space, pray, and support you in spiritual care.</p>
          <div className="bg-muted/70 rounded-3xl p-4 space-y-3">
            <h2 className="font-display text-lg font-bold text-foreground">What to Expect</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm">
              <li>Safe, compassionate listening</li>
              <li>Prayerful presence for your current need</li>
              <li>Support for emotional release and spiritual rest</li>
              <li>Guidance for your next healing step</li>
            </ul>
          </div>
          <Button
            className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground"
            onClick={() => navigate("/community")}
          >
            Connect with an Intercessor
          </Button>
        </div>
      );

    case "connect-healer":
      return (
        <div className="space-y-6">
          <p className="text-muted-foreground leading-relaxed">For deeper healing, a counselor, energy healer, or practitioner can support you with personalized guidance and ongoing care.</p>
          <div className="bg-muted/70 rounded-3xl p-4 space-y-3">
            <h2 className="font-display text-lg font-bold text-foreground">Deeper Support</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm">
              <li>One-on-one sessions with experienced healers</li>
              <li>Trauma-informed guidance for difficult feelings</li>
              <li>Tools for ongoing emotional and spiritual resilience</li>
            </ul>
          </div>
          <Button
            className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground"
            onClick={() => navigate("/practitioner")}
          >
            Find a Healer
          </Button>
        </div>
      );

    default:
      return null;
  }
}

export default function UnspokenDetail() {
  const { section } = useParams<{ section: string }>();
  const navigate = useNavigate();
  const id = section as SectionKey;
  const title = sectionTitles[id];

  if (!title) {
    navigate("/unspoken", { replace: true });
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col min-h-0 bg-gradient-to-br from-violet-950 via-slate-950 to-sky-950"
    >
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/unspoken")} aria-label="Back">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="font-display text-xl font-bold text-foreground truncate">{title}</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-32">
        <div className="space-y-4 bg-muted/70 border border-border/80 rounded-3xl p-4 mb-6">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Some breathwork and energy practices can surface deep emotions or trauma. You are never alone here. Intercessors and healers are always on standby to support you. If you feel overwhelmed stop and reach out.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              className="w-full bg-white/10 text-foreground border border-border hover:bg-white/20"
              onClick={() => navigate("/community")}
            >
              Talk to an Intercessor
            </Button>
            <Button
              className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground"
              onClick={() => navigate("/practitioner")}
            >
              Connect to a Healer
            </Button>
          </div>
        </div>
        <SectionContent id={id} />
      </div>
    </motion.div>
  );
}
