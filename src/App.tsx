import { useState } from "react";
import { motion } from "framer-motion";
import { Clue, Difficulty, GameState } from "../types";
import { ClueCard } from "./components/ClueCard";
import { Leaderboard } from "./components/Leaderboard";
import clueData from "./data/clues.json";

export function App() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [screen, setScreen] = useState<"menu" | "play" | "results">("menu");

  const startGame = (difficulty: Difficulty) => {
    const filteredClues = (clueData as Clue[]).filter(
      (c) => c.difficulty === difficulty
    );

    setGameState({
      player: {
        id: crypto.randomUUID(),
        name: "Player",
        avatarUrl: "",
        score: 0,
        cluesFound: [],
        hintsUsed: 0,
        currentStreak: 0,
        bestStreak: 0,
        startedAt: Date.now(),
      },
      currentClue: filteredClues[0] || null,
      cluesRemaining: filteredClues.slice(1),
      cluesCompleted: [],
      difficulty,
      isActive: true,
      roundStartTime: Date.now(),
    });
    setScreen("play");
  };

  return (
    <div className="app">
      <header>
        <motion.h1
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring" }}
        >
          🐙 Mona's Scavenger Hunt
        </motion.h1>
      </header>

      {screen === "menu" && (
        <div className="menu">
          <p>Find hidden Monas across GitHub! Choose your difficulty:</p>
          <div className="difficulty-buttons">
            <button onClick={() => startGame("intern")}>
              🌱 Intern
            </button>
            <button onClick={() => startGame("contributor")}>
              ⚡ Contributor
            </button>
            <button onClick={() => startGame("maintainer")}>
              🔥 Maintainer
            </button>
          </div>
        </div>
      )}

      {screen === "play" && gameState?.currentClue && (
        <ClueCard
          clue={gameState.currentClue}
          onAnswer={(answer) => {
            // TODO: Implement answer handling with scoring
            console.log("Answered:", answer);
          }}
          onHint={() => {
            // TODO: Implement hint reveal with score penalty
            console.log("Hint requested");
          }}
          hintsRevealed={0}
        />
      )}

      {screen === "results" && (
        <Leaderboard entries={[]} currentPlayerId={gameState?.player.id} />
      )}
    </div>
  );
}
