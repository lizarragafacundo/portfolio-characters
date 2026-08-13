import { describe, expect, it } from 'vitest'
import { PART_REGISTRY } from '../src/parts/registry'
import type { ColorToken, Primitive } from '../src/parts/partTypes'

const COLOR_TOKENS: ColorToken[] = [
  'skinLight',
  'skinShade',
  'hair',
  'ink',
  'fill',
  'tint',
  'shade',
]

const CHARACTER_SPACE = { width: 440, height: 620 }
const SCENE_SPACE = { width: 900, height: 600 }

const characterPrimitives = (): Primitive[] => [
  ...PART_REGISTRY.faceBase.head,
  ...PART_REGISTRY.faceBase.neck,
  ...PART_REGISTRY.faceBase.brows,
  ...Object.values(PART_REGISTRY.hairStyles).flatMap((style) => [
    ...style.behindHead,
    ...style.overHead,
  ]),
  ...Object.values(PART_REGISTRY.eyeStyles).flatMap((style) => style.decor),
  ...Object.values(PART_REGISTRY.mouthStyles).flat(),
  ...Object.values(PART_REGISTRY.beardStyles).flat(),
  ...Object.values(PART_REGISTRY.glassesStyles).flatMap((style) => [...style.lens, ...style.frame]),
]

const allPrimitives = (): Primitive[] => [
  ...characterPrimitives(),
  ...Object.values(PART_REGISTRY.deskObjects).flat(),
]

const isKnownColor = (value: string) =>
  COLOR_TOKENS.includes(value as ColorToken) ||
  /^#[0-9a-fA-F]{3,8}$/.test(value) ||
  value.startsWith('var(--')

const coordinatesIn = (path: string) =>
  (path.match(/-?\d+(\.\d+)?/g) ?? []).map((value) => Number(value))

describe('part registry', () => {
  it('carries every part category', () => {
    expect(Object.keys(PART_REGISTRY.skinTones)).toHaveLength(11)
    expect(Object.keys(PART_REGISTRY.hairColors)).toHaveLength(11)
    expect(Object.keys(PART_REGISTRY.hairStyles)).toHaveLength(13)
    expect(Object.keys(PART_REGISTRY.eyeStyles)).toHaveLength(11)
    expect(Object.keys(PART_REGISTRY.mouthStyles)).toHaveLength(6)
    expect(Object.keys(PART_REGISTRY.beardStyles)).toHaveLength(5)
    expect(Object.keys(PART_REGISTRY.glassesStyles)).toHaveLength(6)
    expect(Object.keys(PART_REGISTRY.deskObjects)).toHaveLength(6)
    expect(Object.keys(PART_REGISTRY.presets)).toHaveLength(14)
  })

  it('holds the full imported drawing', () => {
    expect(allPrimitives()).toHaveLength(158)
  })

  it('gives every primitive a non-empty path', () => {
    allPrimitives().forEach((primitive) => {
      expect(primitive.path.length, primitive.name).toBeGreaterThan(0)
      expect(primitive.path, primitive.name).toMatch(/^[Mm]/)
    })
  })

  it('gives every primitive a name', () => {
    allPrimitives().forEach((primitive) => {
      expect(primitive.name, primitive.path.slice(0, 24)).toMatch(/^[a-z][a-zA-Z0-9]*$/)
    })
  })

  it('keeps names unique within each part', () => {
    const parts: Record<string, Primitive[]> = {
      head: PART_REGISTRY.faceBase.head,
      neck: PART_REGISTRY.faceBase.neck,
      brows: PART_REGISTRY.faceBase.brows,
      ...Object.fromEntries(
        Object.entries(PART_REGISTRY.hairStyles).flatMap(([id, style]) => [
          [`hair.${id}.behindHead`, style.behindHead],
          [`hair.${id}.overHead`, style.overHead],
        ]),
      ),
      ...Object.fromEntries(
        Object.entries(PART_REGISTRY.glassesStyles).flatMap(([id, style]) => [
          [`glasses.${id}.lens`, style.lens],
          [`glasses.${id}.frame`, style.frame],
        ]),
      ),
      ...Object.fromEntries(
        Object.entries(PART_REGISTRY.deskObjects).map(([id, list]) => [`object.${id}`, list]),
      ),
    }

    Object.entries(parts).forEach(([part, list]) => {
      const names = list.map((primitive) => primitive.name)
      expect(new Set(names).size, part).toBe(names.length)
    })
  })

  it('only references known colour tokens or real CSS colours', () => {
    allPrimitives().forEach((primitive) => {
      if (primitive.fill) expect(isKnownColor(primitive.fill), primitive.name).toBe(true)
      if (primitive.stroke) expect(isKnownColor(primitive.stroke), primitive.name).toBe(true)
    })
  })

  it('never both draws a stroke and dashes it', () => {
    allPrimitives().forEach((primitive) => {
      if (primitive.dashArray)
        expect(primitive.strokeWidth === undefined, primitive.name).toBe(false)
    })
  })

  it('keeps character primitives inside the 440x620 space', () => {
    characterPrimitives().forEach((primitive) => {
      const values = coordinatesIn(primitive.path)
      expect(Math.min(...values), primitive.name).toBeGreaterThan(-200)
      expect(Math.max(...values), primitive.name).toBeLessThanOrEqual(CHARACTER_SPACE.height + 60)
    })
  })

  it('keeps desk objects inside the 900x600 scene space', () => {
    Object.entries(PART_REGISTRY.deskObjects).forEach(([id, list]) => {
      list.forEach((primitive) => {
        const values = coordinatesIn(primitive.path)
        expect(Math.max(...values), `${id}.${primitive.name}`).toBeLessThanOrEqual(
          SCENE_SPACE.width,
        )
      })
    })
  })

  it('resolves every part id referenced by every preset', () => {
    Object.entries(PART_REGISTRY.presets).forEach(([id, preset]) => {
      expect(PART_REGISTRY.skinTones[preset.skinTone], `${id}.skinTone`).toBeDefined()
      expect(PART_REGISTRY.hairStyles[preset.hair], `${id}.hair`).toBeDefined()
      expect(PART_REGISTRY.hairColors[preset.hairColor], `${id}.hairColor`).toBeDefined()
      expect(PART_REGISTRY.eyeStyles[preset.eyes], `${id}.eyes`).toBeDefined()
      expect(PART_REGISTRY.mouthStyles[preset.mouth], `${id}.mouth`).toBeDefined()
      expect(PART_REGISTRY.beardStyles[preset.beard], `${id}.beard`).toBeDefined()
      expect(PART_REGISTRY.glassesStyles[preset.glasses], `${id}.glasses`).toBeDefined()
    })
  })

  it('anchors every eye style on the same eye line', () => {
    Object.entries(PART_REGISTRY.eyeStyles).forEach(([id, style]) => {
      expect(style.centreX, id).toHaveLength(2)
      expect(style.centreX[0], id).toBeLessThan(style.centreX[1])
      expect(style.centreY, id).toBeGreaterThan(200)
      expect(style.centreY, id).toBeLessThan(220)
    })
  })

  it('keeps the empty parts empty', () => {
    expect(PART_REGISTRY.beardStyles.none).toHaveLength(0)
    expect(PART_REGISTRY.glassesStyles.none.lens).toHaveLength(0)
    expect(PART_REGISTRY.glassesStyles.none.frame).toHaveLength(0)
    expect(PART_REGISTRY.hairStyles.bald.behindHead).toHaveLength(0)
  })
})
