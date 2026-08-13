import { PrimitiveGroup } from '../character/PrimitivePath'
import { buildPrimitives } from '../parts/buildPrimitives'
import { NEUTRAL_PALETTE } from '../parts/colorTokens'
import { deskObjects } from '../parts/registry'
import { deskObjectsIn, type SceneLayerName, type SceneObjectId } from './deskObjectPlacement'

export interface DeskObjectLayerProps {
  scene: SceneLayerName
  enabled: Record<SceneObjectId, boolean>
}

/**
 * Optional objects live outside the `[data-fl]` set: they belong to the room,
 * so they fade with it when the character docks and must never be caught by the
 * dock stagger or the appearance replay.
 */
export const DeskObjectLayer = ({ scene, enabled }: DeskObjectLayerProps) => {
  const chosen = deskObjectsIn(scene, enabled)
  if (chosen.length === 0) return null

  return (
    <g data-desk-objects={scene}>
      {chosen.map((id) => (
        <g key={id} data-object={id}>
          <PrimitiveGroup
            primitives={buildPrimitives(deskObjects[id], { palette: NEUTRAL_PALETTE })}
          />
        </g>
      ))}
    </g>
  )
}
