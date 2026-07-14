import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sun, Layers, Brain, Activity, Music2, Map, GitBranch, Wind,
  Volume2, Zap, Gift, MessageSquare, Hand, Leaf, Droplet,
  Diamond, Flower2, Moon, Star, Hexagon, Sparkles, Hash, BookOpen,
  Orbit, Image as ImageIcon,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LevelPath } from "@/components/levels/LevelPath";
import cosmicsSectionCover from "@/assets/cosmics/section-cover.jpg";
import imgBirthOfStars from "@/assets/cosmics/birth-of-stars.jpg";
import imgGalacticSpirals from "@/assets/cosmics/galactic-spirals.jpg";
import imgNebulaHearts from "@/assets/cosmics/nebula-hearts.jpg";
import imgPillarsOfCreation from "@/assets/cosmics/pillars-of-creation.jpg";
import imgSupernovaRebirth from "@/assets/cosmics/supernova-rebirth.jpg";
import imgBlackHoleMystery from "@/assets/cosmics/black-hole-mystery.jpg";
import imgAuroraFrequencies from "@/assets/cosmics/aurora-frequencies.jpg";
import imgSolarFlares from "@/assets/cosmics/solar-flares.jpg";

type CosmicCard = { id: string; title: string; description: string; image?: string };

const cosmicCards: CosmicCard[] = [
  { id: "birth-of-stars", title: "Birth of Stars", description: "Stellar nurseries where light is born from cosmic dust — a mirror of your own becoming.", image: imgBirthOfStars },
  { id: "galactic-spirals", title: "Galactic Spirals", description: "Sacred spiral geometry written across a hundred billion suns.", image: imgGalacticSpirals },
  { id: "nebula-hearts", title: "Nebula Hearts", description: "Luminous clouds of creation — the womb of the universe made visible.", image: imgNebulaHearts },
  { id: "pillars-of-creation", title: "Pillars of Creation", description: "Towering columns of gas and stardust — the temple of stellar genesis.", image: imgPillarsOfCreation },
  { id: "supernova-rebirth", title: "Supernova Rebirth", description: "Death that seeds new worlds. The cosmic law of transformation.", image: imgSupernovaRebirth },
  { id: "black-hole-mystery", title: "Black Hole Mystery", description: "Thresholds of the unknown where space, time, and self dissolve.", image: imgBlackHoleMystery },
  { id: "aurora-frequencies", title: "Aurora Frequencies", description: "The Earth singing in color as solar wind meets our atmosphere.", image: imgAuroraFrequencies },
  { id: "solar-flares", title: "Solar Flares", description: "The sun's living pulse — how solar activity shifts the human field.", image: imgSolarFlares },
  { id: "lunar-phases", title: "Lunar Phases", description: "New, waxing, full, and waning — the moon's rhythm inside your body." },
  { id: "planetary-alignments", title: "Planetary Alignments", description: "When the planets meet, the collective heart re-tunes." },
  { id: "cosmic-microwave", title: "Cosmic Microwave Background", description: "The oldest light in the universe — the whisper of the first moment." },
  { id: "quantum-field", title: "Quantum Field", description: "The invisible web of potential from which all matter emerges." },
  { id: "sacred-cosmology", title: "Sacred Cosmology", description: "How ancient traditions mapped the heavens onto the soul." },
  { id: "zodiac-constellations", title: "Zodiac Constellations", description: "The twelve celestial gates and the archetypes they carry." },
  { id: "starseed-origins", title: "Starseed Origins", description: "Souls remembering their home among the stars — Pleiades, Sirius, Arcturus, Andromeda." },
  { id: "milky-way-portal", title: "Milky Way Portal", description: "Our galactic home — a river of light we drift within." },
  { id: "planetary-guardians", title: "Planetary Guardians", description: "The energies of Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, and Pluto." },
  { id: "sacred-eclipses", title: "Sacred Eclipses", description: "Solar and lunar eclipses as thresholds of collective rebirth." },
  { id: "meteor-messages", title: "Meteor Messages", description: "Shooting stars, meteor showers, and the language of falling light." },
  { id: "sun-worship-history", title: "Sun Worship Through History", description: "How every culture has bowed to the same living source of light." },
  { id: "cosmic-consciousness", title: "Cosmic Consciousness", description: "The felt awareness that you are the universe experiencing itself." },
  { id: "galactic-center", title: "Galactic Center", description: "The heart of our galaxy in Sagittarius — the direction of returning home." },
  { id: "schumann-resonance", title: "Schumann Resonance", description: "The Earth's heartbeat frequency and how it tunes your own." },
];



const sections = [
  { id: "what-is-source", title: "What is Source", description: "The divine intelligence behind all creation — God, Universe, the All. Understanding your origin changes everything.", icon: Sun, colorClass: "text-amber-400" },
  { id: "chakra-system", title: "Chakra System", description: "All 12 energy centers plus the Earth Star — their locations, meanings, blockages, and how to restore flow.", icon: Layers, colorClass: "text-violet-400" },
  { id: "nervous-system", title: "Nervous System and Polyvagal Theory", description: "Why your body responds the way it does. The science of safety, trauma, and nervous system regulation.", icon: Brain, colorClass: "text-blue-400" },
  { id: "vagus-nerve", title: "Vagus Nerve Activation", description: "The master healing nerve. Learn what it is, how it regulates your entire body, and how to activate it.", icon: Activity, colorClass: "text-green-400" },
  { id: "tuning-fork-therapy", title: "Tuning Fork Therapy", description: "How precise frequencies restore harmony in the body and energy field. The science and spirit behind the sound.", icon: Music2, colorClass: "text-sky-400" },
  { id: "pain-body-map", title: "Emotional Pain Body Map", description: "Your body keeps score. A map of where grief, fear, anger, shame, and trauma live in physical tissue.", icon: Map, colorClass: "text-rose-400" },
  { id: "generational-illness", title: "Generational Illness and Clearing", description: "How ancestral trauma is encoded in DNA and passed through family lines — and how it can be released.", icon: GitBranch, colorClass: "text-orange-400" },
  { id: "how-breathwork-works", title: "How Breathwork Works", description: "The biochemistry and spirituality of breath. Why controlled breathing transforms your nervous system.", icon: Wind, colorClass: "text-cyan-400" },
  { id: "how-sound-healing-works", title: "How Sound Healing Works", description: "Resonance, entrainment, solfeggio frequencies, and cymatics — how sound restructures matter and mind.", icon: Volume2, colorClass: "text-purple-400" },
  { id: "how-energy-work-functions", title: "How Energy Work Functions", description: "The biofield, aura layers, and how practitioners move, clear, and restore life-force energy.", icon: Zap, colorClass: "text-indigo-400" },
  { id: "spiritual-gifts-explained", title: "Spiritual Gifts Explained", description: "The gifts of prophecy, healing, tongues, discernment, wisdom, and more — their true biblical roots.", icon: Gift, colorClass: "text-yellow-400" },
  { id: "power-of-words", title: "Power of Words", description: "Words carry vibration. Science and scripture both confirm that what you speak, you create.", icon: MessageSquare, colorClass: "text-pink-400" },
  { id: "reflexology-and-meridians", title: "Reflexology and Meridians", description: "The ancient Chinese meridian system, foot and hand reflexology, and the body's internal energy highways.", icon: Hand, colorClass: "text-teal-400" },
  { id: "sacred-nourishment", title: "Sacred Nourishment", description: "Food as frequency and medicine. The gut-brain connection, healing foods, and eating as a sacred act.", icon: Leaf, colorClass: "text-lime-400" },
  { id: "essential-oils", title: "Essential Oils Education", description: "How oils enter the body, their therapeutic properties, safe use, and which frequencies they carry.", icon: Droplet, colorClass: "text-emerald-400" },
  { id: "crystal-and-stone-properties", title: "Crystal and Stone Properties", description: "How crystals work energetically, common stones and their healing frequencies, and how to work with them.", icon: Diamond, colorClass: "text-fuchsia-400" },
  { id: "plant-medicine-and-herbs", title: "Plant Medicine and Herbs", description: "Adaptogens, nervines, and healing herbs across traditions. Tinctures, teas, and safe herbal practice.", icon: Flower2, colorClass: "text-green-300" },
  { id: "dream-interpretation", title: "Dream Interpretation", description: "Why we dream, what symbols mean, prophetic dreams, and how to journal and decode your nighttime messages.", icon: Moon, colorClass: "text-indigo-300" },
  { id: "astrology-basics", title: "Astrology Basics", description: "Sun, Moon, and Rising signs. The 12 houses, planetary influences, and your North Node soul purpose.", icon: Star, colorClass: "text-amber-300" },
  { id: "sacred-geometry", title: "Sacred Geometry", description: "The Flower of Life, Fibonacci sequence, golden ratio, and how divine patterns underlie all creation.", icon: Hexagon, colorClass: "text-violet-300" },
  { id: "your-spiritual-gifts", title: "Understanding Your Spiritual Gifts", description: "Empath, Prophet, Seer, Healer, Intercessor, Lightworker, Starseed, Medicine Person and more — honestly explained.", icon: Sparkles, colorClass: "text-sky-300" },
  { id: "numerology-and-angel-numbers", title: "Numerology and Angel Numbers", description: "Life Path numbers, soul urge, and the meaning behind 111, 222, 333, 444, 555, 777, 888, 999, and 1111.", icon: Hash, colorClass: "text-rose-300" },
  { id: "healing-scripture-by-emotion", title: "Healing Scripture by Emotion", description: "Scripture organized by what you are feeling right now — for fear, grief, anger, shame, loneliness, anxiety, and depression.", icon: BookOpen, colorClass: "text-amber-300" },
];

export default function WisdomRoom() {
  const navigate = useNavigate();

  return (
    <div
      className="flex-1 overflow-y-auto p-4 pb-32"
      style={{
        background:
          "radial-gradient(ellipse at 20% 20%, hsl(25,80%,5%) 0%, hsl(25,90%,14%) 45%, hsl(25,60%,26%) 100%)",
      }}
    >
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2 text-center">Wisdom</h1>
        <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
          Ancient to modern teachings on the why behind healing. Every section here is a doorway into a deeper
          understanding of yourself, your body, your energy, and your divine design.
        </p>
      </motion.div>

      <div className="max-w-6xl mx-auto mb-6">
        <LevelPath roomId="wisdom" />
      </div>

      {/* COSMICS — dedicated celestial pillar */}
      <section
        aria-labelledby="cosmics-heading"
        className="max-w-6xl mx-auto mb-12 rounded-2xl border border-violet-400/20 overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at 80% 0%, hsl(260 70% 18% / 0.9) 0%, hsl(240 60% 8% / 0.95) 55%, hsl(230 50% 4% / 1) 100%)",
          boxShadow: "inset 0 0 60px hsl(270 80% 30% / 0.25)",
        }}
      >
        {/* Section cover banner */}
        <div className="relative w-full aspect-[16/7] overflow-hidden border-b border-violet-400/10">
          <img
            src={cosmicsSectionCover}
            alt="Cosmics — ethereal galaxies, nebulae, and celestial light"
            loading="lazy"
            width={1280}
            height={800}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, hsl(240 60% 4% / 0.15) 0%, hsl(240 60% 4% / 0.55) 70%, hsl(240 60% 4% / 0.9) 100%)",
            }}
          />
          <span className="absolute top-3 right-3 text-[10px] uppercase tracking-widest text-violet-100/90 border border-violet-300/40 rounded-full px-2 py-1 bg-slate-950/40 backdrop-blur-sm">
            Pillar
          </span>
        </div>
        <div className="p-6 sm:p-8 border-b border-violet-400/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-11 w-11 rounded-full flex items-center justify-center bg-violet-500/15 text-violet-300 ring-1 ring-violet-400/30">
              <Orbit className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <h2 id="cosmics-heading" className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                Cosmics
              </h2>
              <p className="text-xs sm:text-sm text-violet-200/70">
                23 cosmic healing photography teachings — the sky as scripture
              </p>
            </div>
          </div>
          <p className="text-sm sm:text-base text-foreground/80 leading-relaxed max-w-3xl">
            The Cosmics pillar holds our specialized cosmic healing imagery — each card pairs a celestial photograph
            with a teaching on how that cosmic force lives inside you. Use these visuals for meditation, reflection,
            and remembering your infinite origin.
          </p>
        </div>

        <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cosmicCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.02 }}
            >
              <Card className="overflow-hidden bg-slate-950/60 border-violet-400/15 hover:border-violet-300/40 transition-colors backdrop-blur-sm">
                {/* Visual display slot — ready for cosmic photography */}
                <div
                  className="relative aspect-[16/10] w-full flex items-center justify-center border-b border-violet-400/10 overflow-hidden"
                  style={
                    card.image
                      ? undefined
                      : {
                          background:
                            "radial-gradient(ellipse at 30% 30%, hsl(270 80% 25% / 0.55) 0%, hsl(240 70% 10% / 0.9) 60%, hsl(230 60% 4%) 100%)",
                        }
                  }
                  aria-label={`${card.title} image`}
                >
                  {card.image ? (
                    <>
                      <img
                        src={card.image}
                        alt={card.title}
                        loading="lazy"
                        width={1024}
                        height={640}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background:
                            "linear-gradient(180deg, hsl(240 60% 4% / 0) 55%, hsl(240 60% 4% / 0.55) 100%)",
                        }}
                      />
                    </>
                  ) : (
                    <>
                      <ImageIcon className="h-7 w-7 text-violet-300/40" aria-hidden="true" />
                      <span className="absolute bottom-2 right-2 text-[10px] uppercase tracking-widest text-violet-200/40">
                        Image slot
                      </span>
                    </>
                  )}
                </div>
                <CardHeader className="p-4">
                  <CardTitle className="text-base font-bold text-foreground">{card.title}</CardTitle>
                  <CardDescription className="text-xs mt-1 leading-relaxed text-foreground/70">
                    {card.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Core teachings grid */}
      <div className="max-w-6xl mx-auto mb-4">
        <h2 className="font-display text-xl font-bold text-foreground/90 mb-1">Core Teachings</h2>
        <p className="text-xs text-muted-foreground mb-4">The foundational wisdom library.</p>
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((section, index) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.03 }}
            >
              <Card
                className="cursor-pointer hover:border-primary/40 transition-colors bg-card/80 backdrop-blur-sm"
                onClick={() => navigate(`/wisdom/${section.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && navigate(`/wisdom/${section.id}`)}
              >
                <CardHeader className="p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex-shrink-0 h-10 w-10 rounded-full bg-muted flex items-center justify-center ${section.colorClass}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-base font-bold">{section.title}</CardTitle>
                      <CardDescription className="text-xs mt-1 leading-relaxed">
                        {section.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

