import { CHARACTER_RENDER_SECONDS, SCENE_RENDER_SECONDS } from '../animation/primitiveTiming'
import type { PartCategory } from '../parts/catalogues'
import type { PresetId } from '../parts/partTypes'
import { randomAppearance, type RandomSource } from '../parts/randomAppearance'
import { resolveAppearance, type ResolvedAppearance } from '../parts/resolveAppearance'
import { DEFAULT_SCENE_OBJECTS, type SceneObjectId } from '../scene/deskObjectPlacement'
import type { Frame, MotionName, RenderMotionName } from '../types'
import { LINE_BUDGET } from '../types'
import { cyclePreset, cycleWithinCategory, type CycleDirection } from './cycleWithinCategory'

export interface BuilderState {
  appearance: ResolvedAppearance
  objects: Record<SceneObjectId, boolean>
  script: Frame[]
  previewedFrameIndex: number
  renderMotion: RenderMotionName
  dockMotion: MotionName
  sceneRenderTime: number
  characterRenderTime: number
}

export type BuilderAction =
  | { type: 'cyclePart'; category: PartCategory; direction: CycleDirection }
  | { type: 'cyclePreset'; direction: CycleDirection }
  | { type: 'setPreset'; preset: PresetId }
  | { type: 'toggleObject'; id: SceneObjectId }
  | { type: 'setRenderMotion'; motion: RenderMotionName }
  | { type: 'setDockMotion'; motion: MotionName }
  | { type: 'setSceneRenderTime'; seconds: number }
  | { type: 'setCharacterRenderTime'; seconds: number }
  | { type: 'randomize'; random?: RandomSource }
  | { type: 'reset' }
  | { type: 'previewFrame'; index: number }
  | { type: 'addFrame' }
  | { type: 'removeFrame'; index: number }
  | { type: 'setPrompt'; index: number; prompt: string }
  | { type: 'addLine'; index: number }
  | { type: 'removeLine'; index: number; line: number }
  | { type: 'setLine'; index: number; line: number; value: string }

export const SCENE_RENDER_RANGE = { min: 0.2, max: 4 }
export const CHARACTER_RENDER_RANGE = { min: 0.3, max: 5 }

const clamp = (value: number, { min, max }: { min: number; max: number }) =>
  Math.max(min, Math.min(max, value))

const clampFrameIndex = (index: number, length: number) =>
  length === 0 ? 0 : Math.max(0, Math.min(index, length - 1))

const editFrames = (state: BuilderState, script: Frame[], previewedFrameIndex?: number) => ({
  ...state,
  script,
  previewedFrameIndex: clampFrameIndex(
    previewedFrameIndex ?? state.previewedFrameIndex,
    script.length,
  ),
})

const mapFrame = (script: Frame[], index: number, change: (frame: Frame) => Frame) =>
  script.map((frame, position) => (position === index ? change(frame) : frame))

export const initialBuilderState = (seed: Partial<BuilderState> = {}): BuilderState => ({
  appearance: resolveAppearance(),
  objects: { ...DEFAULT_SCENE_OBJECTS },
  script: [],
  previewedFrameIndex: 0,
  renderMotion: 'sketch',
  dockMotion: 'Cascada',
  sceneRenderTime: SCENE_RENDER_SECONDS,
  characterRenderTime: CHARACTER_RENDER_SECONDS,
  ...seed,
})

export const builderReducer = (state: BuilderState, action: BuilderAction): BuilderState => {
  switch (action.type) {
    case 'cyclePart': {
      const value = cycleWithinCategory(
        action.category,
        state.appearance[action.category],
        action.direction,
      )
      return { ...state, appearance: { ...state.appearance, [action.category]: value } }
    }

    case 'cyclePreset':
      return {
        ...state,
        appearance: resolveAppearance({
          preset: cyclePreset(state.appearance.preset, action.direction),
        }),
      }

    case 'setPreset':
      return { ...state, appearance: resolveAppearance({ preset: action.preset }) }

    case 'toggleObject':
      return {
        ...state,
        objects: { ...state.objects, [action.id]: !state.objects[action.id] },
      }

    case 'setRenderMotion':
      return { ...state, renderMotion: action.motion }

    case 'setDockMotion':
      return { ...state, dockMotion: action.motion }

    case 'setSceneRenderTime':
      return { ...state, sceneRenderTime: clamp(action.seconds, SCENE_RENDER_RANGE) }

    case 'setCharacterRenderTime':
      return { ...state, characterRenderTime: clamp(action.seconds, CHARACTER_RENDER_RANGE) }

    case 'randomize':
      return { ...state, appearance: randomAppearance(action.random) }

    case 'reset':
      return { ...state, appearance: resolveAppearance({ preset: state.appearance.preset }) }

    case 'previewFrame':
      return { ...state, previewedFrameIndex: clampFrameIndex(action.index, state.script.length) }

    case 'addFrame':
      return editFrames(
        state,
        [...state.script, { prompt: '$ echo hello', lines: ['world'] }],
        state.script.length,
      )

    case 'removeFrame':
      return editFrames(
        state,
        state.script.filter((_, position) => position !== action.index),
      )

    case 'setPrompt':
      return editFrames(
        state,
        mapFrame(state.script, action.index, (frame) => ({ ...frame, prompt: action.prompt })),
      )

    case 'addLine':
      return editFrames(
        state,
        mapFrame(state.script, action.index, (frame) =>
          frame.lines.length >= LINE_BUDGET ? frame : { ...frame, lines: [...frame.lines, ''] },
        ),
      )

    case 'removeLine':
      return editFrames(
        state,
        mapFrame(state.script, action.index, (frame) => ({
          ...frame,
          lines: frame.lines.filter((_, position) => position !== action.line),
        })),
      )

    case 'setLine':
      return editFrames(
        state,
        mapFrame(state.script, action.index, (frame) => ({
          ...frame,
          lines: frame.lines.map((line, position) =>
            position === action.line ? action.value : line,
          ),
        })),
      )

    default:
      return state
  }
}
