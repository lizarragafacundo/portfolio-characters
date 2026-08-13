import type { Frame } from '../../types'
import { LINE_BUDGET } from '../../types'

export interface TerminalScriptEditorProps {
  script: Frame[]
  previewedFrameIndex: number
  onPreview: (index: number) => void
  onAddFrame: () => void
  onRemoveFrame: (index: number) => void
  onSetPrompt: (index: number, prompt: string) => void
  onAddLine: (index: number) => void
  onRemoveLine: (index: number, line: number) => void
  onSetLine: (index: number, line: number, value: string) => void
  classNames?: { panel?: string; input?: string }
}

export const TerminalScriptEditor = ({
  script,
  previewedFrameIndex,
  onPreview,
  onAddFrame,
  onRemoveFrame,
  onSetPrompt,
  onAddLine,
  onRemoveLine,
  onSetLine,
  classNames,
}: TerminalScriptEditorProps) => {
  const lineCount = script.reduce((total, frame) => total + 1 + frame.lines.length, 0)

  return (
    <section className={`pcb-panel ${classNames?.panel ?? ''}`}>
      <h3 className="pcb-legend">
        Laptop terminal
        <span className="pcb-legend-note">
          {script.length} block{script.length === 1 ? '' : 's'} · {lineCount} lines
        </span>
      </h3>

      <div className="pcb-terminal">
        {script.map((frame, index) => (
          <div
            key={index}
            className={`pcb-block ${index === previewedFrameIndex ? 'pcb-block-on' : ''}`}
          >
            <div className="pcb-block-head">
              <button
                type="button"
                className="pcb-dot"
                aria-label={`Preview block ${index + 1}`}
                aria-pressed={index === previewedFrameIndex}
                onClick={() => onPreview(index)}
              />
              <span className="pcb-caret">$</span>
              <input
                className={`pcb-input ${classNames?.input ?? ''}`}
                value={frame.prompt}
                spellCheck={false}
                placeholder="command"
                aria-label={`Command for block ${index + 1}`}
                onChange={(event) => onSetPrompt(index, event.target.value)}
              />
              <button
                type="button"
                className="pcb-remove"
                aria-label={`Delete block ${index + 1}`}
                onClick={() => onRemoveFrame(index)}
              >
                ×
              </button>
            </div>

            <div className="pcb-lines">
              {frame.lines.map((line, position) => (
                <div key={position} className="pcb-line">
                  <span className="pcb-line-mark">›</span>
                  <input
                    className={`pcb-input ${classNames?.input ?? ''}`}
                    value={line}
                    spellCheck={false}
                    placeholder="output line"
                    aria-label={`Output line ${position + 1} of block ${index + 1}`}
                    onChange={(event) => onSetLine(index, position, event.target.value)}
                  />
                  <button
                    type="button"
                    className="pcb-remove pcb-remove-quiet"
                    aria-label={`Delete line ${position + 1} of block ${index + 1}`}
                    onClick={() => onRemoveLine(index, position)}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="pcb-add-line"
                disabled={frame.lines.length >= LINE_BUDGET}
                onClick={() => onAddLine(index)}
              >
                + line
              </button>
            </div>
          </div>
        ))}

        <button type="button" className="pcb-add-block" onClick={onAddFrame}>
          + add block
        </button>
      </div>

      <p className="pcb-hint">
        Each block is one command — the dot previews it on the laptop. Up to {LINE_BUDGET} output
        lines per block.
      </p>
    </section>
  )
}
