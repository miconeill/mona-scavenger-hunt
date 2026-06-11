import { createContext, useContext, useState, useCallback, useRef, ReactNode } from "react";
import { Clue, Difficulty, GameState, Player, ScoreEvent, LeaderboardEntry } from "../types";
import { calculateFindScore, updateStreak } from "../utils/scoring";
import { saveLeaderboardEntry } from "../utils/leaderboard";
import clueData from "../data/clues.json";

type Screen = "start" | "play" | "results" | "leaderboard";

interface GameContextValue {
  gameState: GameState | null;
  screen: Screen;
  hintsRevealed: number;
  scoreEvents: ScoreEvent[];
  roundStartTime: number;
  startGame: (playerName: string, difficulty: Difficulty) => void;
  submitAnswer: (answer: string, elapsedMs: number) => boolean;
  requestHint: () => void;
  endGame: () => void;
  goToScreen: (screen: Screen) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return ctx;
}

interface GameProviderProps {
  children: ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [screen, setScreen] = useState<Screen>("start");
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [scoreEvents, setScoreEvents] = useState<ScoreEvent[]>([]);
  const [roundStartTime, setRoundStartTime] = useState(0);
  const isSubmitting = useRef(false);
  const isFinished = useRef(false);

  const startGame = useCallback((playerName: string, difficulty: Difficulty) => {
    const filteredClues = (clueData as Clue[]).filter(
      (c) => c.difficulty === difficulty
    );

    if (filteredClues.length === 0) return;

    const player: Player = {
      id: crypto.randomUUID(),
      name: playerName,
      avatarUrl: "",
      score: 0,
      cluesFound: [],
      hintsUsed: 0,
      currentStreak: 0,
      bestStreak: 0,
      startedAt: Date.now(),
    };

    isFinished.current = false;
    isSubmitting.current = false;

    const now = Date.now();
    setGameState({
      player,
      currentClue: filteredClues[0],
      cluesRemaining: filteredClues.slice(1),
      cluesCompleted: [],
      difficulty,
      isActive: true,
      roundStartTime: now,
    });
    setHintsRevealed(0);
    setScoreEvents([]);
    setRoundStartTime(now);
    setScreen("play");
  }, []);

  const submitAnswer = useCallback((answer: string, elapsedMs: number): boolean => {
    if (!gameState || !gameState.currentClue || !gameState.isActive) return false;
    if (isSubmitting.current) return false;

    const isCorrect =
      answer.toLowerCase().trim() ===
      gameState.currentClue.answer.toLowerCase().trim();

    if (!isCorrect) return false;

    isSubmitting.current = true;

    const points = calculateFindScore(
      Math.max(0, elapsedMs),
      hintsRevealed,
      gameState.player.currentStreak,
      gameState.difficulty
    );

    const newStreak = updateStreak(gameState.player.currentStreak, true);
    const newBestStreak = Math.max(newStreak, gameState.player.bestStreak);

    const event: ScoreEvent = {
      type: "find",
      points,
      timestamp: Date.now(),
      clueId: gameState.currentClue.id,
    };

    setScoreEvents((prev) => [...prev, event]);

    const updatedPlayer: Player = {
      ...gameState.player,
      score: gameState.player.score + points,
      cluesFound: [...gameState.player.cluesFound, gameState.currentClue.id],
      hintsUsed: gameState.player.hintsUsed + hintsRevealed,
      currentStreak: newStreak,
      bestStreak: newBestStreak,
    };

    const nextClue = gameState.cluesRemaining[0] || null;
    const remaining = gameState.cluesRemaining.slice(1);
    const now = Date.now();

    setGameState({
      ...gameState,
      player: updatedPlayer,
      currentClue: nextClue,
      cluesRemaining: remaining,
      cluesCompleted: [...gameState.cluesCompleted, gameState.currentClue],
      roundStartTime: now,
    });

    setHintsRevealed(0);
    setRoundStartTime(now);

    if (!nextClue) {
      finishGame(updatedPlayer);
    }

    // Release submission lock after state updates are queued
    setTimeout(() => { isSubmitting.current = false; }, 0);

    return true;
  }, [gameState, hintsRevealed]);

  const requestHint = useCallback(() => {
    if (!gameState || !gameState.currentClue) return;

    const maxHints = gameState.currentClue.hints.length;
    setHintsRevealed((prev) => Math.min(prev + 1, maxHints));
  }, [gameState]);

  const finishGame = (player: Player) => {
    if (!gameState || isFinished.current) return;
    isFinished.current = true;

    const entry: LeaderboardEntry = {
      rank: 0,
      player,
      completedAt: Date.now(),
      totalTime: Date.now() - player.startedAt,
    };

    setGameState((prev) => prev ? { ...prev, isActive: false } : null);
    saveLeaderboardEntry(entry, gameState.difficulty);
    setScreen("results");
  };

  const endGame = useCallback(() => {
    if (!gameState || !gameState.isActive) return;
    finishGame(gameState.player);
  }, [gameState]);

  const goToScreen = useCallback((newScreen: Screen) => {
    setScreen(newScreen);
  }, []);

  const resetGame = useCallback(() => {
    setGameState(null);
    setHintsRevealed(0);
    setScoreEvents([]);
    setRoundStartTime(0);
    isFinished.current = false;
    isSubmitting.current = false;
    setScreen("start");
  }, []);

  return (
    <GameContext.Provider
      value={{
        gameState,
        screen,
        hintsRevealed,
        scoreEvents,
        roundStartTime,
        startGame,
        submitAnswer,
        requestHint,
        endGame,
        goToScreen,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
