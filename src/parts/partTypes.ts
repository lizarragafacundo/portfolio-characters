export type SkinToneId =
  | 'paper'
  | 'celeste'
  | 'ivory'
  | 'sand'
  | 'golden'
  | 'olive'
  | 'amber'
  | 'bronze'
  | 'chestnut'
  | 'cocoa'
  | 'espresso'

export type HairId =
  | 'wavy'
  | 'fringe'
  | 'afro'
  | 'curly'
  | 'long'
  | 'bun'
  | 'buzz'
  | 'bald'
  | 'pixie'
  | 'sidepart'
  | 'cap'
  | 'beanie'
  | 'crop'

export type HairColorId =
  | 'paper'
  | 'celeste'
  | 'black'
  | 'espresso'
  | 'brown'
  | 'chestnut'
  | 'auburn'
  | 'blonde'
  | 'gray'
  | 'white'
  | 'violet'

export type EyesId =
  | 'round'
  | 'almond'
  | 'wide'
  | 'sleepy'
  | 'happy'
  | 'narrow'
  | 'big'
  | 'lashes'
  | 'monolid'
  | 'brown'
  | 'spark'
  | 'ringed'

export type MouthId = 'smile' | 'grin' | 'neutral' | 'soft' | 'smirk' | 'pout'

export type BeardId = 'none' | 'stubble' | 'goatee' | 'full' | 'mustache'

export type GlassesId = 'none' | 'square' | 'round' | 'halfrim' | 'sun' | 'cateye'

export type DeskObjectId = 'headphones' | 'gamepad' | 'cat' | 'books' | 'keyboard' | 'polaroids'

export type PresetId =
  | 'preset-01'
  | 'preset-02'
  | 'preset-03'
  | 'preset-04'
  | 'preset-05'
  | 'preset-06'
  | 'preset-07'
  | 'preset-08'
  | 'preset-09'
  | 'preset-10'
  | 'facu-01'
  | 'facu-02'
  | 'facu-03'
  | 'facu-04'

/**
 * Colour roles a primitive may reference instead of a literal CSS colour.
 *
 * `skinLight` / `skinShade` resolve from the chosen skin tone, `hair` from the
 * chosen hair colour, and `ink` / `fill` / `tint` / `shade` from the theme.
 * Any other string passes straight through as a CSS colour.
 */
export type ColorToken = 'skinLight' | 'skinShade' | 'hair' | 'ink' | 'fill' | 'tint' | 'shade'

export type CharacterLayerName =
  | 'hairBack'
  | 'neck'
  | 'shirtFill'
  | 'shirtOutline'
  | 'face'
  | 'beard'
  | 'ears'
  | 'nose'
  | 'mouth'
  | 'eyeDecor'
  | 'eyeLeft'
  | 'eyeRight'
  | 'glasses'
  | 'brows'
  | 'hairFront'

/** One drawable SVG path. Coordinates are documented in `docs/ANATOMY.md`. */
export interface Primitive {
  /** Identifies the stroke in the DOM as `data-part`. Unique within its part. */
  name: string
  /** The SVG `d` attribute. */
  path: string
  fill?: ColorToken | string
  stroke?: ColorToken | string
  /** Presence marks the primitive as drawn stroke-first on entrance. */
  strokeWidth?: number
  fillOpacity?: number
  opacity?: number
  transform?: string
  /** Decorative dashes. Presence opts the primitive out of the draw-on entrance. */
  dashArray?: string
  /** Entrance delay in seconds, before any speed scaling. */
  drawDelay?: number
  /** Entrance duration in seconds, before any speed scaling. */
  drawDuration?: number
  /** Overrides which `[data-fl]` group the primitive is painted into. */
  layer?: CharacterLayerName
}

export interface SkinTone {
  light: string
  shade: string
}

export interface FaceBase {
  head: Primitive[]
  neck: Primitive[]
  brows: Primitive[]
}

export interface HairStyle {
  behindHead: Primitive[]
  overHead: Primitive[]
}

export interface EyeStyle {
  centreX: [left: number, right: number]
  centreY: number
  pupilRadius: number
  /** Draws an open eye: an outlined iris around the pupil rather than a solid dot. */
  ringRadius?: number
  decor: Primitive[]
}

export interface GlassesStyle {
  lens: Primitive[]
  frame: Primitive[]
}

export interface Preset {
  skinTone: SkinToneId
  hair: HairId
  hairColor: HairColorId
  eyes: EyesId
  mouth: MouthId
  beard: BeardId
  glasses: GlassesId
}

export interface PartRegistry {
  skinTones: Record<SkinToneId, SkinTone>
  hairColors: Record<HairColorId, string>
  faceBase: FaceBase
  hairStyles: Record<HairId, HairStyle>
  eyeStyles: Record<EyesId, EyeStyle>
  mouthStyles: Record<MouthId, Primitive[]>
  beardStyles: Record<BeardId, Primitive[]>
  glassesStyles: Record<GlassesId, GlassesStyle>
  deskObjects: Record<DeskObjectId, Primitive[]>
  presets: Record<PresetId, Preset>
}
