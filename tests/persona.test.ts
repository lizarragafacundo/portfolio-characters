import { describe, expect, it } from 'vitest'
import * as personas from '../personas'
import { checkScript } from '../src/terminal/timeline'
import { LINE_BUDGET, TOKEN_BUDGET, type Persona } from '../src/types'

const shipped = Object.entries(personas) as [string, Persona][]

describe('shipped personas', () => {
  it('ships more than one, so "configurable" is demonstrated and not asserted', () => {
    expect(shipped.length).toBeGreaterThan(1)
  })

  it.each(shipped)('%s fits on the laptop screen', (_name, persona) => {
    expect(checkScript(persona.script)).toEqual([])
  })

  it.each(shipped)('%s has the identity fields the docs promise', (_name, persona) => {
    expect(persona.name.trim()).not.toBe('')
    expect(persona.role.trim()).not.toBe('')
    expect(persona.location.trim()).not.toBe('')
  })
})

describe('checkScript', () => {
  it('accepts a frame at exactly the budget', () => {
    const lines = Array.from({ length: LINE_BUDGET }, (_, i) => `t${i}`)
    expect(checkScript([{ prompt: '$ ls', lines }])).toEqual([])
  })

  it('rejects one line over the budget', () => {
    const lines = Array.from({ length: LINE_BUDGET + 1 }, (_, i) => `t${i}`)
    const issues = checkScript([{ prompt: '$ ls', lines }])
    expect(issues).toHaveLength(1)
    expect(issues[0]?.message).toContain('exceeds')
  })

  it('holds list layouts to half the budget, since they do not pair up', () => {
    const lines = Array.from({ length: LINE_BUDGET / 2 + 1 }, (_, i) => `line ${i}`)
    const issues = checkScript([{ prompt: '$ ls', lines, layout: 'list' }])
    expect(issues.some((i) => i.message.includes("layout 'list'"))).toBe(true)
  })

  it('rejects a grid token too wide for its column', () => {
    const issues = checkScript([{ prompt: '$ ls', lines: ['x'.repeat(TOKEN_BUDGET + 1)] }])
    expect(issues[0]?.message).toContain('over the')
  })

  it('does not apply the column limit to list layouts, which get the full width', () => {
    const long = 'buenos aires · remote'
    expect(long.length).toBeGreaterThan(TOKEN_BUDGET)
    expect(checkScript([{ prompt: '$ whoami', lines: [long], layout: 'list' }])).toEqual([])
  })

  it('flags an empty script and an empty prompt', () => {
    expect(checkScript([])).toHaveLength(1)
    expect(checkScript([{ prompt: '   ', lines: ['a'] }])[0]?.message).toContain('prompt is empty')
  })

  it('reports the frame index so the author knows which command to fix', () => {
    const issues = checkScript([
      { prompt: '$ ok', lines: ['a'] },
      { prompt: '', lines: ['b'] },
    ])
    expect(issues[0]?.frame).toBe(1)
  })
})

describe('facundo', () => {
  const { facundo } = personas

  it('covers every discipline the portfolio claims', () => {
    const prompts = facundo.script.map((f) => f.prompt).join(' ')
    for (const discipline of ['frontend', 'backend', 'ollama', 'aws', 'terraform', 'workflow']) {
      expect(prompts).toContain(discipline)
    }
  })

  it('runs at least five commands', () => {
    expect(facundo.script.length).toBeGreaterThanOrEqual(5)
  })
})
