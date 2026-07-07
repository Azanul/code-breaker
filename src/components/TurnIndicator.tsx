import { motion } from "motion/react";

interface TurnIndicatorProps {
  mine: boolean;
  myLabel?: string;
  opponentLabel?: string;
}

export function TurnIndicator({ mine, myLabel = "You", opponentLabel = "Opponent" }: TurnIndicatorProps) {
  return (
    <motion.div
      key={mine ? "mine" : "theirs"}
      initial={{ scale: 0.9, opacity: 0.5 }}
      animate={{ scale: [0.9, 1.05, 1], opacity: 1 }}
      transition={{ duration: 0.35 }}
      className={`inline-flex items-center gap-2 rounded-full border-2 px-4 py-1.5 font-display text-sm font-bold shadow-soft ${
        mine
          ? "border-turn bg-turn text-turn-foreground"
          : "border-border bg-card text-muted-foreground"
      }`}
      role="status"
      aria-live="polite"
    >
      <span className="size-2 animate-pulse rounded-full bg-current" />
      {mine ? `${myLabel} — your turn` : `Waiting on ${opponentLabel}`}
    </motion.div>
  );
}
