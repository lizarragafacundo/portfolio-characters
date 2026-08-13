import type { Persona } from '../src/types'

export const exampleDesigner: Persona = {
  name: 'Ada Marín',
  role: 'Product Designer',
  location: 'Lisbon, Portugal',
  appearance: {
    preset: 'preset-06',
    eyes: 'lashes',
  },

  script: [
    {
      prompt: '$ whoami',
      layout: 'list',
      lines: ['ada marín', 'product designer', 'lisbon · hybrid'],
      hold: 1800,
    },
    {
      prompt: '$ ls design/',
      lines: ['figma', 'systems', 'prototypes', 'motion', 'illustr.', 'tokens'],
    },
    {
      prompt: '$ ls research/',
      lines: ['interviews', 'usability', 'card-sort', 'surveys', 'analytics', 'a-b-tests'],
    },
    {
      prompt: '$ ls handoff/',
      lines: ['storybook', 'tailwind', 'css-vars', 'a11y-audit', 'specs', 'tokens'],
    },
    {
      prompt: '$ ls shipped/',
      layout: 'list',
      lines: ['4 design systems', '2 rebrands', '11 product launches'],
      hold: 1800,
    },
  ],
}
