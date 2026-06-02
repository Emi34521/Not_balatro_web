import { useState, useMemo, useCallback } from 'react'
import { Hand }         from './components/Hand/Hand'
import { Button }       from './components/Button/Button'
import { ScoreDisplay } from './components/ScoreDisplay/ScoreDisplay'
import { JokerBar } from './components/JokerBar/JokerBar'
import { ScoreBoard }   from './components/ScoreBoard/ScoreBoard'
import { AnteInfo }     from './components/AnteInfo/AnteInfo'
import { EndScreen }    from './components/EndScreen/EndScreen'
import { usePlayHand }  from './hooks/usePlayHand'
import { createDeck, dealCards }  from './utils/deck'
import { evaluateHand }           from './logic/evaluateHand'
import { calculateScore }         from './logic/calculateScore'
import { MAX_HANDS, MAX_DISCARDS, MAX_ANTES, getAnteTarget, JOKERS } from './config/gameConfig'
import './App.css'

const SUIT_ORDER = { spades: 0, hearts: 1, diamonds: 2, clubs: 3 }
const IS_DEV = import.meta.env.DEV

function createInitialState() {
  const { hand, remaining } = dealCards(createDeck(), 8)
  return { hand, remaining }
}

function App() {
  const [{ hand, remaining }, setGameState] = useState(createInitialState)
  const [selectedIds, setSelectedIds]       = useState([])
  const [sortMode, setSortMode]             = useState(null)

  const [ante, setAnte]                 = useState(1)
  const [handsLeft, setHandsLeft]       = useState(MAX_HANDS)
  const [discardsLeft, setDiscardsLeft] = useState(MAX_DISCARDS)
  const [anteScore, setAnteScore]       = useState(0)
  const [bestHand, setBestHand]         = useState(null)
  const [endState, setEndState]         = useState(null)
  const [activeJokers]                  = useState(JOKERS)

  const anteTarget = getAnteTarget(ante)

  const setHand      = h => setGameState(prev => ({ ...prev, hand: h }))
  const setRemaining = r => setGameState(prev => ({ ...prev, remaining: r }))

  const {
    phase, scoringCardIds, activeCardId,
    displayChips, displayMult, displayTotal,
    handResult, playHand, reset, isAnimating,
  } = usePlayHand({ hand, setHand, remaining, setRemaining, activeJokers })

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
    if (isAnimating || endState) return
    setSelectedIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id)
      if (prev.length >= 5)  return prev
      return [...prev, id]
    })
  }

  const handlePlayHand = useCallback(async () => {
    if (selectedIds.length === 0 || isAnimating || handsLeft <= 0 || endState) return

    const selectedCards = displayHand.filter(c => selectedIds.includes(c.id))
    const { handType, handName, scoringCardIds: sIds } = evaluateHand(selectedCards)
    const scoringCards = selectedCards.filter(c => sIds.includes(c.id))
    const { baseChips, baseMult, total } = calculateScore(handType, scoringCards, activeJokers)

    const newHandsLeft = handsLeft - 1
    const newAnteScore = anteScore + total

    setHandsLeft(newHandsLeft)
    setAnteScore(newAnteScore)
    setBestHand(prev => (!prev || total > prev.total)
      ? { handName, chips: baseChips, mult: baseMult, total }
      : prev
    )

    await playHand(selectedIds, displayHand)
    setSelectedIds([])

    const reachedTarget = newAnteScore >= anteTarget

    if (reachedTarget) {
      if (ante < MAX_ANTES) {
        setAnte(a => a + 1)
        setAnteScore(0)
        setHandsLeft(MAX_HANDS)
        setDiscardsLeft(MAX_DISCARDS)
        setGameState(createInitialState())
      } else {
        setEndState('win')
      }
    } else if (newHandsLeft <= 0) {
      setEndState('lose')
    }
  }, [
    selectedIds, isAnimating, handsLeft, endState,
    displayHand, anteScore, ante, anteTarget, playHand,
    activeJokers,
  ])

  const handleDiscard = () => {
    if (selectedIds.length === 0 || isAnimating || discardsLeft <= 0 || endState) return
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
    setAnte(1)
    setHandsLeft(MAX_HANDS)
    setDiscardsLeft(MAX_DISCARDS)
    setAnteScore(0)
    setBestHand(null)
    setEndState(null)
  }

  // ── Debug helpers ──────────────────────────────────────
  const debugWin  = () => setEndState('win')
  const debugLose = () => setEndState('lose')

  const isBlocked = !!endState

  return (
    <div className="game">
      <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />
      <h1 className="game__title">Not Balatro</h1>

      <div className="game__meta">
        <AnteInfo ante={ante} target={anteTarget} anteScore={anteScore} />
        <ScoreBoard
          handsLeft={handsLeft}
          maxHands={MAX_HANDS}
          discardsLeft={discardsLeft}
          maxDiscards={MAX_DISCARDS}
        />
      </div>

      <JokerBar jokers={activeJokers} />

      <ScoreDisplay
        phase={phase}
        handResult={handResult ?? (liveEval ? { handName: liveEval.handName } : null)}
        displayChips={displayChips}
        displayMult={displayMult}
        displayTotal={displayTotal}
        selectedCount={selectedIds.length}
        activeJokers={activeJokers}
      />

      <Hand
        cards={displayHand}
        selectedIds={selectedIds}
        scoringCardIds={scoringCardIds}
        activeCardId={activeCardId}
        isAnimating={isAnimating}
        onCardSelect={isBlocked ? undefined : handleCardSelect}
      />

      <div className="game__actions">
        <Button variant="primary" size="lg"
          disabled={selectedIds.length === 0 || isAnimating || handsLeft <= 0 || isBlocked}
          onClick={handlePlayHand}>
          Play Hand
        </Button>
        <Button variant="danger" size="lg"
          disabled={selectedIds.length === 0 || isAnimating || discardsLeft <= 0 || isBlocked}
          onClick={handleDiscard}>
          Discard ({discardsLeft})
        </Button>
      </div>

      <div className="game__secondary">
        <Button variant="outline" size="sm" disabled={isAnimating || isBlocked}
          onClick={() => handleSort('rank')}
          className={sortMode === 'rank' ? 'btn--active' : ''}>
          Sort Rank
        </Button>
        <Button variant="outline" size="sm" disabled={isAnimating || isBlocked}
          onClick={() => handleSort('suit')}
          className={sortMode === 'suit' ? 'btn--active' : ''}>
          Sort Suit
        </Button>
        <Button variant="ghost" size="sm" disabled={isAnimating}
          onClick={handleNewGame}>
          Nueva partida
        </Button>
        <span className="game__deck-count">{remaining.length} en mazo</span>
      </div>

      {/* Botones de debug — solo en desarrollo (npm run dev) */}
      {IS_DEV && !endState && (
        <div className="game__debug">
          <span className="game__debug-label">DEV</span>
          <button className="game__debug-btn game__debug-btn--win" onClick={debugWin}>
            ★ Win
          </button>
          <button className="game__debug-btn game__debug-btn--lose" onClick={debugLose}>
            ✕ Lose
          </button>
        </div>
      )}

      {endState && (
        <EndScreen
          won={endState === 'win'}
          ante={ante}
          bestHand={bestHand}
          onRestart={handleNewGame}
        />
      )}
    </div>
  )
}

export default App