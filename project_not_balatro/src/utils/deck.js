const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
const SUITS = ['hearts', 'diamonds', 'clubs', 'spades']

/**
 * Crea una baraja estándar de 52 cartas.
 * Cada carta: { id, rank, suit, value }
 */
export function createDeck() {
  return SUITS.flatMap((suit) =>
    RANKS.map((rank, i) => ({
      id: `${rank}-${suit}`,
      rank,
      suit,
      value: i + 1, // A=1, 2=2, ..., K=13
    }))
  )
}

/**
 * Mezcla un array usando Fisher-Yates.
 */
export function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/**
 * Reparte `count` cartas del deck.
 * Devuelve { hand: Card[], remaining: Card[] }
 */
export function dealCards(deck, count = 8) {
  const shuffled = shuffle(deck)
  return {
    hand: shuffled.slice(0, count),
    remaining: shuffled.slice(count),
  }
}

/**
 * Descarta las cartas seleccionadas y reparte nuevas del deck restante.
 * @param {Card[]} hand - mano actual
 * @param {string[]} selectedIds - ids de cartas a descartar
 * @param {Card[]} remaining - cartas restantes en el mazo
 * @returns {{ hand: Card[], remaining: Card[], discarded: Card[] }}
 */
export function discardAndDraw(hand, selectedIds, remaining) {
  const kept = hand.filter((c) => !selectedIds.includes(c.id))
  const discarded = hand.filter((c) => selectedIds.includes(c.id))
  const drawCount = discarded.length
  const drawn = remaining.slice(0, drawCount)
  return {
    hand: [...kept, ...drawn],
    remaining: remaining.slice(drawCount),
    discarded,
  }
}