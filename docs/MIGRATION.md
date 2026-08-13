# Migrating from `@lizdevs/desk-character`

`@facundolizarraga/portfolio-characters` is the successor to the unpublished
`@lizdevs/desk-character`. See `docs/FORK.md` for the provenance.

## Install

```diff
-"@lizdevs/desk-character": "file:../desk-character"
+"@facundolizarraga/portfolio-characters": "^0.1.0"
```

## Imports

```diff
-import { DeskCharacter } from '@lizdevs/desk-character'
-import { facundo } from '@lizdevs/desk-character/personas'
-import '@lizdevs/desk-character/styles.css'
+import { PortfolioCharacter } from '@facundolizarraga/portfolio-characters'
+import { facundo } from '@facundolizarraga/portfolio-characters/personas'
+import '@facundolizarraga/portfolio-characters/styles.css'
```

`DeskCharacter` is still exported as a deprecated alias of `PortfolioCharacter`, so
the package swap and the rename can land separately.

## `Persona.glasses` and `Persona.hair` are gone

They are replaced by `Persona.appearance`. A boolean cannot express six glasses
frames, and `hair` now names one of thirteen styles rather than a length.

| Before           | After                               |
| ---------------- | ----------------------------------- |
| `glasses: true`  | `appearance: { glasses: 'square' }` |
| `glasses: false` | `appearance: { glasses: 'none' }`   |
| `hair: 'short'`  | `appearance: { hair: 'crop' }`      |
| `hair: 'long'`   | `appearance: { hair: 'long' }`      |

The old character is reproduced exactly by:

```ts
appearance: { preset: 'facu-02', hair: 'wavy', eyes: 'ringed' }
```

which is what the packaged `facundo` persona now carries. `ringed` is the open eye
with a visible iris that the character has always had; the design project's
`round` is a solid pupil.

`persona.schema.json` sets `additionalProperties: false`, so a JSON persona
carrying the old fields is now invalid rather than silently ignored.

## Appearance can also be set per-prop

Part props sit at the top level and override the persona:

```tsx
<PortfolioCharacter persona={facundo} glasses="round" hair="afro" />
```

Precedence, lowest to highest: the default preset, `persona.appearance.preset`, the
`preset` prop, the rest of `persona.appearance`, then the flat props. An unknown id
falls back to the preset's value rather than throwing.

## Room fixtures and desk objects are one prop

New in this package; there was nothing to migrate:

```tsx
<PortfolioCharacter objects={{ cat: true, books: true, plant: false }} />
```

## `data-fl` layer names changed

Only relevant if you were styling or querying the SVG directly.

| Before            | After                        |
| ----------------- | ---------------------------- |
| `hairback`        | `hairBack`                   |
| `teefill` / `tee` | `shirtFill` / `shirtOutline` |
| `lids`            | `eyeDecor`                   |
| `eyeL` / `eyeR`   | `eyeLeft` / `eyeRight`       |
| `hair`            | `hairFront`                  |
| —                 | `beard` (new)                |

The full list is exported as `CHARACTER_LAYERS`. Every layer now renders even when
empty, so a character with no beard still produces a `beard` group — the dock
stagger indexes by position and would otherwise change with the haircut.

Every path also carries `data-part` naming what it is (`skullOutline`, `noseBridge`,
`pupilLeft`), which is usually a better hook than the layer.

## Internal renames

Only relevant if you imported past the public entry point, which was never
supported.

| Before                         | After                                                           |
| ------------------------------ | --------------------------------------------------------------- |
| `src/anim.ts` — `draw`, `fill` | `src/animation/` — `drawStroke`, `fadeIn`                       |
| `src/motions.ts`               | `src/dockMotions.ts` (dock) and `src/renderMotions.ts` (redraw) |
| `useBake`                      | `useBakeIntro`, returning `{ bakeNow, hasBakedIntro }`          |
| `useReducedMotion`             | `useMotionCapability`                                           |
