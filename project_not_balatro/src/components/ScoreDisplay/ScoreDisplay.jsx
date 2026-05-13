import { PLAY_PHASE } from '../../hooks/usePlayHand'
import './ScoreDisplay.css'

/**
 * ScoreDisplay — muestra el nombre de la mano y la animación
 * de chips × mult = total durante la secuencia de juego.
 *
 * Props:
 *  - phase         PLAY_PHASE actual
 *  - handResult    { handName } | null
 *  - displayChips  número de chips acumulados hasta ahora
 *  - displayMult   multiplicador (null hasta que se revela)
 *  - displayTotal  total final (null hasta que se calcula)
 *  - selectedCount número de cartas seleccionadas (para el hint)
 */
export function ScoreDisplay({
  phase,
  handResult,
  displayChips,
  displayMult,
  displayTotal,
  selectedCount,
}) {
  const isIdle = phase === PLAY_PHASE.IDLE

  if (isIdle && !handResult) {
    return (
      <div className="score-display score-display--idle">
        <span className="score-display__hint">
          {selectedCount === 0
            ? 'Selecciona entre 1 y 5 cartas'
            : `${selectedCount} carta${selectedCount > 1 ? 's' : ''} seleccionada${selectedCount > 1 ? 's' : ''}`}
        </span>
      </div>
    )
  }

  return (
    <div className="score-display">
      {handResult && (
        <span className="score-display__hand-name">
          {handResult.handName}
        </span>
      )}

      <div className="score-display__equation">
        {/* Chips acumulados */}
        <div className={`score-display__chips ${
          phase === PLAY_PHASE.SCORING ? 'score-display__chips--active' : ''
        }`}>
          <span className="score-display__label">Chips</span>
          <span className="score-display__value score-display__value--chips">
            {displayChips}
          </span>
        </div>

        {/* Multiplicador — aparece en REVEALING */}
        {displayMult !== null && (
          <>
            <span className="score-display__operator">×</span>
            <div className="score-display__mult score-display__mult--enter">
              <span className="score-display__label">Mult</span>
              <span className="score-display__value score-display__value--mult">
                {displayMult}
              </span>
            </div>
          </>
        )}

        {/* Total — aparece al final */}
        {displayTotal !== null && (
          <>
            <span className="score-display__operator">=</span>
            <div className="score-display__total score-display__total--enter">
              <span className="score-display__value score-display__value--total">
                {displayTotal}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}