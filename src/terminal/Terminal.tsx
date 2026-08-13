import { forwardRef } from 'react'
import type { Geometry } from '../geometry'
import type { Frame } from '../types'
import type { Step } from './timeline'

export interface TerminalProps {
  script: Frame[]
  step: Step
  geometry: Geometry
  hidden?: boolean
}

const CARET = '▋'

export const Terminal = forwardRef<HTMLDivElement, TerminalProps>(function Terminal(
  { script, step, geometry, hidden },
  ref,
) {
  const frame = script[step.frame]
  if (!frame) return null

  const isGrid = frame.layout !== 'list'
  const { laptop, terminal, fontSize, unit } = geometry

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        inset: 0,
        containerType: 'inline-size',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          display: hidden ? 'none' : 'block',
          position: 'absolute',
          left: terminal.left,
          top: terminal.top,
          width: terminal.width,
          height: terminal.height,
          transformOrigin: laptop.scaleOrigin,
          transform: `scale(${laptop.scale})`,
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            transformOrigin: laptop.tiltOrigin,
            display: 'flex',
            flexDirection: 'column',
            gap: unit(2),
            padding: `${unit(4)} ${unit(5.4)}`,
            fontFamily: 'Consolas, "Lucida Console", ui-monospace, SFMono-Regular, monospace',
            fontSize,
            lineHeight: 1.34,
            color: 'var(--dc-screen)',
            overflow: 'hidden',
          }}
        >
          <div style={{ opacity: step.showPrompt ? 1 : 0, transition: 'opacity .14s ease' }}>
            {frame.prompt}
            <span
              style={{
                animation: 'chcaret 1.1s step-end infinite',
                opacity: step.showCaret ? 1 : 0,
              }}
              data-amb=""
            >
              {CARET}
            </span>
          </div>

          <div
            style={
              isGrid
                ? {
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    columnGap: unit(6),
                    rowGap: unit(1),
                  }
                : { display: 'flex', flexDirection: 'column', rowGap: unit(1) }
            }
          >
            {frame.lines.map((line, i) => (
              <div
                key={line}
                style={{
                  opacity: !step.cleared && i < step.visibleLines ? 1 : 0,
                  transition: 'opacity .16s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {line}
              </div>
            ))}
          </div>

          <div style={{ opacity: step.cleared ? 1 : 0, transition: 'opacity .14s ease' }}>
            $ clear
            <span style={{ animation: 'chcaret 1.1s step-end infinite' }} data-amb="">
              {CARET}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
})
