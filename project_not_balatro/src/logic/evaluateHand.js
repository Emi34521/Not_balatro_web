/**
 * evaluateHand.js
 * Evalúa una mano de 1-5 cartas y devuelve el tipo de mano.
 *
 * @param {Card[]} cards - array de cartas { rank, suit, value }
 * @returns {string} tipo de mano
 */

// Valor especial del As para straight A-2-3-4-5
const ACE_LOW = 1
const ACE_HIGH = 14

export const HAND_TYPES = {
  ROYAL_FLUSH:    'Royal Flush',
  STRAIGHT_FLUSH: 'Straight Flush',
  FOUR_OF_A_KIND: 'Four of a Kind',
  FULL_HOUSE:     'Full House',
  FLUSH:          'Flush',
  STRAIGHT:       'Straight',
  THREE_OF_A_KIND:'Three of a Kind',
  TWO_PAIR:       'Two Pair',
  ONE_PAIR:           'Pair',
  HIGH_CARD:      'High Card',
}

/**
 * Agrupa las cartas por valor.
 * Devuelve un objeto { count: [values...] }
 * Ej: { 2: [5, 5], 3: [10] } → par de 5s y trío de 10s
 */
function getGroups(values) {
  const freq = {}
  for (const v of values) {
    freq[v] = (freq[v] ?? 0) + 1
  }

  const groups = {}
  for (const [val, count] of Object.entries(freq)) {
    if (!groups[count]) groups[count] = []
    groups[count].push(Number(val))
  }
  return groups
}

/**
 * Comprueba si los valores forman una escalera.
 * Maneja el caso especial A-2-3-4-5 (rueda).
 */
function checkStraight(sortedValues) {
  if (sortedValues.length < 5) return false

  // Escalera normal: cada valor es consecutivo al anterior
  const isNormal = sortedValues.every(
    (v, i) => i === 0 || v === sortedValues[i - 1] + 1
  )
  if (isNormal) return true

  // Caso especial: A-2-3-4-5 (el As vale 1)
  // Los valores ordenados serían [1, 2, 3, 4, 5] con value=1 para el As
  const isWheel =
    sortedValues[0] === ACE_LOW &&
    sortedValues[1] === 2 &&
    sortedValues[2] === 3 &&
    sortedValues[3] === 4 &&
    sortedValues[4] === 5

  return isWheel
}

/**
 * Comprueba si es Royal Flush (escalera de color de 10 a As).
 */
function checkRoyalFlush(sortedValues, isFlush) {
  if (!isFlush) return false
  return (
    sortedValues.length === 5 &&
    sortedValues[0] === 10 &&
    sortedValues[4] === ACE_HIGH // el As tiene value=13 en deck.js, ajusta si usas 14
  )
}

/**
 * Función principal de evaluación.
 *
 * @param {Card[]} cards - entre 1 y 5 cartas
 * @returns {{ handType: string, handName: string }}
 */
export function evaluateHand(cards) {
  if (!cards || cards.length === 0) {
    return { handType: null, handName: '' }
  }

  // Con menos de 5 cartas solo podemos detectar pares/tríos/póker
  const values = cards.map(c => c.value).sort((a, b) => a - b)
  const isFlush  = cards.length === 5 && cards.every(c => c.suit === cards[0].suit)
  const isStraight = checkStraight(values)
  const groups   = getGroups(values)

  // — Manos de 5 cartas —
  if (cards.length === 5) {
    // Royal Flush: escalera de color 10-J-Q-K-A
    // En deck.js: A=1, J=11, Q=12, K=13 → la escalera real sería [1,10,11,12,13]
    // Comprobamos si es flush + straight + tiene As (value=1) + K (value=13)
    const hasAce = values.includes(1)
    const hasKing = values.includes(13)
    if (isFlush && isStraight && hasAce && hasKing) {
      return { handType: HAND_TYPES.ROYAL_FLUSH, handName: HAND_TYPES.ROYAL_FLUSH }
    }

    if (isFlush && isStraight) {
      return { handType: HAND_TYPES.STRAIGHT_FLUSH, handName: HAND_TYPES.STRAIGHT_FLUSH }
    }

    if (isFlush) {
      return { handType: HAND_TYPES.FLUSH, handName: HAND_TYPES.FLUSH }
    }

    if (isStraight) {
      return { handType: HAND_TYPES.STRAIGHT, handName: HAND_TYPES.STRAIGHT }
    }
  }

  // — Manos por grupos (funcionan con cualquier número de cartas) —
  if (groups[4]) {
    return { handType: HAND_TYPES.FOUR_OF_A_KIND, handName: HAND_TYPES.FOUR_OF_A_KIND }
  }

  if (groups[3] && groups[2]) {
    return { handType: HAND_TYPES.FULL_HOUSE, handName: HAND_TYPES.FULL_HOUSE }
  }

  if (groups[3]) {
    return { handType: HAND_TYPES.THREE_OF_A_KIND, handName: HAND_TYPES.THREE_OF_A_KIND }
  }

  if (groups[2]?.length >= 2) {
    return { handType: HAND_TYPES.TWO_PAIR, handName: HAND_TYPES.TWO_PAIR }
  }

  if (groups[2]) {
    return { handType: HAND_TYPES.ONE_PAIR, handName: HAND_TYPES.ONE_PAIR }
  }

  return { handType: HAND_TYPES.HIGH_CARD, handName: HAND_TYPES.HIGH_CARD }
}