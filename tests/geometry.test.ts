import { describe, expect, it } from 'vitest'
import { VARIANTS } from '../src/geometry'

const pct = (s: string) => Number.parseFloat(s)

describe('variants', () => {
  it('frames the scene at 3:2 and the desk tighter', () => {
    expect(VARIANTS.scene.aspect).toBe('900/600')
    expect(VARIANTS.scene.viewBox).toBe('0 0 900 600')
    expect(pct(VARIANTS.desk.aspect.split('/')[0]!)).toBeLessThan(900)
  })

  it('keeps the terminal on the laptop screen in both framings', () => {
    for (const [name, geometry] of Object.entries(VARIANTS)) {
      const left = pct(geometry.terminal.left)
      const top = pct(geometry.terminal.top)
      const width = pct(geometry.terminal.width)
      const height = pct(geometry.terminal.height)

      expect(left, name).toBeGreaterThan(0)
      expect(left + width, name).toBeLessThan(100)
      expect(top, name).toBeGreaterThan(0)
      expect(top + height, name).toBeLessThan(100)
    }
  })

  it('keeps the character inside the frame in both framings', () => {
    for (const [name, geometry] of Object.entries(VARIANTS)) {
      const left = pct(geometry.character.left)
      const width = pct(geometry.character.width)
      expect(left, name).toBeGreaterThanOrEqual(0)
      expect(left + width, name).toBeLessThanOrEqual(100)
    }
  })

  it('grows the terminal type as the crop tightens, so it stays legible', () => {
    expect(pct(VARIANTS.desk.fontSize)).toBeGreaterThan(pct(VARIANTS.scene.fontSize))
  })

  it('makes the character bigger in desk — the entire point of the crop', () => {
    expect(pct(VARIANTS.desk.character.width)).toBeGreaterThan(pct(VARIANTS.scene.character.width))
  })

  it('scales scene units to container units consistently', () => {
    expect(pct(VARIANTS.scene.unit(900))).toBeCloseTo(100, 1)
    expect(pct(VARIANTS.desk.unit(858))).toBeCloseTo(100, 1)
  })
})
