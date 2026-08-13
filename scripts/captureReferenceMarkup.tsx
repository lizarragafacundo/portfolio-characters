import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { renderToStaticMarkup } from 'react-dom/server'
import { DeskCharacter } from '../src/index'
import type { VariantName } from '../src/geometry'
import type { Theme } from '../src/types'
import { facundo } from '../personas/index'

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const referenceDir = join(packageRoot, 'docs', 'reference')

const inkOnPaper: Theme = {
  ink: '#244d73',
  fill: '#f3f1e9',
  shade: '#d4d0c4',
  tint: '#e2dfd4',
  screen: '#244d73',
  bg: 'transparent',
}

const pageFor = (variant: VariantName, keyframes: string) => `<!doctype html>
<meta charset="utf-8">
<title>reference · ${variant}</title>
<style>
${keyframes}
body { margin: 0; background: #e9e7df; font-family: ui-monospace, monospace; }
main { max-width: 900px; margin: 0 auto; padding: 32px 16px; }
h1 { font-size: 13px; letter-spacing: .18em; color: #244d73; text-transform: uppercase; }
</style>
<main>
<h1>${variant} · facundo</h1>
${renderToStaticMarkup(
  <DeskCharacter persona={facundo} theme={inkOnPaper} variant={variant} dock={false} />,
)}
</main>
`

const capture = () => {
  const keyframes = readFileSync(join(packageRoot, 'src', 'styles.css'), 'utf8')
  mkdirSync(referenceDir, { recursive: true })

  const variants: VariantName[] = ['scene', 'desk']
  variants.forEach((variant) => {
    const target = join(referenceDir, `${variant}.html`)
    writeFileSync(target, pageFor(variant, keyframes), 'utf8')
    process.stdout.write(`${target}\n`)
  })
}

capture()
