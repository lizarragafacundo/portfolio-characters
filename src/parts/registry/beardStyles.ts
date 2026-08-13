import type { BeardId, Primitive } from '../partTypes'

export const beardStyles: Record<BeardId, Primitive[]> = {
  none: [],
  stubble: [
    {
      name: 'stubbleFlecks',
      path: 'M154,300 C157,303 160,306 164,308 M174,326 C177,329 181,332 185,334 M204,344 C208,346 212,348 216,349 M236,348 C240,347 244,345 247,343 M262,330 C266,328 269,325 272,322 M282,304 C285,301 287,298 289,295',
      strokeWidth: 1.6,
      opacity: 0.5,
      drawDelay: 1.76,
      drawDuration: 0.5,
    },
  ],
  goatee: [
    {
      name: 'chinPatch',
      path: 'M198,332 C206,340 238,340 244,330 C250,350 238,364 220,366 C202,364 190,350 198,332 Z',
      fill: 'hair',
      stroke: 'ink',
      strokeWidth: 1.9,
      drawDelay: 1.74,
      drawDuration: 0.5,
    },
    {
      name: 'mustache',
      path: 'M194,285 C202,276 212,278 219,284 M246,285 C238,276 228,278 221,284',
      strokeWidth: 1.9,
      drawDelay: 1.84,
      drawDuration: 0.4,
    },
  ],
  full: [
    {
      name: 'beardShape',
      path: 'M118,238 C114,268 126,296 142,312 C160,340 186,360 220,366 C254,360 280,340 298,312 C314,296 326,268 322,238 C316,262 306,282 292,298 C280,322 254,336 220,338 C186,336 160,322 148,298 C134,282 124,262 118,238 Z',
      fill: 'hair',
      stroke: 'ink',
      strokeWidth: 2.2,
      drawDelay: 1.72,
      drawDuration: 0.6,
    },
    {
      name: 'mustache',
      path: 'M196,286 C204,277 214,279 220,285 M244,286 C236,277 226,279 220,285',
      strokeWidth: 1.9,
      drawDelay: 1.82,
      drawDuration: 0.4,
    },
    {
      name: 'cheekStrands',
      path: 'M166,320 C170,332 178,342 188,348 M274,320 C270,332 262,342 252,348',
      strokeWidth: 1.4,
      opacity: 0.5,
      drawDelay: 1.9,
      drawDuration: 0.4,
    },
  ],
  mustache: [
    {
      name: 'mustache',
      path: 'M192,286 C200,274 214,275 220,284 M248,286 C240,274 226,275 220,284',
      strokeWidth: 2.2,
      drawDelay: 1.7,
      drawDuration: 0.45,
    },
    {
      name: 'mustacheTips',
      path: 'M192,286 C188,291 183,291 180,287 M248,286 C252,291 257,291 260,287',
      strokeWidth: 1.9,
      drawDelay: 1.8,
      drawDuration: 0.35,
    },
  ],
}
