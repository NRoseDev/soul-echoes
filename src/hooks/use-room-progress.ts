import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getRoomTrack } from "@/config/roomLevels";

export type LevelState = "completed" | "in_progress" | "locked";

type ProgressRow = {
  room_id: string;
  level: number;
  status: "in_progress" | "completed";
};

/**
 * Hook for per-room level progress.
 * - Reads from `room_level_progress` (Lovable Cloud).
 * - Falls back to read-only "all locked except L1" for signed-out users.
 */
export function useRoomProgress(roomId: string) {
  const track = getRoomTrack(roomId);
  const [rows, setRows] = useState<ProgressRow[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const { data: auth } = await supabase.auth.getUser();
    const uid = auth.user?.id ?? null;
    setUserId(uid);
    if (!uid) {
      setRows([]);
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("room_level_progress")
      .select("room_id, level, status")
      .eq("user_id", uid)
      .eq("room_id", roomId);
    setRows((data ?? []) as ProgressRow[]);
    setLoading(false);
  }, [roomId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const isCompleted = (level: number) =>
    rows.some((r) => r.level === level && r.status === "completed");

  const stateFor = (level: number): LevelState => {
    if (isCompleted(level)) return "completed";
    if (level === 1) return "in_progress";
    if (isCompleted(level - 1)) return "in_progress";
    return "locked";
  };

  const markComplete = useCallback(
    async (level: number) => {
      if (!userId) return { error: "not_signed_in" as const };
      const { error } = await supabase
        .from("room_level_progress")
        .upsert(
          {
            user_id: userId,
            room_id: roomId,
            level,
            status: "completed",
            completed_at: new Date().toISOString(),
          },
          { onConflict: "user_id,room_id,level" },
        );
      if (!error) await refresh();
      return { error: error?.message ?? null };
    },
    [userId, roomId, refresh],
  );

  return { track, rows, loading, stateFor, isCompleted, markComplete, refresh, userId };
}
