import { CHARACTER_RENDER_SECONDS, SCENE_RENDER_SECONDS } from '../animation/primitiveTiming'
import { differencesFromPreset, nearestPresetTo } from '../parts/nearestPreset'
import { DEFAULT_SCENE_OBJECTS, type SceneObjectId } from '../scene/deskObjectPlacement'
import type { BuilderState } from './builderReducer'

export interface SnippetOptions {
  componentName?: string
  importSpecifier?: string
  includeInstall?: boolean
}

const DEFAULT_COMPONENT = 'PortfolioCharacter'
const DEFAULT_SPECIFIER = '@facundolizarraga/portfolio-characters'

const quote = (value: string) => `'${value.replace(/'/g, "\\'")}'`

const changedObjects = (objects: Record<SceneObjectId, boolean>) =>
  (Object.keys(objects) as SceneObjectId[]).filter(
    (id) => objects[id] !== DEFAULT_SCENE_OBJECTS[id],
  )

const scriptProp = (state: BuilderState) => {
  if (state.script.length === 0) return null
  const frames = state.script
    .map((frame) => {
      const lines = frame.lines.map(quote).join(', ')
      const layout = frame.layout === 'list' ? ", layout: 'list'" : ''
      return `    { prompt: ${quote(frame.prompt)}, lines: [${lines}]${layout} },`
    })
    .join('\n')
  return `  persona={{\n    ...facundo,\n    script: [\n${frames}\n    ],\n  }}`
}

/**
 * Names the closest preset and lists only what differs from it, so even a
 * randomised character produces a snippet somebody would actually paste.
 */
export const buildUsageSnippet = (state: BuilderState, options: SnippetOptions = {}) => {
  const {
    componentName = DEFAULT_COMPONENT,
    importSpecifier = DEFAULT_SPECIFIER,
    includeInstall = true,
  } = options

  const preset = nearestPresetTo(state.appearance)
  const props = [`  preset=${quote(preset)}`]

  differencesFromPreset(state.appearance, preset).forEach((key) => {
    props.push(`  ${key}=${quote(state.appearance[key])}`)
  })

  const objects = changedObjects(state.objects)
  if (objects.length > 0) {
    const entries = objects.map((id) => `${id}: ${state.objects[id]}`).join(', ')
    props.push(`  objects={{ ${entries} }}`)
  }

  if (state.renderMotion !== 'sketch') props.push(`  renderMotion=${quote(state.renderMotion)}`)
  if (state.dockMotion !== 'Cascada') props.push(`  dockMotion=${quote(state.dockMotion)}`)
  if (state.sceneRenderTime !== SCENE_RENDER_SECONDS) {
    props.push(`  sceneRenderTime={${state.sceneRenderTime}}`)
  }
  if (state.characterRenderTime !== CHARACTER_RENDER_SECONDS) {
    props.push(`  characterRenderTime={${state.characterRenderTime}}`)
  }

  const script = scriptProp(state)
  if (script) props.push(script)

  const install = includeInstall ? `npm i ${importSpecifier}\n\n` : ''
  const imports =
    `import { ${componentName} } from ${quote(importSpecifier)}\n` +
    `import ${quote(`${importSpecifier}/styles.css`)}\n\n`

  return `${install}${imports}<${componentName}\n${props.join('\n')}\n/>`
}
