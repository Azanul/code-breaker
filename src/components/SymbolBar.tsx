import type { CellFeedback } from "@/game/feedback";
import type { GuessRecord } from "@/game/types";

interface SymbolBarProps {
  symbols: string[];
  guesses: GuessRecord[];
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

const tone: Record<string, string> = {
  correct: "bg-correct text-correct-foreground border-correct",
  present: "bg-present text-present-foreground border-present",
  absent: "bg-absent text-absent-foreground border-absent line-through opacity-70",
  unknown: "bg-card text-foreground border-border",
};

export function SymbolBar({ symbols, guesses }: SymbolBarProps) {
  return (
    <div
      className="flex flex-wrap justify-center gap-1"
      aria-label="Symbol deductions"
    >
      {symbols.map((s) => {
        const st = statusFor(s, guesses) ?? "unknown";
        return (
          <span
            key={s}
            className={`inline-flex size-7 items-center justify-center rounded-lg border-2 font-display text-xs font-bold ${tone[st]}`}
            title={st}
          >
            {s}
          </span>
        );
      })}
    </div>
  );
}
