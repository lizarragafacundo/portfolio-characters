import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { DESIGN_PARTS } from './source/designParts'

type DesignPrimitive = {
  d: string
  f?: string
  s?: string
  w?: number
  fo?: number
  o?: number
  t?: string
  dash?: string
  dl?: number
  du?: number
}

const registryDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'parts', 'registry')

const COLOR_TOKENS: Record<string, string> = {
  hi: 'skinLight',
  sh: 'skinShade',
  hair: 'hair',
  ink: 'ink',
  fill: 'fill',
  tint: 'tint',
  shade: 'shade',
}

const HEAD_NAMES = [
  'jawShadow',
  'skullOutline',
  'earLeft',
  'earRight',
  'earInnerLeft',
  'earInnerRight',
  'noseShadow',
  'noseBridge',
]

const HEAD_LAYERS: Record<string, string> = {
  earLeft: 'ears',
  earRight: 'ears',
  earInnerLeft: 'ears',
  earInnerRight: 'ears',
  noseShadow: 'nose',
  noseBridge: 'nose',
}

const NECK_NAMES = ['neckFill', 'throatShadow', 'neckOutlineLeft', 'neckOutlineRight']
const BROW_NAMES = ['browLeft', 'browRight']

const GLASSES_LENS_NAMES = ['lensFill']

const GLASSES_FRAME_NAMES: Record<string, string[]> = {
  square: ['frameOutline', 'bridge', 'temples'],
  round: ['frameOutline', 'bridge', 'temples'],
  halfrim: ['browBar', 'rimlessBase', 'bridge', 'temples'],
  sun: ['lensTint', 'frameOutline', 'lensGlint', 'bridge', 'temples'],
  cateye: ['frameOutline', 'wingTips', 'bridge', 'temples'],
}

const MOUTH_NAMES: Record<string, string[]> = {
  smile: ['lipLine', 'chinCrease'],
  grin: ['openMouth', 'teethHighlight', 'chinCrease'],
  neutral: ['lipLine', 'chinCrease'],
  soft: ['lipLine', 'lipCorners', 'chinCrease'],
  smirk: ['lipLine', 'chinCrease'],
  pout: ['lips', 'chinCrease'],
}

const BEARD_NAMES: Record<string, string[]> = {
  stubble: ['stubbleFlecks'],
  goatee: ['chinPatch', 'mustache'],
  full: ['beardShape', 'mustache', 'cheekStrands'],
  mustache: ['mustache', 'mustacheTips'],
}

const capitalise = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)

const camel = (value: string) =>
  value
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part, index) => (index === 0 ? part.toLowerCase() : capitalise(part)))
    .join('')

const roleOf = (primitive: DesignPrimitive) => {
  if (primitive.dash) return 'Guide'
  if (primitive.f && primitive.w) return 'Shape'
  if (primitive.f) return 'Fill'
  if (primitive.o !== undefined && primitive.o < 0.7) return 'Detail'
  return 'Stroke'
}

const uniqueNamer = () => {
  const seen = new Map<string, number>()
  return (candidate: string) => {
    const count = seen.get(candidate) ?? 0
    seen.set(candidate, count + 1)
    return count === 0 ? candidate : `${candidate}${count + 1}`
  }
}

const toColor = (value: string | undefined) =>
  value === undefined ? undefined : (COLOR_TOKENS[value] ?? value)

const toPrimitive = (primitive: DesignPrimitive, name: string, layer?: string) => ({
  name,
  path: primitive.d,
  fill: toColor(primitive.f),
  stroke: toColor(primitive.s),
  strokeWidth: primitive.w,
  fillOpacity: primitive.fo,
  opacity: primitive.o,
  transform: primitive.t,
  dashArray: primitive.dash,
  drawDelay: primitive.dl,
  drawDuration: primitive.du,
  layer,
})

const convertList = (
  list: readonly DesignPrimitive[],
  prefix: string,
  explicitNames?: string[],
  layerFor?: (name: string) => string | undefined,
) => {
  const nameOf = uniqueNamer()
  return list.map((primitive, index) => {
    const base = explicitNames?.[index] ?? camel(`${prefix} ${roleOf(primitive)}`)
    const name = nameOf(base)
    return toPrimitive(primitive, name, layerFor?.(name))
  })
}

const serialise = (value: unknown, indent = 0): string => {
  const pad = '  '.repeat(indent)
  const padInner = '  '.repeat(indent + 1)
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]'
    return `[\n${value.map((entry) => `${padInner}${serialise(entry, indent + 1)}`).join(',\n')},\n${pad}]`
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value).filter(([, entry]) => entry !== undefined)
    if (entries.length === 0) return '{}'
    return `{\n${entries
      .map(([key, entry]) => {
        const safeKey = /^[a-zA-Z_$][\w$]*$/.test(key) ? key : `'${key}'`
        return `${padInner}${safeKey}: ${serialise(entry, indent + 1)}`
      })
      .join(',\n')},\n${pad}}`
  }
  if (typeof value === 'string') return `'${value.replace(/'/g, "\\'")}'`
  return String(value)
}

const moduleFor = (importedTypes: string[], exportName: string, type: string, value: unknown) =>
  `import type { ${importedTypes.join(', ')} } from '../partTypes'\n\n` +
  `export const ${exportName}: ${type} = ${serialise(value)}\n`

const writeModule = (file: string, contents: string) => {
  const target = join(registryDir, file)
  writeFileSync(target, contents, 'utf8')
  process.stdout.write(`${target}\n`)
}

const importParts = () => {
  mkdirSync(registryDir, { recursive: true })

  const skinTones = Object.fromEntries(
    Object.entries(DESIGN_PARTS.skins).map(([id, tone]) => [
      id,
      { light: tone.hi, shade: tone.sh },
    ]),
  )

  const faceBase = {
    head: convertList(DESIGN_PARTS.base.head, 'head', HEAD_NAMES, (name) => HEAD_LAYERS[name]),
    neck: convertList(DESIGN_PARTS.base.neck, 'neck', NECK_NAMES),
    brows: convertList(DESIGN_PARTS.base.brows, 'brow', BROW_NAMES),
  }

  const hairStyles = Object.fromEntries(
    Object.entries(DESIGN_PARTS.hair).map(([id, style]) => [
      id,
      {
        behindHead: convertList(style.back, `${id} behind`),
        overHead: convertList(style.front, `${id} over`),
      },
    ]),
  )

  const eyeStyles = Object.fromEntries(
    Object.entries(DESIGN_PARTS.eyes).map(([id, style]) => [
      id,
      {
        centreX: [style.ex[0], style.ex[1]],
        centreY: style.ey,
        pupilRadius: style.r,
        decor: convertList(style.decor, `${id} eye`),
      },
    ]),
  )

  const mouthStyles = Object.fromEntries(
    Object.entries(DESIGN_PARTS.mouths).map(([id, list]) => [
      id,
      convertList(list, `${id} mouth`, MOUTH_NAMES[id]),
    ]),
  )

  const beardStyles = Object.fromEntries(
    Object.entries(DESIGN_PARTS.beards).map(([id, list]) => [
      id,
      convertList(list, `${id} beard`, BEARD_NAMES[id]),
    ]),
  )

  const glassesStyles = Object.fromEntries(
    Object.entries(DESIGN_PARTS.glasses).map(([id, style]) => [
      id,
      {
        lens: convertList(style.bg, `${id} lens`, GLASSES_LENS_NAMES),
        frame: convertList(style.frame, `${id} frame`, GLASSES_FRAME_NAMES[id]),
      },
    ]),
  )

  const deskObjects = Object.fromEntries(
    Object.entries(DESIGN_PARTS.objects).map(([id, list]) => [id, convertList(list, id)]),
  )

  writeModule(
    'skinTones.ts',
    moduleFor(['SkinTone', 'SkinToneId'], 'skinTones', 'Record<SkinToneId, SkinTone>', skinTones),
  )
  writeModule(
    'hairColors.ts',
    moduleFor(
      ['HairColorId'],
      'hairColors',
      'Record<HairColorId, string>',
      DESIGN_PARTS.hairColors,
    ),
  )
  writeModule('faceBase.ts', moduleFor(['FaceBase'], 'faceBase', 'FaceBase', faceBase))
  writeModule(
    'hairStyles.ts',
    moduleFor(['HairId', 'HairStyle'], 'hairStyles', 'Record<HairId, HairStyle>', hairStyles),
  )
  writeModule(
    'eyeStyles.ts',
    moduleFor(['EyeStyle', 'EyesId'], 'eyeStyles', 'Record<EyesId, EyeStyle>', eyeStyles),
  )
  writeModule(
    'mouthStyles.ts',
    moduleFor(['MouthId', 'Primitive'], 'mouthStyles', 'Record<MouthId, Primitive[]>', mouthStyles),
  )
  writeModule(
    'beardStyles.ts',
    moduleFor(['BeardId', 'Primitive'], 'beardStyles', 'Record<BeardId, Primitive[]>', beardStyles),
  )
  writeModule(
    'glassesStyles.ts',
    moduleFor(
      ['GlassesId', 'GlassesStyle'],
      'glassesStyles',
      'Record<GlassesId, GlassesStyle>',
      glassesStyles,
    ),
  )
  writeModule(
    'deskObjects.ts',
    moduleFor(
      ['DeskObjectId', 'Primitive'],
      'deskObjects',
      'Record<DeskObjectId, Primitive[]>',
      deskObjects,
    ),
  )
  writeModule(
    'presets.ts',
    moduleFor(['Preset', 'PresetId'], 'presets', 'Record<PresetId, Preset>', DESIGN_PARTS.presets),
  )
}

importParts()
