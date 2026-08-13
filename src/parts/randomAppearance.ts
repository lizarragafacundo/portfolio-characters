import { partIdsFor, type PartCategory } from './catalogues'
import { APPEARANCE_KEYS, resolveAppearance, type ResolvedAppearance } from './resolveAppearance'

export type RandomSource = () => number

const pick = <T>(ids: [T, ...T[]], random: RandomSource): T =>
  ids[Math.floor(random() * ids.length)] ?? ids[0]

/**
 * A whole new character. Takes a random source so callers can seed it and so
 * tests stay deterministic.
 */
export const randomAppearance = (random: RandomSource = Math.random): ResolvedAppearance =>
  resolveAppearance(
    APPEARANCE_KEYS.reduce(
      (chosen, key) => ({ ...chosen, [key]: pick(partIdsFor(key as PartCategory), random) }),
      {},
    ),
  )
