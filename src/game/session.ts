import * as Y from "yjs";
import { createDoc } from "./doc";
import { createPeer, type PeerHandle, type PeerRole } from "./peer";

/**
 * Module-level session store. The connection lives here so navigating between
 * /host, /join, and /play doesn't tear down the peer.
 */
export interface Session {
  role: PeerRole;
  doc: Y.Doc;
  peer: PeerHandle;
  // Local-only secret code for THIS player.
  secret: string[] | null;
}

let current: Session | null = null;
const listeners = new Set<() => void>();

export function getSession(): Session | null {
  return current;
}

export function startSession(role: PeerRole): Session {
  if (current) {
    current.peer.destroy();
  }
  const doc = createDoc();
  const peer = createPeer(role, doc);
  current = { role, doc, peer, secret: null };
  listeners.forEach((l) => l());
  return current;
}

export function endSession() {
  if (current) {
    current.peer.destroy();
    current = null;
    listeners.forEach((l) => l());
  }
}

export function setSecret(secret: string[]) {
  if (!current) return;
  current.secret = secret;
  listeners.forEach((l) => l());
}

export function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
