import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CalendarCheck, Volume2, VolumeX, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useRef, useState } from "react";

/* ── Ambient sound generator (Web Audio API brown noise + 528 Hz sine) ── */
function useAmbientSound() {
  const ctxRef  = useRef<AudioContext | null>(null);
  const nodesRef = useRef<AudioNode[]>([]);
  const [playing, setPlaying] = useState(false);

  const start = useCallback(() => {
    if (playing) return;
    const ctx = new AudioContext();
    ctxRef.current = ctx;

    // Brown noise buffer
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.04;

    // 528 Hz healing tone (very soft)
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 528;
    const oscGain = ctx.createGain();
    oscGain.gain.value = 0.03;

    noise.connect(noiseGain).connect(ctx.destination);
    osc.connect(oscGain).connect(ctx.destination);
    noise.start();
    osc.start();

    nodesRef.current = [noise, osc];
    setPlaying(true);
  }, [playing]);

  const stop = useCallback(() => {
    nodesRef.current.forEach((n) => { try { (n as AudioBufferSourceNode | OscillatorNode).stop(); } catch {} });
    nodesRef.current = [];
    ctxRef.current?.close();
    ctxRef.current = null;
    setPlaying(false);
  }, []);

  useEffect(() => () => { stop(); }, []);
  return { playing, start, stop };
}

/* ── AI voice step reader ── */
function useStepReader() {
  const [reading, setReading] = useState(false);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  const readSteps = useCallback((title: string, steps: string[]) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setReading(true);

    const script = `${title}. ${steps.join(" ")} Take your time. You are doing beautifully.`;
    const u = new SpeechSynthesisUtterance(script);
    u.rate = 0.82;
    u.pitch = 1.05;
    u.onend = () => setReading(false);
    u.onerror = () => setReading(false);
    utterRef.current = u;
    window.speechSynthesis.speak(u);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setReading(false);
  }, []);

  useEffect(() => () => { window.speechSynthesis.cancel(); }, []);
  return { reading, readSteps, stop };
}

/* ───────── CONTENT DATA ───────── */

const meditationContent = {
  title: "Meditation",
  intro: "Meditation is the practice of training your attention and awareness to achieve a mentally clear, emotionally calm, and stable state. It's not about stopping your thoughts — it's about observing them without judgment and gently returning to your anchor (breath, mantra, or visualization).",
  types: [
    {
      name: "Breath Focus Meditation",
      steps: ["Find a comfortable seat and close your eyes.", "Breathe in slowly through your nose for 4 counts.", "Hold gently for 2 counts.", "Exhale through your mouth for 6 counts.", "When your mind wanders, gently return focus to your breath."],
      tip: "Start with just 3 minutes. Consistency matters more than duration.",
    },
    {
      name: "Chakra Color Visualization",
      steps: ["Sit comfortably and close your eyes.", "Visualize a red glowing light at the base of your spine (Root Chakra).", "Slowly move upward through each chakra, imagining its color growing brighter.", "Spend 30 seconds on each chakra, breathing into it.", "End at the crown with brilliant white or violet light."],
      tip: "Pair this with soft 528 Hz music for deeper effect.",
    },
    {
      name: "Body Scan Meditation",
      steps: ["Lie down or sit comfortably.", "Starting at the top of your head, bring attention to each body part.", "Notice any tension, tingling, or sensation without trying to change it.", "Move slowly downward — forehead, jaw, shoulders, arms, chest, belly, legs, feet.", "Breathe into any areas of tightness and imagine them softening."],
      tip: "This is especially helpful before sleep or after a stressful day.",
    },
    {
      name: "Affirmation Meditation",
      steps: ["Choose one affirmation that resonates (e.g., 'I am safe, I am loved').", "Close your eyes and repeat it silently or aloud.", "Feel the words in your body — let them settle in your heart space.", "If doubt arises, acknowledge it and return to the affirmation.", "Continue for 5–10 minutes."],
      tip: "Write your affirmation on a sticky note and place it where you'll see it daily.",
    },
    {
      name: "Sound Bath Meditation",
      steps: ["Find a quiet space and lie down comfortably.", "Play a sound bath track (singing bowls, gongs, or tuning forks).", "Close your eyes and let the vibrations wash over you.", "Don't try to focus — let the sound carry your awareness.", "Stay still for a few minutes after the sound ends."],
      tip: "Use headphones for the most immersive experience.",
    },
  ],
};

const chakrasContent = [
  { num: 0, name: "Earth Star Chakra", location: "6–12 inches below your feet", color: "Deep Brown / Black", blocked: "Feeling ungrounded, disconnected from nature, existential dread", tip: "Walk barefoot on earth or grass for 10 minutes daily.", affirmation: "I am deeply rooted to the Earth and all of creation.", hz: 68.05 },
  { num: 1, name: "Root Chakra (Muladhara)", location: "Base of the spine", color: "Red", blocked: "Anxiety, fear, financial insecurity, lower back pain", tip: "Stomp your feet on the ground and say 'I am safe' three times.", affirmation: "I am safe, secure, and grounded in this moment.", hz: 396 },
  { num: 2, name: "Sacral Chakra (Svadhisthana)", location: "Lower abdomen, below the navel", color: "Orange", blocked: "Guilt, emotional numbness, creative blocks, low libido", tip: "Move your hips — dance freely for 5 minutes.", affirmation: "I honor my emotions and allow pleasure to flow through me.", hz: 417 },
  { num: 3, name: "Solar Plexus Chakra (Manipura)", location: "Upper abdomen, stomach area", color: "Yellow", blocked: "Low self-esteem, indecisiveness, digestive issues, feeling powerless", tip: "Stand in a power pose for 2 minutes and breathe deeply.", affirmation: "I am confident, powerful, and in control of my life.", hz: 528 },
  { num: 4, name: "Heart Chakra (Anahata)", location: "Center of the chest", color: "Green", blocked: "Grief, jealousy, inability to forgive, chest tightness", tip: "Place your hand on your heart and say 'I forgive and I am forgiven.'", affirmation: "I give and receive love freely and unconditionally.", hz: 639 },
  { num: 5, name: "Throat Chakra (Vishuddha)", location: "Throat", color: "Blue", blocked: "Fear of speaking up, sore throat, feeling unheard, dishonesty", tip: "Hum or sing for 5 minutes to vibrate and open this chakra.", affirmation: "I speak my truth with clarity and confidence.", hz: 741 },
  { num: 6, name: "Third Eye Chakra (Ajna)", location: "Between the eyebrows", color: "Indigo", blocked: "Confusion, lack of intuition, headaches, overthinking", tip: "Gaze softly at a candle flame for 3 minutes, then close your eyes.", affirmation: "I trust my intuition and see clearly beyond illusion.", hz: 852 },
  { num: 7, name: "Crown Chakra (Sahasrara)", location: "Top of the head", color: "Violet / White", blocked: "Spiritual disconnection, close-mindedness, depression, isolation", tip: "Sit in silence for 5 minutes and imagine white light pouring in through the top of your head.", affirmation: "I am connected to the divine source of all that is.", hz: 963 },
  { num: 8, name: "Soul Star Chakra", location: "6 inches above the head", color: "White / Magenta", blocked: "Feeling lost in life purpose, spiritual apathy", tip: "Meditate on the question: 'What is my soul here to do?'", affirmation: "I am aligned with my soul's highest purpose.", hz: 1074 },
  { num: 9, name: "Spirit Chakra", location: "12 inches above the head", color: "Gold", blocked: "Disconnection from higher self, lack of spiritual growth", tip: "Journal about moments when you felt guided by something greater.", affirmation: "I am a vessel of divine light and wisdom.", hz: 1185 },
  { num: 10, name: "Universal Chakra", location: "18 inches above the head", color: "Pearlescent", blocked: "Feeling separate from the universe, cosmic loneliness", tip: "Stargaze for 10 minutes and feel your connection to the cosmos.", affirmation: "I am one with the universe and all living things.", hz: 1296 },
  { num: 11, name: "Galactic Chakra", location: "24 inches above the head", color: "Pink-Orange", blocked: "Inability to access past-life wisdom, feeling stuck in cycles", tip: "Practice a past-life regression meditation.", affirmation: "I carry the wisdom of all my lifetimes within me.", hz: 1407 },
  { num: 12, name: "Divine Gateway Chakra", location: "36 inches above the head", color: "Diamond White", blocked: "Complete spiritual disconnection, inability to channel or receive", tip: "Pray or set an intention to open yourself to divine guidance.", affirmation: "I am a pure channel for divine love, light, and healing.", hz: 1518 },
];

const breathworkContent = [
  { name: "Box Breathing", steps: ["Inhale through your nose for 4 counts.", "Hold your breath for 4 counts.", "Exhale slowly through your mouth for 4 counts.", "Hold again (lungs empty) for 4 counts.", "Repeat for 4–8 cycles."] },
  { name: "4-7-8 Breathing", steps: ["Inhale quietly through your nose for 4 counts.", "Hold your breath for 7 counts.", "Exhale completely through your mouth (whoosh sound) for 8 counts.", "Repeat for 3–4 cycles.", "Best done before sleep or when anxious."] },
  { name: "Belly Breathing (Diaphragmatic)", steps: ["Place one hand on your chest, one on your belly.", "Breathe in slowly through your nose — your belly should rise, not your chest.", "Exhale slowly through pursed lips.", "Focus on making the exhale longer than the inhale.", "Continue for 5 minutes."] },
  { name: "Alternate Nostril Breathing (Nadi Shodhana)", steps: ["Sit comfortably. Use your right thumb to close your right nostril.", "Inhale through your left nostril for 4 counts.", "Close your left nostril with your ring finger, release your thumb.", "Exhale through your right nostril for 4 counts.", "Inhale through the right, close it, exhale through the left. Repeat for 5–10 cycles."] },
  { name: "Humming Breath (Bhramari)", steps: ["Sit comfortably and close your eyes.", "Place your index fingers gently on the cartilage of your ears (tragus).", "Inhale deeply through your nose.", "As you exhale, make a steady humming sound like a bee.", "Feel the vibration in your head and chest. Repeat 5–7 times."] },
  { name: "Ocean Breath (Ujjayi)", steps: ["Sit tall and relax your shoulders.", "Inhale through your nose while slightly constricting the back of your throat.", "Exhale through your nose with the same gentle constriction, making a soft ocean sound.", "Keep the breath smooth and even.", "Continue for 5–10 cycles, staying aware of the sound and rhythm."] },
  { name: "Triangle Breathing", steps: ["Inhale through your nose for 4 counts.", "Hold your breath for 4 counts.", "Exhale through your nose for 4 counts.", "Hold again for 4 counts.", "Imagine tracing a triangle with each phase. Repeat for 3–5 minutes."] },
  { name: "Cooling Breath (Sheetali)", steps: ["Sit comfortably with your spine straight.", "Curl the sides of your tongue upward into a tube or keep lips slightly parted if needed.", "Inhale slowly through the tongue or mouth with a cooling sensation.", "Close your mouth and exhale through your nose.", "Repeat for 8–10 breaths until you feel calm and cool."] },
  { name: "Power Breathing", steps: ["Stand or sit tall with shoulders relaxed.", "Inhale deeply through your nose, filling belly and chest.", "Exhale quickly and forcefully through your mouth.", "Continue with strong, active breaths for 30 seconds to 1 minute.", "Slow down and rest with normal breath after each round."] },
  { name: "Heart Coherence", steps: ["Place one hand on your heart and one on your belly.", "Inhale slowly for 5 counts, feeling your heart expand.", "Exhale gently for 5 counts, releasing tension from your chest.", "Imagine your breath flowing in and out through your heart center.", "Continue for 3–5 minutes while thinking of a positive feeling (gratitude, love, safety)."] },
  { name: "Grounding Breath", steps: ["Sit with both feet on the floor and hands resting on your thighs.", "Inhale deeply through your nose, drawing energy up from the earth through your feet.", "Exhale slowly through your nose, releasing tension down through your legs into the ground.", "With each breath, imagine roots extending from your feet into the earth.", "Repeat for 5–10 breaths until you feel stable and centered."] },
];

const vagusNerveContent = {
  explanation: "The vagus nerve is the longest cranial nerve in your body, running from your brainstem all the way down to your gut. It controls your parasympathetic nervous system — your body's 'rest and digest' mode. When your vagus nerve is activated (stimulated), it tells your body: 'You are safe. You can relax.' This lowers heart rate, reduces inflammation, improves digestion, and calms anxiety.",
  techniques: [
    { name: "Cold Water on Face", how: "Splash cold water on your face or hold a cold, wet towel against your cheeks and forehead for 30 seconds. This triggers the 'dive reflex,' which immediately slows your heart rate and activates the vagus nerve." },
    { name: "Humming or Chanting", how: "Hum your favorite tune or chant 'Om' for 2–3 minutes. The vibration in your throat directly stimulates the vagus nerve. You'll feel calmer almost immediately." },
    { name: "Slow, Extended Exhales", how: "Breathe in for 4 counts, then exhale for 8 counts. The long exhale activates the parasympathetic response. Do this for 5–10 breaths." },
    { name: "Gargling", how: "Take a sip of water and gargle vigorously for 30 seconds. The muscles in the back of your throat are connected to the vagus nerve. This is one of the simplest activation techniques." },
    { name: "Laughter", how: "Watch something funny, call a friend who makes you laugh, or practice laughter yoga. Genuine belly laughter stimulates the vagus nerve, releases endorphins, and shifts your nervous system into safety mode." },
  ],
};

const soundHealingContent = [
  { hz: 174, chakra: "Earth Star / Root foundation", effect: "Reduces pain, gives organs a sense of security and comfort. Foundation frequency." },
  { hz: 285, chakra: "Sacral energy field", effect: "Heals and restores tissues. Influences the body's energy field to restructure damaged organs." },
  { hz: 396, chakra: "Root Chakra", effect: "Liberates guilt and fear. Turns grief into joy and helps release deep-seated emotional patterns." },
  { hz: 417, chakra: "Sacral Chakra", effect: "Facilitates change and undoing situations. Cleanses traumatic experiences and clears negative influences." },
  { hz: 528, chakra: "Solar Plexus Chakra", effect: "Known as the 'Love Frequency.' Repairs DNA, brings transformation, miracles, and clarity of purpose." },
  { hz: 639, chakra: "Heart Chakra", effect: "Enhances communication, understanding, tolerance, and love. Heals relationships and connects you to others." },
  { hz: 741, chakra: "Throat Chakra", effect: "Awakens intuition and self-expression. Cleanses cells of toxins and electromagnetic radiation." },
];

const auraCleansingContent = [
  { name: "Salt Bath Cleanse", steps: ["Fill a warm bath with 1–2 cups of sea salt or Himalayan pink salt.", "Add a few drops of essential oil (lavender, frankincense, or sage).", "Soak for 20–30 minutes. Visualize dark or heavy energy dissolving into the water.", "As you drain the tub, imagine all negativity flowing away.", "Pat dry gently and say: 'My energy is clear, my aura is bright.'"] },
  { name: "Smoke Cleansing (Smudging)", steps: ["Light a bundle of dried sage, palo santo, or cedar.", "Hold it at arm's length and let the smoke billow.", "Starting at your feet, slowly wave the smoke upward around your body.", "Pay extra attention to areas that feel heavy (head, heart, stomach).", "Open a window to let the smoke and released energy flow out."] },
  { name: "Visualization & Breathwork", steps: ["Stand or sit comfortably. Close your eyes.", "Imagine a brilliant white or golden light above your head.", "As you inhale, pull that light down through your crown, filling your entire body.", "As you exhale, imagine grey or dark smoke leaving through your feet into the earth.", "Repeat for 3–5 minutes until you feel lighter and brighter."] },
];

const cordCuttingContent = {
  explanation: "Energy cords are invisible emotional and energetic connections between you and another person. They form through close relationships, trauma bonds, or unresolved emotional experiences. Soul ties are deeper spiritual connections — often formed through intimacy, shared trauma, or karmic contracts. Not all cords and soul ties are negative, but unhealthy ones can drain your energy, keep you stuck in the past, and prevent you from moving forward.",
  signs: [
    "You can't stop thinking about someone even though the relationship is over.",
    "You feel emotionally drained after interacting with (or even thinking about) a specific person.",
    "You repeat the same toxic relationship patterns with different people.",
    "You feel physically sick, anxious, or heavy when you think of someone from your past.",
    "You dream about someone frequently, especially in distressing scenarios.",
  ],
  ritual: [
    { step: "Set Your Space", detail: "Find a quiet, private space. Light a candle (white for purity or black for protection). You may also burn sage or palo santo to cleanse the area." },
    { step: "Ground Yourself", detail: "Sit comfortably, close your eyes, and take 5 deep breaths. Visualize roots growing from your body into the earth, anchoring you." },
    { step: "Visualize the Cord", detail: "Imagine the person you want to cut cords with standing in front of you. See the cord connecting you — it may be thick or thin, dark or light. Notice where it attaches to your body." },
    { step: "Cut the Cord", detail: "Visualize a sword of golden light, a pair of scissors, or Archangel Michael's blade. See yourself cutting through the cord with love, not anger. Say: 'I release this cord with love. I am free, and so are you.'" },
    { step: "Seal and Heal", detail: "Imagine golden light flooding the area where the cord was attached, healing and sealing it. Place your hand there and say your healing affirmation. Blow out the candle to close the ritual." },
  ],
  affirmation: "I release all cords and ties that no longer serve my highest good. I am free, whole, and sovereign in my energy. I send love and move forward in peace.",
};

const movementContent = [
  { emoji: "💃", name: "Intuitive Dance", what: "Free-form dance with no choreography — you move however your body wants to move, guided by music and emotion rather than technique.", why: "Dance bypasses the thinking mind and goes straight into the body where emotions are stored. When you let your body lead, suppressed feelings like grief, rage, and joy can surface and release through movement.", beginner: ["Put on a song that matches your current mood — or one that feels opposite to shift your energy.", "Close your eyes. Stand with feet hip-width apart.", "Let your body sway, shake, stomp, or flow — no rules.", "If you feel stuck, start by swaying your hips or rolling your shoulders.", "Dance for one full song (3–5 minutes). Build up over time."] },
  { emoji: "🌊", name: "Interpretive Movement", what: "Using your body to physically express an emotion, story, or experience — almost like acting through movement instead of words.", why: "Many emotions are 'unspeakable' — they live in the body as tension, numbness, or heaviness. Interpretive movement gives them a language without words, helping process trauma and grief that talk therapy can't always reach.", beginner: ["Choose one emotion you're feeling right now (sadness, anger, relief, etc.).", "Stand in an open space and close your eyes.", "Ask yourself: 'If this feeling had a movement, what would it look like?'", "Move slowly — reach, curl, push, collapse, expand.", "There is no wrong way. Let the movement be ugly, beautiful, or strange."] },
  { emoji: "🤸", name: "Fluid Calisthenics", what: "Bodyweight exercises performed slowly and fluidly — combining strength, flexibility, and breath in flowing sequences rather than rigid reps.", why: "Fluid calisthenics builds a strong, resilient body while teaching you to move through resistance with grace — a physical metaphor for emotional resilience. The slow, intentional movement calms the nervous system.", beginner: ["Start with 3 movements: slow push-ups, deep squats, and flowing lunges.", "Move at half speed — focus on smooth transitions between each move.", "Breathe deeply: inhale on the easy part, exhale on the effort.", "Flow between the 3 moves without stopping for 5 minutes.", "Add gentle music to keep the rhythm slow and intentional."] },
  { emoji: "🧘", name: "Yoga Flow", what: "A series of yoga poses linked together with breath, creating a moving meditation that stretches, strengthens, and calms the body and mind.", why: "Yoga targets the fascia and connective tissue where emotional trauma is physically stored. Hip openers release grief, backbends release fear, and twists wring out tension. The breathwork component activates the parasympathetic nervous system.", beginner: ["Start with a simple Sun Salutation (5 minutes).", "Move slowly: Mountain Pose → Forward Fold → Halfway Lift → Plank → Cobra → Downward Dog.", "Hold each pose for 3–5 breaths before transitioning.", "Focus on your breath more than perfect form.", "End in Child's Pose for 1–2 minutes to integrate."] },
  { emoji: "🫨", name: "Shaking / Tremoring Release (TRE)", what: "Trauma Release Exercises — a series of simple exercises that activate your body's natural tremor mechanism to release deep muscular tension caused by stress, trauma, or PTSD.", why: "Animals in the wild shake after a threat to discharge stress hormones. Humans suppress this reflex. TRE reactivates it, allowing the body to complete its natural stress cycle and release trapped fight-or-flight energy.", beginner: ["Stand with feet shoulder-width apart. Do 10 slow squats.", "Hold a wall sit for 1–2 minutes until your legs start trembling.", "Lie on your back with knees bent, feet flat on the floor.", "Let your knees fall open slightly — the trembling will start naturally.", "Allow the shaking for 5–15 minutes. Stop anytime if it feels too intense."] },
  { emoji: "☯️", name: "Tai Chi", what: "An ancient Chinese martial art practiced as a slow, graceful sequence of movements combined with deep breathing and mental focus — often called 'meditation in motion.'", why: "Tai Chi regulates the flow of qi (life force energy) through your body's meridian system. Blocked qi manifests as emotional stagnation, anxiety, and physical pain. The slow, deliberate movements unblock these pathways.", beginner: ["Start with the 'Commencement' form: stand with feet shoulder-width, arms at sides.", "Slowly raise both arms to shoulder height as you inhale.", "Lower them back down as you exhale.", "Repeat 10 times, making each movement slower than the last.", "Search for 'Tai Chi for Beginners — 8 Form' on YouTube for a guided sequence."] },
  { emoji: "🥋", name: "Qigong", what: "An ancient Chinese practice combining slow, rhythmic movements, controlled breathing, and focused meditation to cultivate and balance life energy (qi).", why: "Qigong works directly with your body's energy system. Stagnant emotions create energetic blockages that manifest as pain, fatigue, and emotional numbness. Qigong's gentle movements and breathwork clear these blockages.", beginner: ["Stand with feet hip-width apart, knees slightly bent.", "Place both hands over your lower belly (dan tian — your energy center).", "Breathe in slowly, imagining warm golden light filling your belly.", "As you exhale, slowly raise your hands to chest height, palms up.", "Lower them back down on the next inhale. Repeat for 5 minutes."] },
  { emoji: "🚶", name: "Walking Meditation", what: "Extremely slow, intentional walking where every step is a meditation — focusing on the sensation of your feet touching the ground, your weight shifting, and your breath.", why: "Walking meditation grounds you in the present moment and reconnects you to your body. It's especially powerful for people who find sitting meditation too difficult or triggering.", beginner: ["Find a quiet space — indoors or outdoors, about 10–20 feet of straight path.", "Stand still for 3 breaths. Feel your feet on the ground.", "Lift one foot very slowly. Notice the sensation of lifting, moving, placing.", "Take 10 steps in one direction, then turn around slowly.", "Walk for 5–10 minutes. Speed is not the goal — awareness is."] },
  { emoji: "🌀", name: "Somatic Movement", what: "Gentle, internally-focused movements designed to retrain your brain's control over your muscles — releasing chronic tension patterns caused by stress, trauma, and habitual postures.", why: "Trauma lives in the body as chronic muscle tension (called Sensory Motor Amnesia). Your brain 'forgets' how to relax certain muscles. Somatic movement gently re-educates the nervous system to release this holding.", beginner: ["Lie on your back with knees bent.", "Slowly arch your lower back (inhale), then flatten it to the floor (exhale).", "Make the movement tiny and slow — focus on sensation, not stretch.", "Do this 10 times, making each rep slower.", "Notice any areas that feel 'stuck' — breathe into them without forcing."] },
  { emoji: "🎭", name: "Expressive Movement Therapy", what: "A therapeutic approach that uses creative movement, gestures, and body expression to explore and process emotions — often guided by a trained therapist but can be practiced solo.", why: "When words fail, the body speaks. Expressive movement allows unconscious emotions to surface through physical expression, making the invisible visible and the unspeakable expressible.", beginner: ["Choose a prompt: 'Show me what your anxiety looks like in your body.'", "Stand in an open space and begin moving in response — no thinking.", "Use your arms, torso, legs, and face to express the feeling.", "After 2–3 minutes, shift the prompt: 'Now show me what peace looks like.'", "Notice the difference in your body. Journal about what you discovered."] },
  { emoji: "👐", name: "EFT Tapping", what: "Emotional Freedom Technique — tapping on specific acupressure points (meridian endpoints) on your face and body while speaking about emotional issues, combining ancient Chinese medicine with modern psychology.", why: "Tapping sends calming signals to the amygdala (your brain's fear center), reducing the emotional charge of traumatic memories and negative beliefs. It literally rewires your stress response.", beginner: ["Identify your issue and rate its intensity 0–10.", "Tap the side of your hand (karate chop point) while saying: 'Even though I feel [emotion], I deeply and completely accept myself.' Repeat 3 times.", "Tap 5–7 times on each point: top of head, eyebrow, side of eye, under eye, under nose, chin, collarbone, under arm.", "While tapping, describe what you feel: 'This tightness in my chest, this sadness.'", "After 2–3 rounds, re-rate your intensity. Repeat until it drops."] },
];

/* ───────── SECTION MAP ───────── */

type SectionKey = "meditation" | "chakras" | "breathwork" | "vagus-nerve" | "sound-healing" | "aura-cleansing" | "cord-cutting" | "movement" | "connect-healer";

const sectionTitles: Record<SectionKey, string> = {
  meditation: "Meditation",
  chakras: "The 13 Chakras",
  breathwork: "Breathwork",
  "vagus-nerve": "Vagus Nerve & Nervous System",
  "sound-healing": "Sound Healing",
  "aura-cleansing": "Aura Cleansing",
  "cord-cutting": "Cord Cutting & Soul Ties",
  movement: "Movement as Medicine",
  "connect-healer": "Connect to a Healer",
};

/* ───────── DETAIL RENDERER ───────── */

function ReadButton({ title, steps, reading, readSteps, stop }: {
  title: string; steps: string[];
  reading: boolean;
  readSteps: (title: string, steps: string[]) => void;
  stop: () => void;
}) {
  return (
    <button
      onClick={() => reading ? stop() : readSteps(title, steps)}
      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all ${reading ? "border-blue-400/60 bg-blue-500/15 text-blue-300" : "border-border bg-muted/50 text-muted-foreground hover:text-foreground hover:border-primary/40"}`}
    >
      <Volume2 className="h-3 w-3" />
      {reading ? "Stop reading" : "Read to me"}
    </button>
  );
}

function SectionContent({ id, reading, readSteps, stopReading }: {
  id: SectionKey;
  reading: boolean;
  readSteps: (title: string, steps: string[]) => void;
  stopReading: () => void;
}) {
  switch (id) {
    case "meditation":
      return (
        <div className="space-y-6">
          <p className="text-muted-foreground leading-relaxed">{meditationContent.intro}</p>
          {meditationContent.types.map((t) => (
            <div key={t.name} className="bg-muted/40 rounded-xl p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display text-lg font-bold text-foreground">{t.name}</h3>
                <ReadButton title={t.name} steps={t.steps} reading={reading} readSteps={readSteps} stop={stopReading} />
              </div>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground text-sm">
                {t.steps.map((s, i) => <li key={i}>{s}</li>)}
              </ol>
              <p className="text-xs text-healing-breathe italic">💡 Tip: {t.tip}</p>
            </div>
          ))}
        </div>
      );

    case "chakras":
      return (
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm mb-2">From Earth Star (below your feet) up to the Divine Gateway (above your head).</p>
          {chakrasContent.map((c) => (
            <div key={c.num} className="bg-muted/40 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold bg-primary/20 text-primary rounded-full px-2 py-0.5">#{c.num}</span>
                <h3 className="font-display text-base font-bold text-foreground">{c.name}</h3>
              </div>
              <p className="text-xs text-muted-foreground"><strong>Location:</strong> {c.location}</p>
              <p className="text-xs text-muted-foreground"><strong>Color:</strong> {c.color}</p>
              <p className="text-xs text-muted-foreground"><strong>When blocked:</strong> {c.blocked}</p>
              <p className="text-xs text-healing-breathe"><strong>Healing tip:</strong> {c.tip}</p>
              <p className="text-xs text-healing-wisdom italic">✨ "{c.affirmation}"</p>
              <p className="text-xs text-muted-foreground"><strong>Tuning Fork:</strong> {c.hz} Hz</p>
            </div>
          ))}
        </div>
      );

    case "breathwork":
      return (
        <div className="space-y-6">
          {breathworkContent.map((b) => (
            <div key={b.name} className="bg-muted/40 rounded-xl p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display text-lg font-bold text-foreground">{b.name}</h3>
                <ReadButton title={b.name} steps={b.steps} reading={reading} readSteps={readSteps} stop={stopReading} />
              </div>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground text-sm">
                {b.steps.map((s, i) => <li key={i}>{s}</li>)}
              </ol>
            </div>
          ))}
        </div>
      );

    case "vagus-nerve":
      return (
        <div className="space-y-6">
          <p className="text-muted-foreground leading-relaxed">{vagusNerveContent.explanation}</p>
          <h3 className="font-display text-lg font-bold text-foreground">5 Quick Activation Techniques</h3>
          {vagusNerveContent.techniques.map((t) => (
            <div key={t.name} className="bg-muted/40 rounded-xl p-4 space-y-2">
              <h4 className="font-display font-bold text-foreground">{t.name}</h4>
              <p className="text-sm text-muted-foreground">{t.how}</p>
            </div>
          ))}
        </div>
      );

    case "sound-healing":
      return (
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm mb-2">The 7 Solfeggio Frequencies — ancient tones used for spiritual and physical healing.</p>
          {soundHealingContent.map((s) => (
            <div key={s.hz} className="bg-muted/40 rounded-xl p-4 space-y-2">
              <h3 className="font-display text-lg font-bold text-foreground">{s.hz} Hz</h3>
              <p className="text-xs text-healing-tools"><strong>Chakra:</strong> {s.chakra}</p>
              <p className="text-sm text-muted-foreground">{s.effect}</p>
            </div>
          ))}
        </div>
      );

    case "aura-cleansing":
      return (
        <div className="space-y-6">
          <p className="text-muted-foreground text-sm">3 simple techniques anyone can do at home to cleanse and protect their aura.</p>
          {auraCleansingContent.map((a) => (
            <div key={a.name} className="bg-muted/40 rounded-xl p-4 space-y-3">
              <h3 className="font-display text-lg font-bold text-foreground">{a.name}</h3>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground text-sm">
                {a.steps.map((s, i) => <li key={i}>{s}</li>)}
              </ol>
            </div>
          ))}
        </div>
      );

    case "cord-cutting":
      return (
        <div className="space-y-6">
          <p className="text-muted-foreground leading-relaxed">{cordCuttingContent.explanation}</p>
          <div className="bg-muted/40 rounded-xl p-4 space-y-2">
            <h3 className="font-display text-lg font-bold text-foreground">5 Signs You Need Cord Cutting</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
              {cordCuttingContent.signs.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
          <h3 className="font-display text-lg font-bold text-foreground">The 5-Step Cord Cutting Ritual</h3>
          {cordCuttingContent.ritual.map((r, i) => (
            <div key={i} className="bg-muted/40 rounded-xl p-4 space-y-2">
              <h4 className="font-display font-bold text-foreground">Step {i + 1}: {r.step}</h4>
              <p className="text-sm text-muted-foreground">{r.detail}</p>
            </div>
          ))}
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
            <p className="text-sm text-foreground italic text-center">🕊️ "{cordCuttingContent.affirmation}"</p>
          </div>
        </div>
      );

    case "movement":
      return (
        <div className="space-y-6">
          <p className="text-muted-foreground leading-relaxed">Movement is one of the most ancient and effective ways to release emotions trapped in the body. When we experience stress, trauma, or grief, the energy often gets stuck in our muscles, fascia, and nervous system. These 11 practices help you move that energy out — no gym required, no experience needed.</p>
          {movementContent.map((m) => (
            <div key={m.name} className="bg-muted/40 rounded-xl p-4 space-y-3">
              <h3 className="font-display text-lg font-bold text-foreground">{m.emoji} {m.name}</h3>
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-foreground">What it is</h4>
                <p className="text-sm text-muted-foreground">{m.what}</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-foreground">Why it moves stuck emotions</h4>
                <p className="text-sm text-muted-foreground">{m.why}</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-foreground">How to start as a beginner</h4>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground text-sm">
                  {m.beginner.map((s, i) => <li key={i}>{s}</li>)}
                </ol>
              </div>
              <Button
                className="w-full mt-2 bg-gradient-to-r from-primary to-secondary text-primary-foreground font-display rounded-xl"
                onClick={() => {}}
              >
                <CalendarCheck className="h-4 w-4 mr-2" />
                Connect with a Healer or Teacher
              </Button>
            </div>
          ))}
        </div>
      );

    case "connect-healer":
      return (
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-6 text-center">
          <p className="text-muted-foreground text-lg leading-relaxed max-w-sm">
            Ready to go deeper? Connect with a verified spiritual practitioner, energy healer, or holistic therapist for personalized guidance.
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-secondary text-primary-foreground font-display text-lg px-8 py-6 rounded-2xl shadow-lg"
            onClick={() => {}}
          >
            <CalendarCheck className="h-5 w-5 mr-2" />
            Book a One-on-One Session
          </Button>
        </div>
      );
  }
}

/* ───────── MAIN COMPONENT ───────── */

export default function BreatheDetail() {
  const { section } = useParams<{ section: string }>();
  const navigate = useNavigate();
  const id = section as SectionKey;
  const title = sectionTitles[id];
  const { playing: ambientPlaying, start: startAmbient, stop: stopAmbient } = useAmbientSound();
  const { reading, readSteps, stop: stopReading } = useStepReader();

  if (!title) {
    navigate("/breathe", { replace: true });
    return null;
  }

  const showPortal = ["meditation", "chakras", "sound-healing", "aura-cleansing"].includes(id);
  const showBook   = ["breathwork", "vagus-nerve", "cord-cutting"].includes(id);
  const showSafetyDisclaimer = ["breathwork", "chakras", "vagus-nerve", "sound-healing", "aura-cleansing", "cord-cutting", "movement"].includes(id);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col min-h-0 bg-gradient-to-br from-violet-950 via-slate-950 to-sky-950"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3 flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate("/breathe")} aria-label="Back">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="font-display text-xl font-bold text-foreground truncate flex-1">{title}</h1>
        {/* Ambient sound toggle */}
        <button
          onClick={() => ambientPlaying ? stopAmbient() : startAmbient()}
          aria-label={ambientPlaying ? "Stop ambient sounds" : "Play ambient meditation sounds"}
          title={ambientPlaying ? "Stop ambient sounds" : "Ambient meditation sounds"}
          className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border transition-all ${ambientPlaying ? "border-teal-400/60 bg-teal-500/15 text-teal-300" : "border-border bg-muted/40 text-muted-foreground hover:text-foreground"}`}
        >
          {ambientPlaying ? <VolumeX className="h-3.5 w-3.5" /> : <Music className="h-3.5 w-3.5" />}
          <span className="hidden sm:inline">{ambientPlaying ? "Mute" : "Ambient"}</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-32">
        {showSafetyDisclaimer && (
          <div className="space-y-4 bg-muted/70 border border-border/80 rounded-3xl p-4 mb-6">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Some breathwork and energy practices can surface deep emotions or trauma. You are never alone here. Intercessors and healers are always on standby to support you. If you feel overwhelmed stop and reach out.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                className="w-full bg-white/10 text-foreground border border-border hover:bg-white/20"
                onClick={() => navigate("/shop")}
              >
                Connect to an Intercessor
              </Button>
              <Button
                className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground"
                onClick={() => navigate("/shop")}
              >
                Connect to a Healer
              </Button>
            </div>
          </div>
        )}
        <SectionContent id={id} reading={reading} readSteps={readSteps} stopReading={stopReading} />
      </div>

      {/* Bottom CTA */}
      {(showPortal || showBook) && (
        <div className="sticky bottom-0 p-4 bg-background/90 backdrop-blur-md border-t border-border">
          <Button
            className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-display rounded-xl py-6 text-base"
            size="lg"
            onClick={() => navigate("/shop")}
          >
            <CalendarCheck className="h-5 w-5 mr-2" />
            {showBook ? "Book a Session" : "Visit the Portal"}
          </Button>
        </div>
      )}
    </motion.div>
  );
}
