import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { saveLocation } from "@/lib/progressMemory";

const ROUTE_LABELS: Array<[RegExp, (path: string) => { label: string; roomId?: string }]> = [
  [/^\/journal\/([^/]+)/, (p) => ({ label: `Journal · ${p.split("/")[2]}`, roomId: "journal" })],
  [/^\/journal/, () => ({ label: "Journal", roomId: "journal" })],
  [/^\/breathe/, () => ({ label: "Breathe Room", roomId: "breathe" })],
  [/^\/shadow/, () => ({ label: "Shadow Work Room", roomId: "shadow-work" })],
  [/^\/unspoken/, () => ({ label: "Unspoken Chamber", roomId: "unspoken" })],
  [/^\/wisdom/, () => ({ label: "Wisdom Room", roomId: "wisdom" })],
  [/^\/spiritual-tools/, () => ({ label: "Spiritual Tools", roomId: "spiritual-tools" })],
  [/^\/community/, () => ({ label: "Community", roomId: "community" })],
  [/^\/flow/, () => ({ label: "Flow", roomId: "flow" })],
  [/^\/shop/, () => ({ label: "Shop", roomId: "shop" })],
  [/^\/pricing/, () => ({ label: "Pricing" })],
  [/^\/settings/, () => ({ label: "Settings" })],
  [/^\/$/, () => ({ label: "Brain Dump (home)", roomId: "brain-dump" })],
];

function describe(path: string): { label: string; roomId?: string } {
  for (const [re, fn] of ROUTE_LABELS) {
    if (re.test(path)) return fn(path);
  }
  return { label: path };
}

/**
 * Silently tracks the user's current route into progress memory so the
 * AI guide can offer to resume where they left off on next app open.
 */
export function ProgressTracker() {
  const location = useLocation();
  useEffect(() => {
    const info = describe(location.pathname);
    saveLocation({ path: location.pathname + location.search, ...info });
  }, [location.pathname, location.search]);
  return null;
}
