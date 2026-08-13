import type { ColorToken, HairColorId, SkinToneId } from './partTypes'
import { hairColors, skinTones } from './registry'

export interface Palette {
  skinLight: string
  skinShade: string
  hair: string
}

const THEME_COLORS: Record<'ink' | 'fill' | 'tint' | 'shade', string> = {
  ink: 'var(--dc-ink)',
  fill: 'var(--dc-fill)',
  tint: 'var(--dc-tint)',
  shade: 'var(--dc-shade)',
}

/** Desk objects belong to the room, so their skin and hair roles resolve to theme colours. */
export const NEUTRAL_PALETTE: Palette = {
  skinLight: THEME_COLORS.fill,
  skinShade: THEME_COLORS.shade,
  hair: THEME_COLORS.shade,
}

export const paletteFor = (skinTone: SkinToneId, hairColor: HairColorId): Palette => {
  const tone = skinTones[skinTone] ?? skinTones.golden
  return {
    skinLight: tone.light,
    skinShade: tone.shade,
    hair: hairColors[hairColor] ?? hairColors.espresso,
  }
}

export const colorFor = (value: string | undefined, palette: Palette): string | undefined => {
  if (value === undefined) return undefined
  if (value in THEME_COLORS) return THEME_COLORS[value as keyof typeof THEME_COLORS]
  if (value in palette) return palette[value as keyof Palette]
  return value
}

export const isColorToken = (value: string): value is ColorToken =>
  value in THEME_COLORS || value === 'skinLight' || value === 'skinShade' || value === 'hair'
