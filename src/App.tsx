import { motion } from "framer-motion";
import { GameProvider, useGame } from "./context/GameContext";
import { StartScreen } from "./components/StartScreen";
import { ClueCard } from "./components/ClueCard";
import { ResultsScreen } from "./components/ResultsScreen";
import { Leaderboard } from "./components/Leaderboard";
import { useGameTimer } from "./hooks/useGameTimer";
import { useEffect } from "react";

function GameApp() {
  const {
    gameState,
    screen,
    hintsRevealed,
    roundStartTime,
    submitAnswer,
    requestHint,
    goToScreen,
  } = useGame();

  const { elapsed, formatted, start, stop, reset } = useGameTimer();

  useEffect(() => {
    if (screen === "play" && gameState?.currentClue) {
      reset();
      start();
    }
    if (screen !== "play") {
      stop();
    }
  }, [screen, gameState?.currentClue?.id]);

  const handleAnswer = (answer: string) => {
    const timeElapsed = elapsed || Date.now() - roundStartTime;
    const correct = submitAnswer(answer, timeElapsed);
    if (correct) {
      stop();
    }
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

      <main>
        {screen === "start" && <StartScreen />}

        {screen === "play" && gameState?.currentClue && (
          <ClueCard
            clue={gameState.currentClue}
            onAnswer={handleAnswer}
            onHint={requestHint}
            hintsRevealed={hintsRevealed}
            elapsed={formatted}
          />
        )}

        {screen === "results" && <ResultsScreen />}

        {screen === "leaderboard" && (
          <Leaderboard
            currentPlayerId={gameState?.player.id}
            initialDifficulty={gameState?.difficulty}
            onBack={() => goToScreen("results")}
          />
        )}
      </main>
    </div>
  );
}

export function App() {
  return (
    <GameProvider>
      <GameApp />
    </GameProvider>
  );
}
