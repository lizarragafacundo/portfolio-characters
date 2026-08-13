import type { NextConfig } from 'next'

/**
 * `transpilePackages` is here because the local dependency is a `file:` link to
 * the repo root. It is *not* needed for a real install: the published `dist/` is
 * already ES2022 with a `'use client'` banner. Keeping it means the example runs
 * against uncommitted source, which is the only way it catches anything.
 */
const config: NextConfig = {
  transpilePackages: ['@lizdevs/desk-character'],
}

export default config
