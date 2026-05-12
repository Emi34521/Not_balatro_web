import { Card } from '../card/Card'
import './Hand.css'

/**
 * Componente de mano de poker estilo Balatro.
 * Gestiona el layout en abanico y delega el render a <Card />.
 *
 * Props:
 *  - cards: Card[]           array de cartas en la mano
 *  - selectedIds: string[]   ids de cartas seleccionadas
 *  - onCardSelect: fn        callback al seleccionar → recibe { id, rank, suit }
 *  - maxVisible: number      máximo de cartas que caben cómodamente (por defecto 8)
 *  - faceDownIds: string[]   ids de cartas boca abajo (boss blind "The House")
 *  - debuffedIds: string[]   ids de cartas debuffeadas
 *  - fanSpread: number       intensidad del abanico (0-1, default 1)
 */
export function Hand({
  cards = [],
  selectedIds = [],
  onCardSelect,
  maxVisible = 8,
  faceDownIds = [],
  debuffedIds = [],
  fanSpread = 1,
}) {
  const count = cards.length
  if (count === 0) return <div className="hand hand--empty">Sin cartas</div>

  // El ángulo del abanico se comprime cuando hay más cartas de las que caben
  const baseAngle = 4 * fanSpread
  const fanAngle = count <= maxVisible ? baseAngle : baseAngle * (maxVisible / count)

  // Separación horizontal entre cartas (se comprime con más cartas)
  const baseOffset = 54
  const cardOffset = count <= maxVisible ? baseOffset : baseOffset * (maxVisible / count)

  return (
    <div
      className="hand"
      role="group"
      aria-label={`Mano con ${count} cartas`}
      style={{ width: `${Math.min(count, maxVisible) * cardOffset + 70}px` }}
    >
      {cards.map((card, i) => {
        const mid = (count - 1) / 2
        const offset = i - mid
        const rotate = offset * fanAngle
        // Curva parabólica: las cartas del centro están más arriba
        const translateY = (offset * offset) * 2.5

        return (
          <Card
            key={card.id}
            id={card.id}
            rank={card.rank}
            suit={card.suit}
            selected={selectedIds.includes(card.id)}
            faceDown={faceDownIds.includes(card.id)}
            debuffed={debuffedIds.includes(card.id)}
            onSelect={onCardSelect}
            style={{
              position: 'absolute',
              left: `${i * cardOffset}px`,
              bottom: 0,
              transform: `rotate(${rotate}deg) translateY(${translateY}px)`,
              transformOrigin: 'bottom center',
              zIndex: selectedIds.includes(card.id) ? 100 + i : i,
            }}
          />
        )
      })}
    </div>
  )
}