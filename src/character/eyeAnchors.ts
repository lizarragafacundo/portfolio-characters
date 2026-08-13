import type { EyeStyle } from '../parts/partTypes'

export interface Point {
  x: number
  y: number
}

export interface EyeAnchors {
  left: Point
  right: Point
  face: Point
}

/** The head's centroid. Independent of eye style, so gaze rotation stays stable. */
export const FACE_CENTRE: Point = { x: 220, y: 230 }

export const DEFAULT_EYE_ANCHORS: EyeAnchors = {
  left: { x: 175, y: 212 },
  right: { x: 265, y: 212 },
  face: FACE_CENTRE,
}

export const eyeAnchorsFor = (style: EyeStyle | undefined): EyeAnchors => {
  if (!style) return DEFAULT_EYE_ANCHORS
  return {
    left: { x: style.centreX[0], y: style.centreY },
    right: { x: style.centreX[1], y: style.centreY },
    face: FACE_CENTRE,
  }
}
