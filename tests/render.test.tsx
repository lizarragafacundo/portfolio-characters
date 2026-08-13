import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PortfolioCharacter } from '../src/PortfolioCharacter'
import { CHARACTER_LAYERS } from '../src/character/characterLayers'
import { exampleDesigner, facundo } from '../personas'

const withoutGlasses = {
  ...facundo,
  appearance: { ...facundo.appearance, glasses: 'none' as const },
}

describe('<PortfolioCharacter />', () => {
  it('renders without a browser, so it is safe to server-render', () => {
    expect(() => render(<PortfolioCharacter persona={facundo} />)).not.toThrow()
  })

  it('hides the whole scene from assistive tech', () => {
    const { container } = render(<PortfolioCharacter persona={facundo} />)
    expect(container.querySelector('.dc-scene')).toHaveAttribute('aria-hidden', 'true')
  })

  it('marks every flip layer the dock transition needs to move', () => {
    const { container } = render(<PortfolioCharacter persona={facundo} />)
    const layers = [...container.querySelectorAll('[data-fl]')].map((el) =>
      el.getAttribute('data-fl'),
    )
    expect(layers).toEqual([...CHARACTER_LAYERS])
  })

  it('pins the flip layer order, so reordering has to be deliberate', () => {
    expect([...CHARACTER_LAYERS]).toEqual([
      'hairBack',
      'neck',
      'shirtFill',
      'shirtOutline',
      'face',
      'beard',
      'ears',
      'nose',
      'mouth',
      'eyeDecor',
      'eyeLeft',
      'eyeRight',
      'glasses',
      'brows',
      'hairFront',
    ])
  })

  it('renders every layer even when the character has no such part', () => {
    const { container } = render(<PortfolioCharacter persona={withoutGlasses} />)
    const beard = container.querySelector('[data-fl="beard"]')
    const glasses = container.querySelector('[data-fl="glasses"]')

    expect(beard).not.toBeNull()
    expect(beard?.children).toHaveLength(0)
    expect(glasses).not.toBeNull()
    expect(glasses?.children).toHaveLength(0)
  })

  it('names every stroke so the drawing can be read in the DOM', () => {
    const { container } = render(<PortfolioCharacter persona={facundo} />)
    const named = [...container.querySelectorAll('[data-part]')].map((el) =>
      el.getAttribute('data-part'),
    )
    expect(named).toContain('skullOutline')
    expect(named).toContain('noseBridge')
    expect(named).toContain('pupilLeft')
  })

  it('marks the drawn and filled elements bake() has to freeze', () => {
    const { container } = render(<PortfolioCharacter persona={facundo} />)
    expect(container.querySelectorAll('[pathLength]').length).toBeGreaterThan(50)
    expect(container.querySelectorAll('[data-fillel]').length).toBeGreaterThanOrEqual(18)
  })

  it('marks the looping decorations so they can be stripped on slow devices', () => {
    const { container } = render(<PortfolioCharacter persona={facundo} />)
    expect(container.querySelectorAll('[data-amb]').length).toBeGreaterThanOrEqual(6)
  })

  it('applies the theme as custom properties rather than baking colours in', () => {
    const { container } = render(<PortfolioCharacter persona={facundo} theme="matrix" />)
    const scene = container.querySelector('.dc-scene') as HTMLElement
    expect(scene.style.getPropertyValue('--dc-ink')).toBeTruthy()
    expect(container.innerHTML).toContain('var(--dc-ink)')
  })

  it('draws the glasses the appearance asks for, and none when it asks for none', () => {
    const { container: withGlasses } = render(<PortfolioCharacter persona={facundo} />)
    const { container: without } = render(<PortfolioCharacter persona={withoutGlasses} />)

    expect(withGlasses.querySelectorAll('[data-fl="glasses"] [data-part]').length).toBeGreaterThan(
      0,
    )
    expect(without.querySelectorAll('[data-fl="glasses"] [data-part]')).toHaveLength(0)
  })

  it('redraws the character when the appearance changes', () => {
    const { container: wavy } = render(<PortfolioCharacter persona={facundo} />)
    const afro = { ...facundo, appearance: { ...facundo.appearance, hair: 'afro' as const } }
    const { container: withAfro } = render(<PortfolioCharacter persona={afro} />)

    const namesIn = (root: HTMLElement) =>
      [...root.querySelectorAll('[data-fl="hairFront"] [data-part]')].map((el) =>
        el.getAttribute('data-part'),
      )

    expect(namesIn(wavy)[0]).toBe('wavyOverFill')
    expect(namesIn(withAfro)[0]).toBe('afroOverFill')
  })

  it('renders the persona’s own commands, not the default one’s', async () => {
    render(<PortfolioCharacter persona={exampleDesigner} />)
    expect(await screen.findByText('$ ls shipped/')).toBeInTheDocument()
    expect(screen.queryByText('$ terraform apply')).not.toBeInTheDocument()
  })

  it('blinks by default, and stops when asked', () => {
    const { container: on } = render(<PortfolioCharacter persona={facundo} />)
    const { container: off } = render(<PortfolioCharacter persona={facundo} blink={false} />)

    const eyes = [...on.querySelectorAll('[data-fl^="eye"][style*="chblink"]')]
    expect(eyes).toHaveLength(2)
    expect(eyes.map((eye) => eye.getAttribute('data-fl'))).toEqual(['eyeLeft', 'eyeRight'])
    for (const eye of eyes) {
      expect(eye).toHaveAttribute('data-amb')
      expect(eye.querySelectorAll('[data-part]')).toHaveLength(2)
    }

    expect(off.querySelectorAll('[style*="chblink"]')).toHaveLength(0)
  })

  it('blinks the iris and pupil inside each gaze-controlled eye group', () => {
    const { container } = render(<PortfolioCharacter persona={facundo} />)

    for (const eye of ['eyeLeft', 'eyeRight']) {
      const group = container.querySelector(`[data-fl="${eye}"]`)
      expect((group as SVGGElement).style.animation).toContain('chblink')
      expect(group?.querySelectorAll('[data-part]')).toHaveLength(2)
    }
  })

  it('keeps the eye decor outside the blinking groups so lids do not squash', () => {
    const { container } = render(<PortfolioCharacter persona={facundo} />)
    const decor = container.querySelector('[data-fl="eyeDecor"]')
    expect(decor).not.toHaveAttribute('data-amb')
    expect(decor?.querySelector('[data-part="upperLidShadow"]')).not.toBeNull()
  })

  it('crops tighter and stops docking in the desk variant', () => {
    const { container } = render(
      <PortfolioCharacter persona={facundo} variant="desk" dock={false} />,
    )
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('viewBox', '36 44 858 476')
    expect((container.querySelector('.dc-scene') as HTMLElement).style.minHeight).toBe('')
  })

  it('scales the laptop while keeping its prioritized screen frontal', () => {
    const { container } = render(
      <PortfolioCharacter persona={facundo} variant="desk" dock={false} />,
    )
    const html = container.innerHTML

    expect(html).toContain('scale(1.12)')
    expect(html).not.toContain('skewX(')
  })

  it('keeps the scroll fade off the element carrying the laptop scale', () => {
    const { container } = render(
      <PortfolioCharacter persona={facundo} variant="desk" dock={false} />,
    )
    const faded = container.querySelector('[style*="container-type"]') as HTMLElement
    expect(faded.style.transform).toBe('')
    expect(faded.querySelector('[style*="scale(1.12)"]')).not.toBeNull()
  })

  it('leaves the laptop untransformed in the full scene', () => {
    const { container } = render(<PortfolioCharacter persona={facundo} />)
    expect(container.innerHTML).toContain('scale(1)')
    expect(container.innerHTML).not.toContain('skewX(')
  })

  it('renders children below the scene', () => {
    render(
      <PortfolioCharacter persona={facundo}>
        <p>page content</p>
      </PortfolioCharacter>,
    )
    expect(screen.getByText('page content')).toBeInTheDocument()
  })
})
