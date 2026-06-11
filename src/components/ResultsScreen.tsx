import { motion } from "framer-motion";
import { GameState, ScoreEvent } from "../types";

interface ResultsScreenProps {
  gameState: GameState;
  scoreEvents: ScoreEvent[];
  onPlayAgain: () => void;
  onViewLeaderboard: () => void;
}

export function ResultsScreen({
  gameState,
  scoreEvents,
  onPlayAgain,
  onViewLeaderboard,
}: ResultsScreenProps) {
  const { player } = gameState;

  // TODO: Calculate score breakdown from events
  // const basePoints = scoreEvents.filter(e => e.type === "find").reduce(...)
  // const timeBonuses = ...
  // const hintPenalties = ...
  // const streakBonuses = ...

  // TODO: Calculate total time from gameState.player.startedAt to now

  // TODO: Determine if this is a high score and show confetti

  return (
    <motion.div
      className="results-screen"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1>🎉 Hunt Complete!</h1>

      <div className="final-score">
        <span className="score-label">Final Score</span>
        <span className="score-value">{player.score.toLocaleString()}</span>
      </div>

      {/* TODO: Score breakdown section */}
      <div className="score-breakdown">
        <h3>Score Breakdown</h3>
        <p>Coming soon...</p>
      </div>

      {/* TODO: Monas collected grid */}
      <div className="monas-collected">
        <h3>Monas Found</h3>
        <div className="mona-grid">
          {player.cluesFound.map((clueId) => (
            <div key={clueId} className="mona-icon">
              🐙
            </div>
          ))}
        </div>
      </div>

      {/* TODO: Stats summary (time, hints used, best streak) */}

      <div className="results-actions">
        <button onClick={onPlayAgain} className="btn-primary">
          🔄 Play Again
        </button>
        <button onClick={onViewLeaderboard} className="btn-secondary">
          🏆 View Leaderboard
        </button>
      </div>
    </motion.div>
  );
}
