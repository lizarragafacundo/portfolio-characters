import type { CharacterLayerName } from '../parts/partTypes'

/**
 * Paint order, and the contract behind every `[data-fl]` group.
 *
 * The dock transition and the appearance replay both stagger by group index, so
 * every layer is rendered even when it is empty — otherwise the timing of the
 * whole character would shift with the haircut.
 */
export const CHARACTER_LAYERS = [
  'hairBack',
  'neck',
  'shirtFill',
  'shirtOutline',
  'face',
  'beard',
  'ears',
  'nose',
  'mouth',
  'eyeDecor',
  'eyeLeft',
  'eyeRight',
  'glasses',
  'brows',
  'hairFront',
] as const satisfies readonly CharacterLayerName[]

export const CHARACTER_VIEW_BOX = '0 0 440 620'

export const CHARACTER_TILT = 'rotate(-2.2 220 300)'
