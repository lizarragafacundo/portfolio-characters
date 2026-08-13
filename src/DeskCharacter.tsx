'use client'

import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type RefObject,
} from 'react'
import { Character } from './character/Character'
import { eyeAnchorsFor } from './character/eyeAnchors'
import { VARIANTS } from './geometry'
import { PART_REGISTRY } from './parts/registry'
import { resolveAppearance } from './parts/resolveAppearance'
import { useAmbient, useBake } from './hooks/useBake'
import { useDockOnScroll } from './hooks/useDockOnScroll'
import { useGaze } from './hooks/useGaze'
import { usePointerLook } from './hooks/usePointerLook'
import { useMotionCapability } from './hooks/useReducedMotion'
import { useSectionGaze } from './hooks/useSectionGaze'
import { resolveMotion } from './motions'
import { BackScene } from './scene/BackScene'
import { FrontScene } from './scene/FrontScene'
import { Terminal } from './terminal/Terminal'
import { useTerminalScript } from './terminal/useTerminalScript'
import { resolveTheme, themeVars } from './theme'
import type { DeskCharacterProps } from './types'

const CHAR_WIDTH = 440

const DOCK_LEAN = -7

export const DeskCharacter = ({
  persona,
  theme = 'light',
  dockMotion = 'Cascada',
  ambient = true,
  terminal = true,
  blink = true,
  variant = 'scene',
  dock = true,
  gazeSelector,
  dockAt = 0.92,
  undockAt = 0.55,
  className,
  children,
}: DeskCharacterProps) => {
  const heroRef = useRef<HTMLElement & HTMLDivElement>(null)
  const charBox = useRef<HTMLDivElement>(null)
  const cropRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const sceneBack = useRef<SVGSVGElement>(null)
  const sceneFront = useRef<SVGSVGElement>(null)
  const termRef = useRef<HTMLDivElement>(null)
  const faceRef = useRef<SVGGElement>(null)
  const leftPupil = useRef<SVGGElement>(null)
  const rightPupil = useRef<SVGGElement>(null)
  const browsN = useRef<SVGGElement>(null)
  const browsUp = useRef<SVGGElement>(null)
  const mouthN = useRef<SVGGElement>(null)
  const mouthO = useRef<SVGGElement>(null)

  const { reduced, lowEnd } = useMotionCapability()
  const resolved = resolveTheme(theme)
  const geometry = VARIANTS[variant]

  const bake = useBake([svgRef, sceneBack, sceneFront], { immediate: reduced })
  useAmbient([svgRef, sceneBack, sceneFront, termRef], ambient && !lowEnd)

  const step = useTerminalScript(persona.script, {
    enabled: terminal,
    reducedMotion: reduced,
  })

  const beforeRect = useRef<DOMRect | null>(null)
  const leanBase = useRef(0)

  const onProgress = useCallback((p: number) => {
    for (const ref of [sceneBack, sceneFront, termRef]) {
      const el = ref.current
      if (!el) continue
      el.style.opacity = String(1 - p)
      el.style.transform = `translate3d(0,${p * -44}px,0)`
    }
  }, [])

  const onBeforeFlip = useCallback(() => {
    beforeRect.current = cropRef.current?.getBoundingClientRect() ?? null
  }, [])

  const { docked, first } = useDockOnScroll({
    hero: heroRef,
    enabled: dock,
    dockAt,
    undockAt,
    onProgress,
    onBeforeFlip,
  })

  const appearance = useMemo(() => resolveAppearance(persona.appearance), [persona.appearance])

  const gazeRefs = useMemo(() => ({ svg: svgRef, face: faceRef, leftPupil, rightPupil }), [])
  const gazeAnchors = useMemo(
    () => eyeAnchorsFor(PART_REGISTRY.eyeStyles[appearance.eyes]),
    [appearance.eyes],
  )
  const gaze = useGaze(gazeRefs, gazeAnchors)

  usePointerLook(gaze, { enabled: true, moveFace: !reduced, docked, leanBase, box: charBox })
  useSectionGaze(gaze, { selector: gazeSelector, enabled: !reduced })

  const setExpression = useCallback((isDocked: boolean) => {
    const swap = (el: SVGGElement | null, on: boolean) => {
      if (!el) return
      el.style.transition = 'opacity .35s ease'
      el.style.opacity = on ? '1' : '0'
    }
    swap(browsN.current, !isDocked)
    swap(browsUp.current, isDocked)
    swap(mouthN.current, !isDocked)
    swap(mouthO.current, isDocked)
  }, [])

  const setLean = useCallback((deg: number) => {
    leanBase.current = deg
    const el = charBox.current
    if (!el) return
    el.style.transition = 'transform .6s cubic-bezier(.3,.9,.3,1)'
    el.style.transform = `rotate(${deg}deg)`
  }, [])

  useLayoutEffect(() => {
    if (first.current) {
      first.current = false
      setExpression(docked)
      setLean(docked ? DOCK_LEAN : 0)
      return
    }

    const crop = cropRef.current
    const svg = svgRef.current
    const box = charBox.current
    if (!crop || !svg || !box) return

    box.style.transition = 'none'
    box.style.transform = 'none'

    bake()

    const before = beforeRect.current
    const after = crop.getBoundingClientRect()

    if (!before || !after.width) {
      setExpression(docked)
      setLean(docked ? DOCK_LEAN : 0)
      return
    }

    const k = CHAR_WIDTH / after.width
    const dx = (before.left - after.left) * k
    const dy = (before.top - after.top) * k

    const cfg = resolveMotion(dockMotion)
    const groups = Array.from(svg.querySelectorAll<SVGGElement>('[data-fl]'))
    const stagger = lowEnd ? Math.min(cfg.stagger, 18) : cfg.stagger
    const dur = reduced ? 1 : cfg.dur

    for (const g of groups) {
      g.style.transition = 'none'
      g.style.transformBox = 'fill-box'
      g.style.transformOrigin = 'center'
      g.style.transform = cfg.from(dx, dy)

      if (cfg.redraw) {
        g.style.opacity = '0'
        g.querySelectorAll<SVGElement>('[pathLength]').forEach((el) => {
          el.style.transition = 'none'
          el.style.strokeDashoffset = '1'
        })
      }
    }

    void svg.getBoundingClientRect()

    let raf = 0
    let fallback = 0
    let released = false
    const release = () => {
      if (released) return
      released = true

      groups.forEach((g, i) => {
        const delay = i * stagger
        g.style.transition = `transform ${dur}ms ${cfg.ease} ${delay}ms, opacity ${dur}ms ease ${delay}ms`
        g.style.transform = 'translate(0px,0px)'

        if (cfg.redraw) {
          g.style.opacity = '1'
          g.querySelectorAll<SVGElement>('[pathLength]').forEach((el) => {
            el.style.transition = `stroke-dashoffset ${dur + 240}ms ease-out ${delay}ms`
            el.style.strokeDashoffset = '0'
          })
        }
      })
    }

    raf = requestAnimationFrame(() => {
      raf = requestAnimationFrame(release)
    })
    fallback = window.setTimeout(release, 34)

    setExpression(docked)
    setLean(docked ? DOCK_LEAN : 0)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(fallback)
    }
  }, [docked, dockMotion, lowEnd, reduced, bake, first, setExpression, setLean])

  const charBoxStyle: CSSProperties = docked
    ? {
        position: 'fixed',
        right: 'clamp(8px,2vw,28px)',
        bottom: 0,
        width: 'clamp(190px,25vw,300px)',
        zIndex: 60,
        pointerEvents: 'none',
        transformOrigin: '80% 100%',
      }
    : {
        position: 'absolute',
        left: geometry.character.left,
        top: geometry.character.top,
        width: geometry.character.width,
        pointerEvents: 'none',
        transformOrigin: '50% 100%',
      }

  const cropStyle = {
    position: 'relative',
    width: '100%',
    aspectRatio: docked ? '440/560' : '440/620',
    overflow: docked ? 'hidden' : undefined,
  } as const

  const stage = (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <BackScene ref={sceneBack} viewBox={geometry.viewBox} />

      <div ref={charBox} style={charBoxStyle}>
        <div ref={cropRef} style={cropStyle}>
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
            blink={blink}
          />
        </div>
      </div>

      <FrontScene ref={sceneFront} viewBox={geometry.viewBox} laptop={geometry.laptop} />

      <Terminal
        ref={termRef}
        script={persona.script}
        step={step}
        geometry={geometry}
        hidden={!terminal}
      />
    </div>
  )

  return (
    <div
      className={['dc-scene', className].filter(Boolean).join(' ')}
      aria-hidden="true"
      style={{
        ...themeVars(resolved),
        background: 'var(--dc-bg)',
        overflowX: 'clip',
        ...(variant === 'scene' ? { minHeight: '100vh' } : null),
      }}
    >
      {variant === 'scene' ? (
        <section
          ref={heroRef as RefObject<HTMLElement>}
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 'min(980px, 132vh)',
              aspectRatio: geometry.aspect,
            }}
          >
            {stage}
          </div>
        </section>
      ) : (
        <div
          ref={heroRef as RefObject<HTMLDivElement>}
          style={{ position: 'relative', width: '100%', aspectRatio: geometry.aspect }}
        >
          {stage}
        </div>
      )}

      {children}
    </div>
  )
}
