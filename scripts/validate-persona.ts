import { readFile } from 'node:fs/promises'
import * as shipped from '../personas/index'
import { checkScript, timelineDuration } from '../src/terminal/timeline'
import type { Persona } from '../src/types'

const REQUIRED: (keyof Persona)[] = ['name', 'role', 'location', 'script']

const validate = (label: string, persona: Persona): boolean => {
  const problems: string[] = []

  for (const field of REQUIRED) {
    if (!persona[field]) problems.push(`missing "${field}"`)
  }
  if (!Array.isArray(persona.script)) {
    problems.push('"script" must be an array')
  } else {
    for (const issue of checkScript(persona.script)) {
      problems.push(`frame ${issue.frame}: ${issue.message}`)
    }
  }

  if (problems.length > 0) {
    console.error(`✗ ${label}`)
    for (const p of problems) console.error(`    ${p}`)
    return false
  }

  const seconds = (timelineDuration(persona.script) / 1000).toFixed(1)
  console.warn(`✓ ${label} — ${persona.script.length} commands, ${seconds}s loop`)
  return true
}

async function main() {
  const [path] = process.argv.slice(2)

  const entries: [string, Persona][] = path
    ? [[path, JSON.parse(await readFile(path, 'utf8')) as Persona]]
    : (Object.entries(shipped) as [string, Persona][])

  const ok = entries.map(([label, persona]) => validate(label, persona)).every(Boolean)

  if (!ok) {
    console.error('\nA persona is invalid. See PERSONA.md for the rules.')
    process.exit(1)
  }
}

main().catch((error: unknown) => {
  console.error(error)
  process.exit(1)
})
