import { useState } from "react";
import { motion } from "framer-motion";
import { useGame } from "../context/GameContext";
import { Difficulty } from "../types";

const containerVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      when: "beforeChildren",
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const difficulties: Array<{
  difficulty: Difficulty;
  title: string;
  description: string;
}> = [
  { difficulty: "intern", title: "🌱 Intern", description: "Perfect for first-timers" },
  { difficulty: "contributor", title: "⚡ Contributor", description: "For regular GitHub users" },
  { difficulty: "maintainer", title: "🔥 Maintainer", description: "Only for the brave" },
];

export function StartScreen() {
  const [playerName, setPlayerName] = useState("");
  const { startGame } = useGame();
  const trimmedName = playerName.trim();

  const handleStart = (difficulty: Difficulty) => {
    if (!trimmedName) {
      return;
    }
    startGame(trimmedName, difficulty);
  };

  return (
    <main className="start-screen">
      <motion.section
        aria-labelledby="start-screen-title"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.header variants={itemVariants}>
          <h1 id="start-screen-title">🐙 Mona&apos;s Scavenger Hunt</h1>
          <p>Find hidden Monas across GitHub!</p>
          <p>Ready to hunt some octocats?</p>
        </motion.header>

        <motion.form variants={itemVariants}>
          <label htmlFor="player-name">GitHub username</label>
          <input
            id="player-name"
            type="text"
            value={playerName}
            onChange={(event) => setPlayerName(event.target.value)}
            placeholder="Enter your GitHub username..."
            aria-label="Enter your GitHub username"
            required
          />
        </motion.form>

        {trimmedName && (
          <motion.section
            className="difficulty-buttons"
            aria-label="Choose your scavenger hunt difficulty"
            variants={itemVariants}
          >
            {difficulties.map(({ difficulty, title, description }) => (
              <button
                key={difficulty}
                type="button"
                data-difficulty={difficulty}
                aria-label={`Start ${title.replace(/^[^\w]+ /, "")} difficulty`}
                onClick={() => handleStart(difficulty)}
              >
                <span>{title}</span>
                <span>{description}</span>
              </button>
            ))}
          </motion.section>
        )}
      </motion.section>
    </main>
  );
}
