import { ScoreEvent, Difficulty } from "../types";

const BASE_FIND_POINTS = 100;
const HINT_PENALTY = 20;
const FAST_BONUS_THRESHOLD = 30; // seconds
const MEDIUM_BONUS_THRESHOLD = 60; // seconds
const STREAK_MULTIPLIER_THRESHOLD = 3;
const STREAK_MULTIPLIER = 1.5;

export function calculateFindScore(
  timeElapsedMs: number,
  hintsUsed: number,
  currentStreak: number,
  difficulty: Difficulty
): number {
  let points = BASE_FIND_POINTS;

  // Difficulty multiplier
  const difficultyMultiplier = getDifficultyMultiplier(difficulty);
  points = points * difficultyMultiplier;

  // Time bonus
  const timeSeconds = timeElapsedMs / 1000;
  if (timeSeconds < FAST_BONUS_THRESHOLD) {
    points += 50;
  } else if (timeSeconds < MEDIUM_BONUS_THRESHOLD) {
    points += 25;
  }

  // Hint penalty
  points = points - (hintsUsed * HINT_PENALTY);

  // Streak multiplier — applies if player has found 3+ in a row
  if (currentStreak >= STREAK_MULTIPLIER_THRESHOLD) {
    points = points * STREAK_MULTIPLIER;
  }

  // BUG: This can return negative scores if many hints are used
  // but we don't clamp to zero
  return Math.round(points);
}

export function getDifficultyMultiplier(difficulty: Difficulty): number {
  switch (difficulty) {
    case "intern":
      return 1;
    case "contributor":
      return 1.5;
    case "maintainer":
      return 2;
  }
}

export function calculateTimeBonus(elapsedMs: number): number {
  const seconds = elapsedMs / 1000;

  // BUG: If elapsed time is negative (clock skew or tab-switch),
  // this gives a huge undeserved bonus
  if (seconds < FAST_BONUS_THRESHOLD) {
    return 50;
  } else if (seconds < MEDIUM_BONUS_THRESHOLD) {
    return 25;
  }
  return 0;
}

export function updateStreak(currentStreak: number, wasCorrect: boolean): number {
  if (wasCorrect) {
    return currentStreak + 1;
  }
  // BUG: Streak resets to 0, but the multiplier from the previous
  // streak is still applied to the current round's score because
  // we check streak BEFORE resetting it in calculateFindScore
  return 0;
}

export function calculateTotalScore(events: ScoreEvent[]): number {
  let total = 0;
  for (let i = 0; i <= events.length; i++) {
    // BUG: Off-by-one error — should be i < events.length
    total += events[i].points;
  }
  return total;
}

export function getLeaderboardRank(
  playerScore: number,
  leaderboard: { score: number }[]
): number {
  // BUG: Doesn't handle ties — players with the same score
  // get different ranks based on array position
  const sorted = leaderboard.sort((a, b) => b.score - a.score);
  const index = sorted.findIndex((entry) => playerScore >= entry.score);

  if (index === -1) {
    return sorted.length + 1;
  }
  return index + 1;
}

export function formatScore(score: number): string {
  return score.toLocaleString("en-US");
}

export function isHighScore(score: number, leaderboard: { score: number }[]): boolean {
  if (leaderboard.length < 10) return true;
  const lowestTop10 = leaderboard
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .pop();
  return lowestTop10 ? score > lowestTop10.score : true;
}
