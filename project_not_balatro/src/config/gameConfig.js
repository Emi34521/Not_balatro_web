/**
 * gameConfig.js
 * Configuración central de la partida: antes, objetivos y constantes.
 */

export const MAX_HANDS    = 4
export const MAX_DISCARDS = 3
export const MAX_ANTES    = 2

export const JOKERS = [
  {
    id: 'pumpkin_joker',
    name: 'Pumpkin Joker',
    sprite: 'pumpkin_joker.png',
    bonusMult: 4,
  },
  {
    id: 'alien_joker',
    name: 'Alien Joker',
    sprite: 'alien_joker.png',
    bonusChips: 30,
  },
]

// Puntuación objetivo por ante (inspirado en Balatro)
export const ANTE_TARGETS = {
  1: 300,
  2: 800,
}

export function getAnteTarget(ante) {
  return ANTE_TARGETS[ante] ?? 300
}