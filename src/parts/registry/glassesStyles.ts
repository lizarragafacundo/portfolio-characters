import type { GlassesId, GlassesStyle } from '../partTypes'

export const glassesStyles: Record<GlassesId, GlassesStyle> = {
  none: {
    lens: [],
    frame: [],
  },
  square: {
    lens: [
      {
        name: 'lensFill',
        path: 'M152,179 h48 a13,13 0 0 1 13,13 v29 a13,13 0 0 1 -13,13 h-48 a13,13 0 0 1 -13,-13 v-29 a13,13 0 0 1 13,-13 Z M241,179 h48 a13,13 0 0 1 13,13 v29 a13,13 0 0 1 -13,13 h-48 a13,13 0 0 1 -13,-13 v-29 a13,13 0 0 1 13,-13 Z',
        fill: 'fill',
        drawDelay: 1.4,
      },
    ],
    frame: [
      {
        name: 'frameOutline',
        path: 'M152,179 h48 a13,13 0 0 1 13,13 v29 a13,13 0 0 1 -13,13 h-48 a13,13 0 0 1 -13,-13 v-29 a13,13 0 0 1 13,-13 Z M241,179 h48 a13,13 0 0 1 13,13 v29 a13,13 0 0 1 -13,13 h-48 a13,13 0 0 1 -13,-13 v-29 a13,13 0 0 1 13,-13 Z',
        strokeWidth: 2.9,
        drawDelay: 1.42,
        drawDuration: 0.6,
      },
      {
        name: 'bridge',
        path: 'M213,198 C218,193 223,193 228,198',
        strokeWidth: 2.9,
        drawDelay: 1.6,
        drawDuration: 0.35,
      },
      {
        name: 'temples',
        path: 'M139,200 C128,200 118,206 114,216 M302,200 C313,200 323,206 327,216',
        strokeWidth: 2.4,
        drawDelay: 1.64,
        drawDuration: 0.4,
      },
    ],
  },
  round: {
    lens: [
      {
        name: 'lensFill',
        path: 'M145,206 a31,31 0 1,0 62,0 a31,31 0 1,0 -62,0 M235,206 a31,31 0 1,0 62,0 a31,31 0 1,0 -62,0',
        fill: 'fill',
        drawDelay: 1.4,
      },
    ],
    frame: [
      {
        name: 'frameOutline',
        path: 'M145,206 a31,31 0 1,0 62,0 a31,31 0 1,0 -62,0 M235,206 a31,31 0 1,0 62,0 a31,31 0 1,0 -62,0',
        strokeWidth: 2.9,
        drawDelay: 1.42,
        drawDuration: 0.6,
      },
      {
        name: 'bridge',
        path: 'M207,198 C212,192 230,192 235,198',
        strokeWidth: 2.9,
        drawDelay: 1.6,
        drawDuration: 0.35,
      },
      {
        name: 'temples',
        path: 'M146,198 C133,198 121,206 114,216 M296,198 C309,198 321,206 327,216',
        strokeWidth: 2.4,
        drawDelay: 1.64,
        drawDuration: 0.4,
      },
    ],
  },
  halfrim: {
    lens: [
      {
        name: 'lensFill',
        path: 'M152,179 h48 a13,13 0 0 1 13,13 v29 a13,13 0 0 1 -13,13 h-48 a13,13 0 0 1 -13,-13 v-29 a13,13 0 0 1 13,-13 Z M241,179 h48 a13,13 0 0 1 13,13 v29 a13,13 0 0 1 -13,13 h-48 a13,13 0 0 1 -13,-13 v-29 a13,13 0 0 1 13,-13 Z',
        fill: 'fill',
        fillOpacity: 0.8,
        drawDelay: 1.4,
      },
    ],
    frame: [
      {
        name: 'browBar',
        path: 'M139,198 v-6 a13,13 0 0 1 13,-13 h48 a13,13 0 0 1 13,13 v6 M228,198 v-6 a13,13 0 0 1 13,-13 h48 a13,13 0 0 1 13,13 v6',
        strokeWidth: 2.9,
        drawDelay: 1.42,
        drawDuration: 0.55,
      },
      {
        name: 'rimlessBase',
        path: 'M141,230 C158,235 194,235 211,229 M230,229 C247,235 283,235 300,230',
        strokeWidth: 1.4,
        opacity: 0.55,
        drawDelay: 1.66,
        drawDuration: 0.4,
      },
      {
        name: 'bridge',
        path: 'M213,193 C218,188 223,188 228,193',
        strokeWidth: 2.9,
        drawDelay: 1.6,
        drawDuration: 0.35,
      },
      {
        name: 'temples',
        path: 'M139,196 C128,196 118,204 114,216 M302,196 C313,196 323,204 327,216',
        strokeWidth: 2.4,
        drawDelay: 1.64,
        drawDuration: 0.4,
      },
    ],
  },
  sun: {
    lens: [],
    frame: [
      {
        name: 'lensTint',
        path: 'M152,179 h48 a13,13 0 0 1 13,13 v29 a13,13 0 0 1 -13,13 h-48 a13,13 0 0 1 -13,-13 v-29 a13,13 0 0 1 13,-13 Z M241,179 h48 a13,13 0 0 1 13,13 v29 a13,13 0 0 1 -13,13 h-48 a13,13 0 0 1 -13,-13 v-29 a13,13 0 0 1 13,-13 Z',
        fill: 'ink',
        fillOpacity: 0.85,
        drawDelay: 1.44,
      },
      {
        name: 'frameOutline',
        path: 'M152,179 h48 a13,13 0 0 1 13,13 v29 a13,13 0 0 1 -13,13 h-48 a13,13 0 0 1 -13,-13 v-29 a13,13 0 0 1 13,-13 Z M241,179 h48 a13,13 0 0 1 13,13 v29 a13,13 0 0 1 -13,13 h-48 a13,13 0 0 1 -13,-13 v-29 a13,13 0 0 1 13,-13 Z',
        strokeWidth: 2.9,
        drawDelay: 1.42,
        drawDuration: 0.6,
      },
      {
        name: 'lensGlint',
        path: 'M152,190 L178,224 M162,186 L186,218',
        stroke: 'fill',
        strokeWidth: 1.6,
        opacity: 0.5,
        drawDelay: 1.7,
        drawDuration: 0.4,
      },
      {
        name: 'bridge',
        path: 'M213,198 C218,193 223,193 228,198',
        strokeWidth: 2.9,
        drawDelay: 1.6,
        drawDuration: 0.35,
      },
      {
        name: 'temples',
        path: 'M139,200 C128,200 118,206 114,216 M302,200 C313,200 323,206 327,216',
        strokeWidth: 2.4,
        drawDelay: 1.64,
        drawDuration: 0.4,
      },
    ],
  },
  cateye: {
    lens: [
      {
        name: 'lensFill',
        path: 'M139,214 C136,192 146,180 166,178 C188,176 206,182 212,194 C216,206 210,226 196,232 C176,238 148,236 139,214 Z M302,214 C305,192 295,180 275,178 C253,176 235,182 229,194 C225,206 231,226 245,232 C265,238 293,236 302,214 Z',
        fill: 'fill',
        drawDelay: 1.4,
      },
    ],
    frame: [
      {
        name: 'frameOutline',
        path: 'M139,214 C136,192 146,180 166,178 C188,176 206,182 212,194 C216,206 210,226 196,232 C176,238 148,236 139,214 Z M302,214 C305,192 295,180 275,178 C253,176 235,182 229,194 C225,206 231,226 245,232 C265,238 293,236 302,214 Z',
        strokeWidth: 2.6,
        drawDelay: 1.42,
        drawDuration: 0.6,
      },
      {
        name: 'wingTips',
        path: 'M139,214 C130,208 124,198 124,188 C132,190 138,196 141,202 M302,214 C311,208 317,198 317,188 C309,190 303,196 300,202',
        strokeWidth: 2.2,
        drawDelay: 1.58,
        drawDuration: 0.4,
      },
      {
        name: 'bridge',
        path: 'M212,196 C215,190 226,190 229,196',
        strokeWidth: 2.6,
        drawDelay: 1.62,
        drawDuration: 0.35,
      },
      {
        name: 'temples',
        path: 'M126,192 C120,198 115,206 114,216 M315,192 C321,198 326,206 327,216',
        strokeWidth: 2.2,
        drawDelay: 1.66,
        drawDuration: 0.4,
      },
    ],
  },
}
