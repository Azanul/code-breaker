# Product

## Register

product

## Users

Two friends playing casually together — on a voice call or in the same room. Low-stakes, quick rounds, playful banter. The game is a shared social moment, not a competitive grind.

## Product Purpose

A real-time 2-player guessing game where each player picks a secret number (1–100) and they take turns narrowing in on each other's code. Uses WebRTC (Yjs) for direct peer-to-peer connection — no server, no accounts, just a 4-digit room code to link up.

## Brand Personality

- Retro / hacker / neon
- Voice: playful, confident, arcade-announcer
- Tone: energetic but not aggressive — the machine is on your side
- Emotion: nostalgic excitement, like booting up an old arcade cabinet with a friend

## Anti-references

- Modern SaaS / tools aesthetic (clean minimalist app UI with rounded corners, muted grays, sans-serif corporate typography)
- Generic mobile games (candy-colored, overly rounded, cartoonish)
- Anything that looks like it requires an account or login

## Design Principles

1. **Every frame is a terminal** — the retro CRT aesthetic is not a skin; it's the material. Scanlines, pixel fonts, phosphor glow, blinking cursors. Every pixel should feel like it belongs on a monochrome monitor that happens to support purple.

2. **Glow with intent** — neon glow (purple primary, cyan/amber accents) guides attention to active state: whose turn it is, what's happening, where to look. Never decorative.

3. **Two-player clarity at a glance** — the game has a strict turn-based flow (lobby → secret-setting → playing → result). The player must always know: where am I, whose turn is it, what did they guess, what was the result. No confusion tolerated.

4. **Feedback is arcade feedback** — actions get immediate tactile responses: button clicks feel like pressing an arcade button, guesses land with a result badge, the turn pulse is unmistakable. Delight without delay.

5. **Zero barrier to play** — no sign-up, no accounts, no loading spinners. Type a 4-digit room code, share it, and you're in. The social friction is the only friction allowed.

## Accessibility & Inclusion

Standard web best practices. Semantic HTML, keyboard-navigable inputs, `prefers-reduced-motion` respected for scanlines and floating pixels. No specific WCAG level target beyond good-faith baseline.
