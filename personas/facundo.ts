import type { Persona } from '../src/types'

export const facundo: Persona = {
  name: 'Facundo Lizarraga',
  role: 'Senior Full-Stack Engineer',
  location: 'Buenos Aires, Argentina',
  appearance: {
    preset: 'facu-02',
    hair: 'wavy',
    eyes: 'ringed',
  },

  script: [
    {
      prompt: '$ whoami',
      layout: 'list',
      lines: ['facundo lizarraga', 'senior full-stack', 'buenos aires · remote'],
      hold: 1800,
    },

    {
      prompt: '$ ls stack/frontend',
      lines: ['typescript', 'react', 'next.js', 'tanstack', 'tailwind', 'radix'],
    },

    {
      prompt: '$ ls stack/backend',
      lines: ['node.js', 'express', 'fastapi', 'mongodb', 'qdrant', 'stripe'],
    },

    {
      prompt: '$ ollama ps',
      lines: ['llama3.1', 'qwen-coder', 'claude-api', 'openai-api', 'agents', 'rag'],
    },

    {
      prompt: '$ aws lambda ls',
      lines: ['lambda', 'step-func', 'sqs', 's3', 'api-gw', 'cloudwatch'],
    },

    {
      prompt: '$ terraform apply',
      lines: ['coder', 'docker', 'proxmox', 'kubernetes', 'nginx', 'cloudflare'],
    },

    {
      prompt: '$ gh workflow run',
      lines: ['typecheck', 'lint', 'test', 'build', 'dev → stg', 'stg → prd'],
    },
  ],
}
