import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CharacterPortrait } from '../src/character/CharacterPortrait'
import { PORTRAIT_CROPS } from '../src/character/portraitCrops'
import { PortfolioCharacter } from '../src/PortfolioCharacter'
import { facundo } from '../personas'

describe('<CharacterPortrait />', () => {
  it('draws the character without the room, the laptop or the dock', () => {
    const { container } = render(<CharacterPortrait />)

    expect(container.querySelectorAll('svg')).toHaveLength(1)
    expect(container.querySelector('[data-fl="face"]')).not.toBeNull()
    expect(container.querySelector('[style*="position:fixed"]')).toBeNull()
    expect(container.textContent).toBe('')
  })

  it('crops to the bust by default and honours the other crops', () => {
    const { container: bust } = render(<CharacterPortrait />)
    const { container: full } = render(<CharacterPortrait crop="full" />)

    expect(bust.querySelector('svg')).toHaveAttribute('viewBox', PORTRAIT_CROPS.bust.viewBox)
    expect(full.querySelector('svg')).toHaveAttribute('viewBox', PORTRAIT_CROPS.full.viewBox)
  })

  it('takes part props directly', () => {
    const { container } = render(<CharacterPortrait hair="afro" glasses="cateye" />)
    const named = [...container.querySelectorAll('[data-part]')].map((el) =>
      el.getAttribute('data-part'),
    )

    expect(named).toContain('afroOverFill')
    expect(container.querySelectorAll('[data-fl="glasses"] [data-part]').length).toBeGreaterThan(0)
  })

  it('stays hidden from assistive tech', () => {
    const { container } = render(<CharacterPortrait />)
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
  })
})

describe('<PortfolioCharacter /> appearance props', () => {
  it('renders a recognisable character with no props at all', () => {
    const { container } = render(<PortfolioCharacter />)
    expect(container.querySelectorAll('[data-part]').length).toBeGreaterThan(30)
  })

  it('lets a part prop override the persona', () => {
    const { container } = render(<PortfolioCharacter persona={facundo} hair="bun" />)
    const named = [...container.querySelectorAll('[data-fl="hairFront"] [data-part]')].map((el) =>
      el.getAttribute('data-part'),
    )

    expect(named[0]).toBe('bunOverFill')
  })

  it('keeps the persona look when no part prop is given', () => {
    const { container } = render(<PortfolioCharacter persona={facundo} />)
    const named = [...container.querySelectorAll('[data-fl="hairFront"] [data-part]')].map((el) =>
      el.getAttribute('data-part'),
    )

    expect(named[0]).toBe('wavyOverFill')
  })

  it('still exports the old component name', async () => {
    const { DeskCharacter } = await import('../src/index')
    expect(DeskCharacter).toBe(PortfolioCharacter)
  })
})
