export { PortfolioCharacter, DeskCharacter } from './PortfolioCharacter'
export { CharacterPortrait, type CharacterPortraitProps } from './character/CharacterPortrait'
export { CHARACTER_LAYERS } from './character/characterLayers'
export { PORTRAIT_CROPS, type PortraitCropName } from './character/portraitCrops'
export { DEFAULT_PERSONA } from './defaultPersona'

export { THEMES, resolveTheme, themeVars } from './theme'
export { MOTIONS, resolveMotion } from './motions'
export { VARIANTS, type Geometry, type VariantName } from './geometry'

export {
  PART_REGISTRY,
  APPEARANCE_KEYS,
  DEFAULT_PRESET,
  CHARACTER_STROKE_SCALE,
  NEUTRAL_PALETTE,
  appearanceKeyOf,
  buildPrimitives,
  colorFor,
  differencesFromPreset,
  nearestPresetTo,
  paletteFor,
  randomAppearance,
  resolveAppearance,
  toRenderablePrimitive,
  type Appearance,
  type BeardId,
  type CharacterLayerName,
  type ColorToken,
  type DeskObjectId,
  type EyeStyle,
  type EyesId,
  type GlassesId,
  type GlassesStyle,
  type HairColorId,
  type HairId,
  type HairStyle,
  type MouthId,
  type Palette,
  type PartRegistry,
  type Preset,
  type PresetId,
  type Primitive,
  type RandomSource,
  type RenderablePrimitive,
  type ResolvedAppearance,
  type SkinTone,
  type SkinToneId,
} from './parts'

export {
  buildTimeline,
  checkScript,
  restingStep,
  timelineDuration,
  TIMING,
  type ScriptIssue,
  type Step,
} from './terminal/timeline'
export { useTerminalScript, type TerminalOptions } from './terminal/useTerminalScript'

export {
  LINE_BUDGET,
  TOKEN_BUDGET,
  LIST_BUDGET,
  type DeskCharacterProps,
  type Frame,
  type Motion,
  type MotionName,
  type Persona,
  type PortfolioCharacterProps,
  type Theme,
  type ThemeName,
} from './types'
