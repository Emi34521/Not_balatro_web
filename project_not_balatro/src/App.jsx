import { useState, useMemo, useCallback } from 'react'
import { Hand }         from './components/Hand/Hand'
import { Button }       from './components/Button/Button'
import { ScoreDisplay } from './components/ScoreDisplay/ScoreDisplay'
import { ScoreBoard }   from './components/ScoreBoard/ScoreBoard'
import { usePlayHand, PLAY_PHASE } from './hooks/usePlayHand'
import { createDeck, dealCards }   from './utils/deck'
import { evaluateHand }            from './logic/evaluateHand'
import './App.css'

const SUIT_ORDER   = { spades: 0, hearts: 1, diamonds: 2, clubs: 3 }
const MAX_HANDS    = 4
const MAX_DISCARDS = 3

function createInitialState() {
  const { hand, remaining } = dealCards(createDeck(), 8)
  return { hand, remaining }
}

function App() {
  const [{ hand, remaining }, setGameState] = useState(createInitialState)
  const [selectedIds, setSelectedIds]       = useState([])
  const [sortMode, setSortMode]             = useState(null)

  // ── Contadores de mano ─────────────────────────────────
  const [handsLeft, setHandsLeft]     = useState(MAX_HANDS)
  const [discardsLeft, setDiscardsLeft] = useState(MAX_DISCARDS)
  const [gameOver, setGameOver]         = useState(false)

  // ── Puntuación ─────────────────────────────────────────
  const [totalScore, setTotalScore] = useState(0)
  const [lastScore, setLastScore]   = useState(null)

  const setHand      = h => setGameState(prev => ({ ...prev, hand: h }))
  const setRemaining = r => setGameState(prev => ({ ...prev, remaining: r }))

  const {
    phase, scoringCardIds, activeCardId,
    displayChips, displayMult, displayTotal,
    handResult, playHand, reset, isAnimating,
  } = usePlayHand({ hand, setHand, remaining, setRemaining })

  // ── displayHand respeta el sort activo ─────────────────
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

  const handlePlayHand = useCallback(async () => {
    if (selectedIds.length === 0 || isAnimating || handsLeft <= 0) return

    // Calculamos el score de esta mano para actualizarlo al terminar
    const selectedCards = displayHand.filter(c => selectedIds.includes(c.id))
    const { handType } = evaluateHand(selectedCards)
    const { calculateScore } = await import('./logic/calculateScore')
    const { scoringCardIds: sIds } = evaluateHand(selectedCards)
    const scoringCards = selectedCards.filter(c => sIds.includes(c.id))
    const { total } = calculateScore(handType, scoringCards)

    setHandsLeft(prev => prev - 1)
    setLastScore(total)
    setTotalScore(prev => prev + total)

    await playHand(selectedIds, displayHand)
    setSelectedIds([])

    // Si se acabaron las manos, marcar game over tras la animación
    setHandsLeft(prev => {
      if (prev <= 0) setGameOver(true)
      return prev
    })
  }, [selectedIds, isAnimating, handsLeft, displayHand, playHand])

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

  const handleSort = mode => setSortMode(prev => prev === mode ? null : mode)

  const handleNewGame = () => {
    reset()
    setGameState(createInitialState())
    setSelectedIds([])
    setSortMode(null)
    setHandsLeft(MAX_HANDS)
    setDiscardsLeft(MAX_DISCARDS)
    setTotalScore(0)
    setLastScore(null)
    setGameOver(false)
  }

  return (
    <div className="game">
      {/* tipografía tipo 'pixelart' similar al que utiliza el videojuego balatro */}
      <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />
      <h1 className="game__title">Not Balatro</h1>

      {/* ── Marcador ─────────────────────────────────────── */}
      <ScoreBoard
        totalScore={totalScore}
        handsLeft={handsLeft}
        lastScore={lastScore}
      />

      <ScoreDisplay
        phase={phase}
        handResult={handResult ?? (liveEval ? { handName: liveEval.handName } : null)}
        displayChips={displayChips}
        displayMult={displayMult}
        displayTotal={displayTotal}
        selectedCount={selectedIds.length}
      />

      {/* ── Game Over overlay ─────────────────────────────── */}
      {gameOver && (
        <div className="game__over">
          <span className="game__over-label">¡Ante completado!</span>
          <span className="game__over-score">{totalScore.toLocaleString()} pts</span>
        </div>
      )}

      <Hand
        cards={displayHand}
        selectedIds={selectedIds}
        scoringCardIds={scoringCardIds}
        activeCardId={activeCardId}
        isAnimating={isAnimating}
        onCardSelect={gameOver ? undefined : handleCardSelect}
      />

      <div className="game__actions">
        <Button
          variant="primary"
          size="lg"
          disabled={selectedIds.length === 0 || isAnimating || handsLeft <= 0 || gameOver}
          onClick={handlePlayHand}
        >
          Play Hand
        </Button>
        <Button
          variant="danger"
          size="lg"
          disabled={selectedIds.length === 0 || isAnimating || discardsLeft <= 0 || gameOver}
          onClick={handleDiscard}
        >
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
          onClick={handleNewGame}>
          {gameOver ? 'Nueva partida' : 'Nueva mano'}
        </Button>
        <span className="game__deck-count">{remaining.length} en mazo</span>
      </div>
    </div>
  )
}

export default App