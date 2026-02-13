import React from 'react';
import type { VoteValue } from '../types';

interface CardProps {
  value: VoteValue;
  selected?: boolean;
  revealed?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export const Card: React.FC<CardProps> = ({
  value,
  selected = false,
  revealed = false,
  onClick,
  disabled = false,
}) => {
  const isSpecial = value === '?' || value === '☕';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative w-20 h-28 rounded-lg shadow-lg transition-all duration-200
        card-scale-hover
        ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        ${selected
          ? 'bg-blue-500 text-white ring-4 ring-blue-300 dark:ring-blue-700'
          : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:shadow-xl'
        }
        ${revealed ? 'card-flip' : ''}
      `}
    >
      <div className="flex items-center justify-center h-full">
        <span className={`text-3xl font-bold ${isSpecial ? 'text-4xl' : ''}`}>
          {value}
        </span>
      </div>
      {selected && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-blue-500 rounded-lg opacity-20 animate-pulse" />
        </div>
      )}
    </button>
  );
};
