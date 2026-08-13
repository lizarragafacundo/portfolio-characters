import { describe, expect, it } from 'vitest'
import { resolveTheme, THEMES, themeVars } from '../src/theme'
import type { Theme } from '../src/types'

const ROLES: (keyof Theme)[] = ['ink', 'fill', 'shade', 'tint', 'screen', 'bg']

describe('THEMES', () => {
  it.each(Object.entries(THEMES))('%s defines every colour role', (_name, theme) => {
    for (const role of ROLES) {
      expect(theme[role], role).toBeTruthy()
    }
  })

  it('gives the two presets genuinely different ink, not a tweak', () => {
    expect(THEMES.light.ink).not.toBe(THEMES.matrix.ink)
  })

  it('leaves the matrix background transparent so it inherits the host page', () => {
    expect(THEMES.matrix.bg).toBe('transparent')
  })
})

describe('resolveTheme', () => {
  it('falls back to light when nothing is passed', () => {
    expect(resolveTheme(undefined)).toEqual(THEMES.light)
  })

  it('looks up a preset by name', () => {
    expect(resolveTheme('matrix')).toEqual(THEMES.matrix)
  })

  it('passes a custom theme object straight through', () => {
    const custom: Theme = {
      ink: 'red',
      fill: 'white',
      shade: 'pink',
      tint: 'peach',
      screen: 'red',
      bg: 'black',
    }
    expect(resolveTheme(custom)).toBe(custom)
  })
})

describe('themeVars', () => {
  it('emits one --dc-* custom property per role', () => {
    const vars = themeVars(THEMES.light)
    expect(Object.keys(vars).sort()).toEqual([
      '--dc-bg',
      '--dc-fill',
      '--dc-ink',
      '--dc-screen',
      '--dc-shade',
      '--dc-tint',
    ])
    expect(vars['--dc-ink']).toBe(THEMES.light.ink)
  })

  it('accepts a var() reference, which is how a host design system hooks in', () => {
    const vars = themeVars({ ...THEMES.light, ink: 'var(--color-ac)' })
    expect(vars['--dc-ink']).toBe('var(--color-ac)')
  })
})
