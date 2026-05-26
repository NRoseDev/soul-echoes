import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { saveRoomSession, getRoomSession, logProgress } from "@/lib/roomPersistence";

export interface RoomContextType {
  currentRoomId: string;
  currentSubRoomId?: string;
  roomState: Record<string, any>;
  navigationStack: Array<{ roomId: string; subRoomId?: string }>;
  canGoBack: boolean;
  isLoading: boolean;
  isSaving: boolean;
  navigateToRoom: (roomId: string, subRoomId?: string) => Promise<void>;
  goBack: () => Promise<void>;
  updateRoomState: (state: Record<string, any>) => Promise<void>;
  logAction: (
    actionType: "completed" | "started" | "visited" | "interacted",
    actionData: Record<string, any>,
    emotionalState?: string,
    durationSeconds?: number,
    notes?: string
  ) => Promise<void>;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export function RoomProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [currentRoomId, setCurrentRoomId] = useState("brain-dump");
  const [currentSubRoomId, setCurrentSubRoomId] = useState<string | undefined>();
  const [roomState, setRoomState] = useState<Record<string, any>>({});
  const [navigationStack, setNavigationStack] = useState<Array<{ roomId: string; subRoomId?: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) return;

    const loadRoomSession = async () => {
      setIsLoading(true);
      try {
        const session = await getRoomSession(user.id, currentRoomId, currentSubRoomId);
        if (session) {
          setRoomState(session.room_state);
        }
      } catch (error) {
        console.error("Error loading room session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRoomSession();
  }, [user, currentRoomId, currentSubRoomId]);

  const navigateToRoom = useCallback(
    async (roomId: string, subRoomId?: string) => {
      if (!user) return;

      try {
        setIsSaving(true);

        if (currentRoomId) {
          await saveRoomSession(user.id, currentRoomId, currentSubRoomId, roomState, 0);
        }

        setNavigationStack((prev) => [
          ...prev,
          { roomId: currentRoomId, subRoomId: currentSubRoomId },
        ]);

        setCurrentRoomId(roomId);
        setCurrentSubRoomId(subRoomId);
        setRoomState({});

        await logProgress(user.id, roomId, subRoomId, "visited", {
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Error navigating to room:", error);
      } finally {
        setIsSaving(false);
      }
    },
    [user, currentRoomId, currentSubRoomId, roomState]
  );

  const goBack = useCallback(async () => {
    if (!user || navigationStack.length === 0) return;

    try {
      setIsSaving(true);

      await saveRoomSession(user.id, currentRoomId, currentSubRoomId, roomState, 0);

      const previousRoom = navigationStack[navigationStack.length - 1];
      setNavigationStack((prev) => prev.slice(0, -1));

      setCurrentRoomId(previousRoom.roomId);
      setCurrentSubRoomId(previousRoom.subRoomId);
      setRoomState({});
    } catch (error) {
      console.error("Error going back:", error);
    } finally {
      setIsSaving(false);
    }
  }, [user, navigationStack, currentRoomId, currentSubRoomId, roomState]);

  const updateRoomState = useCallback(
    async (newState: Record<string, any>) => {
      setRoomState((prev) => ({ ...prev, ...newState }));

      if (user) {
        setTimeout(async () => {
          try {
            await saveRoomSession(user.id, currentRoomId, currentSubRoomId, { ...roomState, ...newState }, 0);
          } catch (error) {
            console.error("Error auto-saving room state:", error);
          }
        }, 1000);
      }
    },
    [user, currentRoomId, currentSubRoomId, roomState]
  );

  const logAction = useCallback(
    async (
      actionType: "completed" | "started" | "visited" | "interacted",
      actionData: Record<string, any>,
      emotionalState?: string,
      durationSeconds?: number,
      notes?: string
    ) => {
      if (!user) return;

      try {
        await logProgress(user.id, currentRoomId, currentSubRoomId, actionType, actionData, emotionalState, durationSeconds, notes);
      } catch (error) {
        console.error("Error logging action:", error);
      }
    },
    [user, currentRoomId, currentSubRoomId]
  );

  const value: RoomContextType = {
    currentRoomId,
    currentSubRoomId,
    roomState,
    navigationStack,
    canGoBack: navigationStack.length > 0,
    isLoading,
    isSaving,
    navigateToRoom,
    goBack,
    updateRoomState,
    logAction,
  };

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
}

export function useRoom() {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error("useRoom must be used within a RoomProvider");
  }
  return context;
}
