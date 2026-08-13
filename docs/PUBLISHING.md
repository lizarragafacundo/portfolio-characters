# Publishing

The package publishes to npm as `@facundolizarraga/portfolio-characters`, from a
tag, through `.github/workflows/release.yml`.

## One-time setup

Three things have to exist before the first release. None of them can be done from
the repository.

### 1. The npm scope

An npm scope must match a user or organisation you own, so `@facundolizarraga`
needs an npm account named `facundolizarraga`.

```sh
npm adduser          # or `npm login` if the account already exists
npm whoami           # must print facundolizarraga
```

If the name is taken, change `name` in `package.json` and the `importSpecifier`
default in `src/builder/buildUsageSnippet.ts` together — the builder emits the
package name into every generated snippet.

### 2. The GitHub repository

```sh
gh repo create lizarragafacundo/portfolio-characters --public --source . --push
```

`repository.url` in `package.json` must match it exactly. npm provenance verifies
the tarball was built from that repository, and a mismatch fails the publish
rather than warning.

### 3. The npm token

Create a **granular access token** with read-and-write access limited to this
package (npmjs.com → Access Tokens → Generate New Token → Granular Access Token),
then add it to the repository:

```sh
gh secret set NPM_TOKEN
```

Use a granular token rather than a classic automation token: it can be scoped to
this one package, so a leak cannot touch anything else you publish.

## Releasing

```sh
npm version minor          # bumps package.json and creates the v0.2.0 tag
git push --follow-tags
```

The tag triggers the workflow, which re-runs the full CI gate, checks the tag
matches the version, publishes with provenance, and opens a GitHub release with
generated notes.

Nothing publishes from `main`, and nothing publishes without a tag.

### Before the first release

Check what will actually ship:

```sh
pnpm build
pnpm pack --dry-run
npm publish --dry-run
```

`files` in `package.json` restricts the tarball to `dist`, the README, `PERSONA.md`
and `persona.schema.json`. Source, tests, docs and the example app are not
published.

## Versioning

Plain SemVer, hand-written `CHANGELOG.md`. While the package is `0.x`, **a minor
bump may break**: the builder API in particular is expected to move. That is
stated in the README so nobody pins loosely by mistake.

## Consuming it while developing

Do not add a `file:` dependency to the portfolio. A path outside the repository
cannot be resolved by `pnpm install --frozen-lockfile` on a clean CI runner, and
that is exactly the failure the published package exists to fix.

Link it instead — this touches `node_modules` only, leaves `package.json` and the
lockfile alone, and is undone by a plain `pnpm install`:

```sh
# in this repository
pnpm build
pnpm link --global

# in the portfolio
pnpm link --global @facundolizarraga/portfolio-characters

# to undo
pnpm install
```

The portfolio itself depends on a published range.
