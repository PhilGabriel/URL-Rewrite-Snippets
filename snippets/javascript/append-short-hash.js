/**
 * Append a short, deterministic hash to a slug to prevent duplicate URLs.
 *
 * The hash is derived using a fast non-cryptographic algorithm (FNV-1a 32-bit).
 * It is URL-safe (lowercase hex characters only) and stable: the same input
 * always produces the same hash.  Pass a seed to differentiate slugs that
 * happen to have identical text (e.g. two articles with the same title).
 *
 * @param {string} slug  - The base slug (already processed, e.g. 'mein-artikel').
 * @param {{ length?: number, seed?: string | number }} [options]
 * @returns {string}
 *
 * @example
 * appendShortHash('mein-artikel')                  // 'mein-artikel-a1b2c3'
 * appendShortHash('mein-artikel', { length: 8 })   // 'mein-artikel-a1b2c3d4'
 * appendShortHash('mein-artikel', { seed: 42 })    // deterministic, different from seedless
 */
export function appendShortHash(slug, options = {}) {
  const { length = 6, seed = 0 } = options;

  const input = `${slug}::${seed}`;
  const hash = fnv1a32(input).toString(16).padStart(8, '0');
  const shortHash = hash.slice(0, length);

  return `${slug}-${shortHash}`;
}

/**
 * FNV-1a 32-bit hash.
 * Fast, non-cryptographic, deterministic.
 *
 * @param {string} str
 * @returns {number} Unsigned 32-bit integer.
 */
function fnv1a32(str) {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = (hash * 16777619) >>> 0;
  }
  return hash;
}
