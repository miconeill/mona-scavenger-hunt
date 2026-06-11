export interface Clue {
  id: string;
  title: string;
  riddle: string;
  hints: string[];
  answer: string;
  difficulty: Difficulty;
  monaVariant: string;
  location: string;
}

export type Difficulty = "intern" | "contributor" | "maintainer";

export interface Player {
  id: string;
  name: string;
  avatarUrl: string;
  score: number;
  cluesFound: string[];
  hintsUsed: number;
  currentStreak: number;
  bestStreak: number;
  startedAt: number;
}

export interface GameState {
  player: Player;
  currentClue: Clue | null;
  cluesRemaining: Clue[];
  cluesCompleted: Clue[];
  difficulty: Difficulty;
  isActive: boolean;
  roundStartTime: number;
}

export interface LeaderboardEntry {
  rank: number;
  player: Player;
  completedAt: number;
  totalTime: number;
}

export interface ScoreEvent {
  type: "find" | "hint" | "time_bonus" | "streak";
  points: number;
  timestamp: number;
  clueId: string;
}
