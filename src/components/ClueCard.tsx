import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clue } from "../types";

interface ClueCardProps {
  clue: Clue;
  onAnswer: (answer: string) => void;
  onHint: () => void;
  hintsRevealed: number;
}

export function ClueCard({ clue, onAnswer, onHint, hintsRevealed }: ClueCardProps) {
  const [input, setInput] = useState("");
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedInput = input.trim().toLowerCase();
    const normalizedAnswer = clue.answer.trim().toLowerCase();

    if (normalizedInput === normalizedAnswer) {
      onAnswer(input);
      setInput("");
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <motion.div
      className="clue-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, x: shake ? [-5, 5, -5, 5, 0] : 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <div className="clue-header">
        <span className="clue-difficulty" data-level={clue.difficulty}>
          {clue.difficulty}
        </span>
        <h2>{clue.title}</h2>
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
          >
            💡 {hint}
          </motion.div>
        ))}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="answer-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your answer..."
          aria-label="Answer input"
        />
        <button type="submit">
          🔍 Submit
        </button>
      </form>

      {hintsRevealed < clue.hints.length && (
        <button onClick={onHint} className="hint-button">
          Need a hint? ({clue.hints.length - hintsRevealed} remaining)
        </button>
      )}
    </motion.div>
  );
}
