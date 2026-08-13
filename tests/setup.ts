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

// useMotionCapability treats <=4 cores as a low-end device and disables
// ambient animation. The test runner's real core count leaks in otherwise —
// it's 16 on a dev machine but as low as 2-4 on CI runners, which silently
// flips `lowEnd` and makes animation assertions fail only in CI.
Object.defineProperty(navigator, 'hardwareConcurrency', {
  value: 8,
  configurable: true,
})
