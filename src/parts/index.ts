export { PART_REGISTRY } from './registry'
export {
  beardStyles,
  deskObjects,
  eyeStyles,
  faceBase,
  glassesStyles,
  hairColors,
  hairStyles,
  mouthStyles,
  presets,
  skinTones,
} from './registry'

export { colorFor, isColorToken, paletteFor, NEUTRAL_PALETTE, type Palette } from './colorTokens'

export {
  APPEARANCE_KEYS,
  DEFAULT_PRESET,
  appearanceKeyOf,
  resolveAppearance,
  type Appearance,
  type ResolvedAppearance,
} from './resolveAppearance'

export {
  CHARACTER_STROKE_SCALE,
  bucketPrimitivesByLayer,
  buildPrimitives,
  toRenderablePrimitive,
  type BuildOptions,
  type RenderablePrimitive,
} from './buildPrimitives'

export { differencesFromPreset, nearestPresetTo } from './nearestPreset'
export { randomAppearance, type RandomSource } from './randomAppearance'

export type {
  BeardId,
  CharacterLayerName,
  ColorToken,
  DeskObjectId,
  EyeStyle,
  EyesId,
  FaceBase,
  GlassesId,
  GlassesStyle,
  HairColorId,
  HairId,
  HairStyle,
  MouthId,
  PartRegistry,
  Preset,
  PresetId,
  Primitive,
  SkinTone,
  SkinToneId,
} from './partTypes'
