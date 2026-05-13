import { useState, useMemo } from 'react'
import { Hand }         from './components/Hand/Hand'
import { Button }       from './components/Button/Button'
import { ScoreDisplay } from './components/ScoreDisplay/ScoreDisplay'
import { usePlayHand, PLAY_PHASE } from './hooks/usePlayHand'
import { createDeck, dealCards }   from './utils/deck'
import { evaluateHand }            from './logic/evaluateHand'
import './App.css'

const SUIT_ORDER = { spades: 0, hearts: 1, diamonds: 2, clubs: 3 }

function createInitialState() {
  const { hand, remaining } = dealCards(createDeck(), 8)
  return { hand, remaining }
}

function App() {
  const [{ hand, remaining }, setGameState] = useState(createInitialState)
  const [selectedIds, setSelectedIds]       = useState([])
  const [sortMode, setSortMode]             = useState(null)
  const [discardsLeft, setDiscardsLeft]     = useState(3)

  const setHand      = h => setGameState(prev => ({ ...prev, hand: h }))
  const setRemaining = r => setGameState(prev => ({ ...prev, remaining: r }))

  const {
    phase, scoringCardIds, activeCardId,
    displayChips, displayMult, displayTotal,
    handResult, playHand, reset, isAnimating,
  } = usePlayHand({ hand, setHand, remaining, setRemaining })

  // displayHand respeta el sort activo
  const displayHand = useMemo(() => {
    if (sortMode === 'rank') return [...hand].sort((a, b) => a.value - b.value)
    if (sortMode === 'suit') return [...hand].sort(
      (a, b) => SUIT_ORDER[a.suit] - SUIT_ORDER[b.suit] || a.value - b.value
    )
    return hand
  }, [hand, sortMode])

  const liveEval = useMemo(() => {
    if (isAnimating || selectedIds.length === 0) return null
    return evaluateHand(hand.filter(c => selectedIds.includes(c.id)))
  }, [selectedIds, hand, isAnimating])

  const handleCardSelect = ({ id }) => {
    if (isAnimating) return
    setSelectedIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id)
      if (prev.length >= 5)  return prev
      return [...prev, id]
    })
  }

  const handlePlayHand = () => {
    if (selectedIds.length === 0 || isAnimating) return
    // Pasamos displayHand para respetar el orden visual
    playHand(selectedIds, displayHand).then(() => setSelectedIds([]))
  }

  const handleDiscard = () => {
    if (selectedIds.length === 0 || isAnimating || discardsLeft <= 0) return
    const kept   = hand.filter(c => !selectedIds.includes(c.id))
    const drawn  = remaining.slice(0, selectedIds.length)
    const newRem = remaining.slice(selectedIds.length)
    setHand([...kept, ...drawn])
    setRemaining(newRem)
    setDiscardsLeft(d => d - 1)
    setSelectedIds([])
  }

  const handleSort  = mode => setSortMode(prev => prev === mode ? null : mode)

  const handleNewHand = () => {
    reset()
    setGameState(createInitialState())
    setSelectedIds([])
    setSortMode(null)
    setDiscardsLeft(3)
  }

  return (
    <div className="game">
      //tipografía tipo 'pixelart' similar al que utiliza el videojuego balatro
      <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet"></link>
      <h1 className="game__title">Not Balatro</h1>

      <ScoreDisplay
        phase={phase}
        handResult={handResult ?? (liveEval ? { handName: liveEval.handName } : null)}
        displayChips={displayChips}
        displayMult={displayMult}
        displayTotal={displayTotal}
        selectedCount={selectedIds.length}
      />

      <Hand
        cards={displayHand}
        selectedIds={selectedIds}
        scoringCardIds={scoringCardIds}
        activeCardId={activeCardId}
        isAnimating={isAnimating}
        onCardSelect={handleCardSelect}
      />

      <div className="game__actions">
        <Button variant="primary" size="lg"
          disabled={selectedIds.length === 0 || isAnimating}
          onClick={handlePlayHand}>
          Play Hand
        </Button>
        <Button variant="danger" size="lg"
          disabled={selectedIds.length === 0 || isAnimating || discardsLeft <= 0}
          onClick={handleDiscard}>
          Discard ({discardsLeft})
        </Button>
      </div>

      <div className="game__secondary">
        <Button variant="outline" size="sm" disabled={isAnimating}
          onClick={() => handleSort('rank')}
          className={sortMode === 'rank' ? 'btn--active' : ''}>
          Sort Rank
        </Button>
        <Button variant="outline" size="sm" disabled={isAnimating}
          onClick={() => handleSort('suit')}
          className={sortMode === 'suit' ? 'btn--active' : ''}>
          Sort Suit
        </Button>
        <Button variant="ghost" size="sm" disabled={isAnimating}
          onClick={handleNewHand}>
          Nueva mano
        </Button>
        <span className="game__deck-count">{remaining.length} en mazo</span>
      </div>
    </div>
  )
}

export default App