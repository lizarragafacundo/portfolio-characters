# Fork provenance

`@facundolizarraga/portfolio-characters` began as a fork of the unpublished package
`@lizdevs/desk-character`.

|                                  |                                                                                                                |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Base commit                      | `a9ddffab5db71d06427f5d062352aff3e021c90a` — _"Fix the blink, enlarge and turn the laptop, drop all comments"_ |
| Forked from                      | the **working tree**, not the commit                                                                           |
| Uncommitted changes carried over | `docs/fork-working-tree.patch`                                                                                 |

## Why the working tree and not `HEAD`

At the moment of the fork the source repository had seven modified files that were never
committed:

```
src/character/Character.tsx
src/geometry.ts
src/scene/FrontScene.tsx
src/styles.css
src/terminal/Terminal.tsx
tests/render.test.tsx
examples/next-app/pnpm-lock.yaml
```

Those changes are what the portfolio actually rendered, so `HEAD` would have been the wrong
baseline. `docs/fork-working-tree.patch` is the exact diff, kept so the provenance stays
recoverable.

## Verified before any change was made

The untouched fork was installed, type-checked, linted, tested and built:

```
tsc --noEmit          pass
eslint .              pass
vitest run            60 passed (6 files)
tsup                  dist/index.js 68.52 KB, dist/personas/index.js 2.04 KB
```

The `README.md` inherited from the source claims 41 tests; the real count is 60.

## Visual baseline

`scripts/captureReferenceMarkup.tsx` renders the pre-port character to self-contained,
openable HTML in `docs/reference/`. Both files are committed and are the reference for the
registry-driven rewrite of `Character.tsx`.

|                               | `scene` | `desk` |
| ----------------------------- | ------- | ------ |
| `<path>` elements             | 96      | 96     |
| `[data-fl]` layer groups      | 14      | 14     |
| `[pathLength]` drawn strokes  | 64      | 64     |
| `[data-fillel]` filled shapes | 22      | 22     |

Re-run it at any time to diff the current output against the committed baseline:

```sh
pnpm capture:reference
git diff --stat docs/reference
```

## What changed relative to the source package

See `docs/MIGRATION.md` for the consumer-facing API differences and `CHANGELOG.md` for the
release history.
