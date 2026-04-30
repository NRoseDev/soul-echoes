import { useState, useMemo } from "react";
import { angels } from "../data/angels";

export const useAngels = () => {
  const [selectedAngelId, setSelectedAngelId] = useState<string | null>(null);

  const selectedAngel = useMemo(() => {
    return angels.find((a) => a.id === selectedAngelId) || null;
  }, [selectedAngelId]);

  const openAngel = (id: string) => setSelectedAngelId(id);
  const closeAngel = () => setSelectedAngelId(null);

  return {
    angels,
    selectedAngel,
    openAngel,
    closeAngel,
  };
};
