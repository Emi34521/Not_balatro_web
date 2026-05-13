/**
 * usePlayHand.js
 * Custom hook que orquesta la secuencia de animación al jugar una mano.
 */

import { useState, useRef, useCallback } from 'react'
import { evaluateHand } from '../logic/evaluateHand'
import { calculateScore } from '../logic/calculateScore'

export const PLAY_PHASE = {
  IDLE:      'idle',
  RAISING:   'raising',
  SCORING:   'scoring',
  REVEALING: 'revealing',
  DONE:      'done',
}

const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

export function usePlayHand({ hand, setHand, remaining, setRemaining }) {
  const [phase, setPhase]                   = useState(PLAY_PHASE.IDLE)
  const [scoringCardIds, setScoringCardIds] = useState([])
  const [activeCardId, setActiveCardId]     = useState(null)
  const [displayChips, setDisplayChips]     = useState(0)
  const [displayMult, setDisplayMult]       = useState(null)
  const [displayTotal, setDisplayTotal]     = useState(null)
  const [handResult, setHandResult]         = useState(null)

  const cancelRef = useRef(false)

  const reset = useCallback(() => {
    cancelRef.current = true
    setPhase(PLAY_PHASE.IDLE)
    setScoringCardIds([])
    setActiveCardId(null)
    setDisplayChips(0)
    setDisplayMult(null)
    setDisplayTotal(null)
    setHandResult(null)
  }, [])

  /**
   * @param {string[]} selectedIds  - ids seleccionados por el jugador
   * @param {Card[]}   displayHand  - mano en el orden visual actual (con sort)
   */
  const playHand = useCallback(async (selectedIds, displayHand) => {
    if (phase !== PLAY_PHASE.IDLE || selectedIds.length === 0) return

    cancelRef.current = false

    // Usamos displayHand para respetar el orden visual al animar
    const orderedHand   = displayHand ?? hand
    const selectedCards = orderedHand.filter(c => selectedIds.includes(c.id))

    const { handType, handName, scoringCardIds } = evaluateHand(selectedCards)

    // Scoring cards en el mismo orden visual
    const scoringCards = selectedCards.filter(c => scoringCardIds.includes(c.id))

    const { baseChips, baseMult, cardChips } = calculateScore(handType, scoringCards)

    // Total calculado directamente (no desde estado)
    const totalCardChips = cardChips.reduce((sum, c) => sum + c.chips, 0)
    const finalChips     = baseChips + totalCardChips
    const finalTotal     = finalChips * baseMult

    setHandResult({ handType, handName })

    // ── Fase 1: cartas scoring suben ──────────────────────
    setPhase(PLAY_PHASE.RAISING)
    setScoringCardIds(scoringCardIds)
    setDisplayChips(baseChips)
    await wait(500)
    if (cancelRef.current) return

    // ── Fase 2: chips carta a carta ───────────────────────
    setPhase(PLAY_PHASE.SCORING)
    for (const cardScore of cardChips) {
      if (cancelRef.current) return
      setActiveCardId(cardScore.id)
      await wait(120)
      setDisplayChips(prev => prev + cardScore.chips)
      await wait(280)
      setActiveCardId(null)
      await wait(80)
    }
    if (cancelRef.current) return

    // ── Fase 3: multiplicador y total ─────────────────────
    setPhase(PLAY_PHASE.REVEALING)
    setDisplayMult(baseMult)
    await wait(450)
    if (cancelRef.current) return
    setDisplayTotal(finalTotal)
    await wait(900)
    if (cancelRef.current) return

    // ── Fase 4: robar cartas nuevas ───────────────────────
    setPhase(PLAY_PHASE.DONE)
    const playedCount  = selectedIds.length
    const keptCards    = hand.filter(c => !selectedIds.includes(c.id))
    const drawn        = remaining.slice(0, playedCount)
    const newRemaining = remaining.slice(playedCount)

    await wait(400)
    if (cancelRef.current) return

    setHand([...keptCards, ...drawn])
    setRemaining(newRemaining)

    await wait(200)
    if (cancelRef.current) return

    setScoringCardIds([])
    setActiveCardId(null)
    setDisplayChips(0)
    setDisplayMult(null)
    setDisplayTotal(null)
    setHandResult(null)
    setPhase(PLAY_PHASE.IDLE)

  }, [phase, hand, remaining, setHand, setRemaining])

  return {
    phase,
    scoringCardIds,
    activeCardId,
    displayChips,
    displayMult,
    displayTotal,
    handResult,
    playHand,
    reset,
    isAnimating: phase !== PLAY_PHASE.IDLE,
  }
}