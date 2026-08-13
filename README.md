# desk-character

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
   ║   qdrant        stripe                    ▋           ║
   ╚══════════════════════════════════════════════════════╝
```

One React component. ~700 SVG nodes that draw themselves on in two seconds, a scripted terminal on the
laptop screen, eyes that track the cursor, and a scroll-driven transition that shrinks the character into
the corner of the window and keeps them there. Built with `react`, `typescript`, `tsup` — no animation
library, no canvas, no runtime dependencies at all.

Everything that makes the character _a particular person_ is data: a **persona** (their name and the
commands they type) and a **theme** (six colours). Swap those two objects and it is somebody else's
portfolio.

---

## Getting started

```bash
pnpm add github:facundo-lizdevs/desk-character#v0.1.0
```

```tsx
import { DeskCharacter } from '@lizdevs/desk-character'
import { facundo } from '@lizdevs/desk-character/personas'
import '@lizdevs/desk-character/styles.css'

export default function Page() {
  return (
    <DeskCharacter persona={facundo} theme="matrix" dockMotion="Cascada">
      <YourActualPage />
    </DeskCharacter>
  )
}
```

`children` render below the scene, in the same scroll container. That is not decoration — the character
docks by measuring how far _that_ container has scrolled, so anything you want it to follow has to be
inside it.

### Props

| Prop         | Type                           | Default     | What it does                                               |
| ------------ | ------------------------------ | ----------- | ---------------------------------------------------------- |
| `persona`    | `Persona`                      | —           | Required. Who this is, and what they type.                 |
| `theme`      | `'light' \| 'matrix' \| Theme` | `'light'`   | A preset name, or your own six colours.                    |
| `dockMotion` | `MotionName`                   | `'Cascada'` | How the character travels to the corner. Six options.      |
| `ambient`    | `boolean`                      | `true`      | Clouds, steam, swaying leaves, blinking caret.             |
| `terminal`   | `boolean`                      | `true`      | The scripted terminal. `false` parks it on its last frame. |
| `dockAt`     | `number`                       | `0.92`      | Hero progress (0–1) past which the character docks.        |
| `undockAt`   | `number`                       | `0.55`      | Progress below which it returns to the desk.               |
| `className`  | `string`                       | —           | Added to the scene wrapper.                                |

### Scripts

| Script                              | What it does                                                                        |
| ----------------------------------- | ----------------------------------------------------------------------------------- |
| `pnpm build`                        | Bundles to `dist/` with tsup — ESM, `.d.ts`, and `styles.css`.                      |
| `pnpm dev`                          | The same, in watch mode.                                                            |
| `pnpm typecheck`                    | `tsc --noEmit`, strict, with `noUncheckedIndexedAccess`.                            |
| `pnpm lint`                         | ESLint flat config, including `react-hooks`.                                        |
| `pnpm test`                         | Vitest — 41 tests over the timeline, the personas, the theme, and the rendered DOM. |
| `pnpm validate:persona`             | Checks every shipped persona fits the laptop screen, and prints its loop length.    |
| `pnpm validate:persona ./mine.json` | The same, for a persona you wrote.                                                  |

---

## Make it yours

Two objects. Nothing else.

### The persona

```ts
import type { Persona } from '@lizdevs/desk-character'

export const me: Persona = {
  name: 'Ada Marín',
  role: 'Product Designer',
  location: 'Lisbon, Portugal',
  glasses: false,
  hair: 'long',
  script: [
    { prompt: '$ whoami', layout: 'list', lines: ['ada marín', 'product designer'] },
    { prompt: '$ ls design/', lines: ['figma', 'tokens', 'motion', 'a11y', 'specs', 'systems'] },
  ],
}
```

| Field                    | Type                | Notes                                                                       |
| ------------------------ | ------------------- | --------------------------------------------------------------------------- |
| `name` `role` `location` | `string`            | Identity. The scene is `aria-hidden`, so these are metadata, not page copy. |
| `script`                 | `Frame[]`           | The commands, in order. Five to seven is the useful range.                  |
| `glasses`                | `boolean`           | Default `true`.                                                             |
| `hair`                   | `'short' \| 'long'` | Default `'short'`. `'long'` adds hair past the shoulders.                   |

| Frame field | Type               | Notes                                                                                                                    |
| ----------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| `prompt`    | `string`           | Including the `$ `. **22 characters** is what fits.                                                                      |
| `lines`     | `string[]`         | The output. **6 max** in `grid`, **3 max** in `list`.                                                                    |
| `layout`    | `'grid' \| 'list'` | `grid` (default) pairs lines into two columns, 18 chars each. `list` gives each a full-width row — use it for sentences. |
| `hold`      | `number`           | ms the finished frame stays up. Default `1400`.                                                                          |

### The theme

Six colour roles, emitted as CSS custom properties. Pass hex, or hand through your own design system's
variables — both work identically.

| Role     | Light preset | What it paints                                                    |
| -------- | ------------ | ----------------------------------------------------------------- |
| `ink`    | `#7326d3`    | Every stroke in the drawing. The identity colour.                 |
| `fill`   | `#f4fbfe`    | Paper fills: face, mug, laptop body, plant pot.                   |
| `shade`  | `#a9dbec`    | Hair, eyelids, t-shirt, nose shadow. One step darker than `fill`. |
| `tint`   | `#cfeaf4`    | Book spines, clouds, laptop screen, keyboard.                     |
| `screen` | `#7326d3`    | Terminal text.                                                    |
| `bg`     | `#eef8fc`    | Page behind the scene. `'transparent'` inherits the host page.    |

```tsx
<DeskCharacter
  persona={me}
  theme={{
    ink: 'var(--color-ac)',
    fill: 'var(--color-surface)',
    shade: 'var(--color-chip)',
    tint: 'var(--color-surface-2)',
    screen: 'var(--color-ac-bright)',
    bg: 'transparent',
  }}
/>
```

Two traps, both learned the hard way.

**On a dark page `fill` has to be darker than the background, not lighter.** Keep the original
light-on-dark relationship and the face renders as a white blob with the line work invisible inside it.
The shipped `matrix` preset gets this right; copy its relationships, not its hues.

**`screen` usually should not equal `ink`.** The terminal is the densest text in the drawing — six words
at roughly 9px — and a saturated hue that looks right as a 3px stroke vibrates at that size. The `ink`
preset splits them: violet line work, deep teal on the screen. Every palette wants that split once the
laptop is legible enough to read.

## Framing

| Variant | Frame                                                  | Laptop                |
| ------- | ------------------------------------------------------ | --------------------- |
| `scene` | The full 900×600 room. Wants a viewport.               | Front-on, 1×          |
| `desk`  | Trimmed to the drawn content, 858×476. Wants a column. | 1.3×, lid sheared 20° |

`desk` is for sitting beside a block of text. It sizes itself to whatever column it is given, has no
opinions about the page, and normally pairs with `dock={false}` — a drawing that leaps out of a
two-column hero to pin itself to the corner reads as a bug rather than as a flourish.

Both are crops of one drawing, and both derive everything from a single rectangle in `src/geometry.ts` —
viewBox, character position, terminal box, type size, and the laptop's transform. A third framing is four
numbers.

### The laptop

`desk` scales the laptop 1.3× and shears the lid 20° so the screen turns toward the viewer. The shear is
`skewX` about the hinge line, not `skewY`: `skewX` moves the lid's top edge sideways and leaves the hinge
exactly where the base expects it, so the lid stays attached. `skewY` slopes the hinge itself, which
detaches the lid from the base on one side and wedges it into it on the other.

The terminal is HTML sitting on top of the SVG, so it has to be transformed identically — same scale,
same shear, same two origins, applied as nested elements because CSS allows one `transform-origin` per
element. Both origins come out of `geometry.laptop`, so there is one source for the pair.

Terminal legibility is bounded by the column, not by the laptop: the screen is a fixed fraction of the
frame, so the type size is `column_px × 1.101% × 1.3`. At 620px that is about 8.9px. Wider column, larger
type — there is no other lever short of fewer tokens.

### Screen budget

The screen holds five rows: prompt, three output rows, `$ clear`. `grid` puts output two-up, so a frame
is **6 tokens of 10 characters**; `list` gives full-width rows and fits **3 of 21**. Ten is not a
stylistic choice — two columns and a gap inside a 132-unit screen leave about 57 units per column, and at
a 0.6em advance that is 10 characters.

## Where the character looks

By default the eyes follow the cursor. Pass `gazeSelector` and they also glance at whichever section has
just scrolled into view:

```tsx
<DeskCharacter persona={me} gazeSelector="main section[id]" />
```

Two details make that read as attention rather than as a twitch, and both are worth knowing if you change
them. It aims at the section's **top edge**, not its centre — sections are usually taller than the
viewport, so the centre is often off-screen and the eyes just roll to a corner and stay. And it fires on
**change of which section is most visible**, not on scroll; re-aiming every frame looks like the character
is following the page rather than looking at it.

A glance owns the eyes for 1.6s, then hands them back to the cursor. `src/hooks/useGaze.ts` is the single
owner that arbitrates — without it the two claims overwrite each other mid-transition and the eyes
stutter.

---

## How it is put together

**Everything is one SVG per layer, and DOM order is depth order.** Back scene, character, front scene —
three siblings. The character is _between_ the bookcase and the coffee mug because it is written between
them, which replaces what would otherwise be `z-index` bookkeeping across three dozen groups.

**The intro is 80 CSS animations, and it has to be destroyed to work.** Every stroke carries
`pathLength="1"` and `stroke-dasharray: 1`, so one keyframe draws a 40px eyebrow and a 900px desk line at
their own speeds. But `animation-fill-mode: forwards` means each element's computed style stays owned by
its animation forever — so the moment the dock transition sets `transform` on a parent, all 80 re-resolve
and the character redraws itself from nothing, mid-scroll, every time. `bake()` runs at 2.5s, strips the
`animation` property, and writes the end value directly. Without it the whole component does not work.

**Docking is a FLIP, not a transition.** The character moves from `position: absolute` in the hero to
`position: fixed` in the corner. No CSS transition can animate that — the element teleports. So: measure
before, let it teleport, measure after, transform each of the 14 body parts back to where they started,
release on a double `requestAnimationFrame`. The delta is scaled by `440 / after.width` because the
transforms land in the SVG's own coordinate space and the docked character is a third of the size.

**The dock threshold is two numbers, 0.92 and 0.55.** With one threshold, stopping a trackpad scroll
anywhere near it flips the character back and forth several times a second, each flip a full re-measure
and a 14-group transition. The gap is hysteresis. It is the difference between "nice" and "unusable".

**The terminal is data, and its timeline is a pure function.** `buildTimeline(script)` returns the entire
animation as an array of states you can print and assert on. The alternative — computing the next state
inside a `setTimeout` — is untestable without fake timers and impossible to reason about. All nine
timeline tests run in 8ms with no clock at all.

**The line budget is enforced, because overflow is silent.** An eleventh character in a grid token does
not wrap or overflow visibly — it renders behind the laptop bezel, looking exactly like a frame written
with ten. You would never catch it on your own machine. `checkScript` warns in development and fails CI.

**The eyes have one owner, and it is not React.** A 60Hz pointer move would be sixty renders a second of a
700-node tree to change two `transform` attributes. The attributes are written directly. The mapping from
cursor to character is `getScreenCTM().inverse()` — doing it by hand is fifteen lines that go subtly wrong
the moment the page is zoomed.

**Ambient motion is the first thing to go.** Clouds, steam, and leaves are marked `data-amb` and stripped
wholesale when `prefers-reduced-motion` is set or `navigator.hardwareConcurrency <= 4`. Stagger is clamped
to 18ms on the same signal. Being wrong about a device costs a plainer animation, not a broken one.

**Accessibility: the scene is `aria-hidden`, and that is the correct answer.** It is decoration. The
skills the terminal names must exist as real text elsewhere on your page, where a screen reader and a
crawler can both reach them — the terminal is a second, prettier rendering of information you already
published, not the only copy of it.

**Nothing renders differently on the server than on the client.** `matchMedia` is read in an effect, never
during render, so the first client paint matches the server byte for byte. The cost is a few frames of
animation before a reduced-motion preference is honoured — which is why `bake()` runs immediately rather
than at 2.5s once the preference is known.

---

## Scaling it up — with AI

The contract is [`persona.schema.json`](./persona.schema.json), not this prose. Hand an LLM the schema and
your CV and it has everything it needs.

```
Read the attached JSON Schema and the attached CV.

Produce a single JSON object that validates against the schema.

Rules the schema cannot express:
- One frame per discipline. Do not put two disciplines in one command.
- Order them: identity, then what the person builds, then what it runs on,
  then how it ships.
- Only tools the CV shows evidence of shipping. If it is listed but not
  used in any project, leave it out.
- Prefer the command a practitioner would actually run over a generic `ls`.
- Lowercase the output tokens. Keep the prompts lowercase too.

Output only the JSON.
```

Then check it — this is the part people skip:

```bash
pnpm validate:persona ./persona.json
```

```
✓ ./persona.json — 7 commands, 25.8s loop
```

The validator enforces the screen budget, which an LLM will cheerfully blow past because nothing in the
text tells it that a seventh token is invisible rather than wrong. **A model will also happily list tools
your CV never mentions.** Read every line it produced against the CV before you ship it. The whole point
of this component is that a stranger reads those six words and forms an opinion about what you can do;
a hallucinated line is a question you cannot answer in the interview it gets you.

## Scaling it up — without AI

The same job, as a table. Fill in the right-hand column.

| #   | Command               | Six tokens               | Discipline          |
| --- | --------------------- | ------------------------ | ------------------- |
| 1   | `$ whoami`            | _(use `layout: 'list'`)_ | who you are         |
| 2   | `$ ls stack/frontend` |                          | what the user sees  |
| 3   | `$ ls stack/backend`  |                          | what serves it      |
| 4   | `$ …`                 |                          | your differentiator |
| 5   | `$ …`                 |                          | where it runs       |
| 6   | `$ …`                 |                          | how it ships        |

Four rules, in order of how much they matter:

1. **Only things you have shipped.** Somebody will ask you about the sixth word on that screen.
2. **One discipline per command.** A frame that mixes React and Terraform tells a reader nothing about
   either.
3. **Six tokens, eighteen characters.** This is a filter, not a formatting rule. It forces you to choose
   the six things per area worth showing someone who is looking for four seconds. If a tool needs a
   qualifier to be honest, cut it rather than shortening it.
4. **Use the real command.** `$ ollama ps` reads as someone who runs models. `$ ls stack/ai` reads as
   someone who made a list.

Then `pnpm validate:persona ./persona.json`, same as above.

## Adding a dock motion

One object literal in [`src/motions.ts`](./src/motions.ts), and the union in `types.ts`:

```ts
Caída: {
  stagger: 60,
  dur: 900,
  ease: 'cubic-bezier(.4,0,.2,1)',
  from: (dx, dy) => `translate(${dx}px,${dy - 200}px) rotate(8deg)`,
},
```

`from` receives the FLIP delta already converted into the character's 440-wide space, so you can compose
rotation and scale on top of the translation without knowing anything about the page.

## Adding a body part

Wrap it in a group carrying `data-fl="yourpart"` and put it in the right place in the source. That
attribute is the whole registration: **source order is the stagger order** for the dock animation, so
moving a group up or down the file re-choreographs the transition without touching any animation code.
Strokes get `pathLength={1}` and `style={draw(dur, delay)}`; fills get `data-fillel=""` and
`style={fill(dur, delay)}`. Those two attributes are what `bake()` queries for.

---

## Licence

MIT. The character is drawn art — if you use it, a persona of your own is more interesting than mine.
