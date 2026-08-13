import type { PartRegistry, Primitive } from '../parts/partTypes'

const RAISED_BROW_LIFT = 'translate(0 -13)'

const MOUTH_OPEN: Primitive[] = [
  {
    name: 'openLips',
    path: 'M208,296 C214,288 232,288 238,296 C236,308 212,308 208,296 Z',
    fill: 'skinShade',
    stroke: 'ink',
    strokeWidth: 2.1,
  },
  {
    name: 'openChinCrease',
    path: 'M204,318 C214,323 230,323 242,317',
    strokeWidth: 1.6,
    opacity: 0.55,
  },
]

/**
 * The pair of faces the dock transition cross-fades to. Brows are lifted copies
 * of whatever the registry draws, so a future brow revision cannot leave the
 * raised expression drawn in a different style from the resting one.
 */
export const expressionOverlaysFor = (registry: PartRegistry) => ({
  browsRaised: registry.faceBase.brows.map((brow) => ({
    ...brow,
    name: `${brow.name}Raised`,
    transform: brow.transform ? `${brow.transform} ${RAISED_BROW_LIFT}` : RAISED_BROW_LIFT,
  })),
  mouthOpen: MOUTH_OPEN,
})
