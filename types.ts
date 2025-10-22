export interface Player {
  name: string;
}

export interface TeamState {
  player1: Player;
  player2: Player;
  points: string; // "0", "15", "30", "40", or a number for tiebreaks
  games: number; // current game score in set
  sets: number; // sets won
}

export type ThirdSetMode = 'normal' | 'superTiebreak';

export interface SetScore {
  gamesA: number;
  gamesB: number;
  pointsA?: number;
  pointsB?: number;
  isSuperTiebreak?: boolean;
}

export interface ScoreState {
  teamA: TeamState;
  teamB: TeamState;
  currentSet: number;
  thirdSetMode: ThirdSetMode;
  winner: 'A' | 'B' | null;
  server: 'A' | 'B' | null; // Can be null before match starts
  matchTitle: string;
  setScores: SetScore[];
}