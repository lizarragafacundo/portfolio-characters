'use client'

import { useEffect, useRef, type RefObject } from 'react'
import type { GazeController } from './useGaze'

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))

export interface PointerLookOptions {
  enabled: boolean
  moveFace: boolean
  docked: boolean
  leanBase: RefObject<number>
  box: RefObject<HTMLDivElement | null>
}

export const usePointerLook = (gaze: GazeController, options: PointerLookOptions) => {
  const { enabled, moveFace, docked, leanBase, box } = options

  const opts = useRef({ moveFace, docked })
  opts.current = { moveFace, docked }

  const lastMove = useRef(0)

  useEffect(() => {
    if (!enabled) return

    const onMove = (event: PointerEvent) => {
      const now = event.timeStamp || Date.now()
      if (now - lastMove.current < 16) return
      lastMove.current = now

      if (!gaze.held()) {
        gaze.look({ x: event.clientX, y: event.clientY }, { moveFace: opts.current.moveFace })
      }

      if (opts.current.docked && box.current) {
        const lean = leanBase.current + clamp((event.clientX / window.innerWidth - 0.8) * 14, -6, 6)
        box.current.style.transform = `rotate(${lean}deg)`
      }
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [enabled, gaze, leanBase, box])
}
