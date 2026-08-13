'use client'

import { useEffect, useRef } from 'react'
import type { GazeController } from './useGaze'

const HOLD_MS = 1600

export const useSectionGaze = (
  gaze: GazeController,
  { selector, enabled }: { selector: string | undefined; enabled: boolean },
) => {
  const active = useRef<Element | null>(null)

  useEffect(() => {
    if (!selector || !enabled) return

    const targets = Array.from(document.querySelectorAll(selector))
    if (targets.length === 0) return

    const ratios = new Map<Element, number>()

    const glanceAt = (el: Element) => {
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight || 800

      const y = Math.max(vh * 0.15, Math.min(rect.top + 40, vh * 0.85))
      const x = rect.left + rect.width / 2

      gaze.hold(HOLD_MS)
      gaze.look({ x, y }, { ease: true })
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) ratios.set(entry.target, entry.intersectionRatio)

        let best: Element | null = null
        let bestRatio = 0
        for (const [el, ratio] of ratios) {
          if (ratio > bestRatio) {
            best = el
            bestRatio = ratio
          }
        }

        if (!best || bestRatio < 0.2 || best === active.current) return
        active.current = best
        glanceAt(best)
      },
      { threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] },
    )

    for (const target of targets) observer.observe(target)
    return () => observer.disconnect()
  }, [gaze, selector, enabled])
}
