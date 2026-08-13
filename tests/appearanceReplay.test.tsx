import { render } from '@testing-library/react'
import { useRef, type RefObject } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useAppearanceReplay } from '../src/hooks/useAppearanceReplay'
import { RENDER_MOTIONS } from '../src/renderMotions'
import type { RenderMotionName } from '../src/types'

interface HarnessProps {
  appearanceKey: string
  motion?: RenderMotionName
  enabled?: boolean
  baked?: boolean
  locked?: boolean
  svgRef: RefObject<SVGSVGElement | null>
}

const Harness = ({
  appearanceKey,
  motion = 'sketch',
  enabled = true,
  baked = true,
  locked = false,
  svgRef,
}: HarnessProps) => {
  const lock = useRef(locked)
  lock.current = locked

  useAppearanceReplay(svgRef, {
    motion,
    appearanceKey,
    enabled,
    hasBakedIntro: () => baked,
    dockTransitionLock: lock,
  })

  return null
}

const mountSvg = () => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  ;['face', 'mouth', 'brows'].forEach((layer) => {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    group.setAttribute('data-fl', layer)
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.setAttribute('pathLength', '1')
    group.appendChild(path)
    svg.appendChild(group)
  })
  document.body.appendChild(svg)
  return { current: svg } as RefObject<SVGSVGElement | null>
}

const groupsOf = (svgRef: RefObject<SVGSVGElement | null>) => [
  ...(svgRef.current?.querySelectorAll<SVGGElement>('[data-fl]') ?? []),
]

describe('useAppearanceReplay', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    document.body.innerHTML = ''
  })

  it('does not replay on mount, where the entrance owns the paths', () => {
    const svgRef = mountSvg()
    render(<Harness appearanceKey="a" svgRef={svgRef} motion="pop" />)
    vi.advanceTimersByTime(200)

    expect(groupsOf(svgRef).every((group) => group.style.animation === '')).toBe(true)
  })

  it('replays once when the appearance key changes', () => {
    const svgRef = mountSvg()
    const { rerender } = render(<Harness appearanceKey="a" svgRef={svgRef} motion="pop" />)
    rerender(<Harness appearanceKey="b" svgRef={svgRef} motion="pop" />)
    vi.advanceTimersByTime(200)

    const animations = groupsOf(svgRef).map((group) => group.style.animation)
    expect(animations.every((value) => value.includes('chpop'))).toBe(true)
  })

  it('staggers the groups by the motion’s own cadence', () => {
    const svgRef = mountSvg()
    const { rerender } = render(<Harness appearanceKey="a" svgRef={svgRef} motion="wipe" />)
    rerender(<Harness appearanceKey="b" svgRef={svgRef} motion="wipe" />)
    vi.advanceTimersByTime(200)

    const [first, second] = groupsOf(svgRef).map((group) => group.style.animation)
    expect(first).toContain('0ms')
    expect(second).toContain(`${RENDER_MOTIONS.wipe.stagger}ms`)
  })

  it('does not replay while the intro is still drawing', () => {
    const svgRef = mountSvg()
    const { rerender } = render(
      <Harness appearanceKey="a" svgRef={svgRef} motion="pop" baked={false} />,
    )
    rerender(<Harness appearanceKey="b" svgRef={svgRef} motion="pop" baked={false} />)
    vi.advanceTimersByTime(200)

    expect(groupsOf(svgRef).every((group) => group.style.animation === '')).toBe(true)
  })

  it('yields to the dock transition rather than fighting it', () => {
    const svgRef = mountSvg()
    const { rerender } = render(<Harness appearanceKey="a" svgRef={svgRef} motion="pop" locked />)
    rerender(<Harness appearanceKey="b" svgRef={svgRef} motion="pop" locked />)
    vi.advanceTimersByTime(200)

    expect(groupsOf(svgRef).every((group) => group.style.animation === '')).toBe(true)
  })

  it('snaps instead of animating when motion is reduced', () => {
    const svgRef = mountSvg()
    const { rerender } = render(
      <Harness appearanceKey="a" svgRef={svgRef} motion="pop" enabled={false} />,
    )
    rerender(<Harness appearanceKey="b" svgRef={svgRef} motion="pop" enabled={false} />)
    vi.advanceTimersByTime(200)

    expect(groupsOf(svgRef).every((group) => group.style.animation === '')).toBe(true)
  })

  it('redraws the strokes for the sketch motion and cleans up after itself', () => {
    const svgRef = mountSvg()
    const { rerender } = render(<Harness appearanceKey="a" svgRef={svgRef} motion="sketch" />)
    rerender(<Harness appearanceKey="b" svgRef={svgRef} motion="sketch" />)
    vi.advanceTimersByTime(100)

    const paths = [...(svgRef.current?.querySelectorAll<SVGElement>('[pathLength]') ?? [])]
    expect(paths.every((path) => path.style.strokeDashoffset === '0')).toBe(true)

    vi.advanceTimersByTime(1500)
    expect(paths.every((path) => path.style.strokeDasharray === '')).toBe(true)
  })

  it('cancels its cleanup timer when unmounted mid-replay', () => {
    const svgRef = mountSvg()
    const { rerender, unmount } = render(
      <Harness appearanceKey="a" svgRef={svgRef} motion="sketch" />,
    )
    rerender(<Harness appearanceKey="b" svgRef={svgRef} motion="sketch" />)
    vi.advanceTimersByTime(100)

    expect(() => {
      unmount()
      vi.advanceTimersByTime(2000)
    }).not.toThrow()
  })
})
