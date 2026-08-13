# @facundolizarraga/portfolio-characters

**A hand-drawn character who sits at a desk, types your stack into a laptop, and follows you down the page.**

```
   ╔══════════════════════════════════════════════════════╗
   ║   ___          _       ___ _                     _   ║
   ║  |   \ ___ ___| |__   / __| |_  __ _ _ _ __ _ __| |_ ║
   ║  | |) / -_|_-< / /  | (__| ' \/ _` | '_/ _` / _|  _| ║
   ║  |___/\___/__/_\_\   \___|_||_\__,_|_| \__,_\__|\__| ║
   ║                                                      ║
   ║   $ ls stack/backend                                 ║
   ║   node.js       express                              ║
   ║   fastapi       mongodb                              ║
   ║   qdrant        stripe                    ▋          ║
   ╚══════════════════════════════════════════════════════╝
```

It draws itself in, runs a scripted terminal on its laptop, follows the reader's
cursor, and docks to the corner of the page as you scroll.

Every part is swappable: **12 skin tones × 13 hairstyles × 11 hair colours ×
12 eye styles × 6 mouths × 5 beards × 6 glasses**, on top of 14 presets, plus a
room you can furnish.

- **Builder** — mount `<CharacterBuilder />`, or use the hosted one at `/packages/character`
- **Anatomy and coordinates** — [`docs/ANATOMY.md`](docs/ANATOMY.md)
- **Part and token reference** — [`docs/PARTS.md`](docs/PARTS.md)

## Install

```sh
npm i @facundolizarraga/portfolio-characters
```

React 18 or 19, as a peer dependency. ESM only.

## Use

```tsx
import { PortfolioCharacter } from '@facundolizarraga/portfolio-characters'
import '@facundolizarraga/portfolio-characters/styles.css'

export default function Hero() {
  return <PortfolioCharacter preset="preset-03" glasses="round" />
}
```

The stylesheet carries the keyframes. Import it once, at the root.

Give the character something to say with a persona:

```tsx
import { facundo } from '@facundolizarraga/portfolio-characters/personas'

;<PortfolioCharacter persona={facundo} variant="desk" dock gazeSelector="main section[id]" />
```

A persona is who the character is and what it types. Its looks live in
`persona.appearance`, and any part prop overrides it:

```tsx
<PortfolioCharacter persona={facundo} hair="afro" beard="full" />
```

## Props

### Appearance

`preset`, then `skinTone`, `hair`, `hairColor`, `eyes`, `mouth`, `beard`,
`glasses`. Each names an id from the registry; [`docs/PARTS.md`](docs/PARTS.md) has
the full catalogue.

Precedence runs lowest to highest: the default preset → `persona.appearance.preset`
→ the `preset` prop → the rest of `persona.appearance` → the flat props. An id the
registry does not know falls back to the preset's value rather than throwing,
because ids arrive from builders and content systems as plain strings.

### The room

| Prop       | Default                 |                                              |
| ---------- | ----------------------- | -------------------------------------------- |
| `objects`  | fixtures on, extras off | `{{ cat: true, books: true, plant: false }}` |
| `variant`  | `'scene'`               | `'scene'` \| `'desk'` \| `'deskStrip'`       |
| `terminal` | `true`                  | the looping terminal on the laptop           |
| `ambient`  | `true`                  | idle loops: clouds, steam, the swaying plant |

Fixtures (`window`, `bookcase`, `hatch`, `plant`, `coffee`, `laptop`) default on;
the six desk objects (`headphones`, `gamepad`, `cat`, `books`, `keyboard`,
`polaroids`) default off. `objects` merges over those defaults.

### Motion

| Prop                  | Default         |                                                    |
| --------------------- | --------------- | -------------------------------------------------- |
| `dock`                | `true`          | fly to the corner past the hero                    |
| `dockAt` / `undockAt` | `0.92` / `0.55` | scroll thresholds, with hysteresis                 |
| `dockMotion`          | `'Cascada'`     | how it flies there                                 |
| `renderMotion`        | `'sketch'`      | how it redraws when a part changes                 |
| `blink`               | `true`          |                                                    |
| `gazeSelector`        | —               | a selector whose sections the character glances at |
| `sceneRenderTime`     | `0.9`           | seconds for the room to draw in                    |
| `characterRenderTime` | `1.35`          | seconds for the character, after the room          |

Everything honours `prefers-reduced-motion`: the entrance snaps to its finished
state and nothing loops.

### Theme

Six colour roles — `ink`, `fill`, `shade`, `tint`, `screen`, `bg` — written as CSS
custom properties, so one drawing re-skins to any palette.

```tsx
<PortfolioCharacter theme="matrix" />
<PortfolioCharacter theme={{ ink: 'var(--brand)', fill: '#fff', /* … */ }} />
```

Built-ins: `light`, `matrix`, `cmd`, `ink`.

## `<CharacterPortrait />`

The character on its own — no room, no laptop, no scroll docking. This is what a
card or an avatar slot wants.

```tsx
import { CharacterPortrait } from '@facundolizarraga/portfolio-characters'

;<CharacterPortrait crop="bust" hair="curly" glasses="cateye" />
```

Crops: `full`, `bust`, `head`.

## `<CharacterBuilder />`

The builder is part of the library, not just a demo.

```tsx
import { CharacterBuilder } from '@facundolizarraga/portfolio-characters/builder'
import '@facundolizarraga/portfolio-characters/builder.css'

;<CharacterBuilder />
```

Controlled, if you want to share the character with the rest of the page:

```tsx
const [state, setState] = useState(initialBuilderState())

<CharacterBuilder value={state} onChange={setState} />
```

Its stylesheet chains onto the library's own theme variables
(`--pcb-ink: var(--dc-ink, …)`), so it picks up a host palette with no overrides.
Pass `classNames` to fold in your own design system, or `chrome="none"` to drop the
shipped styles entirely.

## Randomising

```tsx
import { randomAppearance } from '@facundolizarraga/portfolio-characters'

;<PortfolioCharacter {...randomAppearance()} />
```

`randomAppearance` takes a random source, so it seeds deterministically. Call it in
an event handler rather than during render, or the server and the client will
disagree.

## Writing a persona

`PERSONA.md` and `persona.schema.json` are the contract — hand them to an LLM with
your CV and it has enough to write a valid persona. `pnpm validate:persona` checks
one against the schema and the terminal's line budgets.

## Extending

Adding artwork is a data change: add the entry to the right file in
`src/parts/registry/`, add its id to the union in `src/parts/partTypes.ts`, and it
appears in the builder automatically. [`docs/ANATOMY.md`](docs/ANATOMY.md) has the
coordinate map and the layer stack; `tests/partRegistry.test.ts` holds new parts to
the same invariants as everything else.

## Reading the drawing

Every path carries the name of what it is:

```text
<path data-part="skullOutline" pathLength="1" ...>
<path data-part="earInnerLeft"  pathLength="1" ...>
```

and every layer group carries its place in the paint order as `data-fl`. The full
order is exported as `CHARACTER_LAYERS`.

## Server rendering

The whole scene renders on the server. The component is marked `'use client'`
because it uses effects for scroll and pointer, but its first paint is real
markup — no layout shift, and no `position: fixed` before hydration. Personas are a
separate, server-safe entry point.

## Versioning

SemVer, but the package is `0.x` — **a minor bump may break**, particularly the
builder API. Pin exactly if that matters to you.

Releases are automated with Changesets and publish with npm provenance; see
[`docs/PUBLISHING.md`](docs/PUBLISHING.md).

## Migrating

From `@lizdevs/desk-character`, see [`docs/MIGRATION.md`](docs/MIGRATION.md).

## Licence

MIT © Facundo Lizarraga
