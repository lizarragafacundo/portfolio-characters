'use client'

import { useEffect, useRef, useState, type RefObject } from 'react'

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))

export interface DockOptions {
  hero: RefObject<HTMLElement | null>
  enabled: boolean
  dockAt: number
  undockAt: number
  onProgress: (p: number) => void
  onBeforeFlip: () => void
}

export interface DockState {
  docked: boolean
  first: RefObject<boolean>
}

export const useDockOnScroll = (options: DockOptions): DockState => {
  const { hero, enabled, dockAt, undockAt, onProgress, onBeforeFlip } = options
  const [docked, setDocked] = useState(false)
  const first = useRef(true)

  const latest = useRef({ dockAt, undockAt, onProgress, onBeforeFlip, docked })
  latest.current = { dockAt, undockAt, onProgress, onBeforeFlip, docked }

  useEffect(() => {
    const el = hero.current
    if (!el || !enabled) return

    const measure = () => {
      const { dockAt, undockAt, onProgress, onBeforeFlip, docked } = latest.current
      const vh = window.innerHeight || 800
      const p = clamp(-el.getBoundingClientRect().top / (vh * 0.5), 0, 1)
      onProgress(p)

      if (p > dockAt && !docked) {
        onBeforeFlip()
        setDocked(true)
      } else if (p < undockAt && docked) {
        onBeforeFlip()
        setDocked(false)
      }
    }

    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure, { passive: true })

    let io: IntersectionObserver | undefined
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(measure, {
        threshold: Array.from({ length: 11 }, (_, i) => i / 10),
      })
      io.observe(el)
    }

    measure()

    return () => {
      window.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
      io?.disconnect()
    }
  }, [hero, enabled])

  return { docked, first }
}
