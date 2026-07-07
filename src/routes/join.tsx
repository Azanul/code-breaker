import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ConnectPanel } from "@/components/ConnectPanel";
import { getSession, startSession } from "@/game/session";
import { useConnectionState } from "@/game/useGame";

export const Route = createFileRoute("/join")({
  head: () => ({
    meta: [
      { title: "Join room — Codebreak Duo" },
      { name: "description", content: "Join a friend's Codebreak Duo room." },
    ],
  }),
  component: JoinPage,
});

function JoinPage() {
  const navigate = useNavigate();
  const [localBlob, setLocalBlob] = useState<string | null>(null);
  const [step, setStep] = useState<"generate" | "await-remote" | "accept-remote" | "connected">("accept-remote");
  const connectionState = useConnectionState();

  useEffect(() => {
    const existing = getSession();
    if (!existing || existing.role !== "guest") {
      startSession("guest");
    }
  }, []);

  useEffect(() => {
    if (connectionState === "connected") {
      setStep("connected");
      const t = setTimeout(() => navigate({ to: "/play" }), 600);
      return () => clearTimeout(t);
    }
  }, [connectionState, navigate]);

  const onGenerate = async () => {
    const s = getSession();
    if (!s) throw new Error("Session lost");
    const blob = await s.peer.awaitLocalDescription();
    setLocalBlob(blob);
  };

  const onAccept = async (blob: string) => {
    const s = getSession() ?? startSession("guest");
    await s.peer.acceptRemote(blob);
    // After accepting the offer, immediately generate our answer
    await onGenerate();
  };

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col gap-6 px-6 py-10">
      <Link to="/" className="text-sm font-semibold text-muted-foreground hover:text-foreground">
        ← Home
      </Link>
      <header>
        <h1 className="font-display text-3xl font-bold">Join a room</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Paste the invitation your friend sent, then send them the answer code that appears.
        </p>
      </header>
      <ConnectPanel
        role="guest"
        localBlob={localBlob}
        onGenerate={onGenerate}
        onAccept={onAccept}
        connectionState={connectionState}
        step={step}
      />
    </main>
  );
}
