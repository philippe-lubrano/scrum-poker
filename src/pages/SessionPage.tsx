import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '../hooks/useSession';
import { VotingInterface } from '../components/VotingInterface';
import { PlayerList } from '../components/PlayerList';
import { AdminControls } from '../components/AdminControls';
import type { LocalPlayer, VoteValue } from '../types';

export const SessionPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [localPlayer, setLocalPlayer] = useState<LocalPlayer | null>(() => {
    const stored = sessionStorage.getItem(`player_${sessionId}`);
    return stored ? JSON.parse(stored) : null;
  });

  const {
    sessionData,
    loading,
    error,
    joinSession,
    castVote,
    revealVotes,
    resetVotes,
  } = useSession(sessionId || '', localPlayer);

  // Handle joining session
  useEffect(() => {
    if (!sessionId) {
      navigate('/');
      return;
    }

    if (!localPlayer && !loading && sessionData) {
      // TODO: Replace prompt with modal dialog component
      const name = prompt('Enter your name:');
      if (!name) {
        navigate('/');
        return;
      }

      joinSession(name).then((playerId) => {
        const player: LocalPlayer = {
          id: playerId,
          name,
          role: 'player',
        };
        setLocalPlayer(player);
        sessionStorage.setItem(`player_${sessionId}`, JSON.stringify(player));
      });
    }
  }, [sessionId, localPlayer, loading, sessionData, navigate, joinSession]);

  const handleVote = (value: VoteValue) => {
    if (localPlayer) {
      castVote(localPlayer.id, value);
    }
  };

  const handleReveal = () => {
    revealVotes();
  };

  const handleReset = () => {
    resetVotes();
  };

  const copySessionLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    // TODO: Replace alert with toast notification
    alert('Session link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-600 dark:text-gray-400">Loading session...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-red-600 dark:text-red-400">Error: {error}</div>
      </div>
    );
  }

  if (!sessionData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-600 dark:text-gray-400">Session not found</div>
      </div>
    );
  }

  const currentPlayer = localPlayer ? sessionData.players[localPlayer.id] : null;
  const isAdmin = currentPlayer?.isAdmin || false;
  const votesRevealed = sessionData.session.votesRevealed;
  const currentVote = currentPlayer?.vote || null;
  const hasVotes = Object.values(sessionData.players).some((p) => p.vote !== null);

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Planning Poker
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Round #{sessionData.session.currentRound}
              </p>
            </div>
            <button
              onClick={copySessionLink}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg transition-colors duration-200"
            >
              📋 Copy Session Link
            </button>
          </div>
        </div>

        {/* Admin Controls */}
        {isAdmin && (
          <AdminControls
            onReveal={handleReveal}
            onReset={handleReset}
            votesRevealed={votesRevealed}
            hasVotes={hasVotes}
          />
        )}

        {/* Voting Interface */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <VotingInterface
            currentVote={currentVote}
            onVote={handleVote}
            disabled={!currentPlayer}
            votesRevealed={votesRevealed}
          />
        </div>

        {/* Player List */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <PlayerList
            players={sessionData.players}
            votesRevealed={votesRevealed}
            currentPlayerId={localPlayer?.id}
          />
        </div>

        {/* Voting Summary */}
        {votesRevealed && hasVotes && (
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Voting Summary
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Object.entries(
                Object.values(sessionData.players)
                  .filter((p) => p.vote !== null)
                  .reduce((acc, player) => {
                    const vote = player.vote!;
                    acc[vote] = (acc[vote] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)
              ).map(([vote, count]) => (
                <div
                  key={vote}
                  className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center"
                >
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {vote}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {count} vote{count > 1 ? 's' : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
