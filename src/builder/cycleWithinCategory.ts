import { partIdsFor, presetIds, type PartCategory } from '../parts/catalogues'
import type { Preset, PresetId } from '../parts/partTypes'

export type CycleDirection = 1 | -1

const wrap = (index: number, length: number) => (index + length) % length

/**
 * Steps through a catalogue, wrapping at both ends. Reads the ids from the
 * registry, so adding a hairstyle puts it in the builder with no code change.
 */
export const cycleWithinCategory = <K extends PartCategory>(
  category: K,
  current: Preset[K],
  direction: CycleDirection,
): Preset[K] => {
  const ids = partIdsFor(category)
  const next = wrap(ids.indexOf(current) + direction, ids.length)
  return ids[next] ?? current
}

export const cyclePreset = (current: PresetId, direction: CycleDirection): PresetId => {
  const ids = presetIds()
  const next = wrap(ids.indexOf(current) + direction, ids.length)
  return ids[next] ?? current
}

export const positionWithinCategory = <K extends PartCategory>(category: K, current: Preset[K]) => {
  const ids = partIdsFor(category)
  return { index: ids.indexOf(current) + 1, total: ids.length }
}

export const presetPosition = (current: PresetId) => {
  const ids = presetIds()
  return { index: ids.indexOf(current) + 1, total: ids.length }
}
