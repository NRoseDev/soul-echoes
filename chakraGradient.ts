import { chakraColorMap } from "../data/chakraColorMap";
import { ChakraKey } from "../data/chakraColorMap";

export const chakraGradient = (chakra: ChakraKey | null) => {
  if (!chakra) {
    return "linear-gradient(135deg, #222, #000)";
  }

  const colors = chakraColorMap[chakra].colors;

  return `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`;
};
