import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Compass, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

type SectionKey =
  | "what-is-source"
  | "chakra-system"
  | "nervous-system"
  | "vagus-nerve"
  | "tuning-fork-therapy"
  | "pain-body-map"
  | "generational-illness"
  | "how-breathwork-works"
  | "how-sound-healing-works"
  | "how-energy-work-functions"
  | "spiritual-gifts-explained"
  | "power-of-words"
  | "reflexology-and-meridians"
  | "sacred-nourishment"
  | "essential-oils"
  | "crystal-and-stone-properties"
  | "plant-medicine-and-herbs"
  | "dream-interpretation"
  | "astrology-basics"
  | "sacred-geometry"
  | "your-spiritual-gifts"
  | "numerology-and-angel-numbers";

const sectionTitles: Record<SectionKey, string> = {
  "what-is-source": "What is Source",
  "chakra-system": "Chakra System",
  "nervous-system": "Nervous System and Polyvagal Theory",
  "vagus-nerve": "Vagus Nerve Activation",
  "tuning-fork-therapy": "Tuning Fork Therapy",
  "pain-body-map": "Emotional Pain Body Map",
  "generational-illness": "Generational Illness and Clearing",
  "how-breathwork-works": "How Breathwork Works",
  "how-sound-healing-works": "How Sound Healing Works",
  "how-energy-work-functions": "How Energy Work Functions",
  "spiritual-gifts-explained": "Spiritual Gifts Explained",
  "power-of-words": "Power of Words",
  "reflexology-and-meridians": "Reflexology and Meridians",
  "sacred-nourishment": "Sacred Nourishment",
  "essential-oils": "Essential Oils Education",
  "crystal-and-stone-properties": "Crystal and Stone Properties",
  "plant-medicine-and-herbs": "Plant Medicine and Herbs",
  "dream-interpretation": "Dream Interpretation",
  "astrology-basics": "Astrology Basics",
  "sacred-geometry": "Sacred Geometry",
  "your-spiritual-gifts": "Understanding Your Spiritual Gifts",
  "numerology-and-angel-numbers": "Numerology and Angel Numbers",
};

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-muted/60 rounded-2xl p-4 border border-border/60 space-y-2">
      <h2 className="font-display text-base font-bold text-foreground">{title}</h2>
      <div className="text-sm text-muted-foreground leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="list-disc list-inside space-y-1">
      {items.map((item, i) => <li key={i}>{item}</li>)}
    </ul>
  );
}

function SectionContent({ id }: { id: SectionKey }) {
  switch (id) {

    case "what-is-source":
      return (
        <div className="space-y-4">
          <Block title="The Living Intelligence Behind All Things">
            <p>Source — called God, the Divine, the Universe, the All, the I AM, the Tao, the Great Spirit — is the originating intelligence from which all life emerges. It is not a distant overseer but the living field in which you exist, move, and are known.</p>
            <p>Every healing modality, whether ancient or modern, points back to the same truth: there is an intelligent, loving force sustaining creation. You were not an accident. You are a specific, intentional expression of Source consciousness.</p>
          </Block>
          <Block title="How Traditions Describe Source">
            <List items={[
              "Christianity — God as Father, Son, and Holy Spirit; the eternal I AM who is love itself",
              "Indigenous traditions — the Great Spirit, the sacred web connecting all living things",
              "Hinduism — Brahman, the infinite consciousness underlying all forms",
              "Buddhism — the Dharmakaya, the boundless awareness in which all phenomena arise",
              "Taoism — the Tao, the unnameable flow from which all things emerge and return",
              "New Thought / Metaphysics — Universal Mind, infinite intelligence, the Absolute",
            ]} />
          </Block>
          <Block title="Why This Matters for Healing">
            <p>When you understand that you come from an intelligent loving Source, the question changes from 'Why is this happening to me?' to 'What is this teaching me, and where is Source in it?'</p>
            <p>Healing is not about fixing what is broken. It is about returning to the original wholeness you never actually lost. Source does not see you as damaged. It sees you as complete — in process, in growth, in becoming.</p>
          </Block>
          <Block title="Living from Source Consciousness">
            <List items={[
              "Stillness — Source is accessed in quiet, not noise",
              "Surrender — healing accelerates when you release the need to control outcomes",
              "Trust — belief that Source is working even when you cannot see the evidence",
              "Identity — knowing yourself as an expression of Source changes every relationship",
            ]} />
          </Block>
        </div>
      );

    case "chakra-system":
      return (
        <div className="space-y-4">
          <Block title="What Are Chakras?">
            <p>Chakras are spinning energy centers within and around the body that govern physical health, emotional states, mental patterns, and spiritual connection. When energy flows freely through them, you experience vitality, clarity, and wholeness. Blockages create illness, emotional heaviness, and disconnection.</p>
          </Block>
          <Block title="The 12 Chakras + Earth Star">
            <div className="space-y-3">
              {[
                { name: "Earth Star", location: "Below the feet", color: "Charcoal / Deep Brown", governs: "Grounding to Earth's core, ancestral healing, physical stability" },
                { name: "Root (Muladhara)", location: "Base of the spine", color: "Red", governs: "Safety, survival, belonging, the right to exist" },
                { name: "Sacral (Svadhisthana)", location: "Lower abdomen", color: "Orange", governs: "Creativity, sexuality, pleasure, emotional fluidity" },
                { name: "Solar Plexus (Manipura)", location: "Upper abdomen", color: "Yellow", governs: "Personal power, will, self-worth, identity" },
                { name: "Heart (Anahata)", location: "Center of the chest", color: "Green", governs: "Love, compassion, forgiveness, connection" },
                { name: "Higher Heart / Thymus", location: "Between heart and throat", color: "Aqua / Teal", governs: "Unconditional love, divine compassion, immune response" },
                { name: "Throat (Vishuddha)", location: "Throat", color: "Blue", governs: "Truth, expression, authentic voice, communication" },
                { name: "Third Eye (Ajna)", location: "Between the eyebrows", color: "Indigo", governs: "Intuition, insight, clairvoyance, spiritual vision" },
                { name: "Crown (Sahasrara)", location: "Top of the head", color: "Violet / White", governs: "Divine connection, unity consciousness, enlightenment" },
                { name: "Causal Chakra", location: "Above the head — 3–6 inches", color: "White / Pale Gold", governs: "Soul history, past lives, karma, spiritual purpose" },
                { name: "Soul Star", location: "Above the head — 6–12 inches", color: "Gold / Magenta", governs: "Higher self connection, akashic records, soul blueprint" },
                { name: "Stellar Gateway", location: "Above the head — 12–18 inches", color: "Diamond / Platinum", governs: "Cosmic consciousness, communication with higher realms" },
                { name: "Universal Gateway", location: "Above the head — 18+ inches", color: "Pure White / Clear", governs: "Direct Source connection, pure divine emanation" },
              ].map((c) => (
                <div key={c.name} className="border border-border/40 rounded-xl p-3 space-y-1">
                  <p className="font-semibold text-foreground text-sm">{c.name}</p>
                  <p className="text-xs">Location: {c.location} · Color: {c.color}</p>
                  <p className="text-xs">{c.governs}</p>
                </div>
              ))}
            </div>
          </Block>
          <Block title="Signs of Blockage and How to Clear">
            <List items={[
              "Root — anxiety, financial fear, feeling unsafe → grounding exercises, walking barefoot, red foods",
              "Sacral — creative blocks, emotional numbness, intimacy issues → dance, water therapy, orange foods",
              "Solar Plexus — low confidence, people-pleasing, victim mindset → core work, breathwork, sunlight",
              "Heart — grief, isolation, inability to receive love → heart opening yoga, rose quartz, forgiveness work",
              "Throat — difficulty speaking truth, silencing self → singing, journaling, blue stones",
              "Third Eye — overthinking, distrust of intuition → meditation, fasting, lapis lazuli",
              "Crown — spiritual disconnection, depression → silence, prayer, fasting, amethyst",
            ]} />
          </Block>
        </div>
      );

    case "nervous-system":
      return (
        <div className="space-y-4">
          <Block title="The Autonomic Nervous System">
            <p>Your autonomic nervous system (ANS) governs every function you do not consciously control — breathing, heart rate, digestion, immune response. It has two major branches: the sympathetic system (mobilization) and the parasympathetic system (rest and restoration).</p>
            <p>Trauma, chronic stress, and childhood wounds dysregulate the ANS. Most healing modalities work — whether they know it or not — by restoring nervous system regulation.</p>
          </Block>
          <Block title="Polyvagal Theory — Dr. Stephen Porges">
            <p>Polyvagal Theory identifies three hierarchical states of the nervous system, each with its own physiology and behavior profile:</p>
            <div className="space-y-2">
              <div className="border border-border/40 rounded-xl p-3">
                <p className="font-semibold text-foreground">1. Ventral Vagal — Safe and Social</p>
                <p className="text-xs mt-1">The optimal state. You feel safe, connected, curious, creative, and open. Your face is expressive, voice melodic, heart rate regulated. This is where healing, learning, and love happen.</p>
              </div>
              <div className="border border-border/40 rounded-xl p-3">
                <p className="font-semibold text-foreground">2. Sympathetic — Fight or Flight</p>
                <p className="text-xs mt-1">Activated by perceived threat. Heart races, muscles tense, digestion halts. You become reactive, defensive, anxious, or aggressive. Helpful for real danger — harmful when chronic.</p>
              </div>
              <div className="border border-border/40 rounded-xl p-3">
                <p className="font-semibold text-foreground">3. Dorsal Vagal — Freeze and Collapse</p>
                <p className="text-xs mt-1">The shutdown state. When threat is inescapable, the body collapses into numbness, dissociation, depression, and immobility. A primal survival response that becomes traumatic when stuck.</p>
              </div>
            </div>
          </Block>
          <Block title="Neuroception — Your Body's Threat Detector">
            <p>Neuroception is the unconscious scanning your nervous system does constantly — before your conscious mind is even aware. It reads facial expressions, tone of voice, posture, and environment for signals of safety or danger. Trauma rewires neuroception to over-detect danger even in safe situations.</p>
          </Block>
          <Block title="Window of Tolerance">
            <p>The window of tolerance is the zone in which your nervous system can process experiences without becoming overwhelmed (hyperarousal) or shutting down (hypoarousal). Expanding this window is the goal of trauma-informed healing. Breathwork, somatic therapy, EMDR, and safe relationships all widen it.</p>
          </Block>
          <Block title="Returning to Safety">
            <List items={[
              "Slow, extended exhales activate the parasympathetic branch immediately",
              "Eye contact with a safe person shifts the system toward ventral vagal",
              "Humming and singing stimulate the vagus nerve directly",
              "Orienting (slowly looking around the room) signals safety to the brainstem",
              "Gentle movement and rocking regulate the nervous system at a primal level",
            ]} />
          </Block>
        </div>
      );

    case "vagus-nerve":
      return (
        <div className="space-y-4">
          <Block title="What is the Vagus Nerve?">
            <p>The vagus nerve is the longest cranial nerve in the body. It runs from the brainstem through the neck, chest, and abdomen — connecting the brain to the heart, lungs, gut, liver, and immune system. Its name comes from the Latin word for wandering, because it wanders through the entire body.</p>
            <p>It is the primary pathway of the parasympathetic nervous system. High vagal tone means your body can quickly shift from stress back to calm. Low vagal tone is associated with anxiety, depression, inflammation, digestive issues, and heart disease.</p>
          </Block>
          <Block title="What the Vagus Nerve Regulates">
            <List items={[
              "Heart rate and blood pressure",
              "Breathing rhythm and lung function",
              "Digestive motility and gut microbiome signaling",
              "Immune response and inflammation control",
              "Emotional regulation and the felt sense of safety",
              "Social engagement — facial expression, voice tone, listening",
              "The gut-brain axis — 80% of vagal signals travel upward from gut to brain",
            ]} />
          </Block>
          <Block title="How to Activate and Tone the Vagus Nerve">
            <div className="space-y-2">
              {[
                { method: "Humming and Chanting", desc: "Vibrates the vagus nerve directly through the throat. Hum for 5 minutes daily or chant 'OM' to activate the parasympathetic response." },
                { method: "Cold Water Exposure", desc: "Splashing cold water on the face or a cold shower activates the dive reflex — an immediate vagal response that slows heart rate." },
                { method: "Extended Exhale Breathing", desc: "Breathe in for 4 counts, out for 8. The exhale phase is controlled by the vagus nerve. Lengthening it directly tones vagal output." },
                { method: "Gargling", desc: "Gargling vigorously with water stimulates the vagal branches in the back of the throat. Do it for 30–60 seconds daily." },
                { method: "Singing and Vocal Toning", desc: "Activates the same vagal branches as humming — with added resonance from the full vocal range." },
                { method: "Safe Social Connection", desc: "Eye contact, attuned conversation, and physical touch with trusted people are among the most powerful vagal regulators." },
                { method: "Laughter and Play", desc: "Genuine laughter creates strong vagal tone through diaphragmatic engagement and social bonding." },
              ].map((item) => (
                <div key={item.method} className="border border-border/40 rounded-xl p-3">
                  <p className="font-semibold text-foreground text-sm">{item.method}</p>
                  <p className="text-xs mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </Block>
        </div>
      );

    case "tuning-fork-therapy":
      return (
        <div className="space-y-4">
          <Block title="What is Tuning Fork Therapy?">
            <p>Tuning fork therapy uses precision-calibrated metal forks that vibrate at specific frequencies when struck. These frequencies interact with the body's own biofield, tissues, and nervous system — restoring coherence where there is dissonance.</p>
            <p>Everything vibrates. Cells, organs, bones, emotions, and thoughts all carry frequencies. When one part of the system falls out of resonance due to trauma, illness, or stress, sound frequencies can help entrain it back into alignment.</p>
          </Block>
          <Block title="Key Therapeutic Frequencies">
            <div className="space-y-2">
              {[
                { hz: "128 Hz", use: "Bone and tissue healing, grounding, pain relief. Applied directly to the body." },
                { hz: "256 Hz", use: "Root chakra clearing. Deep physical stabilization." },
                { hz: "396 Hz", use: "Liberating guilt and fear. Often used for trauma work." },
                { hz: "417 Hz", use: "Facilitating change, clearing negative patterns." },
                { hz: "432 Hz", use: "Natural harmonic tuning — considered the frequency of the universe. Calming, centering, deeply restoring." },
                { hz: "528 Hz", use: "The 'Love Frequency.' Associated with DNA repair, transformation, and miracles." },
                { hz: "639 Hz", use: "Harmonizing relationships and healing the heart field." },
                { hz: "741 Hz", use: "Detoxifying the body, awakening intuition." },
                { hz: "852 Hz", use: "Returning to spiritual order and higher self connection." },
                { hz: "963 Hz", use: "Crown chakra activation, unity consciousness, oneness with Source." },
              ].map((f) => (
                <div key={f.hz} className="flex gap-3 border border-border/40 rounded-xl p-3">
                  <span className="font-bold text-primary text-sm flex-shrink-0 w-16">{f.hz}</span>
                  <span className="text-xs">{f.use}</span>
                </div>
              ))}
            </div>
          </Block>
          <Block title="432 Hz vs 440 Hz">
            <p>Standard modern tuning is 440 Hz — established globally in 1953. Many healers and researchers assert that 432 Hz is the natural mathematical frequency of the universe, aligned with Fibonacci proportions and the resonance of nature. Music tuned to 432 Hz is reported to feel warmer, more meditative, and harmonically coherent with the body.</p>
          </Block>
          <Block title="How to Use Tuning Forks">
            <List items={[
              "Weighted forks — struck and applied to the body; used for physical and chakra work",
              "Unweighted forks — struck and held near the ears or around the auric field",
              "Begin with grounding frequencies before moving to higher chakra frequencies",
              "Use biofield tuning to scan and clear the energy field around the body",
            ]} />
          </Block>
        </div>
      );

    case "pain-body-map":
      return (
        <div className="space-y-4">
          <Block title="Your Body Keeps the Score">
            <p>The body is not merely a vessel for the mind. It is a living archive of every experience you have ever had. Unprocessed emotions are not just psychological — they are physically stored in muscle tissue, fascia, organs, and the nervous system.</p>
            <p>Bessel van der Kolk's research demonstrated that trauma bypasses the rational mind entirely and lives in the body as sensation, tension, and physical patterns. Healing requires reaching the body — not just the intellect.</p>
          </Block>
          <Block title="Emotional Map of the Body">
            <div className="space-y-2">
              {[
                { region: "Head and Skull", emotion: "Overthinking, mental control, ancestral thought patterns", note: "Tension headaches are often suppressed grief or rage" },
                { region: "Throat and Neck", emotion: "Unexpressed truth, swallowed words, silenced voice", note: "Thyroid imbalances frequently correlate with unexpressed needs" },
                { region: "Chest and Heart", emotion: "Grief, heartbreak, loss, longing, betrayal", note: "Lung conditions are often linked to prolonged sadness" },
                { region: "Shoulders and Upper Back", emotion: "Burdens, responsibility, carrying others' pain", note: "'The weight of the world' manifests literally here" },
                { region: "Solar Plexus and Stomach", emotion: "Anxiety, powerlessness, shame, gut fear", note: "Nausea, IBS, and digestive disorders often have emotional roots" },
                { region: "Hips and Sacral Area", emotion: "Stored trauma, sexual wounds, creative blocks, survival fear", note: "The body's emotional storage center in somatic therapy" },
                { region: "Lower Back", emotion: "Fear, financial insecurity, lack of support", note: "Correlates to root chakra in TCM and chakra systems" },
                { region: "Thighs and Knees", emotion: "Pride, stubbornness, fear of moving forward, resistance to change", note: "Knee issues often arise during major life transitions" },
                { region: "Feet and Ankles", emotion: "Fear of the future, grounding, trust in the path ahead", note: "Foot pain may indicate resistance to one's life direction" },
                { region: "Jaw and Face", emotion: "Repressed anger, control, perfectionism", note: "TMJ and jaw tension almost universally linked to held anger" },
              ].map((area) => (
                <div key={area.region} className="border border-border/40 rounded-xl p-3 space-y-1">
                  <p className="font-semibold text-foreground text-sm">{area.region}</p>
                  <p className="text-xs">Emotion: {area.emotion}</p>
                  <p className="text-xs italic opacity-80">{area.note}</p>
                </div>
              ))}
            </div>
          </Block>
          <Block title="How to Work with the Body">
            <List items={[
              "Somatic therapy — tracking sensation as a path to releasing stored trauma",
              "Breathwork — accessing subconscious emotional material through the breath",
              "EMDR — bilateral stimulation to process traumatic body memories",
              "Dance and movement — authentic movement to discharge held emotion",
              "Massage and bodywork — physical contact that allows the body to feel safe enough to release",
            ]} />
          </Block>
        </div>
      );

    case "generational-illness":
      return (
        <div className="space-y-4">
          <Block title="What is Generational Trauma?">
            <p>Generational trauma — also called ancestral or intergenerational trauma — is the transmission of unresolved emotional wounds, fear responses, and survival behaviors across family lines. It is not metaphor. It is biology.</p>
            <p>Research in epigenetics has demonstrated that traumatic experiences alter gene expression in ways that are passed to children and grandchildren. The descendants of Holocaust survivors, famine survivors, and war veterans show measurable neurological and hormonal differences traceable to their ancestors' experiences.</p>
          </Block>
          <Block title="The Science: Epigenetics">
            <p>Epigenetics is the study of heritable changes in gene expression that do not involve changes to the DNA sequence itself. Trauma and extreme stress cause chemical tags (methyl groups) to attach to DNA, silencing or amplifying certain genes. These tags can persist across generations.</p>
            <List items={[
              "Rat studies: offspring of stressed rats showed identical fear responses without exposure",
              "Human studies: children of Holocaust survivors have altered cortisol levels at birth",
              "The DUTCH test measures cortisol patterns that reflect ancestral nervous system wiring",
              "Emotional patterns, chronic illness, and relationship templates are all epigenetically influenced",
            ]} />
          </Block>
          <Block title="How Patterns Are Passed Down">
            <List items={[
              "Physiological — altered stress hormones, nervous system set points, immune responses",
              "Behavioral — parenting styles, conflict patterns, emotional regulation modeling",
              "Narrative — family stories, unspoken rules, what is 'normal' vs 'shameful'",
              "Spiritual — unresolved vows, oaths, curses, and covenants in ancestral lineage",
              "Psychological — attachment styles, core beliefs, identity scripts",
            ]} />
          </Block>
          <Block title="How to Clear Generational Patterns">
            <List items={[
              "Family Constellation therapy — experiential healing of ancestral entanglements",
              "Somatic and EMDR work targeting generational fear patterns",
              "Prayer and intercession for ancestral healing across spiritual traditions",
              "Renouncing inherited vows, beliefs, and agreements that no longer serve",
              "Writing ancestral healing letters — releasing what was never yours to carry",
              "Inner child work addressing wounds inherited from parenting patterns",
            ]} />
          </Block>
        </div>
      );

    case "how-breathwork-works":
      return (
        <div className="space-y-4">
          <Block title="Breath as Medicine">
            <p>Breath is the only autonomic function you can consciously control — making it the most accessible bridge between the conscious mind and the nervous system. Every breathwork tradition, ancient and modern, uses this bridge intentionally.</p>
            <p>You breathe approximately 25,000 times per day. Most people breathe shallowly, into the upper chest, activating the stress response chronically. Correcting this single pattern is one of the most powerful healing interventions available.</p>
          </Block>
          <Block title="The Biochemistry of Breathing">
            <List items={[
              "CO₂ — not just waste gas. CO₂ is essential for releasing oxygen from red blood cells into tissues (Bohr Effect). Over-breathing expels too much CO₂, causing blood vessels to constrict and oxygen delivery to decrease.",
              "Nasal breathing — filters, humidifies, and warms air. Produces nitric oxide, a vasodilator that opens airways and blood vessels. Mouth breathing bypasses all of these benefits.",
              "Diaphragmatic breathing — activates the parasympathetic system through direct vagal stimulation. The diaphragm and vagus nerve are anatomically linked.",
              "Extended exhale — lengthening the out-breath specifically activates the parasympathetic branch, slowing the heart and calming the nervous system.",
            ]} />
          </Block>
          <Block title="Breathwork Styles and Their Effects">
            <div className="space-y-2">
              {[
                { name: "Box Breathing (4-4-4-4)", effect: "Balances the nervous system. Used by Navy SEALs for stress management. Equalizes sympathetic and parasympathetic tone." },
                { name: "4-7-8 Breathing", effect: "Powerful parasympathetic activator. The extended exhale calms anxiety rapidly. Effective for sleep onset." },
                { name: "Holotropic Breathwork", effect: "Developed by Dr. Stanislav Grof. Sustained connected breathing accesses non-ordinary states for deep trauma processing." },
                { name: "Wim Hof Method", effect: "Cyclical hyperventilation followed by breath retention. Increases adrenaline, reduces inflammation, strengthens immune response." },
                { name: "Rebirthing / Conscious Connected Breathing", effect: "Continuous circular breath without pauses. Releases stored trauma and accesses repressed emotion." },
                { name: "Pranayama (Yoga Breath)", effect: "Ancient system of breath control aligning prana (life force). Nadi Shodhana balances left-right brain hemispheres through alternate nostril breathing." },
              ].map((b) => (
                <div key={b.name} className="border border-border/40 rounded-xl p-3">
                  <p className="font-semibold text-foreground text-sm">{b.name}</p>
                  <p className="text-xs mt-1">{b.effect}</p>
                </div>
              ))}
            </div>
          </Block>
        </div>
      );

    case "how-sound-healing-works":
      return (
        <div className="space-y-4">
          <Block title="Everything is Frequency">
            <p>Sound healing is rooted in a fundamental physical truth: everything vibrates. Matter, energy, thought, and emotion all operate at measurable frequencies. The human body is not a solid object — it is a dynamic field of oscillating energy, and sound directly influences this field.</p>
          </Block>
          <Block title="Resonance and Entrainment">
            <p>Resonance occurs when one vibrating object causes another to vibrate at the same frequency. Entrainment is the tendency of systems to synchronize their rhythms when exposed to a dominant external frequency.</p>
            <p>This is why sound healing works: when you expose the body to a healing frequency, the body's own systems entrain to it. Brainwaves, heart rate variability, and cellular oscillation all shift in response to external sound.</p>
          </Block>
          <Block title="Solfeggio Frequencies">
            <List items={[
              "174 Hz — pain reduction, safety, foundation",
              "285 Hz — tissue repair, healing of fields and energy bodies",
              "396 Hz — releasing fear and guilt, liberating blocked energy",
              "417 Hz — undoing situations, clearing negative fields",
              "528 Hz — DNA repair, transformation, love, the miracle tone",
              "639 Hz — harmonizing relationships, heart field coherence",
              "741 Hz — awakening intuition, clearing toxins",
              "852 Hz — returning to spiritual order",
              "963 Hz — divine connection, crown activation, oneness",
            ]} />
          </Block>
          <Block title="Cymatics — Sound Made Visible">
            <p>Cymatics is the study of visible sound. When sound frequencies are directed onto a surface with sand or liquid, they form precise geometric patterns. Higher frequencies produce more complex and beautiful forms. This is direct visual proof that sound organizes matter — and explains why it can reorganize tissue and energy.</p>
          </Block>
          <Block title="Binaural Beats">
            <p>When two slightly different frequencies are played in each ear simultaneously, the brain perceives a third tone — the difference between them. This third tone synchronizes brainwave activity to that frequency. Different frequencies produce different states: delta (deep sleep), theta (meditation/creativity), alpha (calm focus), beta (alertness), gamma (peak cognition).</p>
          </Block>
          <Block title="Sound Healing Modalities">
            <List items={[
              "Tibetan singing bowls — sustained tones for chakra clearing and deep relaxation",
              "Crystal singing bowls — each bowl tuned to a specific chakra frequency",
              "Gong therapy — full-body immersion in complex harmonic overtones",
              "Tuning forks — precision frequency applied to the body and auric field",
              "Voice and toning — the human voice as the most personal healing instrument",
            ]} />
          </Block>
        </div>
      );

    case "how-energy-work-functions":
      return (
        <div className="space-y-4">
          <Block title="The Human Biofield">
            <p>The biofield is the measurable electromagnetic field generated by the body's biological processes. It extends beyond the skin, is generated by the heart (the strongest electromagnetic organ in the body), and interacts with the fields of other people, places, and objects.</p>
            <p>The heart's electromagnetic field extends 4–6 feet from the body in all directions. This is not metaphysics — it is measured by magnetometers in cardiac research. Energy healers work within and through this field.</p>
          </Block>
          <Block title="The Layers of the Aura">
            <div className="space-y-2">
              {[
                { layer: "Etheric Body", desc: "1–2 inches from the physical body. The blueprint for physical health. Disruptions here precede physical illness." },
                { layer: "Emotional Body", desc: "1–3 inches. Holds emotional patterns, reactive states, and unprocessed feelings." },
                { layer: "Mental Body", desc: "3–8 inches. Belief systems, thought patterns, mental constructs." },
                { layer: "Astral Body", desc: "8–12 inches. Relationships, attachments, heart-centered connection." },
                { layer: "Etheric Template", desc: "Beyond the astral. The perfect spiritual blueprint of the physical body." },
                { layer: "Celestial Body", desc: "Spiritual intuition, higher love, connection to divine will." },
                { layer: "Ketheric / Causal Body", desc: "The outermost layer. Soul purpose, divine mind, integration of all layers." },
              ].map((l) => (
                <div key={l.layer} className="border border-border/40 rounded-xl p-3">
                  <p className="font-semibold text-foreground text-sm">{l.layer}</p>
                  <p className="text-xs mt-1">{l.desc}</p>
                </div>
              ))}
            </div>
          </Block>
          <Block title="How Practitioners Work with Energy">
            <List items={[
              "Scanning — sensing disruptions, density, or depletion in the energy field",
              "Clearing — removing congested or discordant energy from the field",
              "Infusing — channeling high-frequency energy into depleted areas",
              "Rebalancing — restoring coherent flow through chakras and meridians",
              "Sealing — protecting the field after clearing to prevent re-intrusion",
            ]} />
          </Block>
          <Block title="Energy Healing Modalities">
            <List items={[
              "Reiki — Japanese healing system using universal life-force energy channeled through the hands",
              "Pranic Healing — advanced biofield technique cleaning and energizing the aura",
              "Theta Healing — accessing the theta brainwave state to reprogram subconscious beliefs",
              "Quantum Healing — working with the quantum field to shift probability patterns",
              "Laying on of Hands — spiritual healing practiced across all major faith traditions",
              "Qi Gong — cultivating and directing life-force energy through movement and intention",
            ]} />
          </Block>
        </div>
      );

    case "spiritual-gifts-explained":
      return (
        <div className="space-y-4">
          <Block title="The Origin of Spiritual Gifts">
            <p>Spiritual gifts are divine endowments given by the Holy Spirit for the benefit of others and the building up of the body. First Corinthians 12 describes them as manifestations of the Spirit distributed as God determines — not earned, not achieved, but given.</p>
            <p>These gifts are not performances or status. They are functional graces — capacities given to serve, protect, heal, and strengthen the community of those in need.</p>
          </Block>
          <Block title="Gifts of the Spirit — 1 Corinthians 12">
            <div className="space-y-2">
              {[
                { gift: "Word of Wisdom", desc: "Supernatural insight into how to apply divine truth to a specific situation. Beyond natural intelligence." },
                { gift: "Word of Knowledge", desc: "Receiving factual information about a person or situation through supernatural means — things you could not naturally know." },
                { gift: "Faith", desc: "A supernaturally empowered confidence in God's action — beyond ordinary faith. Moves mountains." },
                { gift: "Gifts of Healing", desc: "Channels of divine healing for physical, emotional, and spiritual conditions. Note: the plural — different healings, different channels." },
                { gift: "Miracles", desc: "Supernatural interventions that override the natural order. Signs that point to Source." },
                { gift: "Prophecy", desc: "Speaking the heart of God into a situation — for edification, exhortation, and comfort (1 Cor 14:3). Not always prediction." },
                { gift: "Discerning of Spirits", desc: "Perceiving the spiritual nature behind what is happening — whether divine, human, or demonic. Essential for discernment in healing spaces." },
                { gift: "Tongues", desc: "Supernatural language as prayer, worship, or communication. The gift of tongues combined with interpretation functions as prophecy." },
                { gift: "Interpretation of Tongues", desc: "The supernatural capacity to translate or interpret tongues — not a known language but spiritual understanding." },
              ].map((g) => (
                <div key={g.gift} className="border border-border/40 rounded-xl p-3">
                  <p className="font-semibold text-foreground text-sm">{g.gift}</p>
                  <p className="text-xs mt-1">{g.desc}</p>
                </div>
              ))}
            </div>
          </Block>
          <Block title="Ministry and Leadership Gifts — Ephesians 4">
            <List items={[
              "Apostle — sent one who establishes, governs, and guards the foundations of the work",
              "Prophet — speaks the now-word of God with accuracy and accountability",
              "Evangelist — carries the message of Source connection and reconciliation",
              "Pastor / Shepherd — tends, protects, and nurtures those in their care",
              "Teacher — unfolds the depth and application of spiritual truth",
            ]} />
          </Block>
          <Block title="Motivational Gifts — Romans 12">
            <List items={[
              "Prophecy — perceiving and declaring what aligns with divine truth",
              "Serving — meeting practical needs as an act of love and worship",
              "Teaching — communicating truth with clarity and conviction",
              "Exhortation — encouraging, comforting, and activating others toward growth",
              "Giving — generous distribution of resources as a spiritual calling",
              "Leadership / Administration — organizing and governing with vision and wisdom",
              "Mercy — compassionate care for those in pain with extraordinary tenderness",
            ]} />
          </Block>
        </div>
      );

    case "power-of-words":
      return (
        <div className="space-y-4">
          <Block title="Words Carry Frequency">
            <p>Words are not neutral. Every word carries a vibrational frequency that affects the body, the environment, and the people who receive it. This is not superstition — it is measurable and it is ancient wisdom confirmed by modern research.</p>
          </Block>
          <Block title="Masaru Emoto and Water Memory">
            <p>Dr. Masaru Emoto's research photographed water crystals after they were exposed to specific words, music, and intentions. Water exposed to words like 'love' and 'gratitude' formed complex, beautiful crystalline structures. Water exposed to 'hate' or 'I will kill you' produced distorted, fragmented forms.</p>
            <p>The human body is approximately 70% water. This research suggests that the words spoken over you — and by you — are literally restructuring your cellular environment.</p>
          </Block>
          <Block title="What Scripture Says">
            <List items={[
              "'Death and life are in the power of the tongue.' — Proverbs 18:21",
              "'In the beginning was the Word, and the Word was with God, and the Word was God.' — John 1:1",
              "'By your words you will be acquitted, and by your words you will be condemned.' — Matthew 12:37",
              "'Do not let any unwholesome talk come out of your mouths, but only what is helpful for building others up.' — Ephesians 4:29",
            ]} />
          </Block>
          <Block title="How Words Create Reality">
            <List items={[
              "Spoken declarations wire the subconscious mind through repetition",
              "Words activate the reticular activating system (RAS), filtering what you notice in your environment",
              "Negative self-talk increases cortisol and suppresses immune function",
              "Gratitude and affirmation language increase serotonin and dopamine",
              "Spoken prayer and blessing are among the most studied interventions in healing research",
            ]} />
          </Block>
          <Block title="Practices for Word Healing">
            <List items={[
              "Morning declarations spoken aloud, not just thought",
              "Replacing 'I am anxious' with 'I notice anxiety in my body' — the identity separation",
              "Blessing your food and water before consuming",
              "Removing toxic language patterns: 'always,' 'never,' 'I can't,' 'I'm broken'",
              "Prophetic declaration — speaking your future into existence from a place of faith",
            ]} />
          </Block>
        </div>
      );

    case "reflexology-and-meridians":
      return (
        <div className="space-y-4">
          <Block title="The Meridian System — Traditional Chinese Medicine">
            <p>In Traditional Chinese Medicine, the body contains a network of invisible pathways called meridians through which life-force energy (Qi or Chi) flows. There are 12 primary meridians, each linked to a specific organ system, emotion, and season.</p>
            <p>When Qi flows freely, the body maintains health. When it stagnates, is depleted, or moves in the wrong direction, illness follows — first as emotional imbalance, then as physical symptoms. Acupuncture, acupressure, and qigong work to restore proper Qi flow through these channels.</p>
          </Block>
          <Block title="The 12 Primary Meridians and Their Emotions">
            <div className="space-y-2">
              {[
                { meridian: "Lung", emotion: "Grief, loss, letting go", element: "Metal" },
                { meridian: "Large Intestine", emotion: "Inability to release, holding on", element: "Metal" },
                { meridian: "Stomach", emotion: "Worry, anxiety, overthinking", element: "Earth" },
                { meridian: "Spleen / Pancreas", emotion: "Sympathy, over-concern, feeling unsupported", element: "Earth" },
                { meridian: "Heart", emotion: "Joy, or its absence: anxiety, restlessness", element: "Fire" },
                { meridian: "Small Intestine", emotion: "Overwhelm, boundary confusion, sorting", element: "Fire" },
                { meridian: "Bladder", emotion: "Fear, trauma, frozen terror", element: "Water" },
                { meridian: "Kidney", emotion: "Deep fear, shock, survival terror", element: "Water" },
                { meridian: "Pericardium", emotion: "Emotional protection, guarded heart, relationship fear", element: "Fire" },
                { meridian: "Triple Warmer", emotion: "Fight-or-flight activation, chronic stress response", element: "Fire" },
                { meridian: "Gallbladder", emotion: "Indecision, resentment, bitterness", element: "Wood" },
                { meridian: "Liver", emotion: "Anger, frustration, unexpressed rage", element: "Wood" },
              ].map((m) => (
                <div key={m.meridian} className="border border-border/40 rounded-xl p-3 flex gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground text-sm">{m.meridian} — {m.element}</p>
                    <p className="text-xs mt-0.5">{m.emotion}</p>
                  </div>
                </div>
              ))}
            </div>
          </Block>
          <Block title="Reflexology — The Body Mapped on the Feet and Hands">
            <p>Reflexology is based on the principle that the entire body is mapped on the feet, hands, and ears. Applying pressure to specific reflex points affects the corresponding organ, gland, or system.</p>
            <List items={[
              "Toes — head, brain, and sinuses",
              "Ball of the foot — chest, lungs, heart",
              "Arch of the foot — digestive organs (stomach, liver, gallbladder, kidneys)",
              "Heel — lower back, sciatic nerve, reproductive system",
              "Inner edge of the foot — the spine from crown to tailbone",
              "Outer edge of the foot — shoulders, arms, and knees",
            ]} />
          </Block>
        </div>
      );

    case "sacred-nourishment":
      return (
        <div className="space-y-4">
          <Block title="Food as Frequency and Medicine">
            <p>Every food carries a measurable electromagnetic frequency. Fresh, living foods carry high frequencies. Processed, devitalized, or chemically altered foods carry low frequencies. What you eat is not only about nutrients — it is about the life-force you are consuming.</p>
            <p>Ancient healing traditions from Ayurveda to Traditional Chinese Medicine to the Hebrew dietary laws all understood that food choices have spiritual and energetic dimensions, not just nutritional ones.</p>
          </Block>
          <Block title="The Gut-Brain Axis">
            <p>The gut contains over 100 million neurons — more than the spinal cord. It is sometimes called the 'second brain.' It produces approximately 95% of the body's serotonin and communicates with the brain through the vagus nerve.</p>
            <List items={[
              "An inflamed gut produces an inflamed, anxious mind",
              "The microbiome (gut bacteria) directly influences mood, memory, and stress response",
              "Leaky gut syndrome is now linked to depression, anxiety, and autoimmune conditions",
              "Healing the gut is one of the most direct paths to emotional stability",
            ]} />
          </Block>
          <Block title="Healing Foods and Their Properties">
            <div className="space-y-2">
              {[
                { food: "Leafy Greens", benefit: "Magnesium-rich for nervous system calm; folate for neurotransmitter production" },
                { food: "Fermented Foods (kimchi, kefir, sauerkraut)", benefit: "Rebuilds microbiome, directly linked to reduced depression and anxiety" },
                { food: "Omega-3 Rich Foods (wild salmon, chia, flaxseed)", benefit: "Reduces neuroinflammation; essential for brain repair" },
                { food: "Turmeric / Curcumin", benefit: "Powerful anti-inflammatory; crosses the blood-brain barrier" },
                { food: "Blueberries and Berries", benefit: "Antioxidants that protect neurons from oxidative damage" },
                { food: "Bone Broth", benefit: "Heals gut lining; rich in collagen, glycine, and amino acids" },
                { food: "Raw Cacao", benefit: "Highest food source of magnesium; contains anandamide, the bliss molecule" },
              ].map((f) => (
                <div key={f.food} className="border border-border/40 rounded-xl p-3">
                  <p className="font-semibold text-foreground text-sm">{f.food}</p>
                  <p className="text-xs mt-1">{f.benefit}</p>
                </div>
              ))}
            </div>
          </Block>
          <Block title="Eating as a Sacred Act">
            <List items={[
              "Blessing food before eating — shifts intention and the field around what you consume",
              "Eating in peace, not stress — the nervous system state during eating determines digestion",
              "Seasonal and local eating — aligns the body with its natural environment",
              "Fasting — ancient practice across all traditions for clearing, sensitivity, and spiritual access",
              "Food gratitude — acknowledging the life given so you can live",
            ]} />
          </Block>
        </div>
      );

    case "essential-oils":
      return (
        <div className="space-y-4">
          <Block title="What are Essential Oils?">
            <p>Essential oils are the concentrated volatile aromatic compounds found in plants — their immune system, their communication chemistry, and their life-force expression. When extracted properly, they carry the full spectrum of the plant's healing intelligence.</p>
            <p>A single drop of peppermint oil is equivalent to approximately 28 cups of peppermint tea. Therapeutic-grade oils contain hundreds of chemical constituents that work synergistically in ways that isolated pharmaceutical compounds cannot replicate.</p>
          </Block>
          <Block title="How Essential Oils Work in the Body">
            <List items={[
              "Olfactory pathway — aromatic molecules travel through the nasal cavity to the olfactory bulb, which connects directly to the limbic system (the brain's emotional center). This is the fastest route to emotional states.",
              "Topical absorption — oils applied to the skin pass through the lipid layer into the bloodstream within 20 minutes, affecting systemic chemistry.",
              "Internal use — certain food-grade oils are taken internally for digestive and systemic support (with proper guidance).",
              "The limbic system connection explains why smell is the most powerful sense for emotional memory and healing.",
            ]} />
          </Block>
          <Block title="Key Healing Oils and Their Properties">
            <div className="space-y-2">
              {[
                { oil: "Lavender", use: "Calming, sleep support, skin healing, nervous system regulation" },
                { oil: "Frankincense", use: "The 'king of oils.' Grounding, immune support, cellular health, spiritual connection and prayer" },
                { oil: "Peppermint", use: "Alertness, headache relief, digestive support, respiratory opening" },
                { oil: "Rose", use: "Highest frequency of any oil (320 MHz). Heart healing, grief, self-love, emotional opening" },
                { oil: "Eucalyptus", use: "Respiratory support, clearing, energetic cleansing of spaces" },
                { oil: "Clary Sage", use: "Hormonal balance, clarity of vision, intuitive opening" },
                { oil: "Helichrysum", use: "The healing oil. Nerve repair, emotional scar tissue, recovery from trauma" },
                { oil: "Bergamot", use: "Anxiety and depression, uplifting, heart-chakra resonance" },
                { oil: "Cedarwood", use: "Grounding, calming the overactive mind, helping with sleep" },
                { oil: "Myrrh", use: "Deep emotional healing, releasing old grief, spiritual protection" },
              ].map((o) => (
                <div key={o.oil} className="border border-border/40 rounded-xl p-3">
                  <p className="font-semibold text-foreground text-sm">{o.oil}</p>
                  <p className="text-xs mt-1">{o.use}</p>
                </div>
              ))}
            </div>
          </Block>
          <Block title="Safety Notes">
            <List items={[
              "Always dilute with a carrier oil (coconut, jojoba, almond) for skin application — typical ratio is 2–3 drops per teaspoon",
              "Photosensitive oils (citrus) should not be applied before sun exposure",
              "Certain oils are contraindicated during pregnancy — consult a qualified practitioner",
              "Quality matters — many commercial oils are adulterated. Seek certified pure therapeutic-grade sourcing.",
            ]} />
          </Block>
        </div>
      );

    case "crystal-and-stone-properties":
      return (
        <div className="space-y-4">
          <Block title="How Crystals Work">
            <p>Crystals are not rocks. They are highly ordered, geometrically precise arrangements of atoms that have formed over millions of years under specific conditions of pressure and temperature. Their regular molecular lattice structures give them measurable electromagnetic properties.</p>
            <p>Quartz crystals are used in watches, computers, and communication devices because they oscillate at precise, consistent frequencies when subjected to electrical charge (piezoelectric effect). Healing work with crystals applies this same principle — using their stable frequencies to interact with the body's more variable electromagnetic field.</p>
          </Block>
          <Block title="Common Crystals and Their Healing Properties">
            <div className="space-y-2">
              {[
                { crystal: "Clear Quartz", chakra: "All / Crown", properties: "Amplifies intention and energy. The master healer and programmer. Enhances clarity of mind." },
                { crystal: "Amethyst", chakra: "Crown / Third Eye", properties: "Calming, intuition-enhancing, protective. Excellent for sleep, meditation, and sobriety work." },
                { crystal: "Rose Quartz", chakra: "Heart", properties: "Unconditional love, self-love, emotional healing, attracting and sustaining love." },
                { crystal: "Black Tourmaline", chakra: "Root / Earth Star", properties: "The premier protection stone. Absorbs negative energy, shields the biofield, grounds the root chakra." },
                { crystal: "Citrine", chakra: "Solar Plexus", properties: "Abundance, confidence, joy, manifestation. One of few crystals that does not need cleansing." },
                { crystal: "Labradorite", chakra: "Third Eye / Throat", properties: "Protects the aura, strengthens intuition, shields empaths from absorbing others' energy." },
                { crystal: "Lapis Lazuli", chakra: "Third Eye / Throat", properties: "Ancient stone of truth and wisdom. Activates higher mind and authentic voice." },
                { crystal: "Black Obsidian", chakra: "Root", properties: "Deep shadow work. Cuts cords, reveals truth, exposes hidden patterns. Use with care and grounding." },
                { crystal: "Selenite", chakra: "Crown / Soul Star", properties: "High-frequency cleansing and angelic connection. Clears other crystals and spaces." },
                { crystal: "Malachite", chakra: "Heart / Solar Plexus", properties: "Transformation and change. Draws out toxins — physical and emotional. The stone of deep healing." },
                { crystal: "Carnelian", chakra: "Sacral", properties: "Creativity, courage, sexuality, vitality. Activates and energizes depleted sacral center." },
                { crystal: "Hematite", chakra: "Root / Earth Star", properties: "Grounding, stabilizing, strengthening. Helps the scattered mind find the body." },
              ].map((c) => (
                <div key={c.crystal} className="border border-border/40 rounded-xl p-3">
                  <p className="font-semibold text-foreground text-sm">{c.crystal} <span className="text-muted-foreground font-normal text-xs">— {c.chakra}</span></p>
                  <p className="text-xs mt-1">{c.properties}</p>
                </div>
              ))}
            </div>
          </Block>
          <Block title="Cleansing and Programming Crystals">
            <List items={[
              "Cleanse: moonlight, sunlight (brief for photosensitive stones), sound (singing bowl), running water (not for soft stones), selenite proximity, smoke (sage, palo santo)",
              "Program: hold the crystal, set clear intention, breathe your intention into the stone, visualize",
              "Crystals absorb energy — especially empaths' stones need regular cleansing",
              "Trust your intuition about which stone you are drawn to — the body knows its frequency needs",
            ]} />
          </Block>
        </div>
      );

    case "plant-medicine-and-herbs":
      return (
        <div className="space-y-4">
          <Block title="Plants as Intelligent Medicine">
            <p>Herbs are not primitive medicine. They are the original medicine — used across every human civilization for thousands of years. Modern pharmaceutical drugs are predominantly derived from plant compounds. The difference is that plants contain hundreds of synergistic compounds working together, while pharmaceuticals isolate one active constituent.</p>
            <p>Indigenous traditions worldwide speak of plants as having consciousness, spirit, and healing intelligence. Modern plant medicine research — including with psychedelic compounds — is beginning to validate what traditional healers have always known.</p>
          </Block>
          <Block title="Adaptogens — Plants for Stress Resilience">
            <List items={[
              "Ashwagandha — lowers cortisol, builds resilience, improves sleep, reduces anxiety",
              "Rhodiola Rosea — combats physical and mental fatigue, improves cognitive function",
              "Holy Basil (Tulsi) — sacred in Ayurveda; balances stress hormones, anti-inflammatory",
              "Lion's Mane Mushroom — nerve growth factor; rebuilds the nervous system, reduces anxiety and depression",
              "Reishi Mushroom — immune modulator, nervous system calmer, deeply grounding",
              "Maca — hormone balance, vitality, endocrine support",
            ]} />
          </Block>
          <Block title="Nervines — Herbs for the Nervous System">
            <List items={[
              "Valerian root — powerful calming, sleep aid, muscle relaxation",
              "Passionflower — anxiety, racing mind, insomnia",
              "Lemon Balm — gentle calming; antiviral, especially helpful for anxiety with digestive symptoms",
              "Skullcap — nervous exhaustion, hyperactivity, neuralgia",
              "Chamomile — gentle nervine safe for all ages; anti-inflammatory digestive calmer",
              "St. John's Wort — mild depression, nerve pain (not for use with certain medications)",
            ]} />
          </Block>
          <Block title="Heart and Grief Herbs">
            <List items={[
              "Hawthorn berry — repairs and nourishes the heart; both physically and energetically",
              "Rose — opens the heart, grief support, deepest self-love herb in the apothecary",
              "Motherwort — calms heart palpitations, anxiety, and the overwhelmed nervous system",
            ]} />
          </Block>
          <Block title="Herbal Preparations">
            <List items={[
              "Infusion / Tea — pour boiling water over dried herbs, steep 5–15 minutes. Best for leaves and flowers.",
              "Decoction — simmer roots, bark, and seeds in water for 20–40 minutes to extract harder compounds.",
              "Tincture — herbs extracted in alcohol or glycerin over weeks. Concentrated, long shelf life.",
              "Salve / Balm — herbs infused in oil then blended with beeswax for topical application.",
              "Capsules / Powder — dried herbs in measured doses. Consistent and convenient.",
            ]} />
          </Block>
        </div>
      );

    case "dream-interpretation":
      return (
        <div className="space-y-4">
          <Block title="Why We Dream">
            <p>Dreams are not random neural noise. During REM sleep, the brain is more active in some regions than during waking life. Dreams serve multiple functions: emotional processing, memory consolidation, problem-solving, and — across virtually every spiritual tradition — communication from dimensions beyond ordinary consciousness.</p>
            <p>The Bible records over 200 references to dreams and visions as vehicles of divine communication. Ancient Egyptians, Greeks, Indigenous cultures, and Eastern traditions all developed sophisticated systems for interpreting and working with the dream world.</p>
          </Block>
          <Block title="Types of Dreams">
            <div className="space-y-2">
              {[
                { type: "Processing Dreams", desc: "The mind working through the day's unresolved emotions and experiences. Often fragmented, emotionally intense, and not literal." },
                { type: "Prophetic Dreams", desc: "Dreams that accurately foretell future events or carry specific revelation. Often vivid, unusually coherent, and difficult to forget upon waking." },
                { type: "Healing Dreams", desc: "Dreams in which healing occurs — emotional release, spiritual encounters, or cellular repair happens during sleep." },
                { type: "Visitation Dreams", desc: "Dreams in which deceased loved ones appear — often to bring closure, comfort, or unfinished communication." },
                { type: "Warning Dreams", desc: "Urgent symbolic or literal dreams alerting you to danger, a needed decision, or a consequence of current behavior." },
                { type: "Spiritual Encounter Dreams", desc: "Encounters with divine beings, angels, or the higher self. Often leave a lasting impression of peace, awe, or transformation." },
                { type: "Lucid Dreams", desc: "Dreams in which you become aware you are dreaming and can consciously participate. Used intentionally for healing and spiritual practice." },
              ].map((t) => (
                <div key={t.type} className="border border-border/40 rounded-xl p-3">
                  <p className="font-semibold text-foreground text-sm">{t.type}</p>
                  <p className="text-xs mt-1">{t.desc}</p>
                </div>
              ))}
            </div>
          </Block>
          <Block title="Common Dream Symbols">
            <List items={[
              "Water — the unconscious, emotions, the spiritual realm, cleansing",
              "House — the self; each room represents a different aspect of your inner world",
              "Flying — freedom, transcendence, spiritual ascent, rising above circumstances",
              "Falling — loss of control, fear, a need to let go",
              "Being chased — avoidance of a feeling, person, or unresolved situation",
              "Teeth falling out — anxiety about appearance, communication, or loss of power",
              "Snake — transformation, healing (Kundalini), or deception (depending on context)",
              "Baby — new beginnings, vulnerability, something being born in your life",
              "Death — transformation, end of an era, not literal",
            ]} />
          </Block>
          <Block title="Dream Journaling Practice">
            <List items={[
              "Keep a journal and pen at the bedside",
              "Record the dream immediately upon waking — before using your phone",
              "Note feelings, colors, characters, and symbols — not just narrative",
              "Ask: 'What in my waking life does this reflect?'",
              "Pray or meditate over recurring dreams and ask for understanding",
            ]} />
          </Block>
        </div>
      );

    case "astrology-basics":
      return (
        <div className="space-y-4">
          <Block title="What Astrology Is — and Is Not">
            <p>Astrology is the ancient study of the correspondence between celestial patterns and human experience. It is not fatalism. The planets do not control you — they reflect archetypal energies that are active at a given moment, providing a language for understanding cycles, tendencies, and soul purposes.</p>
            <p>Used across Mesopotamia, Egypt, Greece, India (Vedic), China, and the Mayan civilization, astrology is one of the most universally practiced knowledge systems in human history. Its purpose is always self-knowledge — understanding your nature so you can work with it rather than against it.</p>
          </Block>
          <Block title="The Big Three — Sun, Moon, Rising">
            <div className="space-y-2">
              {[
                { placement: "Sun Sign", desc: "Your core identity and conscious self — who you are here to become. The hero's journey of your soul's expression." },
                { placement: "Moon Sign", desc: "Your emotional nature, instincts, and deepest needs. How you self-soothe, what makes you feel safe, and where your wounds live." },
                { placement: "Rising Sign (Ascendant)", desc: "The mask you wear — how others first experience you. Your body type, first impressions, and the lens through which you see life." },
              ].map((p) => (
                <div key={p.placement} className="border border-border/40 rounded-xl p-3">
                  <p className="font-semibold text-foreground text-sm">{p.placement}</p>
                  <p className="text-xs mt-1">{p.desc}</p>
                </div>
              ))}
            </div>
          </Block>
          <Block title="The Planets and What They Govern">
            <List items={[
              "Sun — core identity, vitality, ego, purpose",
              "Moon — emotions, instincts, the mother, the past, cycles",
              "Mercury — mind, communication, learning, travel",
              "Venus — love, beauty, values, attraction, pleasure",
              "Mars — drive, anger, sexuality, action, courage",
              "Jupiter — expansion, abundance, wisdom, higher learning",
              "Saturn — discipline, karma, restriction, mastery through perseverance",
              "Uranus — revolution, awakening, sudden change, liberation",
              "Neptune — spirituality, illusion, dreams, dissolution, transcendence",
              "Pluto — transformation, death and rebirth, power, the unconscious",
            ]} />
          </Block>
          <Block title="The North Node — Your Soul Purpose">
            <p>The North Node is not a planet but a mathematical point representing the soul's evolutionary direction in this lifetime. It is the growth edge — the unfamiliar territory your soul came here to develop. The South Node (opposite) is where you are over-reliant on past-life mastery. Your healing journey often follows the North Node's call to step beyond comfort.</p>
          </Block>
        </div>
      );

    case "sacred-geometry":
      return (
        <div className="space-y-4">
          <Block title="The Architecture of Creation">
            <p>Sacred geometry is the study of the geometric patterns, ratios, and forms that appear throughout nature, the cosmos, and all ancient spiritual architecture. These patterns are not coincidences — they are the mathematical language through which Source builds and sustains reality.</p>
            <p>From the spiraling of galaxies to the structure of DNA, from snowflake crystals to seashells, the same mathematical relationships repeat across every scale of existence. Ancient architects encoded these proportions into temples, cathedrals, and sacred sites because they understood that certain shapes carry healing and transcendent frequencies.</p>
          </Block>
          <Block title="Key Forms and Their Meanings">
            <div className="space-y-2">
              {[
                { form: "Flower of Life", desc: "A pattern of overlapping circles forming a flower-like shape. Contains the blueprint for all life including the Platonic Solids and Metatron's Cube. Found in ancient Egyptian, Greek, Chinese, and Hebrew sacred sites." },
                { form: "Fibonacci Sequence / Golden Ratio (1.618)", desc: "The mathematical ratio of natural growth. Found in the spiral of shells, the arrangement of seeds in sunflowers, the proportions of the human body, galaxies, and ocean waves. The ratio is approximately 1:1.618 — phi (φ)." },
                { form: "The Vesica Piscis", desc: "Two overlapping circles with shared radii. The intersection is the womb of creation — the shape from which all other geometric forms emerge. The divine feminine in pure geometric form." },
                { form: "Metatron's Cube", desc: "Contains all five Platonic Solids, the Merkaba, and the Flower of Life. Associated with the archangel Metatron and the Akashic Records. Used for protection and cosmic understanding." },
                { form: "The Sri Yantra", desc: "A geometric mandala from Vedic tradition composed of nine interlocking triangles. Used for manifestation, meditation, and divine alignment." },
                { form: "Platonic Solids", desc: "Five three-dimensional forms (tetrahedron, cube, octahedron, dodecahedron, icosahedron) that are the building blocks of physical matter. Each corresponds to an element: fire, earth, air, ether, and water." },
                { form: "The Torus", desc: "The donut-shaped energy field that surrounds every living system — cells, hearts, trees, planets, galaxies. The fundamental pattern of how energy moves in the universe." },
              ].map((f) => (
                <div key={f.form} className="border border-border/40 rounded-xl p-3">
                  <p className="font-semibold text-foreground text-sm">{f.form}</p>
                  <p className="text-xs mt-1">{f.desc}</p>
                </div>
              ))}
            </div>
          </Block>
          <Block title="Sacred Geometry in Healing">
            <List items={[
              "Mandalas — geometric patterns used for meditation, integration, and nervous system regulation",
              "Labyrinth walking — an ancient walking prayer form using a single spiral path",
              "Pyramid structures — concentrate and amplify energy at specific mathematical ratios",
              "Crystal grids — placing crystals in sacred geometric patterns to amplify healing intention",
            ]} />
          </Block>
        </div>
      );

    case "your-spiritual-gifts":
      return (
        <div className="space-y-4">
          <Block title="All Gifts Come from One Source">
            <p>Whether you use the language of faith traditions, indigenous wisdom, or metaphysical frameworks, every genuine spiritual gift originates from the same Source of divine intelligence and love. These gifts are not about ego or status — they are about function in the larger body of healing for humanity.</p>
            <p>Each description below is offered with respect for all traditions. You may find yourself resonating with language from multiple frameworks — this is normal. Allow what is true to land and release what does not.</p>
          </Block>
          <Block title="Faith Tradition Gifts">
            <div className="space-y-2">
              {[
                { gift: "Prophet", desc: "One who speaks the heart of Source with accuracy and accountability. Prophets see what others cannot see, perceive patterns, and call things into alignment with truth. They are often misunderstood before being recognized. True prophecy edifies, exhorts, and comforts (1 Cor 14:3)." },
                { gift: "Intercessor", desc: "A spiritual gatekeeper who stands between the seen and unseen realms in prayer. Intercessors carry burdens that are not their own, pray with intense travail, and often receive specific revelation during intercession. They are rarely in the spotlight — they labor in the hidden place." },
                { gift: "Healer", desc: "One through whom divine healing flows — physically, emotionally, and spiritually. Healers often carry a tender empathy, have themselves been through illness or pain, and function best in partnership with Source rather than from personal power." },
                { gift: "Teacher", desc: "Carries a unique ability to unfold and make accessible the depths of spiritual truth. Great teachers simplify without diminishing, illuminate without overwhelming, and live what they teach." },
                { gift: "Discerner", desc: "Perceives the spiritual nature behind what is present — divine, human, or adversarial. This gift protects communities and individuals from deception. Discerners often feel things deeply before they can name them." },
                { gift: "Watcher", desc: "One who keeps vigil — in prayer, in awareness, on the walls of a community or family. Watchers perceive approaching events and guard through intercession. Often quiet, deeply perceptive, sensitive to shifts in spiritual atmosphere." },
              ].map((g) => (
                <div key={g.gift} className="border border-border/40 rounded-xl p-3">
                  <p className="font-semibold text-foreground text-sm">{g.gift}</p>
                  <p className="text-xs mt-1">{g.desc}</p>
                </div>
              ))}
            </div>
          </Block>
          <Block title="Metaphysical and Energetic Gift Identities">
            <div className="space-y-2">
              {[
                { gift: "Empath", desc: "Feels the emotions, physical sensations, and energy states of others as if they are their own. Not a weakness — an advanced relational sensory system. Empaths are healers by nature but must learn energetic hygiene to avoid chronic depletion." },
                { gift: "Clairsentient", desc: "Receives spiritual information through feeling and physical sensation. Often confused with anxiety or health concerns before recognized as a gift." },
                { gift: "Clairvoyant / Seer", desc: "Receives visual spiritual information — through dreams, visions, mental imagery, or external vision. Seers see what is happening in the unseen realm." },
                { gift: "Clairaudient", desc: "Receives spiritual information through hearing — inner voice, sounds, music, or literal external voices. This gift appears across all traditions as the voice of the divine." },
                { gift: "Claircognizant", desc: "Receives spiritual information through direct knowing — information appears fully formed in the mind with no prior reasoning. Often dismissed as 'just a feeling' but highly accurate." },
                { gift: "Lightworker", desc: "A broad term for souls who incarnated with a specific mission to raise the frequency of consciousness and serve healing. Lightworkers are often drawn to healing professions, activism, or creative expression and feel a deep sense of sacred purpose." },
                { gift: "Starseed", desc: "Individuals who believe their soul originates from or has extensive experience in realms beyond Earth. Often highly sensitive, out-of-place in conventional systems, and carry a mission to help humanity through a specific window of transition." },
                { gift: "Medicine Person", desc: "From indigenous traditions worldwide — one who walks between worlds, holds ceremonial knowledge, heals with plant and spirit medicine, and serves as keeper of sacred teaching for their people." },
                { gift: "Energy Worker", desc: "Works consciously with the biofield, chakras, meridians, or elemental energies to restore health and alignment. Includes Reiki practitioners, pranic healers, shamanic practitioners, and all who direct life-force with trained intention." },
              ].map((g) => (
                <div key={g.gift} className="border border-border/40 rounded-xl p-3">
                  <p className="font-semibold text-foreground text-sm">{g.gift}</p>
                  <p className="text-xs mt-1">{g.desc}</p>
                </div>
              ))}
            </div>
          </Block>
          <Block title="Principles for All Gift Holders">
            <List items={[
              "Every gift requires stewardship — a gift unexercised atrophies",
              "Gifts are for service — not performance, status, or personal gain",
              "Protection and discernment are not optional — they are essential",
              "Gifts grow through community, accountability, and humility",
              "The greatest gift is love — all others flow from and return to it",
            ]} />
          </Block>
        </div>
      );

    case "numerology-and-angel-numbers":
      return (
        <div className="space-y-4">
          <Block title="The Language of Numbers">
            <p>Numerology is one of the oldest symbolic systems in human history — used by the Pythagoreans, ancient Hebrews (Gematria), Babylonians, and Chinese. Its premise: numbers are not just quantities but vibrational qualities that carry meaning and reflect patterns in your life, soul, and purpose.</p>
          </Block>
          <Block title="Core Numerology Numbers">
            <div className="space-y-2">
              {[
                { num: "Life Path Number", how: "Add all digits of your birth date until you reach a single digit (or master number)", meaning: "Your soul's purpose and the overarching theme of this lifetime" },
                { num: "Expression / Destiny Number", how: "Assign numerical values to every letter in your full birth name, add to single digit", meaning: "The natural talents, abilities, and destiny you carry" },
                { num: "Soul Urge / Heart's Desire", how: "Add the numerical values of only the vowels in your full name", meaning: "Your deepest inner motivation — what your soul longs for" },
                { num: "Personality Number", how: "Add the numerical values of only the consonants in your full name", meaning: "How others perceive you; the outer expression of your character" },
              ].map((n) => (
                <div key={n.num} className="border border-border/40 rounded-xl p-3">
                  <p className="font-semibold text-foreground text-sm">{n.num}</p>
                  <p className="text-xs mt-1"><span className="opacity-70">How: </span>{n.how}</p>
                  <p className="text-xs mt-0.5"><span className="opacity-70">Meaning: </span>{n.meaning}</p>
                </div>
              ))}
            </div>
          </Block>
          <Block title="Life Path Numbers 1–9">
            <List items={[
              "1 — The Leader. Independent, pioneering, innovative. Learning: self-reliance without isolation",
              "2 — The Diplomat. Sensitive, cooperative, peacemaking. Learning: self-worth beyond approval",
              "3 — The Communicator. Creative, expressive, joyful. Learning: depth beneath performance",
              "4 — The Builder. Disciplined, reliable, foundational. Learning: flexibility and rest",
              "5 — The Freedom Seeker. Adventurous, versatile, change-loving. Learning: commitment and presence",
              "6 — The Nurturer. Compassionate, responsible, family-oriented. Learning: receiving care",
              "7 — The Seeker. Introspective, spiritual, analytical. Learning: trust and vulnerability",
              "8 — The Powerhouse. Ambitious, material mastery, leadership. Learning: power used for love",
              "9 — The Humanitarian. Compassionate, global vision, completion. Learning: detachment and endings",
            ]} />
          </Block>
          <Block title="Master Numbers">
            <List items={[
              "11 — The Intuitive / Illuminator. Master intuition, spiritual messenger, bridge between worlds. Highly sensitive, needs grounding.",
              "22 — The Master Builder. Dreams manifest into reality. Extraordinary capacity to build lasting structures for collective benefit.",
              "33 — The Master Teacher. Pure love expressed through teaching and healing. The rarest and most service-oriented of the master numbers.",
            ]} />
          </Block>
          <Block title="Angel Numbers — Sequences and Their Meanings">
            <div className="space-y-2">
              {[
                { seq: "111 / 1111", meaning: "New beginning. Your thoughts are manifesting rapidly. Focus on what you want, not what you fear." },
                { seq: "222 / 2222", meaning: "Trust the process. You are in alignment. Your faith and patience are being honored." },
                { seq: "333 / 3333", meaning: "Divine presence is near. You are supported and protected. Expansion is underway." },
                { seq: "444 / 4444", meaning: "You are surrounded by angels. Foundation is being built. You are exactly where you need to be." },
                { seq: "555 / 5555", meaning: "Major change is coming. Release what no longer serves. Transformation is accelerating." },
                { seq: "666", meaning: "Often misinterpreted. Its true signal: recalibrate your thoughts. You are too focused on material concerns — return to Source." },
                { seq: "777", meaning: "Divine alignment. You are on your soul path. Miracles are converging. Keep going." },
                { seq: "888", meaning: "Abundance is flowing. Infinite cycles of receiving and giving. Mastery and completion of a cycle." },
                { seq: "999 / 9999", meaning: "An era is ending. Release completely. Your soul is completing a significant cycle of learning." },
                { seq: "1010", meaning: "Divine Source is encouraging your spiritual growth. Stay present. You are awakening." },
                { seq: "1212", meaning: "Stay positive. Your spiritual practice and intentions are working. Maintain your frequency." },
              ].map((a) => (
                <div key={a.seq} className="border border-border/40 rounded-xl p-3 flex gap-3">
                  <span className="font-bold text-primary text-sm flex-shrink-0 w-16">{a.seq}</span>
                  <span className="text-xs">{a.meaning}</span>
                </div>
              ))}
            </div>
          </Block>
        </div>
      );

    default:
      return null;
  }
}

export default function WisdomDetail() {
  const { section } = useParams<{ section: string }>();
  const navigate = useNavigate();
  const id = section as SectionKey;
  const title = sectionTitles[id];

  if (!title) {
    navigate("/wisdom", { replace: true });
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
        <Button variant="ghost" size="icon" onClick={() => navigate("/wisdom")} aria-label="Back">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="font-display text-xl font-bold text-foreground truncate">{title}</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-32">
        <SectionContent id={id} />

        {/* Explore Further */}
        <div className="mt-8 bg-card/80 border border-border rounded-3xl p-5 space-y-3">
          <h2 className="font-display text-base font-bold text-foreground">Explore Further</h2>
          <p className="text-sm text-muted-foreground">
            Take this teaching into practice or find tools, products, and practitioners to support your journey.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              className="w-full bg-gradient-to-r from-violet-700 to-indigo-700 text-white"
              onClick={() => navigate("/spiritual-tools")}
            >
              <Compass className="h-4 w-4 mr-2" />
              Spiritual Tools
            </Button>
            <Button
              className="w-full bg-white/10 text-foreground border border-border hover:bg-white/20"
              onClick={() => navigate("/resources")}
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Healing Store
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
