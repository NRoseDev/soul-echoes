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

export interface ArchangelProfile {
  name: string;
  meaning: string;
  assignment: string;
  energyColor: string;
  frequency: string;
  healingGifts: string[];
  whenToCall: string[];
  palette: AngelPalette;
}

export const ARCHANGELS: ArchangelProfile[] = [
  {
    name: "Michael",
    meaning: "Who is like God",
    assignment: "Protection, spiritual warfare, justice, strength, and cutting of spiritual bonds. The commander of the angelic army. Call on Michael when you need protection, courage in battle, or help breaking spiritual chains.",
    energyColor: "Royal Blue / Gold",
    frequency: "741 Hz — Clearing & Protection",
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
    palette: {
      atmosphere: "#001a2e", rays: "#aaddff", beam: "#a0e6ff",
      wingTip: "#ffe0a0", wingPrimary: "#00eedd", wingDeep: "#004466", wingVein: "#55eeff",
      robeLight: "#e8f8ff", robeMid: "#aaddee", robeDark: "#001428",
      armorLight: "#d0f0ff", armorDark: "#1a3c55",
      accentLight: "#fff0b0", accentMid: "#ffcc44", accentDark: "#bb8800",
      hoodLight: "#c0eeff", hoodDark: "#001830",
      tipGlow: "#ffeeaa", mist: "#00aadd",
      eye: "#44ccee", eyeHL: "#ffffff", armorVein: "#99ddee", shadow: "#00b4dc",
      nameColor: "#88ccee", subtitleColor: "#4488aa",
      name: "MICHAEL", subtitle: "Guardian · Protection · Courage",
    },
  },
  {
    name: "Gabriel",
    meaning: "Strength of God",
    assignment: "Divine communication, revelation, announcements, and creative conception. Gabriel carries messages of destiny and new beginnings. Present at births, callings, and prophetic unfolding.",
    energyColor: "White / Silver",
    frequency: "417 Hz — Facilitating Change",
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
    palette: {
      atmosphere: "#060814", rays: "#c0ccff", beam: "#e8eeff",
      wingTip: "#f5f5ff", wingPrimary: "#d0dcf8", wingDeep: "#2a3355", wingVein: "#c8d8ff",
      robeLight: "#f8f8ff", robeMid: "#c8d8f0", robeDark: "#0a0b28",
      armorLight: "#e8eeff", armorDark: "#1a2040",
      accentLight: "#f8f8ff", accentMid: "#c8c8ee", accentDark: "#8888cc",
      hoodLight: "#e8eeff", hoodDark: "#0a0b1e",
      tipGlow: "#f8f8ff", mist: "#8899cc",
      eye: "#88aacc", eyeHL: "#f8f8ff", armorVein: "#c8d8ee", shadow: "#8899cc",
      nameColor: "#c0d0ee", subtitleColor: "#6677aa",
      name: "GABRIEL", subtitle: "Divine Message · Revelation · New Beginnings",
    },
  },
  {
    name: "Raphael",
    meaning: "God heals",
    assignment: "Physical, emotional, and spiritual healing. The physician of heaven. Raphael is present in hospital rooms, at the bedsides of the sick, and wherever healing is being sought.",
    energyColor: "Emerald Green",
    frequency: "528 Hz — Miracle Tone / DNA Repair",
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
    palette: {
      atmosphere: "#001208", rays: "#aaffcc", beam: "#aaffee",
      wingTip: "#ccffe8", wingPrimary: "#00dd88", wingDeep: "#003322", wingVein: "#44ffaa",
      robeLight: "#e8fff5", robeMid: "#88ddcc", robeDark: "#001408",
      armorLight: "#aaffdd", armorDark: "#0f2820",
      accentLight: "#fff0b0", accentMid: "#ffcc44", accentDark: "#bb8800",
      hoodLight: "#aaffe8", hoodDark: "#001508",
      tipGlow: "#ccffe8", mist: "#00aa44",
      eye: "#00ee88", eyeHL: "#ffffff", armorVein: "#88ffcc", shadow: "#00aa44",
      nameColor: "#44ffaa", subtitleColor: "#228855",
      name: "RAPHAEL", subtitle: "Healing · Restoration · Divine Physician",
    },
  },
  {
    name: "Uriel",
    meaning: "Fire of God / Light of God",
    assignment: "Wisdom, illumination, intellectual clarity, and aligning with divine truth. Uriel brings light into confusion and helps interpret prophetic revelation.",
    energyColor: "Red / Gold",
    frequency: "396 Hz — Liberation from Fear",
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
    palette: {
      atmosphere: "#140800", rays: "#ffddaa", beam: "#ffeecc",
      wingTip: "#ffddaa", wingPrimary: "#ff8800", wingDeep: "#441100", wingVein: "#ffcc66",
      robeLight: "#fff0dd", robeMid: "#ffcc88", robeDark: "#180800",
      armorLight: "#ffeecc", armorDark: "#3a1800",
      accentLight: "#fff0b0", accentMid: "#ffcc44", accentDark: "#bb8800",
      hoodLight: "#ffddbb", hoodDark: "#140800",
      tipGlow: "#ffeeaa", mist: "#ff4400",
      eye: "#ff8800", eyeHL: "#ffffee", armorVein: "#ffddaa", shadow: "#ff4400",
      nameColor: "#ffcc88", subtitleColor: "#aa6622",
      name: "URIEL", subtitle: "Wisdom · Divine Light · Sacred Truth",
    },
  },
  {
    name: "Ariel",
    meaning: "Lioness of God",
    assignment: "Nature, animals, the earth, and elemental healing. Ariel oversees the natural world and can be invited into work involving earth healing, animal communication, and grounding.",
    energyColor: "Pale Pink / Iridescent",
    frequency: "432 Hz — Earth Harmony",
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
    palette: {
      atmosphere: "#130a10", rays: "#ffccee", beam: "#ffeef8",
      wingTip: "#ffeef5", wingPrimary: "#ff99cc", wingDeep: "#440022", wingVein: "#ffaacc",
      robeLight: "#fff5f8", robeMid: "#ffbbdd", robeDark: "#180008",
      armorLight: "#ffeeff", armorDark: "#331020",
      accentLight: "#fff0f5", accentMid: "#ffaacc", accentDark: "#cc4488",
      hoodLight: "#ffeeff", hoodDark: "#120810",
      tipGlow: "#ffddee", mist: "#cc4488",
      eye: "#ff88bb", eyeHL: "#fff8ff", armorVein: "#ffd0ee", shadow: "#cc4488",
      nameColor: "#ffaacc", subtitleColor: "#994466",
      name: "ARIEL", subtitle: "Earth Healing · Nature · Elemental Grace",
    },
  },
  {
    name: "Chamuel",
    meaning: "He who seeks God",
    assignment: "Love, compassion, peace, and finding what is lost — including lost relationships, lost purpose, and lost peace. Chamuel works to restore the heart.",
    energyColor: "Pale Green / Pink",
    frequency: "639 Hz — Heart Reconnection",
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
    palette: {
      atmosphere: "#040c08", rays: "#aaffcc", beam: "#ccffee",
      wingTip: "#e8fff0", wingPrimary: "#88ffcc", wingDeep: "#113322", wingVein: "#88eecc",
      robeLight: "#f0fff8", robeMid: "#aaeecc", robeDark: "#081408",
      armorLight: "#ccfff0", armorDark: "#0f2820",
      accentLight: "#e8fff0", accentMid: "#88ddaa", accentDark: "#226644",
      hoodLight: "#ccffee", hoodDark: "#041008",
      tipGlow: "#ccffee", mist: "#44cc88",
      eye: "#44ddaa", eyeHL: "#f0fff8", armorVein: "#88ddcc", shadow: "#44aa88",
      nameColor: "#88ddbb", subtitleColor: "#338855",
      name: "CHAMUEL", subtitle: "Love · Compassion · Restoring the Heart",
    },
  },
  {
    name: "Haniel",
    meaning: "Grace of God",
    assignment: "Grace, intuition, the moon cycle, feminine energy, and spiritual vision. Haniel helps develop and refine clairvoyance and intuitive gifts.",
    energyColor: "Moonstone / Silver Blue",
    frequency: "852 Hz — Spiritual Intuition",
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
    palette: {
      atmosphere: "#040810", rays: "#c0ccee", beam: "#ddeeff",
      wingTip: "#ddeeff", wingPrimary: "#aabbee", wingDeep: "#1a2a44", wingVein: "#99bbdd",
      robeLight: "#eef5ff", robeMid: "#bbccee", robeDark: "#080c18",
      armorLight: "#ddeeff", armorDark: "#182030",
      accentLight: "#eef5ff", accentMid: "#99aace", accentDark: "#4455aa",
      hoodLight: "#c8ddf5", hoodDark: "#050810",
      tipGlow: "#ddeeff", mist: "#4466aa",
      eye: "#88aacc", eyeHL: "#eef5ff", armorVein: "#aac0dd", shadow: "#4466aa",
      nameColor: "#99bbdd", subtitleColor: "#446688",
      name: "HANIEL", subtitle: "Grace · Intuition · Moon Wisdom",
    },
  },
  {
    name: "Jophiel",
    meaning: "Beauty of God",
    assignment: "Beauty, creativity, wisdom, and slowing down long enough to perceive the sacred. Jophiel combats mental clutter and helps artists, teachers, and creators align with divine beauty.",
    energyColor: "Yellow / Gold",
    frequency: "285 Hz — Energy Field Restoration",
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
    palette: {
      atmosphere: "#100c00", rays: "#ffffcc", beam: "#ffffe8",
      wingTip: "#ffffcc", wingPrimary: "#ffee44", wingDeep: "#332200", wingVein: "#ffee66",
      robeLight: "#fffff0", robeMid: "#ffee88", robeDark: "#151000",
      armorLight: "#fffff0", armorDark: "#332800",
      accentLight: "#ffffcc", accentMid: "#ffdd00", accentDark: "#aa8800",
      hoodLight: "#ffffc8", hoodDark: "#100c00",
      tipGlow: "#ffffaa", mist: "#ddaa00",
      eye: "#ffcc00", eyeHL: "#fffff8", armorVein: "#ffeeaa", shadow: "#ddaa00",
      nameColor: "#ffee88", subtitleColor: "#997722",
      name: "JOPHIEL", subtitle: "Beauty · Creativity · Sacred Perception",
    },
  },
  {
    name: "Raguel",
    meaning: "Friend of God",
    assignment: "Justice, harmony, order, and right relationships. Raguel resolves disputes, restores fairness, and brings clarity where there has been injustice or relational chaos.",
    energyColor: "Light Blue / Aqua",
    frequency: "174 Hz — Foundation & Justice",
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
    palette: {
      atmosphere: "#000c10", rays: "#aaeeff", beam: "#ccfffe",
      wingTip: "#ccffff", wingPrimary: "#44eedd", wingDeep: "#002233", wingVein: "#44eedd",
      robeLight: "#eeffff", robeMid: "#88ddee", robeDark: "#000e18",
      armorLight: "#ccffff", armorDark: "#0a2030",
      accentLight: "#e8ffff", accentMid: "#88ddee", accentDark: "#2299aa",
      hoodLight: "#c8f8ff", hoodDark: "#000c18",
      tipGlow: "#ddfff8", mist: "#0099bb",
      eye: "#00ccee", eyeHL: "#f0ffff", armorVein: "#88ddee", shadow: "#0099bb",
      nameColor: "#66eeff", subtitleColor: "#2288aa",
      name: "RAGUEL", subtitle: "Justice · Harmony · Right Relationship",
    },
  },
  {
    name: "Raziel",
    meaning: "Secrets of God",
    assignment: "Divine mysteries, esoteric wisdom, the akashic records, and understanding the hidden dimensions of reality. Raziel helps those being initiated into deeper spiritual understanding.",
    energyColor: "Rainbow / Iridescent",
    frequency: "963 Hz — Divine Connection",
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
    palette: {
      atmosphere: "#04001a", rays: "#ddc0ff", beam: "#ddc0ff",
      wingTip: "#f0e0ff", wingPrimary: "#aa44ff", wingDeep: "#220044", wingVein: "#cc88ff",
      robeLight: "#f0e0ff", robeMid: "#9966dd", robeDark: "#0a0018",
      armorLight: "#f0e8ff", armorDark: "#220033",
      accentLight: "#ffbbff", accentMid: "#cc44ff", accentDark: "#6600cc",
      hoodLight: "#e8d8ff", hoodDark: "#06000e",
      tipGlow: "#f0e0ff", mist: "#6600cc",
      eye: "#aa44ff", eyeHL: "#f8f0ff", armorVein: "#ddbbff", shadow: "#6600cc",
      nameColor: "#cc88ff", subtitleColor: "#6633aa",
      name: "RAZIEL", subtitle: "Divine Mystery · Hidden Wisdom · Akashic Light",
    },
  },
  {
    name: "Zadkiel",
    meaning: "Righteousness of God",
    assignment: "Forgiveness, mercy, freedom from guilt, and transformation. Zadkiel oversees the violet flame of transmutation — the divine fire that transforms darkness into light.",
    energyColor: "Violet / Indigo",
    frequency: "741 Hz — Transmutation",
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
    palette: {
      atmosphere: "#080014", rays: "#ddbbff", beam: "#f0ddff",
      wingTip: "#eeddff", wingPrimary: "#cc44ff", wingDeep: "#330055", wingVein: "#cc66ff",
      robeLight: "#f5eeff", robeMid: "#bb88ee", robeDark: "#0a0020",
      armorLight: "#eeddff", armorDark: "#2a0044",
      accentLight: "#f5eeff", accentMid: "#cc66ff", accentDark: "#8800cc",
      hoodLight: "#ddc8ff", hoodDark: "#06001a",
      tipGlow: "#eeddf8", mist: "#8800cc",
      eye: "#cc44ff", eyeHL: "#f8f0ff", armorVein: "#ddbbff", shadow: "#8800cc",
      nameColor: "#cc88ff", subtitleColor: "#7722aa",
      name: "ZADKIEL", subtitle: "Forgiveness · Mercy · Violet Flame Transmutation",
    },
  },
];
