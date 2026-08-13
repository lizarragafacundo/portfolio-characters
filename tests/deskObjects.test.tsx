import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PortfolioCharacter } from '../src/PortfolioCharacter'
import {
  DEFAULT_SCENE_OBJECTS,
  DESK_OBJECT_SCENE,
  deskObjectsIn,
  resolveSceneObjects,
} from '../src/scene/deskObjectPlacement'
import { facundo } from '../personas'

const objectsIn = (container: HTMLElement, scene: 'back' | 'front') =>
  [...container.querySelectorAll(`[data-desk-objects="${scene}"] [data-object]`)].map((el) =>
    el.getAttribute('data-object'),
  )

describe('scene objects', () => {
  it('shows the room fixtures and hides the optional objects by default', () => {
    expect(DEFAULT_SCENE_OBJECTS.window).toBe(true)
    expect(DEFAULT_SCENE_OBJECTS.plant).toBe(true)
    expect(DEFAULT_SCENE_OBJECTS.laptop).toBe(true)
    expect(DEFAULT_SCENE_OBJECTS.cat).toBe(false)
    expect(DEFAULT_SCENE_OBJECTS.keyboard).toBe(false)
  })

  it('merges the prop over the defaults rather than replacing them', () => {
    const resolved = resolveSceneObjects({ cat: true, plant: false })
    expect(resolved.cat).toBe(true)
    expect(resolved.plant).toBe(false)
    expect(resolved.window).toBe(true)
  })

  it('places wall and shelf objects behind, desk objects in front', () => {
    expect(DESK_OBJECT_SCENE.cat).toBe('back')
    expect(DESK_OBJECT_SCENE.polaroids).toBe('back')
    expect(DESK_OBJECT_SCENE.keyboard).toBe('front')
    expect(deskObjectsIn('front', resolveSceneObjects({ keyboard: true, cat: true }))).toEqual([
      'keyboard',
    ])
  })

  it('draws nothing extra when no optional object is asked for', () => {
    const { container } = render(<PortfolioCharacter persona={facundo} />)
    expect(container.querySelectorAll('[data-desk-objects]')).toHaveLength(0)
  })

  it('draws the objects it is asked for, in the right scene', () => {
    const { container } = render(
      <PortfolioCharacter persona={facundo} objects={{ cat: true, books: true }} />,
    )
    expect(objectsIn(container, 'back')).toEqual(['cat'])
    expect(objectsIn(container, 'front')).toEqual(['books'])
  })

  it('removes a fixture when it is switched off', () => {
    const { container: withPlant } = render(<PortfolioCharacter persona={facundo} />)
    const { container: without } = render(
      <PortfolioCharacter persona={facundo} objects={{ plant: false }} />,
    )
    const sway = (root: HTMLElement) => root.querySelectorAll('[style*="chsway"]').length

    expect(sway(withPlant)).toBeGreaterThan(0)
    expect(sway(without)).toBe(0)
  })

  it('keeps the window and the wall art independent', () => {
    const { container } = render(
      <PortfolioCharacter persona={facundo} objects={{ window: false }} />,
    )
    expect(container.innerHTML).not.toContain('M157,93')
    expect(container.innerHTML).toContain('M266,158')
  })

  it('never marks an object as a character flip layer', () => {
    const { container } = render(
      <PortfolioCharacter persona={facundo} objects={{ cat: true, keyboard: true }} />,
    )
    expect(container.querySelectorAll('[data-object] [data-fl]')).toHaveLength(0)
    expect(container.querySelectorAll('[data-fl] [data-object]')).toHaveLength(0)
  })
})
