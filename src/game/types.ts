import type { CellFeedback } from "./feedback";
import type { CodeLength, SymbolSetId } from "./symbols";

export type PlayerId = "host" | "guest";

export interface MatchConfig {
  codeLength: CodeLength;
  symbolSet: SymbolSetId;
}

export interface GuessRecord {
  symbols: string[];
  feedback: CellFeedback[];
}

export type Phase = "setup" | "secret" | "match" | "result";

export interface GameSnapshot {
  phase: Phase;
  config: MatchConfig | null;
  turn: PlayerId;
  hostCommitted: boolean;
  guestCommitted: boolean;
  hostGuesses: GuessRecord[];
  guestGuesses: GuessRecord[];
  winner: PlayerId | null;
  hostSecretRevealed: string[] | null;
  guestSecretRevealed: string[] | null;
}

export const DEFAULT_CONFIG: MatchConfig = {
  codeLength: 4,
  symbolSet: "decimal",
};
