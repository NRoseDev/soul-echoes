import React from "react";
import { chakraData } from "../data/chakraData";
import { chakraColorMap } from "../data/chakraColorMap";
import { ChakraKey } from "../data/chakraColorMap";

interface ChakraModalProps {
  chakra: ChakraKey | null;
  onClose: () => void;
}

export const ChakraModal: React.FC<ChakraModalProps> = ({ chakra, onClose }) => {
  if (!chakra) return null;

  const profile = chakraData.find((c) => c.id === chakra);
  const colors = chakraColorMap[chakra].colors;

  if (!profile) return null;

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
          backgroundImage: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
          color: "white",
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: "12px" }}>{profile.name}</h2>

        <p style={{ opacity: 0.9, marginBottom: "16px" }}>{profile.theme}</p>

        <div style={{ marginBottom: "16px" }}>
          <strong>Element:</strong> {profile.element}
        </div>

        <div style={{ marginBottom: "16px" }}>
          <strong>Position:</strong> {profile.position}
        </div>

        <div style={{ marginBottom: "16px" }}>
          <strong>Gifts:</strong>
          <ul style={{ marginTop: "6px" }}>
            {profile.gifts.map((gift) => (
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
