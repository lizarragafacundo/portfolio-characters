import {
  CHARACTER_STROKE_SCALE,
  bucketPrimitivesByLayer,
  buildPrimitives,
  type RenderablePrimitive,
} from '../parts/buildPrimitives'
import { paletteFor } from '../parts/colorTokens'
import type { CharacterLayerName, EyeStyle, Primitive } from '../parts/partTypes'
import { PART_REGISTRY } from '../parts/registry'
import type { ResolvedAppearance } from '../parts/resolveAppearance'
import { CHARACTER_LAYERS } from './characterLayers'
import { expressionOverlaysFor } from './expressionOverlays'
import { shirtFill, shirtOutline } from './torso'

const PUPIL_DRAW_DELAY = 1.72
const PUPIL_DRAW_DURATION = 0.3
const IRIS_DRAW_DELAY = 1.62
const IRIS_DRAW_DURATION = 0.4
const IRIS_STROKE_WIDTH = 1.93

const circlePath = (centreX: number, centreY: number, radius: number) =>
  `M${centreX - radius},${centreY} a${radius},${radius} 0 1,0 ${radius * 2},0 a${radius},${radius} 0 1,0 ${-radius * 2},0`

const eyePrimitives = (style: EyeStyle, side: 'Left' | 'Right'): Primitive[] => {
  const centreX = side === 'Left' ? style.centreX[0] : style.centreX[1]
  const iris: Primitive[] =
    style.ringRadius === undefined
      ? []
      : [
          {
            name: `iris${side}`,
            path: circlePath(centreX, style.centreY, style.ringRadius),
            strokeWidth: IRIS_STROKE_WIDTH,
            drawDelay: IRIS_DRAW_DELAY,
            drawDuration: IRIS_DRAW_DURATION,
          },
        ]

  if (style.pupilRadius === 0) return iris

  return [
    ...iris,
    {
      name: `pupil${side}`,
      path: circlePath(centreX, style.centreY, style.pupilRadius),
      fill: 'ink',
      drawDelay: PUPIL_DRAW_DELAY,
      drawDuration: PUPIL_DRAW_DURATION,
    },
  ]
}

export type CharacterLayers = Record<CharacterLayerName, RenderablePrimitive[]>

export interface ExpressionLayers {
  browsRaised: RenderablePrimitive[]
  mouthOpen: RenderablePrimitive[]
}

export interface AssembleOptions {
  appearance: ResolvedAppearance
  speedScale?: number
  baseDelay?: number
  animate?: boolean
}

export interface AssembledCharacter {
  layers: CharacterLayers
  expressions: ExpressionLayers
  eyeStyle: EyeStyle
}

const emptyLayers = () =>
  CHARACTER_LAYERS.reduce((layers, layer) => ({ ...layers, [layer]: [] }), {} as CharacterLayers)

export const assembleCharacter = ({
  appearance,
  speedScale = 1,
  baseDelay = 0,
  animate = true,
}: AssembleOptions): AssembledCharacter => {
  const palette = paletteFor(appearance.skinTone, appearance.hairColor)
  const options = {
    palette,
    speedScale,
    baseDelay,
    animate,
    strokeScale: CHARACTER_STROKE_SCALE,
  }
  const build = (primitives: Primitive[]) => buildPrimitives(primitives, options)

  const hair = PART_REGISTRY.hairStyles[appearance.hair]
  const glasses = PART_REGISTRY.glassesStyles[appearance.glasses]
  const eyeStyle = PART_REGISTRY.eyeStyles[appearance.eyes]
  const overlays = expressionOverlaysFor(PART_REGISTRY)
  const head = bucketPrimitivesByLayer(build(PART_REGISTRY.faceBase.head), 'face')

  return {
    layers: {
      ...emptyLayers(),
      hairBack: build(hair.behindHead),
      neck: build(PART_REGISTRY.faceBase.neck),
      shirtFill: build(shirtFill),
      shirtOutline: build(shirtOutline),
      face: head.face ?? [],
      beard: build(PART_REGISTRY.beardStyles[appearance.beard]),
      ears: head.ears ?? [],
      nose: head.nose ?? [],
      mouth: build(PART_REGISTRY.mouthStyles[appearance.mouth]),
      eyeDecor: [...build(glasses.lens), ...build(eyeStyle.decor)],
      eyeLeft: build(eyePrimitives(eyeStyle, 'Left')),
      eyeRight: build(eyePrimitives(eyeStyle, 'Right')),
      glasses: build(glasses.frame),
      brows: build(PART_REGISTRY.faceBase.brows),
      hairFront: build(hair.overHead),
    },
    expressions: {
      browsRaised: buildPrimitives(overlays.browsRaised, { ...options, animate: false }),
      mouthOpen: buildPrimitives(overlays.mouthOpen, { ...options, animate: false }),
    },
    eyeStyle,
  }
}
