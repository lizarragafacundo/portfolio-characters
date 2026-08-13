import type { RenderablePrimitive } from '../parts/buildPrimitives'

export interface PrimitivePathProps {
  primitive: RenderablePrimitive
}

/**
 * The one place a primitive becomes a `<path>`.
 *
 * The two markers are load-bearing: the intro bake freezes `[pathLength]` by
 * clearing its dash offset and `[data-fillel]` by clearing its opacity, and the
 * redraw dock motion re-runs only the former.
 */
export const PrimitivePath = ({ primitive }: PrimitivePathProps) => (
  <path
    data-part={primitive.name}
    d={primitive.path}
    fill={primitive.fill}
    stroke={primitive.stroke}
    strokeWidth={primitive.strokeWidth}
    fillOpacity={primitive.fillOpacity}
    opacity={primitive.opacity}
    transform={primitive.transform}
    strokeDasharray={primitive.dashArray}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...(primitive.drawn ? { pathLength: 1 } : { 'data-fillel': '' })}
    style={primitive.style}
  />
)

export interface PrimitiveGroupProps {
  primitives: RenderablePrimitive[]
}

export const PrimitiveGroup = ({ primitives }: PrimitiveGroupProps) => (
  <>
    {primitives.map((primitive) => (
      <PrimitivePath key={primitive.name} primitive={primitive} />
    ))}
  </>
)
