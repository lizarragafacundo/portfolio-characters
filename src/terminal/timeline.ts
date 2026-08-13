import { LINE_BUDGET, LIST_BUDGET, TOKEN_BUDGET, type Frame } from '../types'

export interface Step {
  frame: number
  visibleLines: number
  showPrompt: boolean
  showCaret: boolean
  cleared: boolean
  hold: number
}

export const TIMING = {
  blank: 240,
  prompt: 540,
  line: 170,
  hold: 1400,
  clear: 500,
} as const

export const buildTimeline = (script: Frame[]): Step[] => {
  const steps: Step[] = []

  script.forEach((frame, i) => {
    const lines = frame.lines.length

    steps.push({
      frame: i,
      visibleLines: 0,
      showPrompt: false,
      showCaret: false,
      cleared: false,
      hold: TIMING.blank,
    })
    steps.push({
      frame: i,
      visibleLines: 0,
      showPrompt: true,
      showCaret: true,
      cleared: false,
      hold: TIMING.prompt,
    })

    for (let n = 1; n <= lines; n++) {
      steps.push({
        frame: i,
        visibleLines: n,
        showPrompt: true,
        showCaret: false,
        cleared: false,
        hold: TIMING.line,
      })
    }

    steps.push({
      frame: i,
      visibleLines: lines,
      showPrompt: true,
      showCaret: false,
      cleared: false,
      hold: frame.hold ?? TIMING.hold,
    })
    steps.push({
      frame: i,
      visibleLines: lines,
      showPrompt: true,
      showCaret: false,
      cleared: true,
      hold: TIMING.clear,
    })
  })

  return steps
}

export const restingStep = (script: Frame[]): Step => {
  const last = Math.max(0, script.length - 1)
  return {
    frame: last,
    visibleLines: script[last]?.lines.length ?? 0,
    showPrompt: true,
    showCaret: false,
    cleared: false,
    hold: Infinity,
  }
}

export const timelineDuration = (script: Frame[]): number => {
  return buildTimeline(script).reduce((sum, step) => sum + step.hold, 0)
}

export interface ScriptIssue {
  frame: number
  message: string
}

export const checkScript = (script: Frame[]): ScriptIssue[] => {
  const issues: ScriptIssue[] = []

  if (script.length === 0) {
    issues.push({ frame: -1, message: 'script is empty — at least one frame is required' })
  }

  script.forEach((frame, i) => {
    if (!frame.prompt.trim()) {
      issues.push({ frame: i, message: 'prompt is empty' })
    }
    if (frame.lines.length > LINE_BUDGET) {
      issues.push({
        frame: i,
        message: `${frame.lines.length} lines exceeds the ${LINE_BUDGET}-line screen budget`,
      })
    }
    if (frame.layout === 'list' && frame.lines.length > LINE_BUDGET / 2) {
      issues.push({
        frame: i,
        message: `layout 'list' fits ${LINE_BUDGET / 2} lines, got ${frame.lines.length}`,
      })
    }
    const width = frame.layout === 'list' ? LIST_BUDGET : TOKEN_BUDGET
    frame.lines.forEach((line, n) => {
      if (line.length > width) {
        issues.push({
          frame: i,
          message: `line ${n} ("${line}") is ${line.length} chars, over the ${width}-char row`,
        })
      }
    })
  })

  return issues
}
