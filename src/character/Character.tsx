import { useMemo, type CSSProperties, type Ref } from 'react'
import { characterSpeedScale } from '../animation/primitiveTiming'
import type { ResolvedAppearance } from '../parts/resolveAppearance'
import { assembleCharacter, type CharacterLayers } from './assembleCharacter'
import { CHARACTER_TILT, CHARACTER_VIEW_BOX } from './characterLayers'
import { PrimitiveGroup } from './PrimitivePath'
import { HEAD_ROOM_CLIP_ID, TORSO_CLIP_ID, TORSO_CLIP_PATH } from './torso'

export interface CharacterRefs {
  svg: Ref<SVGSVGElement>
  face: Ref<SVGGElement>
  leftPupil: Ref<SVGGElement>
  rightPupil: Ref<SVGGElement>
  browsN: Ref<SVGGElement>
  browsUp: Ref<SVGGElement>
  mouthN: Ref<SVGGElement>
  mouthO: Ref<SVGGElement>
}

export interface CharacterProps {
  refs: CharacterRefs
  appearance: ResolvedAppearance
  blink?: boolean
  characterRenderTime?: number
  baseDelay?: number
  animate?: boolean
}

const BLINK_STYLE: CSSProperties = {
  transformBox: 'fill-box',
  transformOrigin: 'center',
  animation: 'chblink 5.4s ease-in-out infinite',
}

const HIDDEN: CSSProperties = { opacity: 0 }

const Layer = ({
  name,
  primitives,
  ...rest
}: { name: keyof CharacterLayers; primitives: CharacterLayers[keyof CharacterLayers] } & {
  clipPath?: string
}) => (
  <g data-fl={name} {...rest}>
    <PrimitiveGroup primitives={primitives} />
  </g>
)

export const Character = ({
  refs,
  appearance,
  blink = true,
  characterRenderTime,
  baseDelay = 0,
  animate = true,
}: CharacterProps) => {
  const { layers, expressions } = useMemo(
    () =>
      assembleCharacter({
        appearance,
        speedScale:
          characterRenderTime === undefined ? 1 : characterSpeedScale(characterRenderTime),
        baseDelay,
        animate,
      }),
    [appearance, characterRenderTime, baseDelay, animate],
  )

  const blinkProps = blink ? { 'data-amb': '', style: BLINK_STYLE } : {}

  return (
    <svg
      ref={refs.svg}
      viewBox={CHARACTER_VIEW_BOX}
      style={{ position: 'absolute', top: '-1.8%', left: '6%', width: '100%' }}
    >
      <defs>
        <clipPath id={HEAD_ROOM_CLIP_ID}>
          <rect x="-60" y="-60" width="560" height="617" />
        </clipPath>
        <clipPath id={TORSO_CLIP_ID}>
          <path d={TORSO_CLIP_PATH} />
        </clipPath>
      </defs>

      <g clipPath={`url(#${HEAD_ROOM_CLIP_ID})`}>
        <g transform={CHARACTER_TILT}>
          <Layer name="hairBack" primitives={layers.hairBack} />
          <Layer name="neck" primitives={layers.neck} />
          <Layer
            name="shirtFill"
            primitives={layers.shirtFill}
            clipPath={`url(#${TORSO_CLIP_ID})`}
          />
          <Layer name="shirtOutline" primitives={layers.shirtOutline} />

          <g ref={refs.face}>
            <Layer name="face" primitives={layers.face} />
            <Layer name="beard" primitives={layers.beard} />
            <Layer name="ears" primitives={layers.ears} />
            <Layer name="nose" primitives={layers.nose} />

            <g data-fl="mouth">
              <g ref={refs.mouthN}>
                <PrimitiveGroup primitives={layers.mouth} />
              </g>
              <g ref={refs.mouthO} style={HIDDEN}>
                <PrimitiveGroup primitives={expressions.mouthOpen} />
              </g>
            </g>

            <Layer name="eyeDecor" primitives={layers.eyeDecor} />

            <g data-fl="eyeLeft" {...blinkProps}>
              <g ref={refs.leftPupil}>
                <PrimitiveGroup primitives={layers.eyeLeft} />
              </g>
            </g>
            <g data-fl="eyeRight" {...blinkProps}>
              <g ref={refs.rightPupil}>
                <PrimitiveGroup primitives={layers.eyeRight} />
              </g>
            </g>

            <Layer name="glasses" primitives={layers.glasses} />

            <g data-fl="brows">
              <g ref={refs.browsN}>
                <PrimitiveGroup primitives={layers.brows} />
              </g>
              <g ref={refs.browsUp} style={HIDDEN}>
                <PrimitiveGroup primitives={expressions.browsRaised} />
              </g>
            </g>
          </g>

          <Layer name="hairFront" primitives={layers.hairFront} />
        </g>
      </g>
    </svg>
  )
}
