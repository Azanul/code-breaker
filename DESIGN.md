# Design System: CODEBREAK DUO

> High-fidelity, bubbly, and tactile. A NYT Wordle-inspired aesthetic refined with modern motion principles.

## Overview

CODEBREAK DUO is a game of deduction and physical satisfaction.

The UI is designed to feel like a premium board game you'd play with a friend. It's warm, responsive, and rewards every interaction with subtle feedback.

No accounts. No servers. Peer-to-peer connection via WebRTC blobs.

---

## Design Principles

### 1. Tactile Physicality
Elements should feel like they exist in 3D space. We use `shadow-tile` and `shadow-soft` to create layers of depth. Buttons "press" into the page rather than just changing color.

### 2. Functional Motion (The Emil Way)
Motion is used to explain state changes.
- **Springs over Easing**: Use spring physics for layout transitions to make them feel organic.
- **Reveal, don't just appear**: New information (like guess feedback) is revealed through a 3D flip animation, making the discovery feel like a physical event.
- **Staggered entry**: Elements enter the view with a slight delay (`index * 0.12`), guiding the eye and creating a sense of rhythm.

### 3. Information Density with Clarity
The screen is split into "Your guesses" and "Their guesses". Both progress simultaneously. We use clear typography and semantic colors to ensure the state of the game is readable at a glance.

### 4. Multimodal Feedback
Color is a primary indicator, but it's never the *only* indicator. Every state (Correct, Present, Absent) has a corresponding icon/pattern overlay to ensure accessibility.

---

## Layout Hierarchy

### 1. Landing / Connection
- Clean, centered typography.
- Prominent "Create" (Primary) and "Join" (Secondary) cards.
- Step-by-step connection flow using WebRTC signaling blobs.

### 2. Match Setup
- Bubbly toggle buttons for code length.
- Descriptive cards for symbol sets.
- High-contrast "Lock in" action.

### 3. The Match Arena
- **Header**: Game title and role (Host/Guest).
- **Turn Indicator**: Centered, pulsing indicator of whose turn it is.
- **Player Panels**:
    - Guess Grid (Wordle-style rows of tactile cells).
    - Symbol Bar (Interactive reference of ruled-out/confirmed symbols).
- **Keypad**: Responsive grid of symbols with "Guess" and "Delete" actions.

---

## Components

### Guess Cell
The heart of the game. A rounded square (`rounded-2xl`) with a thick border and tile shadow.
- **Empty**: Neutral background, subtle border.
- **Filled**: Active border, ready for submission.
- **Correct**: Kelly green (#6AAA64 / oklch(0.72 0.17 145)) with a solid circle icon.
- **Present**: Amber (#C9B458 / oklch(0.78 0.15 75)) with a half-circle icon.
- **Absent**: Dark gray (#787C7E / oklch(0.45 0.02 60)) with an outlined circle icon.

### Symbol Reference Bar
A horizontal strip of the allowed symbol set.
- **Interactive**: Updates in real-time as guesses are submitted.
- **Status**: Visual strike-throughs or highlights to track deduction.

### Turn Indicator
Uses a soft pulse and warm colors to make sure there's zero ambiguity about who is currently guessing.

---

## Motion Specification

### Guess Reveal
1. **Trigger**: Player submits a full row.
2. **Animation**: `rotateX` flip (0 -> 90 -> 0).
3. **Stagger**: 120ms delay between each cell.
4. **Transition**: `easeInOut` with a 0.55s duration per cell.

### UI Transitions
- **Hover**: `-translate-y-0.5` with `brightness-110` for interactive elements.
- **Layout**: Spring-based animations for panel entries and state changes.

---

## Color & Typography

### Palette (Warm Paper & Game Semantics)
- **Background**: Warm Paper (`oklch(0.985 0.012 85)`)
- **Primary**: Soft Blue (`oklch(0.55 0.15 250)`)
- **Correct**: Kelly Green (`oklch(0.72 0.17 145)`)
- **Present**: Amber (`oklch(0.78 0.15 75)`)
- **Absent**: Charcoal (`oklch(0.45 0.02 60)`)
- **Turn**: Vibrant Indigo (`oklch(0.7 0.13 240)`)

### Typography
- **Display**: `Fraunces` — Used for headings to give a "New York Times" serif feel.
- **Sans**: `Nunito` — Used for interface and body text to maintain a bubbly, friendly tone.

---

## Accessibility
- **WCAG Compliant Contrast**: All semantic colors are tested for readability.
- **Pattern Overlays**: Icons accompany every feedback state.
- **Keyboard Support**: Full `Tab` navigation and `Enter`/`Backspace` symbol entry.
- **Reduced Motion**: Fallback to simple opacitiy/color fades when `prefers-reduced-motion` is active.
