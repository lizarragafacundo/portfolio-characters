import type { VariantName } from './geometry'
import type { Appearance } from './parts/resolveAppearance'

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

/** Who the character is and what it says. How it looks is `appearance`. */
export interface Persona {
  name: string
  role: string
  location: string
  script: Frame[]
  appearance?: Appearance
}

export type MotionName = 'Cascada' | 'Barrido' | 'Arco' | 'Giro' | 'Rebote' | 'Redibujado'

export interface Motion {
  stagger: number
  dur: number
  ease: string
  redraw?: boolean
  from: (dx: number, dy: number) => string
}

/**
 * Part props sit at the top level, so changing one thing is one line.
 * They override whatever `persona.appearance` asked for.
 */
export interface PortfolioCharacterProps extends Appearance {
  /** @default the packaged default persona */
  persona?: Persona
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
  /** Seconds the character takes to draw itself in. @default 1.35 */
  characterRenderTime?: number
  className?: string
  children?: React.ReactNode
}

/** @deprecated Renamed to `PortfolioCharacterProps`. */
export type DeskCharacterProps = PortfolioCharacterProps

export const LINE_BUDGET = 6

export const TOKEN_BUDGET = 10

export const LIST_BUDGET = 21
