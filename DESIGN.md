# Design System: CODE-BREAK

> Retro terminal aesthetic for a peer-to-peer 2-player code-breaking game.

## Overview

CODE-BREAK is a deduction game, not a guessing game.

Each player secretly chooses a numeric code. Players alternate making guesses, receiving per-digit feedback after every attempt. Every turn permanently expands each player's investigation board until one player reconstructs the opponent's code.

The UI should feel like a shared arcade terminal from the 80s:
- CRT monitor
- phosphor glow
- pixel fonts
- scanlines
- neon purple interface
- immediate arcade feedback

No accounts. No matchmaking. Share a 4-digit room code and play.

---

## Core Gameplay

1. Join a room.
2. Both players enter a secret code.
3. Players alternate turns.
4. Every guess is added to the player's attempt history.
5. Every guessed digit receives one of three states:

| State | Meaning |
|--------|---------|
| Absent | Digit does not exist anywhere in the secret code. |
| Present | Digit exists but is in another position. |
| Correct | Digit exists in the correct position. |

6. First player to completely reveal the opponent's code wins.

---

# Design Principles

## Every screen is a terminal

Everything belongs on a CRT monitor.

## Information accumulates

Every guess leaves permanent evidence.

Nothing disappears.

## Two-player symmetry

The left and right boards mirror each other.

## Glow communicates

Glow is reserved for:
- active turn
- new feedback
- victory
- interactive focus

## Zero friction

No login.

No accounts.

No loading screens.

---

# Layout

+ Left Player Board

- Player header
- Attempt Grid
- Digit Ledger

+ Center Rail

- Room Code
- Connection Status
- Turn Indicator
- Announcement Banner

+ Right Player Board

- Player header
- Attempt Grid
- Digit Ledger

---

# Components

## Player Board

Contains:

- player name
- connection state
- turn indicator
- attempt grid
- digit ledger

## Attempt Grid

Chronological history of guesses.

Each row contains

- attempt number
- guessed code
- feedback cells

Newest row animates into view.

Older rows remain visible.

## Feedback Cell

Every digit has one feedback cell.

### Absent

Muted border.

Dark fill.

No glow.

### Present

Amber border.

Amber glow.

### Correct

Emerald border.

Bright glow.

Never rely on color alone.

Use distinct icons/patterns.

## Digit Ledger

Vertical list of digits 0-9.

Purpose:

External memory for deductions.

States

- Unknown
- Absent
- Present
- Confirmed

Updates immediately after every turn.

## Turn Indicator

Always visible.

Uses cyan pulse.

There should never be ambiguity about whose turn it is.

---

# Motion

Guess submission

1. Guess row inserts.
2. Feedback reveals left to right.
3. Ledger updates.
4. Turn indicator switches.

Respect prefers-reduced-motion.

---

# Color Semantics

Purple
: Interface chrome

Cyan
: Active player / current turn

Amber
: Present digit

Emerald
: Correct digit

Gray
: Absent digit

Red
: Blocking errors only

---

# Typography

Display:
Press Start 2P

Body:
VT323

Never use modern sans-serif fonts.

---

# Accessibility

- Semantic HTML
- Keyboard playable
- Focus visible
- Do not rely on color alone
- Respect prefers-reduced-motion

---

# Don't

- Don't use higher/lower mechanics.
- Don't use battle log terminology.
- Don't hide previous guesses.
- Don't use rounded mobile-game UI.
- Don't require accounts.

# Do

- Make deduction the hero.
- Show both players' progress simultaneously.
- Keep all attempts visible.
- Keep the digit ledger persistent.
- Make the current turn unmistakable.
