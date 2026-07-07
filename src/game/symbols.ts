export type SymbolSetId = "decimal" | "hex" | "alnum" | "alpha";

export interface SymbolSet {
  id: SymbolSetId;
  label: string;
  hint: string;
  symbols: string[];
}

const DIGITS = "0123456789".split("");
const HEX = "0123456789ABCDEF".split("");
const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const ALNUM = [...DIGITS, ...ALPHA];

export const SYMBOL_SETS: Record<SymbolSetId, SymbolSet> = {
  decimal: { id: "decimal", label: "Decimal", hint: "0–9", symbols: DIGITS },
  hex: { id: "hex", label: "Hex", hint: "0–9, A–F", symbols: HEX },
  alnum: { id: "alnum", label: "Letters & Numbers", hint: "0–9, A–Z", symbols: ALNUM },
  alpha: { id: "alpha", label: "All Letters", hint: "A–Z", symbols: ALPHA },
};

export const CODE_LENGTHS = [4, 5, 6] as const;
export type CodeLength = (typeof CODE_LENGTHS)[number];

export function normalizeInput(ch: string, setId: SymbolSetId): string | null {
  const upper = ch.toUpperCase();
  return SYMBOL_SETS[setId].symbols.includes(upper) ? upper : null;
}
