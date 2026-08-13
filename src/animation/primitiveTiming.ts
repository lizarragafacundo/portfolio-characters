import type { CSSProperties } from 'react'
import type { Primitive } from '../parts/partTypes'
import { drawStroke, EASE_DRAW, fadeIn } from './drawTiming'

export const SCENE_RENDER_SECONDS = 0.9
export const CHARACTER_RENDER_SECONDS = 1.35

/**
 * Delays authored in the registry are relative to the character's own entrance,
 * which begins once the room has drawn itself in.
 */
export const CHARACTER_BASE_DELAY = 0

const DRAW_DURATION_FALLBACK = 0.5
const FADE_DURATION_FALLBACK = 0.4
const DRAW_DELAY_FALLBACK = 1.2
const FADE_DELAY_FALLBACK = 1.5

const INTRO_SETTLE_MS = 700

export interface RenderSpeed {
  sceneRenderTime: number
  characterRenderTime: number
}

export interface PrimitiveTimingOptions {
  speedScale: number
  baseDelay: number
}

export const isDrawnStroke = ({ strokeWidth, dashArray }: Primitive) =>
  strokeWidth !== undefined && dashArray === undefined

export const characterSpeedScale = (characterRenderTime: number) =>
  characterRenderTime / CHARACTER_RENDER_SECONDS

export const sceneSpeedScale = (sceneRenderTime: number) => sceneRenderTime / SCENE_RENDER_SECONDS

export const introDurationMs = ({ sceneRenderTime, characterRenderTime }: RenderSpeed) =>
  (sceneRenderTime + characterRenderTime) * 1000 + INTRO_SETTLE_MS

export const timingStyleFor = (
  primitive: Primitive,
  { speedScale, baseDelay }: PrimitiveTimingOptions,
): CSSProperties =>
  isDrawnStroke(primitive)
    ? drawStroke(
        (primitive.drawDuration ?? DRAW_DURATION_FALLBACK) * speedScale,
        baseDelay + (primitive.drawDelay ?? DRAW_DELAY_FALLBACK) * speedScale,
        EASE_DRAW,
      )
    : fadeIn(
        (primitive.drawDuration ?? FADE_DURATION_FALLBACK) * speedScale,
        baseDelay + (primitive.drawDelay ?? FADE_DELAY_FALLBACK) * speedScale,
      )
