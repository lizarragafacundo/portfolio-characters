import { describe, expect, it } from 'vitest'
import { randomAppearance } from '../src/parts/randomAppearance'
import { differencesFromPreset, nearestPresetTo } from '../src/parts/nearestPreset'
import { APPEARANCE_KEYS, resolveAppearance } from '../src/parts/resolveAppearance'
import { PART_REGISTRY, presets } from '../src/parts/registry'

const CATALOGUES = {
  skinTone: PART_REGISTRY.skinTones,
  hair: PART_REGISTRY.hairStyles,
  hairColor: PART_REGISTRY.hairColors,
  eyes: PART_REGISTRY.eyeStyles,
  mouth: PART_REGISTRY.mouthStyles,
  beard: PART_REGISTRY.beardStyles,
  glasses: PART_REGISTRY.glassesStyles,
}

const sequence = (values: [number, ...number[]]) => {
  let index = 0
  return () => values[index++ % values.length] ?? values[0]
}

describe('randomAppearance', () => {
  it('only ever picks ids the registry knows', () => {
    const random = sequence([0, 0.17, 0.33, 0.51, 0.68, 0.84, 0.99])
    Array.from({ length: 40 }).forEach(() => {
      const appearance = randomAppearance(random)
      APPEARANCE_KEYS.forEach((key) => {
        expect(appearance[key] in CATALOGUES[key], `${key}=${appearance[key]}`).toBe(true)
      })
    })
  })

  it('is deterministic for a given random source', () => {
    expect(randomAppearance(sequence([0.4]))).toEqual(randomAppearance(sequence([0.4])))
  })

  it('never runs off the end of a catalogue', () => {
    const appearance = randomAppearance(() => 0.999999)
    APPEARANCE_KEYS.forEach((key) => expect(appearance[key], key).toBeDefined())
  })

  it('produces different characters from different draws', () => {
    const first = randomAppearance(sequence([0]))
    const second = randomAppearance(sequence([0.9]))
    expect(first).not.toEqual(second)
  })
})

describe('nearestPresetTo', () => {
  it('returns a preset itself when nothing was overridden', () => {
    Object.keys(presets).forEach((id) => {
      const appearance = resolveAppearance({ preset: id as never })
      const nearest = nearestPresetTo(appearance)
      expect(presets[nearest]).toEqual(presets[id as never])
    })
  })

  it('stays on the preset when one part differs', () => {
    const appearance = resolveAppearance({ preset: 'preset-09', beard: 'full' })
    expect(nearestPresetTo(appearance)).toBe('preset-09')
  })

  it('lists exactly the parts that differ', () => {
    const appearance = resolveAppearance({ preset: 'preset-09', beard: 'full', mouth: 'grin' })
    expect(differencesFromPreset(appearance, 'preset-09').sort()).toEqual(['beard', 'mouth'])
  })

  it('reports no differences for an untouched preset', () => {
    const appearance = resolveAppearance({ preset: 'facu-02' })
    expect(differencesFromPreset(appearance, 'facu-02')).toEqual([])
  })

  it('always returns a preset the registry knows', () => {
    const appearance = randomAppearance(sequence([0.11, 0.29, 0.47, 0.63, 0.71, 0.88, 0.95]))
    expect(nearestPresetTo(appearance) in presets).toBe(true)
  })
})
