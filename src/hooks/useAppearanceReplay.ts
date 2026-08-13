'use client'

import { useLayoutEffect, useRef, type RefObject } from 'react'
import { forceReflow, resetLayerGroups } from '../character/resetLayerGroups'
import {
  LOW_END_STAGGER_MS,
  resolveRenderMotion,
  SKETCH_CLEANUP_MS,
  SKETCH_JITTER_MS,
  SKETCH_STROKE_MS,
} from '../renderMotions'
import type { RenderMotionName } from '../types'

export interface AppearanceReplayOptions {
  motion: RenderMotionName | undefined
  /** A primitive key of the resolved appearance. Changing it triggers one replay. */
  appearanceKey: string
  enabled: boolean
  lowEnd?: boolean
  hasBakedIntro: () => boolean
  dockTransitionLock?: RefObject<boolean>
}

const nextFrame = (run: () => void) => {
  let done = false
  const once = () => {
    if (done) return
    done = true
    run()
  }
  if (typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(() => requestAnimationFrame(once))
  }
  const timer = setTimeout(once, 34)
  return () => clearTimeout(timer)
}

const replaySketch = (root: SVGSVGElement, groups: SVGGElement[], stagger: number) => {
  const paths = [...root.querySelectorAll<SVGElement>('[pathLength]')]
  paths.forEach((path) => {
    path.style.strokeDasharray = '1'
    path.style.strokeDashoffset = '1'
  })
  groups.forEach((group) => {
    group.style.opacity = '0'
  })
  forceReflow(root)

  groups.forEach((group, index) => {
    group.style.transition = `opacity 220ms ease ${index * stagger}ms`
    group.style.opacity = '1'
  })
  paths.forEach((path, index) => {
    const owner = path.closest('[data-fl]')
    const groupIndex = owner ? groups.indexOf(owner as SVGGElement) : 0
    const delay = Math.max(groupIndex, 0) * stagger + (index % 6) * SKETCH_JITTER_MS
    path.style.transition = `stroke-dashoffset ${SKETCH_STROKE_MS}ms ease-out ${delay}ms`
    path.style.strokeDashoffset = '0'
  })

  return () => {
    paths.forEach((path) => {
      path.style.transition = 'none'
      path.style.strokeDasharray = ''
      path.style.strokeDashoffset = ''
    })
  }
}

const replayKeyframes = (groups: SVGGElement[], keyframes: string, stagger: number) => {
  groups.forEach((group, index) => {
    group.style.transformBox = 'fill-box'
    group.style.transformOrigin = 'center'
    group.style.animation = `${keyframes} ${index * stagger}ms both`
  })
}

/**
 * Redraws the character whenever its parts change — but never on mount, where
 * the entrance already owns the paths, and never while the dock transition is
 * mid-flight, because that one is scroll-driven and cannot be interrupted.
 */
export const useAppearanceReplay = (
  svgRef: RefObject<SVGSVGElement | null>,
  {
    motion,
    appearanceKey,
    enabled,
    lowEnd = false,
    hasBakedIntro,
    dockTransitionLock,
  }: AppearanceReplayOptions,
) => {
  const lastKey = useRef<string | null>(null)

  useLayoutEffect(() => {
    if (lastKey.current === null) {
      lastKey.current = appearanceKey
      return
    }
    if (lastKey.current === appearanceKey) return
    lastKey.current = appearanceKey

    if (!enabled) return
    if (dockTransitionLock?.current) return
    if (!hasBakedIntro()) return

    const root = svgRef.current
    if (!root) return

    const { keyframes, stagger } = resolveRenderMotion(motion)
    const staggerMs = lowEnd ? Math.min(stagger, LOW_END_STAGGER_MS) : stagger
    const groups = resetLayerGroups(root)
    forceReflow(root)

    let cleanUpStrokes: (() => void) | undefined
    let cleanUpTimer: ReturnType<typeof setTimeout> | undefined

    const cancelFrame = nextFrame(() => {
      if (keyframes === null) {
        cleanUpStrokes = replaySketch(root, groups, staggerMs)
        cleanUpTimer = setTimeout(() => cleanUpStrokes?.(), SKETCH_CLEANUP_MS)
        return
      }
      replayKeyframes(groups, keyframes, staggerMs)
    })

    return () => {
      cancelFrame()
      if (cleanUpTimer !== undefined) clearTimeout(cleanUpTimer)
      cleanUpStrokes?.()
    }
  }, [appearanceKey, enabled, lowEnd, motion, hasBakedIntro, dockTransitionLock, svgRef])
}
