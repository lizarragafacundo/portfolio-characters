# Changesets

This directory holds pending changesets. Read the [changesets documentation](https://github.com/changesets/changesets) to learn what a changeset is, how to add one, and how versioning is affected.

## Adding a changeset

Every PR that changes the published package should include one:

```sh
pnpm changeset
```

Pick the bump type (patch/minor/major — remember the package is `0.x`, so a
minor bump may break) and describe the change in one or two sentences. That
description becomes the changelog entry, so write it for a consumer, not for
another contributor.

Commit the generated `.changeset/*.md` file alongside your change.

## What happens after merge

A GitHub Action on `main` collects every pending changeset into a "Version
Packages" PR that bumps `package.json` and writes `CHANGELOG.md`. Merging
that PR is what actually publishes to npm — see
[`../docs/PUBLISHING.md`](../docs/PUBLISHING.md).
