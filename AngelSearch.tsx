import React, { useState, useMemo } from "react";
import { chakraData } from "../data/chakraData";
import { angelChakraMap } from "../data/angelChakraMap";

interface AngelSearchProps {
  angels: {
    id: string;
    name: string;
    description: string;
    gifts: string[];
  }[];
  onSelect: (id: string) => void;
}

export const AngelSearch: React.FC<AngelSearchProps> = ({
  angels,
  onSelect,
}) => {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return angels;

    return angels.filter((angel) => {
      const nameMatch = angel.name.toLowerCase().includes(q);
      const giftMatch = angel.gifts.some((g) => g.toLowerCase().includes(q));

      const chakraMatch = Object.entries(angelChakraMap).some(
        ([chakraKey, angelIds]) =>
          angelIds.includes(angel.id) &&
          chakraData
            .find((c) => c.id === chakraKey)
            ?.keywords.some((k) => k.toLowerCase().includes(q))
      );

      return nameMatch || giftMatch || chakraMatch;
    });
  }, [query, angels]);

  return (
    <div style={{ padding: "16px" }}>
      <input
        type="text"
        placeholder="Search angels, gifts, chakras..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "10px",
          border: "1px solid #ccc",
          marginBottom: "16px",
          fontSize: "16px",
        }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: "16px",
        }}
      >
        {filtered.map((angel) => (
          <div
            key={angel.id}
            onClick={() => onSelect(angel.id)}
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "16px",
              textAlign: "center",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
          >
            <div
              style={{
                fontWeight: 600,
                fontSize: "16px",
                marginBottom: "8px",
              }}
            >
              {angel.name}
            </div>

            <div
              style={{
                fontSize: "13px",
                opacity: 0.7,
              }}
            >
              {angel.gifts.slice(0, 2).join(", ")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
