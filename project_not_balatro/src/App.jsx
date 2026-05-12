import { useState, useMemo } from 'react'
import { Hand } from './components/Hand/Hand'
import { Button } from './components/Button/Button'
import { createDeck, dealCards } from './utils/deck'
import { evaluateHand, HAND_TYPES } from './logic/evaluateHand'
import './App.css'

// Tabla de puntuación base del README
const HAND_SCORES = {
  [HAND_TYPES.HIGH_CARD]:      { chips: 5,   mult: 1 },
  [HAND_TYPES.ONE_PAIR]:       { chips: 10,  mult: 2 },
  [HAND_TYPES.TWO_PAIR]:       { chips: 20,  mult: 2 },
  [HAND_TYPES.THREE_OF_A_KIND]:{ chips: 30,  mult: 3 },
  [HAND_TYPES.STRAIGHT]:       { chips: 30,  mult: 4 },
  [HAND_TYPES.FLUSH]:          { chips: 35,  mult: 4 },
  [HAND_TYPES.FULL_HOUSE]:     { chips: 40,  mult: 4 },
  [HAND_TYPES.FOUR_OF_A_KIND]: { chips: 60,  mult: 7 },
  [HAND_TYPES.STRAIGHT_FLUSH]: { chips: 100, mult: 8 },
  [HAND_TYPES.ROYAL_FLUSH]:    { chips: 100, mult: 8 },
}
const SUIT_ORDER = { spades: 0, hearts: 1, diamonds: 2, clubs: 3 }

function App() {
  const [hand, setHand] = useState(() => dealCards(createDeck(), 8).hand)
  const [selectedIds, setSelectedIds] = useState([])

  const [sortMode, setSortMode] = useState(null) // null | 'rank' | 'suit'
    const displayHand = useMemo(() => {
    if (sortMode === 'rank') return [...hand].sort((a, b) => a.value - b.value)
    if (sortMode === 'suit') return [...hand].sort(
      (a, b) => SUIT_ORDER[a.suit] - SUIT_ORDER[b.suit] || a.value - b.value
    )
    return hand
  }, [hand, sortMode])

  // Seleccionar / deseleccionar carta (máx 5)
  const handleCardSelect = ({ id }) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id)
      if (prev.length >= 5) return prev
      return [...prev, id]
    })
  }

  // Evaluación reactiva: se recalcula cada vez que cambia selectedIds
  const evaluation = useMemo(() => {
    if (selectedIds.length === 0) return null
    const selectedCards = hand.filter(c => selectedIds.includes(c.id))
    return evaluateHand(selectedCards)
  }, [selectedIds, hand])

  const score = evaluation?.handType ? HAND_SCORES[evaluation.handType] : null

  // Nueva mano
  const handleNewHand = () => {
    setHand(dealCards(createDeck(), 8).hand)
    setSelectedIds([])
  }

  return (
    <div className="game">
      <h1 className="game__title">Not Balatro</h1>
 
      <div className="game__eval">
        {evaluation && score ? (
          <>
            <span className="eval__hand-name">{evaluation.handName}</span>
            <span className="eval__chips">{score.chips} chips</span>
            <span className="eval__mult">x{score.mult}</span>
            <span className="eval__total">{score.chips * score.mult} pts</span>
          </>
        ) : (
          <span className="eval__hint">
            {selectedIds.length === 0
              ? 'Selecciona entre 1 y 5 cartas'
              : `${selectedIds.length} carta${selectedIds.length > 1 ? 's' : ''} seleccionada${selectedIds.length > 1 ? 's' : ''}`}
          </span>
        )}
      </div>
 
      <Hand
        cards={displayHand}
        selectedIds={selectedIds}
        onCardSelect={handleCardSelect}
      />
 
      <div className="game__actions">
        <Button variant="primary" size="lg" disabled={selectedIds.length === 0}
          onClick={() => console.log('Play hand:', selectedIds)}>
          Play Hand
        </Button>
        <Button variant="danger" size="lg" disabled={selectedIds.length === 0}
          onClick={() => console.log('Discard:', selectedIds)}>
          Discard ({selectedIds.length})
        </Button>
      </div>
 
      <div className="game__secondary">
        <Button variant="outline" size="sm" onClick={() => handleSort('rank')}
          className={sortMode === 'rank' ? 'btn--active' : ''}>
          Sort Rank
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleSort('suit')}
          className={sortMode === 'suit' ? 'btn--active' : ''}>
          Sort Suit
        </Button>
        <Button variant="ghost" size="sm" onClick={handleNewHand}>
          Nueva mano
        </Button>
      </div>
    </div>
  )
}
 
export default App