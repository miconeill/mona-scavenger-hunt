import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clue } from "../types";

interface ClueCardProps {
  clue: Clue;
  onAnswer: (answer: string) => void;
  onHint: () => void;
  hintsRevealed: number;
  elapsed?: string;
}

export function ClueCard({ clue, onAnswer, onHint, hintsRevealed, elapsed }: ClueCardProps) {
  const [input, setInput] = useState("");
  const [shake, setShake] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // BUG: Case-sensitive comparison means "readme.md" won't match "README.md"
    if (input === clue.answer) {
      setFeedback("🎉 Great catch!");
      onAnswer(input);
      setInput("");
      setTimeout(() => setFeedback(null), 1500);
    } else {
      setShake(true);
      setFeedback("Not quite... keep hunting! 🔍");
      setTimeout(() => {
        setShake(false);
        setFeedback(null);
      }, 1500);
    }
  };

  return (
    <motion.section
      className="clue-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, x: shake ? [-5, 5, -5, 5, 0] : 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      aria-label={`Clue: ${clue.title}`}
    >
      <div className="clue-header">
        <span className="clue-difficulty" data-level={clue.difficulty}>
          {clue.difficulty}
        </span>
        <h2>{clue.title}</h2>
        {elapsed && <span className="clue-timer" aria-label="Time elapsed">{elapsed}</span>}
      </div>

      <div className="clue-riddle">
        <p>{clue.riddle}</p>
      </div>

      <AnimatePresence>
        {clue.hints.slice(0, hintsRevealed).map((hint, i) => (
          <motion.div
            key={i}
            className="hint-bubble"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            role="note"
            aria-label={`Hint ${i + 1}`}
          >
            💡 {hint}
          </motion.div>
        ))}
      </AnimatePresence>

      {feedback && (
        <motion.p
          className="answer-feedback"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          aria-live="polite"
        >
          {feedback}
        </motion.p>
      )}

      <form onSubmit={handleSubmit} className="answer-form">
        <label htmlFor="answer-input" className="sr-only">
          Your answer
        </label>
        <input
          id="answer-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your answer..."
          aria-label="Answer input for the current clue"
          autoComplete="off"
        />
        <button type="submit" aria-label="Submit your answer">
          🔍 Submit
        </button>
      </form>

      {hintsRevealed < clue.hints.length && (
        <button
          onClick={onHint}
          className="hint-button"
          aria-label={`Reveal a hint. ${clue.hints.length - hintsRevealed} hints remaining. Costs 20 points.`}
        >
          Need a hint? ({clue.hints.length - hintsRevealed} remaining) · -20 pts
        </button>
      )}
    </motion.section>
  );
}
