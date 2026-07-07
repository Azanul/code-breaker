import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { GuessGrid } from "@/components/GuessGrid";
import { Keypad } from "@/components/Keypad";
import { SymbolBar } from "@/components/SymbolBar";
import { TurnIndicator } from "@/components/TurnIndicator";
import {
  appendGuess,
  declareWinner,
  resetForRematch,
  setCommitted,
  setConfig,
  setPhase,
  setTurn,
} from "@/game/doc";
import { computeFeedback, isWin } from "@/game/feedback";
import { setSecret } from "@/game/session";
import { CODE_LENGTHS, SYMBOL_SETS, type CodeLength, type SymbolSetId } from "@/game/symbols";
import type { PlayerId } from "@/game/types";
import { useGameSnapshot, useSession } from "@/game/useGame";

export const Route = createFileRoute("/play")({
  head: () => ({
    meta: [
      { title: "Playing — Codebreak Duo" },
      { name: "description", content: "Guess your friend's secret code." },
    ],
  }),
  component: PlayPage,
});

function PlayPage() {
  const navigate = useNavigate();
  const session = useSession();
  const snap = useGameSnapshot();

  useEffect(() => {
    if (!session) navigate({ to: "/" });
  }, [session, navigate]);

  if (!session || !snap.config) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col items-center justify-center gap-4 px-6 py-10">
        <p className="text-muted-foreground">Connecting…</p>
        <Link to="/" className="text-sm font-semibold underline">Cancel</Link>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold sm:text-2xl">Codebreak Duo</h1>
          <p className="text-xs text-muted-foreground">
            You are the <span className="font-semibold text-foreground">{session.role}</span>
          </p>
        </div>
        <Link to="/" className="text-xs font-semibold text-muted-foreground hover:text-foreground">
          Leave
        </Link>
      </header>
      {snap.phase === "setup" && <PhaseSetup />}
      {snap.phase === "secret" && <PhaseSecret />}
      {snap.phase === "match" && <PhaseMatch />}
      {snap.phase === "result" && <PhaseResult />}
    </main>
  );
}

/* ---------------- Setup ---------------- */

function PhaseSetup() {
  const session = useSession()!;
  const snap = useGameSnapshot();
  const cfg = snap.config!;
  const isHost = session.role === "host";

  return (
    <section className="mx-auto flex w-full max-w-lg flex-col gap-5 rounded-3xl border-2 border-border bg-card p-6 shadow-soft">
      <header>
        <h2 className="font-display text-2xl font-bold">Match setup</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {isHost ? "You're the host — choose the rules." : "Waiting for your friend to set the rules…"}
        </p>
      </header>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Code length
        </label>
        <div className="grid grid-cols-3 gap-2">
          {CODE_LENGTHS.map((n) => (
            <button
              key={n}
              type="button"
              disabled={!isHost}
              onClick={() => setConfig(session.doc, { ...cfg, codeLength: n })}
              className={`h-12 rounded-xl border-2 font-display text-lg font-bold shadow-tile-press transition ${
                cfg.codeLength === n
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground hover:border-primary/50"
              } disabled:opacity-60`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Allowed symbols
        </label>
        <div className="grid grid-cols-2 gap-2">
          {Object.values(SYMBOL_SETS).map((s) => (
            <button
              key={s.id}
              type="button"
              disabled={!isHost}
              onClick={() => setConfig(session.doc, { ...cfg, symbolSet: s.id })}
              className={`flex flex-col items-start gap-0.5 rounded-xl border-2 p-3 text-left transition ${
                cfg.symbolSet === s.id
                  ? "border-primary bg-primary/10"
                  : "border-border bg-background hover:border-primary/50"
              } disabled:opacity-60`}
            >
              <span className="font-display text-sm font-bold">{s.label}</span>
              <span className="text-xs text-muted-foreground">{s.hint}</span>
            </button>
          ))}
        </div>
      </div>

      {isHost ? (
        <button
          type="button"
          onClick={() => setPhase(session.doc, "secret")}
          className="mt-2 h-12 rounded-xl border-2 border-primary bg-primary font-sans text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-tile hover:brightness-110"
        >
          Lock in and pick codes
        </button>
      ) : (
        <div className="mt-2 rounded-xl border border-dashed border-border p-3 text-center text-xs text-muted-foreground">
          Rules will lock in when the host is ready.
        </div>
      )}
    </section>
  );
}

/* ---------------- Secret pick ---------------- */

function PhaseSecret() {
  const session = useSession()!;
  const snap = useGameSnapshot();
  const cfg = snap.config!;
  const set = SYMBOL_SETS[cfg.symbolSet];
  const [draft, setDraft] = useState<string[]>([]);
  const myKey: PlayerId = session.role;
  const myCommitted = myKey === "host" ? snap.hostCommitted : snap.guestCommitted;
  const theirCommitted = myKey === "host" ? snap.guestCommitted : snap.hostCommitted;

  useEffect(() => {
    if (myCommitted && theirCommitted && snap.phase === "secret") {
      // Both committed — host advances to match
      if (session.role === "host") {
        setPhase(session.doc, "match");
        setTurn(session.doc, "host");
      }
    }
  }, [myCommitted, theirCommitted, snap.phase, session]);

  const onInput = (s: string) => {
    if (draft.length >= cfg.codeLength) return;
    setDraft([...draft, s]);
  };
  const onDelete = () => setDraft(draft.slice(0, -1));
  const onSubmit = () => {
    if (draft.length !== cfg.codeLength || myCommitted) return;
    setSecret(draft);
    setCommitted(session.doc, myKey, true);
  };

  return (
    <section className="mx-auto flex w-full max-w-lg flex-col gap-5 rounded-3xl border-2 border-border bg-card p-6 shadow-soft">
      <header>
        <h2 className="font-display text-2xl font-bold">Pick your secret code</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Keep it hidden! Your friend will try to guess it. {cfg.codeLength} symbols from {set.label}.
        </p>
      </header>

      <div
        className="mx-auto grid gap-1.5"
        style={{ gridTemplateColumns: `repeat(${cfg.codeLength}, minmax(0, 1fr))`, maxWidth: `${cfg.codeLength * 4.5}rem` }}
      >
        {Array.from({ length: cfg.codeLength }).map((_, i) => {
          const ch = draft[i];
          return (
            <div
              key={i}
              className={`flex aspect-square items-center justify-center rounded-2xl border-2 font-display text-2xl font-bold shadow-tile ${
                ch ? "border-primary bg-card" : "border-border bg-card text-muted-foreground"
              }`}
            >
              {myCommitted ? "•" : (ch ?? "")}
            </div>
          );
        })}
      </div>

      {!myCommitted && (
        <Keypad
          symbols={set.symbols}
          onInput={onInput}
          onDelete={onDelete}
          onSubmit={onSubmit}
          submitLabel={draft.length === cfg.codeLength ? "Lock in" : `${draft.length}/${cfg.codeLength}`}
          disabled={false}
        />
      )}

      <div className="grid grid-cols-2 gap-3 text-center text-xs">
        <StatusPill label="You" done={myCommitted} />
        <StatusPill label="Friend" done={theirCommitted} />
      </div>
    </section>
  );
}

function StatusPill({ label, done }: { label: string; done: boolean }) {
  return (
    <div
      className={`rounded-xl border-2 p-2 font-semibold ${
        done ? "border-correct bg-correct/10 text-correct" : "border-border bg-background text-muted-foreground"
      }`}
    >
      <div className="font-display text-sm">{label}</div>
      <div className="text-xs">{done ? "Ready ✓" : "Choosing…"}</div>
    </div>
  );
}

/* ---------------- Match ---------------- */

function PhaseMatch() {
  const session = useSession()!;
  const snap = useGameSnapshot();
  const cfg = snap.config!;
  const set = SYMBOL_SETS[cfg.symbolSet];
  const me: PlayerId = session.role;
  const opp: PlayerId = me === "host" ? "guest" : "host";
  const isMyTurn = snap.turn === me;

  // MY guesses target OPPONENT's code (feedback in oppSecret owner's view).
  const myGuesses = me === "host" ? snap.hostGuesses : snap.guestGuesses;
  const oppGuesses = opp === "host" ? snap.hostGuesses : snap.guestGuesses;

  const [draft, setDraft] = useState<string[]>([]);

  // Owner-side effect: when opponent submits a guess against MY code, I compute the feedback.
  // Since guesses are appended locally by the guesser (who doesn't know the answer),
  // we instead handle submission here: the guesser sends the raw symbols via an intent map,
  // and the owner picks it up. Simpler approach: guesser can't compute, so we route through
  // a "pending" cell: when it's opponent's turn and they submit, they place symbols with
  // empty feedback; we, the owner, detect it and fill in feedback.
  useEffect(() => {
    // Look at opponent's guesses; if the last one has no feedback, fill it in against MY secret.
    if (!session.secret) return;
    const last = oppGuesses[oppGuesses.length - 1];
    if (!last || last.feedback.length === last.symbols.length) return;
    // Compute feedback and replace last entry
    const feedback = computeFeedback(session.secret, last.symbols);
    const arr = session.doc.getArray<import("yjs").Map<unknown>>(
      opp === "host" ? "hostGuesses" : "guestGuesses",
    );
    session.doc.transact(() => {
      const idx = arr.length - 1;
      const m = arr.get(idx);
      m.set("feedback", feedback);
      // If opponent won, declare it
      if (isWin(feedback)) {
        declareWinner(session.doc, opp, {
          host: me === "host" ? session.secret : null,
          guest: me === "guest" ? session.secret : null,
        });
      } else {
        // Hand turn to me
        setTurn(session.doc, me);
      }
    });
  }, [oppGuesses, session, me, opp]);

  const onInput = (s: string) => {
    if (!isMyTurn) return;
    if (draft.length >= cfg.codeLength) return;
    setDraft([...draft, s]);
  };
  const onDelete = () => {
    if (!isMyTurn) return;
    setDraft(draft.slice(0, -1));
  };
  const onSubmit = () => {
    if (!isMyTurn || draft.length !== cfg.codeLength) return;
    // Append guess without feedback; owner will fill in.
    appendGuess(session.doc, me, { symbols: draft, feedback: [] });
    setDraft([]);
    // Optimistically hand turn to opponent (owner will confirm or override on win)
    setTurn(session.doc, opp);
  };

  // Keyboard input
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!isMyTurn) return;
      if (e.key === "Enter") {
        e.preventDefault();
        onSubmit();
        return;
      }
      if (e.key === "Backspace") {
        e.preventDefault();
        onDelete();
        return;
      }
      const ch = e.key.toUpperCase();
      if (set.symbols.includes(ch)) {
        e.preventDefault();
        onInput(ch);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  const opponentDraftHidden = !isMyTurn;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-center">
        <TurnIndicator mine={isMyTurn} myLabel="You" opponentLabel="friend" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <PlayerPanel
          title="Your guesses"
          subtitle="cracking their code"
          guesses={myGuesses.filter((g) => g.feedback.length > 0)}
          pendingCount={myGuesses.filter((g) => g.feedback.length === 0).length}
          draft={isMyTurn ? draft : []}
          codeLength={cfg.codeLength}
          showDraft={isMyTurn}
          symbols={set.symbols}
          mine
        />
        <PlayerPanel
          title="Their guesses"
          subtitle="cracking your code"
          guesses={oppGuesses}
          pendingCount={0}
          draft={[]}
          codeLength={cfg.codeLength}
          showDraft={false}
          symbols={set.symbols}
          mine={false}
        />
      </div>

      <div className="mx-auto w-full max-w-md">
        <Keypad
          symbols={set.symbols}
          onInput={onInput}
          onDelete={onDelete}
          onSubmit={onSubmit}
          disabled={!isMyTurn || opponentDraftHidden === false && false}
          submitLabel={draft.length === cfg.codeLength ? "Guess" : `${draft.length}/${cfg.codeLength}`}
          guesses={myGuesses.filter((g) => g.feedback.length > 0)}
        />
        {!isMyTurn && (
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Hang tight — it's your friend's turn.
          </p>
        )}
      </div>
    </div>
  );
}

function PlayerPanel({
  title,
  subtitle,
  guesses,
  pendingCount,
  draft,
  codeLength,
  showDraft,
  symbols,
  mine,
}: {
  title: string;
  subtitle: string;
  guesses: import("@/game/types").GuessRecord[];
  pendingCount: number;
  draft: string[];
  codeLength: CodeLength;
  showDraft: boolean;
  symbols: string[];
  mine: boolean;
}) {
  return (
    <section
      className={`flex flex-col gap-4 rounded-3xl border-2 p-4 shadow-soft sm:p-5 ${
        mine ? "border-turn/60 bg-card" : "border-border bg-card/70"
      }`}
    >
      <header className="flex items-baseline justify-between">
        <div>
          <h3 className="font-display text-lg font-bold">{title}</h3>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <span className="text-xs font-semibold text-muted-foreground">
          {guesses.length + pendingCount} {guesses.length + pendingCount === 1 ? "try" : "tries"}
        </span>
      </header>
      <GuessGrid
        guesses={guesses}
        draft={draft}
        codeLength={codeLength}
        showDraft={showDraft}
        visibleRows={Math.max(6, guesses.length + (showDraft ? 1 : 0) + pendingCount)}
      />
      <SymbolBar symbols={symbols} guesses={guesses} />
    </section>
  );
}

/* ---------------- Result ---------------- */

function PhaseResult() {
  const session = useSession()!;
  const snap = useGameSnapshot();
  const me = session.role;
  const iWon = snap.winner === me;
  const cfg = snap.config!;
  const set = SYMBOL_SETS[cfg.symbolSet];
  const isHost = session.role === "host";

  const opponentSecret = useMemo(() => {
    return me === "host" ? snap.guestSecretRevealed : snap.hostSecretRevealed;
  }, [me, snap]);

  return (
    <section className="mx-auto flex w-full max-w-lg flex-col gap-5 rounded-3xl border-2 border-border bg-card p-6 text-center shadow-soft">
      <motion.div
        initial={{ scale: 0.7, rotate: -6, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 14 }}
        className="mx-auto"
      >
        <span className="text-6xl">{iWon ? "🎉" : "🫧"}</span>
      </motion.div>
      <h2 className="font-display text-3xl font-bold">
        {iWon ? "You cracked it!" : "Your friend cracked it"}
      </h2>
      {opponentSecret && (
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-muted-foreground">Their secret was</p>
          <div
            className="mx-auto grid gap-1.5"
            style={{ gridTemplateColumns: `repeat(${opponentSecret.length}, minmax(0, 1fr))`, maxWidth: `${opponentSecret.length * 3.5}rem` }}
          >
            {opponentSecret.map((s, i) => (
              <div key={i} className="flex aspect-square items-center justify-center rounded-xl border-2 border-correct bg-correct font-display text-lg font-bold text-correct-foreground shadow-tile">
                {s}
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        {set.label} · {cfg.codeLength} symbols
      </p>

      {isHost ? (
        <button
          type="button"
          onClick={() => resetForRematch(session.doc)}
          className="h-12 rounded-xl border-2 border-primary bg-primary font-sans text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-tile hover:brightness-110"
        >
          Play again
        </button>
      ) : (
        <div className="rounded-xl border border-dashed border-border p-3 text-xs text-muted-foreground">
          Waiting for the host to start another round…
        </div>
      )}
    </section>
  );
}
