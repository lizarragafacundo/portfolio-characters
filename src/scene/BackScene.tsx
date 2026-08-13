import { forwardRef } from 'react'
import { drawStroke, EASE_DRAW, fadeIn } from '../animation'

export const BackScene = forwardRef<SVGSVGElement, { viewBox: string }>(function BackScene(
  { viewBox },
  ref,
) {
  return (
    <svg
      ref={ref}
      viewBox={viewBox}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}
    >
      <defs>
        <pattern
          id="chHatch"
          width="9"
          height="9"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line x1="0" y1="0" x2="0" y2="9" stroke="var(--dc-tint)" strokeWidth="3" />
        </pattern>
        <clipPath id="chWin">
          <rect x="66" y="94" width="180" height="180" rx="8" />
        </clipPath>
      </defs>

      <rect
        x="0"
        y="215"
        width="900"
        height="215"
        fill="url(#chHatch)"
        data-fillel=""
        style={fadeIn(0.5, 0.02)}
      />

      <g>
        <rect
          x="63"
          y="91"
          width="186"
          height="186"
          rx="10"
          fill="var(--dc-fill)"
          data-fillel=""
          style={fadeIn(0.4, 0.2)}
        />

        <g clipPath="url(#chWin)">
          <g data-amb="" style={{ animation: 'chcloudA 34s linear infinite' }}>
            <path
              d="M96,138 C88,138 84,130 90,124 C90,113 104,109 112,116 C122,110 136,116 137,127 C147,127 150,138 141,138 Z"
              fill="var(--dc-tint)"
              stroke="var(--dc-ink)"
              strokeWidth="1.6"
              strokeOpacity="0.35"
              data-fillel=""
              style={fadeIn(0.5, 0.5)}
            />
          </g>
          <g data-amb="" style={{ animation: 'chcloudB 52s linear infinite' }}>
            <path
              d="M150,214 C142,214 139,206 145,201 C146,192 158,189 165,195 C174,190 185,196 186,205 C194,205 197,214 189,214 Z"
              fill="var(--dc-tint)"
              stroke="var(--dc-ink)"
              strokeWidth="1.4"
              strokeOpacity="0.28"
              data-fillel=""
              style={fadeIn(0.5, 0.58)}
            />
          </g>
        </g>

        <g stroke="var(--dc-ink)" fill="none" strokeLinecap="round">
          <rect
            x="63"
            y="91"
            width="186"
            height="186"
            rx="10"
            strokeWidth="3"
            pathLength={1}
            style={drawStroke(0.55, 0.08, EASE_DRAW)}
          />
          <path
            d="M157,93 C158,146 156,212 157,275"
            strokeWidth="2.6"
            pathLength={1}
            style={drawStroke(0.4, 0.3)}
          />
          <path
            d="M65,183 C120,181 194,185 247,183"
            strokeWidth="2.6"
            pathLength={1}
            style={drawStroke(0.4, 0.34)}
          />
          <path
            d="M84,156 C100,136 118,120 136,110 M96,172 C118,144 146,120 172,108"
            stroke="var(--dc-shade)"
            strokeWidth="3"
            pathLength={1}
            style={drawStroke(0.5, 0.42)}
          />
          <path
            d="M55,281 C120,277 196,283 257,279"
            strokeWidth="3"
            pathLength={1}
            style={drawStroke(0.4, 0.4)}
          />
        </g>
      </g>

      <g>
        <g data-fillel="" style={fadeIn(0.4, 0.6)}>
          <path d="M266,158 L300,152 L306,186 L272,192 Z" fill="var(--dc-tint)" />
          <path d="M312,150 L346,156 L340,190 L306,184 Z" fill="var(--dc-fill)" />
          <path
            d="M280,204 L314,198 L320,232 L286,238 Z"
            fill="var(--dc-shade)"
            fillOpacity="0.6"
          />
        </g>
        <g stroke="var(--dc-ink)" fill="none" strokeLinejoin="round" strokeLinecap="round">
          <path
            d="M266,158 L300,152 L306,186 L272,192 Z M312,150 L346,156 L340,190 L306,184 Z M280,204 L314,198 L320,232 L286,238 Z"
            strokeWidth="2.2"
            pathLength={1}
            style={drawStroke(0.7, 0.5)}
          />
          <path
            d="M272,166 L296,162 M273,173 L290,170 M318,160 L338,164 M319,167 L332,169 M286,212 L310,208 M287,219 L304,216 M288,226 L298,224"
            strokeWidth="1.8"
            opacity="0.55"
            pathLength={1}
            style={drawStroke(0.6, 0.7)}
          />
        </g>
      </g>

      <g>
        <g data-fillel="" style={fadeIn(0.45, 0.7)}>
          <path d="M624,154 L624,112 L640,112 L640,154 Z" fill="var(--dc-tint)" />
          <path d="M643,154 L643,106 L655,106 L655,154 Z" fill="var(--dc-shade)" />
          <path d="M658,154 L658,116 L676,116 L676,154 Z" fill="var(--dc-tint)" />
          <path d="M679,154 L679,103 L691,103 L691,154 Z" fill="var(--dc-shade)" />
          <path d="M694,154 L694,110 L712,110 L712,154 Z" fill="var(--dc-tint)" />
          <path d="M716,154 L732,110 L744,115 L728,154 Z" fill="var(--dc-shade)" />
          <path d="M750,154 L750,146 L796,146 L796,154 Z" fill="var(--dc-tint)" />
          <path d="M754,146 L754,139 L800,139 L800,146 Z" fill="var(--dc-shade)" />
          <path d="M752,139 L752,132 L794,132 L794,139 Z" fill="var(--dc-tint)" />
          <path d="M624,222 L624,174 L642,174 L642,222 Z" fill="var(--dc-shade)" />
          <path d="M645,222 L645,166 L657,166 L657,222 Z" fill="var(--dc-tint)" />
          <path d="M660,222 L660,178 L672,178 L672,222 Z" fill="var(--dc-shade)" />
          <path d="M675,222 L675,170 L695,170 L695,222 Z" fill="var(--dc-tint)" />
          <path d="M698,222 L698,182 L710,182 L710,222 Z" fill="var(--dc-shade)" />
          <path d="M714,222 L730,176 L744,181 L728,222 Z" fill="var(--dc-tint)" />
          <path d="M748,222 L748,213 L800,213 L800,222 Z" fill="var(--dc-shade)" />
          <path d="M752,213 L752,205 L804,205 L804,213 Z" fill="var(--dc-tint)" />
          <path d="M816,222 L814,206 L842,206 L840,222 Z" fill="var(--dc-tint)" />
          <path
            d="M810,152 C802,146 804,134 814,133 C816,124 832,124 833,134 C842,138 840,152 830,152 Z"
            fill="var(--dc-fill)"
          />
        </g>

        <g stroke="var(--dc-ink)" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M614,94 L858,94 M616,94 L616,226 M856,94 L856,226 M612,226 L860,226 M613,154 L859,154"
            strokeWidth="3.2"
            pathLength={1}
            style={drawStroke(0.6, 0.12, EASE_DRAW)}
          />
          <path
            d="M620,150 L852,150 M620,222 L852,222"
            strokeWidth="1.8"
            opacity="0.28"
            pathLength={1}
            style={drawStroke(0.5, 0.34)}
          />

          <g strokeWidth="2.3">
            <path
              d="M624,154 L624,112 L640,112 L640,154 M643,154 L643,106 L655,106 L655,154 M658,154 L658,116 L676,116 L676,154 M679,154 L679,103 L691,103 L691,154 M694,154 L694,110 L712,110 L712,154 M716,154 L732,110 L744,115 L728,154 Z"
              pathLength={1}
              style={drawStroke(0.6, 0.38)}
            />
            <path
              d="M750,154 L750,146 L796,146 L796,154 M754,146 L754,139 L800,139 L800,146 M752,139 L752,132 L794,132 L794,139"
              pathLength={1}
              style={drawStroke(0.5, 0.5)}
            />
            <path
              d="M624,222 L624,174 L642,174 L642,222 M645,222 L645,166 L657,166 L657,222 M660,222 L660,178 L672,178 L672,222 M675,222 L675,170 L695,170 L695,222 M698,222 L698,182 L710,182 L710,222 M714,222 L730,176 L744,181 L728,222 Z"
              pathLength={1}
              style={drawStroke(0.6, 0.48)}
            />
            <path
              d="M748,222 L748,213 L800,213 L800,222 M752,213 L752,205 L804,205 L804,213"
              pathLength={1}
              style={drawStroke(0.5, 0.58)}
            />
          </g>

          <g strokeWidth="1.7" opacity="0.5">
            <path
              d="M627,122 L637,122 M627,128 L637,128 M661,126 L673,126 M661,132 L673,132 M697,120 L709,120 M697,126 L709,126 M627,184 L639,184 M627,190 L639,190 M678,180 L692,180 M678,186 L692,186"
              pathLength={1}
              style={drawStroke(0.6, 0.68)}
            />
          </g>

          <g strokeWidth="2.2">
            <path
              d="M810,152 C802,146 804,134 814,133 C816,124 832,124 833,134 C842,138 840,152 830,152 Z"
              pathLength={1}
              style={drawStroke(0.5, 0.62)}
            />
            <path
              d="M833,131 C839,129 843,132 841,135 L847,136 L841,140"
              strokeLinejoin="round"
              pathLength={1}
              style={drawStroke(0.4, 0.74)}
            />
            <path
              d="M826,131 C825,130 823,130 823,132 C823,134 826,134 826,132"
              strokeWidth="1.8"
              pathLength={1}
              style={drawStroke(0.3, 0.8)}
            />
          </g>

          <g strokeWidth="2.2">
            <path
              d="M816,222 L814,206 L842,206 L840,222"
              pathLength={1}
              style={drawStroke(0.4, 0.66)}
            />
            <path
              d="M822,206 C817,197 821,187 828,190 M828,206 C828,193 835,187 839,192 M825,206 C824,199 820,195 816,197"
              strokeWidth="2"
              pathLength={1}
              style={drawStroke(0.5, 0.76)}
            />
          </g>
        </g>
      </g>
    </svg>
  )
})
