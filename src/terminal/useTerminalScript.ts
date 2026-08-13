'use client'

import { useEffect, useRef, useState } from 'react'
import type { Frame } from '../types'
import { buildTimeline, checkScript, restingStep, type Step } from './timeline'

export interface TerminalOptions {
  enabled?: boolean
  reducedMotion?: boolean
  startDelay?: number
}

export const useTerminalScript = (script: Frame[], options: TerminalOptions = {}): Step => {
  const { enabled = true, reducedMotion = false, startDelay = 1150 } = options

  const resting = restingStep(script)
  const [step, setStep] = useState<Step>(resting)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return
    for (const issue of checkScript(script)) {
      console.warn(`[desk-character] frame ${issue.frame}: ${issue.message}`)
    }
  }, [script])

  useEffect(() => {
    if (!enabled || reducedMotion) {
      setStep(restingStep(script))
      return
    }

    const timeline = buildTimeline(script)
    if (timeline.length === 0) return

    let i = 0
    const tick = () => {
      const next = timeline[i]
      if (!next) return
      setStep(next)
      i = (i + 1) % timeline.length
      timer.current = setTimeout(tick, next.hold)
    }

    timer.current = setTimeout(tick, startDelay)
    return () => clearTimeout(timer.current)
  }, [script, enabled, reducedMotion, startDelay])

  return step
}
