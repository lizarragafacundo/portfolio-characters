import type { Theme, ThemeName } from './types'

export const THEMES = {
  light: {
    ink: '#7326d3',
    fill: '#f4fbfe',
    shade: '#a9dbec',
    tint: '#cfeaf4',
    screen: '#7326d3',
    bg: '#eef8fc',
  },

  matrix: {
    ink: 'oklch(0.6 0.18 170)',
    fill: 'oklch(0.155 0.012 264)',
    shade: 'oklch(0.22 0.03 200)',
    tint: 'oklch(0.19 0.02 230)',
    screen: 'oklch(0.72 0.16 170)',
    bg: 'transparent',
  },

  cmd: {
    ink: '#16c60c',
    fill: '#161616',
    shade: '#242424',
    tint: '#1e1e1e',
    screen: '#16c60c',
    bg: 'transparent',
  },

  ink: {
    ink: '#6000cb',
    fill: '#ffffff',
    shade: '#aadcec',
    tint: '#d7eef7',
    screen: '#105d67',
    bg: 'transparent',
  },
} as const satisfies Record<ThemeName, Theme>

const CSS_VAR = {
  ink: '--dc-ink',
  fill: '--dc-fill',
  shade: '--dc-shade',
  tint: '--dc-tint',
  screen: '--dc-screen',
  bg: '--dc-bg',
} as const satisfies Record<keyof Theme, string>

export const resolveTheme = (theme: ThemeName | Theme | undefined): Theme => {
  if (!theme) return THEMES.light
  if (typeof theme === 'string') return THEMES[theme] ?? THEMES.light
  return theme
}

export const themeVars = (theme: Theme): Record<string, string> => {
  const out: Record<string, string> = {}
  for (const [key, cssVar] of Object.entries(CSS_VAR)) {
    out[cssVar] = theme[key as keyof Theme]
  }
  return out
}
