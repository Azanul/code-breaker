export type CellFeedback = "correct" | "present" | "absent";

/**
 * Wordle-style feedback with duplicate handling:
 * first mark all correct positions, then for remaining guess symbols,
 * mark present only up to remaining counts in the secret.
 */
export function computeFeedback(secret: string[], guess: string[]): CellFeedback[] {
  const n = secret.length;
  const result: CellFeedback[] = new Array(n).fill("absent");
  const remaining: Record<string, number> = {};

  for (let i = 0; i < n; i++) {
    if (guess[i] === secret[i]) {
      result[i] = "correct";
    } else {
      remaining[secret[i]] = (remaining[secret[i]] ?? 0) + 1;
    }
  }

  for (let i = 0; i < n; i++) {
    if (result[i] === "correct") continue;
    const g = guess[i];
    if ((remaining[g] ?? 0) > 0) {
      result[i] = "present";
      remaining[g] -= 1;
    }
  }

  return result;
}

export function isWin(feedback: CellFeedback[]): boolean {
  return feedback.length > 0 && feedback.every((f) => f === "correct");
}
