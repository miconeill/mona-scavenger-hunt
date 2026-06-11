import { Difficulty, LeaderboardEntry, Player } from "../types";

const MAX_ENTRIES = 50;
const DIFFICULTIES: Difficulty[] = ["intern", "contributor", "maintainer"];

function getStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

function getStorageKey(difficulty: Difficulty): string {
  return `mona-hunt-leaderboard-${difficulty}`;
}

function isPlayer(value: unknown): value is Player {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const player = value as Record<string, unknown>;

  return (
    typeof player.id === "string" &&
    typeof player.name === "string" &&
    typeof player.avatarUrl === "string" &&
    typeof player.score === "number" &&
    Array.isArray(player.cluesFound) &&
    player.cluesFound.every((clueId) => typeof clueId === "string") &&
    typeof player.hintsUsed === "number" &&
    typeof player.currentStreak === "number" &&
    typeof player.bestStreak === "number" &&
    typeof player.startedAt === "number"
  );
}

function isLeaderboardEntry(value: unknown): value is LeaderboardEntry {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const entry = value as Record<string, unknown>;

  return (
    typeof entry.rank === "number" &&
    isPlayer(entry.player) &&
    typeof entry.completedAt === "number" &&
    typeof entry.totalTime === "number"
  );
}

function sortEntries(entries: LeaderboardEntry[]): LeaderboardEntry[] {
  return [...entries].sort((left, right) => {
    const scoreDifference = right.player.score - left.player.score;
    if (scoreDifference !== 0) {
      return scoreDifference;
    }

    const completionDifference = left.completedAt - right.completedAt;
    if (completionDifference !== 0) {
      return completionDifference;
    }

    return left.player.name.localeCompare(right.player.name);
  });
}

function rerankEntries(entries: LeaderboardEntry[]): LeaderboardEntry[] {
  const sortedEntries = sortEntries(entries).slice(0, MAX_ENTRIES);
  let previousScore: number | null = null;
  let previousRank = 0;

  return sortedEntries.map((entry, index) => {
    const score = entry.player.score;
    const rank = previousScore === score ? previousRank : index + 1;

    previousScore = score;
    previousRank = rank;

    return {
      ...entry,
      rank,
    };
  });
}

function readLeaderboard(difficulty: Difficulty): LeaderboardEntry[] {
  const storage = getStorage();
  if (!storage) {
    return [];
  }

  try {
    const rawValue = storage.getItem(getStorageKey(difficulty));
    if (!rawValue) {
      return [];
    }

    const parsedValue: unknown = JSON.parse(rawValue);
    if (!Array.isArray(parsedValue) || !parsedValue.every(isLeaderboardEntry)) {
      return [];
    }

    return rerankEntries(parsedValue);
  } catch {
    return [];
  }
}

export function getLeaderboard(difficulty: Difficulty): LeaderboardEntry[] {
  return readLeaderboard(difficulty);
}

export function saveLeaderboardEntry(
  entry: LeaderboardEntry,
  difficulty: Difficulty
): void {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  try {
    const entries = rerankEntries([...readLeaderboard(difficulty), entry]);
    storage.setItem(getStorageKey(difficulty), JSON.stringify(entries));
  } catch {
    // Ignore storage write failures so gameplay can continue.
  }
}

export function clearLeaderboard(difficulty: Difficulty): void {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  try {
    storage.removeItem(getStorageKey(difficulty));
  } catch {
    // Ignore storage removal failures so gameplay can continue.
  }
}

export function getAllLeaderboards(): Record<Difficulty, LeaderboardEntry[]> {
  return DIFFICULTIES.reduce<Record<Difficulty, LeaderboardEntry[]>>(
    (leaderboards, difficulty) => {
      leaderboards[difficulty] = getLeaderboard(difficulty);
      return leaderboards;
    },
    {
      intern: [],
      contributor: [],
      maintainer: [],
    }
  );
}
