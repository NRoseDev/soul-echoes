import { supabase as supabaseClient } from "@/integrations/supabase/client";
// Tables room_sessions and progress_logs are not in the generated types yet.
const supabase = supabaseClient as any;

export interface RoomSession {
  id: string;
  user_id: string;
  room_id: string;
  sub_room_id?: string;
  room_state: Record<string, any>;
  scroll_position: number;
  last_visited_at: string;
  created_at: string;
  updated_at: string;
}

export interface ProgressLog {
  id: string;
  user_id: string;
  room_id: string;
  sub_room_id?: string;
  action_type: "completed" | "started" | "visited" | "interacted";
  action_data: Record<string, any>;
  duration_seconds?: number;
  emotional_state?: string;
  notes?: string;
  created_at: string;
}

export async function saveRoomSession(
  userId: string,
  roomId: string,
  subRoomId: string | undefined,
  roomState: Record<string, any>,
  scrollPosition: number = 0
): Promise<RoomSession | null> {
  try {
    const { data, error } = await supabase
      .from("room_sessions")
      .upsert(
        {
          user_id: userId,
          room_id: roomId,
          sub_room_id: subRoomId,
          room_state: roomState,
          scroll_position: scrollPosition,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,room_id,sub_room_id" }
      )
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error saving room session:", error);
    return null;
  }
}

export async function getRoomSession(
  userId: string,
  roomId: string,
  subRoomId?: string
): Promise<RoomSession | null> {
  try {
    const { data, error } = await supabase
      .from("room_sessions")
      .select("*")
      .eq("user_id", userId)
      .eq("room_id", roomId)
      .eq("sub_room_id", subRoomId || null)
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }
    return data || null;
  } catch (error) {
    console.error("Error fetching room session:", error);
    return null;
  }
}

export async function logProgress(
  userId: string,
  roomId: string,
  subRoomId: string | undefined,
  actionType: "completed" | "started" | "visited" | "interacted",
  actionData: Record<string, any>,
  emotionalState?: string,
  durationSeconds?: number,
  notes?: string
): Promise<ProgressLog | null> {
  try {
    const { data, error } = await supabase
      .from("progress_logs")
      .insert({
        user_id: userId,
        room_id: roomId,
        sub_room_id: subRoomId,
        action_type: actionType,
        action_data: actionData,
        emotional_state: emotionalState,
        duration_seconds: durationSeconds,
        notes: notes,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error logging progress:", error);
    return null;
  }
}

export async function getProgressLogs(
  userId: string,
  roomId: string,
  subRoomId?: string,
  limit: number = 50
): Promise<ProgressLog[]> {
  try {
    let query = supabase
      .from("progress_logs")
      .select("*")
      .eq("user_id", userId)
      .eq("room_id", roomId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (subRoomId) {
      query = query.eq("sub_room_id", subRoomId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching progress logs:", error);
    return [];
  }
}
