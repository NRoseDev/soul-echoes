import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRoomProgress } from "@/hooks/use-room-progress";
import { toast } from "sonner";

/**
 * Generic level page: /<room>/level/:n
 * Placeholder lesson shell + "Mark Level Complete" button.
 */
export default function LevelPage() {
  const { roomId = "", levelNum = "1" } = useParams();
  const level = Number(levelNum);
  const navigate = useNavigate();
  const { track, stateFor, markComplete, loading, userId } = useRoomProgress(roomId);
  const [saving, setSaving] = useState(false);

  if (!track) {
    return (
      <main className="container mx-auto p-6">
        <p className="text-muted-foreground">Room not found.</p>
      </main>
    );
  }

  const lvl = track.levels.find((l) => l.level === level);
  if (!lvl) {
    return (
      <main className="container mx-auto p-6">
        <p className="text-muted-foreground">Level not found.</p>
      </main>
    );
  }

  const state = loading ? "locked" : stateFor(level);
  const locked = state === "locked";
  const done = state === "completed";

  const onComplete = async () => {
    if (!userId) {
      toast.error("Sign in to save your progress.");
      return;
    }
    setSaving(true);
    const { error } = await markComplete(level);
    setSaving(false);
    if (error) toast.error(error);
    else toast.success(`Level ${level} complete. Next level unlocked.`);
  };

  return (
    <main className="container mx-auto max-w-3xl p-6 space-y-6">
      <button
        onClick={() => navigate(track.routeBase)}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4"  aria-hidden="true" /> Back to {track.roomTitle}
      </button>

      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
          {track.roomTitle} · Level {lvl.level}
        </p>
        <h1 className="font-display text-3xl font-bold text-foreground">{lvl.title}</h1>
        <p className="text-muted-foreground">{lvl.summary}</p>
      </header>

      {locked ? (
        <div className="rounded-2xl border border-border bg-muted/30 p-6 text-center space-y-2">
          <Lock className="h-6 w-6 mx-auto text-muted-foreground"  aria-hidden="true" />
          <p className="font-semibold">This level isn't open yet.</p>
          <p className="text-sm text-muted-foreground">
            Complete Level {level - 1} first — this is progression, not a paywall.
          </p>
          <Button variant="outline" onClick={() => navigate(track.routeBase)}>
            Return to {track.roomTitle}
          </Button>
        </div>
      ) : (
        <>
          <section className="space-y-3">
            <h2 className="font-display text-lg font-bold">Lessons</h2>
            <ul className="space-y-2">
              {lvl.lessons.map((lesson) => (
                <li
                  key={lesson.id}
                  className="rounded-xl border border-border bg-card/60 p-4"
                >
                  <p className="font-semibold text-foreground">{lesson.title}</p>
                  <p className="text-sm text-muted-foreground italic">
                    Placeholder content — real teaching for "{lvl.title}" goes here.
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <div className="rounded-2xl border border-border bg-card/60 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="font-semibold">
                {done ? "You've completed this level." : "Done with this level?"}
              </p>
              <p className="text-sm text-muted-foreground">
                {done
                  ? "You can revisit anytime. The next level is unlocked."
                  : "Mark complete to unlock the next level."}
              </p>
            </div>
            <Button onClick={onComplete} disabled={saving || done}>
              {done ? (
                <>
                  <Check className="h-4 w-4 mr-2"  aria-hidden="true" /> Completed
                </>
              ) : saving ? (
                "Saving…"
              ) : (
                "Mark Level Complete"
              )}
            </Button>
          </div>
        </>
      )}
    </main>
  );
}
