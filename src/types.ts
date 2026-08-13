import type { VariantName } from './geometry'

export interface Theme {
  ink: string
  fill: string
  shade: string
  tint: string
  screen: string
  bg: string
}

export type ThemeName = 'light' | 'matrix' | 'ink' | 'cmd'

export interface Frame {
  prompt: string
  lines: string[]
  layout?: 'grid' | 'list'
  hold?: number
}

export interface Persona {
  name: string
  role: string
  location: string
  script: Frame[]
  glasses?: boolean
  hair?: 'short' | 'long'
}

export type MotionName = 'Cascada' | 'Barrido' | 'Arco' | 'Giro' | 'Rebote' | 'Redibujado'

export interface Motion {
  stagger: number
  dur: number
  ease: string
  redraw?: boolean
  from: (dx: number, dy: number) => string
}

export interface DeskCharacterProps {
  persona: Persona
  theme?: ThemeName | Theme
  dockMotion?: MotionName
  ambient?: boolean
  terminal?: boolean
  blink?: boolean
  variant?: VariantName
  dock?: boolean
  gazeSelector?: string
  dockAt?: number
  undockAt?: number
  className?: string
  children?: React.ReactNode
}

export const LINE_BUDGET = 6

export const TOKEN_BUDGET = 10

export const LIST_BUDGET = 21
