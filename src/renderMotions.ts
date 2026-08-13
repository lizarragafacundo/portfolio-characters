import type { RenderMotionName } from './types'

export interface RenderMotion {
  keyframes: string | null
  stagger: number
  hint: string
}

/**
 * How the drawing rebuilds itself when a part changes. `sketch` re-runs the
 * stroke draw rather than a keyframe, so it has no keyframes of its own.
 */
export const RENDER_MOTIONS: Record<RenderMotionName, RenderMotion> = {
  sketch: {
    keyframes: null,
    stagger: 70,
    hint: 'Every stroke redraws itself, line by line — the signature look.',
  },
  dissolve: {
    keyframes: 'chdissolve 460ms ease',
    stagger: 60,
    hint: 'Parts fade up in place, the softest option.',
  },
  pop: {
    keyframes: 'chpop 520ms cubic-bezier(.34,1.5,.44,1)',
    stagger: 55,
    hint: 'Each part scales in with a small overshoot.',
  },
  wipe: {
    keyframes: 'chwipe 560ms cubic-bezier(.4,0,.2,1)',
    stagger: 45,
    hint: 'A left-to-right reveal, like ink being uncovered.',
  },
  unroll: {
    keyframes: 'chunroll 560ms cubic-bezier(.3,.9,.3,1)',
    stagger: 50,
    hint: 'Reveals bottom-up, as if unrolling a sheet.',
  },
  flip: {
    keyframes: 'chflip 520ms cubic-bezier(.3,.9,.3,1)',
    stagger: 55,
    hint: 'Parts swing in on the Y axis, playful and fast.',
  },
}

export const SKETCH_STROKE_MS = 620
export const SKETCH_JITTER_MS = 18
export const SKETCH_CLEANUP_MS = 1400
export const LOW_END_STAGGER_MS = 18

export const resolveRenderMotion = (name: RenderMotionName | undefined): RenderMotion =>
  (name && RENDER_MOTIONS[name]) || RENDER_MOTIONS.sketch
