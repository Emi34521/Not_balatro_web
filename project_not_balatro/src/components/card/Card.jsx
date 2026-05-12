import './Card.css'

const SUIT_SYMBOLS = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
}

const RED_SUITS = ['hearts', 'diamonds']

/**
 * Componente individual de carta de poker.
 *
 * Props:
 *  - rank: string        ('A', '2', ..., 'K')
 *  - suit: string        ('hearts' | 'diamonds' | 'clubs' | 'spades')
 *  - selected: boolean   si está seleccionada
 *  - faceDown: boolean   si está boca abajo (para el boss blind "The House")
 *  - debuffed: boolean   si está debuffeada (no puntúa)
 *  - onSelect: fn        callback al hacer clic → recibe { rank, suit, id }
 *  - style: object       estilos extra (usado por Hand para posicionamiento)
 *  - className: string   clases extra
 */
export function Card({
  id,
  rank,
  suit,
  selected = false,
  faceDown = false,
  debuffed = false,
  onSelect,
  style,
  className = '',
}) {
  const isRed = RED_SUITS.includes(suit)
  const symbol = SUIT_SYMBOLS[suit]

  const handleClick = () => {
    onSelect?.({ id, rank, suit })
  }

  return (
    <div
      className={[
        'card',
        selected ? 'card--selected' : '',
        faceDown ? 'card--face-down' : '',
        debuffed ? 'card--debuffed' : '',
        isRed ? 'card--red' : 'card--black',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
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
          <span className="card__suit-center">{symbol}</span>
          <span className="card__suit-bottom">{symbol}</span>
          <span className="card__rank card__rank--bottom">{rank}</span>
          {debuffed && <span className="card__debuff-badge">✕</span>}
        </>
      )}
    </div>
  )
}