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
    sprite: 'pumpkin_joker-a9b3e2cc-650a-4883-a23a-35b508a3cb2f.svg',
    bonusMult: 4,
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