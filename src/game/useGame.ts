import { useSyncExternalStore } from "react";
import { snapshot } from "./doc";
import { getSession, subscribe } from "./session";
import type { GameSnapshot } from "./types";

const EMPTY: GameSnapshot = {
  phase: "setup",
  config: null,
  turn: "host",
  hostCommitted: false,
  guestCommitted: false,
  hostGuesses: [],
  guestGuesses: [],
  winner: null,
  hostSecretRevealed: null,
  guestSecretRevealed: null,
};

export function useSession() {
  return useSyncExternalStore(
    subscribe,
    () => getSession(),
    () => null,
  );
}

const cache = new WeakMap<object, { version: number; value: GameSnapshot }>();
let globalVersion = 0;

export function useGameSnapshot(): GameSnapshot {
  const session = useSession();

  return useSyncExternalStore(
    (cb) => {
      if (!session) return () => {};
      const handler = () => {
        globalVersion += 1;
        cb();
      };
      session.doc.on("update", handler);
      return () => session.doc.off("update", handler);
    },
    () => {
      if (!session) return EMPTY;
      const cached = cache.get(session.doc);
      if (cached && cached.version === globalVersion) return cached.value;
      const value = snapshot(session.doc);
      cache.set(session.doc, { version: globalVersion, value });
      return value;
    },
    () => EMPTY,
  );
}

export function useConnectionState() {
  const session = useSession();
  return useSyncExternalStore(
    (cb) => {
      if (!session) return () => {};
      return session.peer.onConnectionChange(() => cb());
    },
    () => session?.peer.pc.connectionState ?? "new",
    () => "new" as RTCPeerConnectionState,
  );
}
