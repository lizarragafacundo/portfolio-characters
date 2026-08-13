import type { CSSProperties } from 'react'

export const EASE_DRAW = 'cubic-bezier(.5,0,.3,1)'

export const draw = (dur: number, delay: number, ease: string = 'ease'): CSSProperties => {
  return {
    strokeDasharray: 1,
    strokeDashoffset: 1,
    animation: `chdraw ${dur}s ${ease} ${delay}s forwards`,
  }
}

export const fill = (dur: number, delay: number): CSSProperties => {
  return {
    opacity: 0,
    animation: `chfill ${dur}s ease ${delay}s forwards`,
  }
}
