"use client";

import { angels } from "@/data/angels";

export default function AngelList({ onSelect }) {
  return (
    <div className="space-y-3">
      {angels.map((angel) => (
        <button
          key={angel.id}
          onClick={() => onSelect(angel.id)}
          className="w-full text-left py-3 px-4 rounded-lg bg-white/5 hover:bg-white/10 transition flex items-center gap-2"
        >
          <span className="text-xl">🪽</span>
          <span className="text-lg">{angel.name}</span>
        </button>
      ))}
    </div>
  );
}
