import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ConnectPanel } from "@/components/ConnectPanel";
import { getSession, startSession } from "@/game/session";
import { useConnectionState } from "@/game/useGame";

export const Route = createFileRoute("/host")({
  head: () => ({
    meta: [
      { title: "Create room — Codebreak Duo" },
      { name: "description", content: "Create a Codebreak Duo room and invite a friend." },
    ],
  }),
  component: HostPage,
});

function HostPage() {
  const navigate = useNavigate();
  const [localBlob, setLocalBlob] = useState<string | null>(null);
  const [step, setStep] = useState<"generate" | "await-remote" | "accept-remote" | "connected">("generate");
  const connectionState = useConnectionState();

  useEffect(() => {
    const existing = getSession();
    if (!existing || existing.role !== "host") {
      startSession("host");
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
    const s = getSession() ?? startSession("host");
    const blob = await s.peer.awaitLocalDescription();
    setLocalBlob(blob);
    setStep("await-remote");
  };

  const onAccept = async (blob: string) => {
    const s = getSession();
    if (!s) throw new Error("Session lost");
    await s.peer.acceptRemote(blob);
  };

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col gap-6 px-6 py-10">
      <Link to="/" className="text-sm font-semibold text-muted-foreground hover:text-foreground">
        ← Home
      </Link>
      <header>
        <h1 className="font-display text-3xl font-bold">Create a room</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          You're the host. Generate an invitation, send it to your friend, then paste their reply.
        </p>
      </header>
      <ConnectPanel
        role="host"
        localBlob={localBlob}
        onGenerate={onGenerate}
        onAccept={onAccept}
        connectionState={connectionState}
        step={step}
      />
    </main>
  );
}
