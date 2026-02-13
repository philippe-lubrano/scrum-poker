import React from 'react';
import { Card } from './Card';
import type { VoteValue } from '../types';
import { FIBONACCI_VALUES } from '../types';

interface VotingInterfaceProps {
  currentVote: VoteValue | null;
  onVote: (value: VoteValue) => void;
  disabled?: boolean;
  votesRevealed: boolean;
}

export const VotingInterface: React.FC<VotingInterfaceProps> = ({
  currentVote,
  onVote,
  disabled = false,
  votesRevealed,
}) => {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        {votesRevealed ? 'Votes Revealed' : 'Cast Your Vote'}
      </h2>
      <div className="flex flex-wrap gap-4 justify-center">
        {FIBONACCI_VALUES.map((value) => (
          <Card
            key={value}
            value={value}
            selected={currentVote === value}
            revealed={votesRevealed}
            onClick={() => onVote(value)}
            disabled={disabled || votesRevealed}
          />
        ))}
      </div>
      {currentVote && !votesRevealed && (
        <div className="mt-6 text-center">
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Your vote: <span className="font-bold text-blue-600 dark:text-blue-400">{currentVote}</span>
          </p>
        </div>
      )}
    </div>
  );
};
