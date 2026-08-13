# Publishing

The package publishes to npm as `@facundolizarraga/portfolio-characters`,
automatically, through `.github/workflows/release.yml`. Nothing is published
by hand and nothing is published from a tag anymore — releases are driven by
[Changesets](https://github.com/changesets/changesets).

## One-time setup

Three things have to exist before the first release. None of them can be done
from the repository.

### 1. The npm scope

An npm scope must match a user or organisation you own, so
`@facundolizarraga` needs an npm account named `facundolizarraga`.

```sh
npm adduser          # or `npm login` if the account already exists
npm whoami           # must print facundolizarraga
```

If the name is taken, change `name` in `package.json` and the
`importSpecifier` default in `src/builder/buildUsageSnippet.ts` together — the
builder emits the package name into every generated snippet.

### 2. The GitHub repository

```sh
gh repo create lizarragafacundo/portfolio-characters --public --source . --push
```

`repository.url` in `package.json` must match it exactly. npm provenance
verifies the tarball was built from that repository, and a mismatch fails the
publish rather than warning.

### 3. The npm token

Create a **granular access token** with read-and-write access, with **Bypass
2FA** enabled (npmjs.com → Access Tokens → Generate New Token → Granular
Access Token), then add it as a repository secret named `NPM_TOKEN`:

```sh
gh secret set NPM_TOKEN
```

Bypass 2FA has to be on: without it, `pnpm publish` from CI fails with
`403 Two-factor authentication ... is required to publish packages`, since
there's no interactive prompt to enter an OTP into. A granular token scoped
to "select packages" can't be used for the very first publish either — that
scope only lists packages that already exist on npm. Scope it to "all
packages" for the first release, then optionally narrow it once this package
exists.

## Releasing

There is no manual release step. The flow is:

1. **While working on a change**, add a changeset describing it:

   ```sh
   pnpm changeset
   ```

   Pick patch/minor/major (the package is `0.x`, so a minor bump may break —
   see Versioning below) and write one or two sentences a _consumer_ would
   want to read. This writes a file under `.changeset/`; commit it with your
   change.

2. **Once CI passes on `main`**, `.github/workflows/release.yml` runs — it
   does not repeat CI's checks itself, it only starts after the `CI` workflow
   reports success for that commit — and hands off to `changesets/action`:
   - If there are changesets on `main` that haven't been released yet, it
     opens (or updates) a **"Version Packages"** pull request. That PR bumps
     `package.json` and writes `CHANGELOG.md` from the pending changesets —
     it does not publish anything.
   - If no changesets are pending — i.e. the "Version Packages" PR was just
     merged — it runs `pnpm publish --access public --provenance` instead and
     opens a GitHub release for the new version.

So the only manual actions are: write a changeset, and merge the PR the bot
opens. Everything after that merge is automatic.

### Before merging a Version Packages PR

Check what it's about to ship. The PR diff itself shows the version bump and
changelog; to see the actual tarball contents:

```sh
pnpm build
pnpm pack --dry-run
```

`files` in `package.json` restricts the tarball to `dist`, the README,
`PERSONA.md` and `persona.schema.json`. Source, tests, docs and the example
app are not published.

## Versioning

Plain SemVer, changelog generated from changesets (`CHANGELOG.md`). While the
package is `0.x`, **a minor bump may break**: the builder API in particular is
expected to move. That is stated in the README so nobody pins loosely by
mistake.

## Consuming it while developing

Do not add a `file:` dependency to the portfolio. A path outside the
repository cannot be resolved by `pnpm install --frozen-lockfile` on a clean
CI runner, and that is exactly the failure the published package exists to
fix.

Link it instead — this touches `node_modules` only, leaves `package.json` and
the lockfile alone, and is undone by a plain `pnpm install`:

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
