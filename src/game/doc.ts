import * as Y from "yjs";
import type { GameSnapshot, GuessRecord, MatchConfig, Phase, PlayerId } from "./types";
import { DEFAULT_CONFIG } from "./types";

/**
 * Shared Yjs doc structure:
 * - meta (Y.Map): phase, turn, winner, config, hostCommitted, guestCommitted,
 *                 hostSecretRevealed, guestSecretRevealed
 * - hostGuesses (Y.Array<Y.Map>): { symbols: string[], feedback: string[] }
 * - guestGuesses (Y.Array<Y.Map>): same
 */

export function createDoc(): Y.Doc {
  const doc = new Y.Doc();
  const meta = doc.getMap("meta");
  if (!meta.has("phase")) {
    doc.transact(() => {
      meta.set("phase", "setup" as Phase);
      meta.set("turn", "host" as PlayerId);
      meta.set("winner", null);
      meta.set("config", DEFAULT_CONFIG);
      meta.set("hostCommitted", false);
      meta.set("guestCommitted", false);
      meta.set("hostSecretRevealed", null);
      meta.set("guestSecretRevealed", null);
    });
  }
  doc.getArray("hostGuesses");
  doc.getArray("guestGuesses");
  return doc;
}

function readGuesses(arr: Y.Array<Y.Map<unknown>>): GuessRecord[] {
  const out: GuessRecord[] = [];
  arr.forEach((m) => {
    out.push({
      symbols: (m.get("symbols") as string[]) ?? [],
      feedback: (m.get("feedback") as GuessRecord["feedback"]) ?? [],
    });
  });
  return out;
}

export function snapshot(doc: Y.Doc): GameSnapshot {
  const meta = doc.getMap("meta");
  return {
    phase: (meta.get("phase") as Phase) ?? "setup",
    config: (meta.get("config") as MatchConfig) ?? null,
    turn: (meta.get("turn") as PlayerId) ?? "host",
    hostCommitted: (meta.get("hostCommitted") as boolean) ?? false,
    guestCommitted: (meta.get("guestCommitted") as boolean) ?? false,
    winner: (meta.get("winner") as PlayerId | null) ?? null,
    hostGuesses: readGuesses(doc.getArray("hostGuesses")),
    guestGuesses: readGuesses(doc.getArray("guestGuesses")),
    hostSecretRevealed: (meta.get("hostSecretRevealed") as string[] | null) ?? null,
    guestSecretRevealed: (meta.get("guestSecretRevealed") as string[] | null) ?? null,
  };
}

export function setConfig(doc: Y.Doc, config: MatchConfig) {
  doc.getMap("meta").set("config", config);
}

export function setPhase(doc: Y.Doc, phase: Phase) {
  doc.getMap("meta").set("phase", phase);
}

export function setCommitted(doc: Y.Doc, who: PlayerId, value: boolean) {
  doc.getMap("meta").set(who === "host" ? "hostCommitted" : "guestCommitted", value);
}

export function setTurn(doc: Y.Doc, turn: PlayerId) {
  doc.getMap("meta").set("turn", turn);
}

/**
 * Called by the code owner after opponent guesses their code.
 * We store the guess (with feedback computed locally by the owner) in the
 * *guesser's* guesses array so both players see it.
 */
export function appendGuess(doc: Y.Doc, guesser: PlayerId, record: GuessRecord) {
  const arr = doc.getArray<Y.Map<unknown>>(
    guesser === "host" ? "hostGuesses" : "guestGuesses",
  );
  const m = new Y.Map<unknown>();
  m.set("symbols", record.symbols);
  m.set("feedback", record.feedback);
  arr.push([m]);
}

export function declareWinner(doc: Y.Doc, winner: PlayerId, revealedSecrets: {
  host: string[] | null;
  guest: string[] | null;
}) {
  const meta = doc.getMap("meta");
  doc.transact(() => {
    meta.set("winner", winner);
    meta.set("phase", "result" as Phase);
    if (revealedSecrets.host) meta.set("hostSecretRevealed", revealedSecrets.host);
    if (revealedSecrets.guest) meta.set("guestSecretRevealed", revealedSecrets.guest);
  });
}

export function resetForRematch(doc: Y.Doc) {
  const meta = doc.getMap("meta");
  doc.transact(() => {
    meta.set("phase", "setup" as Phase);
    meta.set("turn", "host" as PlayerId);
    meta.set("winner", null);
    meta.set("hostCommitted", false);
    meta.set("guestCommitted", false);
    meta.set("hostSecretRevealed", null);
    meta.set("guestSecretRevealed", null);
    doc.getArray("hostGuesses").delete(0, doc.getArray("hostGuesses").length);
    doc.getArray("guestGuesses").delete(0, doc.getArray("guestGuesses").length);
  });
}
