/**
 * evaluateHand.js
 * Evalúa una mano de 1-5 cartas y devuelve el tipo de mano
 * + qué cartas realmente puntúan (scoring cards).
 */

export const HAND_TYPES = {
  ROYAL_FLUSH:    'Royal Flush',
  STRAIGHT_FLUSH: 'Straight Flush',
  FOUR_OF_A_KIND: 'Four of a Kind',
  FULL_HOUSE:     'Full House',
  FLUSH:          'Flush',
  STRAIGHT:       'Straight',
  THREE_OF_A_KIND:'Three of a Kind',
  TWO_PAIR:       'Two Pair',
  ONE_PAIR:       'Pair',
  HIGH_CARD:      'High Card',
}

function getGroups(cards) {
  const freq = {}
  for (const c of cards) {
    freq[c.value] = (freq[c.value] ?? 0) + 1
  }
  // groups[n] = array de cartas que aparecen n veces
  const groups = {}
  for (const [val, count] of Object.entries(freq)) {
    if (!groups[count]) groups[count] = []
    groups[count].push(Number(val))
  }
  return groups
}

function checkStraight(sortedValues) {
  if (sortedValues.length < 5) return false

  const isNormal = sortedValues.every(
    (v, i) => i === 0 || v === sortedValues[i - 1] + 1
  )
  if (isNormal) return true

  // Rueda: A-2-3-4-5
  if (
    sortedValues[0] === 1 &&
    sortedValues[1] === 2 &&
    sortedValues[2] === 3 &&
    sortedValues[3] === 4 &&
    sortedValues[4] === 5
  ) return true

  // función nueva, para el caso de A-K-Q-J-10
  if (
    sortedValues[0] === 1  &&
    sortedValues[1] === 10 &&
    sortedValues[2] === 11 &&
    sortedValues[3] === 12 &&
    sortedValues[4] === 13
  ) return true

  return false
}

/**
 * Devuelve los ids de las cartas que realmente puntúan según la mano.
 * Las cartas que NO están en scoringIds son "kickers" y no animan.
 */
function getScoringCards(handType, cards, groups) {
  const { HAND_TYPES: H } = { HAND_TYPES }

  switch (handType) {
    case HAND_TYPES.ROYAL_FLUSH:
    case HAND_TYPES.STRAIGHT_FLUSH:
    case HAND_TYPES.FLUSH:
    case HAND_TYPES.STRAIGHT:
      // Todas las cartas puntúan
      return cards.map(c => c.id)

    case HAND_TYPES.FOUR_OF_A_KIND: {
      const val = groups[4][0]
      return cards.filter(c => c.value === val).map(c => c.id)
    }

    case HAND_TYPES.FULL_HOUSE: {
      // Trío + par → todas puntúan
      return cards.map(c => c.id)
    }

    case HAND_TYPES.THREE_OF_A_KIND: {
      const val = groups[3][0]
      return cards.filter(c => c.value === val).map(c => c.id)
    }

    case HAND_TYPES.TWO_PAIR: {
      // Los dos pares más altos
      const pairVals = (groups[2] ?? []).sort((a, b) => b - a).slice(0, 2)
      return cards.filter(c => pairVals.includes(c.value)).map(c => c.id)
    }

    case HAND_TYPES.ONE_PAIR: {
      const val = (groups[2] ?? []).sort((a, b) => b - a)[0]
      return cards.filter(c => c.value === val).map(c => c.id)
    }

    case HAND_TYPES.HIGH_CARD: {
      // Solo la carta más alta
      const maxVal = Math.max(...cards.map(c => c.value))
      const highCard = cards.find(c => c.value === maxVal)
      return highCard ? [highCard.id] : []
    }

    default:
      return cards.map(c => c.id)
  }
}

/**
 * Función principal de evaluación.
 * @param {Card[]} cards - entre 1 y 5 cartas
 * @returns {{ handType, handName, scoringCardIds }}
 */
export function evaluateHand(cards) {
  if (!cards || cards.length === 0) {
    return { handType: null, handName: '', scoringCardIds: [] }
  }

  const values      = cards.map(c => c.value).sort((a, b) => a - b)
  const isFlush     = cards.length === 5 && cards.every(c => c.suit === cards[0].suit)
  const isStraight  = checkStraight(values)
  const groups      = getGroups(cards)

  let handType

  if (cards.length === 5) {
    const hasAce  = values.includes(1)
    const hasKing = values.includes(13)
    if (isFlush && isStraight && hasAce && hasKing) handType = HAND_TYPES.ROYAL_FLUSH
    else if (isFlush && isStraight)                 handType = HAND_TYPES.STRAIGHT_FLUSH
    else if (isFlush)                               handType = HAND_TYPES.FLUSH
    else if (isStraight)                            handType = HAND_TYPES.STRAIGHT
  }

  if (!handType) {
    if (groups[4])                   handType = HAND_TYPES.FOUR_OF_A_KIND
    else if (groups[3] && groups[2]) handType = HAND_TYPES.FULL_HOUSE
    else if (groups[3])              handType = HAND_TYPES.THREE_OF_A_KIND
    else if (groups[2]?.length >= 2) handType = HAND_TYPES.TWO_PAIR
    else if (groups[2])              handType = HAND_TYPES.ONE_PAIR
    else                             handType = HAND_TYPES.HIGH_CARD
  }

  const scoringCardIds = getScoringCards(handType, cards, groups)

  return { handType, handName: handType, scoringCardIds }
}