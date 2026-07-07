import { useEffect, useState } from "react";

interface ConnectPanelProps {
  role: "host" | "guest";
  localBlob: string | null;
  onGenerate: () => Promise<void>;
  onAccept: (blob: string) => Promise<void>;
  connectionState: RTCPeerConnectionState;
  step: "generate" | "await-remote" | "accept-remote" | "connected";
}

export function ConnectPanel(props: ConnectPanelProps) {
  const { role, localBlob, onGenerate, onAccept, connectionState, step } = props;
  const [remote, setRemote] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    if (!localBlob) return;
    await navigator.clipboard.writeText(localBlob);
    setCopied(true);
  };

  const hostLabel = role === "host" ? "invitation code" : "answer code";
  const remoteLabel = role === "host" ? "answer code" : "invitation code";

  return (
    <div className="flex flex-col gap-6">
      {/* Step 1 / 2: Local blob generation */}
      <section className="rounded-3xl border-2 border-border bg-card p-5 shadow-soft">
        <header className="mb-3 flex items-baseline justify-between">
          <h2 className="font-display text-lg font-bold">
            {role === "host" ? "1. Share your invitation" : "2. Send back your answer"}
          </h2>
          {localBlob && (
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              ready
            </span>
          )}
        </header>
        {!localBlob ? (
          <button
            type="button"
            onClick={async () => {
              setBusy(true);
              setError(null);
              try {
                await onGenerate();
              } catch (e) {
                setError(e instanceof Error ? e.message : "Failed to generate");
              } finally {
                setBusy(false);
              }
            }}
            disabled={busy || (role === "guest" && step === "generate")}
            className="h-11 w-full rounded-xl border-2 border-primary bg-primary font-sans text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-tile hover:brightness-110 disabled:opacity-60"
          >
            {busy
              ? "Preparing…"
              : role === "host"
                ? "Generate invitation"
                : "Paste invitation below first"}
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            <textarea
              readOnly
              value={localBlob}
              onFocus={(e) => e.currentTarget.select()}
              rows={4}
              className="w-full rounded-xl border-2 border-border bg-background/60 p-3 font-mono text-xs text-foreground"
              aria-label={`Your ${hostLabel}`}
            />
            <button
              type="button"
              onClick={copy}
              className="h-10 rounded-xl border-2 border-primary bg-primary text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-tile-press hover:brightness-110"
            >
              {copied ? "Copied!" : `Copy ${hostLabel}`}
            </button>
          </div>
        )}
      </section>

      {/* Step: Accept remote */}
      {step !== "connected" && (
        <section className="rounded-3xl border-2 border-border bg-card p-5 shadow-soft">
          <header className="mb-3">
            <h2 className="font-display text-lg font-bold">
              {role === "host" ? "2. Paste the answer from your friend" : "1. Paste the invitation from your friend"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Ask them to send you their {remoteLabel}, then paste it here.
            </p>
          </header>
          <textarea
            value={remote}
            onChange={(e) => setRemote(e.target.value)}
            rows={4}
            placeholder={`Paste ${remoteLabel} here…`}
            className="w-full rounded-xl border-2 border-border bg-background/60 p-3 font-mono text-xs text-foreground focus:border-primary focus:outline-none"
            aria-label={`Their ${remoteLabel}`}
          />
          <button
            type="button"
            onClick={async () => {
              setBusy(true);
              setError(null);
              try {
                await onAccept(remote.trim());
              } catch (e) {
                setError(e instanceof Error ? e.message : "Invalid code");
              } finally {
                setBusy(false);
              }
            }}
            disabled={busy || !remote.trim()}
            className="mt-2 h-11 w-full rounded-xl border-2 border-foreground bg-foreground font-sans text-sm font-bold uppercase tracking-wide text-background shadow-tile hover:opacity-90 disabled:opacity-60"
          >
            {busy ? "Connecting…" : `Accept ${remoteLabel}`}
          </button>
          {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
        </section>
      )}

      <div className="text-center text-xs text-muted-foreground">
        Connection: <span className="font-semibold text-foreground">{connectionState}</span>
      </div>
    </div>
  );
}
