"use client";

import { useState } from "react";
import AngelList from "@/components/AngelList";
import AngelProfileModal from "@/components/AngelProfileModal";

export default function AngelsPage() {
  const [selectedAngel, setSelectedAngel] = useState(null);

  return (
    <>
      <AngelList onSelect={setSelectedAngel} />
      <AngelProfileModal
        angel={selectedAngel}
        onClose={() => setSelectedAngel(null)}
      />
    </>
  );
}
