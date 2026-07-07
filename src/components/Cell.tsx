import { motion } from "motion/react";
import type { CellFeedback } from "@/game/feedback";

type CellState = "empty" | "filled" | CellFeedback;

interface CellProps {
  symbol?: string;
  state: CellState;
  index?: number;
  reveal?: boolean;
}

const stateStyles: Record<CellState, string> = {
  empty: "bg-card border-border text-foreground",
  filled: "bg-card border-primary/60 text-foreground",
  correct: "bg-correct border-correct text-correct-foreground",
  present: "bg-present border-present text-present-foreground",
  absent: "bg-absent border-absent text-absent-foreground",
};

function PatternOverlay({ state }: { state: CellState }) {
  if (state === "correct") {
    return (
      <svg
        aria-hidden
        className="absolute right-1.5 top-1.5 size-2.5 opacity-80"
        viewBox="0 0 10 10"
      >
        <circle cx="5" cy="5" r="4" fill="currentColor" />
      </svg>
    );
  }
  if (state === "present") {
    return (
      <svg
        aria-hidden
        className="absolute right-1.5 top-1.5 size-2.5 opacity-80"
        viewBox="0 0 10 10"
      >
        <path d="M5 1 A4 4 0 0 1 5 9 Z" fill="currentColor" />
      </svg>
    );
  }
  if (state === "absent") {
    return (
      <svg
        aria-hidden
        className="absolute right-1.5 top-1.5 size-2.5 opacity-70"
        viewBox="0 0 10 10"
      >
        <circle cx="5" cy="5" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    );
  }
  return null;
}

const stateLabels: Record<CellState, string> = {
  empty: "empty",
  filled: "pending",
  correct: "correct position",
  present: "wrong position",
  absent: "not in code",
};

export function Cell({ symbol, state, index = 0, reveal = false }: CellProps) {
  const isRevealed = state === "correct" || state === "present" || state === "absent";

  return (
    <motion.div
      initial={reveal && isRevealed ? { rotateX: 0 } : false}
      animate={reveal && isRevealed ? { rotateX: [0, 90, 0] } : {}}
      transition={{
        duration: 0.55,
        delay: index * 0.12,
        ease: "easeInOut",
      }}
      className={`relative flex aspect-square w-full items-center justify-center rounded-2xl border-2 font-display text-2xl font-bold uppercase shadow-tile transition-colors sm:text-3xl ${stateStyles[state]}`}
      role="gridcell"
      aria-label={symbol ? `${symbol}, ${stateLabels[state]}` : stateLabels[state]}
    >
      <PatternOverlay state={state} />
      <span>{symbol ?? ""}</span>
    </motion.div>
  );
}
