// Core types for Planning Poker application

export type VoteValue = '0' | '1' | '2' | '3' | '5' | '8' | '13' | '21' | '?' | '☕';

export const FIBONACCI_VALUES: VoteValue[] = ['0', '1', '2', '3', '5', '8', '13', '21', '?', '☕'];

export interface Player {
  id: string;
  name: string;
  vote: VoteValue | null;
  isAdmin: boolean;
  lastSeen: number;
}

export interface Session {
  id: string;
  createdAt: number;
  adminId: string;
  votesRevealed: boolean;
  currentRound: number;
}

export interface SessionData {
  session: Session;
  players: Record<string, Player>;
}

export type UserRole = 'admin' | 'player';

export interface LocalPlayer {
  id: string;
  name: string;
  role: UserRole;
}
