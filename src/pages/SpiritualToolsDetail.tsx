import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ARCHANGELS, type ArchangelProfile } from "@/data/angelData";
import { ANGEL_EXTRAS } from "@/data/angelExtras";
import AngelProfileModal from "@/components/AngelProfileModal";

type SectionKey =
  | "source-tools-vs-source"
  | "understanding-spiritual-realm"
  | "lightworker-persecution-clearing"
  | "angels-and-archangels"
  | "bloodline-healing"
  
  | "energy-clearing"
  | "crystals-how-to-use"
  | "essential-oils-how-to-use"
  | "soul-ties"
  | "cord-cutting"
  | "numerology-in-practice"
  | "nature-signs-synchronicities"
  | "animal-messengers"
  
  | "generational-patterns-breaking-cycles"
  | "prayer-templates"
  | "intercessor-connection"
  | "dream-interpretation-spiritual"
  | "spiritual-warfare-protection"
  | "discernment"
  | "daily-healing-practice";

const sectionTitles: Record<SectionKey, string> = {
  "source-tools-vs-source": "Source Tools vs Source",
  "understanding-spiritual-realm": "Understanding the Spiritual Realm",
  "lightworker-persecution-clearing": "Lightworker Persecution Clearing",
  "angels-and-archangels": "Angels and Archangels",
  "bloodline-healing": "Bloodline Healing",
  
  "energy-clearing": "Energy Clearing",
  "crystals-how-to-use": "Crystals and Stones — How to Use",
  "essential-oils-how-to-use": "Essential Oils and Plant Medicine",
  "soul-ties": "Soul Ties",
  "cord-cutting": "Cord Cutting Ritual",
  "numerology-in-practice": "Numerology in Practice",
  "nature-signs-synchronicities": "Nature Signs and Synchronicities",
  "animal-messengers": "Animal Messengers",
  
  "generational-patterns-breaking-cycles": "Generational Patterns and Breaking Cycles",
  "prayer-templates": "Prayer Templates",
  "intercessor-connection": "Intercessor Connection",
  "dream-interpretation-spiritual": "Dream Interpretation for Spiritual Messages",
  "spiritual-warfare-protection": "Spiritual Warfare and Protection",
  "discernment": "Discernment — Knowing What is From God",
  "daily-healing-practice": "Your Daily Healing Practice",
};

const deepWorkSections: SectionKey[] = [
  "lightworker-persecution-clearing",
  "bloodline-healing",
  "soul-ties",
  "cord-cutting",
  "spiritual-warfare-protection",
  "generational-patterns-breaking-cycles",
];

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

function Step({ number, title, desc }: { number: number; title: string; desc: string }) {
  return (
    <div className="flex gap-3 border border-border/40 rounded-xl p-3">
      <span className="flex-shrink-0 h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">{number}</span>
      <div>
        <p className="font-semibold text-foreground text-sm">{title}</p>
        <p className="text-xs mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

function SectionContent({ id, onOpenAngel }: { id: SectionKey; onOpenAngel: (a: ArchangelProfile) => void }) {
  switch (id) {

    case "source-tools-vs-source":
      return (
        <div className="space-y-4">
          <Block title="The Most Important Distinction in Spiritual Practice">
            <p>Every tool — crystals, oils, prayer beads, tuning forks, oracle cards, rituals — is a vessel. A vessel holds something. But the vessel is never the thing it holds. The danger in spiritual practice is when people begin to relate to the tool as if it were the source of power, rather than a conduit through which Source moves.</p>
            <p>This distinction is not minor. It is the difference between genuine spiritual authority and spiritual dependency. When your practice is rooted in Source, you carry the same power with or without the tool. When it is rooted in the tool, you are only as strong as the tool — and tools can be removed, corrupted, or manipulated.</p>
          </Block>
          <Block title="How Dependency Forms">
            <List items={[
              "You feel you cannot pray without a specific candle, crystal, or space",
              "You feel spiritually 'off' if you miss a ritual, not because you miss the connection, but because you fear losing the protection",
              "You attribute results to the tool rather than to Source moving through the tool",
              "You become afraid of certain tools rather than discerning who is using them and to what end",
              "You seek more and more tools instead of deepening your relationship with Source",
            ]} />
          </Block>
          <Block title="The Correct Posture with Tools">
            <List items={[
              "Every tool is an invitation — it invites your attention, intention, and alignment toward Source",
              "The tool amplifies what is already present — your faith, your surrender, your focus",
              "You can set down any tool and the Source behind it remains fully accessible",
              "Ask before using: 'Is this pointing me toward Source or away?'",
              "A tool used with ego, fear, or control is a different tool than the same object used in surrender and love",
            ]} />
          </Block>
          <Block title="A Simple Test">
            <p>Remove the tool. Can you still access what the tool was connecting you to? If yes — you are using the tool well. If the presence, peace, or power disappears with the tool — the tool has become an idol. The work is not to throw away the tool but to return to Source first, then pick the tool back up from that place.</p>
          </Block>
        </div>
      );

    case "understanding-spiritual-realm":
      return (
        <div className="space-y-4">
          <Block title="The Invisible Architecture of Reality">
            <p>The physical world you can see is not the whole of reality — it is the densest layer of a multi-dimensional spectrum of existence. Every major spiritual tradition and many branches of modern physics agree: there is more happening than what registers through the five senses.</p>
            <p>Understanding the structure of the spiritual realm is not about curiosity or mysticism for its own sake. It is about navigation. Knowing what is present in the unseen allows you to move with wisdom, maintain proper boundaries, and operate from authority rather than fear.</p>
          </Block>
          <Block title="Layers of Spiritual Reality">
            <div className="space-y-2">
              {[
                { realm: "The Physical Realm", desc: "The material dimension — the densest vibration. What you can see, touch, and measure. Influenced by, and influencing, all other realms." },
                { realm: "The Soul Realm", desc: "The dimension of human consciousness, emotion, memory, and will. Where healing work primarily occurs. Where trauma is stored and transformation happens." },
                { realm: "The Angelic Realm", desc: "The dimension of created spiritual beings assigned to serve and protect. Angels operate here as messengers, guardians, and ministers of divine will." },
                { realm: "The Adversarial Realm", desc: "The dimension of spiritual opposition — not equal to the divine, but real. Understanding this realm helps you recognize interference without fear and respond with authority." },
                { realm: "The Heavenly Realm", desc: "The dimension of divine presence, divine will, and eternal reality. Where Source dwells in fullness. Accessible through prayer, surrender, and deep stillness." },
              ].map((r) => (
                <div key={r.realm} className="border border-border/40 rounded-xl p-3">
                  <p className="font-semibold text-foreground text-sm">{r.realm}</p>
                  <p className="text-xs mt-1">{r.desc}</p>
                </div>
              ))}
            </div>
          </Block>
          <Block title="How to Navigate the Spiritual Realm Safely">
            <List items={[
              "Always begin from Source — enter through prayer, surrender, and grounded intention, not curiosity",
              "Know your identity — those who know who they are in Source are not easily destabilized",
              "Discern before you engage — not everything that presents itself as light is light",
              "Stay grounded — spiritual experiences should increase your stability, not dissolve it",
              "Do not go seeking what Source has not invited you into — the realm will open what you need when you need it",
              "Debrief after deep spiritual work — journal, eat, rest, and talk to someone who understands",
            ]} />
          </Block>
          <Block title="Signs the Spiritual Realm is Active Around You">
            <List items={[
              "Heightened intuition, strong inner knowing, vivid dreams",
              "Repeated encounters with the same symbol, animal, or number",
              "Sudden temperature shifts, unusual sensations in the body during prayer",
              "A persistent heaviness or lightness in specific locations",
              "The clear sense of being watched, accompanied, or guided",
            ]} />
          </Block>
        </div>
      );

    case "lightworker-persecution-clearing":
      return (
        <div className="space-y-4">
          <Block title="You Were Made for This — and the Opposition Knows It">
            <p>Lightworkers, healers, prophets, intercessors, and those who carry divine assignment are often subject to specific spiritual opposition. This is not because you are unlucky — it is because you are effective. Darkness does not waste energy on those who are not a threat.</p>
            <p>Lightworker persecution manifests spiritually, emotionally, relationally, and sometimes physically. It can look like chronic misunderstanding, isolation, chronic illness with no clear cause, financial blockage, family opposition, and intense spiritual attack during seasons of breakthrough.</p>
          </Block>
          <Block title="Forms of Spiritual Persecution">
            <List items={[
              "Sent assignments — spirits assigned specifically to disrupt your calling, ministry, or healing work",
              "Relational sabotage — people in your inner circle who carry opposition to your gift, sometimes unknowingly",
              "Dream attacks — nightmares, spirit oppression during sleep, night terrors",
              "Physical targeting — unexplained illness, accidents, or fatigue that clusters around spiritual activity",
              "Mental noise — persistent intrusive thoughts, confusion, doubt, or identity crisis specifically around your calling",
              "Financial blockage — inexplicable patterns of provision being cut off at breakthrough moments",
            ]} />
          </Block>
          <Block title="Clearing Prayer — Persecution and Assignments">
            <div className="bg-background/40 rounded-xl p-4 border border-primary/20">
              <p className="text-sm italic leading-relaxed">
                "Father, in the name of Jesus, I renounce and sever every assignment sent against my calling, my healing work, and my divine purpose. I cancel every curse, word curse, and spoken assignment released against me. I revoke access granted through fear, doubt, agreement, or ignorance. I stand in the authority of Source and declare that no weapon formed against me shall prosper. I release forgiveness to every human vessel used in opposition to me. I cover myself, my home, my family, and my ministry with the blood of Jesus. I invite the angels of Source to encamp around me and establish a perimeter of divine protection. I am cleared, I am covered, I am free to operate in my full assignment. Amen."
              </p>
            </div>
          </Block>
          <Block title="Daily Protection Habits for Lightworkers">
            <List items={[
              "Begin each day with a declaration of identity — not what you do, but who you are in Source",
              "Plead the blood of Jesus over yourself, your family, and your work each morning",
              "Regularly audit your inner circle — who has access to your most sensitive spiritual work",
              "Do not announce major spiritual assignments prematurely — steward them in silence until established",
              "Take Sabbath seriously — rest is not weakness, it is strategic spiritual maintenance",
              "Stay in community with other mature intercessors and spiritual leaders who can hold accountability",
            ]} />
          </Block>
        </div>
      );

    case "angels-and-archangels":
      return (
        <div className="space-y-4">
          <Block title="Understanding Angelic Ministry">
            <p>Angels are created spiritual beings assigned to serve the purposes of Source and to minister to those who will inherit salvation (Hebrews 1:14). They are not to be worshipped or petitioned independently — but they are real, active, and available as ministers of divine will. You do not command angels directly. You align with Source, and Source dispatches the angelic realm.</p>
          </Block>
          <Block title="The 15 Archangels — Tap a Card to Open Their Portal">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ARCHANGELS.map((a) => (
                <button
                  key={a.name}
                  onClick={() => onOpenAngel(a)}
                  className="text-left rounded-2xl p-3 border transition-all hover:scale-[1.02] active:scale-[0.99] flex items-center gap-3"
                  style={{
                    background: a.palette.atmosphere + "cc",
                    borderColor: a.palette.accentMid + "55",
                  }}
                  aria-label={`Open ${a.name} angel profile`}
                >
                  <img
                    src="/images/Wings.jpg"
                    alt=""
                    aria-hidden="true"
                    className="h-5 w-5 object-contain shrink-0"
                  />
                  <p className="font-display font-bold text-base" style={{ color: a.palette.nameColor }}>
                    {a.name}
                  </p>
                </button>
              ))}
            </div>
          </Block>
          <Block title="How to Work with Angels Correctly">
            <List items={[
              "Pray to Source, not to angels — invite Source to dispatch angelic assistance as needed",
              "You can acknowledge their presence and their assignment, but do not direct them as if they serve you",
              "Angels respond to alignment with divine will — the more you align with Source, the more angelic activity you experience",
              "Never allow curiosity to replace discernment — not everything presenting as an angel is one",
              "Test all spiritual encounters: Does this point me toward Source? Does it increase peace, love, and sound mind?",
            ]} />
          </Block>
        </div>
      );

    case "bloodline-healing":
      return (
        <div className="space-y-4">
          <Block title="What is Bloodline Healing?">
            <p>Bloodline healing addresses the spiritual, emotional, and biological inheritance that has passed through your family line across generations. This includes unresolved trauma, broken covenants, spoken curses, patterns of addiction or abuse, religious spirits, orphan spirit, poverty mindset, and other strongholds that repeat across family history.</p>
            <p>This is one of the most significant and often most resistant forms of healing work. It requires patience, discernment, and for many people — the support of an intercessor or spiritual director.</p>
          </Block>
          <Block title="How to Identify Bloodline Patterns">
            <List items={[
              "Look for patterns that repeat across at least two or three generations",
              "Notice recurring causes of death, divorce, addiction, illness, or financial ruin",
              "Observe the emotional climate of your family — what was never spoken but always felt",
              "Identify the stronghold narrative: 'We don't succeed,' 'Men always leave,' 'Women always suffer,' 'Money never stays'",
              "Note which of your own struggles appeared before you were old enough to have created them yourself",
            ]} />
          </Block>
          <Block title="Bloodline Renunciation Prayer">
            <div className="bg-background/40 rounded-xl p-4 border border-primary/20">
              <p className="text-sm italic leading-relaxed">
                "Heavenly Father, I come before you on behalf of myself and my bloodline — past, present, and future. I acknowledge the sins, covenants, and agreements made by my ancestors that opened doors to darkness. I renounce and repent on behalf of my lineage for [name the specific patterns — e.g., witchcraft, addiction, sexual sin, idolatry, poverty, abuse, pride]. I break every curse and every generational covenant made in darkness over my family line. In the name of Jesus, I close every door that was opened, I revoke every legal right claimed against us, and I apply the blood of the covenant to my lineage. I declare that the pattern stops with me. I release forgiveness to every ancestor who did not know better and to those who did. I ask you, Father, to send angelic ministers to retrieve what has been lost in my bloodline and restore it to me and to those who come after me. Amen."
              </p>
            </div>
          </Block>
          <Block title="After the Prayer — What to Expect">
            <List items={[
              "Relief, lightness, and unexpected emotional release — this is the pattern lifting",
              "Temporary resistance — old patterns may seem to intensify briefly before breaking",
              "Dreams and memories — old material surfacing for final release",
              "New insight — sudden understanding of family patterns you could not see before",
              "Changed behavior — noticing that old triggers no longer carry the same charge",
            ]} />
          </Block>
          <Block title="This Work May Need Support">
            <p>Deep bloodline healing is most effective with a mature intercessor, spiritual director, or healing minister present. If this prayer surfaces grief, rage, or overwhelm you are not ready to hold alone — stop and reach out.</p>
          </Block>
        </div>
      );

    case "energy-clearing":
      return (
        <div className="space-y-4">
          <Block title="Why Clearing is Necessary">
            <p>Energetic residue is real. Spaces, objects, and people accumulate the energetic imprint of events, emotions, and spiritual activity. This residue can be felt as heaviness, unease, persistent low mood, or spiritual stagnation. Regular clearing is not superstition — it is maintenance for those who are sensitive to and active in the spiritual realm.</p>
          </Block>
          <Block title="Clearing Your Body and Aura">
            <div className="space-y-2">
              {[
                { method: "Cold Water", desc: "Cold showers or splashing cold water on the face and back of the neck rapidly disrupts accumulated energy from the auric field. Do this after intense healing sessions, emotionally heavy encounters, or difficult environments." },
                { method: "Salt Bath or Foot Soak", desc: "Dissolve Himalayan or sea salt in a warm bath. Soak for 20 minutes while visualizing all foreign energy dissolving into the salt water. Rinse and drain — the energy drains with the water." },
                { method: "Breathwork", desc: "4-7-8 breathing or conscious connected breathing for 10–15 minutes clears accumulated emotional and energetic material from the field." },
                { method: "Grounding", desc: "Bare feet on earth. Sit or stand on soil, grass, or stone for 10–20 minutes and allow the Earth to draw off excess charge. One of the most effective and accessible clearing methods." },
                { method: "Shaking and Tremoring", desc: "Neurogenic tremoring (allowing the body to shake spontaneously) or deliberate shaking of the arms, legs, and torso discharges stored energy and resets the nervous system simultaneously." },
              ].map((m) => (
                <div key={m.method} className="border border-border/40 rounded-xl p-3">
                  <p className="font-semibold text-foreground text-sm">{m.method}</p>
                  <p className="text-xs mt-1">{m.desc}</p>
                </div>
              ))}
            </div>
          </Block>
          <Block title="Clearing Your Space">
            <List items={[
              "Sound — clap loudly in every corner, or use a singing bowl, tuning fork, or drum to break up stagnant energy",
              "Smoke cleansing — burn dried sage, palo santo, frankincense, or cedar. Move clockwise through the space with windows open to allow the cleared energy to exit",
              "Salt lines — placing sea or Himalayan salt along thresholds and windowsills absorbs and neutralizes heavy energy",
              "Prayer and declaration — speaking scripture and divine truth aloud in the space is among the most powerful forms of clearing available",
              "Fresh air and sunlight — open windows and allow natural light to penetrate every room regularly",
              "Plants — living plants actively filter the energetic and physical atmosphere of a space",
            ]} />
          </Block>
          <Block title="Clearing Objects">
            <List items={[
              "Moonlight — leave objects under the full moon overnight for deep clearing",
              "Sunlight — brief sunlight exposure (avoid for certain crystals like amethyst and rose quartz)",
              "Selenite proximity — place objects near or on selenite overnight",
              "Smoke — pass objects through sacred smoke",
              "Prayer — hold the object and declare it cleared and consecrated to Source",
            ]} />
          </Block>
          <Block title="When to Clear">
            <List items={[
              "After any argument, significant emotional event, or illness in the space",
              "After visitors — especially those who carry heaviness",
              "Before and after doing healing work with others",
              "After purchasing second-hand objects or moving into a new home",
              "Seasonally — quarterly as spiritual maintenance",
            ]} />
          </Block>
        </div>
      );

    case "crystals-how-to-use":
      return (
        <div className="space-y-4">
          <Block title="Remember: The Crystal is the Tool, Source is the Power">
            <p>Crystals carry stable, coherent electromagnetic frequencies that can interact with and support your biofield and intentions. They do not have power over you, and they are not sources of power in themselves. They are amplifiers — what you bring to the crystal in terms of intention, faith, and alignment with Source determines what flows through them.</p>
          </Block>
          <Block title="Step 1 — Cleansing Your Crystal">
            <p>Before working with any crystal, clear the energetic residue it may have accumulated. Methods:</p>
            <List items={[
              "Moonlight — full moon is most powerful; leave outside or on a windowsill overnight",
              "Running water — hold under cool running water for 30–60 seconds (not for water-soluble stones like selenite, malachite, or calcite)",
              "Sound — hold near a ringing singing bowl or use a tuning fork",
              "Smoke — pass through sage, palo santo, or frankincense smoke",
              "Selenite charging plate — place on or near selenite for several hours",
              "Sunlight — brief exposure works for most stones (limit for amethyst, rose quartz, citrine — they can fade)",
            ]} />
          </Block>
          <Block title="Step 2 — Programming with Intention">
            <div className="space-y-2">
              {[
                { step: 1, title: "Hold the crystal in both hands", desc: "Feel its weight and temperature. Take three slow breaths to settle." },
                { step: 2, title: "State your intention clearly", desc: "Speak or mentally direct a specific, positive intention into the crystal — for example: 'I program this stone to support clarity and peace in my healing practice.'" },
                { step: 3, title: "Breathe into it", desc: "Take a deep breath and on the exhale, visualize your intention entering the stone as light or warmth." },
                { step: 4, title: "Seal with gratitude", desc: "Thank the crystal, thank Source, and hold the intention as already established." },
              ].map((s) => <Step key={s.step} number={s.step} title={s.title} desc={s.desc} />)}
            </div>
          </Block>
          <Block title="How to Use Crystals">
            <List items={[
              "Wearing — carrying a crystal on your body keeps its frequency in continuous contact with your biofield",
              "Meditation — hold in the hands or place on the body during meditation to amplify specific states",
              "Placement — position crystals in key locations: black tourmaline at doors for protection, amethyst in sleep spaces, citrine in workspaces",
              "Crystal grids — arrange multiple crystals in geometric patterns to amplify and direct combined intentions",
              "Water infusion — place crystals (only non-toxic ones) near a water vessel overnight to create crystal-charged water for drinking",
              "Body placement — lay corresponding crystals on chakra points during energy healing sessions",
            ]} />
          </Block>
          <Block title="Crystals and Their Primary Uses (Quick Reference)">
            <List items={[
              "Clear Quartz — amplifies any intention; master healer and programmer",
              "Amethyst — calm, sleep, protection, intuition, sobriety",
              "Rose Quartz — self-love, heart healing, grief, receiving love",
              "Black Tourmaline — EMF protection, absorbing negativity, grounding",
              "Citrine — joy, abundance, confidence, manifestation",
              "Labradorite — intuition, aura protection, empathic shielding",
              "Selenite — cleansing, high frequency connection, clarity",
              "Black Obsidian — shadow work, cord cutting, revealing truth",
            ]} />
          </Block>
        </div>
      );

    case "essential-oils-how-to-use":
      return (
        <div className="space-y-4">
          <Block title="The Intelligence of Plant Oils">
            <p>Essential oils are the concentrated life-force of plants — their immune system, communication molecules, and healing chemistry in pure form. When used properly, they interact with the body's own biochemistry, nervous system, and energy field in ways that support healing at multiple levels simultaneously.</p>
          </Block>
          <Block title="Dilution — Non-Negotiable Safety">
            <p>Most essential oils must be diluted in a carrier oil before skin application. Undiluted application (called 'neat') can cause chemical burns, sensitization, and allergic reactions for most oils.</p>
            <div className="space-y-2">
              {[
                { ratio: "1% dilution", use: "Children, face, sensitive skin, elderly", amount: "1 drop oil per teaspoon carrier" },
                { ratio: "2% dilution", use: "Standard adult daily use", amount: "2 drops oil per teaspoon carrier" },
                { ratio: "3–5% dilution", use: "Acute issues, targeted short-term use", amount: "3–5 drops per teaspoon carrier" },
                { ratio: "10%+ dilution", use: "Very short-term acute pain or injury only", amount: "10+ drops per teaspoon — not for daily use" },
              ].map((d) => (
                <div key={d.ratio} className="border border-border/40 rounded-xl p-3 flex gap-3">
                  <span className="font-bold text-primary text-sm flex-shrink-0 w-20">{d.ratio}</span>
                  <div>
                    <p className="text-xs font-semibold">{d.use}</p>
                    <p className="text-xs opacity-70">{d.amount}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs italic">Carrier oils: coconut, jojoba, sweet almond, avocado, rosehip — each has its own therapeutic properties.</p>
          </Block>
          <Block title="Blending for Healing — Principles">
            <List items={[
              "Note structure — top notes (fast, light: citrus, peppermint), middle notes (body: lavender, clary sage), base notes (slow, grounding: frankincense, cedarwood, myrrh)",
              "A well-rounded blend contains all three note levels — they interact and evolve on the skin",
              "Less is more — 3–5 oils in a blend is usually more harmonious than 8+",
              "Smell the blend and observe your body's response — your body knows what it needs",
              "Intention matters — blend with prayer and purpose, not just recipe-following",
            ]} />
          </Block>
          <Block title="Healing Blends to Begin With">
            <div className="space-y-2">
              {[
                { name: "Grounding Blend", oils: "Cedarwood 3 drops + Frankincense 2 drops + Vetiver 1 drop in 1 tsp coconut oil. Apply to wrists, feet, and base of spine." },
                { name: "Heart Healing Blend", oils: "Rose 2 drops + Bergamot 3 drops + Ylang Ylang 2 drops in jojoba. Apply over the heart and behind the ears." },
                { name: "Protection Blend", oils: "Frankincense 3 drops + Myrrh 2 drops + Black Pepper 1 drop in coconut oil. Apply to crown and back of neck." },
                { name: "Grief Blend", oils: "Rose 2 drops + Helichrysum 2 drops + Sandalwood 2 drops in rosehip oil. Apply to sternum and pulse points." },
                { name: "Clarity Blend", oils: "Rosemary 3 drops + Lemon 3 drops + Peppermint 2 drops in jojoba. Diffuse or apply to temples." },
              ].map((b) => (
                <div key={b.name} className="border border-border/40 rounded-xl p-3">
                  <p className="font-semibold text-foreground text-sm">{b.name}</p>
                  <p className="text-xs mt-1">{b.oils}</p>
                </div>
              ))}
            </div>
          </Block>
          <Block title="Safety Essentials">
            <List items={[
              "Photosensitive oils (citrus, bergamot, angelica) — do not apply before sun or UV exposure",
              "Pregnancy cautions — avoid clary sage, rosemary, basil, and most strong oils in first trimester",
              "Internal use — only certified food-grade oils under qualified guidance",
              "Eye and mucous membranes — never apply directly",
              "Children — maximum 0.5–1% dilution, avoid eucalyptus and peppermint near face under age 10",
            ]} />
          </Block>
        </div>
      );

    case "soul-ties":
      return (
        <div className="space-y-4">
          <Block title="What is a Soul Tie?">
            <p>A soul tie is a spiritual and emotional bond that forms between two people — connecting them at the level of the soul (mind, will, and emotions). Soul ties are not inherently negative. Covenant soul ties — formed through marriage, deep friendship, spiritual mentorship, and genuine love — are designed by Source for protection, nourishment, and growth.</p>
            <p>Ungodly soul ties form through sexual union outside of covenant, through trauma bonding, through relationships involving manipulation or control, and through any connection where the soul bonded in a context that was not safe, mutual, or Source-directed.</p>
          </Block>
          <Block title="Signs of an Ungodly Soul Tie">
            <List items={[
              "You think about a person compulsively even when you have chosen to move on",
              "You feel unable to make decisions without their input or approval even after the relationship has ended",
              "Their emotional state affects yours without any contact — you feel what they feel",
              "You find yourself repeating the same patterns, conflicts, or dynamics from this relationship in every new connection",
              "You experience physical symptoms or energetic depletion that correlate with contact or thoughts of this person",
              "Dreams involving this person that feel like more than memory — like active connection",
              "You feel controlled, monitored, or unable to fully belong to yourself in their absence",
            ]} />
          </Block>
          <Block title="How Soul Ties Form">
            <List items={[
              "Sexual union — the deepest soul tie. 'The two shall become one flesh.' (Genesis 2:24) Every sexual partner creates a soul tie.",
              "Trauma bonding — intense shared trauma creates powerful bonds, including with abusers",
              "Spiritual entanglement — shared occult practice, soul agreements, or spiritual alignment with another person",
              "Deep emotional dependency — relationships where one person's identity was absorbed into another",
              "Vows — spoken or unspoken — including childhood vows made under duress",
            ]} />
          </Block>
          <Block title="Breaking a Soul Tie — Prayer">
            <div className="bg-background/40 rounded-xl p-4 border border-primary/20">
              <p className="text-sm italic leading-relaxed">
                "Father, in the name of Jesus, I acknowledge the soul tie that formed between myself and [name]. I renounce and repent of every way that tie was formed outside of your design. I ask you to sever this bond completely — spirit, soul, and body. I take back every part of myself that was given, transferred, or taken in this connection. I release [name] fully to you. I forgive them and I release myself from judgment. I close every door that was opened through this relationship. I ask you to heal the wound where this tie was severed, to fill the space with your presence, and to restore to me what was lost. I am whole. I am free. Amen."
              </p>
            </div>
          </Block>
          <Block title="After Breaking a Soul Tie">
            <List items={[
              "Grief is normal — even unhealthy bonds carry attachment that takes time to dissolve",
              "Avoid contact if possible during the initial healing period",
              "Fill the space — with Source, community, creative work, and intentional nourishment",
              "Repeat the prayer if the tie re-activates — some ties need multiple sessions of clearing",
            ]} />
          </Block>
        </div>
      );

    case "cord-cutting":
      return (
        <div className="space-y-4">
          <Block title="What are Energetic Cords?">
            <p>Energetic cords are channels of exchange that form between people through sustained emotional investment — love, fear, anger, resentment, longing, or grief. Unlike soul ties (which are deeper spiritual bonds), cords are more like pipes through which energy, thoughts, and emotions flow bidirectionally.</p>
            <p>Cords to people you love can be nourishing. But cords to people with whom you have unresolved pain, resentment, or dependency become drains — siphoning your energy and keeping you emotionally entangled long after the relationship itself has ended.</p>
          </Block>
          <Block title="Signs You Have Draining Cords">
            <List items={[
              "Unexplained fatigue especially after thinking about a specific person",
              "Intrusive thoughts about someone you have tried to release",
              "Feeling their emotions as if they are your own",
              "Physical sensations in the body (chest tightness, stomach pain) associated with a particular person",
              "Dreams that feel like active visits rather than memory processing",
            ]} />
          </Block>
          <Block title="The Cord Cutting Ritual — Step by Step">
            <div className="space-y-2">
              {[
                { step: 1, title: "Create sacred space", desc: "Light a candle if that supports your focus. Take several deep, slow breaths. Begin with a brief prayer grounding you in Source: 'I am Source's. I am protected. I am free to receive healing.'" },
                { step: 2, title: "Center and ground", desc: "Feel your feet on the floor. Feel the weight of your body. Arrive fully in the present moment — cord cutting from a scattered state is less effective." },
                { step: 3, title: "Name the cord", desc: "Bring to mind the person or situation. Feel where the cord is connected in your body — many experience it in the chest, stomach, or throat. Do not force imagery; simply notice what is present." },
                { step: 4, title: "Speak forgiveness", desc: "Say aloud: 'I forgive [name] for all ways they have hurt or affected me. I release judgment. I release anger. I release all expectations of what they owed me that I did not receive.'" },
                { step: 5, title: "Cut the cord", desc: "Using your hand or a visualized tool — scissors, a sword of light, a beam of divine fire — speak: 'In the name of Source and in the authority of love, I sever this cord now. What was connected in pain is now released in peace.'" },
                { step: 6, title: "Seal and fill", desc: "Visualize the place where the cord was attached filling with light. Speak: 'I am whole. Every space that was emptied is now filled with the presence of Source. I belong fully to myself and to the One who made me.'" },
                { step: 7, title: "Ground and close", desc: "Eat something, drink water, take a walk outside. Grounding after cord cutting is important — it helps the body register what the spirit just did." },
              ].map((s) => <Step key={s.step} number={s.step} title={s.title} desc={s.desc} />)}
            </div>
          </Block>
          <Block title="Important Notes">
            <List items={[
              "Cord cutting does not destroy loving relationship — it removes the pain, fear, and resentment attached to a connection",
              "You may feel immediate lightness, or it may take several days to register",
              "Some cords need cutting more than once — especially long-term bonds with significant trauma attached",
              "After cutting, some people feel grief — allow it. The cord carried something, even if unhealthy.",
              "If the person is still in your life, you may need to use different words: 'I sever the cords of fear and control between us, while maintaining healthy, loving connection.'",
            ]} />
          </Block>
        </div>
      );

    case "numerology-in-practice":
      return (
        <div className="space-y-4">
          <Block title="Numerology as a Daily Compass">
            <p>Numerology is not fatalism or fortune-telling. Used correctly, it is a language for understanding cycles, timing, and the qualities of energy that are active in a given period. It helps you align your actions with the flow of the season you are in — rather than fighting it.</p>
          </Block>
          <Block title="Calculate Your Life Path Number">
            <p>Add all digits of your full birth date (day + month + year) and reduce to a single digit or master number (11, 22, 33).</p>
            <div className="bg-background/40 rounded-xl p-3 border border-primary/20">
              <p className="text-sm font-semibold">Example: March 15, 1988</p>
              <p className="text-xs mt-1">3 + 1 + 5 + 1 + 9 + 8 + 8 = 35 → 3 + 5 = 8</p>
              <p className="text-xs mt-0.5">Life Path 8 — The Powerhouse</p>
            </div>
          </Block>
          <Block title="Your Personal Year Number">
            <p>Your personal year changes annually on your birthday. Add your birth day + birth month + current year, reduce to a single digit.</p>
            <div className="space-y-1">
              {[
                "Personal Year 1 — New beginnings. Plant seeds. Begin projects. Establish foundations.",
                "Personal Year 2 — Patience, partnership, waiting. This is a year for relationships and trust.",
                "Personal Year 3 — Creativity, expression, expansion. Share your voice. Create.",
                "Personal Year 4 — Building, discipline, structure. Lay solid groundwork.",
                "Personal Year 5 — Change, freedom, movement. Be flexible. Expect the unexpected.",
                "Personal Year 6 — Home, family, responsibility, healing. Nurture what matters most.",
                "Personal Year 7 — Reflection, spiritual depth, solitude. Seek. Study. Rest.",
                "Personal Year 8 — Manifestation, authority, material abundance. Harvest what you planted.",
                "Personal Year 9 — Completion, release, endings. Clear what no longer belongs. Prepare for a new cycle.",
              ].map((y, i) => <p key={i} className="text-xs">{y}</p>)}
            </div>
          </Block>
          <Block title="Daily Number Practice">
            <List items={[
              "Find the current date's energy by adding the day + month + year and reducing",
              "Notice how the number's quality matches the day's events — this builds sensitivity to the system",
              "Align your tasks with the day's energy: creative work on 3 days, administrative on 4 days, rest on 7 days",
              "Journal your number observations weekly — patterns will emerge within a month",
            ]} />
          </Block>
        </div>
      );

    case "nature-signs-synchronicities":
      return (
        <div className="space-y-4">
          <Block title="Source Speaks Through Creation">
            <p>The physical world is not separate from the spiritual. Creation is the language of Source — a continuous transmission of meaning, invitation, and confirmation available to those with eyes to see. Romans 1:20 says that since the creation of the world, the invisible qualities of Source have been clearly seen through what has been made.</p>
            <p>A synchronicity is when two or more apparently unrelated events coincide in a way that carries undeniable meaning. Carl Jung called it 'meaningful coincidence.' In spiritual practice, it is simply the moment when Source's invisible communication becomes visible enough to catch your attention.</p>
          </Block>
          <Block title="Common Nature Signs and Their Meanings">
            <div className="space-y-2">
              {[
                { sign: "Feathers", meaning: "Angelic presence, confirmation that you are not alone, a message has been sent or received" },
                { sign: "Rainbows", meaning: "Covenant promise, a sign after a season of difficulty, divine confirmation of faithfulness" },
                { sign: "Wind with no visible cause", meaning: "The movement of the Spirit — often accompanies prayer, breakthrough, or significant spiritual moments" },
                { sign: "Repeated numbers (111, 444, etc.)", meaning: "Directional confirmation, specific messages from the angelic realm (see Numerology section)" },
                { sign: "Clouds that form shapes or faces", meaning: "Attention-getting signals; pause and ask Source what the message is" },
                { sign: "Sudden stillness or silence in nature", meaning: "A call to stop and pay attention; something is being communicated in the quiet" },
                { sign: "Lightning in clear sky / unusual weather", meaning: "Prophetic weather — often signals a spiritual transition or a period of spiritual shaking and clearing" },
                { sign: "Flowers blooming out of season", meaning: "Resurrection signs, breakthrough where none seemed possible" },
                { sign: "Water behavior (still water, unexpected rain)", meaning: "Emotional and spiritual cleansing is available or underway" },
              ].map((s) => (
                <div key={s.sign} className="border border-border/40 rounded-xl p-3">
                  <p className="font-semibold text-foreground text-sm">{s.sign}</p>
                  <p className="text-xs mt-1">{s.meaning}</p>
                </div>
              ))}
            </div>
          </Block>
          <Block title="How to Read Signs Wisely">
            <List items={[
              "Signs confirm — they rarely initiate. Let Source speak first in prayer and scripture, and look for signs as confirmation",
              "Do not make major decisions based on signs alone — test with prayer, community, and scripture",
              "Journal synchronicities — patterns over time reveal the themes of your current season",
              "Respond with gratitude, not dependence — signs are invitations into conversation with Source, not a replacement for relationship",
            ]} />
          </Block>
        </div>
      );

    case "animal-messengers":
      return (
        <div className="space-y-4">
          <Block title="Animals as Spiritual Messengers">
            <p>Across virtually every human culture — Indigenous American, Celtic, African, Asian, and biblical — animals have been understood as messengers and symbols carrying divine communication. This is not worshipping nature. It is recognizing that Source created all things with meaning, and that creation speaks.</p>
            <p>The difference between a random animal sighting and a spiritual message is usually this: the animal appears unexpectedly, repeatedly, or in unusual behavior, and it is accompanied by an inner sense of significance that draws your attention.</p>
          </Block>
          <Block title="Common Animal Messengers and Their Spiritual Meanings">
            <div className="space-y-2">
              {[
                { animal: "Eagle", meaning: "Divine vision, sovereignty, rising above the situation, prophetic perspective" },
                { animal: "Owl", meaning: "Wisdom in darkness, hidden truth being revealed, transition, death of an old season" },
                { animal: "Dove", meaning: "Peace, the presence of the Holy Spirit, a season of gentle restoration" },
                { animal: "Raven / Crow", meaning: "Transformation, magic, the shadow realm, intelligence, and the alchemy of difficult things" },
                { animal: "Butterfly", meaning: "Transformation, rebirth, the resurrection principle — what was has become new" },
                { animal: "Deer", meaning: "Gentleness, grace, sensitivity, navigating the unknown with poise and trust" },
                { animal: "Lion", meaning: "Courage, authority, divine kingship, the Messianic presence (Lion of Judah)" },
                { animal: "Snake", meaning: "Healing and transformation (Kundalini, the bronze serpent), or deception — discernment required" },
                { animal: "Hummingbird", meaning: "Joy, lightness, presence in the moment, that sweetness is available to you now" },
                { animal: "Wolf", meaning: "Community, loyalty, the power of the pack, following your path with others" },
                { animal: "Hawk", meaning: "A messenger — pay attention, observation is needed, a message is coming" },
                { animal: "Dragonfly", meaning: "Illusion being dissolved, seeing clearly through what appeared real, spiritual maturity" },
                { animal: "Whale", meaning: "Ancient wisdom, the depth of the unconscious, a call to go deep" },
                { animal: "Fox", meaning: "Cunning, adaptability, the need for strategy and discernment in a complex situation" },
              ].map((a) => (
                <div key={a.animal} className="border border-border/40 rounded-xl p-3">
                  <p className="font-semibold text-foreground text-sm">{a.animal}</p>
                  <p className="text-xs mt-1">{a.meaning}</p>
                </div>
              ))}
            </div>
          </Block>
          <Block title="How to Receive Animal Messages">
            <List items={[
              "Pause when the encounter feels significant — do not dismiss it immediately",
              "Ask Source: 'What are you showing me through this?' — the answer often arrives immediately",
              "Research the traditional meanings of the animal across cultures, then hold them loosely against your specific context",
              "Journal — the message often becomes clearer in writing",
              "Do not manufacture meaning where there is none — trust the inner sense of significance to guide you",
            ]} />
          </Block>
        </div>
      );

    case "generational-patterns-breaking-cycles":
      return (
        <div className="space-y-4">
          <Block title="The Practical Work of Breaking Cycles">
            <p>Understanding that a pattern is generational is the beginning, not the end. The work is to actively dismantle what was inherited and replace it with a new living pattern. This requires three movements: identification, renunciation, and declaration.</p>
          </Block>
          <Block title="Step 1 — Identify the Pattern Clearly">
            <div className="space-y-2">
              {[
                { step: 1, title: "Name the pattern", desc: "Be specific — not 'my family struggles' but 'the men in my family abandon their children,' or 'every woman in my lineage married someone who controlled them.'" },
                { step: 2, title: "Trace it back", desc: "How many generations can you see it? Can you identify where it may have originated — a trauma, a choice, a covenant, an agreement?" },
                { step: 3, title: "Identify how it shows up in you", desc: "Where do you see the same pattern operating in your own thoughts, choices, or relationships — even in different form?" },
                { step: 4, title: "Name the lie underneath it", desc: "Every generational pattern is upheld by a belief. 'Love is dangerous.' 'We are never enough.' 'Success gets taken away.' What is the foundational false belief?" },
              ].map((s) => <Step key={s.step} number={s.step} title={s.title} desc={s.desc} />)}
            </div>
          </Block>
          <Block title="Step 2 — Renunciation Prayer">
            <div className="bg-background/40 rounded-xl p-4 border border-primary/20">
              <p className="text-sm italic leading-relaxed">
                "Father, I acknowledge the pattern of [name the pattern] in my bloodline. I repent on behalf of myself and my ancestors for every agreement, choice, and covenant that established this pattern. I renounce the lie of [name the belief]. I sever this pattern from my lineage in the name of Jesus. I declare that it does not continue through me. I close every door that kept this pattern alive in my family. I ask you to restore to my lineage what this pattern stole across generations. Amen."
              </p>
            </div>
          </Block>
          <Block title="Step 3 — Declaration and Replacement">
            <p>You cannot leave a vacuum. The pattern that has been cleared must be replaced with a new, true declaration that is spoken regularly — aloud, not just thought.</p>
            <div className="space-y-1">
              {[
                "Old: 'Love always ends in abandonment.' → New: 'I am loved by an unshakeable Source. I attract and maintain healthy, faithful love.'",
                "Old: 'We never have enough.' → New: 'I am a conduit of divine provision. Abundance flows through me and is sustainable.'",
                "Old: 'Speaking up gets you hurt.' → New: 'My voice is safe, sacred, and needed. I speak truth in love.'",
              ].map((d, i) => <p key={i} className="text-xs border border-border/40 rounded-xl p-3">{d}</p>)}
            </div>
          </Block>
          <Block title="Holding the New Pattern">
            <List items={[
              "Speak the replacement declaration daily for at least 40 days — the threshold of habit formation",
              "Notice when the old pattern resurfaces in thought or behavior — renounce it immediately and return to the declaration",
              "Community accountability — share the work with a trusted intercessor or spiritual director",
              "Celebrate evidence of the new pattern — where you see it working, name it and give thanks",
            ]} />
          </Block>
        </div>
      );

    case "prayer-templates":
      return (
        <div className="space-y-4">
          <Block title="Prayer is Conversation, Not Performance">
            <p>These templates are starting places, not scripts. The goal is always authentic communion with Source — not the perfect arrangement of words. Let these frameworks hold you until you find your own language.</p>
          </Block>
          <div className="space-y-4">
            {[
              { title: "Morning Grounding Prayer", prayer: "Father, I begin this day with you. I surrender this day — its plans, its uncertainties, its encounters — into your hands. Cover me and all who belong to me with your protection. Give me eyes to see what matters, ears to hear what you are saying, and a heart that stays tender toward you and others. Let every step I take today be ordered by you. I am yours. Lead me well. Amen." },
              { title: "Intercessory Prayer Template", prayer: "Father, I stand in the gap for [name]. I bring them before you now. You know exactly what they are carrying, where they are stuck, and what they need. I pray for [specific need]. I ask you to intervene in ways that are beyond what I can see or imagine. Cover them with your presence. Send your angels. Soften what needs softening. Strengthen what needs strength. Remove from their path what does not belong there. I release them fully to you and trust you with the outcome. Amen." },
              { title: "Healing Prayer", prayer: "Father, you are the source of all healing — not the tool, not the method, not the practitioner. I invite your healing presence into [name or situation]. Touch every layer: spirit, soul, and body. Heal what can be seen and what cannot. Restore what was lost. Renew what has been depleted. Let your peace settle into every anxious place. I receive your healing by faith and I thank you for it. Amen." },
              { title: "Protection Prayer", prayer: "Father, I cover myself and all I carry in the blood of Jesus. I ask you to station your angelic protection at every entrance of my life. Close every door the enemy seeks to use. No weapon formed against me shall prosper. No assignment shall find its mark. I stand in your authority as your child and I declare that I am safe under your covering. Amen." },
              { title: "Warfare Prayer", prayer: "Father, I acknowledge that the battle is yours, not mine. I put on the full armor of God — truth, righteousness, readiness, faith, salvation, your Word, and prayer. I stand against every assignment of darkness operating against [name the situation]. I bind what needs binding and loose what needs loosing. I speak peace to the storm. I speak clarity into the confusion. I declare your victory over this situation. The battle is already won. Amen." },
              { title: "Declaration Prayer", prayer: "I declare that I am [speak your identity in Source]. I declare that [speak what you are choosing to believe over this situation]. I declare that Source is at work even when I cannot see it. I speak this over my life, my home, my family, and my future. These words carry weight in the spiritual realm. I release them with faith. It is done. Amen." },
            ].map((p) => (
              <Block key={p.title} title={p.title}>
                <div className="bg-background/40 rounded-xl p-3 border border-primary/20">
                  <p className="italic">{p.prayer}</p>
                </div>
              </Block>
            ))}
          </div>
        </div>
      );

    case "intercessor-connection":
      return (
        <div className="space-y-4">
          <Block title="What an Intercessor Carries">
            <p>An intercessor is one who stands in the gap — between the need and the Source of supply, between the wounded and the Healer, between the moment and its breakthrough. Intercession is one of the highest callings in spiritual service, and it is also one of the least understood.</p>
            <p>An intercessor does not just pray for you. They enter into spiritual labor with you — carrying your burden in prayer until breakthrough comes, standing in authority against what is opposing you, and agreeing with the divine intention for your life even when you cannot see it yourself.</p>
          </Block>
          <Block title="What to Expect When Working with an Intercessor">
            <List items={[
              "They will likely ask specific questions — the more honest you are, the more precise the intercession",
              "They may receive prophetic insight during prayer — words, images, or scripture that address your specific situation",
              "They will not do the work for you — they stand with you, not instead of you",
              "What is shared in the intercessory relationship is held in strict spiritual confidence",
              "The result of good intercession is often: unexpected peace, clarity about next steps, or breakthrough in specific areas that seemed stuck",
            ]} />
          </Block>
          <Block title="What to Bring to an Intercessor">
            <List items={[
              "Honesty — you do not need to clean yourself up before approaching intercession",
              "Specificity — 'I need prayer' is less effective than 'I need prayer for the fear that grips me when I try to move forward in my calling'",
              "Permission — be willing to receive, not just to be prayed over",
              "Faith the size of a mustard seed — that is genuinely all that is required",
            ]} />
          </Block>
          <Block title="When You Need an Intercessor Most">
            <List items={[
              "During deep shadow work, soul tie breaking, bloodline healing, or cord cutting",
              "In seasons of intense spiritual attack or heavy oppression",
              "When you feel spiritually dry, disconnected, or unable to pray for yourself",
              "At major life transitions and thresholds — new callings, releases, and beginnings",
              "When carrying grief, trauma, or loss that feels beyond your capacity",
            ]} />
          </Block>
        </div>
      );

    case "dream-interpretation-spiritual":
      return (
        <div className="space-y-4">
          <Block title="Preparing to Receive Spiritual Dreams">
            <p>Dreams are one of the primary channels through which Source communicates in scripture — referenced hundreds of times from Genesis to Revelation. If you want to receive more spiritual dreams, you must create conditions that welcome them: clear your field, quiet your mind, and go to sleep with intention.</p>
            <List items={[
              "Clear your body and space before sleep — salt bath, prayer, no heavy media or news in the hour before bed",
              "Ask specifically: 'Father, speak to me as I sleep. Give me dreams that carry your message and the wisdom to understand them.'",
              "Keep a journal and pen within reach — never your phone",
              "Expect — faith creates the conditions for spiritual experience",
            ]} />
          </Block>
          <Block title="Recording and Interpreting — A System">
            <div className="space-y-2">
              {[
                { step: 1, title: "Record immediately on waking", desc: "Before you speak to anyone or check your phone. Write the narrative, the feeling, the colors, any specific symbols, and who was present." },
                { step: 2, title: "Identify the dominant emotion", desc: "The feeling of the dream is often more important than the content. Fear, peace, urgency, joy — what was the primary emotional tone?" },
                { step: 3, title: "Ask: is this literal or symbolic?", desc: "Most spiritual dreams are symbolic. Death rarely means physical death — it usually signals transformation. Ask: what principle is this scenario representing?" },
                { step: 4, title: "Look for known symbols first", desc: "Water = the spirit or emotions. House = the self. Vehicles = the direction or trajectory of your life. Clothing = identity, spiritual state." },
                { step: 5, title: "Ask Source for the interpretation", desc: "Pray over the dream. Often the meaning arrives during or after prayer — not through intellectual analysis. 'The Spirit searches all things.' (1 Cor 2:10)" },
                { step: 6, title: "Test the interpretation", desc: "Does it align with scripture? Does it increase peace or clarity about your current season? Does it serve the purpose of edification, exhortation, or comfort?" },
              ].map((s) => <Step key={s.step} number={s.step} title={s.title} desc={s.desc} />)}
            </div>
          </Block>
          <Block title="Testing a Prophetic Dream">
            <List items={[
              "It must align with the character of Source — love, justice, mercy, truth",
              "It should not direct you to do something harmful, illegal, or that contradicts scripture",
              "Share it with a spiritually mature person — prophetic dreams benefit from community interpretation",
              "Wait for confirmation — do not act on a single dream without additional confirmation in prayer, scripture, or circumstance",
              "Some prophetic dreams are for prayer only, not for action — ask Source which it is",
            ]} />
          </Block>
        </div>
      );

    case "spiritual-warfare-protection":
      return (
        <div className="space-y-4">
          <Block title="Understanding the Battle">
            <p>Ephesians 6:12 is direct: 'Our struggle is not against flesh and blood, but against the rulers, against the authorities, against the powers of this dark world and against the spiritual forces of evil in the heavenly realms.'</p>
            <p>Spiritual warfare is not about living in fear or seeing a demon behind every difficulty. It is about understanding that there is an invisible dimension to every battle you face — and that you have been given specific weapons for it.</p>
          </Block>
          <Block title="The Full Armor of God — Ephesians 6:13-18">
            <div className="space-y-2">
              {[
                { piece: "Belt of Truth", function: "Truth is your foundation. Living in alignment with truth closes access points that deception exploits. Know who you are, know whose you are." },
                { piece: "Breastplate of Righteousness", function: "Not your own righteousness, but the righteousness of Source covering your heart. Guards emotions, intentions, and the seat of your will against accusation and corruption." },
                { piece: "Feet fitted with Readiness", function: "The gospel of peace as footwear — you carry peace into every room you enter. Your readiness to share and stand in that peace is itself a warfare weapon." },
                { piece: "Shield of Faith", function: "Used to extinguish every flaming arrow of the enemy — accusations, doubt, fear, despair. Faith is not passive — it is an active choice to hold up the shield even when arrows are flying." },
                { piece: "Helmet of Salvation", function: "Protects the mind. The assurance of your identity and standing in Source keeps the mind from being conquered by confusion, identity attack, and mental warfare." },
                { piece: "Sword of the Spirit — the Word", function: "The only offensive weapon in the armor. The spoken Word of Source cuts through every stronghold. This is why Jesus responded to every temptation with 'It is written.'" },
                { piece: "Prayer in the Spirit", function: "The armor is effective when wielded through sustained prayer — not just wearing it once but inhabiting it through ongoing communion with Source." },
              ].map((a) => (
                <div key={a.piece} className="border border-border/40 rounded-xl p-3">
                  <p className="font-semibold text-foreground text-sm">{a.piece}</p>
                  <p className="text-xs mt-1">{a.function}</p>
                </div>
              ))}
            </div>
          </Block>
          <Block title="Daily Warfare Practice">
            <List items={[
              "Begin each morning by consciously putting on each piece of the armor — name them aloud",
              "Plead the blood of Jesus over yourself, your family, and your home",
              "Close any open doors: confess, forgive, renounce any agreement with fear or darkness",
              "Pray in the Spirit — or if you do not pray in tongues, pray extended Spirit-led prayer from the heart",
              "Maintain spiritual hygiene — regular fasting, scripture immersion, and worship keep the armor maintained",
            ]} />
          </Block>
          <Block title="Warfare Do's and Do Nots">
            <List items={[
              "DO: engage from rest, not from fear — fear is the enemy's preferred entry point",
              "DO: stand in your identity, not in your effort — authority comes from who you are, not what you do",
              "DO NOT: engage with the enemy in lengthy dialogue — command, cover, and return to worship",
              "DO NOT: go beyond your spiritual authority or jurisdiction — know what you are assigned to",
              "DO NOT: fight alone — warfare prayer in community is exponentially more powerful",
            ]} />
          </Block>
        </div>
      );

    case "discernment":
      return (
        <div className="space-y-4">
          <Block title="The Gift That Protects All Other Gifts">
            <p>Discernment is the spiritual capacity to distinguish between what is from Source, what is from human flesh, and what is from an adversarial spirit. In a world where many things present as light, discernment is not a luxury — it is essential maintenance for every person in spiritual practice.</p>
            <p>1 John 4:1 gives a direct command: 'Do not believe every spirit, but test the spirits to see whether they are from God, because many false prophets have gone out into the world.'</p>
          </Block>
          <Block title="The Tests of Discernment">
            <div className="space-y-2">
              {[
                { test: "The Fruit Test", desc: "Matthew 7:16-20 — 'By their fruit you will recognize them.' What is the consistent fruit of this person, practice, or experience? Love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, self-control — or their opposites?" },
                { test: "The Peace Test", desc: "The peace of Source 'transcends all understanding' (Phil 4:7). When something is from Source, even if it is challenging or unfamiliar, there is a settled peace underneath the experience. The absence of peace is a signal worth heeding." },
                { test: "The Scripture Test", desc: "Does this align with the whole counsel of scripture — not just a single verse taken out of context? Does it align with the character of Source as revealed across the whole of the Word?" },
                { test: "The Identity Test", desc: "Does this experience, voice, or message affirm your identity as a beloved child of Source — or does it shame you, confuse your identity, or lead you into fear, pride, or dependency?" },
                { test: "The Direction Test", desc: "Where is this leading you? Toward greater love, humility, surrender, and clarity — or toward isolation, elitism, secrecy, or away from spiritual accountability?" },
                { test: "The Community Test", desc: "Mature community sees what the individual cannot. Submit significant spiritual experiences and direction to one or two spiritually mature people who know you and have nothing to gain from validating you." },
              ].map((t) => (
                <div key={t.test} className="border border-border/40 rounded-xl p-3">
                  <p className="font-semibold text-foreground text-sm">{t.test}</p>
                  <p className="text-xs mt-1">{t.desc}</p>
                </div>
              ))}
            </div>
          </Block>
          <Block title="Developing Discernment — a Practice">
            <List items={[
              "Fast regularly — fasting quiets the flesh and sharpens spiritual perception",
              "Study scripture — discernment requires a well-formed interior knowledge of the character of Source",
              "Practice in low-stakes situations — discern small things before trusting yourself with large ones",
              "Review your track record — where have you been deceived before? What did it feel like beforehand?",
              "Stay in accountable community — isolation is one of the primary conditions in which deception flourishes",
            ]} />
          </Block>
          <Block title="When Something Feels Wrong">
            <p>Trust the check. Not every feeling of unease is discernment, but consistent, unexplained reluctance in the presence of something that presents as spiritual is worth pausing over. Ask Source directly. Wait for clarity before proceeding. The right path is never so urgent that there is no time for discernment.</p>
          </Block>
        </div>
      );

    case "daily-healing-practice":
      return (
        <div className="space-y-4">
          <Block title="Consistency is the Practice">
            <p>A daily healing practice is not about achieving a perfect routine. It is about returning — every day, in whatever form is honest and available to you — to the intention of alignment with Source, your body, and your truest self. Even ten minutes of intention is more powerful than no minutes of perfection.</p>
          </Block>

          <Block title="Morning Grounding Ritual">
            <div className="space-y-2">
              {[
                { step: 1, title: "Before your phone — the first five minutes", desc: "Your nervous system and subconscious are most permeable immediately after waking. Do not fill them with news, messages, or social media first. Give that window to Source." },
                { step: 2, title: "Three breaths of intention", desc: "Take three slow, deep breaths. On each exhale, release the energy of sleep. On each inhale, consciously invite the presence of Source into your waking hours." },
                { step: 3, title: "Grounding declaration", desc: "Speak aloud: 'I am present. I am grounded. I am covered. Today I move from my truest self, rooted in Source.' Adjust the words to what resonates — but speak them." },
                { step: 4, title: "Morning prayer (2–5 minutes)", desc: "Use the Morning Grounding Prayer template or simply speak honestly. Cover yourself and your family. Ask for clarity and protection. Release the day into Source's hands." },
                { step: 5, title: "Physical grounding (optional but powerful)", desc: "Bare feet on earth, even for 2 minutes. Or a short walk. Or standing in morning sunlight. The body needs to land in the physical world before it can navigate the spiritual one." },
              ].map((s) => <Step key={s.step} number={s.step} title={s.title} desc={s.desc} />)}
            </div>
          </Block>

          <Block title="Breathwork Reminder — Daily Minimum">
            <p>You do not need a full breathwork session every day. But you do need intentional breath.</p>
            <List items={[
              "Box breathing (4-4-4-4) for 2 minutes before any stressful event",
              "4-7-8 breathing (4 in, 7 hold, 8 out) for 3 cycles when anxiety rises",
              "Slow nasal breathing — in for 5, out for 6 — during any idle moment: in line, at traffic lights, before meetings",
              "Full breathwork session (15–30 minutes) 2–3 times per week for deeper nervous system reset",
            ]} />
          </Block>

          <Block title="Hydration and Nourishment Prompts">
            <List items={[
              "Water first — 16–20 oz of water before any caffeine. Your body is approximately 10% more dehydrated after sleep.",
              "Bless your water — take 10 seconds to hold your glass and speak gratitude over it before drinking",
              "Electrolytes in the morning — a pinch of Himalayan salt and a squeeze of lemon in your first glass supports adrenal and nervous system function",
              "Eat within 90 minutes of waking — skipping breakfast chronically elevates cortisol",
              "One healing food today — add one item from the Sacred Nourishment list to your day intentionally",
              "Minimize the disruptors — ultra-processed foods, excessive caffeine, and alcohol directly impair nervous system regulation and spiritual sensitivity",
            ]} />
          </Block>

          <Block title="Energy Clearing Check-In (Midday or After Difficult Encounters)">
            <List items={[
              "Pause and scan: Where in my body do I feel heaviness, tension, or something that is not mine?",
              "Three conscious exhales — imagine releasing whatever was absorbed through the breath",
              "Hand brush-down — starting from the crown, use your hands to brush down your arms, torso, and legs as if brushing off dust",
              "Quick prayer: 'Source, I return to you anything I picked up that is not mine. Restore my field to clarity and peace.'",
              "If the heaviness persists — do a full clearing practice from the Energy Clearing section",
            ]} />
          </Block>

          <Block title="Evening Reflection Journal (10 Minutes Before Sleep)">
            <p>Write honestly — not for an audience but for your own soul.</p>
            <List items={[
              "What did I feel today that I haven't fully processed?",
              "Where did I see Source at work today — even subtly?",
              "What do I need to forgive — in myself or in someone else — before I sleep?",
              "What am I grateful for from today?",
              "What intention do I carry into tomorrow?",
            ]} />
          </Block>

          <Block title="Weekly Chakra Check (15 Minutes, Once Per Week)">
            <p>Choose one day — Sunday evening or Monday morning works well for most people. Sit quietly and bring each chakra to mind from root to crown. For each one, ask:</p>
            <List items={[
              "Root — Am I feeling safe, grounded, and provided for? Or anxious about survival?",
              "Sacral — Am I expressing creativity and emotion freely? Or feeling numb, blocked, or reactive?",
              "Solar Plexus — Am I operating from my own power? Or feeling powerless, overcontrolling, or depleted?",
              "Heart — Am I giving and receiving love openly? Or guarded, grieving, or closed?",
              "Throat — Am I speaking my truth? Or swallowing words, silencing myself, or speaking recklessly?",
              "Third Eye — Am I trusting my intuition? Or second-guessing, confused, or mentally overwhelmed?",
              "Crown — Am I connected to Source? Or feeling spiritually dry, disconnected, or alone?",
            ]} />
            <p>Note which centers feel depleted. Give them attention through the corresponding practices in the Breathe room, Wisdom room, or the chakra section of this app.</p>
          </Block>

          <Block title="Monthly Spiritual Review (30–60 Minutes, Once Per Month)">
            <p>Set aside uninterrupted time at the new or full moon, or on the first day of the month. Use these questions to review your spiritual season:</p>
            <List items={[
              "What was the dominant theme of this month — what kept appearing in my life, dreams, and conversations?",
              "Where did I grow? Where did I contract or retreat?",
              "What old pattern re-surfaced? Did I handle it differently than before?",
              "What am I being invited to release as this month closes?",
              "What do I want to carry forward — a practice, an insight, a commitment?",
              "What is my one spiritual intention for the month ahead?",
            ]} />
            <p>Close with prayer, journaling, and a brief ceremony of your choosing — a candle, a walk, a declaration, a song. Mark the threshold intentionally.</p>
          </Block>
        </div>
      );

    default:
      return null;
  }
}

export default function SpiritualToolsDetail() {
  const { section } = useParams<{ section: string }>();
  const navigate = useNavigate();
  const id = section as SectionKey;
  const title = sectionTitles[id];
  const isDeepWork = deepWorkSections.includes(id);
  const [selectedAngel, setSelectedAngel] = useState<ArchangelProfile | null>(null);

  if (!title) {
    navigate("/spiritual-tools", { replace: true });
    return null;
  }

  return (
    <>
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col min-h-0 bg-gradient-to-br from-violet-950 via-slate-950 to-indigo-950"
    >
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/spiritual-tools")} aria-label="Back">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="font-display text-xl font-bold text-foreground truncate">{title}</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-32">
        {/* Deep work intercessor banner */}
        {isDeepWork && (
          <div className="mb-6 bg-muted/70 border border-border/80 rounded-3xl p-4 space-y-3">
            <p className="text-sm leading-relaxed text-muted-foreground">
              This is deep inner work. If strong emotions, memories, or overwhelm surface, you do not have to carry it alone. An intercessor is available to pray with you right now.
            </p>
            <Button
              className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground"
              onClick={() => navigate("/community")}
            >
              <HeartHandshake className="h-4 w-4 mr-2" />
              Connect with an Intercessor
            </Button>
          </div>
        )}

        <SectionContent id={id} onOpenAngel={setSelectedAngel} />

        {/* Bottom intercessor CTA */}
        <div className="mt-8 bg-card/80 border border-border rounded-3xl p-5 space-y-3">
          <h2 className="font-display text-base font-bold text-foreground">Need Support?</h2>
          <p className="text-sm text-muted-foreground">
            If this section stirred something deep, an intercessor or healer is available to walk alongside you.
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
              className="w-full bg-gradient-to-r from-violet-700 to-indigo-700 text-white"
              onClick={() => navigate("/practitioner")}
            >
              Connect to a Healer
            </Button>
          </div>
        </div>
      </div>
    </motion.div>

    <AnimatePresence>
      {selectedAngel && (
        <AngelProfileModal
          angel={selectedAngel}
          onClose={() => setSelectedAngel(null)}
        />
      )}
    </AnimatePresence>
    </>
  );
}
