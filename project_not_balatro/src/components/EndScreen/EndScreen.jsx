import './EndScreen.css'

/**
 * EndScreen — modal estilo Balatro sobre las cartas del jugador.
 *
 * Props:
 *  - won        true = victoria, false = derrota
 *  - ante       ante en el que terminó
 *  - bestHand   { handName, chips, mult, total } | null
 *  - onRestart  callback para nueva partida
 */
export function EndScreen({ won, ante, bestHand, onRestart }) {
  return (
    <div className={`end-screen ${won ? 'end-screen--win' : 'end-screen--lose'}`}>

      {/* Backdrop semitransparente — las cartas se ven detrás */}
      <div className="end-screen__backdrop" onClick={undefined} />

      {/* Modal central */}
      <div className="end-screen__modal" role="dialog" aria-modal="true"
        aria-label={won ? 'Pantalla de victoria' : 'Pantalla de derrota'}>

        {/* Banda superior de color */}
        <div className="end-screen__banner" aria-hidden="true" />

        {/* Etiqueta tipo Balatro */}
        <span className="end-screen__tag">
          {won ? '¡Ante superado!' : 'Ante fallido'}
        </span>

        {/* Título */}
        <h2 className="end-screen__title">
          {won ? '¡Victoria!' : 'Game Over'}
        </h2>

        {/* Separador */}
        <div className="end-screen__sep" aria-hidden="true" />

        {/* Mejor mano */}
        <div className="end-screen__best">
          <span className="end-screen__best-label">Mejor mano jugada</span>

          {bestHand ? (
            <div className="end-screen__best-card">
              <span className="end-screen__best-name">{bestHand.handName}</span>
              <div className="end-screen__best-score">
                <span className="end-screen__best-chips">{bestHand.chips}</span>
                <span className="end-screen__best-x">×</span>
                <span className="end-screen__best-mult">{bestHand.mult}</span>
                <span className="end-screen__best-eq">=</span>
                <span className="end-screen__best-total">{bestHand.total.toLocaleString()}</span>
              </div>
            </div>
          ) : (
            <span className="end-screen__best-empty">Ninguna mano jugada</span>
          )}
        </div>

        {/* Información del ante */}
        {!won && (
          <span className="end-screen__ante-info">
            No alcanzaste el objetivo del Ante {ante}
          </span>
        )}

        {/* Botón */}
        <button className="end-screen__btn" onClick={onRestart}>
          Nueva partida
        </button>

      </div>
    </div>
  )
}