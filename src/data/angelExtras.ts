// Short one-sentence descriptions and invocation prayers for each archangel.
// Keyed by angel.name (matches ARCHANGELS in angelData.ts).

export interface AngelExtras {
  shortDescription: string;
  symbols: string[];
  prayer: string;
}

export const ANGEL_EXTRAS: Record<string, AngelExtras> = {
  Michael: {
    shortDescription: "The warrior of light who shields you from fear and cuts every cord of darkness.",
    symbols: ["Sword of truth", "Royal blue & gold shield", "Flames of protection"],
    prayer:
      "Archangel Michael, commander of light, surround me now with your shield of royal blue and gold. Cut every cord of fear, sever every assignment of darkness, and stand at every entrance of my life. I am safe in the protection of Source. Amen.",
  },
  Gabriel: {
    shortDescription: "The divine messenger who delivers clarity, calling, and the word of new beginnings.",
    symbols: ["White lily", "Silver trumpet", "Open scroll"],
    prayer:
      "Archangel Gabriel, messenger of Source, open my ears to the word being spoken over my life. Clear my voice, awaken my creativity, and announce the season I am entering. I receive the message in faith. Amen.",
  },
  Raphael: {
    shortDescription: "The divine physician who restores body, heart, and energy field with emerald light.",
    symbols: ["Emerald green light", "Caduceus / staff", "Healing hands"],
    prayer:
      "Archangel Raphael, physician of heaven, surround me in emerald light. Touch every cell, every wound, every weary place — restore me to wholeness in body, mind, and spirit. I receive the healing of Source through your ministry. Amen.",
  },
  Uriel: {
    shortDescription: "The flame of God who illuminates confusion with wisdom and divine truth.",
    symbols: ["Open flame", "Scroll of wisdom", "Sunrise"],
    prayer:
      "Archangel Uriel, light of God, shine into every shadow of confusion in my mind. Show me the truth, dissolve every fear-based thought, and ground divine wisdom into my understanding. I see clearly now. Amen.",
  },
  Ariel: {
    shortDescription: "The lioness of God who reconnects you to the earth, animals, and elemental grace.",
    symbols: ["Lioness", "Pink iridescent light", "Living earth"],
    prayer:
      "Archangel Ariel, lioness of God, ground me in the living body of the earth. Restore my bond with creation, with the animals, with the elements. Bring my body back into harmony with the natural world. Amen.",
  },
  Chamuel: {
    shortDescription: "The seeker of God who restores love, finds what is lost, and reopens the heart.",
    symbols: ["Pale pink rose", "Heart of light", "Compass"],
    prayer:
      "Archangel Chamuel, seeker of all that is lost, find for me what I cannot find on my own — peace, purpose, the relationship that needs to be restored. Open my heart again to love, beginning with myself. Amen.",
  },
  Haniel: {
    shortDescription: "The grace of God who awakens intuition and aligns you with the moon's wisdom.",
    symbols: ["Crescent moon", "Moonstone", "Silver mist"],
    prayer:
      "Archangel Haniel, grace of God, attune me to the cycles of release and renewal. Open my intuition, refine my inner sight, and restore the feminine wisdom within me. I trust what I see and feel. Amen.",
  },
  Jophiel: {
    shortDescription: "The beauty of God who clears mental clutter and restores joy and creativity.",
    symbols: ["Yellow rose", "Golden sunlight", "Paintbrush"],
    prayer:
      "Archangel Jophiel, beauty of God, clear the noise from my mind and the heaviness from my heart. Help me see the sacred in the ordinary, restore my creativity, and return joy to my eyes. Amen.",
  },
  Raguel: {
    shortDescription: "The friend of God who restores justice, harmony, and right relationship.",
    symbols: ["Scales of balance", "Aqua light", "Bridge"],
    prayer:
      "Archangel Raguel, friend of God, restore justice where there has been injustice. Bring harmony to my relationships, mediate every conflict in love and truth, and align me with the right relational order. Amen.",
  },
  Raziel: {
    shortDescription: "The keeper of divine mysteries who unlocks hidden wisdom and akashic insight.",
    symbols: ["Rainbow light", "Open book of mysteries", "Iridescent feather"],
    prayer:
      "Archangel Raziel, keeper of divine mysteries, unveil what has been hidden from my understanding. Show me the deeper meaning of my story, the wisdom my soul has carried, and the next initiation I am ready for. Amen.",
  },
  Zadkiel: {
    shortDescription: "The mercy of God whose violet flame transmutes guilt, shame, and unforgiveness.",
    symbols: ["Violet flame", "Indigo robe", "Open hands of mercy"],
    prayer:
      "Archangel Zadkiel, mercy of God, surround me in your violet flame. Transmute every shame, every regret, every unforgiveness — toward myself and toward others — into compassion and freedom. I am made new. Amen.",
  },
  Azrael: {
    shortDescription: "The comforter who walks with grieving hearts and ushers gentle transitions.",
    symbols: ["Pale yellow light", "Cypress tree", "Gentle hand"],
    prayer:
      "Archangel Azrael, comforter of the bereaved, hold me in this grief. Walk gently beside every soul I love who is crossing or who has crossed. Soften the sorrow, restore my breath, and remind me love is never lost. Amen.",
  },
  Sandalphon: {
    shortDescription: "The angel of prayer and music who carries every cry of your heart to Source.",
    symbols: ["Turquoise light", "Harp / lyre", "Rising incense"],
    prayer:
      "Archangel Sandalphon, carrier of prayers, lift every word and every silent ache of my heart to Source. Let sacred sound restore me, let my prayers find the throne, and let heaven's frequency ground into my body and my home. Amen.",
  },
  Metatron: {
    shortDescription: "The voice of God who anchors sacred geometry and supports ascension.",
    symbols: ["Metatron's cube", "Violet & gold flame", "Sacred geometry"],
    prayer:
      "Archangel Metatron, voice of God, surround me in your cube of sacred light. Clear what is dense, align my body with divine pattern, and steward me through this ascension with order and grace. Amen.",
  },
  Jeremiel: {
    shortDescription: "The mercy of God who reviews your life and reveals the meaning of your story.",
    symbols: ["Deep purple light", "Mirror", "Open dream book"],
    prayer:
      "Archangel Jeremiel, merciful reviewer of souls, walk me back through my story with compassion. Show me the meaning of what I have lived, interpret the dreams I have been given, and realign my soul with the path ahead. Amen.",
  },
};
