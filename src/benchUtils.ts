// Shared helpers for the CodSpeed / Vitest benchmarks (`*.bench.ts`).

/**
 * Deterministic pseudo-random generator (mulberry32) so that benchmarks
 * relying on `Math.random` (e.g. mine placement) are reproducible.
 */
export function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Silence `console.log`: the application logs heavily and we do not want
 * console I/O to dominate the measurements.
 */
export function silenceConsole() {
  console.log = () => undefined;
}
