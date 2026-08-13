# Example app

Every persona, theme, and dock motion behind a dropdown. This is the manual test
rig for the parts jsdom cannot assert — layout, the FLIP, and how any of it
actually looks.

```bash
# from the repo root, so the package is built first
pnpm build

cd examples/next-app
pnpm install
pnpm dev          # http://localhost:3210
```

`pnpm install` here links the parent directory (`file:../..`), so a rebuild at
the root shows up on the next reload. `next.config.ts` sets `transpilePackages`
for the same reason — a real consumer installing from GitHub does not need it.

## What to check

Combinations, not each control on its own — the interesting failures live in the
crossings:

- **Draw-in.** Reload. The scene should draw back-to-front over ~2s, and the
  character's face should arrive before its hair.
- **Terminal.** Every frame appears, reveals its lines one at a time, holds, and
  clears. Nothing should be clipped by the laptop bezel.
- **Dock.** Scroll past the hero: the character shrinks to the bottom-right with
  the selected motion, and its expression changes. Scroll back: it returns.
  Try all six motions — `Redibujado` is the one that exercises the stroke path.
- **Hysteresis.** Scroll to roughly the dock threshold and stop. It must not
  flicker between states.
- **Pointer.** Pupils and head follow the cursor. Once docked, the character
  leans with horizontal cursor position.
- **Personas.** Switch to `exampleDesigner`: five frames instead of seven, no
  glasses, long hair, and one frame of sentences rather than tokens.
- **Reduced motion.** DevTools → Rendering → _Emulate `prefers-reduced-motion`_.
  The scene should be fully drawn on the first frame, nothing should loop, the
  terminal should sit on its last frame, and docking should be instant.
