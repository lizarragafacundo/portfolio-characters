import { CHARACTER_RENDER_RANGE, SCENE_RENDER_RANGE } from '../builderReducer'

export interface RenderTimingFieldsProps {
  sceneRenderTime: number
  characterRenderTime: number
  onSceneRenderTime: (seconds: number) => void
  onCharacterRenderTime: (seconds: number) => void
  classNames?: { panel?: string; input?: string }
}

export const RenderTimingFields = ({
  sceneRenderTime,
  characterRenderTime,
  onSceneRenderTime,
  onCharacterRenderTime,
  classNames,
}: RenderTimingFieldsProps) => (
  <section className={`pcb-panel ${classNames?.panel ?? ''}`}>
    <h3 className="pcb-legend">Render timing</h3>
    <div className="pcb-fields">
      <label className="pcb-field">
        <span>Room — seconds</span>
        <input
          className={`pcb-number ${classNames?.input ?? ''}`}
          type="number"
          min={SCENE_RENDER_RANGE.min}
          max={SCENE_RENDER_RANGE.max}
          step={0.1}
          value={sceneRenderTime}
          onChange={(event) => onSceneRenderTime(Number(event.target.value))}
        />
      </label>
      <label className="pcb-field">
        <span>Character — seconds</span>
        <input
          className={`pcb-number ${classNames?.input ?? ''}`}
          type="number"
          min={CHARACTER_RENDER_RANGE.min}
          max={CHARACTER_RENDER_RANGE.max}
          step={0.1}
          value={characterRenderTime}
          onChange={(event) => onCharacterRenderTime(Number(event.target.value))}
        />
      </label>
    </div>
    <p className="pcb-hint">
      The room draws in over the first time, then the character draws over the second.
    </p>
  </section>
)
