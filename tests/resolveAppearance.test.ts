import { describe, expect, it } from 'vitest'
import {
  APPEARANCE_KEYS,
  DEFAULT_PRESET,
  appearanceKeyOf,
  resolveAppearance,
} from '../src/parts/resolveAppearance'
import { presets } from '../src/parts/registry'

describe('resolveAppearance', () => {
  it('falls back to the default preset when given nothing', () => {
    expect(resolveAppearance()).toEqual({ preset: DEFAULT_PRESET, ...presets[DEFAULT_PRESET] })
  })

  it('ignores undefined sources', () => {
    expect(resolveAppearance(undefined, undefined)).toEqual(resolveAppearance())
  })

  it('takes every part from a named preset', () => {
    const resolved = resolveAppearance({ preset: 'preset-07' })
    expect(resolved).toEqual({ preset: 'preset-07', ...presets['preset-07'] })
  })

  it('lets a later source override the preset', () => {
    const resolved = resolveAppearance({ preset: 'preset-01' }, { preset: 'preset-03' })
    expect(resolved.preset).toBe('preset-03')
    expect(resolved.hair).toBe(presets['preset-03'].hair)
  })

  it('applies part overrides on top of the preset', () => {
    const resolved = resolveAppearance({ preset: 'preset-01', glasses: 'cateye' })
    expect(resolved.glasses).toBe('cateye')
    expect(resolved.skinTone).toBe(presets['preset-01'].skinTone)
  })

  it('lets the last source win per key', () => {
    const resolved = resolveAppearance(
      { preset: 'preset-01', hair: 'afro', eyes: 'wide' },
      { hair: 'bun' },
    )
    expect(resolved.hair).toBe('bun')
    expect(resolved.eyes).toBe('wide')
  })

  it('prefers a persona look but lets explicit props beat it', () => {
    const personaLook = { preset: 'preset-06' as const, mouth: 'pout' as const }
    const props = { mouth: 'grin' as const }
    expect(resolveAppearance(personaLook, props).mouth).toBe('grin')
  })

  it('falls back to the preset value for an unknown id', () => {
    const resolved = resolveAppearance({
      preset: 'preset-02',
      hair: 'mullet' as never,
      eyes: 'lasers' as never,
    })
    expect(resolved.hair).toBe(presets['preset-02'].hair)
    expect(resolved.eyes).toBe(presets['preset-02'].eyes)
  })

  it('falls back to the default preset for an unknown preset id', () => {
    expect(resolveAppearance({ preset: 'preset-99' as never }).preset).toBe(DEFAULT_PRESET)
  })

  it('always resolves all seven parts', () => {
    const resolved = resolveAppearance({ preset: 'preset-09' })
    APPEARANCE_KEYS.forEach((key) => expect(resolved[key], key).toBeDefined())
  })
})

describe('appearanceKeyOf', () => {
  it('changes when any part changes', () => {
    const base = resolveAppearance({ preset: 'facu-02' })
    expect(appearanceKeyOf(base)).toBe(appearanceKeyOf(resolveAppearance({ preset: 'facu-02' })))
    expect(appearanceKeyOf(base)).not.toBe(
      appearanceKeyOf(resolveAppearance({ preset: 'facu-02', beard: 'full' })),
    )
  })

  it('ignores which preset the parts came from', () => {
    const viaPreset = resolveAppearance({ preset: 'facu-01' })
    const viaParts = resolveAppearance({ preset: 'facu-02', glasses: 'none' })
    expect(appearanceKeyOf(viaPreset)).toBe(appearanceKeyOf(viaParts))
  })
})
