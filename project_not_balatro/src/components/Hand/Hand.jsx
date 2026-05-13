import { Card } from '../Card/Card'
import './Hand.css'

export function Hand({
  cards          = [],
  selectedIds    = [],
  scoringCardIds = [],
  activeCardId   = null,
  isAnimating    = false,
  onCardSelect,
  faceDownIds    = [],
  debuffedIds    = [],
}) {
  const count = cards.length
  if (count === 0) return <div className="hand hand--empty">Sin cartas</div>

  const maxVisible = 8
  const baseAngle  = 4
  const fanAngle   = count <= maxVisible ? baseAngle : baseAngle * (maxVisible / count)

  // Separación horizontal aumentada para cartas más anchas (90px base)
  const baseOffset = 68
  const cardOffset = count <= maxVisible ? baseOffset : baseOffset * (maxVisible / count)

  return (
    <div
      className="hand"
      role="group"
      aria-label={`Mano con ${count} cartas`}
      style={{ width: `${Math.min(count, maxVisible) * cardOffset + 90}px` }}
    >
      {cards.map((card, i) => {
        const mid        = (count - 1) / 2
        const offset     = i - mid
        const rotate     = offset * fanAngle
        const translateY = offset * offset * 2.8

        const isScoring     = scoringCardIds.includes(card.id)
        const isActiveScore = activeCardId === card.id
        const isKicker      = isAnimating && selectedIds.includes(card.id) && !isScoring

        return (
          <Card
            key={card.id}
            id={card.id}
            rank={card.rank}
            suit={card.suit}
            selected={selectedIds.includes(card.id)}
            faceDown={faceDownIds.includes(card.id)}
            debuffed={debuffedIds.includes(card.id)}
            scoring={isScoring}
            activeScore={isActiveScore}
            kicker={isKicker}
            onSelect={isAnimating ? undefined : onCardSelect}
            style={{
              position:        'absolute',
              left:            `${i * cardOffset}px`,
              bottom:          0,
              transform:       `rotate(${rotate}deg) translateY(${translateY}px)`,
              transformOrigin: 'bottom center',
              zIndex:          isScoring
                ? 150 + i
                : selectedIds.includes(card.id) ? 100 + i : i,
            }}
          />
        )
      })}
    </div>
  )
}