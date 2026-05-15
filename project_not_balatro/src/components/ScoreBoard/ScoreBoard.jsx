import { useRef, useEffect } from 'react'
import './ScoreBoard.css'

/**
 * ScoreBoard — muestra manos restantes y descartes restantes.
 *
 * Props:
 *  - handsLeft     manos que quedan en este ante
 *  - maxHands      máximo de manos por ante
 *  - discardsLeft  descartes que quedan
 *  - maxDiscards   máximo de descartes por ante
 */
export function ScoreBoard({ handsLeft, maxHands, discardsLeft, maxDiscards }) {
  const handsLow    = handsLeft <= 1
  const discardsLow = discardsLeft === 0

  return (
    <div className="scoreboard" role="status" aria-label="Estado de la ronda">

      {/* Manos */}
      <div className="scoreboard__stat">
        <span className="scoreboard__label">Manos</span>
        <span className={[
          'scoreboard__value',
          'scoreboard__value--hands',
          handsLow ? 'scoreboard__value--low' : '',
        ].filter(Boolean).join(' ')}>
          {handsLeft}
          <span className="scoreboard__max"> / {maxHands}</span>
        </span>
      </div>

      <div className="scoreboard__divider" />

      {/* Descartes */}
      <div className="scoreboard__stat">
        <span className="scoreboard__label">Descartes</span>
        <span className={[
          'scoreboard__value',
          'scoreboard__value--discards',
          discardsLow ? 'scoreboard__value--low' : '',
        ].filter(Boolean).join(' ')}>
          {discardsLeft}
          <span className="scoreboard__max"> / {maxDiscards}</span>
        </span>
      </div>

    </div>
  )
}