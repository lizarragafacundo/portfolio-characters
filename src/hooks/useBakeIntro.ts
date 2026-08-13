'use client'

import { useCallback, useEffect, useMemo, useRef, type RefObject } from 'react'
import { introDurationMs } from '../animation/primitiveTiming'

type SvgRef = RefObject<SVGSVGElement | null>

export interface BakeOptions {
  immediate: boolean
  sceneRenderTime?: number
  characterRenderTime?: number
}

export interface BakeController {
  bakeNow: () => void
  hasBakedIntro: () => boolean
}

export const useBakeIntro = (
  svgs: SvgRef[],
  { immediate, sceneRenderTime = 0.9, characterRenderTime = 1.35 }: BakeOptions,
): BakeController => {
  const baked = useRef(false)
  const svgsRef = useRef(svgs)
  svgsRef.current = svgs

  const bake = useCallback(() => {
    if (baked.current) return
    baked.current = true

    for (const ref of svgsRef.current) {
      const svg = ref.current
      if (!svg) continue

      svg.querySelectorAll<SVGElement>('[pathLength]').forEach((el) => {
        el.style.animation = 'none'
        el.style.strokeDashoffset = '0'
      })
      svg.querySelectorAll<SVGElement>('[data-fillel]').forEach((el) => {
        el.style.animation = 'none'
        el.style.opacity = '1'
      })
    }
  }, [])

  useEffect(() => {
    if (immediate) {
      bake()
      return
    }
    const timer = setTimeout(bake, introDurationMs({ sceneRenderTime, characterRenderTime }))
    return () => clearTimeout(timer)
  }, [bake, immediate, sceneRenderTime, characterRenderTime])

  const hasBakedIntro = useCallback(() => baked.current, [])

  return useMemo(() => ({ bakeNow: bake, hasBakedIntro }), [bake, hasBakedIntro])
}

export const useAmbient = (
  roots: (SvgRef | RefObject<HTMLDivElement | null>)[],
  enabled: boolean,
) => {
  const rootsRef = useRef(roots)
  rootsRef.current = roots

  useEffect(() => {
    if (enabled) return
    for (const ref of rootsRef.current) {
      ref.current?.querySelectorAll<HTMLElement>('[data-amb]').forEach((el) => {
        el.style.animation = 'none'
      })
    }
  }, [enabled])
}
