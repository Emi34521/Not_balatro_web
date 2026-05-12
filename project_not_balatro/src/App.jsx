import { useState } from 'react'
import { Hand } from './components/Hand/Hand'
import { createDeck, dealCards } from './utils/deck'
import './App.css'

function App() {
  const [hand] = useState(() => dealCards(createDeck(), 8).hand)

  return (
    <div className="game">
      <h1 className="game__title">Not Balatro</h1>
      <Hand cards={hand} />
    </div>
  )
}

export default App