import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { DeskCharacter } from '../src/DeskCharacter'
import { facundo } from '../personas'

describe('server rendering', () => {
  const html = renderToStaticMarkup(<DeskCharacter persona={facundo} theme="matrix" />)

  it('draws the entire scene without a browser', () => {
    expect(html).toContain('data-fl="face"')
    expect(html).toContain('data-fl="hairFront"')
    expect(html.match(/<path/g)?.length ?? 0).toBeGreaterThan(60)
  })

  it('prints the terminal at its resting frame, so it is legible before hydration', () => {
    const last = facundo.script.at(-1)
    expect(html).toContain(last?.prompt)
    for (const line of last?.lines ?? []) {
      expect(html).toContain(line)
    }
  })

  it('emits the theme as custom properties, not as resolved colours', () => {
    expect(html).toContain('--dc-ink')
    expect(html).toContain('var(--dc-ink)')
  })

  it('hides the scene from assistive technology', () => {
    expect(html).toContain('aria-hidden="true"')
  })

  it('starts undocked, so the first client render cannot disagree', () => {
    expect(html).not.toContain('position:fixed')
  })
})
