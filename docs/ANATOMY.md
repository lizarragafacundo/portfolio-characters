# Anatomy

Everything the character and its room are drawn from lives in `src/parts/registry/`, split one
file per body of artwork. This document is the map: where things sit, what order they are
painted in, and how to add a new part.

## Two coordinate spaces

The drawing never shares a transform between the two — the character is a separately
positioned overlay on top of the room, so a coordinate only ever means one thing.

### Character — `viewBox="0 0 440 620"`

| Landmark       | Coordinates                                       |
| -------------- | ------------------------------------------------- |
| Skull outline  | x 110–330, y 110–366                              |
| Ears           | bulge to x 94 (left) and x 346 (right), y 218–262 |
| Brow band      | y 153–175                                         |
| **Eye line**   | **cx 175 (left) / 265 (right), cy 212**           |
| Nose           | y 196–250, centred x 228–244                      |
| Mouth          | y 280–324                                         |
| Chin           | y 366                                             |
| Neck           | x 186–254, y 316–439                              |
| Shirt          | y 424–660, clipped by `chTee`                     |
| Hair (tallest) | y 36 (`bun`), y 38 (`wavy`)                       |
| Hair (longest) | y 478 (`long`)                                    |

The eye line is the single most load-bearing number: `eyeStyles[*].centreY` is 212 for every
style except `happy` (210), and the pupils, glasses lenses, brows and gaze anchors are all
positioned against it.

### Room — `viewBox="0 0 900 600"`

| Landmark      | Coordinates          |
| ------------- | -------------------- |
| Window        | x 63–249, y 91–277   |
| Wall art      | x 266–346, y 144–238 |
| Bookcase      | x 612–860, y 94–226  |
| Laptop screen | x 605–837, y 297–460 |
| Laptop base   | y 452–482            |
| Desk edge     | y 480–496, x 40–862  |
| Floor hatch   | y 215–430            |

`deskObjects` are authored in this space. Objects that sit on the desk surface land around
y 440–482; `cat` sits on top of the bookcase at y 56–94 and `polaroids` hang on the wall at
y 144–208.

## Paint order

`CHARACTER_LAYERS` in `src/character/characterLayers.ts` is the contract. Each entry becomes one
`<g data-fl="…">`, painted in order, and **every group is rendered even when it is empty** — the
dock transition and the appearance replay stagger by group index, so a character with no beard
must still produce a beard group or the timing would shift with the haircut.

| #   | Layer          | Source                                                      |
| --- | -------------- | ----------------------------------------------------------- |
| 1   | `hairBack`     | `hairStyles[id].behindHead`                                 |
| 2   | `neck`         | `faceBase.neck`                                             |
| 3   | `shirtFill`    | component JSX (the torso is not a swappable part)           |
| 4   | `shirtOutline` | component JSX                                               |
| 5   | `face`         | `faceBase.head`, minus the primitives tagged below          |
| 6   | `beard`        | `beardStyles[id]`                                           |
| 7   | `ears`         | `faceBase.head` primitives tagged `layer: 'ears'`           |
| 8   | `nose`         | `faceBase.head` primitives tagged `layer: 'nose'`           |
| 9   | `mouth`        | `mouthStyles[id]`, plus the `mouthOpen` expression overlay  |
| 10  | `eyeDecor`     | `glassesStyles[id].lens` then `eyeStyles[id].decor`         |
| 11  | `eyeLeft`      | pupil generated from the eye style                          |
| 12  | `eyeRight`     | pupil generated from the eye style                          |
| 13  | `glasses`      | `glassesStyles[id].frame`                                   |
| 14  | `brows`        | `faceBase.brows`, plus the `browsRaised` expression overlay |
| 15  | `hairFront`    | `hairStyles[id].overHead`                                   |

Eye decor is painted _below_ the pupils and _outside_ the eye groups on purpose: the eye groups
carry the blink animation, and lashes or an eyelid crease must not squash with the pupil.

## The `Primitive` contract

Defined in `src/parts/partTypes.ts`. Full field reference is in `docs/PARTS.md`. The two fields
that decide how a primitive behaves:

- **`strokeWidth` present, `dashArray` absent** — the primitive draws itself on, stroke-first,
  via `stroke-dashoffset`. It is marked `pathLength={1}` in the DOM.
- **anything else** — the primitive fades in. It is marked `data-fillel` in the DOM.

`drawDelay` and `drawDuration` are seconds, authored against a 0.9 s room and a 1.35 s character.
Both are multiplied by a speed scale when `sceneRenderTime` / `characterRenderTime` differ, so
never hardcode a delay in a component.

Every primitive also carries a `name`, emitted as `data-part`. Inspecting any stroke in DevTools
tells you what it is:

```html
<path data-part="skullOutline" pathLength="1" …>
  <path data-part="earInnerLeft" pathLength="1" …>
    <path data-part="cropOverFill" data-fillel …></path></path
></path>
```

## Adding a part

Adding artwork is a data change. No component learns about a specific part id.

1. Author the path in the right coordinate space, against the landmarks above.
2. Add the entry to the matching `src/parts/registry/*.ts` file, with a `name` that says what the
   stroke is.
3. Add the id to the union in `src/parts/partTypes.ts`.

The builder's cyclers iterate `Object.keys(PART_REGISTRY[category])`, so a new hairstyle appears
in the UI with no further work, and `tests/partRegistry.test.ts` will hold it to the same
invariants as everything else.

## Provenance

`src/parts/registry/*.ts` is generated. The input is `scripts/source/designParts.ts` — the
registry as authored in the Claude Design project — and the transform is
`scripts/importPartsFromDesign.ts`, which expands the terse authoring keys (`d`, `f`, `s`, `w`,
`fo`, `o`, `t`, `dash`, `dl`, `du`) into the named fields, assigns each primitive a name, and
tags the ear and nose primitives with their layer.

```sh
pnpm import:parts
```

Re-running it overwrites the ten registry files. Hand-edits to those files survive only until the
next run, so put lasting changes in the source or in the transform's name tables.
