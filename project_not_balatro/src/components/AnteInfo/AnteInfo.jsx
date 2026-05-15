import './AnteInfo.css'
import { MAX_ANTES } from '../../config/gameConfig'

/**
 * AnteInfo — muestra el ante actual, el objetivo de puntuación
 * y una barra de progreso.
 *
 * Props:
 *  - ante         número de ante actual (1, 2…)
 *  - target       puntuación objetivo del ante
 *  - anteScore    puntuación acumulada en este ante
 */
export function AnteInfo({ ante, target, anteScore }) {
  const progress    = Math.min(anteScore / target, 1)
  const pct         = Math.round(progress * 100)
  const reached     = anteScore >= target

  return (
    <div className="ante-info" role="region" aria-label="Progreso del ante">

      {/* Cabecera: ante + objetivo */}
      <div className="ante-info__header">
        <span className="ante-info__ante-label">
          Ante {ante} <span className="ante-info__of">/ {MAX_ANTES}</span>
        </span>
        <span className={`ante-info__target ${reached ? 'ante-info__target--reached' : ''}`}>
          {anteScore.toLocaleString()}
          <span className="ante-info__sep"> / </span>
          {target.toLocaleString()}
        </span>
      </div>

      {/* Barra de progreso */}
      <div className="ante-info__bar-track" role="progressbar"
        aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div
          className={`ante-info__bar-fill ${reached ? 'ante-info__bar-fill--reached' : ''}`}
          style={{ width: `${pct}%` }}
        />
      </div>

    </div>
  )
}