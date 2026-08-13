import { APPEARANCE_KEYS, type ResolvedAppearance } from './resolveAppearance'
import type { PresetId } from './partTypes'
import { presets } from './registry'

/**
 * The preset a character is closest to, by how many of the seven part choices it
 * already shares. Lets a generated snippet name a preset and list only the
 * differences rather than all seven props.
 */
export const nearestPresetTo = (appearance: ResolvedAppearance): PresetId => {
  const scored = Object.entries(presets).map(([id, preset]) => ({
    id: id as PresetId,
    matches: APPEARANCE_KEYS.filter((key) => preset[key] === appearance[key]).length,
  }))

  return scored.reduce((best, candidate) => {
    if (candidate.matches > best.matches) return candidate
    if (candidate.matches === best.matches && candidate.id === appearance.preset) return candidate
    return best
  }).id
}

export const differencesFromPreset = (appearance: ResolvedAppearance, preset: PresetId) =>
  APPEARANCE_KEYS.filter((key) => presets[preset][key] !== appearance[key])
