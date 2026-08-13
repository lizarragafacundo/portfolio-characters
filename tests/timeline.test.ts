import { describe, expect, it } from 'vitest'
import { buildTimeline, restingStep, TIMING, timelineDuration } from '../src/terminal/timeline'
import type { Frame } from '../src/types'

const frame = (prompt: string, lines: string[], hold?: number): Frame => ({
  prompt,
  lines,
  ...(hold === undefined ? {} : { hold }),
})

describe('buildTimeline', () => {
  it('expands one frame into blank → prompt → one step per line → hold → clear', () => {
    const steps = buildTimeline([frame('$ ls', ['a', 'b'])])

    expect(steps.map((s) => [s.showPrompt, s.visibleLines, s.cleared])).toEqual([
      [false, 0, false],
      [true, 0, false],
      [true, 1, false],
      [true, 2, false],
      [true, 2, false],
      [true, 2, true],
    ])
  })

  it('blinks the caret only while the prompt is waiting for output', () => {
    const steps = buildTimeline([frame('$ ls', ['a', 'b'])])
    expect(steps.filter((s) => s.showCaret)).toHaveLength(1)
    expect(steps.findIndex((s) => s.showCaret)).toBe(1)
  })

  it('honours a per-frame hold and falls back to the default otherwise', () => {
    const steps = buildTimeline([frame('$ a', ['x'], 9000), frame('$ b', ['y'])])
    const holds = steps.filter((s) => !s.cleared && s.visibleLines === 1)

    expect(holds.map((s) => s.hold)).toEqual([TIMING.line, 9000, TIMING.line, TIMING.hold])
  })

  it('keeps frames in script order and never skips one', () => {
    const script = [frame('$ a', ['1']), frame('$ b', ['2']), frame('$ c', ['3'])]
    const seen = [...new Set(buildTimeline(script).map((s) => s.frame))]
    expect(seen).toEqual([0, 1, 2])
  })

  it('returns nothing for an empty script rather than throwing', () => {
    expect(buildTimeline([])).toEqual([])
  })

  it('handles a frame with no output lines', () => {
    const steps = buildTimeline([frame('$ clear', [])])
    expect(steps).toHaveLength(4)
    expect(steps.every((s) => s.visibleLines === 0)).toBe(true)
  })
})

describe('restingStep', () => {
  it('parks on the last frame, fully revealed, with no caret', () => {
    const script = [frame('$ a', ['1']), frame('$ b', ['2', '3'])]
    expect(restingStep(script)).toMatchObject({
      frame: 1,
      visibleLines: 2,
      showPrompt: true,
      showCaret: false,
      cleared: false,
    })
  })

  it('survives an empty script', () => {
    expect(restingStep([])).toMatchObject({ frame: 0, visibleLines: 0 })
  })
})

describe('timelineDuration', () => {
  it('sums every hold in the loop', () => {
    const expected = TIMING.blank + TIMING.prompt + TIMING.line + TIMING.hold + TIMING.clear
    expect(timelineDuration([frame('$ a', ['1'])])).toBe(expected)
  })
})
