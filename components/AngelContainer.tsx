"use client";

import { useState } from "react";
import AngelList from "./AngelList";
import AngelProfileModal from "./AngelProfileModal";

export default function AngelContainer() {
  const [selectedAngel, setSelectedAngel] = useState(null);

  return (
    <div className="p-4">
      <AngelList onSelect={setSelectedAngel} />

      <AngelProfileModal
      "use client";

import { useState } from "react";
import AngelList from "./AngelList";
import AngelProfileModal from "./AngelProfileModal";

export default function AngelContainer() {
  const [selectedAngel, setSelectedAngel] = useState(null);

  return (
    <div className="p-4">
      <AngelList onSelect={setSelectedAngel} />

      <AngelProfileModal
        angel={selectedAngel}
        onClose={() => setSelectedAngel(null)}
      />
    </div>
  );
}
        onClose={() => setSelectedAngel(null)}
      />
    </div>
  );
}
