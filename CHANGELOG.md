# Changelog

While the package is `0.x`, a minor bump may contain breaking changes.

## 0.1.0

First release. Succeeds the unpublished `@lizdevs/desk-character`; see
`docs/MIGRATION.md` to move over and `docs/FORK.md` for the provenance.

### The character is now built from parts

- 12 skin tones, 13 hairstyles, 11 hair colours, 12 eye styles, 6 mouths,
  5 beards, 6 glasses and 14 presets, as 159 named primitives split by anatomy
  across `src/parts/registry/`.
- `Persona.glasses` and `Persona.hair` are replaced by `Persona.appearance`, and
  part props sit at the top level of `PortfolioCharacterProps` so changing the
  glasses is one line.
- Every primitive carries a `name`, emitted as `data-part`, so the drawing can be
  read in DevTools.
- Adding artwork is a data change: new parts appear in the builder with no code
  change.

### New

- `<CharacterPortrait />` — the character alone, no room or docking, in three crops.
- `<CharacterBuilder />` on the `./builder` subpath, with `./builder.css`.
- `objects` — room fixtures and desk objects as one merged map.
- `renderMotion` — the character redraws itself when a part changes, in one of six
  motions.
- `randomAppearance`, `nearestPresetTo`, `resolveAppearance`, `PART_REGISTRY` and
  `CHARACTER_LAYERS` are public.
- `persona` is optional and falls back to `DEFAULT_PERSONA`.

### Changed

- `DeskCharacter` → `PortfolioCharacter`. The old name remains as a deprecated
  alias.
- `CHARACTER_LAYERS` grows to 15 and renames most of them; every layer now renders
  even when empty, so the dock stagger no longer changes with the haircut.
- `sceneRenderTime` and `characterRenderTime` scale the entrance at build time
  rather than by rewriting running animations, which makes them SSR-correct.
- Gaze anchors come from the chosen eye style instead of module constants.
- `persona.schema.json` gains `appearance` and drops `glasses` / `hair`.

### Fixed

- The redraw's stroke-cleanup timer is tied to effect cleanup, so unmounting
  mid-replay no longer leaks it.
- The dock transition and the redraw can no longer inherit each other's
  half-finished transforms.
