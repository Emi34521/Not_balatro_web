import { useRef, useEffect } from 'react'
import './ScoreBoard.css'

const MAX_HANDS = 4

/**
 * ScoreBoard — muestra puntuación acumulada, manos restantes y última mano.
 *
 * Props:
 *  - totalScore   número acumulado durante la partida
 *  - handsLeft    manos que le quedan al jugador en este ante (0-4)
 *  - lastScore    puntuación de la última mano jugada (null si no hay)
 */
export function ScoreBoard({ totalScore = 0, handsLeft = MAX_HANDS, lastScore = null }) {
  const totalRef = useRef(null)
  const prevTotal = useRef(totalScore)

  // Dispara la animación de bump cuando sube la puntuación
  useEffect(() => {
    if (totalScore !== prevTotal.current && totalRef.current) {
      totalRef.current.classList.remove('scoreboard__value--bump')
      // Forzar reflow para reiniciar la animación
      void totalRef.current.offsetWidth
      totalRef.current.classList.add('scoreboard__value--bump')
    }
    prevTotal.current = totalScore
  }, [totalScore])

  const handsLow = handsLeft <= 1

  return (
    <div className="scoreboard" role="status" aria-label="Marcador del juego">

      {/* Puntuación acumulada */}
      <div className="scoreboard__stat">
        <span className="scoreboard__label">Puntuación</span>
        <span
          ref={totalRef}
          className="scoreboard__value scoreboard__value--total"
        >
          {totalScore.toLocaleString()}
        </span>
      </div>

      <div className="scoreboard__divider" />

      {/* Manos restantes */}
      <div className="scoreboard__stat">
        <span className="scoreboard__label">Manos</span>
        <span
          className={[
            'scoreboard__value',
            'scoreboard__value--hands',
            handsLow ? 'scoreboard__value--hands-low' : '',
          ].filter(Boolean).join(' ')}
        >
          {handsLeft} / {MAX_HANDS}
        </span>
      </div>

      {/* Última mano — solo si existe */}
      {lastScore !== null && (
        <>
          <div className="scoreboard__divider" />
          <div className="scoreboard__stat">
            <span className="scoreboard__label">Última</span>
            <span className="scoreboard__value scoreboard__value--last">
              +{lastScore.toLocaleString()}
            </span>
          </div>
        </>
      )}
    </div>
  )
}