import { motion } from "motion/react";
import type { CellFeedback } from "@/game/feedback";
import type { GuessRecord } from "@/game/types";

interface KeypadProps {
  symbols: string[];
  onInput: (symbol: string) => void;
  onDelete: () => void;
  onSubmit: () => void;
  disabled?: boolean;
  submitLabel?: string;
  guesses?: GuessRecord[]; // used to derive per-symbol best status for coloring
}

function statusFor(symbol: string, guesses: GuessRecord[]): CellFeedback | null {
  let best: CellFeedback | null = null;
  for (const g of guesses) {
    for (let i = 0; i < g.symbols.length; i++) {
      if (g.symbols[i] === symbol) {
        const f = g.feedback[i];
        if (f === "correct") return "correct";
        if (f === "present") best = "present";
        else if (best === null) best = "absent";
      }
    }
  }
  return best;
}

const keyTone: Record<CellFeedback, string> = {
  correct: "bg-correct text-correct-foreground border-correct",
  present: "bg-present text-present-foreground border-present",
  absent: "bg-absent text-absent-foreground border-absent",
};

export function Keypad({
  symbols,
  onInput,
  onDelete,
  onSubmit,
  disabled = false,
  submitLabel = "Guess",
  guesses = [],
}: KeypadProps) {
  const cols = symbols.length > 16 ? 7 : symbols.length > 10 ? 6 : 5;

  return (
    <div className={`mx-auto flex w-full max-w-md flex-col gap-2 ${disabled ? "pointer-events-none opacity-60" : ""}`}>
      <div
        className="grid gap-1.5"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {symbols.map((s) => {
          const st = statusFor(s, guesses);
          const tone = st ? keyTone[st] : "bg-card text-foreground border-border hover:border-primary/60";
          return (
            <motion.button
              key={s}
              whileTap={{ scale: 0.92 }}
              type="button"
              onClick={() => onInput(s)}
              disabled={disabled}
              className={`h-10 rounded-xl border-2 font-display text-base font-bold shadow-tile-press transition-colors ${tone}`}
              aria-label={`Enter ${s}`}
            >
              {s}
            </motion.button>
          );
        })}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <motion.button
          whileTap={{ scale: 0.96 }}
          type="button"
          onClick={onDelete}
          disabled={disabled}
          className="h-11 rounded-xl border-2 border-border bg-card font-sans text-sm font-bold uppercase tracking-wide text-foreground shadow-tile-press hover:border-primary/60"
        >
          Delete
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.96 }}
          type="button"
          onClick={onSubmit}
          disabled={disabled}
          className="h-11 rounded-xl border-2 border-primary bg-primary font-sans text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-tile hover:brightness-110"
        >
          {submitLabel}
        </motion.button>
      </div>
    </div>
  );
}
