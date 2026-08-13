/**
 * Crops of the 440x620 character space. Distinct from the scene `VARIANTS`,
 * which crop the 900x600 room — see `docs/ANATOMY.md`.
 */
export const PORTRAIT_CROPS = {
  full: { viewBox: '0 0 440 620', aspect: '440/620' },
  bust: { viewBox: '0 20 440 470', aspect: '440/470' },
  head: { viewBox: '80 20 280 380', aspect: '280/380' },
} as const

export type PortraitCropName = keyof typeof PORTRAIT_CROPS
