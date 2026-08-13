import type { Preset } from './partTypes'
import { APPEARANCE_KEYS, resolveAppearance, type ResolvedAppearance } from './resolveAppearance'
import {
  beardStyles,
  eyeStyles,
  glassesStyles,
  hairColors,
  hairStyles,
  mouthStyles,
  skinTones,
} from './registry'

export type RandomSource = () => number

const idsOf = <T extends string>(catalogue: Record<T, unknown>) =>
  Object.keys(catalogue) as [T, ...T[]]

const CATALOGUE_IDS: { [K in keyof Preset]: [Preset[K], ...Preset[K][]] } = {
  skinTone: idsOf(skinTones),
  hair: idsOf(hairStyles),
  hairColor: idsOf(hairColors),
  eyes: idsOf(eyeStyles),
  mouth: idsOf(mouthStyles),
  beard: idsOf(beardStyles),
  glasses: idsOf(glassesStyles),
}

const pick = <T>(ids: [T, ...T[]], random: RandomSource): T =>
  ids[Math.floor(random() * ids.length)] ?? ids[0]

/**
 * A whole new character. Accepts a random source so callers can seed it and so
 * tests stay deterministic.
 */
export const randomAppearance = (random: RandomSource = Math.random): ResolvedAppearance =>
  resolveAppearance(
    APPEARANCE_KEYS.reduce(
      (chosen, key) => ({ ...chosen, [key]: pick(CATALOGUE_IDS[key], random) }),
      {},
    ),
  )
