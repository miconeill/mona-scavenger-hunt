import { useMemo } from "react";
import { motion } from "framer-motion";
import { useGame } from "../context/GameContext";
import clueData from "../data/clues.json";
import type { Difficulty } from "../types";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

const statsVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

type ClueSummary = { difficulty: Difficulty };

export function ResultsScreen() {
  const { gameState, goToScreen, resetGame } = useGame();
  const player = gameState?.player;

  const totalClues = useMemo(() => {
    if (!gameState) return 0;
    return (clueData as ClueSummary[]).filter((clue) => clue.difficulty === gameState.difficulty).length;
  }, [gameState]);

  const totalTime = useMemo(() => {
    if (!player) return "0:00";
    const totalSeconds = Math.max(0, Math.floor((Date.now() - player.startedAt) / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, [player]);

  const celebrationMessage = useMemo(() => {
    if (!player) return "Not bad for a first hunt! Mona believes in you! 💜";
    const highScoreThreshold = Math.max(280, totalClues * 140);
    const mediumScoreThreshold = Math.max(180, totalClues * 90);
    if (player.score >= highScoreThreshold) return "Purrfect hunt! Mona is impressed! 🐱";
    if (player.score >= mediumScoreThreshold) {
      return "Great catch! You've got the instincts of an octocat! 🐙";
    }
    return "Not bad for a first hunt! Mona believes in you! 💜";
  }, [player, totalClues]);

  if (!gameState || !player) return null;

  const stats = [
    { label: "Total Score", value: player.score.toLocaleString() },
    { label: "Monas Found", value: `${player.cluesFound.length} / ${totalClues}` },
    { label: "Best Streak", value: player.bestStreak.toString() },
    { label: "Hints Used", value: player.hintsUsed.toString() },
    { label: "Total Time", value: totalTime },
  ];

  return (
    <motion.section
      className="results-screen"
      aria-labelledby="results-heading"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.header variants={itemVariants}>
        <h2 id="results-heading">🎉 Hunt Complete!</h2>
        <p>
          {player.name}, {celebrationMessage}
        </p>
      </motion.header>

      <motion.dl className="results-stats" variants={statsVariants}>
        {stats.map((stat) => (
          <motion.div key={stat.label} className="stat-card" variants={itemVariants}>
            <dt className="stat-label">{stat.label}</dt>
            <dd className="stat-value">{stat.value}</dd>
          </motion.div>
        ))}
      </motion.dl>

      <motion.nav aria-label="Results actions" variants={itemVariants}>
        <button
          type="button"
          onClick={() => goToScreen("leaderboard")}
          aria-label="View leaderboard"
        >
          🏆 View Leaderboard
        </button>
        <button type="button" onClick={resetGame} aria-label="Start a new scavenger hunt">
          🔄 Hunt Again
        </button>
      </motion.nav>
    </motion.section>
  );
}
