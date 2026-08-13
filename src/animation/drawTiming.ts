import type { CSSProperties } from 'react'

export const EASE_DRAW = 'cubic-bezier(.5,0,.3,1)'

export const drawStroke = (
  duration: number,
  delay: number,
  ease: string = 'ease',
): CSSProperties => ({
  strokeDasharray: 1,
  strokeDashoffset: 1,
  animation: `chdraw ${duration}s ${ease} ${delay}s forwards`,
})

export const fadeIn = (duration: number, delay: number): CSSProperties => ({
  opacity: 0,
  animation: `chfill ${duration}s ease ${delay}s forwards`,
})
