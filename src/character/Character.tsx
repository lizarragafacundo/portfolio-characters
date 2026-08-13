import type { Ref } from 'react'
import { draw, EASE_DRAW, fill } from '../anim'
import type { Persona } from '../types'

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
  glasses?: Persona['glasses']
  hair?: Persona['hair']
  blink?: boolean
}

const Eye = ({ cx }: { cx: number }) => (
  <>
    <circle
      cx={cx}
      cy="212"
      r="7"
      fill="none"
      stroke="var(--dc-ink)"
      strokeWidth="2.6"
      pathLength={1}
      style={draw(0.4, 1.62)}
    />
    <circle cx={cx} cy="212" r="2.6" fill="var(--dc-ink)" data-fillel="" style={fill(0.3, 1.72)} />
  </>
)

export const Character = ({
  refs,
  glasses = true,
  hair = 'short',
  blink = true,
}: CharacterProps) => {
  return (
    <svg
      ref={refs.svg}
      viewBox="0 0 440 620"
      style={{ position: 'absolute', top: '-1.8%', left: '6%', width: '100%' }}
    >
      <defs>
        <clipPath id="chTorso">
          <rect x="-60" y="-60" width="560" height="617" />
        </clipPath>
        <clipPath id="chTee">
          <path d="M52,585 C48,516 86,486 140,464 C168,451 184,443 190,431 C199,452 244,452 250,429 C258,441 288,451 320,465 C378,487 398,518 394,585 L394,600 L52,600 Z" />
        </clipPath>
      </defs>

      <g clipPath="url(#chTorso)">
        <g transform="rotate(-2.2 220 300)">
          <g data-fl="hairback">
            <path
              d="M124,196 C112,162 116,124 134,100 C150,74 178,58 208,54 C214,42 224,46 230,38 C238,48 248,42 254,52 C266,44 276,50 278,60 C302,68 318,86 326,110 C334,132 332,160 328,186 C316,164 296,150 272,146 C242,140 210,142 184,150 C160,158 138,172 128,190 Z"
              fill="var(--dc-shade)"
              transform="translate(8 7)"
              data-fillel=""
              style={fill(0.5, 1.5)}
            />
            {hair === 'long' ? (
              <path
                d="M126,180 C114,240 116,300 130,352 C142,344 146,300 142,254 M322,176 C334,236 332,296 318,348 C306,340 302,296 306,250"
                fill="var(--dc-shade)"
                stroke="var(--dc-ink)"
                strokeWidth="3"
                strokeLinejoin="round"
                pathLength={1}
                style={draw(0.6, 1.55)}
              />
            ) : null}
          </g>

          <g data-fl="neck">
            <path
              d="M186,318 C188,352 185,396 189,439 L253,439 C256,396 252,352 254,316 Z"
              fill="var(--dc-fill)"
              data-fillel=""
              style={fill(0.4, 1.4)}
            />
            <path
              d="M204,340 C216,356 236,356 248,338 C244,364 208,364 204,340 Z"
              fill="var(--dc-shade)"
              data-fillel=""
              style={fill(0.4, 1.7)}
            />
            <g fill="none" stroke="var(--dc-ink)" strokeWidth="3" strokeLinecap="round">
              <path d="M187,330 C189,358 186,400 190,439" pathLength={1} style={draw(0.5, 1.42)} />
              <path d="M253,326 C251,356 254,400 250,439" pathLength={1} style={draw(0.5, 1.42)} />
            </g>
          </g>

          <g data-fl="teefill" clipPath="url(#chTee)">
            <path
              d="M52,580 C48,516 86,486 140,464 C168,451 184,443 190,431 L250,429 C258,441 288,451 320,465 C378,487 398,518 394,580 C330,558 286,576 232,562 C176,550 118,570 52,566 Z"
              fill="var(--dc-shade)"
              data-fillel=""
              style={fill(0.5, 1.95)}
            />
          </g>
          <g
            data-fl="tee"
            fill="none"
            stroke="var(--dc-ink)"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              d="M190,431 C200,453 244,453 250,429 C247,463 193,463 190,431 Z"
              fill="var(--dc-fill)"
              strokeWidth="3.2"
              pathLength={1}
              style={draw(0.5, 1.6)}
            />
            <path
              d="M52,585 C48,516 86,486 140,464 C168,451 184,443 190,431"
              strokeWidth="3.4"
              pathLength={1}
              style={draw(0.7, 1.62, EASE_DRAW)}
            />
            <path
              d="M250,429 C258,441 288,451 320,465 C378,487 398,518 394,585"
              strokeWidth="3.4"
              pathLength={1}
              style={draw(0.7, 1.62, EASE_DRAW)}
            />
            <path
              d="M74,542 C128,528 180,550 236,538 C292,528 338,548 374,536"
              strokeWidth="3"
              opacity="0.85"
              pathLength={1}
              style={draw(0.8, 1.86)}
            />
            <path
              d="M142,466 C158,480 164,504 161,534 M334,486 C324,500 320,518 322,538"
              strokeWidth="2.2"
              opacity="0.5"
              pathLength={1}
              style={draw(0.6, 2)}
            />
          </g>

          <g ref={refs.face}>
            <g data-fl="face">
              <path
                d="M292,178 C308,212 306,272 286,308 C299,272 301,220 292,178 Z"
                fill="var(--dc-shade)"
                data-fillel=""
                style={fill(0.5, 1.7)}
              />
              <path
                d="M120,152 C119,127 176,109 220,110 C263,109 321,127 320,152 C331,177 330,198 330,218 C331,257 320,290 300,310 C283,338 257,359 220,366 C185,359 157,337 140,310 C119,289 110,257 110,218 C109,198 111,177 120,152 Z"
                fill="var(--dc-fill)"
                stroke="var(--dc-ink)"
                strokeWidth="3.4"
                strokeLinejoin="round"
                pathLength={1}
                style={draw(0.7, 0.95, EASE_DRAW)}
              />
            </g>

            <g data-fl="ears">
              <path
                d="M114,218 C100,216 94,234 102,250 C108,262 120,260 124,252"
                fill="var(--dc-fill)"
                stroke="var(--dc-ink)"
                strokeWidth="3"
                strokeLinejoin="round"
                pathLength={1}
                style={draw(0.45, 1.22)}
              />
              <path
                d="M326,218 C340,216 346,234 338,250 C332,262 320,260 316,252"
                fill="var(--dc-fill)"
                stroke="var(--dc-ink)"
                strokeWidth="3"
                strokeLinejoin="round"
                pathLength={1}
                style={draw(0.45, 1.22)}
              />
              <path
                d="M110,234 C104,236 104,244 110,244 C114,244 114,238 111,238"
                fill="none"
                stroke="var(--dc-ink)"
                strokeWidth="2"
                strokeLinecap="round"
                pathLength={1}
                style={draw(0.4, 1.4)}
              />
              <path
                d="M330,234 C336,236 336,244 330,244 C326,244 326,238 329,238"
                fill="none"
                stroke="var(--dc-ink)"
                strokeWidth="2"
                strokeLinecap="round"
                pathLength={1}
                style={draw(0.4, 1.4)}
              />
            </g>

            <g data-fl="nose">
              <path
                d="M232,206 C236,224 239,236 244,244 C240,250 234,251 229,249 C238,242 235,222 232,206 Z"
                fill="var(--dc-shade)"
                data-fillel=""
                style={fill(0.4, 1.78)}
              />
              <path
                d="M228,196 C232,218 236,234 244,246 C240,254 230,255 222,250"
                fill="none"
                stroke="var(--dc-ink)"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                style={draw(0.5, 1.56)}
              />
            </g>

            <g data-fl="mouth">
              <g ref={refs.mouthN}>
                <path
                  d="M194,296 C210,306 236,304 252,292"
                  fill="none"
                  stroke="var(--dc-ink)"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  pathLength={1}
                  style={draw(0.45, 1.68)}
                />
                <path
                  d="M206,318 C216,322 230,322 240,318"
                  fill="none"
                  stroke="var(--dc-ink)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  opacity="0.6"
                  pathLength={1}
                  style={draw(0.4, 1.76)}
                />
              </g>
              <g ref={refs.mouthO} style={{ opacity: 0 }}>
                <path
                  d="M208,296 C214,288 232,288 238,296 C236,308 212,308 208,296 Z"
                  fill="var(--dc-shade)"
                  stroke="var(--dc-ink)"
                  strokeWidth="2.8"
                  strokeLinejoin="round"
                />
                <path
                  d="M204,318 C214,323 230,323 242,317"
                  fill="none"
                  stroke="var(--dc-ink)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  opacity="0.55"
                />
              </g>
            </g>

            <g data-fl="lids">
              <rect
                x="139"
                y="179"
                width="74"
                height="55"
                rx="13"
                fill="var(--dc-fill)"
                data-fillel=""
                style={fill(0.4, 1.4)}
              />
              <rect
                x="228"
                y="179"
                width="74"
                height="55"
                rx="13"
                fill="var(--dc-fill)"
                data-fillel=""
                style={fill(0.4, 1.4)}
              />
              <rect
                x="143"
                y="182"
                width="66"
                height="16"
                rx="8"
                fill="var(--dc-shade)"
                data-fillel=""
                style={fill(0.4, 1.68)}
              />
              <rect
                x="232"
                y="182"
                width="66"
                height="16"
                rx="8"
                fill="var(--dc-shade)"
                data-fillel=""
                style={fill(0.4, 1.68)}
              />
            </g>

            <g
              data-fl="eyeL"
              {...(blink ? { 'data-amb': '' } : {})}
              style={
                blink
                  ? {
                      transformBox: 'fill-box',
                      transformOrigin: 'center',
                      animation: 'chblink 5.4s ease-in-out infinite',
                    }
                  : undefined
              }
            >
              <g ref={refs.leftPupil}>
                <Eye cx={175} />
              </g>
            </g>
            <g
              data-fl="eyeR"
              {...(blink ? { 'data-amb': '' } : {})}
              style={
                blink
                  ? {
                      transformBox: 'fill-box',
                      transformOrigin: 'center',
                      animation: 'chblink 5.4s ease-in-out infinite',
                    }
                  : undefined
              }
            >
              <g ref={refs.rightPupil}>
                <Eye cx={265} />
              </g>
            </g>

            {glasses ? (
              <g
                data-fl="glasses"
                fill="none"
                stroke="var(--dc-ink)"
                strokeLinejoin="round"
                strokeLinecap="round"
              >
                <rect
                  x="139"
                  y="179"
                  width="74"
                  height="55"
                  rx="13"
                  strokeWidth="4"
                  pathLength={1}
                  style={draw(0.6, 1.42, EASE_DRAW)}
                />
                <rect
                  x="228"
                  y="179"
                  width="74"
                  height="55"
                  rx="13"
                  strokeWidth="4"
                  pathLength={1}
                  style={draw(0.6, 1.42, EASE_DRAW)}
                />
                <path
                  d="M213,198 C218,193 223,193 228,198"
                  strokeWidth="4"
                  pathLength={1}
                  style={draw(0.35, 1.6)}
                />
                <path
                  d="M139,200 C128,200 118,206 114,216 M302,200 C313,200 323,206 327,216"
                  strokeWidth="3.4"
                  pathLength={1}
                  style={draw(0.4, 1.64)}
                />
              </g>
            ) : null}

            <g data-fl="brows">
              <g ref={refs.browsN}>
                <path
                  d="M144,172 C160,160 186,157 210,164 C210,172 205,176 199,174 C182,168 166,170 152,180 Z"
                  fill="var(--dc-ink)"
                  data-fillel=""
                  style={fill(0.35, 1.74)}
                />
                <path
                  d="M232,160 C252,148 278,148 296,160 C296,168 291,172 285,169 C270,160 252,160 240,168 Z"
                  fill="var(--dc-ink)"
                  data-fillel=""
                  style={fill(0.35, 1.78)}
                />
              </g>
              <g ref={refs.browsUp} style={{ opacity: 0 }}>
                <path
                  d="M142,158 C158,142 186,138 212,148 C211,157 206,161 200,158 C182,150 164,153 150,166 Z"
                  fill="var(--dc-ink)"
                />
                <path
                  d="M230,146 C250,130 278,130 298,144 C297,153 292,157 286,153 C270,142 252,143 238,154 Z"
                  fill="var(--dc-ink)"
                />
              </g>
            </g>
          </g>

          <g data-fl="hair">
            <path
              d="M122,192 C112,160 114,124 132,100 C148,76 176,60 206,56 C210,44 220,48 226,40 C234,50 244,44 250,54 C262,46 272,52 274,62 C298,70 314,88 322,110 C330,130 330,158 326,182 C316,160 298,148 274,144 C244,138 212,140 186,148 C162,154 140,168 130,186 C127,192 124,196 122,192 Z"
              fill="none"
              stroke="var(--dc-ink)"
              strokeWidth="3.4"
              strokeLinejoin="round"
              pathLength={1}
              style={draw(0.85, 1.05, EASE_DRAW)}
            />
            <path
              d="M322,116 C310,140 292,152 268,156 C292,158 312,150 324,134"
              fill="none"
              stroke="var(--dc-ink)"
              strokeWidth="2.6"
              strokeLinecap="round"
              pathLength={1}
              style={draw(0.5, 1.38)}
            />
            <path
              d="M170,118 C196,94 238,88 272,100"
              fill="none"
              stroke="var(--dc-ink)"
              strokeWidth="2.6"
              strokeLinecap="round"
              pathLength={1}
              style={draw(0.5, 1.42)}
            />
            <path
              d="M150,150 C170,134 196,128 220,128"
              fill="none"
              stroke="var(--dc-ink)"
              strokeWidth="2.2"
              strokeLinecap="round"
              opacity="0.75"
              pathLength={1}
              style={draw(0.5, 1.48)}
            />
            <path
              d="M116,198 C113,216 115,230 122,240"
              fill="none"
              stroke="var(--dc-ink)"
              strokeWidth="2.8"
              strokeLinecap="round"
              pathLength={1}
              style={draw(0.4, 1.5)}
            />
            <path
              d="M326,192 C328,208 326,222 320,234"
              fill="none"
              stroke="var(--dc-ink)"
              strokeWidth="2.8"
              strokeLinecap="round"
              pathLength={1}
              style={draw(0.4, 1.5)}
            />
          </g>
        </g>
      </g>
    </svg>
  )
}
