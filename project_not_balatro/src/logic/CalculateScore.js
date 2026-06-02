/**
 * calculateScore.js
 * Calcula los chips que aporta cada carta individualmente
 * y el score base de la mano.
 */

import { HAND_TYPES } from './evaluateHand'

// Score base por tipo de mano (del README)
export const BASE_SCORES = {
  [HAND_TYPES.HIGH_CARD]:       { chips: 5,   mult: 1 },
  [HAND_TYPES.ONE_PAIR]:        { chips: 10,  mult: 2 },
  [HAND_TYPES.TWO_PAIR]:        { chips: 20,  mult: 2 },
  [HAND_TYPES.THREE_OF_A_KIND]: { chips: 30,  mult: 3 },
  [HAND_TYPES.STRAIGHT]:        { chips: 30,  mult: 4 },
  [HAND_TYPES.FLUSH]:           { chips: 35,  mult: 4 },
  [HAND_TYPES.FULL_HOUSE]:      { chips: 40,  mult: 4 },
  [HAND_TYPES.FOUR_OF_A_KIND]:  { chips: 60,  mult: 7 },
  [HAND_TYPES.STRAIGHT_FLUSH]:  { chips: 100, mult: 8 },
  [HAND_TYPES.ROYAL_FLUSH]:     { chips: 100, mult: 8 },
}

// Chips que aporta cada carta individualmente al ser jugada
// As=11, figuras=10, resto=valor nominal
export function getCardChips(card) {
  if (card.value === 1)  return 11 // As
  if (card.value >= 11)  return 10 // J, Q, K
  return card.value             // 2-10 valen su número
}

/**
 * Calcula el score completo de la mano.
 *
 * @param {string}   handType       - tipo de mano (de HAND_TYPES)
 * @param {Card[]}   scoringCards   - solo las cartas que puntúan
 * @returns {{ baseChips, baseMult, cardChips, totalChips, total }}
 */
export function calculateScore(handType, scoringCards, activeJokers = []) {
  const base = BASE_SCORES[handType] ?? { chips: 0, mult: 1 }

  // Chips que aporta cada carta individualmente
  const cardChipsBreakdown = scoringCards.map(card => ({
    id:    card.id,
    rank:  card.rank,
    suit:  card.suit,
    chips: getCardChips(card),
  }))

  const totalCardChips = cardChipsBreakdown.reduce((sum, c) => sum + c.chips, 0)
  const jokerChipsBonus = activeJokers.reduce((sum, joker) => sum + (joker.bonusChips ?? 0), 0)
  const jokerMultBonus = activeJokers.reduce((sum, joker) => sum + (joker.bonusMult ?? 0), 0)
  const totalChips     = base.chips + totalCardChips + jokerChipsBonus
  const totalMult      = base.mult + jokerMultBonus
  const total          = totalChips * totalMult

  return {
    baseChips:  base.chips,
    baseMult:   totalMult,
    cardChips:  cardChipsBreakdown,
    jokerChipsBonus,
    jokerMultBonus,
    totalChips,
    total,
  }
}