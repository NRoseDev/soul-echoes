import React from "react";
import { chakraColorMap } from "../data/chakraColorMap";
import { angelChakraMap } from "../data/angelChakraMap";
import { chakraData } from "../data/chakraData";

interface AngelDetailProps {
  angel: {
    id: string;
    name: string;
    description: string;
    gifts: string[];
  } | null;
  onClose: () => void;
}

export const AngelDetail: React.FC<AngelDetailProps> = ({ angel, onClose }) => {
  if (!angel) return null;

  // Find which chakra(s) this angel belongs to
  const chakraKey = Object.entries(angelChakraMap).find(([_, angels]) =>
    angels.includes(angel.id)
  )?.[0] as keyof typeof chakraColorMap | undefined;

  const chakraColors = chakraKey
    ? chakraColorMap[chakraKey].colors
    : ["#444", "#222"];

  const chakraProfile = chakraKey
    ? chakraData.find((c) => c.id === chakraKey)
    : null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "white",
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
          backgroundImage: `linear-gradient(135deg, ${chakraColors[0]}, ${chakraColors[1]})`,
          color: "white",
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: "12px" }}>{angel.name}</h2>

        <p style={{ opacity: 0.9, marginBottom: "16px" }}>
          {angel.description}
        </p>

        {chakraProfile && (
          <div style={{ marginBottom: "16px" }}>
            <strong>Chakra:</strong> {chakraProfile.name}
            <div style={{ fontSize: "14px", opacity: 0.9 }}>
              {chakraProfile.theme}
            </div>
          </div>
        )}

        <div style={{ marginBottom: "16px" }}>
          <strong>Gifts:</strong>
          <ul style={{ marginTop: "6px" }}>
            {angel.gifts.map((gift) => (
              <li key={gift}>{gift}</li>
            ))}
          </ul>
        </div>

        <button
          onClick={onClose}
          style={{
            marginTop: "12px",
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            border: "none",
            background: "rgba(255,255,255,0.2)",
            color: "white",
            fontSize: "16px",
            cursor: "pointer",
            backdropFilter: "blur(4px)",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};
