import type { Motion, MotionName } from './types'

export const MOTIONS = {
  Cascada: {
    stagger: 52,
    dur: 850,
    ease: 'cubic-bezier(.22,.85,.25,1)',
    from: (dx, dy) => `translate(${dx}px,${dy}px)`,
  },

  Barrido: {
    stagger: 0,
    dur: 680,
    ease: 'cubic-bezier(.2,.9,.2,1)',
    from: (dx, dy) => `translate(${dx}px,${dy}px)`,
  },

  Arco: {
    stagger: 40,
    dur: 980,
    ease: 'cubic-bezier(.36,-0.42,.28,1)',
    from: (dx, dy) => `translate(${dx}px,${dy}px)`,
  },

  Giro: {
    stagger: 34,
    dur: 900,
    ease: 'cubic-bezier(.2,.9,.25,1)',
    from: (dx, dy) => `translate(${dx}px,${dy}px) rotate(-24deg) scale(.6)`,
  },

  Rebote: {
    stagger: 24,
    dur: 820,
    ease: 'cubic-bezier(.34,1.62,.42,1)',
    from: (dx, dy) => `translate(${dx}px,${dy}px) scale(1.16)`,
  },

  Redibujado: {
    stagger: 46,
    dur: 620,
    ease: 'ease-out',
    redraw: true,
    from: (dx, dy) => `translate(${dx * 0.1}px,${dy * 0.1}px)`,
  },
} as const satisfies Record<MotionName, Motion>

export const resolveMotion = (name: MotionName | undefined): Motion => {
  return MOTIONS[name ?? 'Cascada'] ?? MOTIONS.Cascada
}
