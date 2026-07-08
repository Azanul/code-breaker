# Codebreak Duo

## Users

Two friends playing casually together—on a voice call or sitting in the same room. Quick rounds, playful banter, and friendly mind games. The fun comes from the "aha!" moment of discovery, not from competitive ranking.

---

## Product Purpose

A high-fidelity 2-player code-breaking game with a bubbly, tactile interface. Each player secretly chooses a code, then takes turns guessing their opponent's code while simultaneously defending their own.

Every guess is recorded in a side-by-side grid, with each row representing one attempt and each cell showing per-symbol feedback through color and animations.

Each guessed cell receives immediate feedback:

* **Absent** (dark gray) — the symbol does not appear anywhere in the opponent's code.
* **Present** (amber) — the symbol exists in the code but is in the wrong position.
* **Correct** (green) — the symbol exists and is in the correct position.

The experience is entirely peer-to-peer using WebRTC (Yjs). No servers, no accounts—just exchange a secure connection blob and start playing.

---

## The Journey

1.  **Connection**: One player hosts and generates an invitation blob. The guest pastes it and sends back an answer blob.
2.  **Match Setup**: The host configures the rules:
    *   **Code length**: 3 to 6 symbols.
    *   **Allowed entry set**: Decimal, Hexadecimal, Letters & Numbers, or All Letters.
3.  **Secret Selection**: Both players secretly lock in their codes.
4.  **The Match**: Players alternate turns. When you submit a guess, your friend's device computes the feedback in real-time, creating a shared, trustless experience.
5.  **Result**: The first to crack the code wins. Revel in the victory (or defeat) with a shared result screen showing both secrets.

---

## Brand Personality & Philosophy (The "Emil" Touch)

*   **Bubbly & Tactile**: Everything should feel like it has physical weight and volume. Interaction feels like popping bubble wrap or tapping ceramic tiles.
*   **High-Fidelity Polish**: We care about the "invisible" details—the subtle spring physics when a menu opens, the slight hover lift on a button, and the way shadows change with depth.
*   **Meaningful Motion**: Motion isn't just decoration; it guides the eye. A cell flip isn't just a 3D rotation; it's a "reveal" that celebrates the information discovered.
*   **Cozy Satisfaction**: Like solving a puzzle over morning coffee. Warm, encouraging, and satisfyingly smooth.

---

## Anti-references

*   Retro / CRT / terminal aesthetics
*   Dark mode–only interfaces
*   Low-fidelity pixel art
*   Corporate, sterile sans-serif interfaces
*   Account creation, profiles, or login screens

---

## Design Principles

### 1. Physicality & Depth
The UI uses soft shadows and subtle gradients to suggest depth. Buttons don't just "change color" on click; they "press down" into the page.

### 2. Feedback as Celebration
Every correct symbol is a mini-victory. The "Correct" pop animation and the "Present" wobble are designed to make discovery feel rewarding.

### 3. Clear Intentionality
Whose turn is it? How close am I to winning? The interface answers these questions instantly through prominent (but soft) turn indicators and persistent progress grids.

### 4. Zero Friction, Absolute Privacy
By using manual WebRTC signaling, we ensure the game is entirely yours. No middleman, no data collection—just direct communication between friends.

---

## Accessibility & Inclusion

*   **Multimodal Feedback**: Visual feedback never relies solely on color. Every cell state uses distinct symbols and patterns (e.g., strike-throughs for absent symbols).
*   **Motion Sensitivity**: Respect `prefers-reduced-motion` by swapping 3D flips for soft fades and reducing spring intensity, without losing the tactile feel.
*   **Keyboard First**: Every part of the game—from connection to code entry—is fully playable via keyboard.
