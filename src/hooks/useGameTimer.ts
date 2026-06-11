import { useState, useCallback } from "react";
import { GameTimer } from "../utils/timer";

export function useGameTimer() {
  const [elapsed, setElapsed] = useState(0);
  const [timer] = useState(() => new GameTimer((ms) => setElapsed(ms)));

  const start = useCallback(() => timer.start(), [timer]);
  const stop = useCallback(() => timer.stop(), [timer]);
  const reset = useCallback(() => {
    timer.reset();
    setElapsed(0);
  }, [timer]);

  return {
    elapsed,
    formatted: timer.formatElapsed(elapsed),
    start,
    stop,
    reset,
    isRunning: elapsed > 0,
  };
}
