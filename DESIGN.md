# Design System: CODE-BREAK

> Bubbly, playful, NYT Wordle-inspired aesthetic for a peer-to-peer 2-player code-breaking game.

## Overview

CODE-BREAK is a deduction game, not a guessing game.

Each player secretly chooses a code. Players alternate making guesses, receiving per-cell feedback after every attempt. Every turn permanently expands each player's grid until one player reconstructs the opponent's code.

The UI should feel like a friendly, tactile word game you'd play over morning coffee:
- clean rounded cells with satisfying flip animations
- soft shadows and gentle depth
- bubbly sans-serif type
- playful personality without being childish
- immediate, celebratory feedback

No accounts. No matchmaking. Share a 4-digit room code and play.

---

## Core Gameplay

1. Join a room.
2. The first player sets code length and allowed symbol set (decimal, hex, letters+numbers, all letters).
3. Both players secretly choose a code from the agreed-upon set.
4. Players alternate turns typing guesses into a row of cells.
5. Every guessed cell receives one of three states:

| State | Meaning |
|--------|---------|
| Absent | Symbol does not exist anywhere in the secret code. |
| Present | Symbol exists but is in another position. |
| Correct | Symbol exists in the correct position. |

6. First player to completely reveal the opponent's code wins.

---

# Design Principles

## Friendly and tactile

Everything feels soft, rounded, and satisfying to interact with—like popping bubble wrap or tapping tiles.

## Information accumulates

Every guess leaves permanent evidence.

Nothing disappears.

## Two-player symmetry

The left and right boards mirror each other.

## Color communicates

Color is reserved for:
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
- Guess Grid (Wordle-style)
- Symbol Reference Bar

+ Center Rail

- Room Code
- Connection Status
- Turn Indicator
- Announcement Banner
- Pre-game Setup Panel

+ Right Player Board

- Player header
- Guess Grid (Wordle-style)
- Symbol Reference Bar

---

# Components

## Player Board

Contains:

- player name with playful badge
- connection state dot
- turn indicator
- guess grid
- symbol reference bar

## Guess Grid

Wordle-style grid of rows.

Each row contains a set of cells — one per symbol in the code.

Newest row animates in with a staggered cell flip (like Wordle).

Older rows remain visible, letting deduction patterns emerge over time.

## Guess Cell

Every guessed symbol occupies one cell.

### Absent

Dark gray fill.

No animation emphasis.

### Present

Amber / goldenrod fill.

Gentle wobble on reveal.

### Correct

Kelly-green fill.

Celebratory pop on reveal.

Symbol text animates in with a flip from the back of the cell.

Never rely on color alone — use distinct symbols or patterns alongside color.

## Symbol Reference Bar

A horizontal row of all allowed symbols (e.g. 0–9, A–F, etc.).

Purpose:

Quick visual reference for which symbols have been ruled out or confirmed.

States

- Unknown (default)
- Absent (struck through or dimmed)
- Present (highlighted amber)
- Confirmed (highlighted green)

Updates immediately after every turn.

## Pre-game Setup Panel

Appears before the match begins, controlled by the first player:

- **Code length** — a bubbly toggle / selector for number of cells (e.g. 3–6).
- **Allowed entry set** — playful selector cards for decimal, hex, letters+numbers, all letters.

The second player sees the chosen settings upon joining.

## Turn Indicator

Always visible.

Uses a soft bounce or pulse animation.

There should never be ambiguity about whose turn it is.

---

# Motion

### Guess submission

1. Guess row inserts at the top of the grid.
2. Cells flip one by one (left to right) with a 3D rotation revealing the feedback color and symbol.
3. Symbol reference bar updates with a gentle fade.
4. Turn indicator bounces to the other player.

### Cell flip

Front face = the guessed symbol on a neutral background.

Back face = the feedback color with symbol re-vealed.

Duration: ~300ms per cell, staggered by ~100ms.

### Victory

Confetti-like particle burst or celebration banner.

Respect `prefers-reduced-motion`.

---

# Color Semantics

Background
: Off-white / warm paper (#F8F6F0)

Cell default
: Light gray border, white fill

Cell absent
: Dark gray fill (#787C7E)

Cell present
: Goldenrod / amber (#C9B458)

Cell correct
: Kelly green (#6AAA64)

Active player
: Soft blue accent

Text
: Dark charcoal (#1A1A1B)

Blocking errors
: Soft red

---

# Typography

System / interface:
**Helvetica Neue**, **Arial**, or NYT-style serif (e.g. **Karnak**) for headings

Grid cells:
Bold, clean sans-serif — symbols should be unmistakable at a glance

Avoid:
- pixel fonts
- monospace-only constraints
- retro / terminal typefaces

---

# Accessibility

- Semantic HTML
- Keyboard playable
- Focus visible
- Do not rely on color alone — use patterns, icons, or text labels per cell state
- Respect `prefers-reduced-motion`
- Sufficient color contrast on all cell states

---

# Don't

- Don't use retro / CRT / terminal aesthetics.
- Don't use higher/lower mechanics.
- Don't use battle log terminology.
- Don't hide previous guesses.
- Don't require accounts.

# Do

- Make deduction the hero.
- Show both players' progress simultaneously.
- Keep all attempts visible.
- Keep the symbol reference bar persistent.
- Make the current turn unmistakable.
- Make the interface feel playful and tactile — something you'd want to tap.
