# Not Balatro

> A React-based card game inspired by Balatro.

---

## 🚀 Getting Started

**Requirements:** Node.js 20+

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

```bash
# Build for production
npm run build

# Preview the production build locally
npm run preview
```

---

## 🎬 Demo


https://youtu.be/Q-ZdGCUMOAs


---

## Project Overview

**Not Balatro** is a simplified poker-based roguelike card game built with React + Vite. The player draws a hand of 8 cards, selects up to 5 to play, scores points via poker hand evaluation, and tries to beat each ante's target score before running out of hands. Jokers provide passive bonuses that stack on top of the base score every round.

---

## What's Actually Implemented

### Core Gameplay Loop

- **8-card hand** dealt from a shuffled standard 52-card deck
- **Select 1–5 cards** and play them as a poker hand
- **4 hands per ante** — run out and it's game over
- **3 discards per ante** — swap selected cards for new ones from the deck
- **2 antes** in a full run (configurable in `gameConfig.js`)

### Poker Hand Evaluation

All hands are detected and scored by `evaluateHand.js` and `calculateScore.js`:

| Hand | Chips | Multiplier |
|---|---|---|
| High Card | 5 | ×1 |
| One Pair | 10 | ×2 |
| Two Pair | 20 | ×2 |
| Three of a Kind | 30 | ×3 |
| Straight | 30 | ×4 |
| Flush | 35 | ×4 |
| Full House | 40 | ×4 |
| Four of a Kind | 60 | ×7 |
| Straight Flush | 100 | ×8 |
| Royal Flush | 100 | ×8 |

Each scoring card also contributes individual chip bonuses (Ace = 11, face cards = 10, number cards = face value).

### Scoring Animation

Plays out in phases via `usePlayHand`:
1. **Raising** — scoring cards lift up visually
2. **Scoring** — chips from each card are added one by one with a pulse effect
3. **Revealing** — multiplier appears, then the final total
4. **Done** — played cards are replaced with new ones drawn from the deck

### Jokers (5 active, always on)

Jokers are always active and stack their bonuses on top of every hand's score. The current set in `gameConfig.js`:

| Joker | Effect |
|---|---|
| Pumpkin Joker | +4 Mult |
| Alien Joker | +30 Chips |
| Eye Joker | +3 Mult |
| Croc Joker | +20 Chips |
| Car Joker | +2 Mult |

All 5 are displayed in the **Joker Bar** with their sprite, name, and bonus.

### Antes & Progression

- Run is divided into **2 antes** (expandable via `ANTE_TARGETS` in `gameConfig.js`)
- Each ante has a **score target** (Ante 1: 300 pts, Ante 2: 800 pts)
- An **ante progress bar** shows current score vs. target in real time
- Beating both antes → **Victory screen**
- Running out of hands before hitting the target → **Game Over screen**

### Sorting

Cards in hand can be sorted two ways (toggleable):
- **Sort by Rank** — ascending card value
- **Sort by Suit** — grouped by suit, then by rank within each suit

### Win / Lose Screen

A modal overlay (styled after Balatro) shows on run end:
- Win or lose state with matching color theme
- Best hand played during the run (hand name, chips × mult = total)
- "Nueva partida" button to restart immediately

### Card Visuals

- Full suit symbols (♥ ♦ ♣ ♠) with red/black coloring
- Face cards (J, Q, K) render their own pixel-art SVG illustrations, one per suit (12 total)
- Cards fan out in an arc with hover lift and selection lift animations
- **Selected** cards highlight in blue and lift slightly
- **Scoring** cards lift further and glow gold during animation
- **Kicker** cards (selected but not scoring) fade out during the animation

### Dev Tools

A debug bar visible only in `npm run dev` mode:
- **★ Win** — instantly triggers the win screen
- **✕ Lose** — instantly triggers the lose screen

---

## Project Structure

```
src/
├── components/
│   ├── Card/               # Card display, suits, face art, animations
│   ├── Hand/               # Fan layout and card positioning
│   ├── ScoreDisplay/       # Chips × Mult = Total animation
│   ├── ScoreBoard/         # Hands left / discards left counters
│   ├── JokerBar/           # Active joker cards with sprites
│   ├── AnteInfo/           # Ante label + score progress bar
│   └── EndScreen/          # Win/lose overlay modal
├── logic/
│   ├── evaluateHand.js     # Poker hand detection + scoring card selection
│   └── calculateScore.js   # Base scores, card chip values, joker bonuses
├── hooks/
│   └── usePlayHand.js      # Animation state machine (IDLE → RAISING → SCORING → REVEALING → DONE)
├── config/
│   └── gameConfig.js       # MAX_HANDS, MAX_DISCARDS, MAX_ANTES, ANTE_TARGETS, JOKERS
├── utils/
│   └── deck.js             # createDeck, shuffle, dealCards, discardAndDraw
└── App.jsx                 # Main game state, screen routing (menu / game)
```

---

## Configuration

All core constants live in `src/config/gameConfig.js`:

```js
export const MAX_HANDS    = 4   // hands per ante
export const MAX_DISCARDS = 3   // discards per ante
export const MAX_ANTES    = 2   // number of antes in a run

export const ANTE_TARGETS = {
  1: 300,
  2: 800,
}
```

To add more antes, extend `ANTE_TARGETS` and bump `MAX_ANTES`.

---
