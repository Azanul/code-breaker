import { Cell } from "./Cell";
import type { GuessRecord } from "@/game/types";
import type { CodeLength } from "@/game/symbols";

interface GuessGridProps {
  guesses: GuessRecord[];
  draft?: string[];
  codeLength: CodeLength;
  visibleRows?: number;
  showDraft?: boolean;
}

export function GuessGrid({
  guesses,
  draft = [],
  codeLength,
  visibleRows = 8,
  showDraft = false,
}: GuessGridProps) {
  const rows = Math.max(visibleRows, guesses.length + (showDraft ? 1 : 0));

  return (
    <div
      className="mx-auto grid gap-1.5"
      style={{ gridTemplateColumns: `repeat(${codeLength}, minmax(0, 1fr))`, maxWidth: `${codeLength * 4.5}rem` }}
      role="grid"
      aria-label="Guess history"
    >
      {Array.from({ length: rows }).map((_, rowIdx) => {
        const guess = guesses[rowIdx];
        const isDraftRow = showDraft && rowIdx === guesses.length;
        return Array.from({ length: codeLength }).map((_, colIdx) => {
          const key = `${rowIdx}-${colIdx}`;
          if (guess) {
            return (
              <Cell
                key={key}
                symbol={guess.symbols[colIdx]}
                state={guess.feedback[colIdx]}
                index={colIdx}
                reveal={rowIdx === guesses.length - 1}
              />
            );
          }
          if (isDraftRow) {
            const ch = draft[colIdx];
            return (
              <Cell key={key} symbol={ch} state={ch ? "filled" : "empty"} />
            );
          }
          return <Cell key={key} state="empty" />;
        });
      })}
    </div>
  );
}
