import { useState, useEffect, useCallback } from 'react';
import { ref, onValue, set, update, remove, push } from 'firebase/database';
import { database } from '../firebase';
import type { SessionData, Player, Session, VoteValue, LocalPlayer } from '../types';

export function useSession(sessionId: string, localPlayer: LocalPlayer | null) {
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen to session data in real-time
  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    const sessionRef = ref(database, `sessions/${sessionId}`);
    
    const unsubscribe = onValue(
      sessionRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setSessionData(data);
          setError(null);
        } else {
          setSessionData(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Firebase error:', error);
        setError(error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [sessionId]);

  // Update player heartbeat
  useEffect(() => {
    if (!sessionId || !localPlayer) return;

    const playerRef = ref(database, `sessions/${sessionId}/players/${localPlayer.id}`);
    
    const updateHeartbeat = () => {
      update(playerRef, { lastSeen: Date.now() });
    };

    // Initial heartbeat
    updateHeartbeat();

    // Update heartbeat every 30 seconds
    const interval = setInterval(updateHeartbeat, 30000);

    return () => clearInterval(interval);
  }, [sessionId, localPlayer]);

  // Create a new session
  const createSession = useCallback(async (adminName: string): Promise<string> => {
    const newSessionRef = push(ref(database, 'sessions'));
    const sessionId = newSessionRef.key!;
    const adminId = `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const newSession: SessionData = {
      session: {
        id: sessionId,
        createdAt: Date.now(),
        adminId,
        votesRevealed: false,
        currentRound: 1,
      },
      players: {
        [adminId]: {
          id: adminId,
          name: adminName,
          vote: null,
          isAdmin: true,
          lastSeen: Date.now(),
        },
      },
    };

    await set(newSessionRef, newSession);
    return sessionId;
  }, []);

  // Join an existing session
  const joinSession = useCallback(async (playerName: string): Promise<string> => {
    if (!sessionId) throw new Error('Session ID is required');

    const playerId = `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const playerRef = ref(database, `sessions/${sessionId}/players/${playerId}`);

    const newPlayer: Player = {
      id: playerId,
      name: playerName,
      vote: null,
      isAdmin: false,
      lastSeen: Date.now(),
    };

    await set(playerRef, newPlayer);
    return playerId;
  }, [sessionId]);

  // Cast a vote
  const castVote = useCallback(async (playerId: string, vote: VoteValue) => {
    if (!sessionId) return;
    
    const voteRef = ref(database, `sessions/${sessionId}/players/${playerId}/vote`);
    await set(voteRef, vote);
  }, [sessionId]);

  // Reveal votes (admin only)
  const revealVotes = useCallback(async () => {
    if (!sessionId) return;
    
    const revealRef = ref(database, `sessions/${sessionId}/session/votesRevealed`);
    await set(revealRef, true);
  }, [sessionId]);

  // Reset votes (admin only)
  const resetVotes = useCallback(async () => {
    if (!sessionId || !sessionData) return;

    const updates: Record<string, any> = {
      [`sessions/${sessionId}/session/votesRevealed`]: false,
      [`sessions/${sessionId}/session/currentRound`]: (sessionData.session.currentRound || 0) + 1,
    };

    // Reset all player votes
    Object.keys(sessionData.players).forEach((playerId) => {
      updates[`sessions/${sessionId}/players/${playerId}/vote`] = null;
    });

    await update(ref(database), updates);
  }, [sessionId, sessionData]);

  // Remove a player
  const removePlayer = useCallback(async (playerId: string) => {
    if (!sessionId) return;
    
    const playerRef = ref(database, `sessions/${sessionId}/players/${playerId}`);
    await remove(playerRef);
  }, [sessionId]);

  return {
    sessionData,
    loading,
    error,
    createSession,
    joinSession,
    castVote,
    revealVotes,
    resetVotes,
    removePlayer,
  };
}
