# Product

## Users

Two friends playing casually together—on a voice call or sitting in the same room. Quick rounds, playful banter, and friendly mind games. The fun comes from deducing each other's secret code, not from grinding ranks or chasing rewards.

---

## Product Purpose

A real-time 2-player code-breaking game with a bubbly, Wordle-like grid interface. Each player secretly chooses a code, then takes turns guessing their opponent's code while simultaneously defending their own.

Every guess is recorded in a side-by-side grid, with each row representing one attempt and each cell showing per-symbol feedback through color and patterns—familiar to anyone who has played Wordle.

Each guessed cell receives immediate feedback:

* **Absent** (dark gray) — the symbol does not appear anywhere in the opponent's code.
* **Present** (amber) — the symbol exists in the code but is in the wrong position.
* **Correct** (green) — the symbol exists and is in the correct position.

Each player's side shows their own grid of attempts. A separate row of small indicators tracks which symbols have been ruled out or remain possible, aiding deduction.

The first player to correctly guess the opponent's entire code wins.

The experience is entirely peer-to-peer using WebRTC (Yjs). No servers, no accounts, no matchmaking—just share a 4-digit room code and start playing.

---

## Pre-game Setup

Before each game begins, the first player to join (the room creator) sets up the match configuration:

* **Code length** — choose the number of cells (e.g. 4, 5, or 6).
* **Allowed entry set** — choose which symbols can be used in codes and guesses:
  * **Decimal** — digits `0`–`9`
  * **Hexadecimal** — digits `0`–`9` and letters `A`–`F`
  * **Letters & Numbers** — digits `0`–`9` and letters `A`–`Z`
  * **All Letters** — letters `A`–`Z`

These settings are communicated to the second player on connection. Both players then secretly choose their codes from the agreed-upon symbol set and length, and the match begins.

---

## Brand Personality

* Bubbly / playful / tactile
* Voice: warm, encouraging, game-show host
* Tone: friendly and energetic without being loud — the game celebrates every discovery with you
* Emotion: cozy satisfaction, like solving the day's Wordle over coffee with a friend

---

## Anti-references

* Retro / CRT / terminal aesthetics
* Dark mode–only interfaces
* Pixel fonts or monospace constraints
* Corporate sans-serif interfaces
* Generic candy-colored mobile games
* Account creation, profiles, or login screens

---

## Design Principles

### 1. Every cell tells a story

The Wordle-style grid is the canvas. Rounded cells with clean fills, soft shadows, and flip animations make every guess feel tactile and satisfying to reveal.

### 2. Color with intent

Green, amber, and dark gray are the primary signals — familiar to anyone who's played Wordle. Color communicates corrections, near-misses, and misses, while soft blue accents indicate the active player.

### 3. Two-player clarity at a glance

The interface always answers:

* Where am I?
* Whose turn is it?
* What was the latest guess?
* What feedback did it receive?
* How close is each player to solving the code?

Each player owns one side of the screen with an independent Wordle-style grid, making simultaneous progress easy to compare.

### 4. Every guess teaches something

A guess is more than a row—it is information.

Each attempt immediately updates:

* the player's guess grid with a new row,
* per-cell feedback with color and symbol annotations,
* and the symbol reference bar, allowing deductions to accumulate naturally throughout the match.

### 5. Feedback is tactile and celebratory

Every action feels satisfying.

Key presses snap into rounded cells, guesses flip with a 3D reveal animation, feedback colors fill in with a soft pop, and turn changes bounce playfully. The game celebrates every discovery like a mini-victory.

### 6. Zero barrier to play

No sign-up.

No accounts.

No waiting rooms.

Enter or share a 4-digit room code and start playing immediately.

---

## Gameplay Model

The match is fully turn-based.

1. Both players connect using a room code.
2. The first player configures code length and allowed symbol set.
3. Each secretly selects a code from the agreed-upon set.
4. Players alternate making guesses, typing symbols into a row of cells.
5. Each submitted row reveals per-cell feedback:

* **Absent** — symbol is not in the code.
* **Present** — symbol exists elsewhere in the code.
* **Correct** — symbol is in the correct position.

6. Players use their growing grid of attempts and the symbol reference bar to narrow down possibilities.
7. The first player to guess the complete code wins.

---

## Accessibility & Inclusion

Use semantic HTML and fully keyboard-accessible controls.

Respect `prefers-reduced-motion` by reducing cell flip animations, color transitions, and bounce effects while preserving gameplay clarity.

Visual feedback should never rely solely on color; every cell state should also be distinguishable through icons, symbols, or patterns.
