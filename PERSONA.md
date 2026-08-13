# Writing a persona

A persona is the difference between "a nice illustration" and "this is what that person does". It is one
object, and the hard part is not the format — it is choosing what goes in it.

The format is [`persona.schema.json`](./persona.schema.json). This file is the judgement.

---

## The constraint, first

The laptop screen holds **five lines of text**: one prompt, three rows of output, one `$ clear`. The
output rows are two columns wide, so a frame fits **six tokens of ten characters**.

That is not a formatting detail you work around. It is the entire design of the thing. Six words per
discipline is roughly what a reader takes in before scrolling, and forcing yourself to pick six is what
turns a skills dump into a statement.

The failure mode is silent: a seventh token renders _behind the laptop bezel_. It does not wrap, it does
not overflow, it does not warn in the browser. It looks exactly like a frame you wrote with six. You would
ship it and never know. Hence:

```bash
pnpm validate:persona ./persona.json
```

---

## With an LLM

Attach `persona.schema.json` and your CV. Paste this:

```
Read the attached JSON Schema and the attached CV.

Produce a single JSON object that validates against the schema.

Rules the schema cannot express:
- One frame per discipline. Do not put two disciplines in one command.
- Order them: identity, then what the person builds, then what it runs on,
  then how it ships.
- Only tools the CV shows evidence of shipping. If it is listed as a skill
  but does not appear in any project, leave it out.
- Prefer the command a practitioner would actually run over a generic `ls`.
  `$ ollama ps` over `$ ls stack/ai`. `$ terraform apply` over `$ ls infra`.
- Lowercase the output tokens, and the prompts.
- Do not pad a frame to six tokens. Five true ones beat six with a guess.

Output only the JSON.
```

### Then do the part that matters

Run the validator. It will catch overflow, which a model gets wrong because nothing in the schema explains
that the seventh token is _invisible_ rather than _rejected_.

It will not catch the real problem. **A model will list tools your CV never mentions**, because "senior
backend engineer" has a statistical shape and it will fill in the gaps in that shape. Go line by line
against the CV and delete anything you cannot point at a project for.

The reason to be strict here is not principle, it is consequences. Six words on a laptop screen are the
first concrete claim a stranger reads about you, and they are the words they will open with. A hallucinated
line is a question you cannot answer, in a room you got into because of it.

---

## Without an LLM

Fill in the table. It takes about twenty minutes and produces a better result, because you know which of
your projects you would actually enjoy talking about.

| #   | Command    | Token 1                      | 2   | 3   | 4   | 5   | 6   |
| --- | ---------- | ---------------------------- | --- | --- | --- | --- | --- |
| 1   | `$ whoami` | _(`layout: 'list'`, 3 rows)_ |     |     |     |     |     |
| 2   |            |                              |     |     |     |     |     |
| 3   |            |                              |     |     |     |     |     |
| 4   |            |                              |     |     |     |     |     |
| 5   |            |                              |     |     |     |     |     |

Then transcribe it:

```ts
import type { Persona } from '@lizdevs/desk-character'

export const me: Persona = {
  name: '',
  role: '',
  location: '',
  script: [
    { prompt: '$ whoami', layout: 'list', lines: ['', '', ''], hold: 1800 },
    { prompt: '', lines: ['', '', '', '', '', ''] },
  ],
}
```

### Picking the commands

The prompt does more work than the tokens. `$ ls stack/ai` says you made a list of AI things. `$ ollama ps`
says you have a machine with models running on it. Same six tokens underneath; completely different claim.

Some that read well, by discipline:

| Discipline     | Prompt                                      |
| -------------- | ------------------------------------------- |
| identity       | `$ whoami`                                  |
| frontend       | `$ ls stack/frontend`, `$ pnpm why react`   |
| backend        | `$ ls stack/backend`, `$ docker compose ps` |
| LLM / AI       | `$ ollama ps`, `$ ls agents/`               |
| cloud          | `$ aws lambda ls`, `$ kubectl get pods`     |
| infrastructure | `$ terraform apply`, `$ systemctl status`   |
| CI/CD          | `$ gh workflow run`, `$ git log --oneline`  |
| design         | `$ ls design/`, `$ figma ls tokens/`        |
| data           | `$ ls notebooks/`, `$ dbt run`              |

They do not have to be commands that exist. They have to be commands a person in that job would type. What
sells it is the monospace and the caret, not the accuracy.

### The `whoami` frame

Use `layout: 'list'` — full-width rows, three of them, no ten-character column limit. It is the one
frame that gets sentences instead of tokens, and it should be the only one.

```ts
{ prompt: '$ whoami', layout: 'list', lines: ['ada marín', 'product designer', 'lisbon · hybrid'], hold: 1800 }
```

`hold: 1800` rather than the default 1400 — it is the frame people read rather than scan.

---

## A worked example

The shipped [`personas/facundo.ts`](./personas/facundo.ts) is a backend-leaning engineer: seven commands,
26-second loop, glasses, short hair.

[`personas/example-designer.ts`](./personas/example-designer.ts) is deliberately as far from it as the
format allows — a product designer, five commands, no glasses, long hair, and one frame whose output is
achievements (`4 design systems`) rather than tools. It exists in the test suite, not as decoration: a
component that is "configurable" but only ever run with its author's own data is configurable by
assertion. If a change makes the scene assume a backend engineer's stack, that file breaks first.

Note what changed between them and what did not. The drawing is identical. The commands, the tokens, the
two character flags, and the number of frames are all different. That is the intended surface — the art is
fixed, the content is yours.

## The length knob

Every extra command is ~3.7 seconds of loop. Seven commands is 26 seconds, and most visitors see the first
three. That is fine — it is ambient, not a video, and nobody is waiting for the end.

But if you want the whole loop to land, five commands at 18 seconds is the number.

```bash
pnpm validate:persona   # prints the loop length for every persona
```

```
✓ exampleDesigner — 5 commands, 18.3s loop
✓ facundo — 7 commands, 25.8s loop
```
