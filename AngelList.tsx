import React from "react";

interface AngelListProps {
  angels: {
    id: string;
    name: string;
    shortDescription?: string;
  }[];
  onSelect: (id: string) => void;
}

export const AngelList: React.FC<AngelListProps> = ({ angels, onSelect }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
        gap: "16px",
        padding: "20px",
      }}
    >
      {angels.map((angel) => (
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

          {angel.shortDescription && (
            <div
              style={{
                fontSize: "13px",
                opacity: 0.7,
              }}
            >
              {angel.shortDescription}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
