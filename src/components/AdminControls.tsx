import React from 'react';

interface AdminControlsProps {
  onReveal: () => void;
  onReset: () => void;
  votesRevealed: boolean;
  hasVotes: boolean;
}

export const AdminControls: React.FC<AdminControlsProps> = ({
  onReveal,
  onReset,
  votesRevealed,
  hasVotes,
}) => {
  return (
    <div className="w-full bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Admin Controls
      </h2>
      <div className="flex flex-wrap gap-4">
        <button
          onClick={onReveal}
          disabled={!hasVotes || votesRevealed}
          className={`
            px-6 py-3 rounded-lg font-semibold transition-all duration-200
            ${!hasVotes || votesRevealed
              ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl'
            }
          `}
        >
          Reveal Votes
        </button>
        <button
          onClick={onReset}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
        >
          New Round
        </button>
      </div>
    </div>
  );
};
