import { readFile, writeFile } from 'node:fs/promises'
import { copyFile } from 'node:fs/promises'
import { defineConfig } from 'tsup'

const CLIENT_DIRECTIVE = "'use client';\n"

const CLIENT_ENTRIES = ['dist/index.js', 'dist/builder/index.js']

/**
 * One config, three entries.
 *
 * `personas/` is a separate entry so a consumer who writes their own persona
 * never pays for the two we ship — `dist/index.js` does not import them, so a
 * bundler drops them entirely.
 *
 * `builder/` is separate for the same reason: the builder UI is a tool, and the
 * overwhelming majority of consumers only ever mount the character. With
 * `splitting` off this duplicates the part registry into both bundles, which is
 * a deliberate trade — the CI byte budget is what keeps it honest.
 *
 * `treeshake` is deliberately **off**. tsup implements it as an extra Rollup
 * pass over esbuild's output, and Rollup strips module-level directives with
 * `"use client" ... was ignored` — which silently breaks every Next.js App
 * Router consumer. esbuild already tree-shakes what it bundles, so the Rollup
 * pass was buying nothing and costing the directive.
 *
 * `injectStyle: false` — the keyframes ship as a real `dist/styles.css` the
 * consumer imports. Injecting a <style> tag at runtime would make the component
 * client-only and break server rendering.
 */
export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'personas/index': 'personas/index.ts',
    'builder/index': 'src/builder/index.ts',
  },
  format: ['esm'],
  target: 'es2022',
  dts: true,
  clean: true,
  treeshake: false,
  splitting: false,
  sourcemap: true,
  injectStyle: false,
  external: ['react', 'react-dom', 'react/jsx-runtime'],

  async onSuccess() {
    await copyFile('src/styles.css', 'dist/styles.css')
    await copyFile('src/builder/builder.css', 'dist/builder.css')

    // Prepended here rather than via tsup's `banner`, which applies to every
    // entry. Personas are plain data: marking them client-only would drag them
    // and anything importing them across the server boundary for nothing.
    for (const entry of CLIENT_ENTRIES) {
      const bundle = await readFile(entry, 'utf8')
      if (!bundle.startsWith(CLIENT_DIRECTIVE)) {
        await writeFile(entry, CLIENT_DIRECTIVE + bundle)
      }
    }
  },
})
