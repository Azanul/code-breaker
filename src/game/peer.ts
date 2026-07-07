import * as Y from "yjs";

/**
 * Manual copy-paste WebRTC signaling.
 * Host: create() -> awaitLocalDescription() -> exchange -> acceptRemote(answer)
 * Guest: acceptRemote(offer) -> awaitLocalDescription() (creates answer) -> exchange
 * A data channel named "yjs" carries Yjs update messages.
 */

export type PeerRole = "host" | "guest";

export interface PeerHandle {
  pc: RTCPeerConnection;
  role: PeerRole;
  doc: Y.Doc;
  destroy: () => void;
  ready: Promise<void>;
  onConnectionChange: (cb: (state: RTCPeerConnectionState) => void) => () => void;
  awaitLocalDescription: () => Promise<string>;
  acceptRemote: (blob: string) => Promise<void>;
}

const RTC_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

function encodeBlob(sdp: RTCSessionDescriptionInit): string {
  const json = JSON.stringify(sdp);
  return btoa(unescape(encodeURIComponent(json)));
}

function decodeBlob(blob: string): RTCSessionDescriptionInit {
  const json = decodeURIComponent(escape(atob(blob.trim())));
  return JSON.parse(json);
}

export function createPeer(role: PeerRole, doc: Y.Doc): PeerHandle {
  const pc = new RTCPeerConnection(RTC_CONFIG);
  let channel: RTCDataChannel | null = null;
  const connectionListeners = new Set<(s: RTCPeerConnectionState) => void>();
  let readyResolve!: () => void;
  const ready = new Promise<void>((r) => (readyResolve = r));

  const wireChannel = (ch: RTCDataChannel) => {
    channel = ch;
    ch.binaryType = "arraybuffer";
    ch.onopen = () => {
      // Kick sync with our current state
      const state = Y.encodeStateAsUpdate(doc);
      ch.send(state.buffer.slice(state.byteOffset, state.byteOffset + state.byteLength) as ArrayBuffer);
      readyResolve();
    };
    ch.onmessage = (ev) => {
      const data = ev.data as ArrayBuffer | string;
      if (typeof data === "string") return;
      try {
        Y.applyUpdate(doc, new Uint8Array(data), "peer");
      } catch (e) {
        console.error("apply update failed", e);
      }
    };
  };

  if (role === "host") {
    const ch = pc.createDataChannel("yjs");
    wireChannel(ch);
  } else {
    pc.ondatachannel = (ev) => wireChannel(ev.channel);
  }

  const docHandler = (update: Uint8Array, origin: unknown) => {
    if (origin === "peer") return;
    if (channel && channel.readyState === "open") {
      channel.send(update.buffer.slice(update.byteOffset, update.byteOffset + update.byteLength) as ArrayBuffer);
    }
  };
  doc.on("update", docHandler);

  pc.onconnectionstatechange = () => {
    connectionListeners.forEach((cb) => cb(pc.connectionState));
  };

  const awaitLocalDescription = async () => {
    if (role === "host") {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
    }
    // Wait for ICE gathering to complete (trickle:false equivalent)
    await new Promise<void>((resolve) => {
      if (pc.iceGatheringState === "complete") return resolve();
      const check = () => {
        if (pc.iceGatheringState === "complete") {
          pc.removeEventListener("icegatheringstatechange", check);
          resolve();
        }
      };
      pc.addEventListener("icegatheringstatechange", check);
      // safety timeout
      setTimeout(() => resolve(), 4000);
    });
    if (!pc.localDescription) throw new Error("no local description");
    return encodeBlob(pc.localDescription.toJSON());
  };

  const acceptRemote = async (blob: string) => {
    const desc = decodeBlob(blob);
    await pc.setRemoteDescription(desc);
    if (role === "guest") {
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
    }
  };

  return {
    pc,
    role,
    doc,
    ready,
    awaitLocalDescription,
    acceptRemote,
    onConnectionChange: (cb) => {
      connectionListeners.add(cb);
      return () => connectionListeners.delete(cb);
    },
    destroy: () => {
      doc.off("update", docHandler);
      try {
        channel?.close();
      } catch {}
      try {
        pc.close();
      } catch {}
    },
  };
}
