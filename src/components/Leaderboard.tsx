import { useState } from "react";
import { motion } from "framer-motion";
import { Difficulty } from "../types";
import { getLeaderboard } from "../utils/leaderboard";

interface LeaderboardProps {
  currentPlayerId?: string;
  initialDifficulty?: Difficulty;
  onBack?: () => void;
}

export function Leaderboard({ currentPlayerId, initialDifficulty, onBack }: LeaderboardProps) {
  const [difficulty, setDifficulty] = useState<Difficulty>(initialDifficulty || "intern");
  const entries = getLeaderboard(difficulty);

  const currentPlayerEntry = entries.find(
    (e) => e.player.id === currentPlayerId
  );
  const currentPlayerRank = currentPlayerEntry
    ? entries.indexOf(currentPlayerEntry) + 1
    : null;

  const top10 = entries.slice(0, 10);
  const showYourPosition = currentPlayerRank && currentPlayerRank > 10;

  return (
    <section className="leaderboard" aria-label="Leaderboard">
      <h2>🏆 Leaderboard</h2>

      <nav className="difficulty-tabs" aria-label="Filter by difficulty">
        {(["intern", "contributor", "maintainer"] as Difficulty[]).map((d) => (
          <button
            key={d}
            className={difficulty === d ? "active" : ""}
            onClick={() => setDifficulty(d)}
            aria-pressed={difficulty === d}
            aria-label={`Show ${d} leaderboard`}
          >
            {d === "intern" && "🌱 Intern"}
            {d === "contributor" && "⚡ Contributor"}
            {d === "maintainer" && "🔥 Maintainer"}
          </button>
        ))}
      </nav>

      <div className="leaderboard-list" role="list">
        {top10.length === 0 && (
          <p className="leaderboard-empty">
            No hunters yet! Be the first to claim the top spot. 🐙
          </p>
        )}
        {top10.map((entry, index) => (
          <motion.div
            key={entry.player.id}
            className={`leaderboard-entry ${
              entry.player.id === currentPlayerId ? "current-player" : ""
            }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            role="listitem"
          >
            <span className="rank" aria-label={`Rank ${index + 1}`}>
              {index === 0 && "🥇"}
              {index === 1 && "🥈"}
              {index === 2 && "🥉"}
              {index > 2 && `#${index + 1}`}
            </span>

            <div className="player-info">
              <span className="player-name">{entry.player.name}</span>
              <span className="player-stats">
                {entry.player.cluesFound.length} found · {entry.player.bestStreak} best streak
              </span>
            </div>

            <span className="player-score">
              {entry.player.score.toLocaleString()}
            </span>
          </motion.div>
        ))}
      </div>

      {showYourPosition && currentPlayerEntry && (
        <div className="your-position" aria-label="Your position on the leaderboard">
          <p>Your position:</p>
          <div className="leaderboard-entry current-player">
            <span className="rank">#{currentPlayerRank}</span>
            <div className="player-info">
              <span className="player-name">{currentPlayerEntry.player.name}</span>
              <span className="player-stats">
                {currentPlayerEntry.player.cluesFound.length} found · {currentPlayerEntry.player.bestStreak} best streak
              </span>
            </div>
            <span className="player-score">
              {currentPlayerEntry.player.score.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {onBack && (
        <button
          onClick={onBack}
          className="back-button"
          aria-label="Go back to results"
        >
          ← Back
        </button>
      )}
    </section>
  );
}
