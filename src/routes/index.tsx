import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Codebreak Duo — a bubbly 2-player code guessing game" },
      {
        name: "description",
        content:
          "A cozy peer-to-peer code-breaking game for two. Pick a secret code, guess your friend's, and let the grid tell the story.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col items-center justify-center gap-10 px-6 py-16">
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="mb-3 inline-flex items-center gap-1.5">
          <span className="size-3 rounded-md bg-correct shadow-tile-press" />
          <span className="size-3 rounded-md bg-present shadow-tile-press" />
          <span className="size-3 rounded-md bg-absent shadow-tile-press" />
        </div>
        <h1 className="font-display text-5xl font-bold sm:text-6xl">Codebreak Duo</h1>
        <p className="mx-auto mt-3 max-w-md text-balance text-muted-foreground">
          A cozy 2-player code guessing game. Pick a secret, out-deduce your friend, celebrate every colored tile.
        </p>
      </motion.header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="grid w-full max-w-2xl gap-4 sm:grid-cols-2"
      >
        <Link
          to="/host"
          className="group flex flex-col gap-3 rounded-3xl border-2 border-primary bg-primary p-6 text-primary-foreground shadow-tile transition hover:-translate-y-0.5 hover:brightness-110"
        >
          <span className="text-3xl">🎯</span>
          <h2 className="font-display text-2xl font-bold">Create a room</h2>
          <p className="text-sm opacity-90">
            Set the code length and symbol set, then send an invitation to your friend.
          </p>
        </Link>
        <Link
          to="/join"
          className="group flex flex-col gap-3 rounded-3xl border-2 border-border bg-card p-6 text-foreground shadow-tile transition hover:-translate-y-0.5 hover:border-primary/60"
        >
          <span className="text-3xl">🤝</span>
          <h2 className="font-display text-2xl font-bold">Join a room</h2>
          <p className="text-sm text-muted-foreground">
            Got an invitation from a friend? Paste it and hop in.
          </p>
        </Link>
      </motion.div>

      <section className="grid w-full max-w-2xl gap-4 rounded-3xl border-2 border-border bg-card/60 p-5 text-sm text-muted-foreground sm:grid-cols-3">
        <Step n="1" title="Connect">Copy-paste a tiny code to link up peer-to-peer. No accounts.</Step>
        <Step n="2" title="Pick a secret">Each of you privately chooses a code from the agreed symbol set.</Step>
        <Step n="3" title="Deduce">Take turns guessing. First to crack the code wins.</Step>
      </section>
    </main>
  );
}

function Step({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <span className="inline-flex size-6 items-center justify-center rounded-lg bg-turn font-display text-xs font-bold text-turn-foreground">
          {n}
        </span>
        <h3 className="font-display text-base font-bold text-foreground">{title}</h3>
      </div>
      <p>{children}</p>
    </div>
  );
}
