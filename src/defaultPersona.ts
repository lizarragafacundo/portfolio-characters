import type { Persona } from './types'

/**
 * What `<PortfolioCharacter />` renders when no persona is given, so the
 * component does something recognisable on the first line of code.
 */
export const DEFAULT_PERSONA: Persona = {
  name: 'Your Name',
  role: 'Software Engineer',
  location: 'Somewhere, Earth',
  appearance: { preset: 'preset-01' },
  script: [
    {
      prompt: '$ whoami',
      layout: 'list',
      lines: ['your name', 'software engineer', 'somewhere · remote'],
      hold: 1800,
    },
    {
      prompt: '$ ls stack/',
      lines: ['typescript', 'react', 'node.js', 'postgres', 'docker', 'aws'],
    },
    {
      prompt: '$ git log --oneline',
      lines: ['ship it', 'fix tests', 'refactor', 'add docs', 'tidy up', 'init'],
    },
  ],
}
