'use client'

import { useCallback, useEffect, useRef, type RefObject } from 'react'

const INTRO_MS = 2500

type SvgRef = RefObject<SVGSVGElement | null>

export const useBake = (svgs: SvgRef[], { immediate }: { immediate: boolean }) => {
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
    const timer = setTimeout(bake, INTRO_MS)
    return () => clearTimeout(timer)
  }, [bake, immediate])

  return bake
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
