# Web project "Not Balatro"

> A React-based card game inspired by Balatro.

---

##  Project Overview

**Not Balatro** is a simplified poker-based roguelike card game built with React. The player builds a deck, plays poker hands to score points, survives increasingly difficult antes, and uses jokers, vouchers, and shop upgrades to reach the end.

---

##  Feature Breakdown & Task Division

---

### 1. Poker Hands & Scoring System

**Description:** The core scoring engine. Each hand played is evaluated and assigned a score based on its rank. Scores are calculated as `Chips × Multiplier`.

**Hands to implement (ascending order):**

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

**Functions:**
- `evaluateHand(cards[])` → detects hand type
- `calculateScore(handType, cards[], activeJokers[])` → returns `{ chips, mult, total }`
- `applyJokerModifiers(score, jokers[])` → applies joker bonuses on top of base score

---

### 2. Discard System

**Description:** Players can discard a set of selected cards from their hand to redraw new ones. The number of discards per round is limited.

**Rules:**
- Player starts each round with a fixed number of discards (default: 3)
- Discarded cards are drawn from the remaining deck
- Discards reset at the start of each new blind

**Functions:**
- `discardCards(selectedCards[], hand[], deck[])` → removes selected, draws replacements
- `resetDiscards(maxDiscards)` → resets discard count at the start of a blind
- `getRemainingDiscards(state)` → returns how many discards are left

---

### 3.  Jokers (8 total)

**Description:** Passive effect cards that modify scoring or gameplay. Players can hold up to 5 jokers at a time.

**Jokers to implement:**

| # | Name | Effect |
|---|---|---|
| 1 | Jolly Joker | +8 Mult if hand contains a Pair |
| 2 | Zany Joker | +12 Mult if hand contains a Three of a Kind |
| 3 | Mad Joker | +10 Mult if hand contains a Two Pair |
| 4 | Crazy Joker | +12 Mult if hand contains a Straight |
| 5 | Droll Joker | +10 Mult if hand contains a Flush |
| 6 | Half Joker | +20 Mult if hand has 3 or fewer cards |
| 7 | Greedy Joker | Diamonds score +3 Chips each |
| 8 | Wrathful Joker | Spades score +3 Mult each |

**Functions:**
- `applyJoker(joker, handType, cards[])` → returns score modifier for a single joker
- `getJokerEffect(jokerId)` → returns joker metadata and effect description
- `canEquipJoker(jokerSlots[])` → validates if a new joker can be added

---

### 4.  Shop

**Description:** Between blinds, the player visits the shop to buy jokers, vouchers, tarot/planet cards, and booster packs using in-game currency ($).

**Shop inventory per visit:**
- 2 Jokers (random)
- 1 Voucher
- 1–2 Booster Packs

**Functions:**
- `generateShopInventory(ante)` → returns randomized list of items for sale
- `buyItem(item, playerGold)` → deducts cost and adds item to player state
- `rerollShop(playerGold)` → refreshes inventory for a cost (default: $5)
- `sellJoker(joker)` → removes joker and returns sell value

---

### 5.  Vouchers

**Description:** Permanent upgrades purchased in the shop that persist for the entire run.

**Vouchers to implement:**

| # | Name | Effect |
|---|---|---|
| 1 | Overstock | Shop has +1 card slot |
| 2 | Clearance Sale | All shop items cost 25% less |
| 3 | Hone | Foil/holographic cards appear 2× more |
| 4 | Reroll Surplus | Reroll costs $2 instead of $5 |
| 5 | Crystal Ball | +1 consumable slot |

**Functions:**
- `applyVoucher(voucher, gameState)` → mutates game state with voucher's effect
- `getActiveVouchers(state)` → returns list of currently active vouchers
- `isVoucherUnlocked(voucherId, ante)` → checks if voucher is available at current ante

---

### 6.  Booster Packs

**Description:** Packs bought in the shop that contain randomized cards, planet cards, or jokers.

**Pack types:**

| Pack | Contents |
|---|---|
| Standard Pack | 2 playing cards, choose 1 |
| Arcana Pack | 2 tarot cards, choose 1 |
| Celestial Pack | 2 planet cards, choose 1 |
| Joker Pack | 2 jokers, choose 1 |

**Planet Cards** (upgrade a poker hand's base score permanently):

| Planet | Hand Upgraded |
|---|---|
| Mercury | One Pair |
| Venus | Three of a Kind |
| Earth | Full House |
| Mars | Four of a Kind |
| Jupiter | Flush |
| Saturn | Straight |
| Uranus | Two Pair |
| Neptune | Straight Flush |

**Functions:**
- `openPack(packType)` → returns array of random cards/items to choose from
- `applyPlanetCard(planet, handLevels)` → upgrades the base score of a specific hand
- `choosePack(selection, packContents[])` → applies chosen item to player state

---

### 7.  Decks

**Description:** The player selects a starting deck before the run begins. Each deck provides a unique starting bonus or rule modifier.

**Decks:**

| Deck | Effect |
|---|---|
| Red Deck | +1 discard per round |
| Yellow Deck | Start with $10 extra |
| Plasma Deck | Balances Chips and Mult (average both), doubles the result |

**Functions:**
- `applyDeckBonus(deckType, initialState)` → modifies starting game state based on deck
- `getDeckInfo(deckId)` → returns name, description, and effect of a deck

---

### 8.  Difficulty Levels

**Description:** Difficulty affects score requirements and gold rewards. Selected at run start.

| Difficulty | Score Multiplier | Gold Modifier |
|---|---|---|
| White Stake | ×1.0 | Standard |
| Red Stake | ×1.5 | −$1 per blind |
| Black Stake | ×2.0 | −$2, fewer shop items |

**Functions:**
- `getDifficultyModifier(difficulty)` → returns score and gold multipliers
- `applyDifficulty(blindScore, difficulty)` → returns adjusted blind score target

---

### 9. Antes & Blinds

**Description:** The run is divided into 8 antes. Each ante has 3 blinds: Small Blind, Big Blind, and Boss Blind.

**Structure:**

| Ante | Small Blind | Big Blind | Boss Blind |
|---|---|---|---|
| 1 | 300 | 450 | 600 |
| 2 | 800 | 1,200 | 1,600 |
| 3 | 2,000 | 3,000 | 4,000 |
| ... | scales up | scales up | scales up |

**Rules:**
- Player must reach the blind's score target within a limited number of hands played
- Winning a blind awards gold and progresses to the next
- Skipping a Small or Big Blind sacrifices gold for a tag reward

**Functions:**
- `getBlindTarget(ante, blindType, difficulty)` → returns score target
- `advanceBlind(state)` → moves to the next blind or ante
- `calculateBlindReward(ante, blindType)` → returns gold earned on win
- `skipBlind(blindType, state)` → applies tag reward and skips to next

---

### 10. Boss Blinds & Debuffs

**Description:** The third blind of each ante is a Boss Blind with a unique debuff that challenges the player for that round only.

**Boss Blinds to implement:**

| Boss | Debuff |
|---|---|
| The Hook | Discards 2 random cards from hand each round |
| The Ox | Playing most common suit sets money to $0 |
| The House | All cards dealt face-down |
| The Wall | Extra large blind (×2 score target) |
| The Wheel | 1 in 7 cards are drawn face-down |
| The Arm | Decrease level of played hand by 1 after scoring |
| The Club | All Club cards are debuffed (no score) |
| The Eye | No repeated hand types allowed in a round |

**Functions:**
- `getBossBlind(ante)` → returns a random boss blind for the given ante
- `applyBossDebuff(bossId, gameState)` → activates debuff at round start
- `removeBossDebuff(gameState)` → clears debuff after boss blind is defeated

---

## State Management Overview

The global game state should track:

```js
{
  deck: Card[],
  hand: Card[],
  jokers: Joker[],
  vouchers: Voucher[],
  handLevels: { [handType]: { chips, mult, level } },
  gold: number,
  ante: number,
  blind: "small" | "big" | "boss",
  score: number,
  handsLeft: number,
  discardsLeft: number,
  selectedDeck: "red" | "yellow" | "plasma",
  difficulty: "white" | "red" | "black",
  activeBoss: Boss | null,
  shopInventory: ShopItem[],
}
```

---

## Suggested Component Structure

```
src/
├── components/
│   ├── Hand/               # Card display and selection
│   ├── ScoreDisplay/       # Chips, Mult, Total
│   ├── JokerSlots/         # Active joker cards
│   ├── Shop/               # Shop UI and items
│   ├── BlindInfo/          # Current ante/blind info
│   ├── BossBlind/          # Boss card and debuff
│   └── DeckSelector/       # Run start screen
├── logic/
│   ├── evaluateHand.js
│   ├── calculateScore.js
│   ├── jokers.js
│   ├── blinds.js
│   ├── shop.js
│   ├── packs.js
│   └── decks.js
├── state/
│   └── gameState.js        # Context or Zustand store
└── App.jsx
```

---

##  Development Order

1. **Core engine** — hand evaluator + scoring (`evaluateHand`, `calculateScore`)
2. **Game loop** — hand/discard flow, blind progression
3. **Jokers** — modifiers on top of scoring
4. **Decks & difficulty** — run start configuration
5. **Antes & boss blinds** — full progression + debuffs
6. **Shop & currency** — buy/sell/reroll
7. **Vouchers** — persistent run upgrades
8. **Booster packs & planets** — hand level upgrades
9. **UI polish** — animations, transitions, sound (optional)

---