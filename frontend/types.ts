export enum Player {
  EMPTY = 0,
  X = 1,
  O = 2,
}

export enum Difficulty {
  EASY = 1, // Depth 1
  MEDIUM = 2, // Depth 2
  HARD = 3, // Depth 3 or 4
}

export interface GameConfig {
  mode: 'PvP' | 'PvAI';
  difficulty: Difficulty;
}

export type Move = [int: number, int: number]; // [boardIndex, cellIndex]

export interface GameResult {
  id: string;
  timestamp: number;
  mode: 'PvP' | 'PvAI';
  difficulty?: Difficulty;
  winner: 'Player 1' | 'Player 2' | 'AI' | 'Draw'; // Draw logic can be added later if needed
}
