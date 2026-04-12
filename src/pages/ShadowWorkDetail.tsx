import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, HeartHandshake, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type ModuleKey =
  | "inner-child-healing"
  | "meeting-your-shadow"
  | "limiting-beliefs"
  | "authentic-self"
  | "generational-patterns"
  | "emotional-triggers"
  | "self-forgiveness"
  | "integration-and-wholeness";

const moduleTitles: Record<ModuleKey, string> = {
  "inner-child-healing": "Inner Child Healing",
  "meeting-your-shadow": "Meeting Your Shadow",
  "limiting-beliefs": "Limiting Beliefs",
  "authentic-self": "Authentic Self",
  "generational-patterns": "Generational Patterns",
  "emotional-triggers": "Emotional Triggers",
  "self-forgiveness": "Self Forgiveness",
  "integration-and-wholeness": "Integration and Wholeness",
};

interface ModuleData {
  prompts: string[];
  bibleVerses: { text: string; reference: string }[];
  wisdomQuotes: { text: string; author: string }[];
}

const moduleData: Record<ModuleKey, ModuleData> = {
  "inner-child-healing": {
    prompts: [
      "What is the earliest memory of feeling unloved or misunderstood?",
      "What did your younger self desperately need to hear?",
      "What activities brought your inner child pure, uncomplicated joy?",
      "What fear do you still carry from childhood that no longer serves you?",
      "Write a letter of love and reassurance to your seven-year-old self.",
      "What did you learn to hide or suppress in order to be accepted as a child?",
      "What wounds from childhood are still showing up in your adult relationships?",
      "If you could protect your younger self from one moment, what would it be?",
      "What did you need from your caregivers that you are still searching for today?",
      "How does your inner child respond when you feel threatened or rejected?",
      "What would it look like to fully re-parent your inner child starting today?",
    ],
    bibleVerses: [
      { text: "He heals the brokenhearted and binds up their wounds.", reference: "Psalm 147:3" },
      { text: "Let the little children come to me and do not hinder them, for to such belongs the kingdom of heaven.", reference: "Matthew 19:14" },
      { text: "Train up a child in the way he should go; even when he is old he will not depart from it.", reference: "Proverbs 22:6" },
    ],
    wisdomQuotes: [
      { text: "Until you make the unconscious conscious, it will direct your life and you will call it fate.", author: "Carl Jung" },
      { text: "You yourself, as much as anybody in the entire universe, deserve your love and affection.", author: "Buddha" },
      { text: "Healing yourself is connected with healing others.", author: "Yoko Ono" },
    ],
  },
  "meeting-your-shadow": {
    prompts: [
      "What traits in others irritate you most — could these be a reflection of yourself?",
      "What emotion do you work hardest to avoid or suppress?",
      "What parts of yourself have you judged most harshly?",
      "What behavior in yourself do you feel the most shame about?",
      "Describe a pattern in your life that keeps repeating — what might it be protecting?",
      "What would the 'unacceptable' version of you say or do?",
      "What do you fear others would think if they truly knew you?",
      "What do you want that you have been taught to feel ashamed of wanting?",
      "What aspects of yourself have you exiled in order to survive or be loved?",
      "What is the gift hidden inside your shadow — what strength lives in your pain?",
      "If your shadow could speak, what would it most need you to hear?",
    ],
    bibleVerses: [
      { text: "Search me, O God, and know my heart! Try me and know my thoughts!", reference: "Psalm 139:23" },
      { text: "For nothing is hidden that will not be made manifest, nor is anything secret that will not be known and come to light.", reference: "Luke 8:17" },
      { text: "The heart is deceitful above all things, and desperately sick; who can understand it?", reference: "Jeremiah 17:9" },
    ],
    wisdomQuotes: [
      { text: "Everyone carries a shadow, and the less it is embodied in the individual's conscious life, the blacker and denser it is.", author: "Carl Jung" },
      { text: "Your vision will become clear only when you look into your heart. Who looks outside, dreams. Who looks inside, awakes.", author: "Carl Jung" },
      { text: "The privilege of a lifetime is to become who you truly are.", author: "Carl Jung" },
    ],
  },
  "limiting-beliefs": {
    prompts: [
      "What story about yourself do you return to again and again?",
      "Finish this sentence: 'I am not ___ enough to ___.'",
      "What belief did you inherit from your family about money, love, or worth?",
      "Where did you first learn that you were 'too much' or 'not enough'?",
      "What would your life look like if the belief 'I am deeply worthy' were completely true?",
      "What limiting belief is disguised as being realistic or practical?",
      "What have you stopped trying for because failure felt too certain?",
      "Whose voice is narrating the story that holds you back?",
      "What evidence exists in your life that contradicts the most painful thing you believe about yourself?",
      "What would you attempt if you knew that belief was a lie you were taught?",
      "Write a declaration that replaces your most limiting belief with an expansive and true statement.",
    ],
    bibleVerses: [
      { text: "For as he thinks in his heart, so is he.", reference: "Proverbs 23:7" },
      { text: "Do not conform to the pattern of this world, but be transformed by the renewing of your mind.", reference: "Romans 12:2" },
      { text: "I can do all things through him who strengthens me.", reference: "Philippians 4:13" },
    ],
    wisdomQuotes: [
      { text: "Whether you think you can or you think you can't, you're right.", author: "Henry Ford" },
      { text: "The mind is everything. What you think you become.", author: "Buddha" },
      { text: "Argue for your limitations, and sure enough they're yours.", author: "Richard Bach" },
    ],
  },
  "authentic-self": {
    prompts: [
      "Who were you before the world told you who to be?",
      "What do you pretend to enjoy or value that you actually resent?",
      "Where in your life are you performing a version of yourself rather than truly living?",
      "What truth about yourself have you been afraid to speak aloud?",
      "What would you change about your life if you had no fear of judgment from others?",
      "Name one thing you genuinely love about yourself that you rarely acknowledge.",
      "Who in your life sees the real you — and how does that feel?",
      "What version of yourself have you been quietly grieving because you abandoned it?",
      "What desire has been buried so long it has almost gone completely silent?",
      "What does your most authentic self need more of in your daily life?",
      "Write a vow to the truest version of yourself — one that you are ready to keep.",
    ],
    bibleVerses: [
      { text: "For we are God's handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do.", reference: "Ephesians 2:10" },
      { text: "Before I formed you in the womb I knew you, before you were born I set you apart.", reference: "Jeremiah 1:5" },
      { text: "So God created mankind in his own image, in the image of God he created them.", reference: "Genesis 1:27" },
    ],
    wisdomQuotes: [
      { text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.", author: "Ralph Waldo Emerson" },
      { text: "Authenticity is the daily practice of letting go of who we think we're supposed to be and embracing who we are.", author: "Brené Brown" },
      { text: "The most courageous act is still to think for yourself. Aloud.", author: "Coco Chanel" },
    ],
  },
  "generational-patterns": {
    prompts: [
      "What emotional pattern in your family have you unconsciously inherited?",
      "What did love look like in your family — was it safe, conditional, or absent?",
      "What was the unspoken rule about emotions in your household growing up?",
      "What cycle are you determined to break for the generations that come after you?",
      "How has generational trauma shaped your relationship to your own body and sense of safety?",
      "What strength or wisdom has been passed down to you through your lineage?",
      "What did your parents or grandparents never heal — and are you still carrying it for them?",
      "How have ancestral wounds shaped the way you seek or reject intimacy and closeness?",
      "What do you wish your lineage had taught you about self-worth and belonging?",
      "Write a letter of release to your ancestors, freeing yourself from a pattern that was never truly yours.",
      "What does healing look like for your family line — and where does it begin with you?",
    ],
    bibleVerses: [
      { text: "The Lord is compassionate and gracious, slow to anger, abounding in love. He does not treat us as our sins deserve.", reference: "Psalm 103:8-10" },
      { text: "I will repay you for the years the locusts have eaten.", reference: "Joel 2:25" },
      { text: "You intended to harm me, but God intended it for good to accomplish what is now being done.", reference: "Genesis 50:20" },
    ],
    wisdomQuotes: [
      { text: "The chains of habit are too weak to be felt until they are too strong to be broken.", author: "Samuel Johnson" },
      { text: "In every conceivable manner, the family is link to our past, bridge to our future.", author: "Alex Haley" },
      { text: "What we don't repair, we repeat.", author: "Mark Wolynn" },
    ],
  },
  "emotional-triggers": {
    prompts: [
      "What situation reliably takes you from calm to overwhelmed in seconds?",
      "What tone of voice, phrase, or behavior triggers the deepest reaction in you?",
      "When you are triggered, what story is your nervous system telling you?",
      "Trace your most frequent trigger back to its original wound — where did it begin?",
      "What do your triggers teach you about what you most deeply need?",
      "How do you typically behave when triggered — and what do you wish you did instead?",
      "Who in your life triggers you most — and what might they be mirroring back to you?",
      "What physical sensations arise in your body when you are triggered?",
      "What would it mean to create a pause between the trigger and your reaction?",
      "Write a compassionate response to yourself for the last time you were deeply triggered.",
      "What healing would need to happen for this trigger to lose its power over you?",
    ],
    bibleVerses: [
      { text: "In your anger do not sin: Do not let the sun go down while you are still angry.", reference: "Ephesians 4:26" },
      { text: "A person without self-control is like a city with broken-down walls.", reference: "Proverbs 25:28" },
      { text: "Be quick to listen, slow to speak and slow to become angry.", reference: "James 1:19" },
    ],
    wisdomQuotes: [
      { text: "Between stimulus and response there is a space. In that space is our power to choose our response. In our response lies our growth and our freedom.", author: "Viktor Frankl" },
      { text: "The greatest weapon against stress is our ability to choose one thought over another.", author: "William James" },
      { text: "Feelings are just visitors, let them come and go.", author: "Mooji" },
    ],
  },
  "self-forgiveness": {
    prompts: [
      "What have you been punishing yourself for that deserves release?",
      "What mistakes have you made that you still carry as identity rather than as experience?",
      "Write a letter of forgiveness to yourself for one decision you deeply regret.",
      "What would you need to believe about yourself in order to accept forgiveness?",
      "How has unforgiveness toward yourself shown up in your health, choices, or relationships?",
      "What would the most compassionate person in your life say to you about your mistakes?",
      "What do you need to grieve in order to forgive yourself and truly move forward?",
      "Where did you learn that you were not allowed to make mistakes?",
      "What would self-forgiveness feel like in your body — describe the physical sensation.",
      "What burden would you lay down if you truly believed you were worthy of forgiveness?",
      "Write a declaration: 'I forgive myself for ___ and I choose to move forward as ___.'",
    ],
    bibleVerses: [
      { text: "If we confess our sins, he is faithful and just and will forgive us our sins and purify us from all unrighteousness.", reference: "1 John 1:9" },
      { text: "As far as the east is from the west, so far has he removed our transgressions from us.", reference: "Psalm 103:12" },
      { text: "There is therefore now no condemnation for those who are in Christ Jesus.", reference: "Romans 8:1" },
    ],
    wisdomQuotes: [
      { text: "Forgiveness is not an occasional act; it is a constant attitude.", author: "Martin Luther King Jr." },
      { text: "The weak can never forgive. Forgiveness is the attribute of the strong.", author: "Mahatma Gandhi" },
      { text: "You can't go back and change the beginning, but you can start where you are and change the ending.", author: "C.S. Lewis" },
    ],
  },
  "integration-and-wholeness": {
    prompts: [
      "What parts of yourself have been at war — and what would peace between them look like?",
      "How has shadow work changed the way you relate to yourself?",
      "What old version of yourself are you ready to honor and release with gratitude?",
      "What does wholeness feel like in your body when you allow yourself to imagine it fully?",
      "What wound has become a source of wisdom that you now carry with grace?",
      "How are you becoming someone who can hold both your light and your shadow at once?",
      "What does it mean to live as your whole, unedited self in the ordinary moments of daily life?",
      "What relationship has transformed because of the inner work you have done?",
      "Write a vision statement for who you are becoming as an integrated and whole person.",
      "What daily practice helps you stay connected to your authentic, integrated self?",
      "Write a love letter to all the parts of yourself — including the ones you once tried to hide.",
    ],
    bibleVerses: [
      { text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.", reference: "Romans 8:28" },
      { text: "I praise you because I am fearfully and wonderfully made; your works are wonderful, I know that full well.", reference: "Psalm 139:14" },
      { text: "The Lord your God is with you, the Mighty Warrior who saves. He will take great delight in you.", reference: "Zephaniah 3:17" },
    ],
    wisdomQuotes: [
      { text: "Out of your vulnerabilities will come your strength.", author: "Sigmund Freud" },
      { text: "The curious paradox is that when I accept myself just as I am, then I can change.", author: "Carl Rogers" },
      { text: "We are not broken. We are breaking open.", author: "Alex Elle" },
    ],
  },
};

function PromptCard({ number, prompt }: { number: number; prompt: string }) {
  const [text, setText] = useState("");

  return (
    <div className="bg-muted/60 rounded-2xl p-4 space-y-3 border border-border/60">
      <div className="flex items-start gap-3">
        <span className="flex-shrink-0 h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
          {number}
        </span>
        <p className="text-sm text-foreground leading-relaxed pt-0.5">{prompt}</p>
      </div>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your reflection here…"
        className="min-h-[96px] bg-background/60 border-border/60 text-sm resize-none"
      />
    </div>
  );
}

export default function ShadowWorkDetail() {
  const { module } = useParams<{ module: string }>();
  const navigate = useNavigate();
  const id = module as ModuleKey;
  const title = moduleTitles[id];
  const data = moduleData[id];

  if (!title || !data) {
    navigate("/shadow-work", { replace: true });
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col min-h-0 bg-gradient-to-br from-violet-950 via-slate-950 to-indigo-950"
    >
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/shadow-work")} aria-label="Back">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="font-display text-xl font-bold text-foreground truncate">{title}</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-32">
        {/* Safety Disclaimer */}
        <div className="space-y-3 bg-muted/70 border border-border/80 rounded-3xl p-4 mb-6">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Shadow work can surface deep emotions, old grief, and unexpected reactions. You are never alone here.
            Intercessors and healers are on standby to support you. If you feel overwhelmed, stop and reach out.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              className="w-full bg-white/10 text-foreground border border-border hover:bg-white/20"
              onClick={() => navigate("/community")}
            >
              <HeartHandshake className="h-4 w-4 mr-2" />
              Talk to an Intercessor
            </Button>
            <Button
              className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground"
              onClick={() => navigate("/practitioner")}
            >
              <Users className="h-4 w-4 mr-2" />
              Connect to a Healer
            </Button>
          </div>
        </div>

        {/* Reflection Prompts */}
        <div className="space-y-4 mb-8">
          {data.prompts.map((prompt, index) => (
            <PromptCard key={index} number={index + 1} prompt={prompt} />
          ))}
        </div>

        {/* Scripture */}
        <div className="mb-6 space-y-3">
          <h2 className="font-display text-lg font-bold text-foreground">Scripture</h2>
          {data.bibleVerses.map((verse, index) => (
            <div key={index} className="bg-muted/60 rounded-2xl p-4 border border-border/60 space-y-1">
              <p className="text-sm text-foreground leading-relaxed italic">"{verse.text}"</p>
              <p className="text-xs text-primary font-semibold">— {verse.reference}</p>
            </div>
          ))}
        </div>

        {/* Wisdom */}
        <div className="mb-8 space-y-3">
          <h2 className="font-display text-lg font-bold text-foreground">Wisdom</h2>
          {data.wisdomQuotes.map((quote, index) => (
            <div key={index} className="bg-muted/60 rounded-2xl p-4 border border-border/60 space-y-1">
              <p className="text-sm text-foreground leading-relaxed italic">"{quote.text}"</p>
              <p className="text-xs text-muted-foreground font-semibold">— {quote.author}</p>
            </div>
          ))}
        </div>

        {/* Explore More */}
        <div className="bg-card/80 border border-border rounded-3xl p-5 space-y-3">
          <h2 className="font-display text-base font-bold text-foreground">Explore More</h2>
          <p className="text-sm text-muted-foreground">
            Continue your reflection with guided journal prompts or try a different module to deepen your work.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              className="w-full bg-white/10 text-foreground border border-border hover:bg-white/20"
              onClick={() => navigate("/journal/shadow-work")}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Shadow Work Journal
            </Button>
            <Button
              className="w-full bg-gradient-to-r from-violet-700 to-indigo-700 text-white"
              onClick={() => navigate("/shadow-work")}
            >
              All Modules
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
