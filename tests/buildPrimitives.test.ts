import { describe, expect, it } from 'vitest'
import {
  CHARACTER_STROKE_SCALE,
  bucketPrimitivesByLayer,
  buildPrimitives,
  toRenderablePrimitive,
} from '../src/parts/buildPrimitives'
import { NEUTRAL_PALETTE, paletteFor } from '../src/parts/colorTokens'
import { faceBase } from '../src/parts/registry'
import type { Primitive } from '../src/parts/partTypes'

const palette = paletteFor('golden', 'espresso')

const strokePrimitive: Primitive = {
  name: 'testStroke',
  path: 'M0,0 L10,10',
  strokeWidth: 2,
  drawDelay: 1,
  drawDuration: 0.5,
}

const fillPrimitive: Primitive = {
  name: 'testFill',
  path: 'M0,0 L10,10 Z',
  fill: 'skinShade',
  drawDelay: 1.7,
}

const dashedPrimitive: Primitive = {
  name: 'testDashed',
  path: 'M0,0 L10,0',
  strokeWidth: 1.4,
  dashArray: '5 4',
  drawDelay: 0.5,
}

describe('toRenderablePrimitive', () => {
  it('resolves skin and hair tokens from the palette', () => {
    expect(toRenderablePrimitive(fillPrimitive, { palette }).fill).toBe(palette.skinShade)
    expect(toRenderablePrimitive({ ...fillPrimitive, fill: 'hair' }, { palette }).fill).toBe(
      palette.hair,
    )
    expect(toRenderablePrimitive({ ...fillPrimitive, fill: 'skinLight' }, { palette }).fill).toBe(
      palette.skinLight,
    )
  })

  it('resolves theme tokens to custom properties', () => {
    expect(toRenderablePrimitive({ ...fillPrimitive, fill: 'ink' }, { palette }).fill).toBe(
      'var(--dc-ink)',
    )
    expect(toRenderablePrimitive({ ...fillPrimitive, fill: 'tint' }, { palette }).fill).toBe(
      'var(--dc-tint)',
    )
  })

  it('passes literal colours through untouched', () => {
    expect(toRenderablePrimitive({ ...fillPrimitive, fill: '#8B5E3C' }, { palette }).fill).toBe(
      '#8B5E3C',
    )
  })

  it('defaults an unfilled primitive to none and a stroked one to ink', () => {
    const built = toRenderablePrimitive(strokePrimitive, { palette })
    expect(built.fill).toBe('none')
    expect(built.stroke).toBe('var(--dc-ink)')
  })

  it('resolves desk objects against the neutral palette', () => {
    const built = toRenderablePrimitive(fillPrimitive, { palette: NEUTRAL_PALETTE })
    expect(built.fill).toBe('var(--dc-shade)')
    expect(built.fill).not.toBe(palette.skinShade)
  })

  it('marks stroked primitives as drawn and dashed ones as not', () => {
    expect(toRenderablePrimitive(strokePrimitive, { palette }).drawn).toBe(true)
    expect(toRenderablePrimitive(fillPrimitive, { palette }).drawn).toBe(false)
    expect(toRenderablePrimitive(dashedPrimitive, { palette }).drawn).toBe(false)
  })

  it('draws strokes with chdraw and fades everything else with chfill', () => {
    expect(toRenderablePrimitive(strokePrimitive, { palette }).style?.animation).toContain('chdraw')
    expect(toRenderablePrimitive(fillPrimitive, { palette }).style?.animation).toContain('chfill')
    expect(toRenderablePrimitive(dashedPrimitive, { palette }).style?.animation).toContain('chfill')
  })

  it('honours the authored delay and duration', () => {
    const style = toRenderablePrimitive(strokePrimitive, { palette }).style
    expect(style?.animation).toContain('0.5s')
    expect(style?.animation).toContain('1s')
  })

  it('scales delay and duration linearly with the speed scale', () => {
    const style = toRenderablePrimitive(strokePrimitive, { palette, speedScale: 2 }).style
    expect(style?.animation).toContain('1s')
    expect(style?.animation).toContain('2s')
  })

  it('offsets every delay by the base delay', () => {
    const style = toRenderablePrimitive(strokePrimitive, { palette, baseDelay: 0.9 }).style
    expect(style?.animation).toContain('1.9s')
  })

  it('omits the entrance style when animation is off', () => {
    expect(
      toRenderablePrimitive(strokePrimitive, { palette, animate: false }).style,
    ).toBeUndefined()
  })

  it('scales stroke width without touching the authored data', () => {
    const built = toRenderablePrimitive(strokePrimitive, {
      palette,
      strokeScale: CHARACTER_STROKE_SCALE,
    })
    expect(built.strokeWidth).toBeCloseTo(2 * CHARACTER_STROKE_SCALE)
    expect(strokePrimitive.strokeWidth).toBe(2)
  })

  it('leaves fill-only primitives without a stroke width', () => {
    expect(
      toRenderablePrimitive(fillPrimitive, { palette, strokeScale: 2 }).strokeWidth,
    ).toBeUndefined()
  })

  it('carries the name through for data-part', () => {
    expect(toRenderablePrimitive(strokePrimitive, { palette }).name).toBe('testStroke')
  })
})

describe('buildPrimitives', () => {
  it('builds the whole head', () => {
    expect(buildPrimitives(faceBase.head, { palette })).toHaveLength(faceBase.head.length)
  })
})

describe('bucketPrimitivesByLayer', () => {
  it('splits the head into face, ears and nose', () => {
    const buckets = bucketPrimitivesByLayer(buildPrimitives(faceBase.head, { palette }), 'face')
    expect(buckets.face?.map((primitive) => primitive.name)).toEqual(['jawShadow', 'skullOutline'])
    expect(buckets.ears).toHaveLength(4)
    expect(buckets.nose?.map((primitive) => primitive.name)).toEqual(['noseShadow', 'noseBridge'])
  })

  it('sends untagged primitives to the fallback layer', () => {
    const buckets = bucketPrimitivesByLayer(buildPrimitives(faceBase.brows, { palette }), 'brows')
    expect(buckets.brows).toHaveLength(2)
    expect(buckets.face).toBeUndefined()
  })
})
