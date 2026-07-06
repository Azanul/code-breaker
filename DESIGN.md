---
name: CODE BREAK
description: 2-player peer-to-peer guessing game — retro terminal arcade
colors:
  primary: "#818cf8"
  primary-deep: "#7c3aed"
  primary-darker: "#6d28d9"
  accent-cyan: "#22d3ee"
  accent-amber: "#f59e0b"
  accent-amber-deep: "#d97706"
  accent-emerald: "#10b981"
  accent-emerald-deep: "#059669"
  accent-win: "#34d399"
  alert-error: "#ff2d55"
  ghost-violet: "#a78bfa"
  void: "#07070f"
  phosphor-text: "#e2e8f0"
  phosphor-bright: "#f1f5f9"
  terminal-muted: "#64748b"
  terminal-dim: "#475569"
  terminal-shadow: "#334155"
typography:
  display:
    fontFamily: "'Press Start 2P', monospace"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "1px"
    textTransform: "uppercase"
  body:
    fontFamily: "'VT323', monospace"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "1px"
rounded:
  sm: "2px"
  md: "4px"
spacing:
  xs: "6px"
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.primary-deep}"
    textColor: "{colors.phosphor-bright}"
    rounded: "{rounded.sm}"
    padding: "10px 24px"
    typography: "{typography.display}"
  button-secret:
    backgroundColor: "{colors.accent-amber}"
    textColor: "{colors.phosphor-bright}"
    rounded: "{rounded.sm}"
    padding: "10px 24px"
  button-guess:
    backgroundColor: "{colors.accent-emerald}"
    textColor: "{colors.phosphor-bright}"
    rounded: "{rounded.sm}"
    padding: "10px 24px"
  card:
    backgroundColor: "rgba(15, 15, 35, 0.85)"
    rounded: "{rounded.md}"
    padding: "{spacing.lg} 22px"
  input:
    backgroundColor: "rgba(0, 0, 0, 0.5)"
    textColor: "{colors.phosphor-text}"
    rounded: "{rounded.sm}"
    padding: "10px 14px"
    typography: "{typography.display}"
  overlay:
    backgroundColor: "rgba(0, 0, 0, 0.85)"
    rounded: "{rounded.md}"
    padding: "40px 36px"
---

# Design System: CODE BREAK

## 1. Overview

**Creative North Star: "The Terminal Arcade"**

CODE BREAK is a machine you and a friend sit down at. A dedicated terminal with a CRT monitor, two chairs, a direct line. The screen is the only reality: scanlines drift across the phosphor, the cursor blinks expectantly, and every action produces an arcade-grade response — a glow, a flash, a badge that slides in. The game is the interface.

The aesthetic is retro/hacker/neon: near-black backgrounds (`#07070f` — Void), purple-indigo neon as the primary voice (`#818cf8` Neon Indigo, `#7c3aed` Phantom Purple), and a tight set of accent colors used strictly for state: cyan for the opponent, amber for secrets, emerald for your actions. No box-shadows, no rounded-corners-as-default, no glass surfaces. Depth comes from CRT effects only — the scanline overlay and the vignette that darkens toward the edges of the screen.

This system explicitly rejects modern SaaS aesthetics (clean minimalist app UI, muted grays, rounded everything, sans-serif corporate typography) and generic mobile games (candy colors, cartoonish shapes).

**Key Characteristics:**
- Terminal-dark with neon-arcade accent
- Flat-by-default, depth through CRT effects only
- Two pixel fonts: Press Start 2P (display) + VT323 (body)
- Glow is semantic, never decorative
- No box-shadows for elevation; no glassmorphism

## 2. Colors

The palette is dark-terminal-first: a near-black void, phosphor text, and a neon-indigo primary system. Accent colors are reserved for game-state semantics.

### Primary
- **Neon Indigo** (`#818cf8`): The primary voice. Borders, labels, status messages, room tag, glows, the pulse of the interface.
- **Phantom Purple** (`#7c3aed`): Strong purple for primary buttons, the title glow, and announcement banners.
- **Phantom Deep** (`#6d28d9`): Button gradient base. Sits under Phantom Purple.

### Secondary
- **Cyan Glow** (`#22d3ee`): The opponent's color. Opponent panel border and label, "HIGHER" result badges.
- **Amber Signal** (`#f59e0b`): Secrets and stakes. VS divider, secret code display, secret-set button.
- **Amber Deep** (`#d97706`): Secret button gradient base.

### Tertiary
- **Emerald Strike** (`#10b981`): Your actions. Guess button, connected status LED, "your turn" pulse.
- **Emerald Deep** (`#059669`): Guess button gradient base.
- **Win Green** (`#34d399`): Victory state — the win result title and "correct" result badges.

### Alert
- **Error Red** (`#ff2d55`): Room-full overlay. Used for blocking errors only — once per session at most.

### Neutral
- **Void** (`#07070f`): Body background. Absolute black with a hair of violet so it scans as dark, not dead.
- **Phosphor Text** (`#e2e8f0`): Primary text color. Bright enough for readability at small pixel sizes.
- **Phosphor Bright** (`#f1f5f9`): Logo title and button labels. The brightest value on the gamut.
- **Ghost Violet** (`#a78bfa`): Section titles, the blinking waiting dot, secret reveal. A desaturated mid-tone of the primary hue.
- **Terminal Muted** (`#64748b`): Hints, result subtitles, status bar default. Secondary information.
- **Terminal Dim** (`#475569`): Status bar fallback text, empty state messages. The floor of readable text.
- **Terminal Shadow** (`#334155`): Placeholder text. Must still meet 4.5:1 against input backgrounds.

### Surfaces
- **Screen Surface** (`rgba(15, 15, 35, 0.85)`): Card and panel backgrounds. Translucent dark navy over the void.
- **Dark Wash** (`rgba(0, 0, 0, 0.4)`): Status bar and secret display backgrounds.
- **Input Background** (`rgba(0, 0, 0, 0.5)`): Text field backgrounds.

### Named Rules
**The Terminal Rule.** Gray text on tinted warm backgrounds is forbidden. All neutral text is a desaturated violet-gray drawn from the primary hue family — never a generic warm or cool gray.

**The One Hue Rule.** Every accent color is used for exactly one role: cyan for opponent, amber for secrets, emerald for your actions, error red for blocking states. No double-dipping.

## 3. Typography

**Display Font:** Press Start 2P (monospace)
**Body Font:** VT323 (monospace)
**Label/Mono Font:** Press Start 2P serves dual duty (display + label + mono)

Both fonts are pixel/bitmap-style monospaced faces — a single design axis (retro terminal) expressed at two sizes: Press Start 2P for low-resolution pixel density (headings, labels, buttons, data), VT323 for readable body text (names, history, hints).

**Character:** Terminal-precise and arcade-bold. Press Start 2P is chunky, uppercase-by-default, and demands attention. VT323 is smoother but still monospaced and terminal-native — it carries the bulk of the interface without fighting the display face.

### Hierarchy
- **Display / Logo** (400, `36px`, 1.2): The CODE BREAK title. Press Start 2P, the largest type on the screen, with a purple neon text-shadow. Uses `text-shadow` glow, not `background-clip: text`.
- **Headline / Section Title** (400, `11–12px`, 1.5): Press Start 2P for setting/playing phase titles and the battle log header. `>>` prefix convention.
- **Title** (400, `9px`, 1.5): Press Start 2P for pixel labels (`// ROOM CODE`, `// YOUR CALLSIGN`, P1/P2 labels). All uppercase, 1–2px letter-spacing.
- **Body** (400, `14–22px`, 1.4): VT323 for player names, history entries, guesses, hints, status messages. The workhorse size; ranges from 14px (metadata) to 22px (panel names).
- **Label / Button** (400, `8–10px`, 1.5): Press Start 2P for result badges and button labels. The hardest-to-read size — used sparingly and always with high contrast against its background.

### Named Rules
**The No-System-Font Rule.** The game never falls back to a system font. If Google Fonts fails, the monospace fallback preserves the column alignment but the game is designed around the chosen faces — no Inter, no SF Pro, no sans-serif anywhere.

## 4. Elevation

The system uses CRT-screen depth instead of material elevation. There are no box-shadow drop shadows for layering, no raised surfaces, no card stacks. The single surface is the terminal screen itself.

Depth is conveyed through three CRT effects, applied at the viewport level:
- **Scanlines** (`z-index: 1000`): Repeating horizontal lines at 2px/4px intervals at 8% opacity. Covers the entire viewport. Creates the illusion of looking at a CRT monitor.
- **Vignette** (`z-index: 999`): Radial gradient from transparent at center to 70% black at edges. Frames the game content inside the CRT bezel.
- **Overlay screen** (`z-index: 100`): Full-screen dark backdrop (85% black, 4px blur) for modals (result, room-full). The only true layered surface.

Interactive elements get neon glow instead of shadow. Buttons have a colored box-shadow at rest that doubles on hover:
- Primary button: `0 0 12px rgba(124, 58, 237, 0.4)` → `0 0 24px rgba(124, 58, 237, 0.6)` on hover.
- Secret button: `0 0 12px rgba(245, 158, 11, 0.3)` → `0 0 24px rgba(245, 158, 11, 0.5)`.
- Guess button: `0 0 12px rgba(16, 185, 129, 0.3)` → `0 0 24px rgba(16, 185, 129, 0.5)`.

### Named Rules
**The CRT Rule.** No element receives a material drop-shadow. All perceived depth must come from CRT scanlines, the vignette bezel, or neon glow. If an element needs to feel "above" another, give it a glow, not a shadow.

## 5. Components

### Buttons
- **Shape:** Sharp/square corners (2px radius). Press Start 2P, 10px, uppercase, 1px letter-spacing. Full-width by default.
- **Primary ("START GAME", "PLAY AGAIN"):** Phantom Purple → Phantom Deep gradient background, Neon Indigo glow shadow. White text. Hover: glow doubles (`0 0 24px`), lift `-1px`. Active: scale 0.96.
- **Secret ("LOCK IN"):** Amber Signal → Amber Deep gradient, amber glow. Hover: glow doubles, lift. Active: scale 0.96.
- **Guess ("FIRE"):** Emerald Strike → Emerald Deep gradient, emerald glow. Hover: glow doubles, lift. Active: scale 0.96.
- **Small (room code generate):** Transparent with Neon Indigo border (0.3 opacity), VT323 16px. Hover: background fills to 20% opacity.
- **Disabled:** 25% opacity, no hover/active effects, `cursor: not-allowed`.

### Cards / Containers
- **Corner Style:** Slightly curved (4px radius).
- **Background:** Screen Surface (`rgba(15, 15, 35, 0.85)`) — translucent dark navy over Void.
- **Border:** 1px solid Neon Indigo at 0.2 opacity.
- **Shadow Strategy:** None (CRT elevation only — see Elevation section). A subtle inner glow and outer glow at 5% and 5% opacity respectively on the Neon Indigo hue.
- **Internal Padding:** 24px horizontal at rest, 22px vertical on larger cards, 18px on mobile.

### Inputs / Fields
- **Style:** 1px solid Neon Indigo at 0.3 opacity, Input Background (`rgba(0, 0, 0, 0.5)`), 2px radius.
- **Text:** Press Start 2P, 12px, Phosphor Text, 2px letter-spacing. Number inputs center-aligned with 6–8px letter-spacing.
- **Focus:** Border shifts to full Neon Indigo, glow appears (`0 0 8px rgba(129, 140, 248, 0.25)`) plus inset glow.
- **Placeholder:** Terminal Shadow (`#334155`), same letter-spacing as filled value.
- **Disabled:** 25% opacity, no focus ring.

### Player Panels
- **Shape:** 2px radius, Dark Wash background, 1px border.
- **P1 (you):** Neon Indigo border. Panel label in Neon Indigo, name in Phosphor Text.
- **P2 (opponent):** Cyan Glow border. Panel label in Cyan Glow.
- **VS Divider:** Amber Signal text with amber glow shadow. Press Start 2P, 14px.

### History / Battle Log
- **Items:** Dark Wash background, Neon Indigo border at 0.1 opacity, 2px radius. 8px/14px padding. Slide-in animation on each new entry (0.2s, translateX -10px → 0).
- **Guesser/Target:** VT323, 14px, Terminal Muted color.
- **Guess Number:** Press Start 2P, 14px, Phosphor Text, 2px letter-spacing.
- **Result Badges:** 2px radius, Press Start 2P, 8px. Colored background at 15% opacity with matching 1px border:
  - "HIGHER": Cyan Glow
  - "LOWER": Amber Signal
  - "HIT": Win Green
  - "??": Neon Indigo (pending), blinking

### Overlay / Result Card
- **Backdrop:** Full-screen void at 85% opacity, 4px `backdrop-filter: blur`. No shadow.
- **Card:** Screen Surface at 95% opacity, 4px radius, Neon Indigo border at 0.2 opacity, purple glow shadow. `max-width: 400px`. Center-aligned text. Enter animation: pop-in (0.4s cubic-bezier 0.175/0.885/0.32/1.275, scale 0.85→1).
- **Result Title:** Win Green for victory (with green glow text-shadow `0 0 10px #34d399, 0 0 20px #34d39966`). No explicit color for loss — let the context speak.
- **Secret Reveal:** Ghost Violet, Press Start 2P, 16px.

### Waiting Box
- **Shape:** Dashed Neon Indigo border at 0.2 opacity, Dark Wash background, 2px radius. Full-width, centered.
- **Dot:** Ghost Violet, blinking (1s step-end, `50% opacity 0`).

### Status Bar
- **Shape:** Dark Wash background, Neon Indigo border at 0.1 opacity, 2px radius.
- **Room Tag:** Neon Indigo with subtle glow.
- **Connection LED:** Emerald Strike with green glow.
- **Default text:** Terminal Dim.

### Announcement Banner
- **Shape:** Phantom Purple gradient (20%→5% opacity), full Phantom Purple border, purple box-shadow glow. 2px radius. Flash-in animation (0.3s, scale 0.95→1).
- **Text:** Ghost Violet, Press Start 2P, 9px.

## 6. Do's and Don'ts

### Do:
- **Do** use the terminal-dark void as the body background — every pixel of UI sits on `#07070f`.
- **Do** use Neon Indigo (`#818cf8`) as the primary accent for borders, labels, and glows.
- **Do** use accent colors strictly for semantic game state: cyan for opponent, amber for secrets, emerald for your actions.
- **Do** prefer CRT effects (scanlines, vignette) over box-shadows for depth.
- **Do** use Press Start 2P for all labels, titles, buttons, and data. VT323 for everything else.
- **Do** use `::placeholder` at `#334155` Terminal Shadow — noticeably dark, not washed-out gray.
- **Do** cap the game content at `max-width: 520px` and center it — the terminal is a focused window.
- **Do** use the `>>` and `>` prefix convention on phase titles and status lines for terminal-readout feel.
- **Do** animate result badges and history items with slide-in (0.2s, -10px offset) for arcade feedback.

### Don't:
- **Don't** use box-shadows for card or panel elevation — depth comes from CRT effects only.
- **Don't** use glassmorphism (backdrop-blur on content surfaces, frosted glass effects).
- **Don't** use gradient text (`background-clip: text` with a gradient). All text is solid color with optional `text-shadow` glow.
- **Don't** use modern minimalist app UI patterns: no ghost buttons, no rounded-pill inputs, no shadow-elevated cards.
- **Don't** use generic warm or cool gray neutrals — all text is desaturated violet-gray from the primary hue family.
- **Don't** use candy colors, cartoon shapes, or rounded-pill buttons that belong in mobile games.
- **Don't** show an account/login flow. The room code is the only credential.
- **Don't** use border-left/right colored stripes as an accent on cards or items. Use full borders, background tints, or nothing.
- **Don't** use display type below 9px — the smallest Press Start 2P size is reserved for result badges and used sparingly.
- **Don't** animate for animation's sake. Every transition conveys state: your turn, a guess landing, a result arriving, the game ending.
