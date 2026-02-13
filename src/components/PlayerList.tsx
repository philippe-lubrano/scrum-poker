import React from 'react';
import type { Player } from '../types';

interface PlayerListProps {
  players: Record<string, Player>;
  votesRevealed: boolean;
  currentPlayerId?: string;
}

export const PlayerList: React.FC<PlayerListProps> = ({
  players,
  votesRevealed,
  currentPlayerId,
}) => {
  const playerList = Object.values(players);

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Players ({playerList.length})
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {playerList.map((player) => {
          const hasVoted = player.vote !== null;
          const isCurrentPlayer = player.id === currentPlayerId;

          return (
            <div
              key={player.id}
              className={`
                p-4 rounded-lg shadow-md transition-all duration-200
                ${isCurrentPlayer
                  ? 'bg-blue-100 dark:bg-blue-900 ring-2 ring-blue-500'
                  : 'bg-white dark:bg-gray-800'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className={`
                      w-3 h-3 rounded-full
                      ${hasVoted ? 'bg-green-500' : 'bg-gray-400'}
                    `}
                  />
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {player.name}
                  </span>
                  {player.isAdmin && (
                    <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded">
                      Admin
                    </span>
                  )}
                  {isCurrentPlayer && (
                    <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
                      You
                    </span>
                  )}
                </div>
                <div>
                  {votesRevealed && hasVoted ? (
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {player.vote}
                    </span>
                  ) : hasVoted ? (
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      ✓ Voted
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400 dark:text-gray-600">
                      Waiting...
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
