import '@testing-library/jest-dom/vitest';

// jsdom has no IntersectionObserver; stub it so components that observe
// elements (countdown/count-up triggers, infinite scroll) don't throw.
class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// @ts-expect-error -- jsdom doesn't ship a real implementation
globalThis.IntersectionObserver = MockIntersectionObserver;

// jsdom has no matchMedia either; stub a "never matches" implementation.
window.matchMedia = (query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => false,
});
