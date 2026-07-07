# Product

## Register

product

## Users

Two friends playing casually together—on a voice call or sitting in the same room. Quick rounds, playful banter, and friendly mind games. The fun comes from deducing each other's secret code, not from grinding ranks or chasing rewards.

---

## Product Purpose

A real-time 2-player code-breaking game where each player secretly chooses a multi-digit code. Players then take turns guessing their opponent's code while simultaneously defending their own.

Every guess is recorded in a personal guess history displayed on each player's side of the screen, making it easy to follow the deduction process as the match unfolds.

Each guessed digit receives immediate feedback:

* **Absent** — the digit does not appear anywhere in the opponent's code.
* **Present** — the digit exists in the code but is in the wrong position.
* **Correct** — the digit exists and is in the correct position.

Alongside the guess history, each digit (0–9) is represented in a vertical reference bar that gradually becomes annotated through play, helping players eliminate impossible digits and identify promising ones at a glance.

The first player to correctly guess the opponent's entire code wins.

The experience is entirely peer-to-peer using WebRTC (Yjs). No servers, no accounts, no matchmaking—just share a 4-digit room code and start playing.

---

## Brand Personality

* Retro / hacker / neon
* Voice: playful, confident, arcade-announcer
* Tone: energetic without being aggressive—the machine is rooting for both players
* Emotion: nostalgic excitement, like powering up an old arcade cabinet with a friend

---

## Anti-references

* Modern SaaS dashboards
* Minimalist productivity tools
* Corporate sans-serif interfaces
* Generic candy-colored mobile games
* Account creation, profiles, or login screens

---

## Design Principles

### 1. Every frame is a terminal

The CRT aesthetic is the material, not a theme. Pixel fonts, phosphor glow, scanlines, blinking cursors, and crisp grids make every screen feel like a retro machine built for code-breaking.

### 2. Glow with intent

Purple is the primary signal, supported by cyan and amber accents. Glow communicates interaction, active turns, newly revealed information, and victory states—never decoration.

### 3. Two-player clarity at a glance

The interface always answers:

* Where am I?
* Whose turn is it?
* What was the latest guess?
* What feedback did it receive?
* How close is each player to solving the code?

Each player owns one side of the screen with an independent attempt history, making simultaneous progress easy to compare.

### 4. Every guess teaches something

A guess is more than a row—it is information.

Each attempt immediately updates:

* the player's guess history,
* per-digit feedback,
* and the vertical digit reference bar, allowing deductions to accumulate naturally throughout the match.

### 5. Feedback is arcade feedback

Every action feels physical.

Button presses click with confidence, guesses lock into the grid, result indicators illuminate instantly, and turn changes pulse unmistakably. The machine celebrates every discovery.

### 6. Zero barrier to play

No sign-up.

No accounts.

No waiting rooms.

Enter or share a 4-digit room code and start playing immediately.

---

## Gameplay Model

The match is fully turn-based.

1. Both players connect using a room code.
2. Each secretly selects a code.
3. Players alternate making guesses.
4. Every guess is permanently added to that player's attempt history.
5. Each digit receives one of three feedback states:

* **Absent** — digit is not in the code.
* **Present** — digit exists elsewhere in the code.
* **Correct** — digit is in the correct position.

6. Players use their growing history and digit reference bar to narrow down possibilities.
7. The first player to guess the complete code wins.

---

## Accessibility & Inclusion

Use semantic HTML and fully keyboard-accessible controls.

Respect `prefers-reduced-motion` by reducing scanlines, glow animations, and floating pixel effects while preserving gameplay clarity.

Visual feedback should never rely solely on color; every digit state should also be distinguishable through icons, symbols, or patterns.
