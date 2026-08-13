const SCREEN = { x: 624, y: 306, w: 194, h: 142 }

const CHARACTER = { x: 283.5, y: 66, w: 333 }

const LAPTOP_PIVOT = { x: 721, y: 480 }

const LID_HINGE = { x: 721, y: 458 }

const TYPE = 10.2

export interface LaptopTransform {
  group: string
  lid: string
  scale: number
  tilt: number
  scaleOrigin: string
  tiltOrigin: string
}

export interface Geometry {
  viewBox: string
  aspect: string
  character: { left: string; top: string; width: string }
  terminal: { left: string; top: string; width: string; height: string }
  fontSize: string
  unit: (sceneUnits: number) => string
  laptop: LaptopTransform
}

export interface CropSpec {
  x: number
  y: number
  w: number
  h: number
  laptopScale?: number
  laptopTilt?: number
}

const pct = (value: number, span: number) => `${((value / span) * 100).toFixed(3)}%`

const laptopTransform = (scale: number, tilt: number): LaptopTransform => ({
  group: `translate(${LAPTOP_PIVOT.x} ${LAPTOP_PIVOT.y}) scale(${scale}) translate(${-LAPTOP_PIVOT.x} ${-LAPTOP_PIVOT.y})`,
  lid: `translate(${LID_HINGE.x} ${LID_HINGE.y}) skewX(${-tilt}) translate(${-LID_HINGE.x} ${-LID_HINGE.y})`,
  scale,
  tilt,
  scaleOrigin: `${pct(LAPTOP_PIVOT.x - SCREEN.x, SCREEN.w)} ${pct(LAPTOP_PIVOT.y - SCREEN.y, SCREEN.h)}`,
  tiltOrigin: `${pct(LID_HINGE.x - SCREEN.x, SCREEN.w)} ${pct(LID_HINGE.y - SCREEN.y, SCREEN.h)}`,
})

const crop = ({ x, y, w, h, laptopScale = 1, laptopTilt = 0 }: CropSpec): Geometry => ({
  viewBox: `${x} ${y} ${w} ${h}`,
  aspect: `${w}/${h}`,
  character: {
    left: pct(CHARACTER.x - x, w),
    top: pct(CHARACTER.y - y, h),
    width: pct(CHARACTER.w, w),
  },
  terminal: {
    left: pct(SCREEN.x - x, w),
    top: pct(SCREEN.y - y, h),
    width: pct(SCREEN.w, w),
    height: pct(SCREEN.h, h),
  },
  fontSize: `${((TYPE / w) * 100).toFixed(3)}cqw`,
  unit: (sceneUnits: number) => `${((sceneUnits / w) * 100).toFixed(3)}cqw`,
  laptop: laptopTransform(laptopScale, laptopTilt),
})

export const VARIANTS = {
  scene: crop({ x: 0, y: 0, w: 900, h: 600 }),

  desk: crop({ x: 36, y: 44, w: 858, h: 476, laptopScale: 1.12 }),

  deskStrip: crop({ x: 30, y: 296, w: 840, h: 210 }),
} as const satisfies Record<string, Geometry>

export type VariantName = keyof typeof VARIANTS
