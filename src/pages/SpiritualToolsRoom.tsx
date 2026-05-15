"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SpiritualToolsRoom() {
  const navigate = useNavigate();
  const [activeChakra, setActiveChakra] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const chakraParam = params.get("chakra");
      if (chakraParam && chakraParam !== "all") {
        setActiveChakra(chakraParam);
      }
    }
  }, []);

  const handleAngelsNavigation = () => {
    navigate("/angels");
  };

  return (
    <div className="p-6 bg-[#0b0b0f] text-white min-h-screen w-full rounded-xl border border-purple-900/20 max-w-4xl mx-auto overflow-y-auto pb-24">
      {/* HEADER */}
      <div className="mb-8 border-b border-purple-900/30 pb-4">
        <h2 className="text-3xl font-extrabold uppercase tracking-wider text-purple-400 flex items-center gap-2">
          💫 SPIRITUAL TOOLS CHAMBER
        </h2>
        <p className="text-gray-400 italic text-sm mt-1">
          Explore sacred tools for healing and guidance. Scriptural and spiritual tools for all beliefs, God-centered. 🤍
        </p>
      </div>

      {/* CHAKRA FOCUS HIGHLIGHT */}
      {activeChakra && (
        <div className="mb-6 p-4 rounded-xl bg-purple-950/30 border border-purple-500/30">
          <p className="text-xs uppercase font-bold tracking-widest text-purple-300 mb-1">Active Focus Center</p>
          <p className="text-sm font-bold text-white uppercase">🔷 {activeChakra.replace('_', ' ')} Alignment Activated</p>
          <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
            Utilize your customized lineage crystal, alignment grids, and calibrated audio tones to anchor the insights gained from the Wisdom room.
          </p>
        </div>
      )}

      {/* CORE UNDERSTANDING: SOURCE VS TOOLS */}
      <div className="space-y-6 bg-purple-950/10 p-6 rounded-xl border border-purple-900/30 mb-8">
        <h3 className="text-xl font-bold text-purple-300 border-b border-purple-900/20 pb-2">Understanding Source 🤍</h3>
        <p className="text-sm text-gray-300 leading-relaxed font-semibold">
          The most important truth in spiritual healing: God/Source/Universe is your power - not the tools. Tools help you CONNECT to Source, but they are not the source of your healing. You are.
        </p>
        
        <div>
          <h4 className="font-bold text-purple-400 text-sm uppercase tracking-wider mb-2">What is Source?</h4>
          <ul className="grid grid-cols-2 gap-2 text-sm text-gray-300">
            <li>• God (Christianity)</li>
            <li>• Universe (spiritual)</li>
            <li>• Divine Intelligence</li>
            <li>• Higher Power</li>
            <li>• Creator</li>
            <li>• The One</li>
          </ul>
          <p className="text-xs text-gray-400 mt-2 italic">Whatever name resonates with your faith - all names point to the same infinite love and power.</p>
        </div>

        <div className="space-y-3 pt-2">
          <h4 className="font-bold text-purple-400 text-sm uppercase tracking-wider">Tools vs Source</h4>
          <p className="text-sm text-gray-300">Crystals, tarot, astrology, numerology, angel numbers, animal symbolism - these are TOOLS. They help you:</p>
          <ul className="text-sm text-gray-300 space-y-1 list-disc pl-5">
            <li>Focus your intention</li>
            <li>Connect to Source</li>
            <li>Receive guidance</li>
            <li>Amplify your energy</li>
          </ul>
          <div className="bg-black/30 p-4 rounded-lg space-y-2 text-xs border border-purple-950 text-gray-400">
            <p>• <span className="text-white font-medium">The crystal isn't healing you</span> - GOD through you is healing you.</p>
            <p>• <span className="text-white font-medium">The horoscope isn't controlling your life</span> - it's showing you patterns to be aware of.</p>
            <p>• <span className="text-white font-medium">The angel numbers aren't magic</span> - they're Source getting your attention.</p>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <h4 className="font-bold text-red-400 text-sm uppercase tracking-wider">Don't get lost in the tools:</h4>
          <p>• If you worship the crystal instead of God, you're disconnected from Source</p>
          <p>• If you make decisions ONLY based on horoscopes, you've given your power away</p>
          <p>• If you think the tool has power without Source, you're lost</p>
        </div>

        <div className="space-y-2 text-sm bg-purple-900/10 p-4 rounded-lg border border-purple-500/10">
          <h4 className="font-bold text-teal-400 uppercase tracking-wider text-xs">Stay God-centered:</h4>
          <p>✓ Use the tools to deepen your connection to Source</p>
          <p>✓ Pray/meditate before using any tool</p>
          <p>✓ Ask God/Source to guide your use of the tool</p>
          <p>✓ Give credit to Source, not the tool</p>
          <p>✓ If a tool pulls you AWAY from God, drop it</p>
        </div>
        <p className="text-xs text-purple-300 italic text-center pt-2">"You are a divine being connected to infinite Source. The tools are training wheels. Eventually, you won't need them - you'll just BE connected to Source at all times. That's the goal." 🤍</p>
      </div>

      {/* CORE TOPIC DIRECTORY LINKS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="p-4 bg-purple-950/20 rounded-xl border border-purple-900/30">
          <h4 className="font-bold text-purple-300 mb-1">💫 Understanding the Spiritual Realm</h4>
          <p className="text-xs text-gray-400 mb-2">Learn about the veil, spiritual gifts, protection, and what to expect before deep healing work.</p>
          <span className="text-xs font-bold text-purple-400">Essential Reading →</span>
        </div>
        <div className="p-4 bg-purple-950/20 rounded-xl border border-purple-900/30">
          <h4 className="font-bold text-purple-300 mb-1">🕊️ Lightworker Persecution Imprint Clearing</h4>
          <p className="text-xs text-gray-400 mb-2">For healers, empaths, and intuitives carrying ancient persecution wounds that block visibility, success, and abundance.</p>
          <span className="text-xs font-bold text-purple-400">Clear Your Blocks →</span>
        </div>
        <div className="p-4 bg-purple-950/20 rounded-xl border border-purple-900/30">
          <h4 className="font-bold text-purple-300 mb-1">💙 Understanding the Empath</h4>
          <p className="text-xs text-gray-400 mb-2">If you feel everything and absorb everyone's emotions - learn to manage your gift and thrive instead of just surviving.</p>
          <span className="text-xs font-bold text-purple-400">Master Your Gift →</span>
        </div>
        <div className="p-4 bg-purple-950/20 rounded-xl border border-purple-900/30">
          <h4 className="font-bold text-purple-300 mb-1">🩸 Bloodline Healing 🧬</h4>
          <p className="text-xs text-gray-400 mb-2">Deeper than breaking generational curses — clearing spiritual attacks on your entire family's divine purpose and destiny.</p>
          <span className="text-xs font-bold text-purple-400">Heal Your Bloodline →</span>
        </div>
        <div className="p-4 bg-purple-950/20 rounded-xl border border-purple-900/30">
          <h4 className="font-bold text-purple-300 mb-1">⚔️ Archangel Michael - Warring Angels</h4>
          <p className="text-xs text-gray-400 mb-2">Michael's shield protects those in danger. Learn the sacred code and join his army of light.</p>
          <span className="text-xs font-bold text-purple-400">Enter Michael's Shield →</span>
        </div>
        <div className="p-4 bg-purple-950/20 rounded-xl border border-purple-900/30">
          <h4 className="font-bold text-purple-300 mb-1">🪶 Energy Clearing</h4>
          <p className="text-xs text-gray-400 mb-2">Remove energetic blocks, limiting beliefs, and inherited trauma patterns including poverty consciousness.</p>
          <span className="text-xs font-bold text-purple-400">Begin Clearing →</span>
        </div>
        <div className="p-4 bg-purple-950/20 rounded-xl border border-purple-900/30">
          <h4 className="font-bold text-purple-300 mb-1">🔮 Crystals & Stones</h4>
          <p className="text-xs text-gray-400 mb-2">Earth medicine for healing, protection, and manifestation - used with Source-centered intention.</p>
          <span className="text-xs font-bold text-purple-400">Learn Crystal Work →</span>
        </div>
        <div className="p-4 bg-purple-950/20 rounded-xl border border-purple-900/30">
          <h4 className="font-bold text-purple-300 mb-1">🌿 Essential Oils & Plant Medicine</h4>
          <p className="text-xs text-gray-400 mb-2">Sacred plant allies for protection, healing, and spiritual work - always Source-centered.</p>
          <span className="text-xs font-bold text-purple-400">Learn Plant Medicine →</span>
        </div>
      </div>

      {/* SOUL TIES */}
      <div className="bg-purple-950/10 p-6 rounded-xl border border-purple-900/30 mb-8 space-y-4">
        <h3 className="text-xl font-bold text-purple-300 border-b border-purple-900/20 pb-2">💫 Soul Ties</h3>
        <p className="text-sm text-gray-300">Deep emotional/spiritual connections between people. Can be healthy (love, family) or unhealthy (trauma bonding, codependency).</p>
        <div className="flex gap-4 text-xs font-bold text-purple-400">
          <span>Signs of Unhealthy Soul Ties ›</span>
          <span>Steps to Release ›</span>
          <span>📖 Scriptural Foundation ›</span>
        </div>
        <div className="mt-4 p-4 rounded-lg bg-black/40 border border-purple-900/40">
          <h4 className="font-bold text-purple-300 text-sm">Cord Cutting Ritual ✂️</h4>
          <p className="text-xs text-gray-400 mt-1 mb-2">Guided visualization to energetically disconnect from toxic relationships. Release what no longer serves you.</p>
          <span className="text-xs font-bold text-teal-400 cursor-pointer">Start Visualization →</span>
        </div>
      </div>

      {/* NUMEROLOGY & ANGEL NUMBERS */}
      <div className="bg-purple-950/10 p-6 rounded-xl border border-purple-900/30 mb-8">
        <h3 className="text-xl font-bold text-purple-300 border-b border-purple-900/20 pb-2 mb-4">🔮 Numerology & Angel Numbers</h3>
        <p className="text-xs text-gray-400 italic mb-4">When you see these numbers repeatedly (clocks, receipts, addresses), the universe is speaking.</p>
        
        <div className="space-y-3 max-h-72 overflow-y-auto pr-2 text-sm">
          <p><strong>111 Awakening:</strong> New beginnings, manifestation, alignment with purpose</p>
          <p><strong>222 Harmony:</strong> Trust the process, balance, partnership, everything working out</p>
          <p><strong>333 Protection:</strong> Divine protection, Trinity, ascended masters near, creativity</p>
          <p><strong>444 Foundation:</strong> Angels are with you, foundation, stability, divine support</p>
          <p><strong>555 Change:</strong> Major change coming, transformation, freedom, embrace shift</p>
          <p><strong>666 Rebalance:</strong> Rebalance (not evil), focus on spiritual not material</p>
          <p><strong>777 Confirmation:</strong> You're on the right path, spiritual awakening, divine luck</p>
          <p><strong>888 Abundance:</strong> Abundance coming, financial blessings, infinity, karma rewarding</p>
          <p><strong>999 Completion:</strong> Completion, ending cycles, release what's done, new chapter</p>
          <p><strong>000 Divine:</strong> God's presence, infinite possibilities, prayer answered</p>
          <p><strong>1111 Portal:</strong> Wake-up call, portal opening, manifest now, pay attention</p>
          <p><strong>1212 Growth:</strong> Stay positive, spiritual growth accelerating, trust journey</p>
          <p><strong>1234 Progress:</strong> Step-by-step progress, you're moving forward, stay course</p>
        </div>

        <div className="mt-4 pt-4 border-t border-purple-900/20 space-y-2 text-xs text-gray-400 italic">
          <p className="font-bold text-purple-400 not-italic uppercase tracking-widest text-[10px]">📖 Scriptural Foundation</p>
          <p>Psalm 139:16 "Your eyes saw my unformed body; all the days ordained for me were written in your book before one of them came to be."</p>
          <p>Jeremiah 29:11 "For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, plans to give you hope and a future."</p>
          <p>Proverbs 16:9 "In their hearts humans plan their course, but the Lord establishes their steps."</p>
        </div>
      </div>

      {/* NATURE SIGNS & SYNCHRONICITIES */}
      <div className="bg-purple-950/10 p-6 rounded-xl border border-purple-900/30 mb-8 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-purple-300 border-b border-purple-900/20 pb-2 mb-3">Nature Signs 🌿</h3>
          <p className="text-xs text-gray-400 italic mb-3">Nature speaks the language of the divine - learn to read its messages.</p>
          <div className="grid grid-cols-2 gap-3 text-sm text-gray-300">
            <p>🌈 <strong>Rainbow:</strong> Promise, hope after storm, covenant, blessing</p>
            <p>🪶 <strong>Feather:</strong> Angels near, lightness, divine message, protection</p>
            <p>🌙 <strong>Moon phases:</strong> Cycles, timing, divine feminine, trust flow</p>
            <p>⭐ <strong>Shooting star:</strong> Make a wish, miracle coming, rare blessing</p>
            <p>🌊 <strong>Ocean waves:</strong> Emotional cleansing, flow, surrender control</p>
            <p>🌪️ <strong>Wind:</strong> Change, Holy Spirit moving, breakthrough coming</p>
            <p>🔥 <strong>Fire:</strong> Purification, passion, transformation, burn old</p>
            <p>💧 <strong>Water:</strong> Cleansing, emotions, flow of life, healing</p>
            <p>🌱 <strong>Seedlings:</strong> New growth, patience, nurturing needed, trust timing</p>
            <p>🍃 <strong>Falling leaves:</strong> Release, letting go, seasons changing, natural cycle</p>
          </div>
        </div>

        <div className="border-t border-purple-900/20 pt-4">
          <h3 className="text-xl font-bold text-purple-300 mb-2">Synchronicities ⚡</h3>
          <p className="text-xs text-gray-400 italic mb-4">"Coincidences" are actually divine orchestrations - here's what they mean:</p>
          <div className="space-y-2 text-sm text-gray-300">
            <p>• <strong>Hearing same song repeatedly:</strong> Pay attention to the lyrics - message for you</p>
            <p>• <strong>Meeting someone twice "randomly":</strong> Divine connection, pay attention to this person</p>
            <p>• <strong>Finding money/coins:</strong> Abundance coming, you're provided for, trust</p>
            <p>• <strong>Technology glitches:</strong> Spiritual interference, protection, or urgent message</p>
            <p>• <strong>Dreams repeating:</strong> Unhealed issue surfacing or prophetic warning</p>
            <p>• <strong>Specific scents with no source:</strong> Loved one visiting, spiritual presence near</p>
            <p>• <strong>Clock numbers (11:11, 3:33):</strong> Divine timing, angels confirming message</p>
            <p>• <strong>Same name appearing everywhere:</strong> Person significant to your journey, pay attention</p>
            <p>• <strong>Book/article appears at perfect time:</strong> Answer to prayer, guidance for current situation</p>
            <p>• <strong>Unexpected phone call/message:</strong> Divine timing, synchronicity in communication</p>
          </div>
        </div>

        <div className="bg-purple-900/10 p-4 rounded-lg border border-purple-500/10 text-xs space-y-1.5">
          <p className="font-bold text-purple-300 uppercase tracking-wider text-[10px]">💫 How to Work With Signs</p>
          <p>• Pay attention without obsessing - notice but don't force meanings</p>
          <p>• Ask God/Universe for confirmation if you're unsure</p>
          <p>• Journal the signs and watch for patterns over time</p>
          <p>• Trust your intuition about what the sign means for you</p>
          <p>• Thank the divine for speaking to you and guiding your path</p>
        </div>
      </div>

      {/* ANIMAL MESSENGERS */}
      <div className="bg-purple-950/10 p-6 rounded-xl border border-purple-900/30 mb-8">
        <h3 className="text-xl font-bold text-purple-300 border-b border-purple-900/20 pb-2 mb-2">Animal Messengers & Symbolism 🦋</h3>
        <p className="text-xs text-gray-400 mb-4">When animals appear in your life or dreams, they carry divine messages.</p>
        
        <div className="bg-black/30 p-4 rounded-lg text-xs text-gray-400 space-y-1 mb-4 border border-purple-900/40">
          <p className="font-bold text-purple-300 not-italic uppercase tracking-wider text-[10px] mb-1">🌟 How to Interpret Animal Messages</p>
          <p>• Pay attention to HOW you encounter them (alive, dead, repeated sightings, dreams)</p>
          <p>• Notice your FEELING when you see them (fear, joy, peace, unease)</p>
          <p>• Look for PATTERNS (same animal 3+ times = pay attention)</p>
          <p>• Ask GOD/SOURCE for clarification through prayer or meditation</p>
          <p>• Trust YOUR intuition over generic meanings (your relationship matters)</p>
          <p className="text-purple-400 mt-2">☠️ <strong>Dead animal</strong> = That energy is dying/transforming in your life</p>
          <p className="text-purple-400">✨ <strong>Alive & healthy</strong> = That energy is activating/growing</p>
          <p className="text-purple-400">🔄 <strong>Appearing repeatedly</strong> = Urgent message, pay attention</p>
          <p className="text-purple-400">💤 <strong>In dreams</strong> = Subconscious/spiritual message</p>
        </div>

        <div className="space-y-4 text-sm max-h-72 overflow-y-auto pr-2">
          <div>
            <h4 className="font-bold text-purple-400 border-b border-purple-900/10 pb-1 mb-2 text-xs uppercase tracking-widest">🐦 Birds & Insects</h4>
            <div className="space-y-2 text-gray-300">
              <p>🛸 <strong>Hummingbird:</strong> Joy, lightness, living in present, impossibility made possible</p>
              <p>🐦 <strong>Blue Jay:</strong> Hope, communication, fearlessness, clarity, protection</p>
              <p>🦅 <strong>Eagle:</strong> Vision, spiritual connection, rising above, courage, freedom</p>
              <p>🦉 <strong>Owl:</strong> Wisdom, intuition, seeing hidden truths, night mysteries</p>
              <p>🟥 <strong>Cardinal:</strong> Loved ones visiting from heaven, vitality, importance</p>
              <p>🕊️ <strong>Dove:</strong> Peace, Holy Spirit, purity, divine messages</p>
              <p>🦅 <strong>Hawk:</strong> Messages incoming, pay attention, heightened awareness</p>
              <p>🦆 <strong>Duck:</strong> Emotional comfort, grace on surface while working beneath</p>
              <p>🦢 <strong>Swan:</strong> Grace, beauty, transformation, inner beauty emerging</p>
              <p>🦅 <strong>Vulture:</strong> Purification, death/rebirth, patience, resourcefulness</p>
              <p>🐦 <strong>Sparrow:</strong> Joy in simplicity, community, resourcefulness</p>
              <p>🐈 <strong>Crow/Raven:</strong> Magic, mystery, intelligence, transformation, death/rebirth</p>
              <p>🦆 <strong>Goose:</strong> Teamwork, loyalty, migration (time to move), protection</p>
              <p>🦩 <strong>Heron:</strong> Patience, stillness, self-reflection, independence</p>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-purple-400 border-b border-purple-900/10 pb-1 mb-2 text-xs uppercase tracking-widest">🦚 Exotic & Mammals</h4>
            <div className="space-y-2 text-gray-300">
              <p>🦜 <strong>Parrot:</strong> Communication, voice, finding your authentic voice</p>
              <p>🦚 <strong>Peacock:</strong> Pride (healthy), beauty, showing true colors, confidence</p>
              <p>🦃 <strong>Turkey:</strong> Abundance, harvest, gratitude, community</p>
              <p>🐧 <strong>Penguin:</strong> Community, adaptation, thriving in harsh conditions</p>
              <p>🦩 <strong>Flamingo:</strong> Balance, standing out, filtering negativity</p>
            </div>
          </div>
        </div>
      </div>

      {/* HEALING SCRIPTURE */}
      <div className="bg-purple-950/10 p-6 rounded-xl border border-purple-900/30 mb-8">
        <h3 className="text-xl font-bold text-purple-300 border-b border-purple-900/20 pb-2 mb-4">📖 Healing Scripture</h3>
        <p className="text-xs text-gray-400 italic mb-4">Verses organized by emotion and situation. Search by emotion (grief, anxiety, fear...)</p>
        <div className="space-y-3 text-sm text-gray-300">
          <p>🩹 <strong>Grief (Psalm 34:18):</strong> "The Lord is close to the brokenhearted and saves those who are crushed in spirit"</p>
          <p>🧠 <strong>Anxiety (Philippians 4:6-7):</strong> "Do not be anxious about anything, but in every situation, by prayer and petition, present your requests to God"</p>
          <p>🛡️ <strong>Fear (Proverbs 3:5-6):</strong> "Trust in the Lord with all your heart and lean not on your own understanding"</p>
          <p>🤝 <strong>Forgiveness (Ephesians 4:32):</strong> "Be kind and compassionate to one another, forgiving each other, just as in Christ God forgave you"</p>
          <p>🦁 <strong>Fear (Isaiah 41:10):</strong> "Do not fear, for I am with you; do not be dismayed, for I am your God"</p>
          <p>❤️‍🩹 <strong>Grief (Psalm 147:3):</strong> "He heals the brokenhearted and binds up their wounds"</p>
          <p>💤 <strong>Overwhelm (Matthew 11:28):</strong> "Come to me, all who are weary and burdened, and I will give you rest"</p>
          <p>⚓ <strong>Hope (Romans 8:28):</strong> "We know that in all things God works for the good of those who love him"</p>
        </div>
      </div>

      {/* GENERATIONAL BREAKING */}
      <div className="bg-purple-950/10 p-6 rounded-xl border border-purple-900/30 mb-8 space-y-4">
        <h3 className="text-xl font-bold text-purple-300 border-b border-purple-900/20 pb-2">🔥 Breaking Generational Patterns</h3>
        <p className="text-sm text-gray-300">Inherited trauma patterns, limiting beliefs, and family cycles can be recognized and released.</p>
        
        <div className="text-xs text-gray-400 grid grid-cols-2 gap-2 bg-black/20 p-3 rounded-lg">
          <p>• Addiction cycles</p>
          <p>• Financial scarcity mindset</p>
          <p>• Relationship dysfunction</p>
          <p>• Emotional suppression</p>
          <p>• Self-sabotage behaviors</p>
        </div>

        <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/20 text-center">
          <p className="text-xs font-bold text-purple-300 uppercase tracking-widest mb-2">Declaration to Break Cycles</p>
          <p className="text-sm italic text-white font-medium leading-relaxed">
            "I acknowledge the pain and patterns passed down through my lineage. I honor my ancestors and release what no longer serves. The cycle ends with me. I choose healing. I choose peace. I choose love. I am the cycle breaker. So it is."
          </p>
          <button className="mt-3 text-xs bg-purple-600 px-3 py-1 rounded-full text-white font-bold hover:bg-purple-500 transition">
            🔥 Listen to Declaration 1x
          </button>
        </div>

        <div className="space-y-1 text-xs text-gray-400">
          <p className="font-bold text-purple-300 uppercase tracking-wide">New Patterns Affirmations</p>
          <p>• "I create healthy relationships"</p>
          <p>• "Abundance flows to me easily"</p>
          <p>• "I express my emotions safely"</p>
          <p>• "I am worthy of success"</p>
          <p>• "My children inherit healing, not trauma"</p>
        </div>

        <div className="pt-2 border-t border-purple-900/20 space-y-1.5 text-[11px] text-gray-400 italic">
          <p className="font-bold text-purple-400 not-italic uppercase tracking-widest text-[9px]">📖 Scriptural Foundation</p>
          <p>Exodus 20:5-6 "I, the Lord your God, am a jealous God, punishing the children for the sin of the parents to the third and fourth generation... but showing love to a thousand generations of those who love me."</p>
          <p>Galatians 3:13 "Christ redeemed us from the curse of the law by becoming a curse for us."</p>
          <p>Psalm 112:2 "Their children will be mighty in the land; the generation of the upright will be blessed."</p>
        </div>
      </div>

      {/* PRAYER TEMPLATES */}
      <div className="bg-purple-950/10 p-6 rounded-xl border border-purple-900/30 mb-8 space-y-4">
        <h3 className="text-xl font-bold text-purple-300 border-b border-purple-900/20 pb-2">🙏 Prayer Templates</h3>
        <p className="text-xs text-gray-400 italic">Fill-in-the-blank prayers for specific situations:</p>
        <div className="grid grid-cols-2 gap-2 text-xs font-bold text-purple-400 text-center">
          <span className="p-2 bg-purple-950/40 rounded border border-purple-900/40">Protection Prayer</span>
          <span className="p-2 bg-purple-950/40 rounded border border-purple-900/40">Healing Prayer</span>
          <span className="p-2 bg-purple-950/40 rounded border border-purple-900/40">Guidance Prayer</span>
          <span className="p-2 bg-purple-950/40 rounded border border-purple-900/40">Release Prayer</span>
        </div>
        <div className="pt-2 border-t border-purple-900/20 space-y-1 text-[11px] text-gray-400 italic">
          <p className="font-bold text-purple-400 not-italic uppercase tracking-widest text-[9px]">📖 Scriptural Foundation for Prayer</p>
          <p>Philippians 4:6 "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God."</p>
          <p>Matthew 7:7 "Ask and it will be given to you; seek and you will find; knock and the door will be opened to you."</p>
          <p>James 5:16 "The prayer of a righteous person is powerful and effective."</p>
        </div>
      </div>

      {/* ACTION NAVIGATION BUTTON */}
      <div className="p-6 rounded-xl border border-purple-500/20 bg-purple-950/20 text-center shadow-lg mt-8">
        <p className="text-sm text-gray-300 mb-4 font-medium">
          Ready to re-enter the presence of the guardians and integrate this work into your journey?
        </p>
        <button
          onClick={handleAngelsNavigation}
          className="px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 cursor-pointer shadow-md inline-flex items-center gap-2 mx-auto"
        >
          <span>Return to Angels Portal Room</span>
          <span>➔</span>
        </button>
      </div>
    </div>
  );
}
