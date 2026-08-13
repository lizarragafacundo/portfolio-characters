'use client'

import { useCallback, useMemo, useReducer, type CSSProperties } from 'react'
import { CharacterPortrait } from '../character/CharacterPortrait'
import { MOTIONS } from '../dockMotions'
import type { PartCategory } from '../parts/catalogues'
import { hairColors, skinTones } from '../parts/registry'
import { PortfolioCharacter } from '../PortfolioCharacter'
import { RENDER_MOTIONS } from '../renderMotions'
import { DEFAULT_SCENE_OBJECTS, type SceneObjectId } from '../scene/deskObjectPlacement'
import { resolveTheme, themeVars } from '../theme'
import type { MotionName, Persona, RenderMotionName, Theme, ThemeName } from '../types'
import {
  builderReducer,
  initialBuilderState,
  type BuilderAction,
  type BuilderState,
} from './builderReducer'
import { buildUsageSnippet, type SnippetOptions } from './buildUsageSnippet'
import { positionWithinCategory, presetPosition, type CycleDirection } from './cycleWithinCategory'
import { ChipRow } from './controls/ChipRow'
import { PartCycler } from './controls/PartCycler'
import { RenderTimingFields } from './controls/RenderTimingFields'
import { TerminalScriptEditor } from './controls/TerminalScriptEditor'
import { UsageSnippet } from './controls/UsageSnippet'

export interface BuilderClassNames {
  root?: string
  panel?: string
  row?: string
  button?: string
  chip?: string
  input?: string
  code?: string
}

export interface CharacterBuilderProps {
  /** Drive the builder from outside. Pair it with `onChange`. */
  value?: BuilderState
  onChange?: (state: BuilderState) => void
  initialState?: Partial<BuilderState>
  persona?: Persona
  theme?: ThemeName | Theme
  snippet?: SnippetOptions
  /** Set to 'none' to drop the shipped stylesheet and bring your own. */
  chrome?: 'auto' | 'none'
  classNames?: BuilderClassNames
  className?: string
  style?: CSSProperties
}

const PART_ROWS: { category: PartCategory; label: string }[] = [
  { category: 'skinTone', label: 'Skin' },
  { category: 'hair', label: 'Hair' },
  { category: 'hairColor', label: 'Hair colour' },
  { category: 'eyes', label: 'Eyes' },
  { category: 'mouth', label: 'Mouth' },
  { category: 'beard', label: 'Beard' },
  { category: 'glasses', label: 'Glasses' },
]

const OBJECT_IDS = Object.keys(DEFAULT_SCENE_OBJECTS) as SceneObjectId[]

const swatchFor = (category: PartCategory, value: string) => {
  if (category === 'skinTone') return skinTones[value as keyof typeof skinTones]?.shade
  if (category === 'hairColor') return hairColors[value as keyof typeof hairColors]
  return undefined
}

export const CharacterBuilder = ({
  value,
  onChange,
  initialState,
  persona,
  theme,
  snippet,
  chrome = 'auto',
  classNames,
  className,
  style,
}: CharacterBuilderProps) => {
  const [ownState, dispatchOwn] = useReducer(builderReducer, initialState, initialBuilderState)
  const state = value ?? ownState

  const dispatch = useCallback(
    (action: BuilderAction) => {
      if (value) {
        onChange?.(builderReducer(value, action))
        return
      }
      dispatchOwn(action)
    },
    [value, onChange],
  )

  const cyclePart = (category: PartCategory, direction: CycleDirection) =>
    dispatch({ type: 'cyclePart', category, direction })

  const previewPersona = useMemo<Persona | undefined>(() => {
    if (!persona) return undefined
    return state.script.length > 0 ? { ...persona, script: state.script } : persona
  }, [persona, state.script])

  const code = useMemo(() => buildUsageSnippet(state, snippet), [state, snippet])

  const preset = presetPosition(state.appearance.preset)

  return (
    <div
      className={`pcb-builder ${chrome === 'none' ? 'pcb-bare' : ''} ${classNames?.root ?? ''} ${className ?? ''}`}
      style={{ ...themeVars(resolveTheme(theme)), ...style }}
    >
      <div className="pcb-preview">
        <div className={`pcb-panel pcb-stage ${classNames?.panel ?? ''}`}>
          <span className="pcb-stage-label">{state.appearance.preset}</span>
          <CharacterPortrait
            key={`${state.appearance.preset}-portrait`}
            crop="bust"
            {...state.appearance}
            characterRenderTime={state.characterRenderTime}
          />
        </div>

        <div className={`pcb-panel pcb-scene ${classNames?.panel ?? ''}`}>
          <h3 className="pcb-legend">Full scene</h3>
          <PortfolioCharacter
            persona={previewPersona}
            {...state.appearance}
            objects={state.objects}
            renderMotion={state.renderMotion}
            dockMotion={state.dockMotion}
            characterRenderTime={state.characterRenderTime}
            variant="desk"
            dock={false}
            className="pcb-scene-stage"
          />
        </div>

        <UsageSnippet code={code} classNames={classNames} />
      </div>

      <div className="pcb-controls">
        <section className={`pcb-panel ${classNames?.panel ?? ''}`}>
          <h3 className="pcb-legend">Appearance</h3>

          <PartCycler
            label="Preset"
            value={state.appearance.preset}
            index={preset.index}
            total={preset.total}
            onPrevious={() => dispatch({ type: 'cyclePreset', direction: -1 })}
            onNext={() => dispatch({ type: 'cyclePreset', direction: 1 })}
            classNames={classNames}
          />

          {PART_ROWS.map(({ category, label }) => {
            const current = state.appearance[category]
            const { index, total } = positionWithinCategory(category, current)
            return (
              <PartCycler
                key={category}
                label={label}
                value={current}
                index={index}
                total={total}
                swatch={swatchFor(category, current)}
                onPrevious={() => cyclePart(category, -1)}
                onNext={() => cyclePart(category, 1)}
                classNames={classNames}
              />
            )
          })}

          <div className="pcb-actions">
            <button
              type="button"
              className={`pcb-action ${classNames?.button ?? ''}`}
              onClick={() => dispatch({ type: 'randomize' })}
            >
              Random
            </button>
            <button
              type="button"
              className={`pcb-action pcb-action-quiet ${classNames?.button ?? ''}`}
              onClick={() => dispatch({ type: 'reset' })}
            >
              Reset to preset
            </button>
          </div>
        </section>

        <ChipRow
          legend="Redraw motion"
          note="how the drawing rebuilds itself"
          hint={RENDER_MOTIONS[state.renderMotion].hint}
          classNames={classNames}
          chips={(Object.keys(RENDER_MOTIONS) as RenderMotionName[]).map((id) => ({
            id,
            label: id,
            selected: id === state.renderMotion,
            onSelect: () => dispatch({ type: 'setRenderMotion', motion: id }),
          }))}
        />

        <ChipRow
          legend="Dock motion"
          note="how it flies to the corner"
          classNames={classNames}
          chips={(Object.keys(MOTIONS) as MotionName[]).map((id) => ({
            id,
            label: id,
            selected: id === state.dockMotion,
            onSelect: () => dispatch({ type: 'setDockMotion', motion: id }),
          }))}
        />

        <ChipRow
          legend="Room and desk"
          classNames={classNames}
          chips={OBJECT_IDS.map((id) => ({
            id,
            label: id,
            selected: state.objects[id],
            onSelect: () => dispatch({ type: 'toggleObject', id }),
          }))}
        />

        <TerminalScriptEditor
          script={state.script}
          previewedFrameIndex={state.previewedFrameIndex}
          classNames={classNames}
          onPreview={(index) => dispatch({ type: 'previewFrame', index })}
          onAddFrame={() => dispatch({ type: 'addFrame' })}
          onRemoveFrame={(index) => dispatch({ type: 'removeFrame', index })}
          onSetPrompt={(index, prompt) => dispatch({ type: 'setPrompt', index, prompt })}
          onAddLine={(index) => dispatch({ type: 'addLine', index })}
          onRemoveLine={(index, line) => dispatch({ type: 'removeLine', index, line })}
          onSetLine={(index, line, lineValue) =>
            dispatch({ type: 'setLine', index, line, value: lineValue })
          }
        />

        <RenderTimingFields
          sceneRenderTime={state.sceneRenderTime}
          characterRenderTime={state.characterRenderTime}
          classNames={classNames}
          onSceneRenderTime={(seconds) => dispatch({ type: 'setSceneRenderTime', seconds })}
          onCharacterRenderTime={(seconds) => dispatch({ type: 'setCharacterRenderTime', seconds })}
        />
      </div>
    </div>
  )
}
