import type { EyeStyle, EyesId } from '../partTypes'

export const eyeStyles: Record<EyesId, EyeStyle> = {
  round: {
    centreX: [175, 265],
    centreY: 212,
    pupilRadius: 4.2,
    decor: [],
  },
  almond: {
    centreX: [175, 265],
    centreY: 212,
    pupilRadius: 4,
    decor: [
      {
        name: 'almondEyeStroke',
        path: 'M158,204 C166,195 184,195 192,204 M248,204 C256,195 274,195 282,204',
        strokeWidth: 1.7,
        drawDelay: 1.66,
        drawDuration: 0.4,
      },
    ],
  },
  wide: {
    centreX: [175, 265],
    centreY: 212,
    pupilRadius: 5,
    decor: [
      {
        name: 'wideEyeDetail',
        path: 'M166,229 C172,232 180,232 186,229 M256,229 C262,232 270,232 276,229',
        strokeWidth: 1.4,
        opacity: 0.5,
        drawDelay: 1.7,
        drawDuration: 0.4,
      },
    ],
  },
  sleepy: {
    centreX: [175, 265],
    centreY: 212,
    pupilRadius: 3.8,
    decor: [
      {
        name: 'sleepyEyeStroke',
        path: 'M161,203 C169,199 181,199 189,203 M251,203 C259,199 271,199 279,203',
        strokeWidth: 1.9,
        drawDelay: 1.66,
        drawDuration: 0.4,
      },
    ],
  },
  happy: {
    centreX: [175, 265],
    centreY: 210,
    pupilRadius: 0,
    decor: [
      {
        name: 'happyEyeStroke',
        path: 'M159,221 C167,213 183,213 191,221 M249,221 C257,213 273,213 281,221',
        strokeWidth: 1.9,
        drawDelay: 1.68,
        drawDuration: 0.4,
      },
    ],
  },
  narrow: {
    centreX: [175, 265],
    centreY: 212,
    pupilRadius: 3.4,
    decor: [
      {
        name: 'narrowEyeDetail',
        path: 'M160,202 C168,198 182,198 190,202 M250,202 C258,198 272,198 280,202',
        strokeWidth: 1.6,
        opacity: 0.65,
        drawDelay: 1.68,
        drawDuration: 0.45,
      },
    ],
  },
  big: {
    centreX: [175, 265],
    centreY: 212,
    pupilRadius: 5.4,
    decor: [],
  },
  lashes: {
    centreX: [175, 265],
    centreY: 212,
    pupilRadius: 4.2,
    decor: [
      {
        name: 'lashesEyeStroke',
        path: 'M153,200 C149,197 146,194 144,190 M159,195 C156,191 154,187 153,183 M287,200 C291,197 294,194 296,190 M281,195 C284,191 286,187 287,183',
        strokeWidth: 1.6,
        drawDelay: 1.7,
        drawDuration: 0.4,
      },
    ],
  },
  monolid: {
    centreX: [175, 265],
    centreY: 212,
    pupilRadius: 4,
    decor: [
      {
        name: 'monolidEyeStroke',
        path: 'M156,200 C168,196 182,196 194,200 M246,200 C258,196 272,196 284,200',
        strokeWidth: 1.7,
        opacity: 0.8,
        drawDelay: 1.66,
        drawDuration: 0.4,
      },
    ],
  },
  brown: {
    centreX: [175, 265],
    centreY: 212,
    pupilRadius: 2.8,
    decor: [
      {
        name: 'brownEyeShape',
        path: 'M160,212 C164,202 186,202 190,212 C186,222 164,222 160,212 Z M250,212 C254,202 276,202 280,212 C276,222 254,222 250,212 Z',
        fill: 'fill',
        stroke: 'ink',
        strokeWidth: 2.2,
        drawDelay: 1.6,
        drawDuration: 0.4,
      },
      {
        name: 'brownEyeFill',
        path: 'M169,212 a6,6 0 1,0 12,0 a6,6 0 1,0 -12,0 M259,212 a6,6 0 1,0 12,0 a6,6 0 1,0 -12,0',
        fill: '#8B5E3C',
        drawDelay: 1.66,
      },
      {
        name: 'brownEyeFill2',
        path: 'M176.5,209 a1.5,1.5 0 1,0 3,0 a1.5,1.5 0 1,0 -3,0 M266.5,209 a1.5,1.5 0 1,0 3,0 a1.5,1.5 0 1,0 -3,0',
        fill: '#FFFFFF',
        drawDelay: 1.8,
      },
    ],
  },
  spark: {
    centreX: [175, 265],
    centreY: 212,
    pupilRadius: 4.4,
    decor: [
      {
        name: 'sparkEyeFill',
        path: 'M175.5,209 a1.6,1.6 0 1,0 3.2,0 a1.6,1.6 0 1,0 -3.2,0 M265.5,209 a1.6,1.6 0 1,0 3.2,0 a1.6,1.6 0 1,0 -3.2,0',
        fill: 'fill',
        drawDelay: 1.78,
      },
    ],
  },
  ringed: {
    centreX: [175, 265],
    centreY: 212,
    pupilRadius: 2.6,
    ringRadius: 7,
    decor: [
      {
        name: 'upperLidShadow',
        path: 'M151,182 H201 A8,8 0 0 1 201,198 H151 A8,8 0 0 1 151,182 Z M240,182 H290 A8,8 0 0 1 290,198 H240 A8,8 0 0 1 240,182 Z',
        fill: 'skinShade',
        drawDelay: 1.68,
      },
    ],
  },
}
