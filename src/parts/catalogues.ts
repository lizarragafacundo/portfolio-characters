import type { Preset } from './partTypes'
import {
  beardStyles,
  eyeStyles,
  glassesStyles,
  hairColors,
  hairStyles,
  mouthStyles,
  presets,
  skinTones,
} from './registry'

export type PartCategory = keyof Preset

/** Every choosable id, keyed by the appearance field it fills. */
export const PART_CATALOGUES: { [K in PartCategory]: Record<Preset[K], unknown> } = {
  skinTone: skinTones,
  hair: hairStyles,
  hairColor: hairColors,
  eyes: eyeStyles,
  mouth: mouthStyles,
  beard: beardStyles,
  glasses: glassesStyles,
}

export const partIdsFor = <K extends PartCategory>(category: K): [Preset[K], ...Preset[K][]] =>
  Object.keys(PART_CATALOGUES[category]) as [Preset[K], ...Preset[K][]]

export const presetIds = () => Object.keys(presets) as [keyof typeof presets]

export const isKnownPartId = <K extends PartCategory>(
  category: K,
  value: unknown,
): value is Preset[K] => typeof value === 'string' && value in PART_CATALOGUES[category]
