import '@testing-library/jest-dom/vitest'

// jsdom ships its own matchMedia, and its resolution of features like
// prefers-reduced-motion is not consistent across platforms. Always install
// this deterministic stub rather than only filling a gap, so tests get the
// same "no preference" result everywhere.
window.matchMedia = ((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener: () => {},
  removeEventListener: () => {},
  addListener: () => {},
  removeListener: () => {},
  dispatchEvent: () => false,
})) as unknown as typeof window.matchMedia
