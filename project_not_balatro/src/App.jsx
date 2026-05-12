import { useState, useMemo } from 'react'
import { Hand } from './components/Hand/Hand'
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

function App() {
  const [hand, setHand] = useState(() => dealCards(createDeck(), 8).hand)
  const [selectedIds, setSelectedIds] = useState([])

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
      <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet"></link>
      <h1 className="game__title">Not Balatro</h1>
      {/* Resultado de la evaluación */}
      <div className="game__eval">
        {evaluation && score ? (
          <>
            <span className="eval__hand-name">{evaluation.handName}</span>
            <span className="eval__chips">{score.chips} chips</span>
            <span className="eval__mult">×{score.mult}</span>
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

      {/* Mano */}
      <Hand
        cards={hand}
        selectedIds={selectedIds}
        onCardSelect={handleCardSelect}
      />

      {/* Acciones */}
      <div className="game__actions">
        <button className="btn" onClick={handleNewHand}>
          Nueva mano
        </button>
      </div>
    </div>
  )
}

export default App