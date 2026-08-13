export { DeskCharacter } from './DeskCharacter'

export { THEMES, resolveTheme, themeVars } from './theme'
export { MOTIONS, resolveMotion } from './motions'
export { VARIANTS, type Geometry, type VariantName } from './geometry'

export {
  buildTimeline,
  checkScript,
  restingStep,
  timelineDuration,
  TIMING,
  type ScriptIssue,
  type Step,
} from './terminal/timeline'
export { useTerminalScript, type TerminalOptions } from './terminal/useTerminalScript'

export {
  LINE_BUDGET,
  TOKEN_BUDGET,
  LIST_BUDGET,
  type DeskCharacterProps,
  type Frame,
  type Motion,
  type MotionName,
  type Persona,
  type Theme,
  type ThemeName,
} from './types'
