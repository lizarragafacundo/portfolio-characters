# Parts

The part registry is pure data. It knows nothing about React, and no component knows about any
individual part id. `docs/ANATOMY.md` covers where things sit and in what order they are painted;
this document is the field reference.

## Catalogue

| Category        | Count | Ids                                                                                                 |
| --------------- | ----- | --------------------------------------------------------------------------------------------------- |
| `skinTones`     | 11    | `paper` `celeste` `ivory` `sand` `golden` `olive` `amber` `bronze` `chestnut` `cocoa` `espresso`    |
| `hairColors`    | 11    | `paper` `celeste` `black` `espresso` `brown` `chestnut` `auburn` `blonde` `gray` `white` `violet`   |
| `hairStyles`    | 13    | `wavy` `fringe` `afro` `curly` `long` `bun` `buzz` `bald` `pixie` `sidepart` `cap` `beanie` `crop`  |
| `eyeStyles`     | 12    | `round` `almond` `wide` `sleepy` `happy` `narrow` `big` `lashes` `monolid` `brown` `spark` `ringed` |
| `mouthStyles`   | 6     | `smile` `grin` `neutral` `soft` `smirk` `pout`                                                      |
| `beardStyles`   | 5     | `none` `stubble` `goatee` `full` `mustache`                                                         |
| `glassesStyles` | 6     | `none` `square` `round` `halfrim` `sun` `cateye`                                                    |
| `deskObjects`   | 6     | `headphones` `gamepad` `cat` `books` `keyboard` `polaroids`                                         |
| `presets`       | 14    | `preset-01` … `preset-10`, `facu-01` … `facu-04`                                                    |

159 primitives in total.

`ringed` is authored in this package rather than in the design project: it is the open eye the
portfolio character has always had, an outlined iris with a pupil inside it. An eye style draws
an open eye whenever it carries a `ringRadius`; otherwise the pupil is a solid dot.

## `Primitive`

| Field          | Type                   | Meaning                                                                  |
| -------------- | ---------------------- | ------------------------------------------------------------------------ |
| `name`         | `string`               | Identifies the stroke in the DOM as `data-part`. Unique within its part. |
| `path`         | `string`               | The SVG `d` attribute.                                                   |
| `fill`         | `ColorToken \| string` | Defaults to `none`.                                                      |
| `stroke`       | `ColorToken \| string` | Defaults to `ink` when `strokeWidth` is set.                             |
| `strokeWidth`  | `number`               | Presence marks the primitive as drawn stroke-first.                      |
| `fillOpacity`  | `number`               |                                                                          |
| `opacity`      | `number`               |                                                                          |
| `transform`    | `string`               | Per-primitive nudge, e.g. `translate(-75 -7)`.                           |
| `dashArray`    | `string`               | Decorative dashes. Opts the primitive out of the draw-on entrance.       |
| `drawDelay`    | `number`               | Entrance delay in seconds, before speed scaling.                         |
| `drawDuration` | `number`               | Entrance duration in seconds, before speed scaling.                      |
| `layer`        | `CharacterLayerName`   | Overrides which `[data-fl]` group paints the primitive.                  |

## Colour tokens

A `fill` or `stroke` is either one of these tokens or a literal CSS colour that passes straight
through.

| Token       | Resolves to                                               |
| ----------- | --------------------------------------------------------- |
| `skinLight` | `skinTones[chosen].light`                                 |
| `skinShade` | `skinTones[chosen].shade`                                 |
| `hair`      | `hairColors[chosen]`                                      |
| `ink`       | `var(--dc-ink)` — every outline                           |
| `fill`      | `var(--dc-fill)` — flat fills, eye whites, glasses lenses |
| `tint`      | `var(--dc-tint)` — floor hatch, leaves, clouds            |
| `shade`     | `var(--dc-shade)` — shadowed planes                       |

`ink` / `fill` / `tint` / `shade` come from the theme, so one drawing re-skins to any palette.
`skinLight` / `skinShade` / `hair` come from the appearance, so they change per character.

Desk objects are built against a neutral palette in which `skinLight` and `skinShade` resolve to
theme values rather than skin values — a bookshelf should not change colour with the character's
complexion.

Two primitives in `eyeStyles.brown` deliberately use literal hex (`#8B5E3C` iris, `#FFFFFF`
glint): they are the iris colour that gives the style its name, not a themeable role.

## Appearance resolution

An `Appearance` is a preset plus any overrides. Precedence, lowest to highest:

1. the default preset
2. `persona.appearance.preset`
3. the `preset` prop
4. the non-preset keys of `persona.appearance`
5. the flat part props (`skinTone`, `hair`, `hairColor`, `eyes`, `mouth`, `beard`, `glasses`)

An unknown id falls back to the preset's value rather than throwing, because ids arrive from
builders and CMSs as plain strings. See `docs/APPEARANCE.md`.

## Invariants

`tests/partRegistry.test.ts` enforces these on every primitive, so new artwork cannot quietly
break the renderer:

- every `path` is non-empty and starts with a move command
- every `name` is camelCase and unique within its part
- every colour is a known token, a hex, or a CSS custom property
- no primitive both sets `strokeWidth` and `dashArray`
- character coordinates stay in the 440×620 space, desk objects in 900×600
- every id referenced by every preset resolves
- every eye style sits on the eye line
