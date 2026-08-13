import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DeskCharacter } from '../src/DeskCharacter'
import { exampleDesigner, facundo } from '../personas'

describe('<DeskCharacter />', () => {
  it('renders without a browser, so it is safe to server-render', () => {
    expect(() => render(<DeskCharacter persona={facundo} />)).not.toThrow()
  })

  it('hides the whole scene from assistive tech', () => {
    const { container } = render(<DeskCharacter persona={facundo} />)
    expect(container.querySelector('.dc-scene')).toHaveAttribute('aria-hidden', 'true')
  })

  it('marks every flip layer the dock transition needs to move', () => {
    const { container } = render(<DeskCharacter persona={facundo} />)
    const layers = [...container.querySelectorAll('[data-fl]')].map((el) =>
      el.getAttribute('data-fl'),
    )
    expect(layers).toEqual([
      'hairback',
      'neck',
      'teefill',
      'tee',
      'face',
      'ears',
      'nose',
      'mouth',
      'lids',
      'eyeL',
      'eyeR',
      'glasses',
      'brows',
      'hair',
    ])
  })

  it('marks the drawn and filled elements bake() has to freeze', () => {
    const { container } = render(<DeskCharacter persona={facundo} />)
    expect(container.querySelectorAll('[pathLength]').length).toBeGreaterThan(50)
    expect(container.querySelectorAll('[data-fillel]').length).toBeGreaterThanOrEqual(20)
  })

  it('marks the looping decorations so they can be stripped on slow devices', () => {
    const { container } = render(<DeskCharacter persona={facundo} />)
    expect(container.querySelectorAll('[data-amb]').length).toBeGreaterThanOrEqual(6)
  })

  it('applies the theme as custom properties rather than baking colours in', () => {
    const { container } = render(<DeskCharacter persona={facundo} theme="matrix" />)
    const scene = container.querySelector('.dc-scene') as HTMLElement
    expect(scene.style.getPropertyValue('--dc-ink')).toBeTruthy()
    expect(container.innerHTML).toContain('var(--dc-ink)')
  })

  it('drops the glasses when the persona says so', () => {
    const { container: withGlasses } = render(<DeskCharacter persona={facundo} />)
    const { container: without } = render(<DeskCharacter persona={exampleDesigner} />)

    expect(withGlasses.querySelector('[data-fl="glasses"]')).not.toBeNull()
    expect(without.querySelector('[data-fl="glasses"]')).toBeNull()
  })

  it('renders the persona’s own commands, not the default one’s', async () => {
    render(<DeskCharacter persona={exampleDesigner} />)
    expect(await screen.findByText('$ ls shipped/')).toBeInTheDocument()
    expect(screen.queryByText('$ terraform apply')).not.toBeInTheDocument()
  })

  it('blinks by default, and stops when asked', () => {
    const { container: on } = render(<DeskCharacter persona={facundo} />)
    const { container: off } = render(<DeskCharacter persona={facundo} blink={false} />)

    const eyes = [...on.querySelectorAll('[data-fl^="eye"][style*="chblink"]')]
    expect(eyes).toHaveLength(2)
    expect(eyes.map((eye) => eye.getAttribute('data-fl'))).toEqual(['eyeL', 'eyeR'])
    for (const eye of eyes) {
      expect(eye).toHaveAttribute('data-amb')
      expect(eye.querySelectorAll('circle')).toHaveLength(2)
    }

    expect(off.querySelectorAll('[style*="chblink"]')).toHaveLength(0)
  })

  it('blinks the circles inside each gaze-controlled eye group', () => {
    const { container } = render(<DeskCharacter persona={facundo} />)

    for (const eye of ['eyeL', 'eyeR']) {
      const group = container.querySelector(`[data-fl="${eye}"]`)
      expect((group as SVGGElement).style.animation).toContain('chblink')
      expect(group?.querySelectorAll('circle')).toHaveLength(2)
    }
  })

  it('crops tighter and stops docking in the desk variant', () => {
    const { container } = render(<DeskCharacter persona={facundo} variant="desk" dock={false} />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('viewBox', '36 44 858 476')
    expect((container.querySelector('.dc-scene') as HTMLElement).style.minHeight).toBe('')
  })

  it('scales the laptop while keeping its prioritized screen frontal', () => {
    const { container } = render(<DeskCharacter persona={facundo} variant="desk" dock={false} />)
    const html = container.innerHTML

    expect(html).toContain('scale(1.12)')
    expect(html).not.toContain('skewX(')
  })

  it('keeps the scroll fade off the element carrying the laptop scale', () => {
    const { container } = render(<DeskCharacter persona={facundo} variant="desk" dock={false} />)
    const faded = container.querySelector('[style*="container-type"]') as HTMLElement
    expect(faded.style.transform).toBe('')
    expect(faded.querySelector('[style*="scale(1.12)"]')).not.toBeNull()
  })

  it('leaves the laptop untransformed in the full scene', () => {
    const { container } = render(<DeskCharacter persona={facundo} />)
    expect(container.innerHTML).toContain('scale(1)')
    expect(container.innerHTML).not.toContain('skewX(')
  })

  it('renders children below the scene', () => {
    render(
      <DeskCharacter persona={facundo}>
        <p>page content</p>
      </DeskCharacter>,
    )
    expect(screen.getByText('page content')).toBeInTheDocument()
  })
})
