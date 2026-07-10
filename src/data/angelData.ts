export interface AngelPalette {
  atmosphere: string;
  rays: string;
  beam: string;
  wingTip: string;
  wingPrimary: string;
  wingDeep: string;
  wingVein: string;
  robeLight: string;
  robeMid: string;
  robeDark: string;
  armorLight: string;
  armorDark: string;
  accentLight: string;
  accentMid: string;
  accentDark: string;
  hoodLight: string;
  hoodDark: string;
  tipGlow: string;
  mist: string;
  eye: string;
  eyeHL: string;
  armorVein: string;
  shadow: string;
  nameColor: string;
  subtitleColor: string;
  name: string;
  subtitle: string;
}

import { type ChakraKey } from "@/data/chakraData";

export interface ArchangelProfile {
  name: string;
  meaning: string;
  assignment: string;
  energyColor: string;
  frequency: string;
  chakra: ChakraKey;
  healingGifts: string[];
  whenToCall: string[];
  palette: AngelPalette;
}

// ─── ROOT CHAKRA palette bases (#FF0000 / #B30000) ──────────────────────────
// Michael — warrior fire: pure red with gold divine cross
const michaelPalette: AngelPalette = {
  atmosphere: "#180000", rays: "#ffbbaa", beam: "#ffd8cc",
  wingTip: "#ffcc88", wingPrimary: "#ff3300", wingDeep: "#660000", wingVein: "#ff6644",
  robeLight: "#fff0ee", robeMid: "#ffaaaa", robeDark: "#180000",
  armorLight: "#ffddcc", armorDark: "#440000",
  accentLight: "#fff0b0", accentMid: "#ffcc44", accentDark: "#bb8800",
  hoodLight: "#ffcccc", hoodDark: "#180000",
  tipGlow: "#ffeeaa", mist: "#cc0000",
  eye: "#ff4400", eyeHL: "#fff8ee", armorVein: "#ffaa99", shadow: "#ff2200",
  nameColor: "#ff9988", subtitleColor: "#aa4433",
  name: "MICHAEL", subtitle: "Guardian · Protection · Courage",
};

// Ariel — earth fire: terracotta warmth, rose-gold accent
const arielPalette: AngelPalette = {
  atmosphere: "#160800", rays: "#ffccaa", beam: "#ffddcc",
  wingTip: "#ffd0b0", wingPrimary: "#ee4400", wingDeep: "#550a00", wingVein: "#ffaa77",
  robeLight: "#fff5f0", robeMid: "#ffbb99", robeDark: "#160800",
  armorLight: "#ffeedd", armorDark: "#3a1000",
  accentLight: "#ffeedd", accentMid: "#ee8844", accentDark: "#aa4422",
  hoodLight: "#ffd0b8", hoodDark: "#160800",
  tipGlow: "#ffddc0", mist: "#bb3300",
  eye: "#ee5500", eyeHL: "#fff5ee", armorVein: "#ffbb99", shadow: "#cc3300",
  nameColor: "#ffaa88", subtitleColor: "#994422",
  name: "ARIEL", subtitle: "Earth Healing · Nature · Elemental Grace",
};

// ─── THROAT CHAKRA palette bases (#3399FF / #0066CC) ────────────────────────
// Gabriel — celestial blue: gold warmth at tips, divine messenger gold cross
const gabrielPalette: AngelPalette = {
  atmosphere: "#000a18", rays: "#aaccff", beam: "#cce0ff",
  wingTip: "#ffe0a0", wingPrimary: "#3399ff", wingDeep: "#003388", wingVein: "#55aaff",
  robeLight: "#eef5ff", robeMid: "#99bbee", robeDark: "#000a18",
  armorLight: "#cce8ff", armorDark: "#0a2040",
  accentLight: "#fff0b0", accentMid: "#ffcc44", accentDark: "#bb8800",
  hoodLight: "#aaddff", hoodDark: "#00081a",
  tipGlow: "#ffe8aa", mist: "#0066cc",
  eye: "#3399ff", eyeHL: "#ffffff", armorVein: "#88bbee", shadow: "#0077cc",
  nameColor: "#88bbee", subtitleColor: "#4477aa",
  name: "GABRIEL", subtitle: "Divine Message · Revelation · New Beginnings",
};

// Raguel — justice blue: cooler aqua tone, aqua cross/halo
const raguelPalette: AngelPalette = {
  atmosphere: "#000c14", rays: "#aaeeff", beam: "#ccf4ff",
  wingTip: "#ddfff8", wingPrimary: "#0088cc", wingDeep: "#003355", wingVein: "#44ccee",
  robeLight: "#eefcff", robeMid: "#88ccdd", robeDark: "#000c14",
  armorLight: "#ccf0ff", armorDark: "#082030",
  accentLight: "#e8ffff", accentMid: "#44ccee", accentDark: "#007799",
  hoodLight: "#aaeeff", hoodDark: "#000c14",
  tipGlow: "#ccf8ff", mist: "#0088bb",
  eye: "#00bbdd", eyeHL: "#f0ffff", armorVein: "#88ddee", shadow: "#0088bb",
  nameColor: "#55ddee", subtitleColor: "#226688",
  name: "RAGUEL", subtitle: "Justice · Harmony · Right Relationship",
};

// ─── HEART CHAKRA palette bases (#00CC66 / #FFB7C5) ─────────────────────────
// Raphael — pure healing emerald, gold cross (divine physician)
const raphaelPalette: AngelPalette = {
  atmosphere: "#001208", rays: "#aaffcc", beam: "#ccffee",
  wingTip: "#ffddee", wingPrimary: "#00cc66", wingDeep: "#004422", wingVein: "#44ffaa",
  robeLight: "#eeffee", robeMid: "#88ddaa", robeDark: "#001408",
  armorLight: "#ccffee", armorDark: "#0a2820",
  accentLight: "#fff0b0", accentMid: "#ffcc44", accentDark: "#bb8800",
  hoodLight: "#ccffee", hoodDark: "#001508",
  tipGlow: "#ffbbcc", mist: "#00cc66",
  eye: "#00cc66", eyeHL: "#ffffff", armorVein: "#88ffcc", shadow: "#00aa44",
  nameColor: "#44ffaa", subtitleColor: "#228855",
  name: "RAPHAEL", subtitle: "Healing · Restoration · Divine Physician",
};

// Chamuel — heart pink-green: rose-tinted, soft pink accent
const chamuelPalette: AngelPalette = {
  atmosphere: "#080c08", rays: "#ccffdd", beam: "#ddfff0",
  wingTip: "#ffccdd", wingPrimary: "#44cc88", wingDeep: "#0a3320", wingVein: "#99ffcc",
  robeLight: "#f5fff8", robeMid: "#aaddbb", robeDark: "#080c08",
  armorLight: "#ddfff0", armorDark: "#0a2818",
  accentLight: "#fff0f5", accentMid: "#ffaacc", accentDark: "#cc4477",
  hoodLight: "#ccffdd", hoodDark: "#080c08",
  tipGlow: "#ffccee", mist: "#44cc88",
  eye: "#44ddaa", eyeHL: "#f0fff8", armorVein: "#aaffcc", shadow: "#33bb77",
  nameColor: "#88ddbb", subtitleColor: "#337755",
  name: "CHAMUEL", subtitle: "Love · Compassion · Restoring the Heart",
};

// ─── THIRD EYE CHAKRA palette bases (#4B0082 / #2E0059) ─────────────────────
// Uriel — electric indigo, gold cross (fire of God)
const urielPalette: AngelPalette = {
  atmosphere: "#080012", rays: "#cc99ff", beam: "#ddc0ff",
  wingTip: "#e8d8ff", wingPrimary: "#7744cc", wingDeep: "#2e0059", wingVein: "#9966dd",
  robeLight: "#f0e8ff", robeMid: "#aa88cc", robeDark: "#080012",
  armorLight: "#e0d8ff", armorDark: "#220044",
  accentLight: "#fff0b0", accentMid: "#ffcc44", accentDark: "#bb8800",
  hoodLight: "#d8c0ff", hoodDark: "#060010",
  tipGlow: "#e8d8ff", mist: "#4b0082",
  eye: "#8844ee", eyeHL: "#f0e8ff", armorVein: "#cc99ff", shadow: "#6600aa",
  nameColor: "#cc99ff", subtitleColor: "#7744aa",
  name: "URIEL", subtitle: "Wisdom · Divine Light · Sacred Truth",
};

// Haniel — moonlit indigo, silver-moonstone accent
const hanielPalette: AngelPalette = {
  atmosphere: "#060010", rays: "#bbaadd", beam: "#d8ccee",
  wingTip: "#f0eaff", wingPrimary: "#6655bb", wingDeep: "#220055", wingVein: "#aaaadd",
  robeLight: "#f5f0ff", robeMid: "#bbaadd", robeDark: "#060010",
  armorLight: "#eeeeff", armorDark: "#1a1a44",
  accentLight: "#f0eeff", accentMid: "#ccccee", accentDark: "#8888aa",
  hoodLight: "#e8e0ff", hoodDark: "#050010",
  tipGlow: "#f0eeff", mist: "#4455aa",
  eye: "#9988cc", eyeHL: "#f5f0ff", armorVein: "#ccbbee", shadow: "#555599",
  nameColor: "#bbaadd", subtitleColor: "#665588",
  name: "HANIEL", subtitle: "Grace · Intuition · Moon Wisdom",
};

// ─── CROWN CHAKRA palette bases (#9933FF / #FFFFFF) ──────────────────────────
// Jophiel — bright violet-white, white tips (beauty of God)
const jophielPalette: AngelPalette = {
  atmosphere: "#080012", rays: "#ddbbff", beam: "#f0e0ff",
  wingTip: "#ffffff", wingPrimary: "#9933ff", wingDeep: "#330066", wingVein: "#cc88ff",
  robeLight: "#f8f0ff", robeMid: "#cc99ff", robeDark: "#080012",
  armorLight: "#eeddff", armorDark: "#2a0055",
  accentLight: "#ffffff", accentMid: "#ddbbff", accentDark: "#9933ff",
  hoodLight: "#eeddff", hoodDark: "#06000e",
  tipGlow: "#ffffff", mist: "#9933ff",
  eye: "#cc66ff", eyeHL: "#ffffff", armorVein: "#ddbbff", shadow: "#9933ff",
  nameColor: "#ddbbff", subtitleColor: "#9955cc",
  name: "JOPHIEL", subtitle: "Beauty · Creativity · Sacred Perception",
};

// Zadkiel — deep violet-indigo, violet flame accent
const zadkielPalette: AngelPalette = {
  atmosphere: "#060010", rays: "#cc99ff", beam: "#eedbff",
  wingTip: "#f0e4ff", wingPrimary: "#7711cc", wingDeep: "#280055", wingVein: "#bb55ff",
  robeLight: "#f5eaff", robeMid: "#bb88dd", robeDark: "#060010",
  armorLight: "#eeddff", armorDark: "#220044",
  accentLight: "#f0ddff", accentMid: "#bb44ff", accentDark: "#770099",
  hoodLight: "#ddc8ff", hoodDark: "#050010",
  tipGlow: "#f0ddff", mist: "#8800cc",
  eye: "#cc44ff", eyeHL: "#f8f0ff", armorVein: "#ddbbff", shadow: "#8800cc",
  nameColor: "#cc88ff", subtitleColor: "#7722aa",
  name: "ZADKIEL", subtitle: "Forgiveness · Mercy · Violet Flame Transmutation",
};

// ─── SOUL STAR CHAKRA palette base (#FFD700 / #FFFFFF) ───────────────────────
// Raziel — pure divine gold and white (akashic records, divine mysteries)
const razielPalette: AngelPalette = {
  atmosphere: "#0c0900", rays: "#fff8aa", beam: "#fffff0",
  wingTip: "#ffffff", wingPrimary: "#ffd700", wingDeep: "#664400", wingVein: "#ffeeaa",
  robeLight: "#fffff8", robeMid: "#ffeeaa", robeDark: "#100c00",
  armorLight: "#fff8cc", armorDark: "#332200",
  accentLight: "#ffffff", accentMid: "#ffd700", accentDark: "#886600",
  hoodLight: "#fff8cc", hoodDark: "#0c0900",
  tipGlow: "#ffffff", mist: "#ffd700",
  eye: "#ffd700", eyeHL: "#ffffff", armorVein: "#ffeeaa", shadow: "#ccaa00",
  nameColor: "#ffeeaa", subtitleColor: "#aa8800",
  name: "RAZIEL", subtitle: "Divine Mystery · Hidden Wisdom · Akashic Light",
};

export const ARCHANGELS: ArchangelProfile[] = [
  {
    name: "Michael",
    meaning: "Who is like God",
    assignment: "Protection, spiritual warfare, justice, strength, and cutting of spiritual bonds. The commander of the angelic army. Call on Michael when you need protection, courage in battle, or help breaking spiritual chains.",
    energyColor: "Root Red / Gold",
    frequency: "741 Hz — Clearing & Protection",
    chakra: "root",
    healingGifts: [
      "Protection from spiritual attack and dark assignments",
      "Courage and strength in the face of fear",
      "Cutting toxic spiritual bonds and unhealthy soul ties",
      "Justice, truth, and divine vindication",
      "Clarity in spiritual warfare situations",
      "Nighttime protection and restful sleep covering",
    ],
    whenToCall: [
      "When you feel spiritually attacked or oppressed",
      "When fear is overwhelming and courage has left",
      "When ending toxic relationships or cutting harmful soul ties",
      "When facing false accusations or spiritual injustice",
      "When you need protection over your home or loved ones",
      "When going into spiritually dangerous territory",
    ],
    palette: michaelPalette,
  },
  {
    name: "Gabriel",
    meaning: "Strength of God",
    assignment: "Divine communication, revelation, announcements, and creative conception. Gabriel carries messages of destiny and new beginnings. Present at births, callings, and prophetic unfolding.",
    energyColor: "Celestial Blue / Gold",
    frequency: "417 Hz — Facilitating Change",
    chakra: "throat",
    healingGifts: [
      "Delivering divine messages with crystal clarity",
      "Unlocking prophetic gifts and spiritual hearing",
      "Announcing new callings, seasons, and assignments",
      "Creative inspiration and conception of new works",
      "Overcoming writer's block and creative silence",
      "Communication healing — finding words for the unspeakable",
    ],
    whenToCall: [
      "When waiting on a word from Source about your purpose",
      "When creative gifts feel blocked or dormant",
      "When you need clarity on a new season or calling",
      "During pregnancy, new projects, or major life beginnings",
      "When developing prophetic or communicative spiritual gifts",
      "When you need to deliver a difficult but necessary message",
    ],
    palette: gabrielPalette,
  },
  {
    name: "Raphael",
    meaning: "God heals",
    assignment: "Physical, emotional, and spiritual healing. The physician of heaven. Raphael is present in hospital rooms, at the bedsides of the sick, and wherever healing is being sought.",
    energyColor: "Emerald Green / Gold",
    frequency: "528 Hz — Miracle Tone / DNA Repair",
    chakra: "heart",
    healingGifts: [
      "Physical healing of illness, injury, and chronic conditions",
      "Emotional and trauma restoration",
      "Healing of the nervous system and energy field",
      "Guiding doctors, healers, and caregivers",
      "Travel safety and protection on journeys",
      "Restoration of the life force and vitality",
    ],
    whenToCall: [
      "When you or a loved one is seriously ill or injured",
      "When healing work is being done on self or others",
      "When trauma needs deep restoration",
      "When the body is depleted and energy has no source",
      "Before surgery, procedures, or medical treatments",
      "When traveling or protecting travelers",
    ],
    palette: raphaelPalette,
  },
  {
    name: "Uriel",
    meaning: "Fire of God / Light of God",
    assignment: "Wisdom, illumination, intellectual clarity, and aligning with divine truth. Uriel brings light into confusion and helps interpret prophetic revelation.",
    energyColor: "Deep Indigo / Gold",
    frequency: "396 Hz — Liberation from Fear",
    chakra: "thirdEye",
    healingGifts: [
      "Illuminating dark or confusing situations with divine clarity",
      "Interpreting prophetic dreams and spiritual visions",
      "Releasing fear-based thinking and false beliefs",
      "Grounding divine wisdom into practical understanding",
      "Aligning the mind with eternal truth",
      "Revealing what has been hidden or misunderstood",
    ],
    whenToCall: [
      "When overwhelmed by confusion or conflicting information",
      "When needing to interpret a dream or spiritual vision",
      "When studying, researching, or seeking wisdom",
      "When fear-based thinking has clouded your mind",
      "When you need truth revealed in a complex situation",
      "When academic or creative work feels spiritually blocked",
    ],
    palette: urielPalette,
  },
  {
    name: "Ariel",
    meaning: "Lioness of God",
    assignment: "Nature, animals, the earth, and elemental healing. Ariel oversees the natural world and can be invited into work involving earth healing, animal communication, and grounding.",
    energyColor: "Earth Red / Terracotta",
    frequency: "432 Hz — Earth Harmony",
    chakra: "root",
    healingGifts: [
      "Healing the connection to the earth and natural world",
      "Animal healing and communication",
      "Elemental and environmental clearing",
      "Grounding scattered or overwhelmed energy",
      "Reconnecting to the body and physical presence",
      "Restoration of awe and wonder for creation",
    ],
    whenToCall: [
      "When disconnected from nature and the physical world",
      "When animals in your care are sick or distressed",
      "When doing earth-based or elemental healing work",
      "When needing to ground after spiritual or emotional intensity",
      "When environmental concerns feel heavy",
      "When the body's connection to the earth needs restoration",
    ],
    palette: arielPalette,
  },
  {
    name: "Chamuel",
    meaning: "He who seeks God",
    assignment: "Love, compassion, peace, and finding what is lost — including lost relationships, lost purpose, and lost peace. Chamuel works to restore the heart.",
    energyColor: "Heart Green / Rose",
    frequency: "639 Hz — Heart Reconnection",
    chakra: "heart",
    healingGifts: [
      "Healing fractured relationships and restoring love",
      "Finding what is lost — people, purpose, and peace",
      "Releasing bitterness and opening the heart",
      "Building compassion for self and others",
      "Healing the wound of rejection and abandonment",
      "Restoring inner peace after relational pain",
    ],
    whenToCall: [
      "When relationships are broken or seem beyond repair",
      "When you have lost someone or something deeply important",
      "When the heart is closed and love feels impossible",
      "When self-compassion and self-worth need rebuilding",
      "When forgiveness is needed but feels out of reach",
      "When you are searching for your purpose or sense of belonging",
    ],
    palette: chamuelPalette,
  },
  {
    name: "Haniel",
    meaning: "Grace of God",
    assignment: "Grace, intuition, the moon cycle, feminine energy, and spiritual vision. Haniel helps develop and refine clairvoyance and intuitive gifts.",
    energyColor: "Moonlit Indigo / Silver",
    frequency: "852 Hz — Spiritual Intuition",
    chakra: "thirdEye",
    healingGifts: [
      "Developing and refining intuitive and clairvoyant gifts",
      "Aligning with the moon cycles for healing and release",
      "Healing the feminine essence and cyclical nature",
      "Receiving grace in moments of shame or failure",
      "Opening spiritual vision and inner sight",
      "Navigating transitions with elegance and trust",
    ],
    whenToCall: [
      "When intuition feels blocked or untrustworthy",
      "During full or new moon times of release or intention",
      "When developing spiritual gifts and sensitivity",
      "When shame or failure has closed the heart",
      "When in a major life transition that requires trust",
      "When feminine healing work — cycles, hormones, womb — is needed",
    ],
    palette: hanielPalette,
  },
  {
    name: "Jophiel",
    meaning: "Beauty of God",
    assignment: "Beauty, creativity, wisdom, and slowing down long enough to perceive the sacred. Jophiel combats mental clutter and helps artists, teachers, and creators align with divine beauty.",
    energyColor: "Crown Violet / White",
    frequency: "285 Hz — Energy Field Restoration",
    chakra: "crown",
    healingGifts: [
      "Clearing mental clutter and negative thought patterns",
      "Awakening creativity and artistic expression",
      "Perceiving beauty and the sacred in the ordinary",
      "Restoring joy and a sense of wonder",
      "Wisdom that comes through beauty and contemplation",
      "Slowing down — breaking hurry and anxiety cycles",
    ],
    whenToCall: [
      "When mental noise, anxiety, or clutter is overwhelming",
      "When creative work feels dead or uninspired",
      "When beauty has left your life and everything feels grey",
      "When you need wisdom that comes from stillness, not striving",
      "When an artist, teacher, or creator needs divine alignment",
      "When joy needs to be restored after a long season of grief or work",
    ],
    palette: jophielPalette,
  },
  {
    name: "Raguel",
    meaning: "Friend of God",
    assignment: "Justice, harmony, order, and right relationships. Raguel resolves disputes, restores fairness, and brings clarity where there has been injustice or relational chaos.",
    energyColor: "Justice Blue / Aqua",
    frequency: "174 Hz — Foundation & Justice",
    chakra: "throat",
    healingGifts: [
      "Restoring divine justice in broken situations",
      "Bringing order to chaotic relationships and systems",
      "Mediating conflict and revealing the fair path forward",
      "Healing the wounds left by injustice and betrayal",
      "Establishing harmony in community and family systems",
      "Clarity on boundaries and right relational structures",
    ],
    whenToCall: [
      "When injustice has occurred and fairness seems impossible",
      "When relationships are chaotic, enmeshed, or toxic",
      "When a conflict needs divine mediation",
      "When organizational or community harmony has broken down",
      "When you are waiting for justice and growing weary",
      "When boundaries need to be established in love",
    ],
    palette: raguelPalette,
  },
  {
    name: "Raziel",
    meaning: "Secrets of God",
    assignment: "Divine mysteries, esoteric wisdom, the akashic records, and understanding the hidden dimensions of reality. Raziel helps those being initiated into deeper spiritual understanding.",
    energyColor: "Divine Gold / White",
    frequency: "963 Hz — Divine Connection",
    chakra: "soulStar",
    healingGifts: [
      "Unlocking hidden divine mysteries and sacred knowledge",
      "Accessing the akashic records and soul history",
      "Initiating into deeper layers of spiritual understanding",
      "Quantum and multidimensional healing work",
      "Releasing past life wounds and karmic patterns",
      "Revealing the divine architecture behind your story",
    ],
    whenToCall: [
      "When seeking deep understanding of spiritual mysteries",
      "When being initiated into a new level of awareness",
      "When hidden knowledge needs to be revealed",
      "When patterns repeat that have no clear earthly origin",
      "When doing akashic or past-life healing work",
      "When the deeper meaning of your suffering needs to surface",
    ],
    palette: razielPalette,
  },
  {
    name: "Zadkiel",
    meaning: "Righteousness of God",
    assignment: "Forgiveness, mercy, freedom from guilt, and transformation. Zadkiel oversees the violet flame of transmutation — the divine fire that transforms darkness into light.",
    energyColor: "Violet Flame / Indigo",
    frequency: "741 Hz — Transmutation",
    chakra: "crown",
    healingGifts: [
      "Deep forgiveness — of others and of self",
      "Freedom from guilt, shame, and condemnation",
      "Transmuting darkness and pain into light and wisdom",
      "Mercy for the parts of yourself you have rejected",
      "Releasing unforgiveness that has become a spiritual prison",
      "Violet flame activation — spiritual purification and renewal",
    ],
    whenToCall: [
      "When unforgiveness is eating at you and will not release",
      "When shame and guilt have become chronic companions",
      "When you want to transform a painful experience into wisdom",
      "When you need mercy — for yourself or someone who hurt you",
      "When a spiritual purification or renewal is needed",
      "When darkness feels too heavy to transmute alone",
    ],
    palette: zadkielPalette,
  },
  {
    name: "Azrael",
    meaning: "Whom God helps",
    assignment: "Comfort in grief, peaceful transitions, and supporting souls through loss. Azrael ministers to the bereaved and to those crossing thresholds of major endings.",
    energyColor: "Pale Cream / Soft Yellow",
    frequency: "417 Hz — Comfort & Release",
    chakra: "heart",
    healingGifts: [
      "Comfort during grief and loss",
      "Peaceful transitions for souls and seasons",
      "Healing the wound of bereavement",
      "Supporting hospice workers, grief counselors, and the dying",
      "Releasing what has ended with grace",
      "Gentle holding of unbearable sorrow",
    ],
    whenToCall: [
      "When grief is fresh and overwhelming",
      "When a loved one is dying or has just crossed over",
      "When supporting someone else through bereavement",
      "When a major chapter of life is ending",
      "When fear of death or endings has gripped you",
      "When you need a gentle, holding presence in sorrow",
    ],
    palette: {
      atmosphere: "#0c0a04", rays: "#fff5cc", beam: "#fff8dd",
      wingTip: "#fff8e0", wingPrimary: "#f5e8b8", wingDeep: "#332a10", wingVein: "#f0e0a8",
      robeLight: "#fffaee", robeMid: "#e8dcb0", robeDark: "#100c04",
      armorLight: "#fff5dd", armorDark: "#2a2410",
      accentLight: "#fff8dd", accentMid: "#e8d488", accentDark: "#998844",
      hoodLight: "#fff5d8", hoodDark: "#0c0a04",
      tipGlow: "#fff8dd", mist: "#cca866",
      eye: "#e8c878", eyeHL: "#fffaee", armorVein: "#f0e0a8", shadow: "#cca866",
      nameColor: "#f0d8a0", subtitleColor: "#998844",
      name: "AZRAEL", subtitle: "Comfort · Grief · Gentle Crossing",
    },
  },
  {
    name: "Sandalphon",
    meaning: "Brother (companion)",
    assignment: "Carrying prayers to Source, sacred music, and earthly grounding of heavenly frequencies. Sandalphon stands at the threshold between the throne and the earth.",
    energyColor: "Turquoise / Soft Earth",
    frequency: "528 Hz — Prayer & Resonance",
    chakra: "root",
    healingGifts: [
      "Carrying prayers and intentions to Source",
      "Healing through sacred music and sound",
      "Grounding heavenly frequencies into the body and earth",
      "Supporting musicians, sound healers, and worshippers",
      "Restoring connection between heaven and earth",
      "Strengthening prayer life and contemplative practice",
    ],
    whenToCall: [
      "When prayers feel unheard or stuck",
      "When sound, music, or worship is your healing path",
      "When you need to ground spiritual experiences into the body",
      "When supporting musicians or those leading worship",
      "When the link between heaven and earth feels distant",
      "When developing a contemplative or prayer-centered practice",
    ],
    palette: {
      atmosphere: "#031010", rays: "#aaeedd", beam: "#cdf6ee",
      wingTip: "#ddfff5", wingPrimary: "#66ddcc", wingDeep: "#0a3330", wingVein: "#88e8d5",
      robeLight: "#eefffa", robeMid: "#88ccc0", robeDark: "#04140e",
      armorLight: "#ccfff0", armorDark: "#0a2820",
      accentLight: "#e0fff5", accentMid: "#66ccaa", accentDark: "#226655",
      hoodLight: "#c8f0e6", hoodDark: "#03100c",
      tipGlow: "#ddfff5", mist: "#33aa88",
      eye: "#33ccaa", eyeHL: "#f0fff8", armorVein: "#88ddcc", shadow: "#339988",
      nameColor: "#88e8cc", subtitleColor: "#338866",
      name: "SANDALPHON", subtitle: "Prayer · Sacred Music · Earth Grounding",
    },
  },
  {
    name: "Metatron",
    meaning: "Voice of God",
    assignment: "Sacred geometry, ascension records, and oversight of children's spiritual development. Metatron's cube anchors divine order across creation.",
    energyColor: "Violet / Gold",
    frequency: "963 Hz — Ascension & Sacred Geometry",
    chakra: "soulStar",
    healingGifts: [
      "Activating sacred geometry and Metatron's cube for healing",
      "Clearing dense energy through divine fire",
      "Overseeing the spiritual development of children and gifted ones",
      "Ascension support and lightbody activation",
      "Aligning life with divine order and sacred pattern",
      "Bridging the seen and unseen with mathematical precision",
    ],
    whenToCall: [
      "When stepping into a higher level of spiritual responsibility",
      "When working with sensitive, gifted, or indigo children",
      "When dense energy needs swift transmutation",
      "When studying sacred geometry, numerology, or mystical sciences",
      "When ascension symptoms feel disorienting",
      "When you need to align your life with divine pattern",
    ],
    palette: {
      atmosphere: "#0a0420", rays: "#e0c8ff", beam: "#f0e0ff",
      wingTip: "#fff0d0", wingPrimary: "#cc88ff", wingDeep: "#330055", wingVein: "#ffcc66",
      robeLight: "#f5eaff", robeMid: "#bb88ee", robeDark: "#0a0420",
      armorLight: "#f0e0ff", armorDark: "#2a0844",
      accentLight: "#fff0c8", accentMid: "#ffcc44", accentDark: "#aa7700",
      hoodLight: "#e0ccff", hoodDark: "#0a041a",
      tipGlow: "#ffe8aa", mist: "#7733cc",
      eye: "#cc66ff", eyeHL: "#fff8ff", armorVein: "#e8ccff", shadow: "#7733cc",
      nameColor: "#d8aaff", subtitleColor: "#7744aa",
      name: "METATRON", subtitle: "Sacred Geometry · Ascension · Divine Order",
    },
  },
  {
    name: "Jeremiel",
    meaning: "Mercy of God",
    assignment: "Life review, prophetic dreams, and reflection on the soul's path. Jeremiel helps make sense of where you have been and what it has meant.",
    energyColor: "Deep Purple / Indigo",
    frequency: "852 Hz — Insight & Soul Review",
    chakra: "thirdEye",
    healingGifts: [
      "Reviewing your life with mercy rather than judgment",
      "Interpreting prophetic and instructive dreams",
      "Discerning the meaning of past seasons and choices",
      "Realigning the soul's trajectory after detour",
      "Releasing regret through compassionate understanding",
      "Receiving inner vision and prophetic insight",
    ],
    whenToCall: [
      "When you need to make sense of your story so far",
      "When prophetic or instructive dreams need interpretation",
      "When regret about the past needs to be transmuted",
      "When you feel lost about your soul's direction",
      "When integrating a season that has just ended",
      "When mercy — for yourself — is the only way forward",
    ],
    palette: {
      atmosphere: "#06001a", rays: "#aa88dd", beam: "#cca8ee",
      wingTip: "#e0c8ff", wingPrimary: "#8855dd", wingDeep: "#1a0033", wingVein: "#aa77ee",
      robeLight: "#e8d8ff", robeMid: "#8866cc", robeDark: "#08001a",
      armorLight: "#d8c0ff", armorDark: "#1a0833",
      accentLight: "#e8d8ff", accentMid: "#9966dd", accentDark: "#552288",
      hoodLight: "#c8a8ee", hoodDark: "#06001a",
      tipGlow: "#d0b0ff", mist: "#552299",
      eye: "#9955ee", eyeHL: "#f0e8ff", armorVein: "#bb88ee", shadow: "#552299",
      nameColor: "#aa88ee", subtitleColor: "#553388",
      name: "JEREMIEL", subtitle: "Life Review · Prophetic Dreams · Soul Insight",
    },
  },
];

export interface AngelSpiritualTools {
  crystal: string;
  association: string;
  halo: string;
}

export interface AngelDetails {
  ancestralConnections: string[];
  spiritualTools: AngelSpiritualTools;
}

export const ANGEL_DETAILS: Record<string, AngelDetails> = {
  Michael: {
    ancestralConnections: [
      "Lineage Protector: Guarded the ancient patriarchs across generations.",
      "Defender of the Bloodline: Shields family lines from inherited or generational fear.",
    ],
    spiritualTools: { crystal: "Sugilite", association: "Sephirah Chesed (Mercy/Loving-kindness)", halo: "Cobalt Blue" },
  },
  Uriel: {
    ancestralConnections: [
      "Illuminator of Ancestral Wisdom: Brought divine law and prophetic light to Noah and Enoch.",
      "Mindset Shifter: Clears confusion and intellectual blocks deeply rooted in family history.",
    ],
    spiritualTools: { crystal: "Amber", association: "Sephirah Malkuth (The Kingdom/Earth)", halo: "Ruby and Gold" },
  },
  Azrael: {
    ancestralConnections: [
      "Guide of Transitioned Ancestors: Ushers souls safely out of the earthly plane back to Source.",
      "Grief Comforter: Heals the lingering weight of unspoken or unresolved grief in your lineage.",
    ],
    spiritualTools: { crystal: "Yellow Calcite", association: "The Void / Transition Realm", halo: "Cream and Vanilla" },
  },
  Gabriel: {
    ancestralConnections: [
      "Lineage Messenger: Announced sacred births and divine callings to the ancestors.",
      "Keeper of the Divine Word: Preserves the original spiritual decrees of your bloodline.",
    ],
    spiritualTools: { crystal: "Clear Quartz", association: "Sephirah Yesod (The Foundation)", halo: "Copper and Pure White" },
  },
  Haniel: {
    ancestralConnections: [
      "Guardian of Intuitive Lineages: Aligned ancestral matriarchs with cosmic timing and natural rhythms.",
      "Awakener of Grace: Restores ancient spiritual gifts that were hidden or suppressed by ancestors.",
    ],
    spiritualTools: { crystal: "Moonstone", association: "Sephirah Netzach (Victory/Endurance)", halo: "Bluish-White" },
  },
  Jophiel: {
    ancestralConnections: [
      "Beautifier of the Soul's History: Clears ancestral mental clutter, heavy thoughts, and negativity.",
      "Restorer of Divine Perspective: Helps you see the beauty and lessons embedded in your family tree.",
    ],
    spiritualTools: { crystal: "Rubellite", association: "Sephirah Chokhmah (Wisdom)", halo: "Deep Pink" },
  },
  Ariel: {
    ancestralConnections: [
      "Steward of Earthly Lineages: Supported ancestral survival through nature, harvest, and resources.",
      "Provider of Elements: Aligns your present life with the elemental grace your ancestors relied on.",
    ],
    spiritualTools: { crystal: "Rose Quartz", association: "Nature and Elemental Realms", halo: "Pale Pink" },
  },
  Raphael: {
    ancestralConnections: [
      "Lineage Healer: Restores the health, vitality, and energetic blueprints of family lines.",
      "Guardian of Generational Vitality: Mends historical vulnerabilities passed down the tree.",
    ],
    spiritualTools: { crystal: "Emerald", association: "Sephirah Tiphereth (Beauty/Harmony)", halo: "Emerald Green" },
  },
  Chamuel: {
    ancestralConnections: [
      "Restorer of Family Bonds: Heals historical rifts, estrangements, and heartbreaks between ancestors.",
      "Heart Awakener: Reopens the capacity for love that may have been shut down in your lineage.",
    ],
    spiritualTools: { crystal: "Fluorite", association: "Sephirah Gevurah (Strength/Severity)", halo: "Pale Green" },
  },
  Zadkiel: {
    ancestralConnections: [
      "Transmuter of Generational Guilt: Releases ancestral shame and blame using the violet flame.",
      "Lineage Liberator: Dissolves unforgiveness that has bound family members together for decades.",
    ],
    spiritualTools: { crystal: "Amethyst", association: "Sephirah Chesed (Mercy/Loving-kindness)", halo: "Deep Violet" },
  },
  Raziel: {
    ancestralConnections: [
      "Primordial Ancestor: Passed to Adam to find his way back to divine grace.",
      "Lineage of Wisdom: Guided Enoch, Noah, and King Solomon through generations.",
      "Bloodline Healing: Clears family karma, past-life traumas, and inherited soul vows.",
    ],
    spiritualTools: { crystal: "Clear Quartz", association: "Sephirah Chokhmah (Wisdom)", halo: "Rainbow-hued spectrum of divine light" },
  },
  Metatron: {
    ancestralConnections: [
      "Scribe of the Lineage: Anchors sacred geometry and records the complete ascension history of your family.",
      "Ascension Guide: Uses Metatron's Cube to clear dense, lower-vibrational patterns out of your DNA.",
    ],
    spiritualTools: { crystal: "Watermelon Tourmaline", association: "Sephirah Keter (The Crown)", halo: "Green and Pink" },
  },
  Sandalphon: {
    ancestralConnections: [
      "Deliverer of Ancestral Prayers: Carries the silent cries and heart prayers of your entire lineage to Source.",
      "Harmonic Weaver: Intertwines the musical and prayerful legacy of your ancestors into your life.",
    ],
    spiritualTools: { crystal: "Turquoise", association: "Sephirah Malkuth (The Kingdom/Earth)", halo: "Turquoise" },
  },
  Raguel: {
    ancestralConnections: [
      "Restorer of Ancestral Justice: Untangles long-standing family disputes and inherited injustice.",
      "Harmonizer of Bloodlines: Rebuilds right relationship across generations of conflict.",
    ],
    spiritualTools: { crystal: "Aquamarine", association: "Justice and Right Order", halo: "Pale Aqua Blue" },
  },
  Jeremiel: {
    ancestralConnections: [
      "Reviewer of Lineage History: Conducts life reviews for souls and reveals the deeper meaning of family trials.",
      "Prophetic Visionary: Helps you look back at ancestral suffering to extract the gold and spiritual triumph.",
    ],
    spiritualTools: { crystal: "Amethyst", association: "Soul Records and Reviews", halo: "Purple" },
  },
};
