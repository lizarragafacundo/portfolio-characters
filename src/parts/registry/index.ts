import type { PartRegistry } from '../partTypes'
import { beardStyles } from './beardStyles'
import { deskObjects } from './deskObjects'
import { eyeStyles } from './eyeStyles'
import { faceBase } from './faceBase'
import { glassesStyles } from './glassesStyles'
import { hairColors } from './hairColors'
import { hairStyles } from './hairStyles'
import { mouthStyles } from './mouthStyles'
import { presets } from './presets'
import { skinTones } from './skinTones'

export const PART_REGISTRY: PartRegistry = {
  skinTones,
  hairColors,
  faceBase,
  hairStyles,
  eyeStyles,
  mouthStyles,
  beardStyles,
  glassesStyles,
  deskObjects,
  presets,
}

export {
  beardStyles,
  deskObjects,
  eyeStyles,
  faceBase,
  glassesStyles,
  hairColors,
  hairStyles,
  mouthStyles,
  presets,
  skinTones,
}
