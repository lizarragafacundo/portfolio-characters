import type { Primitive } from '../parts/partTypes'

export const TORSO_CLIP_ID = 'chTee'
export const HEAD_ROOM_CLIP_ID = 'chTorso'

export const TORSO_CLIP_PATH =
  'M52,585 C48,516 86,486 140,464 C168,451 184,443 190,431 C199,452 244,452 250,429 C258,441 288,451 320,465 C378,487 398,518 394,585 L394,600 L52,600 Z'

/**
 * The shirt. Authored here rather than in the registry because it is the one
 * part of the drawing that never varies, and it is stroked in registry units so
 * it scales with the head rather than drifting away from it.
 */
export const shirtFill: Primitive[] = [
  {
    name: 'shirtShadow',
    path: 'M52,580 C48,516 86,486 140,464 C168,451 184,443 190,431 L250,429 C258,441 288,451 320,465 C378,487 398,518 394,580 C330,558 286,576 232,562 C176,550 118,570 52,566 Z',
    fill: 'shade',
    drawDelay: 1.95,
    drawDuration: 0.5,
  },
]

export const shirtOutline: Primitive[] = [
  {
    name: 'collar',
    path: 'M190,431 C200,453 244,453 250,429 C247,463 193,463 190,431 Z',
    fill: 'fill',
    strokeWidth: 2.4,
    drawDelay: 1.6,
    drawDuration: 0.5,
  },
  {
    name: 'shoulderLeft',
    path: 'M52,585 C48,516 86,486 140,464 C168,451 184,443 190,431',
    strokeWidth: 2.5,
    drawDelay: 1.62,
    drawDuration: 0.7,
  },
  {
    name: 'shoulderRight',
    path: 'M250,429 C258,441 288,451 320,465 C378,487 398,518 394,585',
    strokeWidth: 2.5,
    drawDelay: 1.62,
    drawDuration: 0.7,
  },
  {
    name: 'hem',
    path: 'M74,542 C128,528 180,550 236,538 C292,528 338,548 374,536',
    strokeWidth: 2.2,
    opacity: 0.85,
    drawDelay: 1.86,
    drawDuration: 0.8,
  },
  {
    name: 'sleeveFolds',
    path: 'M142,466 C158,480 164,504 161,534 M334,486 C324,500 320,518 322,538',
    strokeWidth: 1.6,
    opacity: 0.5,
    drawDelay: 2,
    drawDuration: 0.6,
  },
]
