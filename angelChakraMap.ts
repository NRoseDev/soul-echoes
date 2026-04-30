export const angelChakraMap = {
  root: [
    "archangel_michael",
    "archangel_uriel",
    "archangel_azrael",
  ],
  sacral: [
    "archangel_gabriel",
    "archangel_haniel",
  ],
  solar_plexus: [
    "archangel_jophiel",
    "archangel_ariel",
  ],
  heart: [
    "archangel_raphael",
    "archangel_chamuel",
  ],
  throat: [
    "archangel_gabriel",
    "archangel_zadkiel",
  ],
  third_eye: [
    "archangel_raziel",
    "archangel_metatron",
  ],
  crown: [
    "archangel_metatron",
    "archangel_sandalphon",
  ],
  soul_star: [
    "archangel_metatron",
    "archangel_sandalphon",
    "archangel_jeremiel",
  ],
} as const;

export type AngelChakraKey = keyof typeof angelChakraMap;
