'use client'

import { useMemo, useRef, type CSSProperties } from 'react'
import { useGaze } from '../hooks/useGaze'
import { useMotionCapability } from '../hooks/useMotionCapability'
import { usePointerLook } from '../hooks/usePointerLook'
import { PART_REGISTRY } from '../parts/registry'
import { resolveAppearance, type Appearance } from '../parts/resolveAppearance'
import { resolveTheme, themeVars } from '../theme'
import type { Theme, ThemeName } from '../types'
import { Character } from './Character'
import { eyeAnchorsFor } from './eyeAnchors'
import { PORTRAIT_CROPS, type PortraitCropName } from './portraitCrops'

export interface CharacterPortraitProps extends Appearance {
  /** @default 'bust' */
  crop?: PortraitCropName
  theme?: ThemeName | Theme
  /** @default true */
  blink?: boolean
  /** Follow the pointer with the eyes. @default true */
  gaze?: boolean
  /** @default 1.35 */
  characterRenderTime?: number
  /** Draw the character in rather than showing it finished. @default true */
  animate?: boolean
  className?: string
  style?: CSSProperties
}

const SVG_STYLE: CSSProperties = { display: 'block', width: '100%', height: 'auto' }

/**
 * The character on its own: no room, no laptop, no scroll docking.
 * This is what a card, an avatar slot or a builder preview mounts.
 */
export const CharacterPortrait = ({
  crop = 'bust',
  theme,
  blink = true,
  gaze = true,
  characterRenderTime,
  animate = true,
  className,
  style,
  ...appearanceProps
}: CharacterPortraitProps) => {
  const boxRef = useRef<HTMLDivElement>(null)
  const restingLean = useRef(0)
  const svgRef = useRef<SVGSVGElement>(null)
  const faceRef = useRef<SVGGElement>(null)
  const leftPupil = useRef<SVGGElement>(null)
  const rightPupil = useRef<SVGGElement>(null)
  const browsN = useRef<SVGGElement>(null)
  const browsUp = useRef<SVGGElement>(null)
  const mouthN = useRef<SVGGElement>(null)
  const mouthO = useRef<SVGGElement>(null)

  const { reduced } = useMotionCapability()
  const appearance = useMemo(
    () => resolveAppearance(appearanceProps),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      appearanceProps.preset,
      appearanceProps.skinTone,
      appearanceProps.hair,
      appearanceProps.hairColor,
      appearanceProps.eyes,
      appearanceProps.mouth,
      appearanceProps.beard,
      appearanceProps.glasses,
    ],
  )

  const gazeRefs = useMemo(() => ({ svg: svgRef, face: faceRef, leftPupil, rightPupil }), [])
  const gazeAnchors = useMemo(
    () => eyeAnchorsFor(PART_REGISTRY.eyeStyles[appearance.eyes]),
    [appearance.eyes],
  )
  const gazeController = useGaze(gazeRefs, gazeAnchors)

  usePointerLook(gazeController, {
    enabled: gaze,
    moveFace: !reduced,
    docked: false,
    leanBase: restingLean,
    box: boxRef,
  })

  const { viewBox, aspect } = PORTRAIT_CROPS[crop]

  return (
    <div
      ref={boxRef}
      className={className}
      style={{ ...themeVars(resolveTheme(theme)), aspectRatio: aspect, ...style }}
      aria-hidden="true"
    >
      <Character
        refs={{
          svg: svgRef,
          face: faceRef,
          leftPupil,
          rightPupil,
          browsN,
          browsUp,
          mouthN,
          mouthO,
        }}
        appearance={appearance}
        blink={blink && !reduced}
        characterRenderTime={characterRenderTime}
        animate={animate && !reduced}
        viewBox={viewBox}
        svgStyle={SVG_STYLE}
      />
    </div>
  )
}
