/**
 * Clears everything the dock transition and the appearance replay both write.
 * Each calls it before starting, so neither can inherit the other's half-finished
 * transforms.
 */
export const resetLayerGroups = (root: SVGSVGElement | null) => {
  if (!root) return []

  const groups = [...root.querySelectorAll<SVGGElement>('[data-fl]')]
  groups.forEach((group) => {
    group.style.animation = 'none'
    group.style.transition = 'none'
    group.style.clipPath = ''
    group.style.opacity = ''
    group.style.transform = ''
  })

  root.querySelectorAll<SVGElement>('[pathLength]').forEach((path) => {
    path.style.transition = 'none'
    path.style.strokeDasharray = ''
    path.style.strokeDashoffset = ''
  })

  return groups
}

export const forceReflow = (root: SVGSVGElement | null) => {
  root?.getBoundingClientRect()
}
