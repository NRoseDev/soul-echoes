import { Link } from "react-router-dom";
import { Check, Lock, ArrowRight, Sparkles } from "lucide-react";
import { useRoomProgress } from "@/hooks/use-room-progress";
import { cn } from "@/lib/utils";

type Props = {
  roomId: string;
  className?: string;
};

/**
 * Visual level path for a room.
 * - Level 1 always open.
 * - Level N opens when N-1 is marked complete.
 * - All payment tiers can reach all levels; this is purely progression.
 */
export function LevelPath({ roomId, className }: Props) {
  const { track, stateFor, loading, userId } = useRoomProgress(roomId);
  if (!track) return null;

  return (
    <section
      className={cn(
        "rounded-2xl border border-border bg-card/60 p-5 sm:p-6 space-y-4",
        className,
      )}
      aria-label={`${track.roomTitle} learning path`}
    >
      <header className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" aria-hidden />
            Your Path
          </h2>
          <p className="text-sm text-muted-foreground">
            Levels unlock as you complete them. Take your time.
          </p>
        </div>
      </header>

      <ol className="space-y-2">
        {track.levels.map((lvl) => {
          const state = loading ? "locked" : stateFor(lvl.level);
          const locked = state === "locked";
          const done = state === "completed";
          const href = `${track.routeBase}/level/${lvl.level}`;

          const inner = (
            <div
              className={cn(
                "flex items-start gap-3 rounded-xl border p-4 transition",
                locked
                  ? "border-border/60 bg-muted/30 opacity-70 cursor-not-allowed"
                  : "border-border bg-background hover:border-primary/60 hover:bg-primary/5",
              )}
            >
              <div
                className={cn(
                  "mt-0.5 h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-sm font-bold",
                  done && "bg-emerald-500/20 text-emerald-600",
                  !done && !locked && "bg-primary/20 text-primary",
                  locked && "bg-muted text-muted-foreground",
                )}
                aria-hidden
              >
                {done ? <Check className="h-4 w-4"  aria-hidden="true" /> : locked ? <Lock className="h-4 w-4"  aria-hidden="true" /> : lvl.level}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Level {lvl.level}
                  </span>
                  {done && (
                    <span className="text-xs font-semibold text-emerald-600">Completed</span>
                  )}
                  {!done && !locked && lvl.level !== 1 && (
                    <span className="text-xs font-semibold text-primary">Unlocked</span>
                  )}
                </div>
                <h3 className="font-display font-semibold text-foreground">{lvl.title}</h3>
                <p className="text-sm text-muted-foreground">{lvl.summary}</p>
                {locked && (
                  <p className="text-xs text-muted-foreground mt-1 italic">
                    Complete Level {lvl.level - 1} to unlock — this is progression, not a paywall.
                  </p>
                )}
              </div>
              {!locked && (
                <ArrowRight className="h-4 w-4 text-muted-foreground mt-2 shrink-0" aria-hidden />
              )}
            </div>
          );

          return (
            <li key={lvl.level}>
              {locked ? (
                <div aria-disabled="true">{inner}</div>
              ) : (
                <Link
                  to={href}
                  aria-label={`Open Level ${lvl.level}: ${lvl.title}`}
                  className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
                >
                  {inner}
                </Link>
              )}
            </li>
          );
        })}
      </ol>

      {!userId && (
        <p className="text-xs text-muted-foreground">
          Sign in to save your progress across devices.
        </p>
      )}
    </section>
  );
}
