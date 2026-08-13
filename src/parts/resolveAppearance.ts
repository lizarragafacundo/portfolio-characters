import type {
  BeardId,
  EyesId,
  GlassesId,
  HairColorId,
  HairId,
  MouthId,
  Preset,
  PresetId,
  SkinToneId,
} from './partTypes'
import { isKnownPartId } from './catalogues'
import { presets } from './registry'

export const DEFAULT_PRESET: PresetId = 'facu-02'

export interface Appearance {
  preset?: PresetId
  skinTone?: SkinToneId
  hair?: HairId
  hairColor?: HairColorId
  eyes?: EyesId
  mouth?: MouthId
  beard?: BeardId
  glasses?: GlassesId
}

export interface ResolvedAppearance extends Preset {
  preset: PresetId
}

export const APPEARANCE_KEYS = [
  'skinTone',
  'hair',
  'hairColor',
  'eyes',
  'mouth',
  'beard',
  'glasses',
] as const satisfies readonly (keyof Preset)[]

const presetFor = (id: PresetId | undefined): PresetId =>
  id !== undefined && id in presets ? id : DEFAULT_PRESET

/**
 * Merges a persona's own look with any explicit overrides. Later sources win,
 * and an id the registry does not know falls back to the preset's value rather
 * than throwing — ids arrive from builders and content systems as plain strings.
 */
export const resolveAppearance = (...sources: (Appearance | undefined)[]): ResolvedAppearance => {
  const chosenPreset = sources.reduce<PresetId | undefined>(
    (chosen, source) => (source?.preset !== undefined ? source.preset : chosen),
    undefined,
  )
  const preset = presetFor(chosenPreset)
  const base = presets[preset]

  const resolved = APPEARANCE_KEYS.reduce((accumulated, key) => {
    const override = sources.reduce<unknown>(
      (chosen, source) => (source?.[key] !== undefined ? source[key] : chosen),
      undefined,
    )
    return {
      ...accumulated,
      [key]: isKnownPartId(key, override) ? override : base[key],
    }
  }, {} as Preset)

  return { preset, ...resolved }
}

export const appearanceKeyOf = (appearance: ResolvedAppearance) =>
  APPEARANCE_KEYS.map((key) => appearance[key]).join('|')
