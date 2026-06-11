import { motion } from "framer-motion";
import { LeaderboardEntry } from "../types";

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentPlayerId?: string;
}

export function Leaderboard({ entries, currentPlayerId }: LeaderboardProps) {
  // TODO: Implement proper tie-breaking logic
  // TODO: Add pagination for large leaderboards
  // TODO: Highlight current player's position

  const sorted = entries.sort((a, b) => b.player.score - a.player.score);

  return (
    <div className="leaderboard">
      <h2>🏆 Leaderboard</h2>

      <div className="leaderboard-list">
        {sorted.map((entry, index) => (
          <motion.div
            key={entry.player.id}
            className={`leaderboard-entry ${
              entry.player.id === currentPlayerId ? "current-player" : ""
            }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <span className="rank">
              {index === 0 && "🥇"}
              {index === 1 && "🥈"}
              {index === 2 && "🥉"}
              {index > 2 && `#${index + 1}`}
            </span>

            <img
              src={entry.player.avatarUrl}
              alt={entry.player.name}
              className="player-avatar"
            />

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

      {/* TODO: Add "Your Position" section when player is not in top 10 */}
    </div>
  );
}
