import { forwardRef } from 'react'
import { draw, EASE_DRAW, fill } from '../anim'

import type { LaptopTransform } from '../geometry'

export interface FrontSceneProps {
  viewBox: string
  laptop: LaptopTransform
}

export const FrontScene = forwardRef<SVGSVGElement, FrontSceneProps>(function FrontScene(
  { viewBox, laptop },
  ref,
) {
  return (
    <svg
      ref={ref}
      viewBox={viewBox}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'visible',
        pointerEvents: 'none',
      }}
    >
      <g stroke="var(--dc-ink)" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <g>
          <g
            data-amb=""
            style={{ transformOrigin: '157px 438px', animation: 'chsway 7s ease-in-out infinite' }}
          >
            <path
              d="M154,432 C132,420 112,400 108,376 C126,378 146,398 154,432 Z"
              fill="var(--dc-tint)"
              strokeWidth="2.6"
              pathLength={1}
              style={draw(0.55, 0.3)}
            />
            <path
              d="M156,432 C150,404 152,376 164,356 C174,378 172,410 160,432 Z"
              fill="var(--dc-fill)"
              strokeWidth="2.6"
              pathLength={1}
              style={draw(0.55, 0.34)}
            />
            <path
              d="M160,432 C180,418 200,400 206,378 C188,378 168,398 158,430 Z"
              fill="var(--dc-tint)"
              strokeWidth="2.6"
              pathLength={1}
              style={draw(0.55, 0.38)}
            />
            <path
              d="M154,434 C138,430 122,422 114,410 C128,406 144,414 154,430 Z"
              fill="var(--dc-shade)"
              fillOpacity="0.5"
              strokeWidth="2.4"
              pathLength={1}
              style={draw(0.5, 0.44)}
            />
            <path
              d="M160,434 C176,428 190,420 198,408 C184,404 168,414 160,430 Z"
              fill="var(--dc-shade)"
              fillOpacity="0.5"
              strokeWidth="2.4"
              pathLength={1}
              style={draw(0.5, 0.48)}
            />
            <path
              d="M155,430 C150,410 143,394 130,382 M157,430 C156,408 159,384 164,364 M159,430 C167,412 180,396 196,384"
              strokeWidth="1.8"
              opacity="0.45"
              pathLength={1}
              style={draw(0.6, 0.54)}
            />
          </g>
          <path
            d="M118,438 C140,444 174,444 196,438 C196,432 176,428 157,428 C138,428 118,432 118,438 Z"
            fill="var(--dc-fill)"
            strokeWidth="2.8"
            pathLength={1}
            style={draw(0.45, 0.16)}
          />
          <path
            d="M121,442 C124,462 128,478 133,483 C148,487 166,487 181,483 C186,478 190,462 193,442"
            fill="var(--dc-fill)"
            strokeWidth="3"
            pathLength={1}
            style={draw(0.5, 0.2)}
          />
          <path
            d="M124,456 C142,461 172,461 190,456"
            strokeWidth="2"
            opacity="0.4"
            pathLength={1}
            style={draw(0.4, 0.4)}
          />
        </g>

        <g>
          <path
            d="M219,442 C219,466 226,482 240,482 L258,482 C272,482 279,466 279,442"
            fill="var(--dc-fill)"
            strokeWidth="3"
            pathLength={1}
            style={draw(0.45, 0.2)}
          />
          <ellipse
            cx="249"
            cy="442"
            rx="30"
            ry="8"
            fill="var(--dc-fill)"
            strokeWidth="2.8"
            pathLength={1}
            style={draw(0.4, 0.24)}
          />
          <ellipse
            cx="249"
            cy="442.5"
            rx="23"
            ry="5.6"
            fill="var(--dc-ink)"
            fillOpacity="0.45"
            stroke="none"
            data-fillel=""
            style={fill(0.4, 0.5)}
          />
          <ellipse
            cx="243"
            cy="441"
            rx="7"
            ry="2"
            fill="var(--dc-fill)"
            fillOpacity="0.6"
            stroke="none"
            data-fillel=""
            style={fill(0.4, 0.62)}
          />
          <path
            d="M279,450 C298,449 302,472 283,475"
            strokeWidth="2.8"
            pathLength={1}
            style={draw(0.4, 0.38)}
          />
          <path
            d="M228,470 C240,474 258,474 270,470"
            strokeWidth="2"
            opacity="0.35"
            pathLength={1}
            style={draw(0.4, 0.46)}
          />

          <g opacity="0.65">
            <path
              d="M236,430 C230,420 238,412 232,402"
              strokeWidth="2.4"
              data-amb=""
              style={{
                transformOrigin: '236px 430px',
                animation: 'chsteam 3.4s ease-out infinite',
              }}
            />
            <path
              d="M250,430 C244,418 252,410 246,398"
              strokeWidth="2.4"
              data-amb=""
              style={{
                transformOrigin: '250px 430px',
                animation: 'chsteam 3.4s ease-out .9s infinite',
              }}
            />
            <path
              d="M262,430 C256,420 264,412 258,403"
              strokeWidth="2.2"
              data-amb=""
              style={{
                transformOrigin: '262px 430px',
                animation: 'chsteam 3.4s ease-out 1.8s infinite',
              }}
            />
          </g>
        </g>

        <g transform={laptop.group}>
          <rect
            x="605"
            y="297"
            width="232"
            height="163"
            rx="14"
            fill="var(--dc-fill)"
            fillOpacity="0.62"
            strokeWidth="3.6"
            pathLength={1}
            style={draw(0.55, 0.18, EASE_DRAW)}
          />
          <path
            d="M582,452 L860,452 L860,459 C860,472 850,482 837,482 L605,482 C592,482 582,472 582,459 Z"
            fill="var(--dc-ink)"
            stroke="var(--dc-ink)"
            strokeWidth="2"
            pathLength={1}
            style={draw(0.5, 0.12, EASE_DRAW)}
          />
        </g>

        <path
          d="M40,482 C280,474 620,490 862,480"
          strokeWidth="3.6"
          pathLength={1}
          style={draw(0.6, 0, EASE_DRAW)}
        />
        <path
          d="M104,496 C340,488 566,502 800,494"
          strokeWidth="2"
          opacity="0.32"
          pathLength={1}
          style={draw(0.6, 0.25)}
        />
      </g>
    </svg>
  )
})
