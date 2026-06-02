import pumpkinJokerImg from '../../assets/jokers/pumpkin_joker.png'
import alienJokerImg from '../../assets/jokers/alien_joker.png'
import eyeJokerImg from '../../assets/jokers/eye_joker.png'
import crocJokerImg from '../../assets/jokers/croc_joker.png'
import './JokerBar.css'

const jokerPictures = {
  pumpkin_joker: pumpkinJokerImg,
  alien_joker: alienJokerImg,
  eye_joker: eyeJokerImg,
  croc_joker: crocJokerImg,
}

function getJokerEffectText(joker) {
  if (joker.bonusMult) {
    return '+' + joker.bonusMult + ' Mult'
  }
  if (joker.bonusChips) {
    return '+' + joker.bonusChips + ' Chips'
  }
  return ''
}

export function JokerBar({ jokers }) {
  if (!jokers || jokers.length === 0) {
    return null
  }

  return (
    <div className="joker-bar">
      {jokers.map((joker) => {
        const pic = jokerPictures[joker.id]
        return (
          <div key={joker.id} className="joker-bar__card joker-bar__card--on">
            {pic && (
              <img
                className="joker-bar__img"
                src={pic}
                alt={joker.name}
              />
            )}
            <div className="joker-bar__info">
              <span className="joker-bar__name">{joker.name}</span>
              <span className="joker-bar__effect">{getJokerEffectText(joker)}</span>
              <span className="joker-bar__active">ACTIVO</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
