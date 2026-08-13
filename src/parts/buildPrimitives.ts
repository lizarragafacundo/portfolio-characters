import type { CSSProperties } from 'react'
import { timingStyleFor } from '../animation/primitiveTiming'
import { colorFor, type Palette } from './colorTokens'
import type { CharacterLayerName, Primitive } from './partTypes'

/**
 * The registry strokes the head at 2.4 where the hand-drawn torso it sits on is
 * stroked at 3.4. One scale keeps the two halves of the drawing consistent.
 */
export const CHARACTER_STROKE_SCALE = 1.35

export interface RenderablePrimitive {
  name: string
  path: string
  fill: string
  stroke?: string
  strokeWidth?: number
  fillOpacity?: number
  opacity?: number
  transform?: string
  dashArray?: string
  drawn: boolean
  style?: CSSProperties
  layer?: CharacterLayerName
}

export interface BuildOptions {
  palette: Palette
  speedScale?: number
  baseDelay?: number
  strokeScale?: number
  animate?: boolean
}

const strokeFor = (primitive: Primitive, palette: Palette) => {
  if (primitive.stroke) return colorFor(primitive.stroke, palette)
  return primitive.strokeWidth === undefined ? undefined : colorFor('ink', palette)
}

export const toRenderablePrimitive = (
  primitive: Primitive,
  { palette, speedScale = 1, baseDelay = 0, strokeScale = 1, animate = true }: BuildOptions,
): RenderablePrimitive => ({
  name: primitive.name,
  path: primitive.path,
  fill: colorFor(primitive.fill, palette) ?? 'none',
  stroke: strokeFor(primitive, palette),
  strokeWidth:
    primitive.strokeWidth === undefined ? undefined : primitive.strokeWidth * strokeScale,
  fillOpacity: primitive.fillOpacity,
  opacity: primitive.opacity,
  transform: primitive.transform,
  dashArray: primitive.dashArray,
  drawn: primitive.strokeWidth !== undefined && primitive.dashArray === undefined,
  style: animate ? timingStyleFor(primitive, { speedScale, baseDelay }) : undefined,
  layer: primitive.layer,
})

export const buildPrimitives = (primitives: Primitive[], options: BuildOptions) =>
  primitives.map((primitive) => toRenderablePrimitive(primitive, options))

export const bucketPrimitivesByLayer = (
  primitives: RenderablePrimitive[],
  fallback: CharacterLayerName,
) =>
  primitives.reduce<Partial<Record<CharacterLayerName, RenderablePrimitive[]>>>(
    (buckets, primitive) => {
      const layer = primitive.layer ?? fallback
      return { ...buckets, [layer]: [...(buckets[layer] ?? []), primitive] }
    },
    {},
  )
