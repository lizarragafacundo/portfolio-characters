import '@testing-library/jest-dom/vitest'

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

Object.defineProperty(navigator, 'hardwareConcurrency', {
  value: 8,
  configurable: true,
})
