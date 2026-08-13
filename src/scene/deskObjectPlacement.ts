import type { DeskObjectId } from '../parts/partTypes'

export type SceneLayerName = 'back' | 'front'

/** Fixtures of the room, drawn by the scene components rather than the registry. */
export type SceneFixtureId = 'window' | 'bookcase' | 'hatch' | 'plant' | 'coffee' | 'laptop'

export type SceneObjectId = SceneFixtureId | DeskObjectId

export type SceneObjects = Partial<Record<SceneObjectId, boolean>>

export const DEFAULT_SCENE_OBJECTS: Record<SceneObjectId, boolean> = {
  window: true,
  bookcase: true,
  hatch: true,
  plant: true,
  coffee: true,
  laptop: true,
  headphones: false,
  gamepad: false,
  cat: false,
  books: false,
  keyboard: false,
  polaroids: false,
}

/**
 * Which scene each optional object is painted into. Objects on the wall or the
 * shelf go behind the character; objects on the desk go in front of it.
 */
export const DESK_OBJECT_SCENE: Record<DeskObjectId, SceneLayerName> = {
  cat: 'back',
  polaroids: 'back',
  books: 'front',
  keyboard: 'front',
  headphones: 'front',
  gamepad: 'front',
}

export const resolveSceneObjects = (objects: SceneObjects | undefined) => ({
  ...DEFAULT_SCENE_OBJECTS,
  ...objects,
})

export const deskObjectsIn = (
  scene: SceneLayerName,
  enabled: Record<SceneObjectId, boolean>,
): DeskObjectId[] =>
  (Object.keys(DESK_OBJECT_SCENE) as DeskObjectId[]).filter(
    (id) => DESK_OBJECT_SCENE[id] === scene && enabled[id],
  )
