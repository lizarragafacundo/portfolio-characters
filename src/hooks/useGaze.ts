'use client'

import { useMemo, useRef, type RefObject } from 'react'
import { DEFAULT_EYE_ANCHORS, type EyeAnchors } from '../character/eyeAnchors'

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))

export interface GazeRefs {
  svg: RefObject<SVGSVGElement | null>
  face: RefObject<SVGGElement | null>
  leftPupil: RefObject<SVGGElement | null>
  rightPupil: RefObject<SVGGElement | null>
}

export interface GazeController {
  look: (client: { x: number; y: number }, options?: { ease?: boolean; moveFace?: boolean }) => void
  hold: (ms: number) => void
  held: () => boolean
}

export const useGaze = (
  refs: GazeRefs,
  anchors: EyeAnchors = DEFAULT_EYE_ANCHORS,
): GazeController => {
  const heldUntil = useRef(0)

  return useMemo<GazeController>(() => {
    const aim = (
      el: SVGGElement | null,
      origin: { x: number; y: number },
      local: { x: number; y: number },
      ease: boolean,
    ) => {
      if (!el) return
      const ox = clamp((local.x - origin.x) * 0.06, -9, 9)
      const oy = clamp((local.y - origin.y) * 0.06, -6, 6)
      el.style.transition = ease ? 'transform .55s cubic-bezier(.3,.9,.3,1)' : 'none'
      el.setAttribute('transform', `translate(${ox} ${oy})`)
    }

    return {
      look(client, { ease = false, moveFace = true } = {}) {
        const svg = refs.svg.current
        if (!svg?.getScreenCTM) return
        const ctm = svg.getScreenCTM()
        if (!ctm) return

        const pt = svg.createSVGPoint()
        pt.x = client.x
        pt.y = client.y
        const local = pt.matrixTransform(ctm.inverse())

        aim(refs.leftPupil.current, anchors.left, local, ease)
        aim(refs.rightPupil.current, anchors.right, local, ease)

        const face = refs.face.current
        if (face && moveFace) {
          const fx = clamp((local.x - anchors.face.x) * 0.014, -4, 4)
          const fy = clamp((local.y - anchors.face.y) * 0.014, -3, 3)
          face.style.transition = ease ? 'transform .7s cubic-bezier(.3,.9,.3,1)' : 'none'
          face.setAttribute('transform', `translate(${fx} ${fy})`)
        }
      },

      hold(ms) {
        heldUntil.current = Date.now() + ms
      },

      held() {
        return Date.now() < heldUntil.current
      },
    }
  }, [refs, anchors])
}
