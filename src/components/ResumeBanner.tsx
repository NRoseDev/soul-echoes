import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getLastLocation } from "@/lib/progressMemory";
import { X, ArrowRight } from "lucide-react";

const DISMISS_KEY = "soul-echoes.progress.resume-dismissed-at";
const DISMISS_WINDOW_MS = 1000 * 60 * 60 * 6; // 6 hours

/**
 * "Welcome back — return to where you left off?" banner. Shown once per
 * session on the home route when a prior location exists. Never blocks
 * navigation; always dismissible.
 */
export function ResumeBanner() {
  const location = useLocation();
  const navigate = useNavigate();
  const [last, setLast] = useState<ReturnType<typeof getLastLocation>>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (location.pathname !== "/") { setVisible(false); return; }
    const stored = getLastLocation();
    if (!stored) return;
    if (stored.path === "/" || stored.path.startsWith("/?")) return;
    const dismissedAt = Number(localStorage.getItem(DISMISS_KEY) ?? 0);
    if (Date.now() - dismissedAt < DISMISS_WINDOW_MS) return;
    setLast(stored);
    setVisible(true);
  }, [location.pathname]);

  if (!visible || !last) return null;

  const dismiss = () => {
    try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch { /* noop */ }
    setVisible(false);
  };

  const resume = () => {
    dismiss();
    navigate(last.path);
  };

  return (
    <div className="mx-3 mt-3 flex items-center gap-3 rounded-2xl border border-amber-400/30 bg-amber-500/10 px-4 py-3 backdrop-blur-sm">
      <div className="flex-1 min-w-0">
        <p className="text-xs uppercase tracking-wide text-amber-300/80 font-semibold">Welcome back</p>
        <p className="text-sm text-foreground truncate">
          Continue where you left off: <span className="font-semibold">{last.label}</span>
        </p>
      </div>
      <button
        onClick={resume}
        className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500/90 hover:bg-amber-400 text-black text-sm font-semibold px-3 py-1.5 transition"
        aria-label={`Resume ${last.label}`}
      >
        Resume <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>
      <button
        onClick={dismiss}
        aria-label="Dismiss resume prompt"
        className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
