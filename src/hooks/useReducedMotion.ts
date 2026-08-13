'use client'

import { useEffect, useState } from 'react'

export interface MotionCapability {
  reduced: boolean
  lowEnd: boolean
}

export const useMotionCapability = (): MotionCapability => {
  const [capability, setCapability] = useState<MotionCapability>({
    reduced: false,
    lowEnd: false,
  })

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')

    const sync = () => {
      const reduced = mq.matches
      setCapability({
        reduced,
        lowEnd: reduced || (navigator.hardwareConcurrency ?? 8) <= 4,
      })
    }

    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  return capability
}
