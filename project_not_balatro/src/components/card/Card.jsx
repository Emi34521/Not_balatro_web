import './Card.css'

const SUIT_SYMBOLS = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
}
const FACE_RANKS = ['J', 'Q', 'K']
const RED_SUITS  = ['hearts', 'diamonds']

const faceImages = import.meta.glob('../../assets/faces/*.svg', { eager: true })

function getFaceImage(rank, suit) {
  const key = `../../assets/faces/${rank}-${suit}.svg`
  return faceImages[key]?.default ?? null
}

/**
 * Props:
 *  - rank, suit, id
 *  - selected    carta seleccionada por el jugador
 *  - faceDown    boca abajo (boss blind)
 *  - debuffed    no puntúa (boss blind)
 *  - scoring     está entre las cartas que puntúan en la animación
 *  - activeScore está sumando sus chips ahora mismo
 *  - kicker      no puntúa en esta mano (se atenúa)
 *  - onSelect    callback → { id, rank, suit }
 *  - style, className
 */
export function Card({
  id,
  rank,
  suit,
  selected     = false,
  faceDown     = false,
  debuffed     = false,
  scoring      = false,
  activeScore  = false,
  kicker       = false,
  onSelect,
  style,
  className    = '',
}) {
  const isRed  = RED_SUITS.includes(suit)
  const symbol = SUIT_SYMBOLS[suit]

  const handleClick = () => onSelect?.({ id, rank, suit })

  return (
    <div
      className={[
        'card',
        selected     ? 'card--selected'      : '',
        faceDown     ? 'card--face-down'      : '',
        debuffed     ? 'card--debuffed'       : '',
        scoring      ? 'card--scoring'        : '',
        activeScore  ? 'card--active-scoring' : '',
        kicker       ? 'card--kicker'         : '',
        isRed        ? 'card--red'            : 'card--black',
        className,
      ].filter(Boolean).join(' ')}
      style={style}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-label={faceDown ? 'carta boca abajo' : `${rank} de ${suit}`}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      {faceDown ? (
        <div className="card__back" />
      ) : (
        <>
          <span className="card__rank card__rank--top">{rank}</span>
          <span className="card__suit-top">{symbol}</span>

          {FACE_RANKS.includes(rank) ? (
            <img
              className="card__face-art"
              src={getFaceImage(rank, suit)}
              alt={`${rank} de ${suit}`}
            />
          ) : (
            <span className="card__suit-center">{symbol}</span>
          )}

          <span className="card__suit-bottom">{symbol}</span>
          <span className="card__rank card__rank--bottom">{rank}</span>
          {debuffed && <span className="card__debuff-badge">✕</span>}
        </>
      )}
    </div>
  )
}