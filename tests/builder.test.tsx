import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { CharacterBuilder } from '../src/builder/CharacterBuilder'
import {
  builderReducer,
  initialBuilderState,
  type BuilderState,
} from '../src/builder/builderReducer'
import { buildUsageSnippet } from '../src/builder/buildUsageSnippet'
import { cycleWithinCategory, positionWithinCategory } from '../src/builder/cycleWithinCategory'
import { partIdsFor } from '../src/parts/catalogues'
import { LINE_BUDGET } from '../src/types'

const withScript = (state: BuilderState): BuilderState => ({
  ...state,
  script: [{ prompt: '$ whoami', lines: ['facundo'] }],
})

describe('cycleWithinCategory', () => {
  it('steps forward and back through a catalogue', () => {
    const [first, second] = partIdsFor('mouth')
    expect(second).toBeDefined()
    expect(cycleWithinCategory('mouth', first, 1)).toBe(second)
    expect(cycleWithinCategory('mouth', second!, -1)).toBe(first)
  })

  it('wraps at both ends', () => {
    const ids = partIdsFor('mouth')
    const [first] = ids
    const last = ids[ids.length - 1]!
    expect(cycleWithinCategory('mouth', last, 1)).toBe(first)
    expect(cycleWithinCategory('mouth', first, -1)).toBe(last)
  })

  it('reports the position so the UI never hardcodes a count', () => {
    const ids = partIdsFor('hair')
    const [first] = ids
    expect(positionWithinCategory('hair', first)).toEqual({ index: 1, total: ids.length })
  })
})

describe('builderReducer', () => {
  const base = initialBuilderState()

  it('cycles a part without disturbing the others', () => {
    const next = builderReducer(base, { type: 'cyclePart', category: 'beard', direction: 1 })
    expect(next.appearance.beard).not.toBe(base.appearance.beard)
    expect(next.appearance.hair).toBe(base.appearance.hair)
  })

  it('reverts to the preset on reset', () => {
    const changed = builderReducer(base, { type: 'cyclePart', category: 'beard', direction: 1 })
    expect(builderReducer(changed, { type: 'reset' }).appearance).toEqual(base.appearance)
  })

  it('randomizes deterministically from a given source', () => {
    const random = () => 0.5
    const first = builderReducer(base, { type: 'randomize', random })
    const second = builderReducer(base, { type: 'randomize', random })
    expect(first.appearance).toEqual(second.appearance)
  })

  it('toggles a desk object', () => {
    const next = builderReducer(base, { type: 'toggleObject', id: 'cat' })
    expect(next.objects.cat).toBe(true)
    expect(builderReducer(next, { type: 'toggleObject', id: 'cat' }).objects.cat).toBe(false)
  })

  it('clamps the render times to a sane range', () => {
    expect(builderReducer(base, { type: 'setSceneRenderTime', seconds: 99 }).sceneRenderTime).toBe(
      4,
    )
    expect(
      builderReducer(base, { type: 'setCharacterRenderTime', seconds: 0 }).characterRenderTime,
    ).toBe(0.3)
  })

  it('adds a block and previews it', () => {
    const next = builderReducer(base, { type: 'addFrame' })
    expect(next.script).toHaveLength(1)
    expect(next.previewedFrameIndex).toBe(0)
  })

  it('refuses to exceed the line budget', () => {
    const filled = Array.from({ length: LINE_BUDGET + 3 }).reduce<BuilderState>(
      (state) => builderReducer(state, { type: 'addLine', index: 0 }),
      builderReducer(base, { type: 'addFrame' }),
    )
    expect(filled.script[0]?.lines.length).toBe(LINE_BUDGET)
  })

  it('keeps the previewed block in range after a removal', () => {
    const two = builderReducer(builderReducer(base, { type: 'addFrame' }), { type: 'addFrame' })
    const removed = builderReducer(two, { type: 'removeFrame', index: 1 })
    expect(removed.previewedFrameIndex).toBeLessThan(removed.script.length)
  })

  it('edits a prompt and a line in place', () => {
    const one = builderReducer(base, { type: 'addFrame' })
    const named = builderReducer(one, { type: 'setPrompt', index: 0, prompt: '$ whoami' })
    const written = builderReducer(named, { type: 'setLine', index: 0, line: 0, value: 'facundo' })
    expect(written.script[0]).toEqual({ prompt: '$ whoami', lines: ['facundo'] })
  })
})

describe('buildUsageSnippet', () => {
  const base = initialBuilderState()

  it('names a preset and lists nothing else when nothing changed', () => {
    const code = buildUsageSnippet(base, { includeInstall: false })
    expect(code).toContain(`preset='${base.appearance.preset}'`)
    expect(code).not.toContain('skinTone=')
    expect(code).not.toContain('objects=')
  })

  it('lists only what differs from the nearest preset', () => {
    const changed = builderReducer(base, { type: 'cyclePart', category: 'beard', direction: 1 })
    const code = buildUsageSnippet(changed, { includeInstall: false })
    expect(code).toContain(`beard='${changed.appearance.beard}'`)
    expect(code).not.toContain('mouth=')
  })

  it('includes only the objects that differ from the defaults', () => {
    const changed = builderReducer(base, { type: 'toggleObject', id: 'cat' })
    expect(buildUsageSnippet(changed, { includeInstall: false })).toContain(
      'objects={{ cat: true }}',
    )
  })

  it('omits motions and timings left at their defaults', () => {
    const code = buildUsageSnippet(base, { includeInstall: false })
    expect(code).not.toContain('renderMotion=')
    expect(code).not.toContain('sceneRenderTime=')
  })

  it('includes them once they change', () => {
    const changed = builderReducer(base, { type: 'setRenderMotion', motion: 'pop' })
    expect(buildUsageSnippet(changed, { includeInstall: false })).toContain("renderMotion='pop'")
  })

  it('emits the script when the builder has one', () => {
    const code = buildUsageSnippet(withScript(base), { includeInstall: false })
    expect(code).toContain("prompt: '$ whoami'")
    expect(code).toContain("lines: ['facundo']")
  })

  it('honours a fork’s own component and package names', () => {
    const code = buildUsageSnippet(base, {
      componentName: 'Avatar',
      importSpecifier: '@acme/avatar',
      includeInstall: false,
    })
    expect(code).toContain('<Avatar')
    expect(code).toContain("from '@acme/avatar'")
  })
})

describe('<CharacterBuilder />', () => {
  it('renders a cycler per part plus the preset', () => {
    render(<CharacterBuilder />)
    expect(screen.getByLabelText('Next Hair')).toBeInTheDocument()
    expect(screen.getByLabelText('Next Glasses')).toBeInTheDocument()
    expect(screen.getByLabelText('Next Preset')).toBeInTheDocument()
  })

  it('changes the character when a cycler is used', async () => {
    const user = userEvent.setup()
    const { container } = render(<CharacterBuilder />)
    const before = container
      .querySelector('[data-fl="hairFront"] [data-part]')
      ?.getAttribute('data-part')

    await user.click(screen.getByLabelText('Next Hair'))

    const after = container
      .querySelector('[data-fl="hairFront"] [data-part]')
      ?.getAttribute('data-part')
    expect(after).not.toBe(before)
  })

  it('can be driven from outside', async () => {
    const user = userEvent.setup()
    const seen: BuilderState[] = []
    const state = initialBuilderState()

    render(<CharacterBuilder value={state} onChange={(next) => seen.push(next)} />)
    await user.click(screen.getByLabelText('Next Beard'))

    expect(seen).toHaveLength(1)
    expect(seen[0]?.appearance.beard).not.toBe(state.appearance.beard)
  })

  it('shows the generated snippet', () => {
    render(<CharacterBuilder />)
    expect(screen.getByText(/PortfolioCharacter/)).toBeInTheDocument()
  })
})
